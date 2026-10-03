//! Portable control recordings and exact, single-car set pieces.
use crate::{
    DT,
    brains::BrainSpec,
    car::Controls,
    game::{Driver, Game, Mode, Phase},
    rotation::Quat,
    scenario::{GROUND_WAIT, Judge, Scenario},
    snapshot,
    vector::Vec3,
};
use serde::{Deserialize, Serialize};
use std::sync::Arc;

pub const MAX_TICKS: usize = 180_000;
pub const MAX_BYTES: usize = 96 * 1024 * 1024;
pub const FORMAT: u32 = 1;

const LEGACY_SAVE_ENGINE: &str = "0d5bdf1712f5497d";
fn compatible_engine(recorded: &str, current: &str) -> bool {
    recorded == current
}

#[cfg(test)]
mod compatibility_tests {
    use super::*;

    #[test]
    fn physics_changes_reject_every_previous_recording_engine() {
        let current = engine_version();
        assert!(compatible_engine(&current, &current));
        for old in [LEGACY_SAVE_ENGINE, "88f27cd63490dfc3", "09645b7b1e85f2e6"] {
            assert!(!compatible_engine(old, &current));
        }
        assert!(!compatible_engine("unknown-engine", &current));
    }
}

fn recording_engine(game: &Game) -> String {
    if game.uses_legacy_saves() {
        LEGACY_SAVE_ENGINE.to_string()
    } else {
        engine_version()
    }
}

/// Control recordings do not depend on later changes to bot code.
pub fn engine_version() -> String {
    let source = concat!(
        include_str!("game.rs"),
        include_str!("world.rs"),
        include_str!("car.rs"),
        include_str!("ball.rs"),
        include_str!("arena.rs"),
        include_str!("math.rs"),
        include_str!("rotation.rs"),
        include_str!("vector.rs"),
        include_str!("random.rs"),
        include_str!("predictor.rs"),
        "libm=0.2.15;recording=1"
    );
    let mut hash = 0xcbf29ce484222325_u64;
    for byte in source.bytes() {
        hash = (hash ^ byte as u64).wrapping_mul(0x100000001b3);
    }
    format!("{hash:016x}")
}

pub fn input(c: Controls) -> [f64; 9] {
    [
        c.throttle,
        c.steer,
        c.pitch,
        c.yaw,
        c.roll,
        c.jump as u8 as f64,
        c.boost as u8 as f64,
        c.handbrake as u8 as f64,
        c.dodge_mag.unwrap_or(-1.0),
    ]
}
pub fn controls(v: [f64; 9]) -> Controls {
    Controls {
        throttle: v[0],
        steer: v[1],
        pitch: v[2],
        yaw: v[3],
        roll: v[4],
        jump: v[5] != 0.0,
        boost: v[6] != 0.0,
        handbrake: v[7] != 0.0,
        dodge_mag: (v[8] >= 0.0).then_some(v[8]),
    }
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct Frame {
    pub cars: Vec<[f64; 9]>,
    pub unlimited: bool,
    pub dodge: f64,
    pub skip: bool,
}
impl Frame {
    fn capture(game: &Game, skip: bool) -> Self {
        Self {
            cars: game.world.cars.iter().map(|c| input(c.controls)).collect(),
            unlimited: game.unlimited_boost,
            dodge: game
                .player
                .map_or(0.5, |id| game.world.cars[id].dodge_deadzone),
            skip,
        }
    }
}

#[derive(Clone, Debug)]
pub struct Recorder {
    pub initial: Box<Game>,
    pub frames: Vec<Frame>,
    pub skip: bool,
}
impl Recorder {
    pub fn push(&mut self, game: &Game) {
        if self.frames.len() < MAX_TICKS {
            self.frames.push(Frame::capture(game, self.skip));
            self.skip = false;
        }
    }
    pub fn text(&self) -> Result<String, String> {
        #[derive(Serialize)]
        struct File<'a> {
            format: u32,
            engine: String,
            initial: &'a Game,
            frames: &'a [Frame],
        }
        let text = serde_json::to_string(&File {
            format: FORMAT,
            engine: recording_engine(&self.initial),
            initial: &self.initial,
            frames: &self.frames,
        })
        .map_err(|e| e.to_string())?;
        if text.len() > MAX_BYTES {
            return Err("Recording exceeds the 96 MiB file limit".into());
        }
        Ok(text)
    }
}

#[derive(Clone, Debug)]
pub struct Playback {
    pub frames: Arc<Vec<Frame>>,
    pub cursor: usize,
    pub selected: Option<usize>,
    pub input_car: Option<usize>,
    pub scenario: bool,
    pub recorded: bool,
    /// Keep the original statistics when playing a recording from before the save update.
    pub legacy_saves: bool,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct Replay {
    pub format: u32,
    pub engine: String,
    pub initial: Game,
    pub frames: Vec<Frame>,
}
impl Replay {
    pub fn parse(text: &str) -> Result<Self, String> {
        if text.len() > MAX_BYTES {
            return Err("Recording is too large".into());
        }
        let replay: Self =
            serde_json::from_str(text).map_err(|e| format!("Invalid recording: {e}"))?;
        validate(
            &replay.engine,
            replay.format,
            &replay.initial,
            &replay.frames,
        )?;
        if replay.frames.is_empty() {
            return Err("Recording has no simulation ticks".into());
        }
        Ok(replay)
    }
    pub fn start(self) -> Game {
        let mut game = self.initial;
        game.playback = Some(Playback {
            frames: Arc::new(self.frames),
            cursor: 0,
            selected: None,
            input_car: game.player,
            scenario: false,
            recorded: true,
            legacy_saves: self.engine == LEGACY_SAVE_ENGINE,
        });
        game
    }
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct Clip {
    pub format: u32,
    pub engine: String,
    pub state: Game,
    pub car: usize,
    /// None means recorded controls. A fixed brain drives all other cars otherwise.
    pub others: Option<BrainSpec>,
    pub frames: Arc<Vec<Frame>>,
    pub input_car: Option<usize>,
    pub source_tick: usize,
    pub source_team: usize,
}
impl Clip {
    pub fn parse(text: &str, time: f64) -> Result<Self, String> {
        if !time.is_finite() || time <= 0.0 || time > 60.0 {
            return Err("Time must be in (0, 60]".into());
        }
        if text.len() > MAX_BYTES {
            return Err("Set piece is too large".into());
        }
        let clip: Self =
            serde_json::from_str(text).map_err(|e| format!("Invalid set piece recording: {e}"))?;
        validate(&clip.engine, clip.format, &clip.state, &clip.frames)?;
        if clip.car >= clip.state.world.cars.len() || clip.state.world.cars[clip.car].team != 0 {
            return Err("The selected car must belong to blue".into());
        }
        if clip.state.world.cars[clip.car].is_demoed || clip.state.phase != Phase::Playing {
            return Err("Choose an active car during live play".into());
        }
        if clip
            .input_car
            .is_some_and(|id| id >= clip.state.world.cars.len())
        {
            return Err("Invalid input car".into());
        }
        if clip.source_team > 1 || clip.input_car != clip.state.player {
            return Err("Invalid source car".into());
        }
        if clip.frames.len() < ((time + GROUND_WAIT) / DT).ceil() as usize {
            return Err("Recording must cover the timeout and three finishing seconds".into());
        }
        if let Some(spec) = &clip.others {
            spec.create(0, &[])?;
        }
        Ok(clip)
    }
    pub fn capture(
        game: &Game,
        car: usize,
        time: f64,
        others: Option<BrainSpec>,
    ) -> Result<Self, String> {
        if car >= game.world.cars.len()
            || game.world.cars[car].is_demoed
            || game.phase != Phase::Playing
        {
            return Err("Choose an active car during live play".into());
        }
        if !time.is_finite() || time <= 0.0 || time > 60.0 {
            return Err("Time must be in (0, 60]".into());
        }
        let count = ((time + GROUND_WAIT) / DT).ceil() as usize;
        let mut future = game.clone();
        future.recording = None;
        let input_car = future
            .playback
            .as_ref()
            .map_or(future.player, |p| p.input_car);
        let mut frames = Vec::with_capacity(count);
        if let Some(p) = &future.playback {
            if p.scenario {
                return Err("Capture a match replay, not a set piece replay".into());
            }
            if others.is_none() && p.frames.len() - p.cursor < count {
                return Err("Not enough recorded play remains. Choose an earlier moment or a shorter timeout".into());
            }
            let end = (p.cursor + count).min(p.frames.len());
            frames.extend_from_slice(&p.frames[p.cursor..end]);
            // Fixed drivers need no future control tape. Keep the last recorded input settings.
            let mut tail = frames
                .last()
                .cloned()
                .unwrap_or_else(|| Frame::capture(game, false));
            tail.cars = vec![input(Controls::default()); game.world.cars.len()];
            tail.skip = false;
            frames.resize(count, tail);
        } else {
            // Arena replays have no human inputs. Their future controls can be generated from the checkpoint.
            if future.player.is_some() {
                return Err("Save and open your replay before exporting a moment".into());
            }
            for _ in 0..count {
                if future.phase == Phase::Ended {
                    frames.push(Frame {
                        cars: vec![input(Controls::default()); future.world.cars.len()],
                        unlimited: false,
                        dodge: 0.5,
                        skip: false,
                    });
                } else {
                    future.tick(Controls::default());
                    frames.push(Frame::capture(&future, false));
                }
            }
        }
        let mut state = game.clone();
        state.recording = None;
        state.playback = None;
        state.drivers.clear();
        state.measure_brains = false;
        state.brain_seconds = [0.0; 2];
        if state.world.cars[car].team == 1 {
            turn(&mut state);
        }
        Ok(Self {
            format: FORMAT,
            engine: recording_engine(game),
            state,
            car,
            others,
            frames: Arc::new(frames),
            input_car,
            source_tick: game
                .playback
                .as_ref()
                .map_or(game.world.tick as usize, |p| p.cursor),
            source_team: game.world.cars[car].team,
        })
    }
    pub fn start(&self, scenario: &Scenario, brain: &BrainSpec) -> Game {
        let mut game = self.state.clone();
        game.player = None;
        game.drivers.clear();
        game.recording = None;
        game.config.player_team = -1;
        game.config.duration = 0.0;
        game.score = [0, 0];
        game.clock = scenario.time;
        game.overtime = false;
        game.waiting_for_ground = false;
        game.skip_replays = true;
        game.notifications.clear();
        game.outcome = None;
        game.drivers.push(Driver::new(brain, 0, vec![self.car]));
        if let Some(other) = &self.others {
            for team in 0..2 {
                let cars: Vec<_> = game
                    .world
                    .cars
                    .iter()
                    .filter(|c| c.id != self.car && c.team == team)
                    .map(|c| c.id)
                    .collect();
                if !cars.is_empty() {
                    game.drivers.push(Driver::new(other, team, cars));
                }
            }
        }
        game.playback = Some(Playback {
            frames: covered(&self.frames, scenario.time),
            cursor: 0,
            selected: Some(self.car),
            input_car: self.input_car,
            scenario: true,
            recorded: self.others.is_none(),
            legacy_saves: self.engine == LEGACY_SAVE_ENGINE,
        });
        game.judge = Some(Judge::new(scenario, &game));
        game
    }
}

/// The clip's frames, repeating the last one until the judge must decide.
/// The judge adds ticks in floating point, so it can need one tick more than the clip holds.
/// A game whose playback runs out stops advancing, and the set piece would never end.
fn covered(frames: &Arc<Vec<Frame>>, time: f64) -> Arc<Vec<Frame>> {
    let mut ticks = frames.len();
    while (ticks as f64) * DT < time + GROUND_WAIT {
        ticks += 1;
    }
    if ticks == frames.len() {
        return frames.clone();
    }
    let mut padded = frames.as_ref().clone();
    let last = padded.last().expect("a clip has frames").clone();
    padded.resize(ticks, last);
    Arc::new(padded)
}

impl Game {
    pub fn begin_recording(&mut self) {
        let mut initial = self.clone();
        initial.recording = None;
        self.recording = Some(Recorder {
            initial: Box::new(initial),
            frames: Vec::new(),
            skip: false,
        });
    }
}

fn validate(engine: &str, format: u32, game: &Game, frames: &[Frame]) -> Result<(), String> {
    if format != FORMAT || !compatible_engine(engine, &engine_version()) {
        return Err("Recording uses another simulation version".into());
    }
    let n = game.world.cars.len();
    if n == 0
        || n > 8
        || frames.len() > MAX_TICKS
        || game.world.pads.len() != crate::world::PADS.len()
        || game.stats.len() != n
        || game.names.len() != n
        || game.mode != Mode::Match
        || !(1..=3).contains(&game.config.team_size)
        || n != 2 * game.config.team_size
        || !(-1..=1).contains(&game.config.player_team)
        || !game.config.duration.is_finite()
        || game.config.duration < 0.0
        || !(0.0..=1.0).contains(&game.config.dodge_deadzone)
        || game.last_touches.iter().any(|(id, _)| *id >= n)
        || game.last_goal_team > 1
        || game.goal_prediction.is_some_and(|team| team > 1)
        || game.world.events.len() > 128
        || game.notifications.len() > 128
        || game.player.is_some_and(|id| id >= n)
        || game.world.last_touch.is_some_and(|id| id >= n)
        || game.world.goal_scored.is_some_and(|team| team > 1)
        || game.predictor.slices.len() > 240
        || game.predictor.path.len() > 480
        || game.goal_path.len() > 240
        || game.last_touches.len() > 6
    {
        return Err("Invalid recording state".into());
    }
    for event in game.world.events.iter().chain(&game.notifications) {
        if [event.car, event.other, event.last_touch]
            .iter()
            .any(|id| *id < -1 || *id >= n as i32)
            || event.pad < -1
            || event.pad >= game.world.pads.len() as i32
        {
            return Err("Invalid recorded event".into());
        }
    }
    if snapshot::game(game)
        .iter()
        .any(|v| !v.is_finite() || v.abs() > 1e10)
    {
        return Err("Recording contains invalid numbers".into());
    }
    for (id, car) in game.world.cars.iter().enumerate() {
        if car.id != id
            || car.team > 1
            || car.mass != 180.0
            || car.bump_cooldowns.len() > 8
            || car.bump_cooldowns.iter().any(|(id, _)| *id >= n)
            || car.num_wheels_in_contact > 4
            || car.pos.length() > 30000.0
            || car.vel.length() > 10000.0
            || (car.rot.x * car.rot.x
                + car.rot.y * car.rot.y
                + car.rot.z * car.rot.z
                + car.rot.w * car.rot.w
                - 1.0)
                .abs()
                > 1e-5
            || car.mat.values.iter().any(|v| v.abs() > 1.00001)
        {
            return Err("Invalid recorded car".into());
        }
        let template = crate::car::Car::new(id, car.team);
        if car.wheels.iter().zip(template.wheels).any(|(a, b)| {
            a.front != b.front
                || a.local.x != b.local.x
                || a.local.y != b.local.y
                || a.local.z != b.local.z
                || a.radius != b.radius
                || a.rest_length != b.rest_length
                || a.force_scale != b.force_scale
        }) {
            return Err("Invalid recorded wheel geometry".into());
        }
    }
    for b in [&game.world.ball, &game.predict_ball, &game.predictor.sim]
        .into_iter()
        .chain(game.predictor.path.iter())
        .chain(game.goal_path.iter())
    {
        if b.mass != 30.0
            || b.radius != crate::ball::PHYSICAL_RADIUS
            || b.trace().iter().any(|v| !v.is_finite() || v.abs() > 1e6)
            || b.vel.length() > 10000.0
        {
            return Err("Invalid recorded ball".into());
        }
    }
    for (p, &(x, y, big)) in game.world.pads.iter().zip(crate::world::PADS.iter()) {
        if p.big != big
            || p.pos.z != if big { 73.0 } else { 70.0 }
            || !((p.pos.x == x && p.pos.y == y) || (p.pos.x == -x && p.pos.y == -y))
        {
            return Err("Invalid recorded pad geometry".into());
        }
    }
    for frame in frames {
        if frame.cars.len() != n || !frame.dodge.is_finite() || !(0.0..=1.0).contains(&frame.dodge)
        {
            return Err("Invalid control frame".into());
        }
        for c in &frame.cars {
            if c.iter().any(|v| !v.is_finite())
                || c[..5].iter().any(|v| v.abs() > 1.0)
                || c[5..8].iter().any(|v| *v != 0.0 && *v != 1.0)
                || c[8] < -1.0
                || c[8] > 4.0
            {
                return Err("Invalid recorded controls".into());
            }
        }
    }
    Ok(())
}

fn vector(v: &mut Vec3) {
    v.x = -v.x;
    v.y = -v.y;
}
fn ball(b: &mut crate::ball::Ball) {
    vector(&mut b.pos);
    vector(&mut b.vel);
    vector(&mut b.ang_vel);
}
fn quat(q: &mut Quat) {
    *q = Quat {
        x: -q.y,
        y: q.x,
        z: q.w,
        w: -q.z,
    };
}
/// Rotate all world-space state, including pads and wheel contacts. Keep car IDs and contact order.
fn turn(g: &mut Game) {
    ball(&mut g.world.ball);
    ball(&mut g.predict_ball);
    ball(&mut g.predictor.sim);
    for b in &mut g.predictor.path {
        ball(b);
    }
    for b in &mut g.goal_path {
        ball(b);
    }
    for s in &mut g.predictor.slices {
        vector(&mut s.pos);
        vector(&mut s.vel);
    }
    for p in &mut g.world.pads {
        vector(&mut p.pos);
    }
    for c in &mut g.world.cars {
        c.team = 1 - c.team;
        for v in [
            &mut c.pos,
            &mut c.vel,
            &mut c.ang_vel,
            &mut c.forward,
            &mut c.left,
            &mut c.up,
            &mut c.world_normal,
            &mut c.vel_impulse_cache,
        ] {
            vector(v);
        }
        quat(&mut c.rot);
        for v in &mut c.mat.values[..6] {
            *v = -*v;
        }
        for w in &mut c.wheels {
            vector(&mut w.contact_point);
            vector(&mut w.contact_normal);
        }
    }
    for e in g.world.events.iter_mut().chain(g.notifications.iter_mut()) {
        vector(&mut e.position);
        if e.team >= 0 {
            e.team = 1 - e.team;
        }
    }
    g.score.swap(0, 1);
    g.last_goal_team = 1 - g.last_goal_team;
    g.world.goal_scored = g.world.goal_scored.map(|t| 1 - t);
    g.goal_prediction = g.goal_prediction.map(|t| 1 - t);
    g.config.brains.swap(0, 1);
    if g.config.player_team >= 0 {
        g.config.player_team = 1 - g.config.player_team;
    }
    quat(&mut g.ball_rot);
}
