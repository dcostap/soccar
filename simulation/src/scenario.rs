//! Set pieces: short scenarios that start from a placed ball and cars, then judge one outcome.
//!
//! The brain under test drives blue (team zero), which attacks toward positive y.
//! Orange cars are rivals driven by `rival`, usually a fixed `scripted` preset.
//! A scenario runs for `time` seconds. A goal ends it at once. Otherwise, as at the end of a match,
//! play continues until the ball touches the ground, for at most `GROUND_WAIT` more seconds.
//! Unlike a match, play also continues while the ball is predicted to enter a goal, so a shot taken
//! before the buzzer counts.
//!
//! Text form, one `key = value` per line. `#` starts a comment. Positions are in unreal units,
//! with blue's goal at negative y. Yaw is in degrees: 0 faces positive x, 90 faces orange's goal.
//!
//! ```text
//! kind = attack                    # attack or defend
//! time = 3                         # seconds, default 3
//! seed = 1                         # optional, default 1
//! ball = 0 3000 93.15              # position
//! ball_vel = 0 0 0                 # optional
//! ball_spin = 0 0 0                # optional
//! car = blue 0 1000 90 0 33        # team, x, y, yaw, forward speed, boost; one line per car
//! car = orange 0 5000 270 0 33
//! rival = scripted mode=goalie     # orange brain: module, then key=value settings
//! note = free text                 # optional
//! ```
use crate::{
    DT,
    arena::{GOAL_HEIGHT, HALF_LENGTH},
    brains::BrainSpec,
    game::Game,
    vector::Vec3,
    world::BALL_HIT,
};

/// Longest wait for the ball to land after the scenario time.
pub const GROUND_WAIT: f64 = 3.0;
const BALL_RADIUS: f64 = 93.15;
/// Half the width of the goal mouth.
const GOAL_HALF_WIDTH: f64 = 893.0;

#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum Kind {
    /// Blue succeeds by scoring.
    Attack,
    /// Blue succeeds by not conceding.
    Defend,
}
impl Kind {
    pub fn parse(text: &str) -> Result<Self, String> {
        match text {
            "attack" => Ok(Self::Attack),
            "defend" => Ok(Self::Defend),
            _ => Err(format!("Unknown scenario kind: {text}")),
        }
    }
    pub fn name(self) -> &'static str {
        match self {
            Self::Attack => "attack",
            Self::Defend => "defend",
        }
    }
}

/// A car on the ground at the start.
#[derive(Clone, Copy, Debug, PartialEq)]
pub struct CarStart {
    pub team: usize,
    pub x: f64,
    pub y: f64,
    /// Heading in degrees: 0 faces positive x, 90 faces orange's goal.
    pub yaw: f64,
    /// Forward speed.
    pub speed: f64,
    pub boost: f64,
}

#[derive(Clone, Debug)]
pub struct Scenario {
    pub kind: Kind,
    /// Seconds of play before the judge waits for the ball to land.
    pub time: f64,
    /// Seed of the game's random generator, which orders car-ball contacts.
    pub seed: u32,
    pub ball_pos: Vec3,
    pub ball_vel: Vec3,
    pub ball_spin: Vec3,
    pub cars: Vec<CarStart>,
    /// Brain of the orange cars.
    pub rival: BrainSpec,
    pub note: String,
}

/// Whether a car start at (x, y) clears the walls, corners, and goals with room to spare.
/// Measured above the floor, so the floor itself does not count.
pub fn fits(x: f64, y: f64) -> bool {
    crate::arena::distance(Vec3::new(x, y, 120.0)) > 110.0
}

fn numbers<const N: usize>(text: &str) -> Result<[f64; N], String> {
    let values: Vec<f64> = text
        .split_whitespace()
        .map(|w| {
            w.parse::<f64>()
                .ok()
                .filter(|x| x.is_finite())
                .ok_or_else(|| format!("expected a number, got {w}"))
        })
        .collect::<Result<_, _>>()?;
    values
        .try_into()
        .map_err(|v: Vec<f64>| format!("expected {N} numbers, got {}", v.len()))
}
fn vector(text: &str) -> Result<Vec3, String> {
    let [x, y, z] = numbers::<3>(text)?;
    Ok(Vec3::new(x, y, z))
}
fn team(text: &str) -> Result<usize, String> {
    match text {
        "blue" => Ok(0),
        "orange" => Ok(1),
        _ => Err(format!("expected blue or orange, got {text}")),
    }
}

impl Scenario {
    /// Parses the text form described in the module documentation.
    pub fn parse(text: &str) -> Result<Self, String> {
        let mut kind = None;
        let mut scenario = Self {
            kind: Kind::Attack,
            time: 3.0,
            seed: 1,
            ball_pos: Vec3::new(0.0, 0.0, 93.15),
            ball_vel: Vec3::default(),
            ball_spin: Vec3::default(),
            cars: Vec::new(),
            rival: BrainSpec::parse("idle", "module = scripted\nmode = idle")?,
            note: String::new(),
        };
        for (number, line) in text.lines().enumerate() {
            let line = line.split('#').next().unwrap_or("").trim();
            if line.is_empty() {
                continue;
            }
            let fail = |e: String| format!("line {}: {e}", number + 1);
            let (key, value) = line
                .split_once('=')
                .ok_or_else(|| fail("expected key = value".into()))?;
            let value = value.trim();
            match key.trim() {
                "kind" => kind = Some(Kind::parse(value).map_err(fail)?),
                "time" => {
                    let [t] = numbers::<1>(value).map_err(fail)?;
                    if !(t > 0.0 && t <= 60.0) {
                        return Err(fail(format!("time must be in (0, 60], got {t}")));
                    }
                    scenario.time = t;
                }
                "seed" => {
                    scenario.seed = value
                        .parse()
                        .map_err(|_| fail(format!("expected a whole number, got {value}")))?;
                }
                "ball" => scenario.ball_pos = vector(value).map_err(fail)?,
                "ball_vel" => scenario.ball_vel = vector(value).map_err(fail)?,
                "ball_spin" => scenario.ball_spin = vector(value).map_err(fail)?,
                "car" => {
                    let (side, rest) = value.split_once(' ').unwrap_or((value, ""));
                    let [x, y, yaw, speed, boost] = numbers::<5>(rest).map_err(fail)?;
                    scenario.cars.push(CarStart {
                        team: team(side).map_err(fail)?,
                        x,
                        y,
                        yaw,
                        speed,
                        boost: boost.clamp(0.0, 100.0),
                    });
                }
                "rival" => {
                    let mut words = value.split_whitespace();
                    let module = words.next().ok_or_else(|| fail("missing module".into()))?;
                    let mut spec = format!("module = {module}\n");
                    for word in words {
                        let (k, v) = word
                            .split_once('=')
                            .ok_or_else(|| fail(format!("expected key=value, got {word}")))?;
                        spec += &format!("{k} = {v}\n");
                    }
                    scenario.rival = BrainSpec::parse(value, &spec).map_err(fail)?;
                }
                "note" => scenario.note = value.to_string(),
                other => return Err(fail(format!("unknown key {other}"))),
            }
        }
        scenario.kind = kind.ok_or("Missing kind = attack or defend")?;
        if !scenario.cars.iter().any(|c| c.team == 0) {
            return Err("A scenario needs at least one blue car".into());
        }
        if scenario.cars.len() > 8 {
            return Err("At most eight cars".into());
        }
        if let Some(c) = scenario.cars.iter().find(|c| !fits(c.x, c.y)) {
            return Err(format!(
                "A car at ({}, {}) is outside the field or too close to a wall",
                c.x, c.y
            ));
        }
        let b = scenario.ball_pos;
        if crate::arena::distance(b) < BALL_RADIUS - 1.0 || b.z > 1900.0 {
            return Err(format!(
                "The ball at ({}, {}, {}) is outside the field",
                b.x, b.y, b.z
            ));
        }
        Ok(scenario)
    }
    /// Canonical text form, accepted by `parse`. Numbers print in Rust's shortest exact form.
    pub fn text(&self) -> String {
        let v = |v: Vec3| format!("{} {} {}", v.x, v.y, v.z);
        let mut out = format!(
            "kind = {}\ntime = {}\nseed = {}\nball = {}\nball_vel = {}\nball_spin = {}\n",
            self.kind.name(),
            self.time,
            self.seed,
            v(self.ball_pos),
            v(self.ball_vel),
            v(self.ball_spin)
        );
        for c in &self.cars {
            out += &format!(
                "car = {} {} {} {} {} {}\n",
                ["blue", "orange"][c.team],
                c.x,
                c.y,
                c.yaw,
                c.speed,
                c.boost
            );
        }
        out += &format!("rival = {}", self.rival.module);
        for (k, val) in &self.rival.settings {
            out += &format!(" {k}={val}");
        }
        out += "\n";
        if !self.note.is_empty() {
            out += &format!("note = {}\n", self.note);
        }
        out
    }
}

/// Rounds to `digits` decimals, keeping captured text short. Dividing by a power of ten prints
/// the shortest decimal; `+ 0.0` turns negative zero into zero.
fn step(x: f64, digits: i32) -> f64 {
    let scale = 10f64.powi(digits);
    (x * scale).round() / scale + 0.0
}

impl Scenario {
    /// The current moment of a game as a set piece in which `team` becomes blue, the side under test.
    /// Orange's view is turned half a circle, so blue always attacks positive y.
    /// Cars keep their ground position, heading, forward speed, and boost; cars in the air or on a wall
    /// are placed on the floor below them, and demolished cars are left out. Orange cars chase the ball.
    pub fn capture(game: &Game, team: usize, kind: Kind, time: f64) -> Self {
        let turn = if team == 1 { -1.0 } else { 1.0 };
        let world = &game.world;
        let ball = &world.ball;
        let mut cars = world
            .cars
            .iter()
            .filter(|c| !c.is_demoed)
            .map(|c| {
                let yaw = crate::math::atan2(c.forward.y * turn, c.forward.x * turn).to_degrees();
                // Cars on walls and in corners move toward the center until they fit on the floor.
                let (mut x, mut y) = (c.pos.x * turn, c.pos.y * turn);
                for _ in 0..200 {
                    if fits(step(x, 0), step(y, 0)) {
                        break;
                    }
                    x *= 0.98;
                    y *= 0.98;
                }
                CarStart {
                    team: usize::from(c.team != team),
                    x: step(x, 0),
                    y: step(y, 0),
                    yaw: step(yaw.rem_euclid(360.0), 1) % 360.0,
                    speed: step(c.vel.dot(c.forward), 0),
                    boost: step(c.boost, 0),
                }
            })
            .collect::<Vec<_>>();
        // Blue cars first, as in a match.
        cars.sort_by_key(|c| c.team);
        let flip = |v: Vec3, digits: i32| {
            Vec3::new(
                step(v.x * turn, digits),
                step(v.y * turn, digits),
                step(v.z, digits),
            )
        };
        let rival = if cars.iter().any(|c| c.team == 1) {
            "module = scripted\nmode = chase"
        } else {
            "module = scripted\nmode = idle"
        };
        Self {
            kind,
            time,
            seed: 1,
            ball_pos: flip(ball.pos, 0),
            ball_vel: flip(ball.vel, 0),
            ball_spin: flip(ball.ang_vel, 2),
            cars,
            rival: BrainSpec::parse("rival", rival).expect("scripted rival"),
            note: String::new(),
        }
    }
}

impl Scenario {
    /// The same moment with the teams swapped: the field turns half a circle and orange becomes blue.
    /// The rival keeps its brain and the kind is unchanged.
    pub fn mirrored(&self) -> Self {
        let turn = |v: Vec3| Vec3::new(-v.x + 0.0, -v.y + 0.0, v.z);
        let mut cars: Vec<CarStart> = self
            .cars
            .iter()
            .map(|c| CarStart {
                team: 1 - c.team,
                x: -c.x + 0.0,
                y: -c.y + 0.0,
                yaw: step((c.yaw + 180.0).rem_euclid(360.0), 1) % 360.0,
                ..*c
            })
            .collect();
        cars.sort_by_key(|c| c.team);
        Self {
            ball_pos: turn(self.ball_pos),
            ball_vel: turn(self.ball_vel),
            ball_spin: turn(self.ball_spin),
            cars,
            ..self.clone()
        }
    }
}

/// How a scenario ended.
#[derive(Clone, Copy, Debug, PartialEq)]
pub struct Outcome {
    /// The team that scored, if any.
    pub goal: Option<usize>,
    /// Blue scored in an attack, or did not concede in a defense.
    pub success: bool,
    /// 1 on success. A missed attack earns up to 0.5 for how close the ball came to the goal mouth.
    /// An own goal or a failed defense earns nothing.
    pub credit: f64,
    /// Seconds of play.
    pub seconds: f64,
    /// Ball touches by blue cars.
    pub touches: u32,
    /// Closest distance of the ball to orange's goal mouth, in units.
    pub closest: f64,
}

/// Distance from a ball position to the opening of orange's goal.
fn goal_distance(pos: Vec3) -> f64 {
    let target = Vec3::new(
        pos.x.clamp(-GOAL_HALF_WIDTH, GOAL_HALF_WIDTH),
        HALF_LENGTH,
        pos.z.clamp(0.0, GOAL_HEIGHT),
    );
    pos.distance(target)
}

/// Watches a running scenario and decides its outcome. Call `update` after every game tick.
#[derive(Clone, Debug)]
pub struct Judge {
    kind: Kind,
    time: f64,
    ticks: u32,
    start: f64,
    closest: f64,
    touches: u32,
    score: [u32; 2],
}
impl Judge {
    pub fn new(scenario: &Scenario, game: &Game) -> Self {
        let start = goal_distance(game.world.ball.pos);
        Self {
            kind: scenario.kind,
            time: scenario.time,
            ticks: 0,
            start,
            closest: start,
            touches: 0,
            score: game.score,
        }
    }
    /// Seconds left before the judge waits for the ball to land.
    pub fn remaining(&self) -> f64 {
        (self.time - self.ticks as f64 * DT).max(0.0)
    }
    pub fn update(&mut self, game: &Game) -> Option<Outcome> {
        self.ticks += 1;
        let seconds = self.ticks as f64 * DT;
        for e in &game.notifications {
            if e.kind == BALL_HIT && game.world.cars[e.car as usize].team == 0 {
                self.touches += 1;
            }
        }
        let ball = &game.world.ball;
        self.closest = self.closest.min(goal_distance(ball.pos));
        let goal = (0..2).find(|&t| game.score[t] > self.score[t]);
        let landed = ball.pos.z < ball.radius + 8.0 && ball.vel.z <= 5.0;
        // Unlike a match, a ball already heading into a goal at the buzzer may finish its path.
        let settled = landed && game.goal_prediction.is_none();
        let over = (seconds >= self.time && settled) || seconds >= self.time + GROUND_WAIT;
        if goal.is_none() && !over {
            return None;
        }
        let success = match self.kind {
            Kind::Attack => goal == Some(0),
            Kind::Defend => goal != Some(1),
        };
        let credit = if success {
            1.0
        } else if self.kind == Kind::Attack && goal.is_none() && self.start > 0.0 {
            0.5 * (1.0 - self.closest / self.start).clamp(0.0, 1.0)
        } else {
            0.0
        };
        Some(Outcome {
            goal,
            success,
            credit,
            seconds,
            touches: self.touches,
            closest: self.closest,
        })
    }
}
