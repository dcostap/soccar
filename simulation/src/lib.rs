//! Authoritative Soccar simulation for native and browser clients.

pub mod arena;
pub mod ball;
pub mod brains;
pub mod car;
pub mod game;
pub mod harness;
pub mod math;
pub mod predictor;
pub mod random;
pub mod recording;
pub mod rotation;
pub mod scenario;
pub mod snapshot;
pub mod vector;
#[cfg(target_arch = "wasm32")]
mod wasm;
pub mod world;

pub const DT: f64 = 1.0 / 120.0;
