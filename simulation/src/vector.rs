#[derive(Clone, Copy, Debug, Default, serde::Serialize, serde::Deserialize)]
pub struct Vec3 {
    pub x: f64,
    pub y: f64,
    pub z: f64,
}

impl Vec3 {
    pub const fn new(x: f64, y: f64, z: f64) -> Self {
        Self { x, y, z }
    }

    pub fn scale(&mut self, scale: f64) {
        self.x *= scale;
        self.y *= scale;
        self.z *= scale;
    }

    pub fn scaled(mut self, scale: f64) -> Self {
        self.scale(scale);
        self
    }
    pub fn plus(mut self, other: Self) -> Self {
        self.add(other);
        self
    }
    pub fn minus(mut self, other: Self) -> Self {
        self.sub(other);
        self
    }
    pub fn with_scaled(mut self, other: Self, scale: f64) -> Self {
        self.add_scaled(other, scale);
        self
    }
    pub fn normalized(mut self) -> Self {
        let length = self.length();
        if length > 1e-12 {
            self.scale(1.0 / length);
        }
        self
    }
    pub fn distance(self, other: Self) -> f64 {
        self.minus(other).length()
    }
    pub fn is_zero(self) -> bool {
        self.x == 0.0 && self.y == 0.0 && self.z == 0.0
    }

    pub fn add(&mut self, other: Self) {
        self.x += other.x;
        self.y += other.y;
        self.z += other.z;
    }

    pub fn sub(&mut self, other: Self) {
        self.x -= other.x;
        self.y -= other.y;
        self.z -= other.z;
    }

    pub fn add_scaled(&mut self, other: Self, scale: f64) {
        self.x += other.x * scale;
        self.y += other.y * scale;
        self.z += other.z * scale;
    }

    pub fn dot(self, other: Self) -> f64 {
        self.x * other.x + self.y * other.y + self.z * other.z
    }

    pub fn length_sq(self) -> f64 {
        self.x * self.x + self.y * self.y + self.z * self.z
    }

    pub fn length(self) -> f64 {
        self.length_sq().sqrt()
    }

    pub fn cross(self, other: Self) -> Self {
        Self::new(
            self.y * other.z - self.z * other.y,
            self.z * other.x - self.x * other.z,
            self.x * other.y - self.y * other.x,
        )
    }

    pub fn clamp_length(&mut self, limit: f64) {
        let squared = self.length_sq();
        if squared > limit * limit {
            self.scale(limit / squared.sqrt());
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn cross_product_uses_original_components() {
        let a = Vec3::new(1.0, 2.0, 3.0);
        let b = Vec3::new(4.0, 5.0, 6.0);
        let c = a.cross(b);
        assert_eq!([c.x, c.y, c.z], [-3.0, 6.0, -3.0]);
    }
}
