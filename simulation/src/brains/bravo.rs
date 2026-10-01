//! Bravo uses one attacker, one close support car, and one deep support car.
use super::{
    Brain, Context, Params,
    classic::{Bot, Maneuver, Settings},
};
use crate::{
    car::{Car, Controls},
    math::{atan2, clamp, cos, hypot2, sin},
    predictor::Slice,
    vector::Vec3,
    world::World,
};

#[derive(Clone, Debug)]
struct Bravo {
    team: usize,
    bots: Vec<Bot>,
    spacing: f64,
    keeper: f64,
    previous: Option<usize>,
    rotation: f64,
}

pub fn create(params: &mut Params, team: usize, cars: &[usize]) -> Result<Box<dyn Brain>, String> {
    let settings = Settings::from_params(params)?;
    Ok(Box::new(Bravo {
        team,
        bots: cars.iter().map(|&id| Bot::new(id, settings)).collect(),
        spacing: params.number("spacing", 2600.0)?,
        keeper: params.number("keeper", 3400.0)?,
        previous: None,
        rotation: params.number("rotation", 0.00035)?,
    }))
}

impl Brain for Bravo {
    fn tick(&mut self, ctx: &Context, out: &mut [Controls]) {
        self.play(ctx, out);
    }
    fn reset(&mut self) {
        for b in &mut self.bots {
            b.reset();
        }
        self.previous = None;
    }
    fn clone_box(&self) -> Box<dyn Brain> {
        Box::new(self.clone())
    }
    fn trace(&self, out: &mut Vec<f64>) {
        let classic = super::classic::Classic {
            team: self.team,
            bots: self.bots.clone(),
        };
        classic.trace(out);
        out.push(self.previous.map_or(-1.0, |id| id as f64));
    }
}

#[derive(Clone, Copy, Debug)]
struct Plan {
    slice: Slice,
    target: Vec3,
    cost: f64,
}

impl Bravo {
    fn play(&mut self, ctx: &Context, out: &mut [Controls]) {
        let w = ctx.world;
        let d = if self.team == 0 { 1.0 } else { -1.0 };
        let ball = w.ball.pos;
        let kickoff = !w.ball_touched
            && w.ball.vel.length_sq() < 1.0
            && ball.x.abs() < 1.0
            && ball.y.abs() < 1.0;
        let plans: Vec<_> = self
            .bots
            .iter()
            .map(|bot| plan(ctx, &w.cars[bot.car], d, bot.settings.aim))
            .collect();
        let attack = (0..self.bots.len()).min_by(|&a, &b| {
            let cost = |i: usize| {
                let bot = &self.bots[i];
                let c = &w.cars[bot.car];
                let p = plans[i];
                p.cost + ((c.pos.y - p.slice.pos.y) * d).max(0.0) * self.rotation
                    - if self.previous == Some(bot.car) {
                        0.15
                    } else {
                        0.0
                    }
                    + if c.is_demoed { 100.0 } else { 0.0 }
            };
            cost(a).total_cmp(&cost(b))
        });
        self.previous = attack.map(|i| self.bots[i].car);
        let deep = (0..self.bots.len())
            .filter(|&i| Some(i) != attack)
            .min_by(|&a, &b| {
                (w.cars[self.bots[a].car].pos.y * d)
                    .total_cmp(&(w.cars[self.bots[b].car].pos.y * d))
            });
        let count = self.bots.len();
        for (i, (bot, output)) in self.bots.iter_mut().zip(out).enumerate() {
            let c = &w.cars[bot.car];
            bot.support = Some(i) != attack;
            if c.frozen || c.is_demoed {
                *output = Controls::default();
                bot.out = *output;
                continue;
            }
            if !c.is_on_ground || c.up.z < 0.7 || !matches!(bot.maneuver, Maneuver::None) {
                *output = bot.tick(w, ctx.predictor);
                if matches!(bot.maneuver, Maneuver::Flip { t, .. } if t < 0.15)
                    && c.forward.y * d > 0.7
                {
                    output.boost = c.boost > 0.0;
                    bot.out = *output;
                }
                continue;
            }
            if kickoff && !bot.support {
                *output = bot.tick(w, ctx.predictor);
                continue;
            }
            if bot.support {
                let last = count > 2 && Some(i) == deep;
                let projected = ball.with_scaled(w.ball.vel, 0.5);
                let gap = if last { self.keeper } else { self.spacing };
                let mut target = Vec3::new(
                    clamp(
                        projected.x * if last { 0.35 } else { 0.65 },
                        -2800.0,
                        2800.0,
                    ),
                    clamp(projected.y * d - gap, -4650.0, 3800.0) * d,
                    0.0,
                );
                if kickoff {
                    target = Vec3::new(
                        if c.pos.x < 0.0 { -3072.0 } else { 3072.0 },
                        -d * 4096.0,
                        0.0,
                    );
                } else if c.boost < 50.0 && ball.y * d > -2000.0 {
                    if let Some(p) = route_pad(w, c, target) {
                        target = p;
                    }
                }
                // Follow the goal-bound path instead of leaving a save to the attacker.
                if last && w.ball.vel.y * d < -400.0 {
                    if let Some(s) = ctx.predictor.slices.iter().find(|s| {
                        s.t < 3.0
                            && s.pos.y * d < -4600.0
                            && s.pos.x.abs() < 1000.0
                            && s.pos.z < 650.0
                    }) {
                        target = Vec3::new(clamp(s.pos.x, -850.0, 850.0), -d * 4750.0, 0.0);
                    }
                }
                bot.target = target;
                let dist = hypot2(target.x - c.pos.x, target.y - c.pos.y);
                *output = drive(
                    c,
                    target,
                    (dist * 2.0).min(2300.0),
                    dist > 1100.0 && c.boost > 20.0,
                );
                bot.out = *output;
                continue;
            }
            let p = plans[i];
            bot.target = p.target;
            *output = drive(c, p.target, 2300.0, c.boost > 0.0);
            let delta = ball.minus(c.pos);
            let angle = atan2(delta.dot(c.left), delta.dot(c.forward));
            let dist = hypot2(delta.x, delta.y);
            if bot.settings.flip
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
}

fn plan(ctx: &Context, c: &Car, d: f64, aim_offset: f64) -> Plan {
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
    let maximum = if c.boost > 10.0 { 2250.0 } else { 1450.0 };
    let acceleration = if c.boost > 10.0 { 1400.0 } else { 900.0 };
    for s in ctx.predictor.slices.iter().step_by(2) {
        if s.t > 4.0 || s.pos.z > 450.0 {
            continue;
        }
        let dist = hypot2(s.pos.x - c.pos.x, s.pos.y - c.pos.y);
        let mut aim =
            Vec3::new(clamp(-s.vel.x * 0.15, -650.0, 650.0), d * 5400.0, 0.0).minus(s.pos);
        aim.z = 0.0;
        aim = aim.normalized();
        let ahead = (c.pos.y - s.pos.y) * d > 200.0;
        if ahead && s.pos.y * d < -2500.0 {
            aim = Vec3::new(if s.pos.x > c.pos.x { 1.0 } else { -1.0 }, d * 0.5, 0.0).normalized();
        }
        let offset = clamp(dist * 0.22 * aim_offset, 65.0, 500.0);
        let target = s.pos.with_scaled(aim, -offset);
        let delta = target.minus(c.pos);
        let angle = atan2(delta.dot(c.left), delta.dot(c.forward)).abs();
        let travel = hypot2(delta.x, delta.y);
        let turn = angle * 0.32;
        let t = (s.t - turn).max(0.0);
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

fn route_pad(w: &World, c: &Car, target: Vec3) -> Option<Vec3> {
    let direct = c.pos.distance(target);
    w.pads
        .iter()
        .filter(|p| p.cooldown <= 0.0 && p.big)
        .filter(|p| c.pos.distance(p.pos) < 2300.0)
        .filter(|p| c.pos.distance(p.pos) + p.pos.distance(target) < direct + 1400.0)
        .min_by(|a, b| c.pos.distance(a.pos).total_cmp(&c.pos.distance(b.pos)))
        .map(|p| p.pos)
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::{brains::BrainSpec, predictor::Predictor};

    fn world() -> World {
        let mut w = World {
            ball_touched: true,
            ..World::default()
        };
        for i in 0..3 {
            let id = w.add_car(0);
            w.cars[id].spawn(
                (i as f64 - 1.0) * 800.0,
                -1000.0 - i as f64 * 1200.0,
                std::f64::consts::FRAC_PI_2,
                60.0,
            );
        }
        w
    }

    fn brain() -> Box<dyn Brain> {
        BrainSpec::parse("bravo", "module = bravo\nspacing = 2600\nkeeper = 3400\n")
            .unwrap()
            .create(0, &[0, 1, 2])
            .unwrap()
    }

    fn bits(values: &[f64]) -> Vec<u64> {
        values.iter().map(|v| v.to_bits()).collect()
    }

    #[test]
    fn clone_keeps_controls_and_hidden_state_exact() {
        let mut w = world();
        let mut predictor = Predictor::default();
        let mut a = brain();
        let mut b = a.clone();
        for step in 0..80 {
            w.tick += 4;
            w.ball.pos = Vec3::new(
                step as f64 * 11.0 - 400.0,
                -700.0,
                92.0 + (step % 7) as f64 * 45.0,
            );
            w.ball.vel = Vec3::new(150.0, -250.0, 80.0);
            predictor.update(&w);
            let ctx = Context {
                world: &w,
                predictor: &predictor,
                player: None,
            };
            let mut x = [Controls::default(); 3];
            let mut y = x;
            a.tick(&ctx, &mut x);
            b.tick(&ctx, &mut y);
            let mut sx = Vec::new();
            let mut sy = Vec::new();
            for (x, y) in x.into_iter().zip(y) {
                crate::snapshot::controls(&mut sx, x);
                crate::snapshot::controls(&mut sy, y);
            }
            a.trace(&mut sx);
            b.trace(&mut sy);
            assert!(sx.iter().all(|v| v.is_finite()));
            assert_eq!(bits(&sx), bits(&sy));
            if step == 40 {
                a.reset();
                b.reset();
            }
        }
    }

    #[test]
    fn frozen_and_demolished_cars_have_no_controls() {
        let mut w = world();
        w.cars[0].is_demoed = true;
        w.cars[1].frozen = true;
        let mut predictor = Predictor::default();
        predictor.update(&w);
        let mut brain = Bravo {
            team: 0,
            bots: (0..3)
                .map(|id| Bot::new(id, Settings::preset(super::super::Skill::Allstar)))
                .collect(),
            spacing: 2600.0,
            keeper: 3400.0,
            previous: None,
            rotation: 0.00035,
        };
        for bot in &mut brain.bots {
            bot.maneuver = Maneuver::Flip {
                t: 0.05,
                pitch: -1.0,
                yaw: 0.0,
            };
        }
        let mut out = [Controls::default(); 3];
        brain.tick(
            &Context {
                world: &w,
                predictor: &predictor,
                player: None,
            },
            &mut out,
        );
        for controls in &out[..2] {
            let mut values = Vec::new();
            crate::snapshot::controls(&mut values, *controls);
            let mut expected = Vec::new();
            crate::snapshot::controls(&mut expected, Controls::default());
            assert_eq!(bits(&values), bits(&expected));
        }
    }
}
