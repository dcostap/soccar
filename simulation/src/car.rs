use crate::{
    arena,
    ball::Ball,
    math::{atan2, clamp, cos, curve, hypot2, sign, sin},
    rotation::{Mat3, Quat},
    vector::Vec3,
};

pub const HALF: Vec3 = Vec3::new(120.507 / 2.0, 86.6994 / 2.0, 38.6591 / 2.0);
pub const OFFSET: Vec3 = Vec3::new(13.8757, 0.0, 20.755);
const INERTIA: Vec3 = Vec3::new(
    15.0 * (4.0 * HALF.y * HALF.y + 4.0 * HALF.z * HALF.z),
    15.0 * (4.0 * HALF.x * HALF.x + 4.0 * HALF.z * HALF.z),
    15.0 * (4.0 * HALF.x * HALF.x + 4.0 * HALF.y * HALF.y),
);
const SPRING_OFFSET: f64 = 975.0 / ((500.0 / 180.0) * (2.0 * (36.25 + 54.4375)));

#[derive(Clone, Copy, Debug, Default, serde::Serialize, serde::Deserialize)]
pub struct Controls {
    pub throttle: f64,
    pub steer: f64,
    pub pitch: f64,
    pub yaw: f64,
    pub roll: f64,
    pub jump: bool,
    pub boost: bool,
    pub handbrake: bool,
    pub dodge_mag: Option<f64>,
}
#[derive(Clone, Copy, Debug, Default, serde::Serialize, serde::Deserialize)]
pub struct CarEvents {
    pub jumped: bool,
    pub double_jumped: bool,
    pub flipped: bool,
    pub landed: bool,
    pub ball_hit: f64,
}
#[derive(Clone, Copy, Debug, serde::Serialize, serde::Deserialize)]
pub struct Wheel {
    pub front: bool,
    pub local: Vec3,
    pub radius: f64,
    pub rest_length: f64,
    pub force_scale: f64,
    pub in_contact: bool,
    pub on_ball: bool,
    pub contact_point: Vec3,
    pub contact_normal: Vec3,
    pub suspension_length: f64,
    pub trace_length: f64,
    pub steer_angle: f64,
    pub spin: f64,
    pub visual_length: f64,
    pub lat_friction: f64,
    pub long_friction: f64,
}
impl Wheel {
    fn new(front: bool, x: f64, y: f64, radius: f64) -> Self {
        let length = 22.0 - radius;
        Self {
            front,
            local: Vec3::new(x, y, 5.0),
            radius,
            rest_length: length + SPRING_OFFSET,
            force_scale: if front { 36.25 } else { 54.4375 },
            in_contact: false,
            on_ball: false,
            contact_point: Vec3::default(),
            contact_normal: Vec3::new(0.0, 0.0, 1.0),
            suspension_length: length,
            trace_length: length + radius,
            steer_angle: 0.0,
            spin: 0.0,
            visual_length: length,
            lat_friction: 1.0,
            long_friction: 1.0,
        }
    }
}
#[derive(Clone, Debug, serde::Serialize, serde::Deserialize)]
pub struct Car {
    pub id: usize,
    pub team: usize,
    pub pos: Vec3,
    pub vel: Vec3,
    pub ang_vel: Vec3,
    pub rot: Quat,
    pub mat: Mat3,
    pub mass: f64,
    pub forward: Vec3,
    pub left: Vec3,
    pub up: Vec3,
    pub boost: f64,
    pub dodge_deadzone: f64,
    pub controls: Controls,
    pub last_controls: Controls,
    pub wheels: [Wheel; 4],
    pub num_wheels_in_contact: usize,
    pub is_on_ground: bool,
    pub has_jumped: bool,
    pub is_jumping: bool,
    pub jump_time: f64,
    pub has_double_jumped: bool,
    pub has_flipped: bool,
    pub is_flipping: bool,
    pub flip_time: f64,
    pub flip_roll: f64,
    pub flip_pitch: f64,
    pub air_time: f64,
    pub air_time_since_jump: f64,
    pub handbrake_val: f64,
    pub is_boosting: bool,
    pub boosting_time: f64,
    pub is_supersonic: bool,
    pub supersonic_time: f64,
    pub is_auto_flipping: bool,
    pub auto_flip_timer: f64,
    pub auto_flip_torque_scale: f64,
    pub world_contact: bool,
    pub world_normal: Vec3,
    pub is_demoed: bool,
    pub demo_respawn_timer: f64,
    pub frozen: bool,
    pub vel_impulse_cache: Vec3,
    pub bump_cooldowns: Vec<(usize, f64)>,
    pub last_extra_ball_hit_tick: i64,
    pub last_ball_touch_tick: i64,
    pub events: CarEvents,
}
impl Car {
    pub fn new(id: usize, team: usize) -> Self {
        Self {
            id,
            team,
            pos: Vec3::new(0.0, 0.0, 17.0),
            vel: Vec3::default(),
            ang_vel: Vec3::default(),
            rot: Quat::default(),
            mat: Mat3::default(),
            mass: 180.0,
            forward: Vec3::new(1.0, 0.0, 0.0),
            left: Vec3::new(0.0, 1.0, 0.0),
            up: Vec3::new(0.0, 0.0, 1.0),
            boost: 100.0 / 3.0,
            dodge_deadzone: 0.5,
            controls: Controls::default(),
            last_controls: Controls::default(),
            wheels: [
                Wheel::new(true, 51.25, 25.9, 12.5),
                Wheel::new(true, 51.25, -25.9, 12.5),
                Wheel::new(false, -33.75, 29.5, 15.0),
                Wheel::new(false, -33.75, -29.5, 15.0),
            ],
            num_wheels_in_contact: 0,
            is_on_ground: true,
            has_jumped: false,
            is_jumping: false,
            jump_time: 0.0,
            has_double_jumped: false,
            has_flipped: false,
            is_flipping: false,
            flip_time: 0.0,
            flip_roll: 0.0,
            flip_pitch: 0.0,
            air_time: 0.0,
            air_time_since_jump: 0.0,
            handbrake_val: 0.0,
            is_boosting: false,
            boosting_time: 0.0,
            is_supersonic: false,
            supersonic_time: 0.0,
            is_auto_flipping: false,
            auto_flip_timer: 0.0,
            auto_flip_torque_scale: 0.0,
            world_contact: false,
            world_normal: Vec3::new(0.0, 0.0, 1.0),
            is_demoed: false,
            demo_respawn_timer: 0.0,
            frozen: false,
            vel_impulse_cache: Vec3::default(),
            bump_cooldowns: Vec::new(),
            last_extra_ball_hit_tick: -10,
            last_ball_touch_tick: -10,
            events: CarEvents::default(),
        }
    }
    pub fn update_axes(&mut self) {
        self.mat = Mat3::from_quat(self.rot);
        self.forward = self.mat.column(0);
        self.left = self.mat.column(1);
        self.up = self.mat.column(2);
    }
    pub fn spawn(&mut self, x: f64, y: f64, yaw: f64, boost: f64) {
        self.pos = Vec3::new(x, y, 17.0);
        self.vel = Vec3::default();
        self.ang_vel = Vec3::default();
        self.rot = Quat::euler(yaw, 0.0, 0.0);
        self.boost = boost;
        self.has_jumped = false;
        self.is_jumping = false;
        self.has_double_jumped = false;
        self.has_flipped = false;
        self.is_flipping = false;
        self.jump_time = 0.0;
        self.flip_time = 0.0;
        self.air_time = 0.0;
        self.air_time_since_jump = 0.0;
        self.handbrake_val = 0.0;
        self.is_boosting = false;
        self.boosting_time = 0.0;
        self.is_supersonic = false;
        self.supersonic_time = 0.0;
        self.is_auto_flipping = false;
        self.is_demoed = false;
        self.is_on_ground = true;
        self.num_wheels_in_contact = 4;
        self.vel_impulse_cache = Vec3::default();
        self.world_contact = false;
        self.last_controls = Controls::default();
        self.update_axes();
        for wheel in &mut self.wheels {
            wheel.suspension_length = wheel.rest_length - SPRING_OFFSET;
            wheel.visual_length = wheel.suspension_length;
        }
    }
    pub fn forward_speed(&self) -> f64 {
        self.vel.dot(self.forward)
    }
    pub fn inv_inertia(&self, v: Vec3) -> Vec3 {
        let v = self.mat.transpose_mul(v);
        self.mat
            .mul_vec(Vec3::new(v.x / INERTIA.x, v.y / INERTIA.y, v.z / INERTIA.z))
    }
    pub fn point_velocity(&self, point: Vec3) -> Vec3 {
        self.ang_vel.cross(point.minus(self.pos)).plus(self.vel)
    }
    pub fn apply_impulse(&mut self, impulse: Vec3, point: Vec3) {
        self.vel.add_scaled(impulse, 1.0 / self.mass);
        self.ang_vel
            .add(self.inv_inertia(point.minus(self.pos).cross(impulse)));
    }
    pub fn effective_mass_inv(&self, arm: Vec3, normal: Vec3) -> f64 {
        1.0 / self.mass + normal.dot(self.inv_inertia(arm.cross(normal)).cross(arm))
    }
    pub fn hitbox_center(&self) -> Vec3 {
        self.mat.mul_vec(OFFSET).plus(self.pos)
    }
    pub fn wants_boost(&self) -> bool {
        self.boost > 0.0 && (self.controls.boost || (self.is_boosting && self.boosting_time < 0.1))
    }
    pub fn pre_step(&mut self, dt: f64, ball: Option<&mut Ball>) {
        self.events = CarEvents::default();
        if self.is_demoed {
            self.demo_respawn_timer -= dt;
            return;
        }
        let controls = self.controls;
        if self.frozen {
            self.last_controls = controls;
            return;
        }
        self.update_axes();
        let forward = self.forward;
        let up = self.up;
        if !self.vel_impulse_cache.is_zero() {
            self.vel.add(self.vel_impulse_cache);
            self.vel_impulse_cache = Vec3::default();
        }
        for (_, time) in &mut self.bump_cooldowns {
            *time -= dt;
        }
        self.bump_cooldowns.retain(|(_, time)| *time > 0.0);
        let jump = controls.jump && !self.last_controls.jump;
        let was_ground = self.is_on_ground;
        let mut contacts = 0;
        let direction = up.scaled(-1.0);
        for wheel in &mut self.wheels {
            let origin = self.mat.mul_vec(wheel.local).plus(self.pos);
            let limit = wheel.rest_length + wheel.radius + 13.5;
            let mut hit = -1.0;
            wheel.on_ball = false;
            if let Some((t, point, normal)) = arena::ray(origin, direction, limit) {
                hit = t;
                wheel.contact_point = point;
                wheel.contact_normal = normal;
            }
            if let Some(ball) = ball.as_deref() {
                let t = ray_sphere(origin, direction, ball.pos, ball.radius);
                if t >= 0.0 && t <= limit && (hit < 0.0 || t < hit) {
                    hit = t;
                    wheel.on_ball = true;
                    wheel.contact_point = origin.with_scaled(direction, t);
                    wheel.contact_normal = wheel.contact_point.minus(ball.pos).normalized();
                }
            }
            if hit >= 0.0 {
                wheel.in_contact = true;
                wheel.trace_length = hit;
                wheel.suspension_length = clamp(
                    hit - wheel.radius,
                    wheel.rest_length - 6.0,
                    wheel.rest_length + 6.0,
                );
                contacts += 1;
            } else {
                wheel.in_contact = false;
                wheel.suspension_length = wheel.rest_length;
            }
        }
        self.num_wheels_in_contact = contacts;
        self.is_on_ground = contacts >= 3;
        if self.is_on_ground && !was_ground && self.air_time > 0.1 {
            self.events.landed = true;
        }
        let speed = self.vel.dot(forward);
        let abs_speed = speed.abs();
        if controls.handbrake {
            self.handbrake_val += 5.0 * dt;
        } else {
            self.handbrake_val -= 2.0 * dt;
        }
        self.handbrake_val = clamp(self.handbrake_val, 0.0, 1.0);
        let boosting = self.wants_boost();
        let throttle = if boosting { 1.0 } else { controls.throttle };
        let mut drive = throttle;
        let mut braking = 0.0;
        if throttle.abs() >= 0.001 {
            if abs_speed > 25.0 && sign(throttle) != sign(speed) {
                braking = if controls.handbrake { 0.3 } else { 1.0 };
                if abs_speed > 0.01 {
                    drive = 0.0;
                }
            }
        } else {
            drive = 0.0;
            braking = if controls.handbrake {
                0.0
            } else if abs_speed < 25.0 {
                1.0
            } else {
                0.15
            };
        }
        let grip = if contacts < 3 { 0.25 } else { 1.0 };
        let acceleration =
            drive * curve(&[(0.0, 1600.0), (1400.0, 160.0), (1410.0, 0.0)], abs_speed) * grip;
        let brake = braking * 3500.0;
        let mut steering = curve(
            &[
                (0.0, 0.53356),
                (500.0, 0.3193),
                (1000.0, 0.18203),
                (1500.0, 0.1057),
                (1750.0, 0.08507),
                (3000.0, 0.03454),
            ],
            abs_speed,
        );
        if self.handbrake_val > 0.0 {
            steering += (curve(&[(0.0, 0.39235), (2500.0, 0.1261)], abs_speed) * 1.0 - steering)
                * self.handbrake_val;
        }
        steering *= controls.steer;
        self.wheels[0].steer_angle = steering;
        self.wheels[1].steer_angle = steering;
        let jumping = self.is_jumping || (self.is_on_ground && jump);
        self.update_wheels(dt, ball, acceleration, brake, jumping);
        if contacts >= 3 && !jumping {
            let mut factor = 0.5;
            if controls.throttle != 0.0 || boosting || abs_speed > 25.0 {
                factor += 1.0 - up.z.abs();
            }
            self.vel.add_scaled(up, factor * -650.0 * dt);
        }
        if self.is_on_ground && !self.is_jumping && !(self.has_jumped && self.jump_time < 0.05) {
            self.has_jumped = false;
            self.jump_time = 0.0;
        }
        if !self.is_on_ground {
            self.update_air_control(dt);
        }
        if self.is_jumping {
            self.is_jumping = self.jump_time < 0.025 || (controls.jump && self.jump_time < 0.2);
        } else if self.is_on_ground && jump {
            self.is_jumping = true;
            self.jump_time = 0.0;
            self.vel.add_scaled(up, 875.0 / 3.0);
            self.events.jumped = true;
        }
        if self.is_jumping {
            self.has_jumped = true;
            let mut force = 4375.0 / 3.0;
            if self.jump_time < 0.05416666666666667 {
                force *= 1135.0 / (4375.0 / 3.0);
            }
            self.vel.add_scaled(up, force * dt);
            self.jump_time += dt;
        }
        self.update_auto_flip(dt, jump);
        self.update_double_jump_or_flip(dt, jump, speed);
        if controls.throttle != 0.0 && ((contacts > 0 && contacts < 4) || self.world_contact) {
            self.update_auto_roll(dt);
        }
        if !self.is_on_ground {
            self.vel
                .add_scaled(forward, controls.throttle * (200.0 / 3.0) * dt);
        }
        if boosting {
            self.is_boosting = true;
            self.boosting_time += dt;
            self.boost = 0.0_f64.max(self.boost - (100.0 / 3.0) * dt);
            let force = if self.is_on_ground {
                2975.0 / 3.0
            } else {
                3175.0 / 3.0
            };
            self.vel.add_scaled(forward, force * dt);
        } else {
            self.is_boosting = false;
            self.boosting_time = 0.0;
        }
        self.vel.z += -650.0 * dt;
        self.last_controls = controls;
    }
    fn update_wheels(
        &mut self,
        dt: f64,
        mut ball: Option<&mut Ball>,
        acceleration: f64,
        brake: f64,
        jumping: bool,
    ) {
        let up = self.up;
        let forward = self.forward;
        let left = self.left;
        let mass = self.mass;
        let driving = self.controls.throttle != 0.0 || self.is_boosting;
        let mut impulses = [(Vec3::default(), Vec3::default(), false); 12];
        let mut count = 0;
        let mut push = |impulse| {
            impulses[count] = impulse;
            count += 1;
        };
        for index in 0..4 {
            let mut wheel = self.wheels[index];
            if !wheel.in_contact {
                wheel.visual_length += (wheel.rest_length - wheel.visual_length) * 0.3;
                self.wheels[index] = wheel;
                continue;
            }
            wheel.visual_length = wheel.suspension_length;
            let normal = wheel.contact_normal;
            let point = wheel.contact_point;
            let mut velocity = self.point_velocity(point);
            if wheel.on_ball
                && let Some(ball) = ball.as_deref()
            {
                velocity.sub(ball.ang_vel.cross(point.minus(ball.pos)).plus(ball.vel));
            }
            let mut vertical = 0.0;
            let mut scale = 10.0;
            let dot = -normal.dot(up);
            if dot < -0.1 {
                let inverse = -1.0 / dot;
                vertical = normal.dot(velocity) * inverse;
                scale = inverse;
            }
            let compression = wheel.rest_length - wheel.suspension_length;
            let mut force = (500.0 / 180.0) * wheel.force_scale * compression * scale;
            force -= (if vertical < 0.0 {
                25.0 / 180.0
            } else {
                40.0 / 180.0
            }) * wheel.force_scale
                * vertical;
            if force < 0.0 || jumping {
                force = 0.0;
            }
            push((normal.scaled(force * mass * dt), point, wheel.on_ball));
            let stop_length = wheel.rest_length + wheel.radius - 2.5;
            if !wheel.on_ball && wheel.trace_length < stop_length {
                let penetration = wheel.trace_length - stop_length;
                let speed = normal.dot(velocity);
                let inverse = 1.0 / self.effective_mass_inv(point.minus(self.pos), normal);
                let mut impulse = ((0.2 * -penetration) / dt - speed) * inverse;
                if impulse > 0.0 {
                    impulse /= self.num_wheels_in_contact.max(1) as f64;
                    push((normal.scaled(impulse), point, false));
                }
            }
            if wheel.on_ball
                || (!jumping && wheel.trace_length > wheel.rest_length + wheel.radius + 6.0 - 2.5)
            {
                self.wheels[index] = wheel;
                continue;
            }
            let angle = wheel.steer_angle;
            let mut lateral = Vec3::new(
                -left.x * cos(angle) - forward.x * sin(angle),
                -left.y * cos(angle) - forward.y * sin(angle),
                -left.z * cos(angle) - forward.z * sin(angle),
            );
            lateral.add_scaled(normal, -lateral.dot(normal));
            lateral = lateral.normalized();
            let longitudinal = normal.cross(lateral).normalized();
            let side_speed = velocity.dot(lateral);
            let long_speed = velocity.dot(longitudinal);
            let abs_side = side_speed.abs();
            let ratio = if abs_side > 5.0 {
                abs_side / (long_speed.abs() + abs_side)
            } else {
                0.0
            };
            let mut side_grip = curve(&[(0.0, 1.0), (1.0, 0.2)], ratio);
            let mut long_grip = 1.0;
            if self.handbrake_val > 0.0 {
                side_grip *= (0.1 - 1.0) * self.handbrake_val + 1.0;
                long_grip *=
                    (curve(&[(0.0, 0.5), (1.0, 0.9)], ratio) - 1.0) * self.handbrake_val + 1.0;
            }
            if !driving {
                let grip = curve(&[(0.0, 0.1), (0.7075, 0.5), (1.0, 1.0)], normal.z);
                side_grip *= grip;
                long_grip *= grip;
            }
            wheel.lat_friction = side_grip;
            wheel.long_friction = long_grip;
            let mut arm = point.minus(self.pos);
            arm.add_scaled(up, -up.dot(arm));
            let application = self.pos.plus(arm);
            let inverse = self.effective_mass_inv(arm, lateral);
            let rear = if wheel.front { 1.0 } else { 0.925 };
            let side_impulse = ((-0.0875 * rear * side_speed) / inverse) * side_grip;
            let mut long_impulse = 0.0;
            if acceleration != 0.0 {
                long_impulse = (mass * acceleration * dt) / 4.0;
            } else if brake > 0.0 {
                let inverse = self.effective_mass_inv(arm, longitudinal);
                let limit = (mass * brake * dt) / 4.0;
                long_impulse = clamp(-long_speed / inverse / 4.0, -limit, limit);
            }
            long_impulse *= long_grip;
            push((
                lateral
                    .scaled(side_impulse)
                    .with_scaled(longitudinal, long_impulse),
                application,
                false,
            ));
            wheel.spin += (long_speed / wheel.radius) * dt;
            self.wheels[index] = wheel;
        }
        for &(impulse, point, on_ball) in &impulses[..count] {
            self.apply_impulse(impulse, point);
            if on_ball && let Some(ball) = ball.as_deref_mut() {
                ball.vel.add_scaled(impulse, -1.0 / ball.mass);
            }
        }
        for wheel in &mut self.wheels {
            if !wheel.in_contact {
                wheel.spin += (self.controls.throttle * 30.0
                    + if self.is_boosting { 30.0 } else { 0.0 })
                    * dt;
            }
        }
    }
    fn update_double_jump_or_flip(&mut self, dt: f64, jump: bool, speed: f64) {
        if self.is_on_ground {
            self.has_double_jumped = false;
            self.has_flipped = false;
            self.is_flipping = false;
            self.air_time = 0.0;
            self.air_time_since_jump = 0.0;
            self.flip_time = 0.0;
            return;
        }
        self.air_time += dt;
        if self.has_jumped && !self.is_jumping {
            self.air_time_since_jump += dt;
        } else {
            self.air_time_since_jump = 0.0;
        }
        let c = self.controls;
        if jump
            && self.air_time_since_jump < 1.25
            && !self.has_double_jumped
            && !self.has_flipped
            && !self.is_auto_flipping
        {
            if c.dodge_mag
                .unwrap_or(c.yaw.abs() + c.pitch.abs() + c.roll.abs())
                >= self.dodge_deadzone
            {
                self.flip_time = 0.0;
                self.has_flipped = true;
                self.is_flipping = true;
                self.events.flipped = true;
                let fraction = speed.abs() / 2300.0;
                let mut pitch = -c.pitch;
                let mut roll = c.yaw + c.roll;
                if roll.abs() < 0.1 && pitch.abs() < 0.1 {
                    pitch = 0.0;
                    roll = 0.0;
                } else {
                    let length = hypot2(pitch, roll);
                    pitch /= length;
                    roll /= length;
                }
                self.flip_roll = roll;
                self.flip_pitch = pitch;
                if pitch.abs() < 0.1 {
                    pitch = 0.0;
                }
                if roll.abs() < 0.1 {
                    roll = 0.0;
                }
                if pitch != 0.0 || roll != 0.0 {
                    let reverse = if speed.abs() < 100.0 {
                        pitch < 0.0
                    } else {
                        (pitch >= 0.0) != (speed >= 0.0)
                    };
                    let mut x = pitch * 500.0;
                    let mut y = roll * 500.0;
                    x *= ((if reverse { 2.5 } else { 1.0 }) - 1.0) * fraction + 1.0;
                    y *= (1.9 - 1.0) * fraction + 1.0;
                    if reverse {
                        x *= 16.0 / 15.0;
                    }
                    let mut length = hypot2(self.forward.x, self.forward.y);
                    if length == 0.0 {
                        length = 1.0;
                    }
                    let a = self.forward.x / length;
                    let b = self.forward.y / length;
                    self.vel.x += a * x + b * y;
                    self.vel.y += b * x + -a * y;
                }
            } else {
                self.vel.add_scaled(self.up, 875.0 / 3.0);
                self.has_double_jumped = true;
                self.events.double_jumped = true;
            }
        }
        if self.is_flipping {
            self.flip_time += dt;
            if self.flip_time <= 0.65 {
                if self.flip_time >= 0.15 && (self.vel.z < 0.0 || self.flip_time < 0.21) {
                    self.vel.z *= libm::pow(1.0 - 0.35, dt / (1.0 / 120.0));
                }
            } else {
                self.is_flipping = false;
            }
        } else if self.has_flipped {
            self.flip_time += dt;
        }
    }
    fn update_air_control(&mut self, dt: f64) {
        let c = self.controls;
        let mut enabled = true;
        let mut pitch_scale = 1.0;
        if self.is_flipping && self.flip_time < 0.65 {
            enabled = false;
            let roll = self.flip_roll;
            let mut pitch = self.flip_pitch;
            if roll != 0.0 || pitch != 0.0 {
                let mut scale = 1.0;
                if pitch != 0.0 && c.pitch != 0.0 && sign(pitch) == sign(c.pitch) {
                    scale = 1.0 - c.pitch.abs().min(1.0);
                    enabled = true;
                }
                pitch *= scale;
                self.ang_vel.add_scaled(self.forward, roll * 260.0 * dt);
                self.ang_vel.add_scaled(self.left, pitch * 224.0 * dt);
            } else {
                enabled = true;
            }
        }
        if self.has_flipped && self.flip_time < 0.95 {
            pitch_scale = 0.0;
        }
        if !enabled || self.is_auto_flipping {
            return;
        }
        let pitch = c.pitch * pitch_scale;
        let yaw = c.yaw;
        let roll = c.roll;
        let forward = self.ang_vel.dot(self.forward);
        let left = -self.ang_vel.dot(self.left);
        let up = -self.ang_vel.dot(self.up);
        let r = roll * 400.0 - forward * 50.0;
        let p = pitch * 130.0 - left * 30.0 * (1.0 - pitch.abs());
        let y = yaw * 95.0 - up * 20.0 * (1.0 - yaw.abs());
        let scale = ((2.0 * std::f64::consts::PI) / 65536.0) * 1000.0 * dt;
        self.ang_vel.add_scaled(self.forward, r * scale);
        self.ang_vel.add_scaled(self.left, -p * scale);
        self.ang_vel.add_scaled(self.up, -y * scale);
    }
    fn update_auto_flip(&mut self, dt: f64, jump: bool) {
        if jump && self.world_contact && self.world_normal.z > std::f64::consts::FRAC_1_SQRT_2 {
            let angle = -atan2(self.left.z, self.up.z);
            let abs = angle.abs();
            if abs > 2.8 {
                self.auto_flip_timer = (abs / std::f64::consts::PI) * 0.4;
                self.auto_flip_torque_scale = if angle > 0.0 { 1.0 } else { -1.0 };
                self.is_auto_flipping = true;
                self.vel.add_scaled(self.up, -200.0);
            }
        }
        if self.is_auto_flipping {
            if self.auto_flip_timer <= 0.0 {
                self.is_auto_flipping = false;
                self.auto_flip_timer = 0.0;
            } else {
                self.ang_vel
                    .add_scaled(self.forward, 50.0 * self.auto_flip_torque_scale * dt);
                self.auto_flip_timer -= dt;
            }
        }
    }
    fn update_auto_roll(&mut self, dt: f64) {
        let mut normal = Vec3::default();
        let mut contacts = 0;
        for wheel in &self.wheels {
            if wheel.in_contact && !wheel.on_ball {
                normal.add(wheel.contact_normal);
                contacts += 1;
            }
        }
        if contacts == 0 {
            if !self.world_contact {
                return;
            }
            normal = self.world_normal;
        }
        normal = normal.normalized();
        let negative_left = self.left.scaled(-1.0);
        let cross = normal.cross(self.forward);
        let aligned = cross.cross(normal).normalized();
        let lateral = cross.scaled(-1.0).normalized();
        let side_error = 1.0 - clamp(negative_left.dot(lateral), 0.0, 1.0);
        let forward_error = 1.0 - clamp(self.forward.dot(aligned), 0.0, 1.0);
        let side_sign = if negative_left.dot(normal) >= 0.0 {
            1.0
        } else {
            -1.0
        };
        let forward_sign = if self.forward.dot(normal) >= 0.0 {
            1.0
        } else {
            -1.0
        };
        self.ang_vel
            .add_scaled(self.forward, side_sign * side_error * 80.0 * dt);
        self.ang_vel
            .add_scaled(self.left, forward_sign * forward_error * 80.0 * dt);
        self.vel.add_scaled(normal, -100.0 * dt);
    }
    pub fn integrate_position(&mut self, dt: f64) {
        if !self.is_demoed && !self.frozen {
            self.pos.add_scaled(self.vel, dt);
            self.rot.integrate(self.ang_vel, dt);
            self.update_axes();
        }
    }
    pub fn collide_world(&mut self) {
        self.world_contact = false;
        if self.is_demoed || self.frozen {
            return;
        }
        #[derive(Clone, Copy)]
        struct Contact {
            point: Vec3,
            normal: Vec3,
            depth: f64,
        }
        #[derive(Clone, Copy)]
        struct Solver {
            c: Contact,
            t1: Vec3,
            t2: Vec3,
            kn: f64,
            k1: f64,
            k2: f64,
            target: f64,
            jn: f64,
            j1: f64,
            j2: f64,
        }
        let center = self.hitbox_center();
        let mut contacts = [Contact {
            point: Vec3::default(),
            normal: Vec3::default(),
            depth: 0.0,
        }; 26];
        let mut count = 0;
        for x in [-1.0_f64, -0.5, 0.0, 0.5, 1.0] {
            for y in [-1.0_f64, 0.0, 1.0] {
                for z in [-1.0_f64, 0.0, 1.0] {
                    if x.abs() == 1.0 || y.abs() == 1.0 || z.abs() == 1.0 {
                        let point = self
                            .mat
                            .mul_vec(Vec3::new(x * HALF.x, y * HALF.y, z * HALF.z))
                            .plus(center);
                        let distance = arena::distance(point) - 3.0;
                        if distance < 0.0 {
                            contacts[count] = Contact {
                                point,
                                normal: arena::normal(point),
                                depth: -distance,
                            };
                            count += 1;
                        }
                    }
                }
            }
        }
        if count == 0 {
            return;
        }
        let contacts = &mut contacts[..count];
        contacts.sort_by(|a, b| b.depth.partial_cmp(&a.depth).unwrap());
        let mut chosen = [contacts[0]; 4];
        let mut chosen_count = 1;
        while chosen_count < 4 && chosen_count < contacts.len() {
            let mut best = None;
            let mut maximum = 4.0;
            for (index, contact) in contacts.iter().enumerate() {
                let mut minimum = f64::INFINITY;
                for prior in &chosen[..chosen_count] {
                    minimum = minimum.min(prior.point.minus(contact.point).length_sq());
                }
                if minimum > maximum {
                    maximum = minimum;
                    best = Some(index);
                }
            }
            if let Some(index) = best {
                chosen[chosen_count] = contacts[index];
                chosen_count += 1;
            } else {
                break;
            }
        }
        self.world_contact = true;
        self.world_normal = chosen[0].normal;
        let mut solvers = [None; 4];
        for (solver, c) in solvers.iter_mut().zip(&chosen[..chosen_count]) {
            *solver = Some({
                let arm = c.point.minus(self.pos);
                let speed = self.point_velocity(c.point).dot(c.normal);
                let axis = if c.normal.z.abs() < 0.9 {
                    Vec3::new(0.0, 0.0, 1.0)
                } else {
                    Vec3::new(1.0, 0.0, 0.0)
                };
                let t1 = axis.cross(c.normal).normalized();
                let t2 = c.normal.cross(t1);
                Solver {
                    c: *c,
                    t1,
                    t2,
                    kn: 1.0 / self.effective_mass_inv(arm, c.normal),
                    k1: 1.0 / self.effective_mass_inv(arm, t1),
                    k2: 1.0 / self.effective_mass_inv(arm, t2),
                    target: if speed < -20.0 { -0.0 * speed } else { 0.0 },
                    jn: 0.0,
                    j1: 0.0,
                    j2: 0.0,
                }
            });
        }
        for _ in 0..10 {
            for solver in solvers.iter_mut().flatten() {
                let speed = self.point_velocity(solver.c.point).dot(solver.c.normal);
                let impulse = 0.0_f64.max(solver.jn + (solver.target - speed) * solver.kn);
                let change = impulse - solver.jn;
                solver.jn = impulse;
                if change != 0.0 {
                    self.apply_impulse(solver.c.normal.scaled(change), solver.c.point);
                }
                let limit = 0.106 * solver.jn;
                let impulse = limit.min((-limit).max(
                    solver.j1 - self.point_velocity(solver.c.point).dot(solver.t1) * solver.k1,
                ));
                let change = impulse - solver.j1;
                solver.j1 = impulse;
                if change != 0.0 {
                    self.apply_impulse(solver.t1.scaled(change), solver.c.point);
                }
                let impulse = limit.min((-limit).max(
                    solver.j2 - self.point_velocity(solver.c.point).dot(solver.t2) * solver.k2,
                ));
                let change = impulse - solver.j2;
                solver.j2 = impulse;
                if change != 0.0 {
                    self.apply_impulse(solver.t2.scaled(change), solver.c.point);
                }
            }
        }
        self.pos
            .add_scaled(chosen[0].normal, 0.0_f64.max(chosen[0].depth - 0.5) * 0.6);
    }
    pub fn post_step(&mut self, dt: f64) {
        if self.is_demoed {
            return;
        }
        self.vel.clamp_length(2300.0);
        self.ang_vel.clamp_length(5.5);
        let speed = self.vel.length();
        if speed >= 2200.0 {
            self.is_supersonic = true;
            self.supersonic_time = 0.0;
        } else if self.is_supersonic && speed >= 2100.0 && self.supersonic_time < 1.0 {
            self.supersonic_time += dt;
        } else {
            self.is_supersonic = false;
            self.supersonic_time = 0.0;
        }
    }
    pub fn demolish(&mut self) {
        self.is_demoed = true;
        self.demo_respawn_timer = 3.0;
        self.vel = Vec3::default();
        self.ang_vel = Vec3::default();
    }
}
pub fn ray_sphere(origin: Vec3, direction: Vec3, center: Vec3, radius: f64) -> f64 {
    let v = origin.minus(center);
    let dot = v.dot(direction);
    let distance = v.length_sq() - radius * radius;
    let discriminant = dot * dot - distance;
    if discriminant < 0.0 {
        return -1.0;
    }
    let t = -dot - discriminant.sqrt();
    if t < 0.0 {
        if distance < 0.0 { 0.0 } else { -1.0 }
    } else {
        t
    }
}
