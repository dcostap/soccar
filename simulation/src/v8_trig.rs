// Adapted from fdlibm and V8 13.6.233 src/base/ieee754.cc.
// Copyright (C) 1993 by Sun Microsystems, Inc. All rights reserved.
// Developed at SunSoft, a Sun Microsystems, Inc. business.
// Permission to use, copy, modify, and distribute this software is freely
// granted, provided that this notice is preserved.
// The original source was modified significantly by Google Inc.
// Copyright 2016 the V8 project authors. All rights reserved.
//
// TODO(post-port): Revisit the V8 trigonometric kernels after full parity passes.
// libm's cosine differed by one ULP in reverse-brake, tick 347.
// Check native/WASM consistency and match performance before removing this code.
// Only game-sized arguments use this reducer. Large arguments use libm.
#![allow(clippy::excessive_precision, clippy::approx_constant)] // Keep the upstream coefficients.

fn high(x: f64) -> u32 {
    (x.to_bits() >> 32) as u32 & 0x7fffffff
}
fn kernel_cos(x: f64, y: f64) -> f64 {
    let ix = high(x);
    if ix < 0x3e400000 {
        return 1.0;
    }
    let z = x * x;
    let r = z
        * (4.16666666666666019037e-2
            + z * (-1.38888888888741095749e-3
                + z * (2.48015872894767294178e-5
                    + z * (-2.75573143513906633035e-7
                        + z * (2.08757232129817482790e-9 + z * -1.13596475577881948265e-11)))));
    if ix < 0x3fd33333 {
        1.0 - (0.5 * z - (z * r - x * y))
    } else {
        let q = if ix > 0x3fe90000 {
            0.28125
        } else {
            f64::from_bits(((ix - 0x00200000) as u64) << 32)
        };
        let iz = 0.5 * z - q;
        let a = 1.0 - q;
        a - (iz - (z * r - x * y))
    }
}
fn kernel_sin(x: f64, y: f64, tail: bool) -> f64 {
    if high(x) < 0x3e400000 {
        return x;
    }
    let z = x * x;
    let v = z * x;
    let r = 8.33333333332248946124e-3
        + z * (-1.98412698298579493134e-4
            + z * (2.75573137070700676789e-6
                + z * (-2.50507602534068634195e-8 + z * 1.58969099521155010221e-10)));
    let s1 = -1.66666666666666324348e-1;
    if !tail {
        x + v * (s1 + z * r)
    } else {
        x - ((z * (0.5 * y - v * r) - y) - v * s1)
    }
}
fn reduce(x: f64) -> (i32, f64, f64) {
    const P1: f64 = 1.57079632673412561417;
    const T1: f64 = 6.07710050650619224932e-11;
    const P2: f64 = 6.07710050630396597660e-11;
    const T2: f64 = 2.02226624879595063154e-21;
    const P3: f64 = 2.02226624871116645580e-21;
    const T3: f64 = 8.47842766036889956997e-32;
    let ix = high(x);
    if ix <= 0x3fe921fb {
        return (0, x, 0.0);
    }
    if ix < 0x4002d97c {
        if x > 0.0 {
            let mut z = x - P1;
            if ix != 0x3ff921fb {
                let a = z - T1;
                return (1, a, (z - a) - T1);
            }
            z -= P2;
            let a = z - T2;
            return (1, a, (z - a) - T2);
        }
        let mut z = x + P1;
        if ix != 0x3ff921fb {
            let a = z + T1;
            return (-1, a, (z - a) + T1);
        }
        z += P2;
        let a = z + T2;
        return (-1, a, (z - a) + T2);
    }
    const WORDS: [u32; 32] = [
        0x3ff921fb, 0x400921fb, 0x4012d97c, 0x401921fb, 0x401f6a7a, 0x4022d97c, 0x4025fdbb,
        0x402921fb, 0x402c463a, 0x402f6a7a, 0x4031475c, 0x4032d97c, 0x40346b9c, 0x4035fdbb,
        0x40378fdb, 0x403921fb, 0x403ab41b, 0x403c463a, 0x403dd85a, 0x403f6a7a, 0x40407e4c,
        0x4041475c, 0x4042106c, 0x4042d97c, 0x4043a28c, 0x40446b9c, 0x404534ac, 0x4045fdbb,
        0x4046c6cb, 0x40478fdb, 0x404858eb, 0x404921fb,
    ];
    let n = (x.abs() * 6.36619772367581382433e-1 + 0.5) as i32;
    let f = n as f64;
    let mut r = x.abs() - f * P1;
    let mut w = f * T1;
    let mut a = r - w;
    if n >= 32 || ix == WORDS[n as usize - 1] {
        let exponent = (ix >> 20) as i32;
        if exponent - ((high(a) >> 20) & 0x7ff) as i32 > 16 {
            let t = r;
            w = f * P2;
            r = t - w;
            w = f * T2 - ((t - r) - w);
            a = r - w;
            if exponent - ((high(a) >> 20) & 0x7ff) as i32 > 49 {
                let t = r;
                w = f * P3;
                r = t - w;
                w = f * T3 - ((t - r) - w);
                a = r - w;
            }
        }
    }
    let b = (r - a) - w;
    if x < 0.0 { (-n, -a, -b) } else { (n, a, b) }
}
pub fn sin(x: f64) -> f64 {
    let ix = high(x);
    if ix <= 0x3fe921fb {
        return kernel_sin(x, 0.0, false);
    }
    if ix > 0x413921fb {
        return libm::sin(x);
    }
    let (n, a, b) = reduce(x);
    match n & 3 {
        0 => kernel_sin(a, b, true),
        1 => kernel_cos(a, b),
        2 => -kernel_sin(a, b, true),
        _ => -kernel_cos(a, b),
    }
}
pub fn cos(x: f64) -> f64 {
    let ix = high(x);
    if ix <= 0x3fe921fb {
        return kernel_cos(x, 0.0);
    }
    if ix > 0x413921fb {
        return libm::cos(x);
    }
    let (n, a, b) = reduce(x);
    match n & 3 {
        0 => kernel_cos(a, b),
        1 => -kernel_sin(a, b, true),
        2 => -kernel_cos(a, b),
        _ => kernel_sin(a, b, true),
    }
}
