//! Simulation port. Keep the JavaScript operation order until comparison tests pass.

pub mod arena;
pub mod ball;
pub mod bot;
pub mod car;
pub mod game;
pub mod math;
pub mod random;
pub mod rotation;
pub mod snapshot;
mod v8_trig;
pub mod vector;
#[cfg(target_arch = "wasm32")]
mod wasm;
pub mod world;

pub const DT: f64 = 1.0 / 120.0;
