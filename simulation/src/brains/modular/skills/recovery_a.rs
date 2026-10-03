//! Test short ground routes before a full retreat to the goal.
use crate::{
    DT,
    arena::GOAL_LINE,
    ball::Ball,
    brains::{Params, modular::kit::{Mode, Role, Situation, Skill, drive_to}},
    car::{Car, Controls},
    vector::Vec3,
    world::car_ball,
};

#[derive(Clone, Debug)]
struct RecoveryA {
    target: Option<Vec3>,
    until: i64,
    searched: i64,
}

pub fn create(_params: &mut Params) -> Result<Box<dyn Skill>, String> {
    Ok(Box::new(RecoveryA { target: None, until: 0, searched: -1000 }))
}

// Use the same step order as the world. Other cars and pads do not enter this test.
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

fn route(s: &Situation, target: Vec3) -> Option<i64> {
    let mut car = s.car.clone();
    let mut ball = s.world.ball;
    let mut contact = None;
    for k in 1..=300 {
        if contact.is_none() {
            let controls = drive_to(&car, target, 2300.0, true);
            if step(&mut car, &mut ball, controls, s.world.tick + k) {
                contact = Some(k);
            }
        } else {
            ball.step();
        }
        if -ball.pos.y * s.d > GOAL_LINE + ball.radius {
            return None;
        }
    }
    contact
}

impl Skill for RecoveryA {
    fn claim(&mut self, s: &Situation, holding: bool) -> Option<Controls> {
        let tick = s.world.tick;
        if holding && tick < self.until && s.car.is_on_ground && s.car.up.z > 0.9
            && s.world.ball.pos.z < 220.0 && s.world.ball.vel.y * s.d < -200.0
            && let Some(target) = self.target
        {
            return Some(drive_to(s.car, target, 2300.0, true));
        }
        self.target = None;
        if s.count == 0 || s.role != Role::Attack || s.mode != Mode::Save
            || !s.car.is_on_ground || s.car.up.z < 0.9
            || s.world.ball.pos.z > 180.0 || s.world.ball.vel.y * s.d > -500.0
            || (s.car.pos.y - s.world.ball.pos.y) * s.d < 200.0
            || tick - self.searched < 12 || s.threat().is_none()
        {
            return None;
        }
        self.searched = tick;
        for slice in s.predictor.slices.iter().step_by(30).skip(1) {
            if slice.t > 3.0 || slice.pos.z > 180.0 {
                continue;
            }
            for side in [-1.0, 1.0] {
                let target = Vec3::new(slice.pos.x + side * 150.0, slice.pos.y, 0.0);
                if s.car.pos.distance(target) > 2300.0 * slice.t + 300.0 {
                    continue;
                }
                if let Some(contact) = route(s, target) {
                    self.target = Some(target);
                    self.until = tick + contact;
                    return Some(drive_to(s.car, target, 2300.0, true));
                }
            }
        }
        None
    }

    fn reset(&mut self) {
        self.target = None;
        self.until = 0;
        self.searched = -1000;
    }

    fn trace(&self, out: &mut Vec<f64>) {
        out.extend([self.until as f64, self.searched as f64]);
        out.push(if self.target.is_some() { 1.0 } else { 0.0 });
        let target = self.target.unwrap_or_default();
        out.extend([target.x, target.y, target.z]);
    }

    fn clone_box(&self) -> Box<dyn Skill> {
        Box::new(self.clone())
    }
}
