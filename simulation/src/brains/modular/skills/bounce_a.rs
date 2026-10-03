//! Ground saves after a predicted floor or wall bounce.
//! The skill tests a timed approach with car and ball physics before it claims the car.
use crate::{
    DT,
    arena::GOAL_LINE,
    ball::Ball,
    brains::{
        Params,
        modular::kit::{Mode, Role, Situation, Skill, drive_to, ground_time},
    },
    car::{Car, Controls},
    math::{clamp, hypot2},
    vector::Vec3,
    world::car_ball,
};

#[derive(Clone, Copy, Debug)]
struct Plan {
    target: Vec3,
    arrive: i64,
    start: i64,
}

#[derive(Clone, Debug)]
struct Bounce {
    enabled: bool,
    plan: Option<Plan>,
    searched: i64,
}

pub fn create(params: &mut Params) -> Result<Box<dyn Skill>, String> {
    Ok(Box::new(Bounce {
        enabled: params.flag("bounce-a.enabled", true)?,
        plan: None,
        searched: -1_000_000,
    }))
}

fn controls(car: &Car, plan: Plan, now: i64) -> Controls {
    let remaining = ((plan.arrive - now) as f64 * DT).max(0.08);
    let distance = hypot2(plan.target.x - car.pos.x, plan.target.y - car.pos.y);
    let speed = if remaining < 0.3 {
        2300.0
    } else {
        clamp(distance / remaining, 400.0, 2300.0)
    };
    drive_to(car, plan.target, speed, true)
}

/// Test contact and follow the resulting ball through the original threat time.
fn saves(s: &Situation, plan: Plan, threat: f64) -> bool {
    let mut car = s.car.clone();
    let mut ball: Ball = s.world.ball;
    let mut touched = false;
    let end = ((threat + 0.8).min(4.8) / DT) as usize;
    for k in 0..end {
        let now = s.world.tick + k as i64;
        if touched {
            ball.step();
        } else {
            car.controls = controls(&car, plan, now);
            car.pre_step(DT, Some(&mut ball));
            ball.integrate_forces(DT);
            car.integrate_position(DT);
            ball.integrate_position(DT);
            ball.collide_world();
            car.collide_world();
            touched = car_ball(&mut car, &mut ball, now).is_some();
            ball.clamp_velocities();
            car.post_step(DT);
        }
        if ball.pos.y * s.d < -(GOAL_LINE + ball.radius) {
            return false;
        }
        if !touched && now > plan.arrive + 24 {
            return false;
        }
    }
    touched
}

impl Skill for Bounce {
    fn claim(&mut self, s: &Situation, holding: bool) -> Option<Controls> {
        if !holding {
            self.plan = None;
        }
        if !self.enabled
            || s.kickoff
            || !s.car.is_on_ground
            || s.car.up.z < 0.9
            || !matches!(
                s.mode,
                Mode::Save | Mode::Intercept | Mode::Strike | Mode::Position
            )
            || (s.count > 1 && s.role == Role::Support)
        {
            self.plan = None;
            return None;
        }
        let Some(threat) = s.threat() else {
            self.plan = None;
            return None;
        };
        if s.upfield(s.world.ball.pos) > 0.0 {
            self.plan = None;
            return None;
        }
        if let Some(p) = self.plan {
            let interrupted = s
                .world
                .cars
                .iter()
                .any(|car| car.last_ball_touch_tick >= p.start);
            if s.world.tick <= p.arrive + 12 && !interrupted {
                return Some(controls(s.car, p, s.world.tick));
            }
            self.plan = None;
            return None;
        }
        if s.world.tick - self.searched < 12 {
            return None;
        }
        self.searched = s.world.tick;
        // A bounce changes normal velocity abruptly. Gravity alone cannot trigger this test.
        let mut prior = s.world.ball.vel;
        let mut bounced = false;
        let mut trials = 0;
        for slice in s.predictor.slices.iter() {
            if slice.t > threat.t.min(3.5) {
                break;
            }
            let change = slice.vel.minus(prior);
            if change.z > 180.0 || change.x.abs() > 350.0 || change.y.abs() > 350.0 {
                bounced = true;
            }
            prior = slice.vel;
            if !bounced
                || slice.t < 0.2
                || slice.pos.z > 155.0
                || ground_time(s.car, slice.pos, true) > slice.t + 0.15
            {
                continue;
            }
            // Approach from the own-goal side. Do not plan a touch toward the own goal.
            let mut away = slice.pos.minus(s.own_goal());
            away.z = 0.0;
            let target = slice.pos.with_scaled(away.normalized(), -70.0);
            if (s.car.pos.y - slice.pos.y) * s.d > 100.0 {
                continue;
            }
            let plan = Plan {
                target,
                arrive: s.world.tick + (slice.t / DT) as i64,
                start: s.world.tick,
            };
            trials += 1;
            if saves(s, plan, threat.t) {
                self.plan = Some(plan);
                return Some(controls(s.car, plan, s.world.tick));
            }
            if trials >= 6 {
                break;
            }
        }
        None
    }

    fn reset(&mut self) {
        self.plan = None;
        self.searched = -1_000_000;
    }
    fn trace(&self, out: &mut Vec<f64>) {
        out.push(self.searched as f64);
        match self.plan {
            Some(p) => out.extend([
                1.0,
                p.target.x,
                p.target.y,
                p.target.z,
                p.arrive as f64,
                p.start as f64,
            ]),
            None => out.push(0.0),
        }
    }
    fn clone_box(&self) -> Box<dyn Skill> {
        Box::new(self.clone())
    }
}
