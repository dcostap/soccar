use crate::{
    DT,
    ball::Ball,
    brains::{Brain, BrainSpec, Context, Skill},
    car::Controls,
    predictor::Predictor,
    random::Random,
    rotation::Quat,
    scenario::{Judge, Outcome, Scenario},
    vector::Vec3,
    world::{BALL_HIT, Event, GOAL, KICKOFF, World},
};
use std::collections::VecDeque;
pub const COUNTDOWN: u32 = 11;
pub const OVERTIME: u32 = 12;
pub const ENDED: u32 = 13;
pub const SAVE: u32 = 14;
const GOAL_STEPS: usize = 240;
const SAVE_STEPS: usize = 180;

/// Follow the ball without cars, with the same collisions and speed limits as live play.
fn ball_goal(mut ball: Ball, steps: usize) -> Option<usize> {
    ball.clamp_velocities();
    let boundary = crate::arena::GOAL_LINE + ball.radius;
    for tick in 0..=steps {
        if ball.pos.y > boundary {
            return Some(0);
        }
        if ball.pos.y < -boundary {
            return Some(1);
        }
        if tick < steps {
            ball.step();
        }
    }
    None
}

#[cfg(test)]
mod save_tests {
    use super::*;

    fn shot(x: f64, y: f64, z: f64, vy: f64) -> Ball {
        Ball {
            pos: Vec3::new(x, y, z),
            vel: Vec3::new(0.0, vy, 0.0),
            ..Ball::default()
        }
    }

    fn clear(mut ball: Ball) -> Ball {
        ball.vel.y = -ball.vel.y;
        ball
    }

    #[test]
    fn ground_and_aerial_blocks_count_for_both_teams() {
        for team in 0..2 {
            let direction = if team == 0 { -1.0 } else { 1.0 };
            for z in [93.15, 450.0] {
                let before = shot(0.0, direction * 4300.0, z, direction * 2000.0);
                assert!(is_save(team, before, clear(before)));
            }
        }
    }

    #[test]
    fn shots_wide_or_above_the_goal_are_not_saves() {
        for (x, z) in [(1300.0, 93.15), (0.0, 1000.0)] {
            let before = shot(x, -4800.0, z, -2000.0);
            assert!(!is_save(0, before, clear(before)));
        }
    }

    #[test]
    fn remote_and_slow_threats_are_not_saves() {
        for before in [
            shot(0.0, 500.0, 93.15, -6000.0),
            shot(0.0, -1000.0, 93.15, -2000.0),
            shot(0.0, -4300.0, 93.15, -300.0),
        ] {
            assert!(!is_save(0, before, clear(before)));
        }
    }

    #[test]
    fn a_touch_that_only_slows_a_goal_is_not_a_save() {
        let before = shot(0.0, -4300.0, 93.15, -2000.0);
        let mut after = before;
        after.vel.y = -1000.0;
        assert!(!is_save(0, before, after));
        assert!(!is_save(0, before, before));
    }

    #[test]
    fn a_touch_toward_the_opponents_goal_is_not_a_save() {
        let before = shot(0.0, 4300.0, 93.15, 2000.0);
        assert!(!is_save(0, before, clear(before)));
    }

    #[test]
    fn outgoing_and_already_scored_balls_are_not_saves() {
        for before in [
            shot(0.0, -4300.0, 93.15, 2000.0),
            shot(0.0, -5300.0, 93.15, -2000.0),
        ] {
            assert!(!is_save(0, before, clear(before)));
        }
    }

    #[test]
    fn a_goal_line_block_counts_if_the_contact_returns_the_ball_to_play() {
        // Cars resolve before the goal check. A contact can still stop this tick's crossing.
        let before = shot(0.0, -(crate::arena::GOAL_LINE + 92.25), 93.15, -2000.0);
        let mut after = clear(before);
        after.pos.y = -5100.0;
        assert!(is_save(0, before, after));
    }

    fn contact_game(incoming: bool) -> Game {
        let mut game = Game::new(1);
        game.start_match(Config::default());
        game.drivers.clear();
        game.phase = Phase::Playing;
        game.world.cars[0].spawn(0.0, -4500.0, std::f64::consts::FRAC_PI_2, 0.0);
        game.world.cars[1].spawn(3000.0, 3000.0, 0.0, 0.0);
        game.world.ball = shot(0.0, -4370.0, 93.15, if incoming { -2000.0 } else { 500.0 });
        if !incoming {
            game.world.cars[0].vel.y = 2000.0;
        }
        game
    }

    #[test]
    fn a_real_block_counts_without_a_cached_goal_prediction() {
        let mut game = contact_game(true);
        assert_eq!(game.goal_prediction, None);
        game.tick(Controls::default());
        assert!(
            game.notifications
                .iter()
                .any(|e| e.kind == BALL_HIT && e.car == 0)
        );
        assert_eq!(game.stats[0].saves, 1);
        assert_eq!(game.stats[0].score, 50);
        assert_eq!(
            game.notifications
                .iter()
                .filter(|e| e.kind == SAVE && e.car == 0)
                .count(),
            1
        );
    }

    #[test]
    fn a_stale_goal_prediction_cannot_turn_a_clear_into_a_save() {
        let mut game = contact_game(false);
        game.goal_prediction = Some(1);
        game.tick(Controls::default());
        assert!(
            game.notifications
                .iter()
                .any(|e| e.kind == BALL_HIT && e.car == 0)
        );
        assert_eq!(game.stats[0].saves, 0);
        assert!(!game.notifications.iter().any(|e| e.kind == SAVE));
    }

    #[test]
    fn simultaneous_hits_use_each_contacts_ball_state() {
        for reverse in [false, true] {
            let mut game = contact_game(true);
            game.world.cars[1].team = 0;
            game.world.cars[1].spawn(0.0, -4500.0, std::f64::consts::FRAC_PI_2, 0.0);
            let mut hits = Vec::new();
            game.world
                .step_with_ball_hits(reverse, |car, before, after| {
                    hits.push((car.id, before, after));
                });
            assert_eq!(hits.len(), 2);
            assert_eq!(hits[0].0, if reverse { 1 } else { 0 });
            assert!(hits[0].2.same_motion(&hits[1].1));
            assert!(is_save(0, hits[0].1, hits[0].2));
            assert!(!is_save(0, hits[1].1, hits[1].2));
        }
    }
}

fn is_save(team: usize, before: Ball, after: Ball) -> bool {
    let direction = if team == 0 { -1.0 } else { 1.0 };
    let depth = before.pos.y * direction;
    // A save stops an incoming goal in our half, not a remote threat or a rebound moving away.
    !before.frozen
        && depth > 0.0
        && before.vel.y * direction > 0.0
        && ball_goal(before, SAVE_STEPS) == Some(1 - team)
        && ball_goal(after, GOAL_STEPS) != Some(1 - team)
}
#[derive(Clone, Copy, Debug, PartialEq, serde::Serialize, serde::Deserialize)]
pub enum Phase {
    Countdown,
    Playing,
    Goal,
    Replay,
    Ended,
}
impl Phase {
    pub fn number(self) -> u32 {
        match self {
            Self::Countdown => 0,
            Self::Playing => 1,
            Self::Goal => 2,
            Self::Replay => 3,
            Self::Ended => 4,
        }
    }
}
#[derive(Clone, Copy, Debug, PartialEq, serde::Serialize, serde::Deserialize)]
pub enum Mode {
    Menu,
    Freeplay,
    Match,
}
impl Mode {
    pub fn number(self) -> u32 {
        match self {
            Self::Menu => 0,
            Self::Freeplay => 1,
            Self::Match => 2,
        }
    }
}
#[derive(Clone, Debug, serde::Serialize, serde::Deserialize)]
pub struct Config {
    pub team_size: usize,
    /// Bot brains for blue (team zero) and orange (team one).
    pub brains: [BrainSpec; 2],
    pub player_team: i32,
    pub duration: f64,
    pub dodge_deadzone: f64,
}
impl Default for Config {
    fn default() -> Self {
        Self {
            team_size: 1,
            brains: [BrainSpec::preset(Skill::Pro), BrainSpec::preset(Skill::Pro)],
            player_team: 0,
            duration: 300.0,
            dodge_deadzone: 0.5,
        }
    }
}
#[derive(Clone, Copy, Debug, Default, serde::Serialize, serde::Deserialize)]
pub struct Stats {
    pub score: u32,
    pub goals: u32,
    pub assists: u32,
    pub shots: u32,
    pub saves: u32,
}
/// One brain and the bot cars it drives.
#[derive(Clone, Debug)]
pub struct Driver {
    pub team: usize,
    pub cars: Vec<usize>,
    pub brain: Box<dyn Brain>,
    out: Vec<Controls>,
}
impl Driver {
    pub(crate) fn new(spec: &BrainSpec, team: usize, cars: Vec<usize>) -> Self {
        let brain = spec
            .create(team, &cars)
            .unwrap_or_else(|e| panic!("Brain {}: {e}", spec.name));
        Self {
            team,
            out: vec![Controls::default(); cars.len()],
            cars,
            brain,
        }
    }
}
#[derive(Clone, Debug, serde::Serialize, serde::Deserialize)]
pub struct Game {
    pub world: World,
    /// Brains in team order. A team without bot cars has none.
    #[serde(skip)]
    pub drivers: Vec<Driver>,
    pub predictor: Predictor,
    pub player: Option<usize>,
    pub mode: Mode,
    pub phase: Phase,
    pub config: Config,
    pub score: [u32; 2],
    pub clock: f64,
    pub overtime: bool,
    pub phase_timer: f64,
    pub countdown_shown: i32,
    pub waiting_for_ground: bool,
    pub unlimited_boost: bool,
    pub random: Random,
    pub ball_rot: Quat,
    pub stats: Vec<Stats>,
    pub last_touches: Vec<(usize, i64)>,
    pub goal_prediction: Option<usize>,
    pub predict_ball: Ball,
    pub replay_length: usize,
    pub replay_idx: usize,
    pub replay_end: usize,
    pub replay_scorer: i32,
    pub end_after_replay: bool,
    pub last_goal_team: usize,
    pub freeplay_goal_timer: f64,
    pub names: Vec<i32>,
    pub notifications: Vec<Event>,
    pub skip_replays: bool,
    pub has_snapshot: bool,
    /// Measure time spent in each team's brain. Native only.
    #[serde(skip)]
    pub measure_brains: bool,
    /// Seconds spent in each team's brain while `measure_brains` is set.
    #[serde(skip)]
    pub brain_seconds: [f64; 2],
    /// Ball states of the last goal prediction, reused while the ball stays on that path.
    pub(crate) goal_path: VecDeque<Ball>,
    pub(crate) goal_path_tick: i64,
    /// Decides when a set piece ends. Set by `start_scenario`.
    #[serde(skip)]
    pub judge: Option<Judge>,
    /// Result of the last set piece, once it has ended.
    #[serde(skip)]
    pub outcome: Option<Outcome>,
    #[serde(skip)]
    pub recording: Option<crate::recording::Recorder>,
    #[serde(skip)]
    pub playback: Option<crate::recording::Playback>,
}
/// Cars on the larger team of a set piece.
fn teams_size(cars: &[crate::scenario::CarStart]) -> usize {
    (0..2)
        .map(|t| cars.iter().filter(|c| c.team == t).count())
        .max()
        .unwrap_or(0)
}
impl Game {
    pub fn new(seed: u32) -> Self {
        Self {
            world: World::default(),
            drivers: Vec::new(),
            predictor: Predictor::default(),
            player: None,
            mode: Mode::Menu,
            phase: Phase::Countdown,
            config: Config::default(),
            score: [0, 0],
            clock: 300.0,
            overtime: false,
            phase_timer: 0.0,
            countdown_shown: 4,
            waiting_for_ground: false,
            unlimited_boost: false,
            random: Random::new(seed),
            ball_rot: Quat::default(),
            stats: Vec::new(),
            last_touches: Vec::new(),
            goal_prediction: None,
            predict_ball: Ball::default(),
            replay_length: 0,
            replay_idx: 0,
            replay_end: 0,
            replay_scorer: -1,
            end_after_replay: false,
            last_goal_team: 0,
            freeplay_goal_timer: 0.0,
            names: Vec::new(),
            notifications: Vec::new(),
            skip_replays: false,
            has_snapshot: false,
            measure_brains: false,
            brain_seconds: [0.0; 2],
            goal_path: VecDeque::with_capacity(GOAL_STEPS),
            goal_path_tick: 0,
            judge: None,
            outcome: None,
            recording: None,
            playback: None,
        }
    }
    fn reset_world(&mut self) {
        self.recording = None;
        self.playback = None;
        self.world = World::default();
        self.drivers.clear();
        self.player = None;
        self.stats.clear();
        self.names.clear();
        self.score = [0, 0];
        self.overtime = false;
        self.replay_length = 0;
        self.has_snapshot = false;
        self.last_touches.clear();
        self.goal_prediction = None;
        self.waiting_for_ground = false;
        self.judge = None;
        self.outcome = None;
        // TODO(post-port): Reset predictor state here. JavaScript retains its old tick and slices.
        // Preserve this restart error during parity. Correct both paths in a separate change.
    }
    pub fn start_match(&mut self, config: Config) {
        self.reset_world();
        self.mode = Mode::Match;
        let names = self.random.names();
        let mut name = 0;
        for team in 0..2 {
            let mut cars = Vec::new();
            for index in 0..config.team_size {
                let player = team as i32 == config.player_team && index == 0;
                let id = self.world.add_car(team);
                self.stats.push(Stats::default());
                if player {
                    self.player = Some(id);
                    self.world.cars[id].dodge_deadzone = config.dodge_deadzone;
                    self.names.push(-1);
                } else {
                    cars.push(id);
                    self.names.push(names[name] as i32);
                    name += 1;
                }
            }
            if !cars.is_empty() {
                self.drivers
                    .push(Driver::new(&config.brains[team], team, cars));
            }
        }
        self.clock = config.duration;
        self.config = config;
        self.start_kickoff();
    }
    /// Starts a set piece: `brain` drives the blue cars and the scenario's rival drives the orange ones.
    /// There is no countdown or kickoff. The game ends itself when the judge decides the outcome.
    pub fn start_scenario(&mut self, scenario: &Scenario, brain: &BrainSpec) {
        if let Some(clip) = &scenario.clip {
            *self = clip.start(scenario, brain);
            return;
        }
        self.reset_world();
        self.mode = Mode::Match;
        self.random = Random::new(scenario.seed);
        let names = self.random.names();
        let mut teams = [Vec::new(), Vec::new()];
        for start in &scenario.cars {
            let id = self.world.add_car(start.team);
            let yaw = start.yaw.to_radians();
            let car = &mut self.world.cars[id];
            car.spawn(start.x, start.y, yaw, start.boost);
            car.vel = car.forward.scaled(start.speed);
            self.stats.push(Stats::default());
            self.names.push(names[id % names.len()] as i32);
            teams[start.team].push(id);
        }
        for (team, cars) in teams.into_iter().enumerate() {
            if !cars.is_empty() {
                let spec = if team == 0 { brain } else { &scenario.rival };
                self.drivers.push(Driver::new(spec, team, cars));
            }
        }
        let ball = &mut self.world.ball;
        let p = scenario.ball_pos;
        ball.reset(p.x, p.y, p.z);
        ball.vel = scenario.ball_vel;
        ball.ang_vel = scenario.ball_spin;
        // Brains treat an untouched ball as a kickoff.
        self.world.ball_touched = true;
        self.config = Config {
            team_size: teams_size(&scenario.cars),
            brains: [brain.clone(), scenario.rival.clone()],
            player_team: -1,
            duration: 0.0,
            dodge_deadzone: self.config.dodge_deadzone,
        };
        self.clock = scenario.time;
        self.phase = Phase::Playing;
        self.has_snapshot = true;
        self.judge = Some(Judge::new(scenario, self));
    }
    pub fn start_menu(&mut self) {
        self.reset_world();
        self.mode = Mode::Menu;
        for team in 0..2 {
            let id = self.world.add_car(team);
            self.drivers.push(Driver::new(
                &BrainSpec::preset(Skill::Allstar),
                team,
                vec![id],
            ));
            self.names.push(team as i32);
        }
        self.world.setup_kickoff(self.random.next_f64());
        self.phase = Phase::Playing;
    }
    pub fn start_freeplay(&mut self) {
        self.reset_world();
        self.mode = Mode::Freeplay;
        let id = self.world.add_car(0);
        self.player = Some(id);
        self.world.cars[id].dodge_deadzone = self.config.dodge_deadzone;
        self.names.push(-1);
        self.stats.push(Stats::default());
        self.reset_freeplay();
        self.phase = Phase::Playing;
    }
    pub fn reset_freeplay(&mut self) {
        if let Some(player) = self.player {
            let (x, y, yaw) = KICKOFF[4];
            self.world.cars[player].spawn(x, y, yaw, 100.0);
            self.world.ball.reset(0.0, 0.0, 93.15);
            self.world.reset_pads();
        }
    }
    pub fn place_ball(&mut self, top: bool) {
        let Some(player) = self.player else {
            return;
        };
        let c = &self.world.cars[player];
        let r = c.forward;
        let up = c.up;
        if !top {
            let length = crate::math::hypot2(r.x, r.y);
            let length = if length == 0.0 { 1.0 } else { length };
            let offset = 114.0 + 93.15;
            self.world.ball.reset(
                c.pos.x + (r.x / length) * offset,
                c.pos.y + (r.y / length) * offset,
                93.15,
            );
            self.world.ball.vel = Vec3::new(c.vel.x, c.vel.y, 0.0);
        } else {
            let height = 40.0 + 93.15;
            self.world.ball.reset(
                c.pos.x + r.x * 20.0 + up.x * height,
                c.pos.y + r.y * 20.0 + up.y * height,
                c.pos.z + r.z * 20.0 + up.z * height,
            );
            self.world.ball.vel = c.vel;
        }
        self.freeplay_goal_timer = 0.0;
    }
    pub fn start_kickoff(&mut self) {
        self.world.setup_kickoff(self.random.next_f64());
        for c in &mut self.world.cars {
            c.frozen = true;
        }
        self.world.ball.frozen = true;
        for d in &mut self.drivers {
            d.brain.reset();
        }
        self.phase = Phase::Countdown;
        self.phase_timer = 3.0;
        self.countdown_shown = 4;
        self.last_touches.clear();
        self.has_snapshot = true;
    }
    /// Commands share one implementation across native tools and the browser ABI.
    pub fn command(&mut self, command: u32, value: f64) {
        if command == 4
            && self.phase == Phase::Replay
            && let Some(r) = &mut self.recording
        {
            r.skip = true;
        }
        match command {
            1 if self.mode == Mode::Freeplay => self.reset_freeplay(),
            2 if self.mode == Mode::Freeplay => self.place_ball(false),
            3 if self.mode == Mode::Freeplay => self.place_ball(true),
            4 if self.phase == Phase::Replay => {
                self.notifications.clear();
                self.end_replay();
            }
            5 => self.unlimited_boost = value != 0.0,
            6 => {
                if let Some(p) = self.player {
                    self.world.cars[p].dodge_deadzone = value;
                }
            }
            _ => {}
        }
    }
    pub fn tick(&mut self, controls: Controls) {
        if self.phase == Phase::Ended {
            self.notifications.clear();
            return;
        }
        if let Some(p) = &self.playback {
            let Some(frame) = p.frames.get(p.cursor) else {
                self.notifications.clear();
                return;
            };
            self.unlimited_boost = frame.unlimited;
            if let Some(id) = p.input_car {
                self.world.cars[id].dodge_deadzone = frame.dodge;
            }
            if frame.skip && !p.scenario {
                self.command(4, 0.0);
            }
        }
        self.tick_inner(controls);
        if let Some(p) = &mut self.playback {
            p.cursor += 1;
        }
        if let Some(mut r) = self.recording.take() {
            r.push(self);
            self.recording = Some(r);
        }
    }
    fn tick_inner(&mut self, controls: Controls) {
        self.notifications.clear();
        if self.phase == Phase::Replay {
            self.replay_idx += 1;
            if self.replay_idx >= self.replay_end {
                self.end_replay();
            }
            return;
        }
        if self.phase == Phase::Ended {
            return;
        }
        if let Some(player) = self.player {
            self.world.cars[player].controls = controls;
        }
        self.predictor.update(&self.world);
        self.think();
        if self.phase == Phase::Countdown {
            self.phase_timer -= DT;
            let shown = self.phase_timer.ceil() as i32;
            if shown < self.countdown_shown && shown > 0 {
                self.countdown_shown = shown;
                self.countdown(shown);
            }
            if self.phase_timer <= 0.0 {
                self.phase = Phase::Playing;
                for c in &mut self.world.cars {
                    c.frozen = false;
                }
                self.world.ball.frozen = false;
                self.countdown(0);
            }
            let _ = self.step_world();
            self.has_snapshot = true;
            return;
        }
        if self.unlimited_boost
            && let Some(player) = self
                .player
                .or_else(|| self.playback.as_ref().and_then(|p| p.input_car))
        {
            self.world.cars[player].boost = 100.0;
        }
        let saves = self.step_world();
        if !self.world.ball.frozen {
            self.ball_rot.integrate(self.world.ball.ang_vel, DT);
        }
        if self.mode != Mode::Menu {
            let events = std::mem::take(&mut self.world.events);
            for &event in &events {
                self.notifications.push(event);
                match event.kind {
                    BALL_HIT => {
                        self.last_touches
                            .push((event.car as usize, self.world.tick));
                        if self.last_touches.len() > 6 {
                            self.last_touches.remove(0);
                        }
                        if self.mode == Mode::Match {
                            self.evaluate_shot(event.car as usize);
                            if saves.contains(&(event.car as usize)) {
                                self.award_save(event.car as usize);
                            }
                        }
                    }
                    GOAL => self.on_goal(event),
                    _ => {}
                }
            }
            self.world.events = events;
        }
        if self.has_snapshot {
            self.replay_length = (self.replay_length + 1).min(1080);
        }
        if self.phase == Phase::Playing && self.mode == Mode::Match {
            if self.world.ball_touched && !self.waiting_for_ground {
                if self.overtime {
                    self.clock += DT;
                } else if self.config.duration > 0.0 {
                    self.clock -= DT;
                    if self.clock <= 0.0 {
                        self.clock = 0.0;
                        self.waiting_for_ground = true;
                    }
                }
            }
            if self.waiting_for_ground
                && self.world.ball.pos.z < self.world.ball.radius + 8.0
                && self.world.ball.vel.z <= 5.0
            {
                self.waiting_for_ground = false;
                if self.score[0] == self.score[1] {
                    self.begin_overtime();
                } else {
                    self.end_match();
                }
            }
            if self.world.tick % 8 == 0 {
                self.goal_prediction = self.predict_goal();
            }
        }
        if self.phase == Phase::Goal {
            self.phase_timer -= DT;
            if self.phase_timer <= 0.0 && self.mode == Mode::Match {
                let finish = self.overtime
                    || (self.config.duration > 0.0
                        && self.clock <= 0.0
                        && self.score[0] != self.score[1]);
                self.begin_replay(finish);
            }
        }
        if self.mode == Mode::Freeplay && self.freeplay_goal_timer > 0.0 {
            self.freeplay_goal_timer -= DT;
            if self.freeplay_goal_timer <= 0.0 {
                self.world.ball.reset(0.0, 0.0, 93.15);
                self.world.ball.pos.z = 400.0;
                self.phase = Phase::Playing;
            }
        }
        if let Some(mut judge) = self.judge.take() {
            match judge.update(self) {
                Some(outcome) => {
                    self.outcome = Some(outcome);
                    self.end_match();
                }
                None => {
                    self.clock = judge.remaining();
                    self.judge = Some(judge);
                }
            }
        }
        if self.mode == Mode::Menu
            && let Some(team) = self.world.goal_scored
        {
            let mut e = Event::new(GOAL);
            e.team = team as i32;
            e.position = self.world.ball.pos;
            self.notifications.push(e);
            self.world.setup_kickoff(self.random.next_f64());
            for d in &mut self.drivers {
                d.brain.reset();
            }
        }
        self.has_snapshot = true;
    }
    /// Runs every brain on the same world state, then applies their controls.
    fn think(&mut self) {
        let ctx = Context {
            world: &self.world,
            predictor: &self.predictor,
            player: self.player,
        };
        for d in &mut self.drivers {
            #[cfg(not(target_arch = "wasm32"))]
            let start = self.measure_brains.then(std::time::Instant::now);
            d.brain.tick(&ctx, &mut d.out);
            #[cfg(not(target_arch = "wasm32"))]
            if let Some(start) = start {
                self.brain_seconds[d.team] += start.elapsed().as_secs_f64();
            }
        }
        for d in &self.drivers {
            for (&car, &out) in d.cars.iter().zip(&d.out) {
                self.world.cars[car].controls = out;
            }
        }
        if let Some(p) = &self.playback
            && let Some(frame) = p.frames.get(p.cursor)
        {
            for (id, input) in frame.cars.iter().enumerate() {
                if p.selected != Some(id) && (p.selected.is_none() || p.recorded) {
                    self.world.cars[id].controls = crate::recording::controls(*input);
                }
            }
        }
    }
    fn step_world(&mut self) -> Vec<usize> {
        let reverse = self.random.next_f64() < 0.5;
        let mut saves = Vec::new();
        let check_saves =
            self.mode == Mode::Match && self.phase == Phase::Playing && !self.uses_legacy_saves();
        self.world
            .step_with_ball_hits(reverse, |car, before, after| {
                if check_saves && is_save(car.team, before, after) {
                    saves.push(car.id);
                }
            });
        saves
    }
    fn countdown(&mut self, shown: i32) {
        let mut e = Event::new(COUNTDOWN);
        e.team = shown;
        self.notifications.push(e);
    }
    pub fn begin_overtime(&mut self) {
        self.overtime = true;
        self.clock = 0.0;
        self.notifications.push(Event::new(OVERTIME));
        self.start_kickoff();
    }
    pub fn end_match(&mut self) {
        self.phase = Phase::Ended;
        let mut e = Event::new(ENDED);
        e.team = if self.score[0] > self.score[1] { 0 } else { 1 };
        self.notifications.push(e);
    }
    fn blast_cars(&mut self, pos: Vec3) {
        for c in &mut self.world.cars {
            if c.is_demoed {
                continue;
            }
            let mut offset = c.pos.minus(pos);
            let distance = offset.length();
            if distance > 1500.0 {
                continue;
            }
            let fraction = 1.0 - distance / 1500.0;
            offset.z = offset.z.max(0.0) + distance * 0.4 + 60.0;
            offset = offset.normalized();
            c.vel.add_scaled(offset, 2400.0 * fraction.sqrt());
            c.ang_vel.add(Vec3::new(
                (self.random.next_f64() - 0.5) * 8.0 * fraction,
                (self.random.next_f64() - 0.5) * 8.0 * fraction,
                (self.random.next_f64() - 0.5) * 5.0 * fraction,
            ));
        }
    }
    fn on_goal(&mut self, event: Event) {
        self.blast_cars(event.position);
        self.world.ball.frozen = true;
        self.world.ball.vel = Vec3::default();
        if self.mode == Mode::Freeplay {
            self.freeplay_goal_timer = 2.0;
            self.phase = Phase::Goal;
            return;
        }
        if self.mode != Mode::Match {
            return;
        }
        let team = event.team as usize;
        self.score[team] += 1;
        self.last_goal_team = team;
        let mut scorer = None;
        let mut assist = None;
        for &(car, tick) in self.last_touches.iter().rev() {
            if self.world.cars[car].team == team {
                if scorer.is_none() {
                    scorer = Some(car);
                } else if scorer != Some(car) && self.world.tick - tick < 600 {
                    assist = Some(car);
                    break;
                }
            }
        }
        if scorer.is_none()
            && event.last_touch >= 0
            && self.world.cars[event.last_touch as usize].team == team
        {
            scorer = Some(event.last_touch as usize);
        }
        if let Some(car) = scorer {
            let s = &mut self.stats[car];
            s.goals += 1;
            s.score += 100;
            s.shots += 1;
            s.score += 20;
        }
        if let Some(car) = assist {
            self.stats[car].assists += 1;
            self.stats[car].score += 50;
        }
        self.replay_scorer = scorer.map_or(-1, |id| id as i32);
        self.phase = Phase::Goal;
        self.phase_timer = 3.0;
        self.replay_end = self.replay_length + 120;
    }
    pub fn predict_goal(&mut self) -> Option<usize> {
        fn crossed(ball: &Ball) -> Option<usize> {
            if ball.pos.y > crate::arena::GOAL_LINE + ball.radius {
                Some(0)
            } else if ball.pos.y < -(crate::arena::GOAL_LINE + ball.radius) {
                Some(1)
            } else {
                None
            }
        }
        // The prediction skips velocity clamps. Reuse requires the real ball to match a stored state exactly.
        let elapsed = self.world.tick - self.goal_path_tick;
        self.goal_path_tick = self.world.tick;
        if elapsed > 0
            && (elapsed as usize) < self.goal_path.len()
            && self.goal_path[elapsed as usize - 1].same_motion(&self.world.ball)
        {
            self.goal_path.drain(..elapsed as usize);
        } else {
            self.goal_path.clear();
            self.predict_ball.copy_from(&self.world.ball);
        }
        let mut result = self.goal_path.back().and_then(crossed);
        while result.is_none() && self.goal_path.len() < GOAL_STEPS {
            self.predict_ball.integrate_forces(DT);
            self.predict_ball.integrate_position(DT);
            self.predict_ball.collide_world();
            self.goal_path.push_back(self.predict_ball);
            result = crossed(&self.predict_ball);
        }
        result
    }
    fn evaluate_shot(&mut self, car: usize) {
        let previous = self.goal_prediction;
        let next = self.predict_goal();
        self.goal_prediction = next;
        let team = self.world.cars[car].team;
        if next == Some(team) && previous != Some(team) {
            self.stats[car].shots += 1;
            self.stats[car].score += 20;
        }
        if self.uses_legacy_saves()
            && previous.is_some()
            && previous != Some(team)
            && next != previous
        {
            self.award_save(car);
        }
    }
    pub(crate) fn uses_legacy_saves(&self) -> bool {
        self.playback.as_ref().is_some_and(|p| p.legacy_saves)
    }
    fn award_save(&mut self, car: usize) {
        self.stats[car].saves += 1;
        self.stats[car].score += 50;
        let mut event = Event::new(SAVE);
        event.car = car as i32;
        self.notifications.push(event);
    }
    pub fn begin_replay(&mut self, end: bool) {
        self.end_after_replay = end;
        if self.skip_replays {
            self.end_replay();
            return;
        }
        let length = self.replay_length as i64;
        let frame = (length - 1).min(self.replay_end as i64 - 120);
        self.replay_idx = (frame - 540).max(0) as usize;
        self.replay_end = (length - 1).min(frame + 110).max(0) as usize;
        self.phase = Phase::Replay;
    }
    pub fn end_replay(&mut self) {
        if self.end_after_replay {
            self.end_match();
        } else {
            self.start_kickoff();
        }
    }
}
