use crate::{
    DT,
    ball::Ball,
    bot::{Bot, Predictor, Skill, assign_roles},
    car::Controls,
    random::Random,
    rotation::Quat,
    vector::Vec3,
    world::{BALL_HIT, Event, GOAL, KICKOFF, World},
};
pub const COUNTDOWN: u32 = 11;
pub const OVERTIME: u32 = 12;
pub const ENDED: u32 = 13;
pub const SAVE: u32 = 14;
#[derive(Clone, Copy, Debug, PartialEq)]
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
#[derive(Clone, Copy, Debug, PartialEq)]
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
#[derive(Clone, Copy, Debug)]
pub struct Config {
    pub team_size: usize,
    pub skill: Skill,
    pub player_team: i32,
    pub duration: f64,
    pub dodge_deadzone: f64,
}
impl Default for Config {
    fn default() -> Self {
        Self {
            team_size: 1,
            skill: Skill::Pro,
            player_team: 0,
            duration: 300.0,
            dodge_deadzone: 0.5,
        }
    }
}
#[derive(Clone, Copy, Debug, Default)]
pub struct Stats {
    pub score: u32,
    pub goals: u32,
    pub assists: u32,
    pub shots: u32,
    pub saves: u32,
}
#[derive(Clone, Debug)]
pub struct Game {
    pub world: World,
    pub bots: Vec<Bot>,
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
}
impl Game {
    pub fn new(seed: u32) -> Self {
        Self {
            world: World::default(),
            bots: Vec::new(),
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
        }
    }
    fn reset_world(&mut self) {
        self.world = World::default();
        self.bots.clear();
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
        // TODO(post-port): Reset predictor state here. JavaScript retains its old tick and slices.
        // Preserve this restart error during parity. Correct both paths in a separate change.
    }
    pub fn start_match(&mut self, config: Config) {
        self.reset_world();
        self.mode = Mode::Match;
        self.config = config;
        let names = self.random.names();
        let mut name = 0;
        for team in 0..2 {
            for index in 0..config.team_size {
                let player = team as i32 == config.player_team && index == 0;
                let id = self.world.add_car(team);
                self.stats.push(Stats::default());
                if player {
                    self.player = Some(id);
                    self.world.cars[id].dodge_deadzone = config.dodge_deadzone;
                    self.names.push(-1);
                } else {
                    self.bots.push(Bot::new(id, config.skill));
                    self.names.push(names[name] as i32);
                    name += 1;
                }
            }
        }
        self.clock = config.duration;
        self.start_kickoff();
    }
    pub fn start_menu(&mut self) {
        self.reset_world();
        self.mode = Mode::Menu;
        for team in 0..2 {
            let id = self.world.add_car(team);
            self.bots.push(Bot::new(id, Skill::Allstar));
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
        for b in &mut self.bots {
            b.reset();
        }
        self.phase = Phase::Countdown;
        self.phase_timer = 3.0;
        self.countdown_shown = 4;
        self.last_touches.clear();
        self.has_snapshot = true;
    }
    pub fn tick(&mut self, controls: Controls) {
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
        assign_roles(&self.world, &mut self.bots, self.player);
        for b in &mut self.bots {
            let out = b.tick(&self.world, &self.predictor);
            self.world.cars[b.car].controls = out;
        }
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
            self.world.step();
            self.has_snapshot = true;
            return;
        }
        if self.unlimited_boost
            && let Some(player) = self.player
        {
            self.world.cars[player].boost = 100.0;
        }
        self.world.step();
        if !self.world.ball.frozen {
            self.ball_rot.integrate(self.world.ball.ang_vel, DT);
        }
        if self.mode != Mode::Menu {
            let events = self.world.events.clone();
            for event in events {
                self.notifications.push(event);
                match event.kind {
                    BALL_HIT => {
                        self.last_touches
                            .push((event.car as usize, self.world.tick));
                        if self.last_touches.len() > 6 {
                            self.last_touches.remove(0);
                        }
                        if self.mode == Mode::Match {
                            self.evaluate_shot_save(event.car as usize);
                        }
                    }
                    GOAL => self.on_goal(event),
                    _ => {}
                }
            }
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
        if self.mode == Mode::Menu
            && let Some(team) = self.world.goal_scored
        {
            let mut e = Event::new(GOAL);
            e.team = team as i32;
            e.position = self.world.ball.pos;
            self.notifications.push(e);
            self.world.setup_kickoff(self.random.next_f64());
            for b in &mut self.bots {
                b.reset();
            }
        }
        self.has_snapshot = true;
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
        self.predict_ball.copy_from(&self.world.ball);
        for _ in 0..240 {
            self.predict_ball.integrate_forces(DT);
            self.predict_ball.integrate_position(DT);
            self.predict_ball.collide_world();
            if self.predict_ball.pos.y > 5124.25 + self.predict_ball.radius {
                return Some(0);
            }
            if self.predict_ball.pos.y < -(5124.25 + self.predict_ball.radius) {
                return Some(1);
            }
        }
        None
    }
    fn evaluate_shot_save(&mut self, car: usize) {
        let previous = self.goal_prediction;
        let next = self.predict_goal();
        self.goal_prediction = next;
        let team = self.world.cars[car].team;
        if next == Some(team) && previous != Some(team) {
            self.stats[car].shots += 1;
            self.stats[car].score += 20;
        }
        if previous.is_some() && previous != Some(team) && next != previous {
            self.stats[car].saves += 1;
            self.stats[car].score += 50;
            let mut event = Event::new(SAVE);
            event.car = car as i32;
            self.notifications.push(event);
        }
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
