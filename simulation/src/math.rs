//! Deterministic math. `libm` is pure Rust, so native platforms and WASM produce identical bits.
//! Platform `f64::sin` and friends call the C library, which differs between Windows, Linux, and WASM.

pub use libm::{atan2, cos, sin};

pub fn clamp(x: f64, low: f64, high: f64) -> f64 {
    if x < low {
        low
    } else if x > high {
        high
    } else {
        x
    }
}
pub fn sign(x: f64) -> f64 {
    if x > 0.0 {
        1.0
    } else if x < 0.0 {
        -1.0
    } else {
        0.0
    }
}
pub fn curve(points: &[(f64, f64)], x: f64) -> f64 {
    if x <= points[0].0 {
        return points[0].1;
    }
    if x >= points[points.len() - 1].0 {
        return points[points.len() - 1].1;
    }
    for pair in points.windows(2) {
        if x < pair[1].0 {
            let fraction = (x - pair[0].0) / (pair[1].0 - pair[0].0);
            return pair[0].1 + (pair[1].1 - pair[0].1) * fraction;
        }
    }
    points[points.len() - 1].1
}

/// Euclidean length of `(x, y)`. Game values cannot overflow, so no scaling is needed.
/// Square root is correctly rounded on every platform.
pub fn hypot2(x: f64, y: f64) -> f64 {
    (x * x + y * y).sqrt()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn hypot_matches_exact_cases() {
        assert_eq!(hypot2(3.0, 4.0), 5.0);
        assert_eq!(hypot2(-0.0, 0.0), 0.0);
    }
}
