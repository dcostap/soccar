//! Contest brain "bravo". See arena/CONTEST.md. Replace this file with your brain.
//! It starts as the classic bot, so `bravo.brain` plays exactly like allstar until you change it.
use super::{Brain, Params, classic};

pub fn create(params: &mut Params, team: usize, cars: &[usize]) -> Result<Box<dyn Brain>, String> {
    classic::create(params, team, cars)
}
