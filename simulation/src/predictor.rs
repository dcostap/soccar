//! Shared ball prediction. The game updates one predictor per tick and every brain reads it.
use crate::{DT, ball::Ball, vector::Vec3, world::World};
use std::collections::VecDeque;
#[derive(Clone, Copy, Debug)]
pub struct Slice {
    pub t: f64,
    pub pos: Vec3,
    pub vel: Vec3,
}
const PREDICTION_STEPS: usize = 480;
#[derive(Clone, Debug)]
pub struct Predictor {
    pub slices: Vec<Slice>,
    pub sim: Ball,
    pub last_tick: i64,
    /// Ball state after each step of the current prediction.
    path: VecDeque<Ball>,
}
impl Default for Predictor {
    fn default() -> Self {
        Self {
            slices: Vec::with_capacity(PREDICTION_STEPS / 2),
            sim: Ball::default(),
            last_tick: -100,
            path: VecDeque::with_capacity(PREDICTION_STEPS),
        }
    }
}
impl Predictor {
    pub fn update(&mut self, world: &World) {
        let elapsed = world.tick - self.last_tick;
        if elapsed < 4 {
            return;
        }
        self.last_tick = world.tick;
        // An untouched ball follows the previous prediction exactly, so only the new tail is simulated.
        let elapsed = elapsed as usize;
        if self.path.len() == PREDICTION_STEPS
            && elapsed <= PREDICTION_STEPS
            && self.path[elapsed - 1].same_motion(&world.ball)
        {
            self.path.drain(..elapsed);
        } else {
            self.path.clear();
            self.sim.copy_from(&world.ball);
            self.sim.frozen = world.ball.frozen;
        }
        while self.path.len() < PREDICTION_STEPS {
            self.sim.step();
            self.path.push_back(self.sim);
        }
        self.slices.clear();
        for tick in (2..=PREDICTION_STEPS).step_by(2) {
            let state = &self.path[tick - 1];
            self.slices.push(Slice {
                t: tick as f64 * DT,
                pos: state.pos,
                vel: state.vel,
            });
        }
    }
}
