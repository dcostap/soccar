//! Meet a low shot from the goal side, without aiming a shot at the far goal.
use crate::{
    brains::{
        Params,
        modular::kit::{Mode, Role, Situation, Skill, drive_to, ground_time},
    },
    car::Controls,
    math::{clamp, hypot2},
};

#[derive(Clone, Debug)]
struct BlockingA;

pub fn create(_params: &mut Params) -> Result<Box<dyn Skill>, String> {
    Ok(Box::new(BlockingA))
}

impl Skill for BlockingA {
    fn claim(&mut self, s: &Situation, _holding: bool) -> Option<Controls> {
        if s.kickoff
            || !matches!(
                s.mode,
                Mode::Save | Mode::Intercept | Mode::Strike | Mode::Position
            )
            || !s.car.is_on_ground
            || s.car.up.z < 0.9
            || (s.count > 1 && !matches!(s.role, Role::Goalie | Role::Attack))
        {
            return None;
        }
        let ball = s.world.ball.pos;
        let threat = s.threat()?;
        if threat.t > 3.0
            || ball.z > 180.0
            || s.upfield(ball) > -1000.0
            || s.world.ball.vel.y * s.d > -300.0
            || s.upfield(s.car.pos) > s.upfield(ball) - 60.0
        {
            return None;
        }
        let slice = s.first_reachable(threat.t.min(1.5), 150.0, |slice| {
            let mut target = slice.pos;
            target.y -= s.d * 70.0;
            ground_time(s.car, target, true)
        })?;
        let mut target = slice.pos;
        target.y -= s.d * 70.0;
        let distance = hypot2(target.x - s.car.pos.x, target.y - s.car.pos.y);
        let speed = clamp(distance / slice.t.max(0.05), 400.0, 2300.0);
        Some(drive_to(s.car, target, speed, true))
    }
    fn clone_box(&self) -> Box<dyn Skill> {
        Box::new(self.clone())
    }
}
