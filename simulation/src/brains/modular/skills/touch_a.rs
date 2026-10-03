//! Touch A plans a low first touch with a short, private physics rollout.
//! It takes only an attacker with a moving ball or a poor approach angle.
//! It releases the car after contact, a missed arrival, or a changed role.
use crate::{
    DT,
    arena::GOAL_LINE,
    ball::Ball,
    brains::{
        Params,
        modular::kit::{Mode, Role, Situation, Skill, drive, own_goal_touch},
    },
    car::{Car, Controls},
    math::{clamp, hypot2},
    vector::Vec3,
    world::car_ball,
};

#[derive(Clone, Copy, Debug)]
struct Plan {
    start: i64,
    arrive: i64,
    offset: f64,
}

#[derive(Clone, Debug)]
struct Touch {
    enabled: bool,
    plan: Option<Plan>,
    searched: i64,
}

pub fn create(params: &mut Params) -> Result<Box<dyn Skill>, String> {
    Ok(Box::new(Touch {
        enabled: params.flag("touch-a.enabled", true)?,
        plan: None,
        searched: -1_000_000,
    }))
}

fn direction(ball: Vec3, d: f64) -> Vec3 {
    let mut aim = Vec3::new(clamp(ball.x, -500.0, 500.0), d * (GOAL_LINE + 250.0), 0.0).minus(ball);
    aim.z = 0.0;
    aim.normalized()
}

fn controls(car: &Car, ball: Vec3, plan: Plan, now: i64, d: f64) -> Controls {
    let remaining = (plan.arrive - now).max(1) as f64 * DT;
    let offset = plan.offset * clamp(remaining / 0.4, 0.0, 1.0);
    let target = ball.with_scaled(direction(ball, d), -offset);
    drive(car, target, 2300.0, car.boost > 0.0)
}

fn path(ball: Ball, ticks: usize) -> Vec<Ball> {
    let mut ball = ball;
    (0..ticks)
        .map(|_| {
            ball.step();
            ball
        })
        .collect()
}

// Use the same order as the world. No rival or teammate is changed.
fn step(car: &mut Car, ball: &mut Ball, out: Controls, tick: i64) -> bool {
    car.controls = out;
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

fn scores(s: &Situation, plan: Plan, path: &[Ball]) -> bool {
    let mut car = s.car.clone();
    let mut ball = s.world.ball;
    let now = s.world.tick;
    let end = (plan.arrive - now + 30) as usize;
    let target = path[(plan.arrive - now - 1) as usize].pos;
    let mut touched = false;
    for k in 0..end {
        let out = controls(&car, target, plan, now + k as i64, s.d);
        if step(&mut car, &mut ball, out, now + k as i64) {
            touched = true;
            break;
        }
    }
    if !touched {
        return false;
    }
    for _ in 0..240 {
        if ball.pos.y * s.d < -(GOAL_LINE + ball.radius) {
            return false;
        }
        if ball.pos.y * s.d > GOAL_LINE + ball.radius {
            return true;
        }
        ball.step();
    }
    false
}

impl Touch {
    fn eligible(&self, s: &Situation) -> bool {
        let ball = s.world.ball;
        self.enabled
            && s.count >= 1
            && s.count <= 3
            && s.role == Role::Attack
            && matches!(s.mode, Mode::Strike | Mode::Intercept)
            && s.car.is_on_ground
            && s.car.up.z > 0.9
            && s.upfield(ball.pos) > 0.0
            && ball.pos.z < 180.0
            && s.threat().is_none()
            && !own_goal_touch(s.car.pos, ball.pos, s.d)
            && hypot2(ball.pos.x - s.car.pos.x, ball.pos.y - s.car.pos.y) < 2200.0
            && (hypot2(ball.vel.x, ball.vel.y) > 250.0 || s.angle_to(ball.pos).abs() > 0.6)
    }
}

impl Skill for Touch {
    fn claim(&mut self, s: &Situation, holding: bool) -> Option<Controls> {
        let now = s.world.tick;
        if !holding {
            self.plan = None;
        }
        if holding && self.plan.is_some() {
            if s.car.last_ball_touch_tick >= self.plan.unwrap().start || !self.eligible(s) {
                self.plan = None;
                return None;
            }
            let p = self.plan.unwrap();
            if now >= p.arrive + 24 {
                self.plan = None;
                return None;
            }
            let ahead = (p.arrive - now).max(1) as f64 * DT;
            let ball = s.predictor.slices.iter().find(|b| b.t >= ahead)?.pos;
            return Some(controls(s.car, ball, p, now, s.d));
        }
        if !self.eligible(s) || now - self.searched < 18 {
            return None;
        }
        self.searched = now;
        let balls = path(s.world.ball, 150);
        for ticks in [36, 60, 84, 108, 132] {
            let ball = balls[ticks - 1].pos;
            if ball.z > 150.0 || own_goal_touch(s.car.pos, ball, s.d) {
                continue;
            }
            if s.car.pos.distance(ball) > ticks as f64 * DT * 2300.0 + 200.0 {
                continue;
            }
            for offset in [120.0, 350.0] {
                let plan = Plan {
                    start: now,
                    arrive: now + ticks as i64,
                    offset,
                };
                if scores(s, plan, &balls) {
                    self.plan = Some(plan);
                    return Some(controls(s.car, ball, plan, now, s.d));
                }
            }
        }
        None
    }

    fn reset(&mut self) {
        self.plan = None;
        self.searched = -1_000_000;
    }
    fn trace(&self, out: &mut Vec<f64>) {
        match self.plan {
            None => out.push(0.0),
            Some(p) => out.extend([1.0, p.start as f64, p.arrive as f64, p.offset]),
        }
        out.push(self.searched as f64);
    }
    fn clone_box(&self) -> Box<dyn Skill> {
        Box::new(self.clone())
    }
}
