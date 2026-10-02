//! The strategy and skill APIs of the modular brain, and a toolbox for writing them.
//!
//! A strategy (alphabravo's tactics by default) chooses roles and a default action for every car.
//! A skill overrides it for a moment: each tick, before the strategy acts, every selected skill is offered
//! each bot car in priority order. The first skill that returns controls drives that car for the tick.
//! A skill that drove the car last tick is asked first, with `holding = true`, so it can finish a flip or
//! an aerial without being interrupted. When no skill claims the car, the strategy drives it, and then
//! every skill may `adjust` the strategy's controls.
//!
//! This file is part of the frozen core. Copy a helper into your skill file to change it.
pub use super::pilot::{
    ATTACK, Bot, GOALIE, Maneuver, SUPPORT, Settings, avoid_ball, estimate_time, nearest_pad,
    orient,
};
pub use super::tactics::{Plan, Team, drive, own_goal_touch, plan, retreat};
use crate::{
    DT,
    arena::{GOAL_LINE, HALF_LENGTH},
    brains::{Context, Params},
    car::{Car, Controls},
    math::{atan2, clamp, hypot2},
    predictor::{Predictor, Slice},
    vector::Vec3,
    world::World,
};
use std::fmt::Debug;

/// A moment-to-moment behavior that can take a car from the core.
///
/// One instance exists per bot car, cloned from the instance that `create` returned, so fields hold per-car state.
/// Skills must be deterministic: no clocks, no shared mutable state, no game random numbers,
/// and only the pinned `crate::math` trigonometry.
pub trait Skill: Debug + Send + Sync {
    /// Offered the car before the core acts. Return controls to drive it this tick, or `None` to pass.
    /// `holding` is true when this skill drove the car on the previous tick.
    fn claim(&mut self, s: &Situation, holding: bool) -> Option<Controls>;
    /// Called after the core drove the car this tick. May edit the core's controls.
    fn adjust(&mut self, _s: &Situation, _out: &mut Controls) {}
    /// Called at every kickoff and set-piece start.
    fn reset(&mut self) {}
    /// Hidden state for the native/WASM consistency check. Push every field that affects later ticks.
    fn trace(&self, _out: &mut Vec<f64>) {}
    fn clone_box(&self) -> Box<dyn Skill>;
}
impl Clone for Box<dyn Skill> {
    fn clone(&self) -> Self {
        self.clone_box()
    }
}

/// Builds a skill from the brain's settings. Read settings named `<skill>.<key>`; unknown keys are errors.
pub type Create = fn(&mut Params) -> Result<Box<dyn Skill>, String>;

/// A team strategy: roles, positioning, and the default action of every car. Skills override it for moments.
///
/// The default is alphabravo's (`tactics.rs`). A brain may pick another per team size:
/// `strategy = alpha` for every size, or `strategy.1 = alpha` for teams of one car only.
/// Strategies must be deterministic, like skills.
pub trait Strategy: Debug + Send + Sync {
    /// Called once per tick before any car acts. Writes a role to every bot.
    fn assign(&mut self, ctx: &Context) -> Team;
    /// The branch `act` would take for bot `i` this tick. It must change nothing.
    fn mode(&self, i: usize, ctx: &Context, team: Team) -> Mode;
    /// Drives bot `i` when no skill claimed it. Keep `bots()[i].out` equal to the returned controls.
    fn act(&mut self, i: usize, ctx: &Context, team: Team) -> Controls;
    /// One bot per brain car, in the brain's car order.
    fn bots(&self) -> &[Bot];
    fn bots_mut(&mut self) -> &mut [Bot];
    /// Called at every kickoff and set-piece start.
    fn reset(&mut self);
    /// Hidden state for the native/WASM consistency check.
    fn trace(&self, out: &mut Vec<f64>);
    fn clone_box(&self) -> Box<dyn Strategy>;
}
impl Clone for Box<dyn Strategy> {
    fn clone(&self) -> Self {
        self.clone_box()
    }
}

/// Builds a strategy for `team` and its bot `cars`. `settings` are alpha's car settings, read once by the brain.
/// Read other settings named `<strategy>.<key>`; unknown keys are errors.
pub type CreateStrategy =
    fn(&mut Params, usize, &[usize], Settings) -> Result<Box<dyn Strategy>, String>;

/// The branch the core would take for this car this tick, before any skill acts.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum Mode {
    /// Demolished or frozen. Skills are not asked.
    Inactive,
    /// Kickoff approach and flip.
    Kickoff,
    /// The core is in the middle of its own flip or aerial.
    Maneuver,
    /// No wheels on the ground: the core rights the car in the air.
    Airborne,
    /// On a wall or the ceiling: the core uses alpha's controller.
    Wall,
    /// Support or goalkeeper positioning, away from the ball.
    Position,
    /// The ball moves toward the own goal and the car is upfield of it: retreat to the far post or clear.
    Save,
    /// Alpha's timed intercept of a moving ball, with own-goal avoidance.
    Intercept,
    /// Bravo's predicted strike on a low ball, with flips and short aerials.
    Strike,
}

/// The car's team role, chosen by the core each tick.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum Role {
    Attack,
    Support,
    Goalie,
}
impl Role {
    pub fn from_core(role: u8) -> Self {
        match role {
            ATTACK => Self::Attack,
            GOALIE => Self::Goalie,
            _ => Self::Support,
        }
    }
}

/// What a skill sees for one car on one tick.
pub struct Situation<'a> {
    pub ctx: &'a Context<'a>,
    pub world: &'a World,
    /// Shared ball prediction: slices every 1/60 s for four seconds.
    pub predictor: &'a Predictor,
    pub car: &'a Car,
    /// Index of this car among the brain's cars.
    pub index: usize,
    pub team: usize,
    /// 1 for blue, -1 for orange. Blue attacks positive y. Multiply y by `d` to measure upfield.
    pub d: f64,
    pub role: Role,
    pub mode: Mode,
    pub kickoff: bool,
    /// Cars on the team, counting a human teammate. One in most set pieces.
    pub count: usize,
    /// The core's controller for this car: settings, last target, and running maneuver. Read only.
    pub core: &'a Bot,
}

impl Situation<'_> {
    pub fn settings(&self) -> &Settings {
        &self.core.settings
    }
    /// Center of the own goal line, on the floor.
    pub fn own_goal(&self) -> Vec3 {
        Vec3::new(0.0, -self.d * HALF_LENGTH, 0.0)
    }
    /// Center of the rival goal line, on the floor.
    pub fn their_goal(&self) -> Vec3 {
        Vec3::new(0.0, self.d * HALF_LENGTH, 0.0)
    }
    /// How far `p` is toward the rival goal, in field units. Negative in the own half.
    pub fn upfield(&self, p: Vec3) -> f64 {
        p.y * self.d
    }
    /// `p` in the car's frame: x forward, y left, z up.
    pub fn local(&self, p: Vec3) -> Vec3 {
        let r = p.minus(self.car.pos);
        Vec3::new(
            r.dot(self.car.forward),
            r.dot(self.car.left),
            r.dot(self.car.up),
        )
    }
    /// Signed heading error to `p`, in radians. Positive means `p` is to the left.
    pub fn angle_to(&self, p: Vec3) -> f64 {
        let l = self.local(p);
        atan2(l.y, l.x)
    }
    /// The first predicted slice with the ball over the own goal line: a goal against, unless someone acts.
    pub fn threat(&self) -> Option<Slice> {
        let line = GOAL_LINE + self.world.ball.radius;
        self.predictor
            .slices
            .iter()
            .find(|s| -s.pos.y * self.d > line)
            .copied()
    }
    /// The first predicted slice with the ball over the rival goal line.
    pub fn scoring(&self) -> Option<Slice> {
        let line = GOAL_LINE + self.world.ball.radius;
        self.predictor
            .slices
            .iter()
            .find(|s| s.pos.y * self.d > line)
            .copied()
    }
    /// Active cars of the other team.
    pub fn rivals(&self) -> impl Iterator<Item = &Car> {
        self.world
            .cars
            .iter()
            .filter(move |c| c.team != self.team && !c.is_demoed && !c.frozen)
    }
    /// Active cars of this team, other than this car, including a human teammate.
    pub fn mates(&self) -> impl Iterator<Item = &Car> {
        self.world.cars.iter().filter(move |c| {
            c.team == self.team && c.id != self.car.id && !c.is_demoed && !c.frozen
        })
    }
    /// The earliest slice within `horizon` seconds whose ball center is at most `max_z` high and that `reach`
    /// says the car can meet. `reach(slice)` returns the car's estimated arrival time at the slice.
    pub fn first_reachable(
        &self,
        horizon: f64,
        max_z: f64,
        mut reach: impl FnMut(&Slice) -> f64,
    ) -> Option<Slice> {
        self.predictor
            .slices
            .iter()
            .filter(|s| s.t <= horizon && s.pos.z <= max_z)
            .find(|s| reach(s) <= s.t)
            .copied()
    }
}

/// Ground travel time from the car to `target`, ignoring height: a turn penalty, then acceleration to top speed.
/// `boost` assumes boost is held until it runs out. A rough, optimistic estimate for intercept searches.
pub fn ground_time(car: &Car, target: Vec3, boost: bool) -> f64 {
    let delta = Vec3::new(target.x - car.pos.x, target.y - car.pos.y, 0.0);
    let distance = delta.length();
    let angle = atan2(delta.dot(car.left), delta.dot(car.forward)).abs();
    let speed = car.forward_speed().max(0.0);
    let boosted = boost && car.boost > 5.0;
    let maximum = if boosted { 2300.0 } else { 1410.0 };
    let acceleration = if boosted { 1600.0 } else { 900.0 };
    let turn = angle * 0.35;
    let ramp = ((maximum - speed) / acceleration).max(0.0);
    let ramp_distance = speed * ramp + 0.5 * acceleration * ramp * ramp;
    let travel = if distance <= ramp_distance {
        // Solve speed * t + a t² / 2 = distance.
        let a = 0.5 * acceleration;
        (-speed + (speed * speed + 4.0 * a * distance).sqrt()) / (2.0 * a)
    } else {
        ramp + (distance - ramp_distance) / maximum
    };
    turn + travel
}

/// Alpha's ground driver with no reaction delay: steer toward `target` at `speed`, boost when aligned.
pub fn drive_to(car: &Car, target: Vec3, speed: f64, boost: bool) -> Controls {
    let offset = target.minus(car.pos);
    let forward = offset.dot(car.forward);
    let lateral = offset.dot(car.left);
    let angle = atan2(lateral, forward);
    let distance = hypot2(forward, lateral);
    let mut out = Controls {
        steer: clamp(-angle * 3.2 + car.ang_vel.dot(car.up) * 0.18, -1.0, 1.0),
        ..Controls::default()
    };
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
    out
}

/// Rights the car in the air: nose along the horizontal velocity, wheels down.
pub fn recover(car: &Car) -> Controls {
    let mut direction = car.vel;
    direction.z = 0.0;
    let forward = if direction.length_sq() > 100.0 {
        direction.normalized()
    } else {
        Vec3::new(car.forward.x, car.forward.y, 0.0).normalized()
    };
    let mut out = Controls {
        throttle: 1.0,
        ..Controls::default()
    };
    orient(car, forward, Vec3::new(0.0, 0.0, 1.0), &mut out);
    out
}

/// A jump followed by a dodge, with alpha's timing. Hold the car until `step` reports it finished.
/// `pitch` -1 flips forward; `yaw` turns the dodge sideways.
#[derive(Clone, Copy, Debug, Default)]
pub struct Flip {
    pub t: f64,
    pub pitch: f64,
    pub yaw: f64,
}
impl Flip {
    pub fn new(pitch: f64, yaw: f64) -> Self {
        Self { t: 0.0, pitch, yaw }
    }
    /// A flip toward `p`, measured from the car's heading.
    pub fn toward(car: &Car, p: Vec3) -> Self {
        let r = p.minus(car.pos);
        let angle = atan2(r.dot(car.left), r.dot(car.forward));
        Self::new(-crate::math::cos(angle), -crate::math::sin(angle))
    }
    /// Controls for this tick and whether the flip is over.
    pub fn step(&mut self, car: &Car) -> (Controls, bool) {
        let t = self.t;
        self.t += DT;
        let mut out = Controls {
            throttle: 1.0,
            ..Controls::default()
        };
        if t < 0.07 {
            out.jump = true;
        } else if t < 0.1 {
            out.jump = false;
        } else if t < 0.2 {
            out.jump = true;
            out.pitch = clamp(self.pitch, -1.0, 1.0);
            out.yaw = clamp(self.yaw, -1.0, 1.0);
        }
        let done = t >= 0.2 && (t >= 1.1 || car.is_on_ground);
        (out, done)
    }
    pub fn trace(&self, out: &mut Vec<f64>) {
        out.extend([self.t, self.pitch, self.yaw]);
    }
}

/// Alpha's aerial: jump, double jump, then boost along the correction toward the ball's predicted position
/// at the planned arrival time. `step` returns `None` when the aerial gives up or ends.
#[derive(Clone, Copy, Debug, Default)]
pub struct Aerial {
    pub t: f64,
    pub target: Vec3,
    /// Seconds from the start until contact.
    pub arrive: f64,
}
impl Aerial {
    pub fn new(target: Vec3, arrive: f64) -> Self {
        Self {
            t: 0.0,
            target,
            arrive,
        }
    }
    pub fn step(&mut self, car: &Car, predictor: &Predictor) -> Option<Controls> {
        self.t += DT;
        let t = self.t;
        let remaining = self.arrive - t;
        if let Some(slice) = predictor
            .slices
            .iter()
            .find(|s| s.t >= remaining)
            .or(predictor.slices.last())
        {
            self.target = slice.pos;
        }
        if t > 3.0 || remaining < -0.3 || (t > 0.3 && car.is_on_ground) || car.boost <= 0.0 {
            return None;
        }
        let mut out = Controls::default();
        if t < 0.2 {
            out.jump = true;
        } else if t < 0.23 {
            out.jump = false;
        } else if t < 0.27 {
            out.jump = true;
        }
        let time = remaining.max(0.05);
        let mut correction = self.target.minus(car.pos).with_scaled(car.vel, -time);
        correction.z -= 0.5 * -650.0 * time * time;
        let forward = correction.normalized();
        let acceleration = (2.0 * correction.length()) / (time * time);
        orient(car, forward, Vec3::new(0.0, 0.0, 1.0), &mut out);
        out.boost = car.forward.dot(forward) > 0.7 && acceleration > 300.0;
        out.throttle = 1.0;
        Some(out)
    }
    pub fn trace(&self, out: &mut Vec<f64>) {
        out.extend([
            self.t,
            self.target.x,
            self.target.y,
            self.target.z,
            self.arrive,
        ]);
    }
}
