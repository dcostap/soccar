//! Ball dynamics. Collision radius differs from physical radius.
use crate::{DT, arena, vector::Vec3};

pub const STATE_FIELDS: usize = 13;
pub const TRACE_FIELDS: usize = 17;
pub const PHYSICAL_RADIUS: f64 = 91.25;
pub const COLLISION_RADIUS: f64 = 93.15;

#[derive(Clone, Copy, Debug)]
pub struct Ball {
    pub pos: Vec3,
    pub vel: Vec3,
    pub ang_vel: Vec3,
    pub radius: f64,
    pub mass: f64,
    pub last_world_hit_speed: f64,
    pub frozen: bool,
}

impl Default for Ball {
    fn default() -> Self {
        Self {
            pos: Vec3::new(0.0, 0.0, COLLISION_RADIUS),
            vel: Vec3::default(),
            ang_vel: Vec3::default(),
            radius: PHYSICAL_RADIUS,
            mass: 30.0,
            last_world_hit_speed: 0.0,
            frozen: false,
        }
    }
}

impl Ball {
    pub fn reset(&mut self, x: f64, y: f64, z: f64) {
        self.pos = Vec3::new(x, y, z);
        self.vel = Vec3::default();
        self.ang_vel = Vec3::default();
        self.frozen = false;
    }
    pub fn copy_from(&mut self, other: &Self) {
        self.pos = other.pos;
        self.vel = other.vel;
        self.ang_vel = other.ang_vel;
    }
    /// True when both balls evolve identically from here: every input of `step` matches bit for bit.
    pub fn same_motion(&self, other: &Self) -> bool {
        let bits = |b: &Self| {
            [
                b.pos.x,
                b.pos.y,
                b.pos.z,
                b.vel.x,
                b.vel.y,
                b.vel.z,
                b.ang_vel.x,
                b.ang_vel.y,
                b.ang_vel.z,
                b.radius,
                b.mass,
            ]
            .map(f64::to_bits)
        };
        self.frozen == other.frozen && bits(self) == bits(other)
    }
    pub fn from_state(state: [f64; STATE_FIELDS]) -> Self {
        Self {
            pos: Vec3::new(state[0], state[1], state[2]),
            vel: Vec3::new(state[3], state[4], state[5]),
            ang_vel: Vec3::new(state[6], state[7], state[8]),
            radius: state[9],
            mass: state[10],
            last_world_hit_speed: state[11],
            frozen: state[12] != 0.0,
        }
    }

    pub fn trace(&self) -> [f64; TRACE_FIELDS] {
        let normal = arena::normal(self.pos);
        [
            self.pos.x,
            self.pos.y,
            self.pos.z,
            self.vel.x,
            self.vel.y,
            self.vel.z,
            self.ang_vel.x,
            self.ang_vel.y,
            self.ang_vel.z,
            self.radius,
            self.mass,
            self.last_world_hit_speed,
            f64::from(self.frozen),
            arena::distance(self.pos),
            normal.x,
            normal.y,
            normal.z,
        ]
    }

    pub fn step(&mut self) {
        self.integrate_forces(DT);
        self.integrate_position(DT);
        self.collide_world();
        self.clamp_velocities();
    }

    pub fn integrate_forces(&mut self, dt: f64) {
        if !self.frozen {
            self.vel.z += -650.0 * dt;
            self.vel.scale(1.0 - 0.03 * dt);
        }
    }

    pub fn integrate_position(&mut self, dt: f64) {
        if !self.frozen {
            self.pos.add_scaled(self.vel, dt);
        }
    }

    pub fn collide_world(&mut self) -> f64 {
        self.last_world_hit_speed = 0.0;
        if self.frozen {
            return 0.0;
        }
        let mut hit_speed: f64 = 0.0;
        for _ in 0..3 {
            let distance = arena::distance(self.pos);
            if distance >= COLLISION_RADIUS {
                break;
            }
            let normal = arena::normal(self.pos);
            let speed = self.vel.dot(normal);
            if speed < 0.0 {
                hit_speed = hit_speed.max(-speed);
                self.bounce(normal, speed);
            }
            self.pos.add_scaled(normal, COLLISION_RADIUS - distance);
        }
        self.last_world_hit_speed = hit_speed;
        hit_speed
    }

    pub fn inertia(&self) -> f64 {
        0.4 * self.mass * self.radius * self.radius
    }

    pub fn bounce(&mut self, normal: Vec3, speed: f64) {
        let mut arm = normal;
        arm.scale(-self.radius);
        let mut normal_velocity = normal;
        normal_velocity.scale(speed);
        let rotational_velocity = arm.cross(self.ang_vel);
        let mut tangent_velocity = self.vel;
        tangent_velocity.sub(normal_velocity);
        tangent_velocity.sub(rotational_velocity);
        let tangent_speed = tangent_velocity.length().max(1e-4);
        let ratio = normal_velocity.length() / tangent_speed;
        let restitution = if -speed < 20.0 { 0.0 } else { 0.6 };
        let effective_mass = 1.0 / (1.0 / self.mass + (self.radius * self.radius) / self.inertia());
        let normal_factor = -(1.0 + restitution) * self.mass;
        let friction = 1.0_f64.min(2.0 * ratio);
        let mut impulse = tangent_velocity;
        impulse.scale(-friction * effective_mass);
        let mut angular_impulse = arm.cross(impulse);
        angular_impulse.scale(1.0 / self.inertia());
        self.ang_vel.add(angular_impulse);
        self.vel
            .add_scaled(normal_velocity, normal_factor / self.mass);
        self.vel.add_scaled(impulse, 1.0 / self.mass);
    }

    pub fn clamp_velocities(&mut self) {
        self.vel.clamp_length(6000.0);
        self.ang_vel.clamp_length(6.0);
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn frozen_ball_resets_hit_speed_but_does_not_move() {
        let mut ball = Ball {
            frozen: true,
            last_world_hit_speed: 100.0,
            ..Ball::default()
        };
        let before = ball.pos;
        ball.step();
        assert_eq!(ball.pos.z.to_bits(), before.z.to_bits());
        assert_eq!(ball.last_world_hit_speed.to_bits(), 0.0_f64.to_bits());
    }
}
