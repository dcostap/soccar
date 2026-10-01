//! Headless match runner for batch experiments. It skips rendering state and replay playback.
use crate::{
    bot::Skill,
    car::Controls,
    game::{Config, Game, Phase, Stats},
};
use std::{
    sync::{
        atomic::{AtomicUsize, Ordering},
        mpsc,
    },
    thread,
    time::{Duration, Instant},
};

#[derive(Clone, Copy, Debug)]
pub struct MatchSpec {
    pub seed: u32,
    pub team_size: usize,
    /// Bot skill for blue (team zero) and orange (team one).
    pub skills: [Skill; 2],
    /// Match length in seconds. Zero means unlimited play.
    pub duration: f64,
    /// Controller tick limit. A match that reaches it is incomplete.
    pub max_ticks: u32,
    /// Play replays after goals. This adds controller ticks but does not change physics or scores.
    pub replays: bool,
}
impl Default for MatchSpec {
    fn default() -> Self {
        Self {
            seed: 12345,
            team_size: 3,
            skills: [Skill::Allstar; 2],
            duration: 300.0,
            max_ticks: 216_000,
            replays: false,
        }
    }
}

#[derive(Clone, Debug)]
pub struct MatchResult {
    pub spec: MatchSpec,
    pub completed: bool,
    pub score: [u32; 2],
    pub overtime: bool,
    pub clock: f64,
    pub controller_ticks: u32,
    pub physics_ticks: i64,
    /// Team and statistics for each car, in car order.
    pub players: Vec<(usize, Stats)>,
    pub elapsed: Duration,
}
impl MatchResult {
    /// The winning team, or `None` when the match did not complete.
    pub fn winner(&self) -> Option<usize> {
        self.completed
            .then_some(if self.score[0] > self.score[1] { 0 } else { 1 })
    }
}

/// Plays one bot-only match to completion or to its tick limit.
pub fn run_match(spec: MatchSpec) -> MatchResult {
    let start = Instant::now();
    let mut game = Game::new(spec.seed);
    game.skip_replays = !spec.replays;
    game.start_match(Config {
        team_size: spec.team_size,
        skills: spec.skills,
        player_team: -1,
        duration: spec.duration,
        ..Config::default()
    });
    let mut ticks = 0;
    while game.phase != Phase::Ended && ticks < spec.max_ticks {
        game.tick(Controls::default());
        ticks += 1;
    }
    MatchResult {
        spec,
        completed: game.phase == Phase::Ended,
        score: game.score,
        overtime: game.overtime,
        clock: game.clock,
        controller_ticks: ticks,
        physics_ticks: game.world.tick,
        players: game
            .world
            .cars
            .iter()
            .map(|c| (c.team, game.stats[c.id]))
            .collect(),
        elapsed: start.elapsed(),
    }
}

/// Plays matches on `threads` workers. Each match is independent, so results do not depend on the thread count.
/// `on_result` receives the spec index and result in completion order.
pub fn run_batch(
    specs: &[MatchSpec],
    threads: usize,
    mut on_result: impl FnMut(usize, MatchResult),
) {
    let next = AtomicUsize::new(0);
    let (tx, rx) = mpsc::channel();
    thread::scope(|scope| {
        for _ in 0..threads.clamp(1, specs.len().max(1)) {
            let tx = tx.clone();
            let next = &next;
            scope.spawn(move || {
                loop {
                    let index = next.fetch_add(1, Ordering::Relaxed);
                    let Some(&spec) = specs.get(index) else {
                        break;
                    };
                    if tx.send((index, run_match(spec))).is_err() {
                        break;
                    }
                }
            });
        }
        drop(tx);
        for (index, result) in rx {
            on_result(index, result);
        }
    });
}

/// Aggregate outcome of a batch.
#[derive(Clone, Debug, Default)]
pub struct Summary {
    pub matches: usize,
    pub completed: usize,
    pub wins: [usize; 2],
    pub overtimes: usize,
    pub goals: [u64; 2],
    pub physics_ticks: u64,
}
impl Summary {
    pub fn add(&mut self, result: &MatchResult) {
        self.matches += 1;
        self.completed += usize::from(result.completed);
        if let Some(team) = result.winner() {
            self.wins[team] += 1;
        }
        self.overtimes += usize::from(result.overtime);
        self.goals[0] += u64::from(result.score[0]);
        self.goals[1] += u64::from(result.score[1]);
        self.physics_ticks += result.physics_ticks as u64;
    }
}
