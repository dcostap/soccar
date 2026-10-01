//! Math compatibility for the locked JavaScript reference.

pub use crate::v8_trig::{cos, sin};
// TODO(post-port): Compare native atan2 against this shared software calculation.
// Keep libm during parity so native and WASM builds use the same operation order.
pub use libm::atan2;

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

/// Two-argument Math.hypot in V8 13.6.233.
/// Source: https://github.com/v8/v8/blob/13.6.233/src/builtins/math.tq
/// Keep this calculation during the parity port instead of the platform hypot.
// TODO(post-port): Revisit this JavaScript compatibility change after full simulation parity passes.
// Native f64::hypot changed arena.normal.y in blue-goal at tick 41 by about 1.37e-14.
// Compare native and WASM behavior and performance before restoring the native calculation.
// Neither version is necessarily wrong. This calculation only preserves the JavaScript reference.
// Treat restoration as a separate behavior change. Review and update the affected comparison baselines.
pub fn hypot2(x: f64, y: f64) -> f64 {
    let a = x.abs();
    let b = y.abs();
    if a.is_infinite() || b.is_infinite() {
        return f64::INFINITY;
    }
    if a.is_nan() || b.is_nan() {
        return f64::NAN;
    }
    let max = a.max(b);
    if max == 0.0 {
        return 0.0;
    }
    let a = a / max;
    let b = b / max;
    (a * a + b * b).sqrt() * max
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn hypot_special_values_follow_javascript() {
        assert_eq!(hypot2(-0.0, 0.0).to_bits(), 0.0_f64.to_bits());
        assert_eq!(hypot2(f64::INFINITY, f64::NAN), f64::INFINITY);
        assert!(hypot2(f64::NAN, 1.0).is_nan());
        assert_eq!(hypot2(3.0, 4.0), 5.0);
        assert!(hypot2(1e308, 1e308).is_finite());
    }
}
