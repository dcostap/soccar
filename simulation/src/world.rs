use crate::{
    DT,
    ball::Ball,
    car::{Car, HALF},
    math::{curve, sign},
    vector::Vec3,
};

#[derive(Clone, Copy, Debug)]
pub struct Event {
    pub kind: u32,
    pub car: i32,
    pub other: i32,
    pub team: i32,
    pub pad: i32,
    pub position: Vec3,
    pub strength: f64,
    pub last_touch: i32,
}
impl Event {
    pub fn new(kind: u32) -> Self {
        Self {
            kind,
            car: -1,
            other: -1,
            team: -1,
            pad: -1,
            position: Vec3::default(),
            strength: 0.0,
            last_touch: -1,
        }
    }
}
pub const BALL_BOUNCE: u32 = 1;
pub const BALL_HIT: u32 = 2;
pub const DEMO: u32 = 3;
pub const BUMP: u32 = 4;
pub const JUMP: u32 = 5;
pub const FLIP: u32 = 6;
pub const LAND: u32 = 7;
pub const BOOST_PICKUP: u32 = 8;
pub const RESPAWN: u32 = 9;
pub const GOAL: u32 = 10;
#[derive(Clone, Debug)]
pub struct Pad {
    pub pos: Vec3,
    pub big: bool,
    pub cooldown: f64,
}
pub const KICKOFF: [(f64, f64, f64); 5] = [
    (-2048.0, -2560.0, std::f64::consts::PI * 0.25),
    (2048.0, -2560.0, std::f64::consts::PI * 0.75),
    (-256.0, -3840.0, std::f64::consts::PI * 0.5),
    (256.0, -3840.0, std::f64::consts::PI * 0.5),
    (0.0, -4608.0, std::f64::consts::PI * 0.5),
];
const RESPAWNS: [(f64, f64); 4] = [
    (-2304.0, -4608.0),
    (-2688.0, -4608.0),
    (2304.0, -4608.0),
    (2688.0, -4608.0),
];
pub const PADS: [(f64, f64, bool); 34] = [
    (0.0, -4240.0, false),
    (-1792.0, -4184.0, false),
    (1792.0, -4184.0, false),
    (-3072.0, -4096.0, true),
    (3072.0, -4096.0, true),
    (-940.0, -3308.0, false),
    (940.0, -3308.0, false),
    (0.0, -2816.0, false),
    (-3584.0, -2484.0, false),
    (3584.0, -2484.0, false),
    (-1788.0, -2300.0, false),
    (1788.0, -2300.0, false),
    (-2048.0, -1036.0, false),
    (0.0, -1024.0, false),
    (2048.0, -1036.0, false),
    (-3584.0, 0.0, true),
    (-1024.0, 0.0, false),
    (1024.0, 0.0, false),
    (3584.0, 0.0, true),
    (-2048.0, 1036.0, false),
    (0.0, 1024.0, false),
    (2048.0, 1036.0, false),
    (-1788.0, 2300.0, false),
    (1788.0, 2300.0, false),
    (-3584.0, 2484.0, false),
    (3584.0, 2484.0, false),
    (0.0, 2816.0, false),
    // TODO(post-port): Review this original asymmetric pad position as a separate behavior change.
    (-940.0, 3310.0, false),
    (940.0, 3308.0, false),
    (-3072.0, 4096.0, true),
    (3072.0, 4096.0, true),
    (-1792.0, 4184.0, false),
    (1792.0, 4184.0, false),
    (0.0, 4240.0, false),
];
#[derive(Clone, Debug)]
pub struct World {
    pub ball: Ball,
    pub cars: Vec<Car>,
    pub pads: Vec<Pad>,
    pub tick: i64,
    pub events: Vec<Event>,
    pub goals_enabled: bool,
    pub goal_scored: Option<usize>,
    pub last_touch: Option<usize>,
    pub ball_touched: bool,
    pub respawn_roll: usize,
}
impl Default for World {
    fn default() -> Self {
        Self {
            ball: Ball::default(),
            cars: Vec::new(),
            pads: PADS
                .iter()
                .map(|&(x, y, big)| Pad {
                    pos: Vec3::new(x, y, if big { 73.0 } else { 70.0 }),
                    big,
                    cooldown: 0.0,
                })
                .collect(),
            tick: 0,
            events: Vec::new(),
            goals_enabled: true,
            goal_scored: None,
            last_touch: None,
            ball_touched: false,
            respawn_roll: 0,
        }
    }
}
impl World {
    pub fn add_car(&mut self, team: usize) -> usize {
        let id = self.cars.len();
        self.cars.push(Car::new(id, team));
        id
    }
    pub fn reset_pads(&mut self) {
        for pad in &mut self.pads {
            pad.cooldown = 0.0;
        }
    }
    pub fn setup_kickoff(&mut self, random: f64) {
        self.ball.reset(0.0, 0.0, 93.15);
        self.ball_touched = false;
        self.last_touch = None;
        let mut order = [0, 1, 2, 3, 4];
        let mut seed = (random * 2147483647.0).floor();
        if seed == 0.0 {
            seed = 1.0;
        }
        for i in (1..5).rev() {
            seed = (seed * 16807.0) % 2147483647.0;
            let j = ((seed / 2147483647.0) * (i + 1) as f64).floor() as usize;
            order.swap(i, j);
        }
        for team in 0..2 {
            let mut index = 0;
            for car in &mut self.cars {
                if car.team == team {
                    let (x, y, yaw) = KICKOFF[order[index]];
                    if team == 0 {
                        car.spawn(x, y, yaw, 100.0 / 3.0);
                    } else {
                        car.spawn(-x, -y, yaw + std::f64::consts::PI, 100.0 / 3.0);
                    }
                    index += 1;
                }
            }
        }
        self.reset_pads();
    }
    pub fn step(&mut self) {
        self.events.clear();
        self.goal_scored = None;
        for car in &mut self.cars {
            car.pre_step(DT, Some(&mut self.ball));
        }
        self.ball.integrate_forces(DT);
        for car in &mut self.cars {
            car.integrate_position(DT);
        }
        self.ball.integrate_position(DT);
        let speed = self.ball.collide_world();
        if speed > 150.0 {
            let mut event = Event::new(BALL_BOUNCE);
            event.strength = speed;
            event.position = self.ball.pos;
            self.events.push(event);
        }
        for car in &mut self.cars {
            car.collide_world();
        }
        for car in &mut self.cars {
            if let Some((strength, point)) = car_ball(car, &mut self.ball, self.tick) {
                self.last_touch = Some(car.id);
                self.ball_touched = true;
                if strength > 60.0 {
                    let mut event = Event::new(BALL_HIT);
                    event.car = car.id as i32;
                    event.strength = strength;
                    event.position = point;
                    self.events.push(event);
                }
            }
        }
        for i in 0..self.cars.len() {
            for j in i + 1..self.cars.len() {
                let (left, right) = self.cars.split_at_mut(j);
                car_car(&mut left[i], &mut right[0], &mut self.events);
            }
        }
        self.ball.clamp_velocities();
        for car in &mut self.cars {
            car.post_step(DT);
            for (flag, kind) in [
                (car.events.jumped, JUMP),
                (car.events.flipped, FLIP),
                (car.events.landed, LAND),
            ] {
                if flag {
                    let mut event = Event::new(kind);
                    event.car = car.id as i32;
                    self.events.push(event);
                }
            }
        }
        for (index, pad) in self.pads.iter_mut().enumerate() {
            if pad.cooldown > 0.0 {
                pad.cooldown = 0.0_f64.max(pad.cooldown - DT);
                continue;
            }
            let radius = if pad.big { 208.0 } else { 144.0 };
            for car in &mut self.cars {
                if car.is_demoed || car.boost >= 100.0 {
                    continue;
                }
                let x = car.pos.x - pad.pos.x;
                let y = car.pos.y - pad.pos.y;
                if x * x + y * y < radius * radius && (car.pos.z - pad.pos.z).abs() < 168.0 {
                    car.boost = 100.0_f64.min(car.boost + if pad.big { 100.0 } else { 12.0 });
                    pad.cooldown = if pad.big { 10.0 } else { 4.0 };
                    let mut event = Event::new(BOOST_PICKUP);
                    event.car = car.id as i32;
                    event.pad = index as i32;
                    self.events.push(event);
                    break;
                }
            }
        }
        for car in &mut self.cars {
            if car.is_demoed && car.demo_respawn_timer <= 0.0 {
                let (x, y) = RESPAWNS[self.respawn_roll % 4];
                self.respawn_roll += 1;
                let yaw = std::f64::consts::PI * 0.5;
                if car.team == 0 {
                    car.spawn(x, y, yaw, 100.0 / 3.0);
                } else {
                    car.spawn(-x, -y, yaw + std::f64::consts::PI, 100.0 / 3.0);
                }
                car.pos.z = 36.0;
                let mut event = Event::new(RESPAWN);
                event.car = car.id as i32;
                self.events.push(event);
            }
        }
        if self.goals_enabled && !self.ball.frozen {
            let boundary = crate::arena::GOAL_LINE + self.ball.radius;
            if self.ball.pos.y > boundary || self.ball.pos.y < -boundary {
                let team = if self.ball.pos.y > 0.0 { 0 } else { 1 };
                self.goal_scored = Some(team);
                let mut event = Event::new(GOAL);
                event.team = team as i32;
                event.position = self.ball.pos;
                event.strength = self.ball.vel.length();
                event.last_touch = self.last_touch.map_or(-1, |id| id as i32);
                self.events.push(event);
            }
        }
        self.tick += 1;
    }
}
fn nonzero_sign(x: f64) -> f64 {
    let result = sign(x);
    if result == 0.0 { 1.0 } else { result }
}
pub fn car_ball(car: &mut Car, ball: &mut Ball, tick: i64) -> Option<(f64, Vec3)> {
    if car.is_demoed || ball.frozen {
        return None;
    }
    let center = car.hitbox_center();
    let local = car.mat.transpose_mul(ball.pos.minus(center));
    let closest = Vec3::new(
        (-HALF.x).max(HALF.x.min(local.x)),
        (-HALF.y).max(HALF.y.min(local.y)),
        (-HALF.z).max(HALF.z.min(local.z)),
    );
    let mut normal = local.minus(closest);
    let squared = normal.length_sq();
    if squared >= ball.radius * ball.radius {
        return None;
    }
    let depth;
    if squared > 1e-8 {
        let length = squared.sqrt();
        normal.x /= length;
        normal.y /= length;
        normal.z /= length;
        depth = ball.radius - length;
    } else {
        let x = HALF.x - local.x.abs();
        let y = HALF.y - local.y.abs();
        let z = HALF.z - local.z.abs();
        normal = Vec3::default();
        if x < y && x < z {
            normal.x = nonzero_sign(local.x);
            depth = ball.radius + x;
        } else if y < z {
            normal.y = nonzero_sign(local.y);
            depth = ball.radius + y;
        } else {
            normal.z = nonzero_sign(local.z);
            depth = ball.radius + z;
        }
    }
    let normal = car.mat.mul_vec(normal);
    let point = car.mat.mul_vec(closest).plus(center);
    let mut extra = None;
    if tick > car.last_extra_ball_hit_tick + 1 || car.last_extra_ball_hit_tick > tick {
        car.last_extra_ball_hit_tick = tick;
        let offset = ball.pos.minus(car.pos);
        let speed = ball.vel.minus(car.vel).length().min(4600.0);
        if speed > 0.0 {
            let mut direction = Vec3::new(offset.x, offset.y, offset.z * 0.35).normalized();
            let projection = car
                .forward
                .scaled(direction.dot(car.forward) * (1.0 - 0.65));
            direction = direction.minus(projection).normalized();
            extra = Some(direction.scaled(
                speed
                    * curve(
                        &[(0.0, 0.65), (500.0, 0.65), (2300.0, 0.55), (4600.0, 0.3)],
                        speed,
                    ),
            ));
        }
    }
    let inverse = 1.0 / ball.mass;
    let share = inverse / (inverse + 1.0 / car.mass);
    ball.pos.add_scaled(normal, depth * share);
    car.pos.add_scaled(normal, -depth * (1.0 - share));
    let ball_arm = point.minus(ball.pos);
    let car_arm = point.minus(car.pos);
    let relative = ball
        .ang_vel
        .cross(ball_arm)
        .plus(ball.vel)
        .minus(car.point_velocity(point));
    let speed = relative.dot(normal);
    let mut strength = 0.0;
    if speed < 0.0 {
        strength = -speed;
        let inertia = ball.inertia();
        let denominator = inverse
            + ball_arm.cross(normal).length_sq() / inertia
            + car.effective_mass_inv(car_arm, normal);
        let amount = -speed / denominator;
        let mut impulse = normal.scaled(amount);
        let mut tangent = relative.with_scaled(normal, -speed);
        let length = tangent.length();
        if length > 1e-6 {
            tangent.scale(1.0 / length);
            let denominator = inverse
                + ball_arm.cross(tangent).length_sq() / inertia
                + car.effective_mass_inv(car_arm, tangent);
            let amount = (length / denominator).min(2.0 * amount);
            impulse.add_scaled(tangent, -amount);
        }
        ball.vel.add_scaled(impulse, inverse);
        ball.ang_vel
            .add(ball_arm.cross(impulse).scaled(1.0 / inertia));
        car.apply_impulse(impulse.scaled(-1.0), point);
    }
    if let Some(extra) = extra {
        ball.vel.add(extra);
        strength += extra.length();
    }
    car.last_ball_touch_tick = tick;
    Some((strength, point))
}
#[derive(Clone, Copy)]
struct BoxShape {
    center: Vec3,
    axes: [Vec3; 3],
}
impl BoxShape {
    fn new(car: &Car) -> Self {
        Self {
            center: car.hitbox_center(),
            axes: [car.forward, car.left, car.up],
        }
    }
    fn closest(self, other: Vec3) -> Vec3 {
        let delta = other.minus(self.center);
        let mut result = self.center;
        for (axis, half) in self.axes.into_iter().zip([HALF.x, HALF.y, HALF.z]) {
            let projection = (-half).max(half.min(delta.dot(axis)));
            result.add_scaled(axis, projection);
        }
        result
    }
}
fn separating_axis(a: BoxShape, b: BoxShape) -> Option<(Vec3, f64)> {
    let delta = b.center.minus(a.center);
    let mut depth = f64::INFINITY;
    let mut normal = Vec3::default();
    let mut axes = Vec::from(a.axes);
    axes.extend(b.axes);
    for x in a.axes {
        for y in b.axes {
            let axis = x.cross(y);
            if axis.length_sq() > 1e-6 {
                axes.push(axis.normalized());
            }
        }
    }
    for axis in axes {
        let ar = HALF.x * a.axes[0].dot(axis).abs()
            + HALF.y * a.axes[1].dot(axis).abs()
            + HALF.z * a.axes[2].dot(axis).abs();
        let br = HALF.x * b.axes[0].dot(axis).abs()
            + HALF.y * b.axes[1].dot(axis).abs()
            + HALF.z * b.axes[2].dot(axis).abs();
        let projection = delta.dot(axis);
        let overlap = ar + br - projection.abs();
        if overlap < 0.0 {
            return None;
        }
        if overlap < depth {
            depth = overlap;
            normal = axis.scaled(if projection >= 0.0 { 1.0 } else { -1.0 });
        }
    }
    Some((normal, depth))
}
fn bump(attacker: &mut Car, victim: &mut Car, local: Vec3, events: &mut Vec<Event>) {
    if attacker
        .bump_cooldowns
        .iter()
        .any(|(id, _)| *id == victim.id)
    {
        return;
    }
    let offset = victim.pos.minus(attacker.pos);
    if attacker.vel.dot(offset) <= 0.0 {
        return;
    }
    let direction = attacker.vel.normalized();
    let speed = attacker.vel.dot(offset.normalized());
    if speed > victim.vel.dot(direction) && local.x > 64.5 {
        let mut event = Event::new(BUMP);
        event.car = attacker.id as i32;
        event.other = victim.id as i32;
        if attacker.is_supersonic && attacker.team != victim.team {
            victim.demolish();
            event.kind = DEMO;
        } else {
            let amount = if victim.is_on_ground {
                curve(
                    &[(0.0, 5.0 / 6.0), (1400.0, 1100.0), (2200.0, 1530.0)],
                    speed,
                )
            } else {
                curve(
                    &[(0.0, 5.0 / 6.0), (1400.0, 1390.0), (2200.0, 1945.0)],
                    speed,
                )
            };
            let up = if victim.is_on_ground {
                victim.up
            } else {
                Vec3::new(0.0, 0.0, 1.0)
            };
            victim
                .vel_impulse_cache
                .add(direction.scaled(amount).with_scaled(
                    up,
                    curve(&[(0.0, 1.0 / 3.0), (1400.0, 278.0), (2200.0, 417.0)], speed),
                ));
        }
        events.push(event);
        attacker.bump_cooldowns.push((victim.id, 0.25));
    }
}
pub fn car_car(a: &mut Car, b: &mut Car, events: &mut Vec<Event>) {
    if a.is_demoed || b.is_demoed || a.frozen || b.frozen || a.pos.distance(b.pos) > 250.0 {
        return;
    }
    let sa = BoxShape::new(a);
    let sb = BoxShape::new(b);
    let Some((normal, depth)) = separating_axis(sa, sb) else {
        return;
    };
    let pa = sa.closest(sb.center);
    let pb = sb.closest(sa.center);
    let point = pa.plus(pb).scaled(0.5);
    let la = a.mat.transpose_mul(pa.minus(a.pos));
    let lb = b.mat.transpose_mul(pb.minus(b.pos));
    bump(a, b, la, events);
    if !a.is_demoed && !b.is_demoed {
        bump(b, a, lb, events);
    }
    if a.is_demoed || b.is_demoed {
        return;
    }
    a.pos.add_scaled(normal, -depth / 2.0);
    b.pos.add_scaled(normal, depth / 2.0);
    let arm_a = point.minus(a.pos);
    let arm_b = point.minus(b.pos);
    let relative = b.point_velocity(point).minus(a.point_velocity(point));
    let speed = relative.dot(normal);
    if speed >= 0.0 {
        return;
    }
    let denominator = a.effective_mass_inv(arm_a, normal) + b.effective_mass_inv(arm_b, normal);
    let amount = (-(1.0 + 0.1) * speed) / denominator;
    let mut impulse = normal.scaled(amount);
    let mut tangent = relative.with_scaled(normal, -speed);
    let length = tangent.length();
    if length > 1e-6 {
        tangent.scale(1.0 / length);
        let denominator =
            a.effective_mass_inv(arm_a, tangent) + b.effective_mass_inv(arm_b, tangent);
        impulse.add_scaled(tangent, -(length / denominator).min(0.09 * amount));
    }
    b.apply_impulse(impulse, point);
    a.apply_impulse(impulse.scaled(-1.0), point);
}
