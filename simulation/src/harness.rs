//! Headless match runner for batch experiments. It skips rendering state and replay playback.
//!
//! A bot-only match depends only on its `MatchSpec`, so any result can be replayed exactly,
//! natively or in the browser.
use crate::{
    DT,
    brains::{BrainSpec, Skill},
    car::Controls,
    game::{Config, Game, Phase},
    world::{BALL_HIT, BOOST_PICKUP, BUMP, DEMO, FLIP, JUMP, RESPAWN},
};
use std::{
    sync::{
        atomic::{AtomicBool, AtomicUsize, Ordering},
        mpsc,
    },
    thread,
    time::{Duration, Instant},
};

#[derive(Clone, Debug)]
pub struct MatchSpec {
    pub seed: u32,
    pub team_size: usize,
    /// Brains for blue (team zero) and orange (team one).
    pub brains: [BrainSpec; 2],
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
            brains: [
                BrainSpec::preset(Skill::Allstar),
                BrainSpec::preset(Skill::Allstar),
            ],
            duration: 300.0,
            max_ticks: 216_000,
            replays: false,
        }
    }
}

/// Everything recorded about one car. Times are in seconds of live play, distances in unreal units.
#[derive(Clone, Copy, Debug, Default)]
pub struct PlayerReport {
    pub car: usize,
    pub team: usize,
    pub score: u32,
    pub goals: u32,
    pub assists: u32,
    pub shots: u32,
    pub saves: u32,
    /// Ball hits strong enough to raise a hit event.
    pub touches: u32,
    pub demos: u32,
    pub demoed: u32,
    pub bumps: u32,
    pub jumps: u32,
    pub flips: u32,
    pub big_pads: u32,
    pub small_pads: u32,
    pub boost_used: f64,
    pub distance: f64,
    pub supersonic: f64,
    pub airborne: f64,
    /// Time in the opponent's half.
    pub offense: f64,
    /// Mean distance to the ball.
    pub ball_distance: f64,
}
impl PlayerReport {
    /// Field names and values, in a fixed order, for tables and JSON.
    pub fn fields(&self) -> [(&'static str, f64); 19] {
        [
            ("score", self.score as f64),
            ("goals", self.goals as f64),
            ("assists", self.assists as f64),
            ("shots", self.shots as f64),
            ("saves", self.saves as f64),
            ("touches", self.touches as f64),
            ("demos", self.demos as f64),
            ("demoed", self.demoed as f64),
            ("bumps", self.bumps as f64),
            ("jumps", self.jumps as f64),
            ("flips", self.flips as f64),
            ("bigPads", self.big_pads as f64),
            ("smallPads", self.small_pads as f64),
            ("boostUsed", self.boost_used),
            ("distance", self.distance),
            ("supersonic", self.supersonic),
            ("airborne", self.airborne),
            ("offense", self.offense),
            ("ballDistance", self.ball_distance),
        ]
    }
}

/// Team totals that are not sums of player values.
#[derive(Clone, Copy, Debug, Default)]
pub struct TeamReport {
    /// Live time with this team holding the last touch.
    pub possession: f64,
    /// Live time with the ball in this team's half.
    pub defending: f64,
    /// Wall-clock milliseconds spent in this team's brain.
    pub brain_ms: f64,
}

/// Columns and rows of a heatmap. Cells are 512 units square and cover the field from wall to wall
/// and goal line to goal line. Positions beyond the edges, such as inside a goal, count in the edge cells.
pub const HEAT_COLUMNS: usize = 16;
pub const HEAT_ROWS: usize = 20;
const HEAT_CELL: f64 = 512.0;

/// Live ticks spent in each cell, row by row from the bottom goal line, `HEAT_COLUMNS` per row.
/// Each team's map is turned so that the team attacks up the rows; orange positions are rotated half a turn.
/// The ball map is seen from blue's side.
#[derive(Clone, Debug, Default)]
pub struct Heatmaps {
    pub teams: [Vec<u32>; 2],
    pub ball: Vec<u32>,
}
impl Heatmaps {
    fn new() -> Self {
        let empty = vec![0; HEAT_COLUMNS * HEAT_ROWS];
        Self {
            teams: [empty.clone(), empty.clone()],
            ball: empty,
        }
    }
    /// The cell of a position, after rotating it half a turn when `flip` is set.
    pub fn cell(x: f64, y: f64, flip: bool) -> usize {
        let (x, y) = if flip { (-x, -y) } else { (x, y) };
        let index = |v: f64, count: usize| {
            ((v / HEAT_CELL + count as f64 / 2.0).floor().max(0.0) as usize).min(count - 1)
        };
        index(y, HEAT_ROWS) * HEAT_COLUMNS + index(x, HEAT_COLUMNS)
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
    /// Seconds of live play, from kickoff to goal or end.
    pub live: f64,
    pub teams: [TeamReport; 2],
    /// One report per car, in car order.
    pub players: Vec<PlayerReport>,
    /// Where the cars and the ball spent live play.
    pub heatmaps: Heatmaps,
    pub elapsed: Duration,
}
impl MatchResult {
    /// The winning team, or `None` when the match did not complete.
    pub fn winner(&self) -> Option<usize> {
        self.completed
            .then_some(if self.score[0] > self.score[1] { 0 } else { 1 })
    }
}

/// Starts a bot-only match. Every tool that replays a spec must start it this way.
pub fn start(spec: &MatchSpec) -> Game {
    let mut game = Game::new(spec.seed);
    game.skip_replays = !spec.replays;
    game.start_match(Config {
        team_size: spec.team_size,
        brains: spec.brains.clone(),
        player_team: -1,
        duration: spec.duration,
        ..Config::default()
    });
    game
}

/// Plays one bot-only match to completion or to its tick limit.
pub fn run_match(spec: MatchSpec) -> MatchResult {
    let begin = Instant::now();
    let mut game = start(&spec);
    game.measure_brains = true;
    let cars = game.world.cars.len();
    let mut players: Vec<_> = game
        .world
        .cars
        .iter()
        .map(|c| PlayerReport {
            car: c.id,
            team: c.team,
            ..PlayerReport::default()
        })
        .collect();
    let mut teams = [TeamReport::default(); 2];
    let mut heatmaps = Heatmaps::new();
    let mut boost: Vec<f64> = game.world.cars.iter().map(|c| c.boost).collect();
    let mut respawned = vec![false; cars];
    let mut live = 0.0;
    let mut ticks = 0;
    while game.phase != Phase::Ended && ticks < spec.max_ticks {
        let before = game.phase;
        game.tick(Controls::default());
        ticks += 1;
        respawned.fill(false);
        for e in &game.notifications {
            let car = e.car as usize;
            match e.kind {
                BALL_HIT => players[car].touches += 1,
                DEMO => {
                    players[car].demos += 1;
                    players[e.other as usize].demoed += 1;
                }
                BUMP => players[car].bumps += 1,
                JUMP => players[car].jumps += 1,
                FLIP => players[car].flips += 1,
                BOOST_PICKUP if game.world.pads[e.pad as usize].big => players[car].big_pads += 1,
                BOOST_PICKUP => players[car].small_pads += 1,
                RESPAWN => respawned[car] = true,
                _ => {}
            }
        }
        if before == Phase::Playing && game.phase == Phase::Playing {
            live += DT;
            let ball = game.world.ball.pos;
            if let Some(car) = game.world.last_touch {
                teams[game.world.cars[car].team].possession += DT;
            }
            teams[usize::from(ball.y > 0.0)].defending += DT;
            heatmaps.ball[Heatmaps::cell(ball.x, ball.y, false)] += 1;
            for (p, c) in players.iter_mut().zip(&game.world.cars) {
                if !respawned[c.id] {
                    p.boost_used += (boost[c.id] - c.boost).max(0.0);
                }
                if c.is_demoed {
                    continue;
                }
                heatmaps.teams[c.team][Heatmaps::cell(c.pos.x, c.pos.y, c.team == 1)] += 1;
                p.distance += c.vel.length() * DT;
                p.ball_distance += c.pos.distance(ball) * DT;
                if c.is_supersonic {
                    p.supersonic += DT;
                }
                if !c.is_on_ground {
                    p.airborne += DT;
                }
                if (c.pos.y > 0.0) == (c.team == 0) {
                    p.offense += DT;
                }
            }
        }
        for (b, c) in boost.iter_mut().zip(&game.world.cars) {
            *b = c.boost;
        }
    }
    for p in &mut players {
        let s = game.stats[p.car];
        (p.score, p.goals, p.assists, p.shots, p.saves) =
            (s.score, s.goals, s.assists, s.shots, s.saves);
        if live > 0.0 {
            p.ball_distance /= live;
        }
    }
    for (t, seconds) in teams.iter_mut().zip(game.brain_seconds) {
        t.brain_ms = seconds * 1000.0;
    }
    MatchResult {
        spec,
        completed: game.phase == Phase::Ended,
        score: game.score,
        overtime: game.overtime,
        clock: game.clock,
        controller_ticks: ticks,
        physics_ticks: game.world.tick,
        live,
        teams,
        players,
        heatmaps,
        elapsed: begin.elapsed(),
    }
}

/// Plays matches on `threads` workers until all are done or `on_result` returns false.
/// Each match is independent, so results do not depend on the thread count.
/// `on_result` receives the spec index and result in completion order.
pub fn run_until(
    specs: &[MatchSpec],
    threads: usize,
    mut on_result: impl FnMut(usize, MatchResult) -> bool,
) {
    let next = AtomicUsize::new(0);
    let stop = AtomicBool::new(false);
    let (tx, rx) = mpsc::channel();
    thread::scope(|scope| {
        for _ in 0..threads.clamp(1, specs.len().max(1)) {
            let tx = tx.clone();
            let (next, stop) = (&next, &stop);
            scope.spawn(move || {
                while !stop.load(Ordering::Relaxed) {
                    let index = next.fetch_add(1, Ordering::Relaxed);
                    let Some(spec) = specs.get(index) else {
                        break;
                    };
                    if tx.send((index, run_match(spec.clone()))).is_err() {
                        break;
                    }
                }
            });
        }
        drop(tx);
        for (index, result) in rx {
            if !stop.load(Ordering::Relaxed) && !on_result(index, result) {
                stop.store(true, Ordering::Relaxed);
            }
        }
    });
}

/// Plays every match. See `run_until`.
pub fn run_batch(
    specs: &[MatchSpec],
    threads: usize,
    mut on_result: impl FnMut(usize, MatchResult),
) {
    run_until(specs, threads, |index, result| {
        on_result(index, result);
        true
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
