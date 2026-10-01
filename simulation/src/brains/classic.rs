//! The original bot: a ball chaser that predicts the ball, picks an intercept, and drives to it.
//! The closest car attacks and its teammates hold a support position.
//! Copy this file to start a new brain module.
use super::{Brain, Context, Params, Skill};
use crate::{
    DT,
    car::{Car, Controls},
    math::{atan2, clamp, cos, hypot2, sign, sin},
    predictor::{Predictor, Slice},
    vector::Vec3,
    world::World,
};
#[derive(Clone, Copy, Debug)]
pub struct Settings {
    /// Fraction of the target speed the car drives at.
    pub speed: f64,
    pub boost: bool,
    pub flip: bool,
    pub aerial: bool,
    /// Seconds between control updates. Between updates the bot eases steering toward its new choice.
    pub reaction: f64,
    /// Ignore the reaction delay.
    pub instant: bool,
    /// Prediction horizon in seconds.
    pub predict: f64,
    /// How far behind the ball the car lines up for a shot, from 0 (close) to 1 (far).
    pub aim: f64,
    /// Skill number recorded in regression traces.
    pub level: u32,
}
impl Settings {
    pub fn preset(skill: Skill) -> Self {
        match skill {
            Skill::Rookie => Self {
                speed: 0.72,
                boost: false,
                flip: false,
                aerial: false,
                reaction: 0.35,
                instant: false,
                predict: 1.5,
                aim: 0.5,
                level: 0,
            },
            Skill::Pro => Self {
                speed: 0.9,
                boost: true,
                flip: true,
                aerial: false,
                reaction: 0.16,
                instant: false,
                predict: 3.0,
                aim: 0.8,
                level: 1,
            },
            Skill::Allstar => Self {
                speed: 1.0,
                boost: true,
                flip: true,
                aerial: true,
                reaction: 0.06,
                instant: true,
                predict: 4.0,
                aim: 1.0,
                level: 2,
            },
        }
    }
    /// Reads `preset` (default allstar), then any individual overrides.
    pub fn from_params(params: &mut Params) -> Result<Self, String> {
        let preset = Skill::parse(&params.text("preset", "allstar"))?;
        let mut s = Self::preset(preset);
        s.speed = params.number("speed", s.speed)?;
        s.boost = params.flag("boost", s.boost)?;
        s.flip = params.flag("flip", s.flip)?;
        s.aerial = params.flag("aerial", s.aerial)?;
        s.reaction = params.number("reaction", s.reaction)?;
        s.instant = params.flag("instant", s.instant)?;
        s.predict = params.number("predict", s.predict)?;
        s.aim = params.number("aim", s.aim)?;
        Ok(s)
    }
}
/// One `Bot` per car, with roles assigned each tick.
#[derive(Clone, Debug)]
pub struct Classic {
    pub team: usize,
    pub bots: Vec<Bot>,
}
pub fn create(params: &mut Params, team: usize, cars: &[usize]) -> Result<Box<dyn Brain>, String> {
    let settings = Settings::from_params(params)?;
    Ok(Box::new(Classic {
        team,
        bots: cars.iter().map(|&car| Bot::new(car, settings)).collect(),
    }))
}
impl Brain for Classic {
    fn tick(&mut self, ctx: &Context, out: &mut [Controls]) {
        assign_roles(ctx.world, self.team, &mut self.bots, ctx.player);
        for (bot, out) in self.bots.iter_mut().zip(out) {
            *out = bot.tick(ctx.world, ctx.predictor);
        }
    }
    fn reset(&mut self) {
        for bot in &mut self.bots {
            bot.reset();
        }
    }
    fn trace(&self, out: &mut Vec<f64>) {
        let v = |out: &mut Vec<f64>, v: Vec3| out.extend([v.x, v.y, v.z]);
        for b in &self.bots {
            out.extend([b.car as f64, b.settings.level as f64, b.reaction_timer]);
            v(out, b.target);
            out.extend([b.kickoff_flip_done as u8 as f64, b.support as u8 as f64]);
            crate::snapshot::controls(out, b.out);
            match b.maneuver {
                Maneuver::None => out.push(0.0),
                Maneuver::Flip { t, pitch, yaw } => out.extend([1.0, t, pitch, yaw]),
                Maneuver::Aerial { t, target, arrive } => {
                    out.extend([2.0, t]);
                    v(out, target);
                    out.push(arrive);
                }
            }
        }
    }
    fn clone_box(&self) -> Box<dyn Brain> {
        Box::new(self.clone())
    }
}
#[derive(Clone, Copy, Debug)]
pub enum Maneuver {
    None,
    Flip { t: f64, pitch: f64, yaw: f64 },
    Aerial { t: f64, target: Vec3, arrive: f64 },
}
#[derive(Clone, Debug)]
pub struct Bot {
    pub car: usize,
    pub settings: Settings,
    pub maneuver: Maneuver,
    pub out: Controls,
    pub reaction_timer: f64,
    pub target: Vec3,
    pub kickoff_flip_done: bool,
    pub support: bool,
}
impl Bot {
    pub fn new(car: usize, settings: Settings) -> Self {
        Self {
            car,
            settings,
            maneuver: Maneuver::None,
            out: Controls::default(),
            reaction_timer: 0.0,
            target: Vec3::default(),
            kickoff_flip_done: false,
            support: false,
        }
    }
    pub fn reset(&mut self) {
        self.maneuver = Maneuver::None;
        self.kickoff_flip_done = false;
    }
    pub fn tick(&mut self, world: &World, predictor: &Predictor) -> Controls {
        let car = &world.cars[self.car];
        let settings = self.settings;
        let mut output = Controls::default();
        if car.is_demoed || car.frozen {
            self.out = output;
            return output;
        }
        let ball = &world.ball;
        let direction = if car.team == 0 { 1.0 } else { -1.0 };
        let own_goal = Vec3::new(0.0, -direction * 5120.0, 0.0);
        let target_goal = Vec3::new(0.0, direction * (5120.0 + 400.0), 150.0);
        if matches!(self.maneuver, Maneuver::Flip { .. }) {
            return self.run_flip(car, DT);
        }
        if matches!(self.maneuver, Maneuver::Aerial { .. })
            && let Some(out) = self.run_aerial(car, predictor, DT)
        {
            return out;
        }
        if !car.is_on_ground && car.num_wheels_in_contact == 0 {
            self.recover(car, &mut output);
            output.throttle = 1.0;
            self.out = output;
            return output;
        }
        if car.world_contact && car.up.z < -0.5 {
            output.jump = !self.out.jump;
            self.out = output;
            return output;
        }
        let kickoff = !world.ball_touched
            && ball.vel.length_sq() < 1.0
            && ball.pos.x.abs() < 1.0
            && ball.pos.y.abs() < 1.0;
        let mut boost = false;
        let mut speed = 2300.0;
        if kickoff {
            self.target = Vec3::new(0.0, -direction * 60.0, 0.0);
            boost = settings.boost || car.boost > 0.0;
            let distance = car.pos.distance(ball.pos);
            if settings.flip
                && !self.kickoff_flip_done
                && distance < 520.0 + car.vel.length() * 0.18
                && car.vel.length() > 1000.0
            {
                self.kickoff_flip_done = true;
                return self.start_flip(car, -1.0, 0.0);
            }
        } else {
            self.kickoff_flip_done = false;
            let mut chosen = None;
            let mut last = None;
            let pace = self.average_speed(car).max(400.0);
            for &slice in &predictor.slices {
                if slice.t > settings.predict {
                    continue;
                }
                last = Some(slice);
                if slice.pos.z > 300.0 && !(settings.aerial && slice.pos.z < 1500.0) {
                    continue;
                }
                // Exact shortcut: the aim point lies 141.25 from the slice, and angle and height only add time.
                // Slices that are out of reach by more than a unit of margin cannot pass the estimate below.
                let reach = slice.t * pace + (91.25 + 50.0) + 1.0;
                let dx = slice.pos.x - car.pos.x;
                let dy = slice.pos.y - car.pos.y;
                if dx * dx + dy * dy > reach * reach {
                    continue;
                }
                let mut aim = target_goal.minus(slice.pos);
                aim.z = 0.0;
                aim = aim.normalized();
                let point = slice.pos.with_scaled(aim, -(91.25 + 50.0));
                let travel = hypot2(point.x - car.pos.x, point.y - car.pos.y) / pace;
                if travel <= slice.t && estimate_time(car, point, slice.pos.z, travel) <= slice.t {
                    chosen = Some(slice);
                    break;
                }
            }
            let slice = chosen.or(last).unwrap_or(Slice {
                t: 0.0,
                pos: ball.pos,
                vel: ball.vel,
            });
            if self.support {
                let y = clamp(ball.pos.y - direction * 2600.0, -4600.0, 4600.0);
                self.target = Vec3::new(clamp(ball.pos.x * 0.4, -2500.0, 2500.0), y, 0.0);
                speed = 1200.0;
                if car.boost < 40.0
                    && let Some(pad) = nearest_pad(world, car.pos, true)
                    && pad.distance(car.pos) < 2500.0
                {
                    self.target = pad;
                }
            } else {
                let mut aim = target_goal.minus(slice.pos);
                aim.z = 0.0;
                aim = aim.normalized();
                let ahead = (car.pos.y - slice.pos.y) * direction > 200.0;
                let danger =
                    ball.vel.y * -direction > 500.0 && (ball.pos.y - own_goal.y).abs() < 5000.0;
                if ahead && (danger || (slice.pos.y - own_goal.y).abs() < 3000.0) {
                    let signed = sign(if slice.pos.x == 0.0 { 1.0 } else { slice.pos.x });
                    let save = Vec3::new(signed * 700.0, own_goal.y + direction * 200.0, 0.0);
                    if (car.pos.y - own_goal.y) * direction > 800.0 {
                        self.target = save;
                        boost = settings.boost && danger;
                    } else {
                        let aim = Vec3::new(signed, direction * 0.6, 0.0).normalized();
                        self.target = slice.pos.with_scaled(aim, -(91.25 + 60.0));
                        boost = settings.boost;
                    }
                } else {
                    let offset = clamp(car.pos.distance(slice.pos) * 0.35, 91.25 + 40.0, 700.0)
                        * settings.aim
                        + (91.25 + 40.0) * (1.0 - settings.aim);
                    self.target = slice.pos.with_scaled(aim, -offset);
                    let distance = car.pos.distance(self.target);
                    speed = if slice.t > 0.05 {
                        distance / slice.t
                    } else {
                        2300.0
                    };
                    boost = settings.boost && speed > 1300.0;
                }
                if settings.aerial
                    && slice.pos.z > 350.0
                    && slice.pos.z < 1600.0
                    && car.boost > 30.0
                    && car.is_on_ground
                    && car.up.z > 0.9
                {
                    let offset = slice.pos.minus(car.pos);
                    let distance = hypot2(offset.x, offset.y);
                    let alignment =
                        (offset.x * car.forward.x + offset.y * car.forward.y) / distance.max(1.0);
                    let time = 0.35 + hypot2(distance, slice.pos.z - car.pos.z) / 1150.0;
                    if alignment > 0.9
                        && (time - slice.t).abs() < 0.25
                        && (slice.pos.y - car.pos.y) * direction > 0.0
                    {
                        self.maneuver = Maneuver::Aerial {
                            t: 0.0,
                            target: slice.pos,
                            arrive: slice.t,
                        };
                        return self.run_aerial(car, predictor, DT).unwrap_or(output);
                    }
                }
                let distance = car.pos.distance(ball.pos);
                if settings.flip
                    && distance < 330.0
                    && ball.pos.z < 180.0
                    && car.vel.length() > 700.0
                {
                    let offset = ball.pos.minus(car.pos);
                    let angle = atan2(offset.dot(car.left), offset.dot(car.forward));
                    if angle.abs() < 0.5 {
                        return self.start_flip(car, -cos(angle), -sin(angle) * 1.2);
                    }
                }
            }
        }
        self.drive_to(
            car,
            &mut output,
            self.target,
            boost,
            speed * settings.speed + (1.0 - settings.speed) * 0.0,
        );
        self.apply_reaction(output, DT);
        self.out
    }
    fn average_speed(&self, car: &Car) -> f64 {
        let settings = self.settings;
        let speed = car.forward_speed().max(0.0);
        let maximum = (if settings.boost && car.boost > 10.0 {
            2000.0
        } else {
            1350.0
        }) * settings.speed;
        let time = ((maximum - speed) / 1400.0).max(0.0);
        speed + (maximum - speed) * (0.5 * time).min(1.0)
    }
    fn drive_to(&self, car: &Car, out: &mut Controls, target: Vec3, boost: bool, speed: f64) {
        let offset = target.minus(car.pos);
        let forward = offset.dot(car.forward);
        let lateral = offset.dot(car.left);
        let angle = atan2(lateral, forward);
        let distance = hypot2(forward, lateral);
        let angular = car.ang_vel.dot(car.up);
        out.steer = clamp(-angle * 3.2 + angular * 0.18, -1.0, 1.0);
        let current = car.forward_speed();
        let desired = clamp(speed, 300.0, 2300.0);
        if angle.abs() > 2.2 && distance < 700.0 && current < 400.0 {
            out.throttle = -1.0;
            out.steer = -out.steer;
        } else {
            out.throttle = if current < desired {
                1.0
            } else if current > desired + 300.0 {
                -0.3
            } else {
                0.1
            };
        }
        out.handbrake = angle.abs() > 1.6 && current > 700.0 && car.is_on_ground;
        out.boost = boost
            && angle.abs() < 0.3
            && current < desired + 100.0
            && current < 2280.0
            && car.is_on_ground
            && car.up.z > 0.6;
    }
    fn apply_reaction(&mut self, out: Controls, dt: f64) {
        self.reaction_timer -= dt;
        if self.reaction_timer <= 0.0 || self.settings.instant {
            self.out = out;
            self.reaction_timer = self.settings.reaction;
        } else {
            self.out.steer += (out.steer - self.out.steer) * 0.35;
            self.out.throttle = out.throttle;
            self.out.jump = out.jump;
        }
    }
    fn recover(&self, car: &Car, out: &mut Controls) {
        let mut direction = car.vel;
        direction.z = 0.0;
        let forward = if direction.length_sq() > 100.0 {
            direction.normalized()
        } else {
            Vec3::new(car.forward.x, car.forward.y, 0.0).normalized()
        };
        orient(car, forward, Vec3::new(0.0, 0.0, 1.0), out);
    }
    fn start_flip(&mut self, car: &Car, pitch: f64, yaw: f64) -> Controls {
        self.maneuver = Maneuver::Flip { t: 0.0, pitch, yaw };
        self.run_flip(car, 0.0)
    }
    fn run_flip(&mut self, car: &Car, dt: f64) -> Controls {
        let Maneuver::Flip { mut t, pitch, yaw } = self.maneuver else {
            unreachable!()
        };
        t += dt;
        let mut out = Controls {
            throttle: 1.0,
            ..Controls::default()
        };
        self.maneuver = Maneuver::Flip { t, pitch, yaw };
        if t < 0.07 {
            out.jump = true;
        } else if t < 0.1 {
            out.jump = false;
        } else if t < 0.2 {
            out.jump = true;
            out.pitch = clamp(pitch, -1.0, 1.0);
            out.yaw = clamp(yaw, -1.0, 1.0);
        } else if t >= 1.1 || car.is_on_ground {
            self.maneuver = Maneuver::None;
        }
        self.out = out;
        out
    }
    fn run_aerial(&mut self, car: &Car, predictor: &Predictor, dt: f64) -> Option<Controls> {
        let Maneuver::Aerial {
            mut t,
            mut target,
            arrive,
        } = self.maneuver
        else {
            unreachable!()
        };
        t += dt;
        let remaining = arrive - t;
        let slice = predictor
            .slices
            .iter()
            .find(|s| s.t >= remaining)
            .or(predictor.slices.last());
        if let Some(slice) = slice {
            target = slice.pos;
        }
        if t > 3.0 || remaining < -0.3 || (t > 0.3 && car.is_on_ground) || car.boost <= 0.0 {
            self.maneuver = Maneuver::None;
            return None;
        }
        self.maneuver = Maneuver::Aerial { t, target, arrive };
        let mut out = Controls::default();
        if t < 0.2 {
            out.jump = true;
        } else if t < 0.23 {
            out.jump = false;
        } else if t < 0.27 {
            out.jump = true;
        }
        let time = remaining.max(0.05);
        let mut correction = target.minus(car.pos).with_scaled(car.vel, -time);
        correction.z -= 0.5 * -650.0 * time * time;
        let forward = correction.normalized();
        let acceleration = (2.0 * correction.length()) / (time * time);
        orient(car, forward, Vec3::new(0.0, 0.0, 1.0), &mut out);
        out.boost = car.forward.dot(forward) > 0.7 && acceleration > 300.0;
        out.throttle = 1.0;
        self.out = out;
        Some(out)
    }
}
/// `travel` is the horizontal distance divided by the average speed.
fn estimate_time(car: &Car, target: Vec3, height: f64, travel: f64) -> f64 {
    let offset = target.minus(car.pos);
    let angle = atan2(offset.dot(car.left), offset.dot(car.forward)).abs();
    travel + angle * 0.45 + (height - 150.0).max(0.0) * 0.004
}
fn orient(car: &Car, forward: Vec3, up: Vec3, out: &mut Controls) {
    let f = car.mat.transpose_mul(forward);
    let u = car.mat.transpose_mul(up);
    let angular = car.mat.transpose_mul(car.ang_vel);
    let pitch = atan2(
        f.z,
        hypot2(f.x, f.y) * sign(if f.x == 0.0 { 1.0 } else { f.x }),
    );
    let yaw = atan2(-f.y, f.x);
    let roll = atan2(-u.y, u.z);
    out.pitch = clamp(pitch * 3.2 - (-angular.y) * 0.55, -1.0, 1.0);
    out.yaw = clamp(yaw * 3.2 - (-angular.z) * 0.6, -1.0, 1.0);
    out.roll = clamp(roll * 2.2 - angular.x * 0.35, -1.0, 1.0);
    if yaw.abs() > 1.2 {
        out.roll *= 0.3;
    }
}
fn nearest_pad(world: &World, position: Vec3, big: bool) -> Option<Vec3> {
    let mut closest = None;
    let mut minimum = f64::INFINITY;
    for pad in &world.pads {
        if pad.cooldown > 0.0 || (big && !pad.big) {
            continue;
        }
        let distance = pad.pos.distance(position);
        if distance < minimum {
            minimum = distance;
            closest = Some(pad.pos);
        }
    }
    closest
}
/// The car with the lowest cost attacks. A human teammate takes part in the choice but is never steered.
fn assign_roles(world: &World, team: usize, bots: &mut [Bot], player: Option<usize>) {
    let ids = bots
        .iter()
        .map(|b| b.car)
        .chain(player.filter(|&p| world.cars[p].team == team));
    let best = ids.reduce(|a, b| {
        let direction = if team == 0 { 1.0 } else { -1.0 };
        let cost = |id: usize| {
            let car = &world.cars[id];
            car.pos.distance(world.ball.pos)
                + ((car.pos.y - world.ball.pos.y) * direction).max(0.0) * 1.5
        };
        if cost(a) < cost(b) { a } else { b }
    });
    for bot in bots.iter_mut() {
        bot.support = Some(bot.car) != best;
    }
}
