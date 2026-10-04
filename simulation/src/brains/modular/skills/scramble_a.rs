//! Clear a low contested ball across the own box, away from the goal mouth.
use crate::{
    brains::{
        Params,
        modular::kit::{Mode, Role, Situation, Skill, drive_to, own_goal_touch},
    },
    car::Controls,
    math::{clamp, hypot2},
    vector::Vec3,
};

#[derive(Clone, Debug)]
struct Scramble {
    radius: f64,
}

pub fn create(params: &mut Params) -> Result<Box<dyn Skill>, String> {
    Ok(Box::new(Scramble {
        radius: params.number("scramble-a.radius", 1700.0)?,
    }))
}

impl Skill for Scramble {
    fn claim(&mut self, s: &Situation, _holding: bool) -> Option<Controls> {
        let ball = s.world.ball.pos;
        let car = s.car;
        if s.kickoff
            || !(1..=3).contains(&s.count)
            || !matches!(s.role, Role::Attack | Role::Goalie)
            || !matches!(s.mode, Mode::Strike | Mode::Intercept | Mode::Save)
            || !car.is_on_ground
            || car.up.z < 0.8
            || s.upfield(ball) > -2800.0
            || ball.z > 160.0
            || s.world.ball.vel.length() > 900.0
            || car.pos.distance(ball) > 1100.0
            || !s.rivals().any(|r| r.pos.distance(ball) < self.radius)
        {
            return None;
        }
        // Do not take another car's close touch in team play.
        if s.count > 1
            && s.mates()
                .any(|m| m.pos.distance(ball) + 150.0 < car.pos.distance(ball))
        {
            return None;
        }
        // A direct side clearance is useful only when the core's goalward approach is unsafe.
        if !own_goal_touch(car.pos, ball, s.d) {
            return None;
        }
        let side = if ball.x > car.pos.x { 1.0 } else { -1.0 };
        let aim = Vec3::new(side, s.d * 0.35, 0.0).normalized();
        let predicted = ball.with_scaled(s.world.ball.vel, 0.12);
        let target = predicted.with_scaled(aim, -110.0);
        let delta = target.minus(car.pos);
        let distance = hypot2(delta.x, delta.y);
        let speed = clamp(distance * 2.5, 650.0, 1600.0);
        Some(drive_to(car, target, speed, s.settings().boost))
    }

    fn clone_box(&self) -> Box<dyn Skill> {
        Box::new(self.clone())
    }
}
