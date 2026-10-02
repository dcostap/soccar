//! Aerial track, entry A: basic aerials for saves, clears, and shots.
//!
//! The skill plans with the game's own physics. It simulates the ball, then rolls out candidate aerials:
//! take off now, hold jump, optionally double jump, and boost along the acceleration that meets the ball
//! at a chosen time. The rollout plays the car and ball together, including the touch, and follows the ball
//! for a while after it. The skill takes the car only when a rollout keeps the ball out of the own goal,
//! or puts it into the rival goal. Other cars are ignored. In the air it replans every few ticks, and it
//! lands on its wheels before handing the car back.
use crate::{
    DT,
    arena::GOAL_LINE,
    ball::Ball,
    brains::{
        Params,
        modular::kit::{Mode, Role, Situation, Skill, orient},
    },
    car::{Car, Controls},
    math::clamp,
    vector::Vec3,
    world::car_ball,
};

/// Boost acceleration in the air, units per second squared.
const BOOST_ACCEL: f64 = 3175.0 / 3.0;
const GRAVITY: Vec3 = Vec3::new(0.0, 0.0, -650.0);
/// Ticks of ball path simulated each tick while the skill is interested.
const HORIZON: usize = 300;
/// Ticks the rollout follows the ball after the touch.
const FOLLOW: usize = 150;
/// A search tick long ago.
const NEVER: i64 = -1_000_000;

#[derive(Clone, Copy, Debug, PartialEq)]
struct Plan {
    /// Tick of the planned touch, in world ticks.
    arrive: i64,
    /// Tick of takeoff.
    start: i64,
    /// Ticks to hold the first jump; zero when the plan starts in the air.
    hold: u32,
    /// Double jump after the first jump.
    double: bool,
    /// Distance from the ball center to the car center at contact, along the hit direction.
    offset: f64,
    /// Attack: aim at the rival goal. Otherwise clear away from the own goal.
    attack: bool,
}

#[derive(Clone, Debug)]
struct Aerial {
    enabled: bool,
    /// Lowest ball height worth an aerial.
    min_height: f64,
    /// Earliest and latest planned touch, in seconds.
    min_time: f64,
    max_time: f64,
    /// Ticks between plans on the ground and in the air.
    every: i64,
    /// Ticks to wait after a search that found nothing.
    idle: i64,
    /// Allow shots, not only saves.
    shots: bool,
    /// Most rollouts in one search.
    budget: usize,
    /// Ticks between candidate touch times.
    step: usize,
    /// Touch offsets tried per touch time: 1 or 2.
    offsets: usize,
    /// A search plays one of `spread` interleaved shares of the candidates, so the cost spreads over ticks.
    spread: usize,
    /// Aerial shots only with the ball at least this far upfield.
    shotzone: f64,
    plan: Option<Plan>,
    /// Tick of the last plan search.
    searched: i64,
    /// Landing: the plan ended in the air.
    landing: bool,
}

pub fn create(params: &mut Params) -> Result<Box<dyn Skill>, String> {
    Ok(Box::new(Aerial {
        enabled: params.flag("aerial-a.enabled", true)?,
        min_height: params.number("aerial-a.minheight", 230.0)?,
        min_time: params.number("aerial-a.mintime", 0.25)?,
        max_time: params.number("aerial-a.maxtime", 2.2)?,
        every: params.number("aerial-a.every", 4.0)?.max(1.0) as i64,
        idle: params.number("aerial-a.idle", 8.0)?.max(1.0) as i64,
        shots: params.flag("aerial-a.shots", true)?,
        budget: params.number("aerial-a.budget", 30.0)?.max(1.0) as usize,
        step: params.number("aerial-a.step", 12.0)?.max(1.0) as usize,
        offsets: params.number("aerial-a.offsets", 1.0)?.clamp(1.0, 2.0) as usize,
        spread: params.number("aerial-a.spread", 2.0)?.max(1.0) as usize,
        shotzone: params.number("aerial-a.shotzone", 2000.0)?,
        plan: None,
        searched: NEVER,
        landing: false,
    }))
}

/// Whether the car could touch a ball at `ball` after `t` seconds: no car moves faster than 2300,
/// and contact needs the car center within about 300 of the ball center.
fn within_reach(car: &Car, ball: Vec3, t: f64) -> bool {
    let reach = 2300.0 * t + 300.0;
    let dx = ball.x - car.pos.x;
    let dy = ball.y - car.pos.y;
    dx * dx + dy * dy <= reach * reach
}

/// One physics tick of a single car and the ball, in the world's order.
fn step(car: &mut Car, ball: &mut Ball, controls: Controls, tick: i64) -> bool {
    car.controls = controls;
    car.pre_step(DT, Some(ball));
    ball.integrate_forces(DT);
    car.integrate_position(DT);
    ball.integrate_position(DT);
    ball.collide_world();
    car.collide_world();
    let touched = car_ball(car, ball, tick).is_some();
    ball.clamp_velocities();
    car.post_step(DT);
    touched
}

/// The untouched ball path: `path[k]` is the ball after `k + 1` ticks.
fn ball_path(ball: &Ball, ticks: usize) -> Vec<Ball> {
    let mut b = *ball;
    (0..ticks)
        .map(|_| {
            b.step();
            b
        })
        .collect()
}

/// Where the ball should go after the touch.
fn hit_direction(plan: &Plan, ball: Vec3, d: f64) -> Vec3 {
    if plan.attack {
        let goal = Vec3::new(clamp(ball.x, -600.0, 600.0), d * (GOAL_LINE + 300.0), 320.0);
        goal.minus(ball).normalized()
    } else {
        // Away from the own goal center, toward the near side wall, slightly upward.
        let own = Vec3::new(0.0, -d * GOAL_LINE, 0.0);
        let mut away = ball.minus(own);
        away.z = 0.0;
        let away = away.normalized();
        Vec3::new(away.x * 1.4, away.y, 0.25).normalized()
    }
}

/// Controls that fly `car` toward the touch point of `plan`. `path[k]` is the ball `k + 1` ticks after `now`.
fn fly(car: &Car, plan: &Plan, now: i64, path: &[Ball], d: f64) -> Controls {
    let elapsed = now - plan.start;
    let mut out = Controls {
        throttle: 1.0,
        ..Controls::default()
    };
    // Takeoff: hold the jump, release, then double jump.
    if plan.hold > 0 {
        let hold = i64::from(plan.hold);
        out.jump = elapsed < hold || (plan.double && (elapsed == hold + 2 || elapsed == hold + 3));
    }
    let ahead = plan.arrive - now;
    let target_ball = if ahead >= 1 {
        path.get((ahead - 1) as usize).or(path.last())
    } else {
        None
    };
    let Some(target_ball) = target_ball else {
        // Past the touch: land on the wheels, nose along the velocity.
        let mut v = car.vel;
        v.z = 0.0;
        let forward = if v.length_sq() > 100.0 {
            v.normalized()
        } else {
            Vec3::new(car.forward.x, car.forward.y, 0.0).normalized()
        };
        orient(car, forward, Vec3::new(0.0, 0.0, 1.0), &mut out);
        return out;
    };
    let tau = ahead as f64 * DT;
    let direction = hit_direction(plan, target_ball.pos, d);
    let target = target_ball.pos.with_scaled(direction, -plan.offset);
    // Acceleration that brings the car center to the target at the touch tick.
    let drift = car
        .pos
        .with_scaled(car.vel, tau)
        .with_scaled(GRAVITY, 0.5 * tau * tau);
    let need = target.minus(drift).scaled(2.0 / (tau * tau).max(1e-4));
    let size = need.length();
    // Point the nose along the needed acceleration; once it is small, point it through the ball.
    let nose = if size > 150.0 {
        need.scaled(1.0 / size)
    } else {
        direction
    };
    let up = Vec3::new(0.0, 0.0, 1.0);
    orient(car, nose, up, &mut out);
    let along = need.dot(car.forward);
    out.boost = car.boost > 0.0 && car.forward.dot(nose) > 0.8 && along > BOOST_ACCEL * 0.3;
    // Keep the pitch input off while the first jump is held on the ground: it would tip the car.
    if car.is_on_ground {
        out.pitch = 0.0;
        out.yaw = 0.0;
        out.roll = 0.0;
    }
    out
}

/// Result of one rollout.
#[derive(Clone, Copy, Debug)]
struct Rollout {
    touched: bool,
    /// The ball entered the own goal (-1), the rival goal (1), or neither (0).
    goal: i8,
}

fn rollout(s: &Situation, plan: &Plan, path: &[Ball]) -> Rollout {
    let d = s.d;
    let mut car = s.car.clone();
    let mut ball = s.world.ball;
    let now = s.world.tick;
    let line = GOAL_LINE + ball.radius;
    let mut touched_at = None;
    let end = (plan.arrive - now) as usize + FOLLOW;
    let arrive = (plan.arrive - now) as usize;
    for k in 0..end {
        let tick = now + k as i64;
        if touched_at.is_some() {
            // After the touch, follow the ball alone.
            ball.step();
        } else {
            // The ball path from this tick on, valid until the touch.
            let rest = path.get(k..).unwrap_or(&[]);
            let controls = fly(&car, plan, tick, rest, d);
            if step(&mut car, &mut ball, controls, tick) {
                touched_at = Some(k);
            }
        }
        if ball.pos.y * d < -line {
            return Rollout {
                touched: touched_at.is_some(),
                goal: -1,
            };
        }
        if ball.pos.y * d > line {
            return Rollout {
                touched: touched_at.is_some(),
                goal: 1,
            };
        }
        if touched_at.is_none() && k > arrive + 12 {
            // Missed the planned touch.
            break;
        }
    }
    Rollout {
        touched: touched_at.is_some(),
        goal: 0,
    }
}

impl Aerial {
    /// Candidate plans whose touches fall between `min_time` and `max_time`.
    fn candidates(&self, s: &Situation, path: &[Ball], attack: bool) -> Vec<Plan> {
        let now = s.world.tick;
        let grounded = s.car.is_on_ground;
        let mut plans = Vec::new();
        let first = (self.min_time / DT) as usize;
        let last = ((self.max_time / DT) as usize).min(path.len());
        let offsets: &[f64] = if self.offsets == 1 {
            &[130.0]
        } else {
            &[110.0, 150.0]
        };
        for k in (first..last).step_by(self.step) {
            let b = &path[k - 1];
            if b.pos.z < self.min_height || !within_reach(s.car, b.pos, k as f64 * DT) {
                continue;
            }
            let shapes: &[(u32, bool)] = if grounded {
                &[(24, true), (24, false), (10, false)]
            } else {
                &[(0, false)]
            };
            for &(hold, double) in shapes {
                for &offset in offsets {
                    plans.push(Plan {
                        arrive: now + k as i64,
                        start: now,
                        hold,
                        double,
                        offset,
                        attack,
                    });
                }
            }
        }
        plans
    }

    /// Plays candidates from the earliest touch on and returns the first that works.
    /// Each search plays one interleaved share of the candidates and at most `budget` rollouts.
    fn search(&self, s: &Situation, path: &[Ball], attack: bool) -> Option<Plan> {
        let spread = self.spread as i64;
        let phase = (s.world.tick / self.every).rem_euclid(spread) as usize;
        let plans = self.candidates(s, path, attack);
        for plan in plans
            .into_iter()
            .enumerate()
            .filter(|(i, _)| i % self.spread == phase)
            .map(|(_, p)| p)
            .take(self.budget)
        {
            let r = rollout(s, &plan, path);
            let works = r.touched
                && match r.goal {
                    -1 => false,
                    1 => true,
                    _ => !attack,
                };
            if works {
                return Some(plan);
            }
        }
        None
    }

    /// Whether this car should consider an aerial now: `Some(true)` for a shot, `Some(false)` for a save.
    /// Uses the shared predictor, so it is cheap.
    fn interested(&self, s: &Situation) -> Option<bool> {
        if !matches!(
            s.mode,
            Mode::Save | Mode::Intercept | Mode::Strike | Mode::Position | Mode::Maneuver
        ) {
            return None;
        }
        let high = s
            .predictor
            .slices
            .iter()
            .take_while(|b| b.t <= self.max_time)
            .any(|b| b.pos.z > self.min_height && within_reach(s.car, b.pos, b.t));
        if !high {
            return None;
        }
        if s.threat().is_some() {
            // Any car may save; supports only when close to their own goal.
            if s.role == Role::Attack || s.count == 1 || s.upfield(s.car.pos) < -2500.0 {
                return Some(false);
            }
            return None;
        }
        if self.shots && s.role == Role::Attack && s.upfield(s.world.ball.pos) > self.shotzone {
            return Some(true);
        }
        None
    }
}

impl Skill for Aerial {
    fn claim(&mut self, s: &Situation, holding: bool) -> Option<Controls> {
        if !self.enabled {
            return None;
        }
        let now = s.world.tick;
        if !holding {
            self.plan = None;
            self.landing = false;
        }
        if self.landing {
            if s.car.is_on_ground || s.car.num_wheels_in_contact > 0 {
                self.landing = false;
                self.plan = None;
                return None;
            }
            let mut out = Controls {
                throttle: 1.0,
                ..Controls::default()
            };
            let mut v = s.car.vel;
            v.z = 0.0;
            let forward = if v.length_sq() > 100.0 {
                v.normalized()
            } else {
                Vec3::new(s.car.forward.x, s.car.forward.y, 0.0).normalized()
            };
            orient(s.car, forward, Vec3::new(0.0, 0.0, 1.0), &mut out);
            return Some(out);
        }
        if let Some(plan) = self.plan {
            let path = ball_path(&s.world.ball, HORIZON);
            if now >= plan.arrive + 6 || s.world.last_touch == Some(s.car.id) && now > plan.arrive {
                self.plan = None;
                if s.car.is_on_ground {
                    return None;
                }
                self.landing = true;
                return self.claim(s, true);
            }
            // Check the plan in the air. If it no longer works, try a slightly earlier or later touch.
            if !s.car.is_on_ground && now - self.searched >= self.every {
                self.searched = now;
                let current = rollout(s, &plan, &path);
                if !current.touched || current.goal == -1 {
                    for shift in [-12, -6, 6, 12] {
                        let candidate = Plan {
                            arrive: plan.arrive + shift,
                            ..plan
                        };
                        if candidate.arrive <= now + 1 {
                            continue;
                        }
                        let r = rollout(s, &candidate, &path);
                        if r.touched && r.goal != -1 {
                            self.plan = Some(candidate);
                            break;
                        }
                    }
                }
            }
            let plan = self.plan.unwrap();
            return Some(fly(s.car, &plan, now, &path, s.d));
        }
        // Start a new aerial only from the ground with wheels down, upright.
        if !s.car.is_on_ground || s.car.up.z < 0.9 || now - self.searched < self.every {
            return None;
        }
        let attack = self.interested(s)?;
        self.searched = now;
        let path = ball_path(&s.world.ball, HORIZON);
        let Some(plan) = self.search(s, &path, attack) else {
            // Nothing works now. Wait a little longer before the next search.
            self.searched = now + self.idle - self.every;
            return None;
        };
        self.plan = Some(plan);
        Some(fly(s.car, &plan, now, &path, s.d))
    }

    fn reset(&mut self) {
        self.plan = None;
        self.searched = NEVER;
        self.landing = false;
    }

    fn trace(&self, out: &mut Vec<f64>) {
        match self.plan {
            None => out.push(0.0),
            Some(p) => out.extend([
                1.0,
                p.arrive as f64,
                p.start as f64,
                f64::from(p.hold),
                p.double as u8 as f64,
                p.offset,
                p.attack as u8 as f64,
            ]),
        }
        out.extend([self.searched as f64, self.landing as u8 as f64]);
    }

    fn clone_box(&self) -> Box<dyn Skill> {
        Box::new(self.clone())
    }
}
