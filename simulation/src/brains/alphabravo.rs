//! Goal-side pressure from alpha, strike planning from bravo, and safe retreat paths.
//! Alpha supplies the flight controller. This module owns ground tactics and role selection.
use super::{
    Brain, Context, Params,
    alpha::{ATTACK, Alpha, Bot, GOALIE, Maneuver, SUPPORT, Settings},
};
use crate::{
    car::{Car, Controls},
    math::{atan2, clamp, cos, hypot2, sin},
    predictor::Slice,
    vector::Vec3,
};

#[derive(Clone, Debug)]
struct AlphaBravo {
    team: usize,
    bots: Vec<Bot>,
    previous: Option<usize>,
    recovering: Vec<bool>,
    shotzone: f64,
}

pub fn create(params: &mut Params, team: usize, cars: &[usize]) -> Result<Box<dyn Brain>, String> {
    let settings = Settings::from_params(params)?;
    Ok(Box::new(AlphaBravo {
        team,
        bots: cars.iter().map(|&id| Bot::new(id, settings)).collect(),
        previous: None,
        recovering: vec![false; cars.len()],
        shotzone: params.number("shotzone", 1500.0)?,
    }))
}

impl Brain for AlphaBravo {
    fn tick(&mut self, ctx: &Context, out: &mut [Controls]) {
        let w = ctx.world;
        let d = if self.team == 0 { 1.0 } else { -1.0 };
        let ball = w.ball.pos;
        let kickoff = !w.ball_touched
            && w.ball.vel.length_sq() < 1.0
            && ball.x.abs() < 1.0
            && ball.y.abs() < 1.0;
        let cost = |id: usize| {
            let c = &w.cars[id];
            if c.is_demoed || c.frozen {
                return f64::INFINITY;
            }
            c.pos.distance(ball) + ((c.pos.y - ball.y) * d).max(0.0) * 1.5
                - if !kickoff && self.previous == Some(id) {
                    150.0
                } else {
                    0.0
                }
        };
        let mut attack = self
            .bots
            .iter()
            .min_by(|a, b| cost(a.car).total_cmp(&cost(b.car)))
            .map(|b| (b.car, cost(b.car)));
        if let Some(id) = ctx.player.filter(|&id| w.cars[id].team == self.team) {
            let value = cost(id);
            if attack.is_none_or(|(_, best)| value < best) {
                attack = Some((id, value));
            }
        }
        self.previous = attack.map(|(id, _)| id);
        let count = self.bots.len()
            + usize::from(ctx.player.is_some_and(|id| w.cars[id].team == self.team));
        let deep = self
            .bots
            .iter()
            .map(|b| b.car)
            .chain(ctx.player.filter(|&id| w.cars[id].team == self.team))
            .filter(|&id| Some(id) != self.previous && !w.cars[id].is_demoed)
            .min_by(|&a, &b| (w.cars[a].pos.y * d).total_cmp(&(w.cars[b].pos.y * d)));

        for (i, (bot, output)) in self.bots.iter_mut().zip(out).enumerate() {
            let c = &w.cars[bot.car];
            bot.role = if Some(bot.car) == self.previous {
                ATTACK
            } else if count >= 3 && bot.settings.roles == 1 && Some(bot.car) == deep {
                GOALIE
            } else {
                SUPPORT
            };
            if c.frozen || c.is_demoed {
                *output = Controls::default();
                bot.out = *output;
                continue;
            }
            if kickoff || !c.is_on_ground || c.up.z < 0.7 || !matches!(bot.maneuver, Maneuver::None)
            {
                *output = bot.tick(w, ctx.predictor);
                continue;
            }
            bot.kickoff_flip_done = false;
            let own_goal = Vec3::new(0.0, -d * 5120.0, 0.0);
            let goal_side = (c.pos.y - ball.y) * d < 0.0;
            let pressure = goal_side
                && ball.distance(own_goal)
                    < if bot.role == GOALIE {
                        bot.settings.boxdist
                    } else {
                        bot.settings.supportbox
                    };
            if bot.role != ATTACK && !pressure {
                *output = bot.tick(w, ctx.predictor);
                continue;
            }
            let danger = w.ball.vel.y * d < -500.0 && ball.y * d < -120.0;
            if danger && (c.pos.y - ball.y) * d > 200.0 {
                self.recovering[i] = true;
            } else if w.ball.vel.y * d > -200.0 || ball.y * d > 0.0 {
                self.recovering[i] = false;
            }
            if self.recovering[i] {
                bot.role = ATTACK;
                *output = bot.tick(w, ctx.predictor);
                continue;
            }
            // Match the arrival time on moving balls. Charge low balls in the box.
            let charge = (count == 1
                || ball.y * d < -2000.0
                || (ball.y * d > self.shotzone && w.ball.vel.length() < 1100.0))
                && ball.z < 250.0;
            if !charge {
                bot.role = ATTACK;
                *output = safe_alpha(bot, ctx, d);
                continue;
            }
            let p = plan(ctx, c, d, bot.settings);
            bot.target = if own_goal_touch(c.pos, ball, d) {
                retreat(c.pos, p.target, ball, own_goal)
            } else {
                p.target
            };
            *output = drive(
                c,
                bot.target,
                2300.0 * bot.settings.speed,
                bot.settings.boost && c.boost > 0.0,
            );
            let delta = ball.minus(c.pos);
            let angle = atan2(delta.dot(c.left), delta.dot(c.forward));
            let dist = hypot2(delta.x, delta.y);
            let safe = !own_goal_touch(c.pos, ball, d);
            if bot.settings.flip
                && safe
                && dist < 320.0
                && ball.z < 175.0
                && c.forward_speed() > 650.0
                && angle.abs() < 0.4
            {
                bot.maneuver = Maneuver::Flip {
                    t: 0.0,
                    pitch: -cos(angle),
                    yaw: -sin(angle),
                };
                *output = bot.tick(w, ctx.predictor);
            } else if bot.settings.aerial
                && safe
                && p.slice.pos.z > 210.0
                && p.slice.pos.z < 650.0
                && p.slice.t < 1.0
                && p.slice.t > 0.25
                && c.boost > 15.0
            {
                let delta = p.slice.pos.minus(c.pos);
                let horizontal = hypot2(delta.x, delta.y).max(1.0);
                let alignment = (delta.x * c.forward.x + delta.y * c.forward.y) / horizontal;
                if alignment > 0.88 && horizontal < c.forward_speed().max(700.0) * p.slice.t + 200.0
                {
                    bot.maneuver = Maneuver::Aerial {
                        t: 0.0,
                        target: p.slice.pos,
                        arrive: p.slice.t,
                    };
                    *output = bot.tick(w, ctx.predictor);
                }
            }
            bot.out = *output;
        }
    }

    fn reset(&mut self) {
        self.previous = None;
        self.recovering.fill(false);
        for bot in &mut self.bots {
            bot.reset();
        }
    }

    fn clone_box(&self) -> Box<dyn Brain> {
        Box::new(self.clone())
    }

    fn trace(&self, out: &mut Vec<f64>) {
        Alpha {
            team: self.team,
            bots: self.bots.clone(),
        }
        .trace(out);
        out.push(self.previous.map_or(-1.0, |id| id as f64));
        out.extend(self.recovering.iter().map(|&v| v as u8 as f64));
    }
}

#[derive(Clone, Copy, Debug)]
struct Plan {
    slice: Slice,
    target: Vec3,
    cost: f64,
}

fn plan(ctx: &Context, c: &Car, d: f64, settings: Settings) -> Plan {
    let w = ctx.world;
    let mut best = Plan {
        slice: Slice {
            t: 0.0,
            pos: w.ball.pos,
            vel: w.ball.vel,
        },
        target: w.ball.pos,
        cost: 100.0,
    };
    let speed = c.forward_speed().max(0.0);
    let boosted = settings.boost && c.boost > 10.0;
    let maximum = (if boosted { 2250.0 } else { 1450.0 }) * settings.speed.max(0.1);
    let acceleration = if boosted { 1400.0 } else { 900.0 };
    for s in ctx.predictor.slices.iter().step_by(2) {
        if s.t > settings.predict || s.pos.z > 450.0 {
            continue;
        }
        let dist = hypot2(s.pos.x - c.pos.x, s.pos.y - c.pos.y);
        let goal_x = clamp(-s.vel.x * 0.15, -650.0, 650.0);
        let mut aim = Vec3::new(goal_x, d * 5400.0, 0.0).minus(s.pos);
        aim.z = 0.0;
        aim = aim.normalized();
        if (c.pos.y - s.pos.y) * d > 200.0 && s.pos.y * d < -2500.0 {
            aim = Vec3::new(if s.pos.x > c.pos.x { 1.0 } else { -1.0 }, d * 0.5, 0.0).normalized();
        }
        let offset = clamp(dist * 0.22 * settings.aim, 65.0, 500.0);
        let target = s.pos.with_scaled(aim, -offset);
        let delta = target.minus(c.pos);
        let angle = atan2(delta.dot(c.left), delta.dot(c.forward)).abs();
        let travel = hypot2(delta.x, delta.y);
        let t = (s.t - angle * 0.32).max(0.0);
        let cap_time = ((maximum - speed) / acceleration).max(0.0);
        let accelerating = t.min(cap_time);
        let reach = speed * accelerating
            + 0.5 * acceleration * accelerating * accelerating
            + maximum * (t - accelerating);
        let height_cost = (s.pos.z - 180.0).max(0.0) * 0.001;
        let deficit = (travel - reach - 120.0).max(0.0) / maximum;
        let cost = s.t + deficit * 2.0 + height_cost;
        if cost < best.cost {
            best = Plan {
                slice: *s,
                target,
                cost,
            };
        }
        if deficit == 0.0 && s.t > height_cost {
            best = Plan {
                slice: *s,
                target,
                cost,
            };
            break;
        }
    }
    best
}

fn drive(c: &Car, target: Vec3, speed: f64, boost: bool) -> Controls {
    let delta = target.minus(c.pos);
    let angle = atan2(delta.dot(c.left), delta.dot(c.forward));
    let distance = hypot2(delta.x, delta.y);
    let current = c.forward_speed();
    let desired = speed.min(if angle.abs() > 1.0 { 1100.0 } else { 2300.0 });
    let mut out = Controls::default();
    out.steer = clamp(-angle * 3.2 + c.ang_vel.dot(c.up) * 0.18, -1.0, 1.0);
    if angle.abs() > 2.2 && distance < 700.0 && current < 400.0 {
        out.throttle = -1.0;
        out.steer = -out.steer;
    } else {
        out.throttle = if current < desired {
            1.0
        } else if current > desired + 150.0 {
            -0.5
        } else {
            0.0
        };
    }
    out.handbrake = angle.abs() > 1.6 && current > 700.0;
    out.boost = boost && angle.abs() < 0.3 && current < desired && current < 2280.0;
    out
}

fn own_goal_touch(from: Vec3, ball: Vec3, d: f64) -> bool {
    let delta = ball.minus(from);
    if delta.y * d >= -1.0 {
        return false;
    }
    let t = (-d * 5120.0 - ball.y) / delta.y;
    t >= 0.0 && (ball.x + delta.x * t).abs() < 1300.0
}

fn safe_alpha(bot: &mut Bot, ctx: &Context, d: f64) -> Controls {
    let mut out = bot.tick(ctx.world, ctx.predictor);
    let c = &ctx.world.cars[bot.car];
    let ball = ctx.world.ball.pos;
    if c.is_on_ground
        && ball.z < 250.0
        && matches!(bot.maneuver, Maneuver::None)
        && own_goal_touch(c.pos, ball, d)
    {
        let target = retreat(c.pos, bot.target, ball, Vec3::new(0.0, -d * 5120.0, 0.0));
        if target.x != bot.target.x || target.y != bot.target.y {
            bot.target = target;
            out = drive(c, target, 2300.0, bot.settings.boost);
            bot.out = out;
        }
    }
    out
}

fn retreat(from: Vec3, target: Vec3, ball: Vec3, own_goal: Vec3) -> Vec3 {
    let path = Vec3::new(target.x - from.x, target.y - from.y, 0.0);
    let length = path.length();
    if length < 1.0 {
        return target;
    }
    let along = path.scaled(1.0 / length);
    let rel = Vec3::new(ball.x - from.x, ball.y - from.y, 0.0);
    let t = rel.dot(along);
    if t < 0.0 || t > length {
        return target;
    }
    let lateral = rel.x * along.y - rel.y * along.x;
    if lateral.abs() > 350.0 {
        return target;
    }
    let normal = Vec3::new(along.y, -along.x, 0.0);
    let side = if (ball.x - own_goal.x) * normal.x >= 0.0 {
        -1.0
    } else {
        1.0
    };
    Vec3::new(
        ball.x + normal.x * side * 500.0,
        ball.y + normal.y * side * 500.0,
        0.0,
    )
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::{predictor::Predictor, world::World};

    #[test]
    fn rejects_own_goal_lines_on_both_sides() {
        for d in [1.0, -1.0] {
            assert!(own_goal_touch(
                Vec3::new(0.0, d * 1000.0, 0.0),
                Vec3::new(0.0, 0.0, 93.0),
                d
            ));
            assert!(!own_goal_touch(
                Vec3::new(0.0, -d * 1000.0, 0.0),
                Vec3::new(0.0, 0.0, 93.0),
                d
            ));
            assert!(!own_goal_touch(
                Vec3::new(-2000.0, d * 1000.0, 0.0),
                Vec3::new(0.0, 0.0, 93.0),
                d
            ));
        }
    }

    #[test]
    fn unsafe_paths_get_a_side_waypoint() {
        for d in [1.0, -1.0] {
            let from = Vec3::new(0.0, d * 2000.0, 0.0);
            let ball = Vec3::new(0.0, 0.0, 93.0);
            let target = Vec3::new(0.0, -d * 200.0, 0.0);
            let route = retreat(from, target, ball, Vec3::new(0.0, -d * 5120.0, 0.0));
            assert_eq!(route.x.abs(), 500.0);
            assert_eq!(route.y, 0.0);
            let clear = Vec3::new(2000.0, 2000.0, 0.0);
            let route = retreat(from, clear, ball, Vec3::new(0.0, -d * 5120.0, 0.0));
            assert_eq!(route.x, clear.x);
            assert_eq!(route.y, clear.y);
        }
    }

    #[test]
    fn inactive_cars_cannot_continue_a_flip() {
        let mut world = World {
            ball_touched: true,
            ..World::default()
        };
        world.add_car(0);
        world.add_car(0);
        world.cars[0].is_demoed = true;
        world.cars[1].frozen = true;
        let mut params = Params::default();
        let settings = Settings::from_params(&mut params).unwrap();
        let mut brain = AlphaBravo {
            team: 0,
            bots: vec![Bot::new(0, settings), Bot::new(1, settings)],
            previous: None,
            recovering: vec![true; 2],
            shotzone: 5000.0,
        };
        for bot in &mut brain.bots {
            bot.maneuver = Maneuver::Flip {
                t: 0.05,
                pitch: -1.0,
                yaw: 0.0,
            };
        }
        let predictor = Predictor::default();
        let mut out = [Controls::default(); 2];
        brain.tick(
            &Context {
                world: &world,
                predictor: &predictor,
                player: None,
            },
            &mut out,
        );
        for controls in out {
            let mut values = Vec::new();
            crate::snapshot::controls(&mut values, controls);
            let mut expected = Vec::new();
            crate::snapshot::controls(&mut expected, Controls::default());
            assert_eq!(values, expected);
        }
    }
}
