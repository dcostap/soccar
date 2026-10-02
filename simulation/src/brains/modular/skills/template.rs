//! A worked example of a skill. Copy this file to start a new one.
//!
//! It takes the car for one reflex: when the car is grounded, the ball is close above it, and the ball is
//! predicted to enter the own goal, it jumps to block. Off by default (`template.enabled = false`), so
//! `skills = template` without settings drives exactly as the baseline.
use crate::{
    brains::{
        Params,
        modular::kit::{Mode, Situation, Skill},
    },
    car::Controls,
};

#[derive(Clone, Debug)]
struct Template {
    enabled: bool,
    /// Ball height above the car that triggers the block.
    height: f64,
    /// Ticks left in the current jump. Per-car state: one instance exists per car.
    jumping: u32,
}

pub fn create(params: &mut Params) -> Result<Box<dyn Skill>, String> {
    Ok(Box::new(Template {
        enabled: params.flag("template.enabled", false)?,
        height: params.number("template.height", 250.0)?,
        jumping: 0,
    }))
}

impl Skill for Template {
    fn claim(&mut self, s: &Situation, holding: bool) -> Option<Controls> {
        if holding && self.jumping > 0 {
            // Finish the jump we started.
            self.jumping -= 1;
            return Some(Controls {
                jump: true,
                throttle: 1.0,
                ..Controls::default()
            });
        }
        self.jumping = 0;
        if !self.enabled || !matches!(s.mode, Mode::Save | Mode::Intercept | Mode::Strike) {
            return None;
        }
        let ball = s.world.ball.pos;
        let above = ball.z - s.car.pos.z;
        let near = s.local(ball);
        if s.car.is_on_ground
            && s.threat().is_some()
            && above > 120.0
            && above < self.height
            && near.x.abs() < 250.0
            && near.y.abs() < 200.0
        {
            self.jumping = 24;
            return Some(Controls {
                jump: true,
                throttle: 1.0,
                ..Controls::default()
            });
        }
        None
    }

    fn reset(&mut self) {
        self.jumping = 0;
    }

    fn trace(&self, out: &mut Vec<f64>) {
        out.push(self.jumping as f64);
    }

    fn clone_box(&self) -> Box<dyn Skill> {
        Box::new(self.clone())
    }
}
