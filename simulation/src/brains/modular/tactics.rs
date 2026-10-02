//! Team tactics copied from alphabravo: role selection, goal-side pressure, recovery, timed intercepts,
//! and predicted strikes. This is part of the frozen core of the modular brain.
//! With no skills selected, the modular brain drives exactly as alphabravo.
//!
//! The per-car body is split in two without changing its order: `mode` names the branch the core would take,
//! and `act` runs it. Skills see the mode before the core acts, and may take the car instead.
use super::{
    kit::Mode,
    pilot::{ATTACK, Bot, GOALIE, Maneuver, SUPPORT},
};
use crate::{
    brains::Context,
    car::{Car, Controls},
    math::{atan2, clamp, cos, hypot2, sin},
    predictor::Slice,
    vector::Vec3,
};

#[derive(Clone, Debug)]
pub struct Tactics {
    pub team: usize,
    pub bots: Vec<Bot>,
    pub previous: Option<usize>,
    pub recovering: Vec<bool>,
    pub shotzone: f64,
}

/// Team facts computed once per tick.
#[derive(Clone, Copy, Debug)]
pub struct Team {
    pub kickoff: bool,
    /// Cars on the team, counting a human teammate.
    pub count: usize,
}

impl Tactics {
    /// Chooses the attacker, the goalkeeper, and the supports. Roles are written to every bot.
    pub fn assign(&mut self, ctx: &Context) -> Team {
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
        for bot in &mut self.bots {
            bot.role = if Some(bot.car) == self.previous {
                ATTACK
            } else if count >= 3 && bot.settings.roles == 1 && Some(bot.car) == deep {
                GOALIE
            } else {
                SUPPORT
            };
        }
        Team { kickoff, count }
    }

    /// The branch `act` would take for bot `i` this tick. It changes nothing.
    pub fn mode(&self, i: usize, ctx: &Context, team: Team) -> Mode {
        let w = ctx.world;
        let bot = &self.bots[i];
        let c = &w.cars[bot.car];
        let d = if self.team == 0 { 1.0 } else { -1.0 };
        let ball = w.ball.pos;
        if c.frozen || c.is_demoed {
            return Mode::Inactive;
        }
        if team.kickoff {
            return Mode::Kickoff;
        }
        if !matches!(bot.maneuver, Maneuver::None) {
            return Mode::Maneuver;
        }
        if !c.is_on_ground {
            return Mode::Airborne;
        }
        if c.up.z < 0.7 {
            return Mode::Wall;
        }
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
            return Mode::Position;
        }
        let danger = w.ball.vel.y * d < -500.0 && ball.y * d < -120.0;
        let recovering = if danger && (c.pos.y - ball.y) * d > 200.0 {
            true
        } else if w.ball.vel.y * d > -200.0 || ball.y * d > 0.0 {
            false
        } else {
            self.recovering[i]
        };
        if recovering {
            return Mode::Save;
        }
        if self.charge(team, ctx) {
            Mode::Strike
        } else {
            Mode::Intercept
        }
    }

    /// Low balls in the own box, low slow balls past `shotzone`, and solo play use the strike planner.
    fn charge(&self, team: Team, ctx: &Context) -> bool {
        let w = ctx.world;
        let d = if self.team == 0 { 1.0 } else { -1.0 };
        let ball = w.ball.pos;
        (team.count == 1
            || ball.y * d < -2000.0
            || (ball.y * d > self.shotzone && w.ball.vel.length() < 1100.0))
            && ball.z < 250.0
    }

    /// Drives bot `i` as alphabravo does. Roles must already be assigned this tick.
    pub fn act(&mut self, i: usize, ctx: &Context, team: Team) -> Controls {
        let w = ctx.world;
        let d = if self.team == 0 { 1.0 } else { -1.0 };
        let ball = w.ball.pos;
        let kickoff = team.kickoff;
        let charge = self.charge(team, ctx);
        let bot = &mut self.bots[i];
        let c = &w.cars[bot.car];
        if c.frozen || c.is_demoed {
            bot.out = Controls::default();
            return bot.out;
        }
        if kickoff || !c.is_on_ground || c.up.z < 0.7 || !matches!(bot.maneuver, Maneuver::None) {
            return bot.tick(w, ctx.predictor);
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
            return bot.tick(w, ctx.predictor);
        }
        let danger = w.ball.vel.y * d < -500.0 && ball.y * d < -120.0;
        if danger && (c.pos.y - ball.y) * d > 200.0 {
            self.recovering[i] = true;
        } else if w.ball.vel.y * d > -200.0 || ball.y * d > 0.0 {
            self.recovering[i] = false;
        }
        if self.recovering[i] {
            bot.role = ATTACK;
            return bot.tick(w, ctx.predictor);
        }
        // Match the arrival time on moving balls. Charge low balls in the box.
        if !charge {
            bot.role = ATTACK;
            return safe_alpha(bot, ctx, d);
        }
        let p = plan(ctx, c, d, bot.settings);
        bot.target = if own_goal_touch(c.pos, ball, d) {
            retreat(c.pos, p.target, ball, own_goal)
        } else {
            p.target
        };
        let mut output = drive(
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
            output = bot.tick(w, ctx.predictor);
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
            if alignment > 0.88 && horizontal < c.forward_speed().max(700.0) * p.slice.t + 200.0 {
                bot.maneuver = Maneuver::Aerial {
                    t: 0.0,
                    target: p.slice.pos,
                    arrive: p.slice.t,
                };
                output = bot.tick(w, ctx.predictor);
            }
        }
        bot.out = output;
        output
    }

    pub fn reset(&mut self) {
        self.previous = None;
        self.recovering.fill(false);
        for bot in &mut self.bots {
            bot.reset();
        }
    }

    /// Hidden state in alphabravo's order.
    pub fn trace(&self, out: &mut Vec<f64>) {
        for bot in &self.bots {
            bot.trace(out);
        }
        out.push(self.previous.map_or(-1.0, |id| id as f64));
        out.extend(self.recovering.iter().map(|&v| v as u8 as f64));
    }
}

/// A predicted strike: the ball slice to hit and the point to drive to.
#[derive(Clone, Copy, Debug)]
pub struct Plan {
    pub slice: Slice,
    pub target: Vec3,
    pub cost: f64,
}

/// Bravo's acceleration-based search for the earliest reachable low ball, aimed at the far goal.
pub fn plan(ctx: &Context, c: &Car, d: f64, settings: super::pilot::Settings) -> Plan {
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

/// Bravo's ground driver: steer toward `target`, hold `speed`, boost when aligned.
pub fn drive(c: &Car, target: Vec3, speed: f64, boost: bool) -> Controls {
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

/// True when driving straight from `from` through `ball` would send it into the own goal mouth.
pub fn own_goal_touch(from: Vec3, ball: Vec3, d: f64) -> bool {
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

/// If the ball lies near the straight path to `target`, returns a point beside it, away from the own goal.
pub fn retreat(from: Vec3, target: Vec3, ball: Vec3, own_goal: Vec3) -> Vec3 {
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
