use crate::{
    math::{cos, sin},
    vector::Vec3,
};

#[derive(Clone, Copy, Debug)]
pub struct Quat {
    pub x: f64,
    pub y: f64,
    pub z: f64,
    pub w: f64,
}
impl Default for Quat {
    fn default() -> Self {
        Self {
            x: 0.0,
            y: 0.0,
            z: 0.0,
            w: 1.0,
        }
    }
}
impl Quat {
    pub fn euler(yaw: f64, pitch: f64, roll: f64) -> Self {
        let r = cos(yaw / 2.0);
        let i = sin(yaw / 2.0);
        let a = cos(-pitch / 2.0);
        let o = sin(-pitch / 2.0);
        let s = cos(roll / 2.0);
        let c = sin(roll / 2.0);
        Self {
            w: r * a * s + i * o * c,
            x: r * a * c - i * o * s,
            y: r * o * s + i * a * c,
            z: i * a * s - r * o * c,
        }
    }
    pub fn normalize(&mut self) {
        let length = (self.x * self.x + self.y * self.y + self.z * self.z + self.w * self.w).sqrt();
        if length == 0.0 {
            *self = Self::default();
        } else {
            let scale = 1.0 / length;
            self.x *= scale;
            self.y *= scale;
            self.z *= scale;
            self.w *= scale;
        }
    }
    pub fn integrate(&mut self, velocity: Vec3, dt: f64) {
        let angle = velocity.length() * dt;
        if angle < 1e-9 {
            return;
        }
        let inv = 1.0 / velocity.length();
        let sine = sin(angle / 2.0);
        let cosine = cos(angle / 2.0);
        let x = velocity.x * inv * sine;
        let y = velocity.y * inv * sine;
        let z = velocity.z * inv * sine;
        *self = Self {
            x: cosine * self.x + x * self.w + y * self.z - z * self.y,
            y: cosine * self.y - x * self.z + y * self.w + z * self.x,
            z: cosine * self.z + x * self.y - y * self.x + z * self.w,
            w: cosine * self.w - x * self.x - y * self.y - z * self.z,
        };
        self.normalize();
    }
}

#[derive(Clone, Copy, Debug)]
pub struct Mat3 {
    pub values: [f64; 9],
}
impl Default for Mat3 {
    fn default() -> Self {
        Self {
            values: [1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0],
        }
    }
}
impl Mat3 {
    pub fn from_quat(q: Quat) -> Self {
        let a = q.x + q.x;
        let o = q.y + q.y;
        let s = q.z + q.z;
        let c = q.x * a;
        let l = q.x * o;
        let u = q.x * s;
        let d = q.y * o;
        let f = q.y * s;
        let p = q.z * s;
        let m = q.w * a;
        let h = q.w * o;
        let g = q.w * s;
        Self {
            values: [
                1.0 - (d + p),
                l - g,
                u + h,
                l + g,
                1.0 - (c + p),
                f - m,
                u - h,
                f + m,
                1.0 - (c + d),
            ],
        }
    }
    pub fn mul_vec(self, v: Vec3) -> Vec3 {
        let n = self.values;
        Vec3::new(
            n[0] * v.x + n[1] * v.y + n[2] * v.z,
            n[3] * v.x + n[4] * v.y + n[5] * v.z,
            n[6] * v.x + n[7] * v.y + n[8] * v.z,
        )
    }
    pub fn transpose_mul(self, v: Vec3) -> Vec3 {
        let n = self.values;
        Vec3::new(
            n[0] * v.x + n[3] * v.y + n[6] * v.z,
            n[1] * v.x + n[4] * v.y + n[7] * v.z,
            n[2] * v.x + n[5] * v.y + n[8] * v.z,
        )
    }
    pub fn column(self, index: usize) -> Vec3 {
        Vec3::new(
            self.values[index],
            self.values[3 + index],
            self.values[6 + index],
        )
    }
}
