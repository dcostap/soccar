//! Port of je, Me, Ne, Pe, Ze, Qe, $e, et, and nt in src/game.js.
use crate::{math::hypot2, vector::Vec3};

const SQRT_2: f64 = std::f64::consts::SQRT_2;
const SIDE: f64 = 4096.0 - 420.0;
const END: f64 = 5120.0 - 420.0;
const DIAGONAL: f64 = 8064.0 - 420.0 * SQRT_2;
const GOAL_HEIGHT: f64 = 642.775;

fn segment_distance(x: f64, y: f64, ax: f64, ay: f64, bx: f64, by: f64) -> f64 {
    let dx = bx - ax;
    let dy = by - ay;
    let fraction = ((x - ax) * dx + (y - ay) * dy) / (dx * dx + dy * dy);
    let fraction = fraction.clamp(0.0, 1.0);
    let px = ax + dx * fraction - x;
    let py = ay + dy * fraction - y;
    (px * px + py * py).sqrt()
}

fn outline_distance(x: f64, y: f64) -> f64 {
    let distance = (x - SIDE).max(y - END).max((x + y - DIAGONAL) / SQRT_2);
    if distance <= 0.0 {
        return distance;
    }
    let a = segment_distance(x, y, 0.0, END, DIAGONAL - END, END);
    let b = segment_distance(x, y, DIAGONAL - END, END, SIDE, DIAGONAL - SIDE);
    let c = segment_distance(x, y, SIDE, DIAGONAL - SIDE, SIDE, 0.0);
    a.min(b).min(c)
}

// TODO(post-port): Compare clamp replacements before changing the original max/min order.
#[allow(clippy::manual_clamp)] // Keep the JavaScript max/min operation order.
fn ramp_radius(x: f64) -> f64 {
    let fraction = ((x.abs() - 893.0) / 450.0).max(0.0).min(1.0);
    256.0 * 0.02_f64.max(fraction * fraction * (3.0 - 2.0 * fraction))
}

fn field_distance(x: f64, y: f64, z: f64) -> f64 {
    let radius = if z < 1022.0 { ramp_radius(x) } else { 256.0 };
    let horizontal = outline_distance(x, y) - 420.0 + radius;
    let vertical = (radius - z).max(z - (2044.0 - radius));
    let positive_h = if horizontal > 0.0 { horizontal } else { 0.0 };
    let positive_v = if vertical > 0.0 { vertical } else { 0.0 };
    radius
        - ((positive_h * positive_h + positive_v * positive_v).sqrt()
            + horizontal.max(vertical).min(0.0))
}

fn rounded_min(a: f64, b: f64, radius: f64) -> f64 {
    if radius > 0.0 && a < radius && b < radius {
        let x = radius - a;
        let y = radius - b;
        return radius - (x * x + y * y).sqrt();
    }
    if a < b { a } else { b }
}

fn goal_profile(y: f64, z: f64) -> f64 {
    let lower_scale = hypot2(0.041, 1.0);
    let upper_scale = hypot2(0.32, 1.0);
    let lower_corner = 0.041 * 399.0 + 243.0 * lower_scale;
    let upper_corner = 542.0 - 0.32 * 111.0 - 243.0 * upper_scale;
    let lower = z.min((z - 0.041 * (y - 5362.0)) / lower_scale);
    let upper = (GOAL_HEIGHT - z).min((542.0 - 0.32 * (y - 5650.0) - z) / upper_scale);
    let mut distance = lower.min(upper).min(6004.0 - y);
    let back = y - 5761.0;
    if back > 0.0 {
        let offset = z - lower_corner;
        let normal = -offset * lower_scale;
        if normal > 0.0 && back - (normal * 0.041) / lower_scale > 0.0 {
            distance = distance.min(243.0 - hypot2(back, offset));
        }
        let offset = z - upper_corner;
        let normal = offset * upper_scale;
        if normal > 0.0 && back - (normal * 0.32) / upper_scale > 0.0 {
            distance = distance.min(243.0 - hypot2(back, offset));
        }
    }
    distance
}

// TODO(post-port): Compare clamp replacements before changing the original max/min order.
#[allow(clippy::manual_clamp)] // Keep the JavaScript max/min operation order.
fn goal_distance(x: f64, y: f64, z: f64) -> f64 {
    if y < 5120.0 {
        if x >= 893.0 || z >= GOAL_HEIGHT || z <= 0.0 {
            return -(x - 893.0).max(z - GOAL_HEIGHT).max(-z);
        }
        let depth = 5120.0 - y;
        let width = 893.0 - x;
        let height = GOAL_HEIGHT - z;
        let side = (width * width + depth * depth).sqrt();
        let top = (height * height + depth * depth).sqrt();
        return side.min(top).min(z);
    }
    let depth_fraction = ((y - 5120.0) / 60.0).min(1.0);
    let height_fraction = (z / GOAL_HEIGHT).max(0.0).min(1.0);
    rounded_min(
        893.0 - x,
        goal_profile(y, z),
        (110.0 + 25.0 * height_fraction) * depth_fraction,
    )
}

pub fn distance(pos: Vec3) -> f64 {
    let x = pos.x.abs();
    let y = pos.y.abs();
    let field = field_distance(x, y, pos.z);
    if y < 4408.0 && field > 0.0 {
        return field;
    }
    let goal = goal_distance(x, y, pos.z);
    if field > goal { field } else { goal }
}

pub fn normal(pos: Vec3) -> Vec3 {
    let mut result = Vec3::new(
        distance(Vec3::new(pos.x + 0.5, pos.y, pos.z))
            - distance(Vec3::new(pos.x - 0.5, pos.y, pos.z)),
        distance(Vec3::new(pos.x, pos.y + 0.5, pos.z))
            - distance(Vec3::new(pos.x, pos.y - 0.5, pos.z)),
        distance(Vec3::new(pos.x, pos.y, pos.z + 0.5))
            - distance(Vec3::new(pos.x, pos.y, pos.z - 0.5)),
    );
    let length = result.length();
    if length < 1e-9 {
        return Vec3::new(0.0, 0.0, 1.0);
    }
    result.scale(1.0 / length);
    result
}

pub fn ray(origin: Vec3, direction: Vec3, limit: f64) -> Option<(f64, Vec3, Vec3)> {
    let mut t = 0.0;
    for _ in 0..48 {
        let point = origin.with_scaled(direction, t);
        let distance = distance(point);
        if distance < 0.05 {
            return Some((t, point, normal(point)));
        }
        t += distance;
        if t > limit {
            return None;
        }
    }
    None
}
