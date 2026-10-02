//! Measured defense tests. New versions get new suite names; accepted tests stay fixed.
//! Threats run through the shared physics without a defender, then with an idle defender.
//! No tested brain participates in candidate selection.
use crate::{
    generate::Rng,
    roster::Hash,
    setpieces::{SetPiece, idle_brain},
};
use serde::{Deserialize, Serialize};
use soccar_simulation::{
    DT, arena,
    car::Controls,
    game::Game,
    harness::{self, ScenarioJob},
    math::{atan2, cos, sin},
    scenario::Scenario,
    vector::Vec3,
    world::{BALL_BOUNCE, BALL_HIT},
};
use std::{collections::BTreeMap, fs, path::Path};

pub const SOURCE: &str = include_str!("defense.rs");
pub const PUBLIC_SEED: u64 = 0x5341_5645;
pub const NORMAL_SEED: u64 = 0x5341_5646;
pub const RECOVERY_SEED: u64 = 0x5341_5647;
pub const RECOVERY_FAMILY: Family = Family {
    name: "defense-v3-ground-recovery",
    description: "Rolling threats with defenders far from goal and away from the ball path.",
};
const RECOVERY_PLACES: [&str; 6] = [
    "midfield",
    "attack-half",
    "wide-left",
    "wide-right",
    "wrong-side",
    "chase",
];
pub const MIN_LEAD: f64 = 2.5;
pub const MAX_LEAD: f64 = 5.0;
pub const MIN_DISTANCE: f64 = 2000.0;
pub const DEFAULT_COUNT: usize = 216;
pub const LANES: [&str; 3] = ["left", "center", "right"];
pub const ARRIVALS: [&str; 3] = ["fast", "medium", "slow"];
pub const PLACES: [&str; 6] = [
    "mouth",
    "near-post",
    "far-post",
    "inside",
    "ahead",
    "beside",
];
const HEADINGS: [&str; 4] = ["facing", "leftward", "away", "rightward"];
const MOTIONS: [&str; 4] = ["stopped", "forward", "reverse", "fast-forward"];
const BOOST: [f64; 4] = [0.0, 12.0, 33.0, 100.0];
const RADIUS: f64 = 93.15;
const DEG: f64 = 180.0 / std::f64::consts::PI;
const CELLS: usize = 3 * 3 * 6;
const ATTEMPTS: usize = 4000;
const MIN_RECOVERY_SPEED: f64 = 600.0;
const MAX_RECOVERY_SPEED: f64 = 1600.0;

#[derive(Clone, Copy)]
pub struct Family {
    pub name: &'static str,
    pub description: &'static str,
}
pub const FAMILIES: &[Family] = &[
    Family {
        name: "defense-v1-ground",
        description: "Rolling threats with no strong surface bounce.",
    },
    Family {
        name: "defense-v1-rising",
        description: "Rising shots that enter above the floor.",
    },
    Family {
        name: "defense-v1-falling",
        description: "Falling shots that enter above the floor.",
    },
    Family {
        name: "defense-v1-floor",
        description: "Shots with one strong floor bounce before goal entry.",
    },
    Family {
        name: "defense-v1-double-floor",
        description: "Shots with two strong floor bounces before goal entry.",
    },
    Family {
        name: "defense-v1-side-wall",
        description: "Shots that rebound from a side wall.",
    },
    Family {
        name: "defense-v1-corner",
        description: "Shots that rebound from a diagonal corner wall.",
    },
    Family {
        name: "defense-v1-ceiling",
        description: "Shots that rebound from the ceiling.",
    },
    Family {
        name: "defense-v1-rival-front",
        description: "Straight rival strikes on a still ball; measured contact speed.",
    },
    Family {
        name: "defense-v1-rival-cut",
        description: "Offset rival strikes on a still ball; measured contact speed.",
    },
];

const NORMAL_NAMES: [&str; 10] = [
    "defense-v2-ground",
    "defense-v2-rising",
    "defense-v2-falling",
    "defense-v2-floor",
    "defense-v2-double-floor",
    "defense-v2-side-wall",
    "defense-v2-corner",
    "defense-v2-ceiling",
    "defense-v2-rival-front",
    "defense-v2-rival-cut",
];
const NORMAL_ARRIVALS: [&str; 3] = ["early", "middle", "late"];

pub fn families(emergency: bool) -> Vec<Family> {
    FAMILIES
        .iter()
        .enumerate()
        .filter(|(f, _)| emergency || *f != 1)
        .map(|(f, family)| Family {
            name: if emergency {
                family.name
            } else {
                NORMAL_NAMES[f]
            },
            description: family.description,
        })
        .collect()
}

pub fn emergency(suite: &str) -> bool {
    suite.starts_with("defense-v1-")
}

fn normal_arrival(t: f64) -> Option<&'static str> {
    if (MIN_LEAD..3.3).contains(&t) {
        Some(NORMAL_ARRIVALS[0])
    } else if (3.3..4.1).contains(&t) {
        Some(NORMAL_ARRIVALS[1])
    } else if (4.1..=MAX_LEAD).contains(&t) {
        Some(NORMAL_ARRIVALS[2])
    } else {
        None
    }
}

fn arrival_for(t: f64, normal: bool) -> Option<&'static str> {
    if normal {
        normal_arrival(t)
    } else {
        arrival(t)
    }
}

pub fn mouth_distance(s: &Scenario) -> f64 {
    let p = s.ball_pos;
    ((p.x - p.x.clamp(-800.0, 800.0)).powi(2) + (p.y + arena::HALF_LENGTH).powi(2)).sqrt()
}

/// Group labels use measured goal entry and arrival, not initial velocity estimates.
#[derive(Clone, Debug, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct Measurement {
    pub hash: String,
    pub family: String,
    pub lane: String,
    pub arrival: String,
    pub placement: String,
    pub heading: String,
    pub motion: String,
    pub boost: u32,
    pub approach: String,
    pub height: String,
    pub seconds: f64,
    pub entry: [f64; 3],
    pub entry_speed: f64,
    pub bounces: Vec<Bounce>,
    pub impact: Option<Impact>,
    /// Optimistic horizontal travel margin. This is not a proof of a possible save.
    pub reach_margin: f64,
    pub idle_seconds: f64,
    /// Samples of the undefended path: [seconds, x, y, z].
    pub path: Vec<[f64; 4]>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub recovery: Option<Recovery>,
}
#[derive(Clone, Debug, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct Recovery {
    pub goal_distance: f64,
    pub path_distance: f64,
    pub required_speed: f64,
}
#[derive(Clone, Debug, Serialize, Deserialize, PartialEq)]
pub struct Bounce {
    pub surface: String,
    pub seconds: f64,
    pub position: [f64; 3],
    pub speed: f64,
}
#[derive(Clone, Debug, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct Impact {
    pub seconds: f64,
    pub car_speed: f64,
    pub ball_speed: f64,
    pub offset: f64,
}
#[derive(Clone, Debug, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct Report {
    pub version: u32,
    pub seed: u64,
    pub count_per_family: usize,
    pub generator: String,
    pub simulation: String,
    pub rejected: BTreeMap<String, usize>,
    pub plan: BTreeMap<String, usize>,
    pub cases: BTreeMap<String, Measurement>,
}
pub struct Generated {
    pub pieces: Vec<SetPiece>,
    pub report: Report,
}

fn xyz(v: Vec3) -> [f64; 3] {
    [v.x, v.y, v.z]
}
fn round(v: f64) -> f64 {
    (v * 1000.0).round() / 1000.0
}
fn heading(x: f64, y: f64) -> f64 {
    atan2(y, x) * DEG
}
fn lane(x: f64) -> &'static str {
    if x < -300.0 {
        LANES[0]
    } else if x > 300.0 {
        LANES[2]
    } else {
        LANES[1]
    }
}
fn arrival(t: f64) -> Option<&'static str> {
    if (0.65..1.65).contains(&t) {
        Some(ARRIVALS[0])
    } else if (1.65..2.65).contains(&t) {
        Some(ARRIVALS[1])
    } else if (2.65..4.3).contains(&t) {
        Some(ARRIVALS[2])
    } else {
        None
    }
}
fn impact_band(speed: f64) -> &'static str {
    if speed < 1000.0 {
        "slow"
    } else if speed < 1600.0 {
        "medium"
    } else {
        "fast"
    }
}
fn axis(f: usize, cell: usize, normal: bool) -> String {
    if normal && (f < 8 || f == 10) {
        return "lead-in".into();
    }
    format!(
        "{}-{}",
        if f >= 8 { "impact" } else { "arrival" },
        if normal && f < 8 {
            NORMAL_ARRIVALS[cell / 6 % 3]
        } else {
            ARRIVALS[cell / 6 % 3]
        }
    )
}
fn surface(p: Vec3) -> &'static str {
    let n = arena::normal(p);
    if n.z > 0.7 {
        "floor"
    } else if n.z < -0.7 {
        "ceiling"
    } else if n.x.abs() > 0.3 && n.y.abs() > 0.3 {
        "corner"
    } else if n.x.abs() > 0.7 {
        "side-wall"
    } else if n.y.abs() > 0.7 {
        "end-wall"
    } else {
        "ramp"
    }
}

struct Trace {
    seconds: f64,
    entry: Vec3,
    entry_velocity: Vec3,
    bounces: Vec<Bounce>,
    impact: Option<Impact>,
    contacts: usize,
    samples: Vec<(f64, Vec3)>,
}

/// Removing blue also removes its collisions. The rival keeps the same throttle inputs.
fn threat(s: &Scenario) -> Option<Trace> {
    let mut game = Game::new(1);
    game.start_scenario(s, &idle_brain());
    let mut world = game.world;
    world.cars.retain(|c| c.team == 1);
    for (id, car) in world.cars.iter_mut().enumerate() {
        car.id = id;
    }
    for car in &mut world.cars {
        car.controls = Controls {
            throttle: 1.0,
            ..Controls::default()
        };
    }
    let mut trace = Trace {
        seconds: 0.0,
        entry: Vec3::default(),
        entry_velocity: Vec3::default(),
        bounces: Vec::new(),
        impact: None,
        contacts: 0,
        samples: vec![(0.0, world.ball.pos)],
    };
    let mut last_contact = -100;
    let mut entered = false;
    for tick in 1..=960 {
        if s.rival.module == "strike" {
            for car in &mut world.cars {
                car.controls = soccar_simulation::brains::strike::controls(car);
            }
        }
        let before = world.ball.pos;
        let before_ball = world.ball.clone();
        let before_car = world.cars.first().cloned();
        world.step();
        let t = tick as f64 * DT;
        trace.samples.push((t, world.ball.pos));
        for event in &world.events {
            if event.kind == BALL_BOUNCE {
                trace.bounces.push(Bounce {
                    surface: surface(event.position).into(),
                    seconds: round(t),
                    position: xyz(event.position).map(round),
                    speed: round(event.strength),
                });
            }
            if event.kind == BALL_HIT {
                if tick > last_contact + 6 {
                    trace.contacts += 1;
                }
                last_contact = tick;
                if trace.impact.is_none() {
                    // Reproduce this car's pre-contact step to measure speed before the impulse.
                    let mut car = before_car.clone().expect("a rival hit the ball");
                    let mut ball = before_ball.clone();
                    car.pre_step(DT, Some(&mut ball));
                    car.integrate_position(DT);
                    car.collide_world();
                    trace.impact = Some(Impact {
                        seconds: round(t),
                        car_speed: round(car.vel.length()),
                        ball_speed: round(world.ball.vel.length()),
                        offset: round(ball.pos.minus(car.pos).dot(car.left)),
                    });
                }
            }
        }
        if before.y > -arena::HALF_LENGTH && world.ball.pos.y <= -arena::HALF_LENGTH {
            let f = (-arena::HALF_LENGTH - before.y) / (world.ball.pos.y - before.y);
            trace.entry = before.with_scaled(world.ball.pos.minus(before), f);
            trace.entry_velocity = world.ball.vel;
            entered = true;
        }
        if let Some(team) = world.goal_scored {
            if team != 1 || !entered {
                return None;
            }
            trace.seconds = t;
            return Some(trace);
        }
    }
    None
}

fn matches_family(f: usize, t: &Trace) -> bool {
    let count = |name: &str| t.bounces.iter().filter(|b| b.surface == name).count();
    let floor = count("floor");
    let only_floor = t.bounces.iter().all(|b| b.surface == "floor");
    match f {
        0 | 10 => t.bounces.is_empty() && t.entry.z < 150.0,
        1 => t.bounces.is_empty() && t.entry.z > 160.0 && t.entry_velocity.z > 70.0,
        2 => t.bounces.is_empty() && t.entry.z > 160.0 && t.entry_velocity.z < -70.0,
        3 => only_floor && floor == 1,
        4 => only_floor && floor == 2,
        5 => {
            count("side-wall") == 1
                && t.bounces
                    .iter()
                    .all(|b| matches!(b.surface.as_str(), "floor" | "side-wall"))
        }
        6 => {
            count("corner") == 1
                && t.bounces
                    .iter()
                    .all(|b| matches!(b.surface.as_str(), "floor" | "corner"))
        }
        7 => {
            count("ceiling") == 1
                && t.bounces
                    .iter()
                    .all(|b| matches!(b.surface.as_str(), "floor" | "ceiling"))
        }
        8 => t.contacts == 1 && t.impact.as_ref().is_some_and(|i| i.offset.abs() < 20.0),
        9 => t.contacts == 1 && t.impact.as_ref().is_some_and(|i| i.offset.abs() > 25.0),
        _ => false,
    }
}

/// A proposal helper, not a validator. Solve horizontal speed in a flat floor/ceiling corridor.
/// The complete arena and its goal frame still decide acceptance in `threat`.
fn flight_scale(pos: Vec3, velocity: Vec3, eta: f64) -> f64 {
    let ticks = (eta / DT).round() as usize;
    let travel = |scale: f64| {
        let mut ball = soccar_simulation::ball::Ball::default();
        ball.reset(0.0, 0.0, pos.z);
        ball.vel = Vec3::new(velocity.x * scale, velocity.y * scale, velocity.z);
        let mut y = 0.0;
        for _ in 0..ticks {
            ball.step();
            y += ball.pos.y;
            ball.pos.x = 0.0;
            ball.pos.y = 0.0;
        }
        -y
    };
    let distance = 5160.0 + pos.y;
    let (mut low, mut high) = (0.25, 4.0);
    for _ in 0..10 {
        let middle = (low + high) * 0.5;
        if travel(middle) < distance {
            low = middle;
        } else {
            high = middle;
        }
    }
    (low + high) * 0.5
}

/// Ball variation is independent of the defender cell. These are proposals, not trajectory labels.
fn candidate(g: &mut Rng, f: usize, cell: usize, variant: usize, normal: bool) -> String {
    let recovery = f == 10;
    let f = if recovery { 0 } else { f };
    let lane_index = cell / 18;
    let arrival_index = cell / 6 % 3;
    let place = cell % 6;
    let target = match lane_index {
        0 => g.range(-690.0, -390.0),
        1 => g.range(-230.0, 230.0),
        _ => g.range(390.0, 690.0),
    };
    let eta = if recovery {
        g.range(3.4, 4.65)
    } else if normal {
        g.range(2.9, 4.05)
    } else if f == 1 {
        g.range(0.7, 1.08)
    } else {
        match arrival_index {
            0 => g.range(0.9, 1.55),
            1 => g.range(1.8, 2.5),
            _ => g.range(2.9, 4.05),
        }
    };
    let side = if lane_index == 0 {
        -1.0
    } else if lane_index == 2 {
        1.0
    } else if g.chance(0.5) {
        -1.0
    } else {
        1.0
    };
    let mut bx = g.range(-2500.0, 2500.0);
    let mut by = -5120.0 + g.range(650.0, 2000.0) * eta.min(2.6);
    let mut bz = RADIUS;
    let mut vx = (target - bx) / eta;
    let mut vy = (-5120.0 - by) / eta;
    let mut vz = 0.0;
    let mut rival = String::new();
    match f {
        1 => {
            bz = g.range(RADIUS, 180.0);
            vz = 650.0 * eta + g.range(70.0, 180.0);
        }
        2 => {
            bz = if normal {
                g.range(RADIUS, 400.0)
            } else {
                g.range(500.0, 1850.0)
            };
            vz = (g.range(180.0, 500.0) - bz + 325.0 * eta * eta) / eta;
        }
        3 => {
            bz = g.range(300.0, 1500.0);
            vz = g.range(-1800.0, 200.0);
        }
        4 => {
            bz = g.range(180.0, 1000.0);
            vz = g.range(-1700.0, 400.0);
        }
        5 => {
            bx = side * g.range(3450.0, 3840.0);
            bz = g.range(450.0, 1600.0);
            by = -5120.0 + g.range(450.0, 1300.0) * eta;
            // Normal restitution is 0.6; tangent friction changes the other components.
            vx = side * ((4000.0 - bx.abs()) + (4000.0 - side * target) / 0.6) / eta;
            vy = (-5120.0 - by) / eta / 0.75;
            vz = g.range(-150.0, 1000.0);
        }
        6 => {
            let contact_x = side * g.range(3050.0, 3500.0);
            let contact_y = -(7935.0 - contact_x.abs());
            let flight = eta * g.range(0.55, 0.85);
            let before = eta - flight;
            let out_x = (target - contact_x) / flight;
            let out_y = (-5120.0 - contact_y) / flight;
            // Approximate diagonal reflection. Physics decides whether this proposal works.
            vx = side * (0.057 * side * out_x - 0.657 * out_y)
                / (0.057_f64.powi(2) - 0.657_f64.powi(2));
            vy = (-0.657 * side * out_x + 0.057 * out_y) / (0.057_f64.powi(2) - 0.657_f64.powi(2));
            bx = contact_x - vx * before;
            by = contact_y - vy * before;
            let contact_z = g.range(450.0, 1400.0);
            let out_z = (g.range(180.0, 450.0) - contact_z + 325.0 * flight * flight) / flight;
            vz = out_z / 0.714 + 650.0 * before;
            bz = contact_z - vz * before + 325.0 * before * before;
        }
        7 => {
            bz = g.range(1400.0, 1890.0);
            vz = g.range(900.0, 4300.0);
            vy /= 0.75;
            vx /= 0.75;
        }
        8 | 9 => {
            by = if normal {
                match arrival_index {
                    0 => g.range(-1000.0, 2500.0),
                    1 => g.range(-2300.0, 1200.0),
                    _ => g.range(-3100.0, -1300.0),
                }
            } else {
                g.range(-4380.0, -1500.0)
            };
            let yaw = heading(target - bx, -5120.0 - by)
                + if f == 9 { g.range(-40.0, 40.0) } else { 0.0 };
            let a = yaw / DEG;
            let gap = g.range(280.0, 550.0);
            let offset = if f == 8 {
                g.range(-12.0, 12.0)
            } else {
                side * g.range(30.0, 80.0)
            };
            let ox = bx - cos(a) * gap - sin(a) * offset;
            let oy = by - sin(a) * gap + cos(a) * offset;
            let speed = match arrival_index {
                0 => g.range(1650.0, 2250.0),
                1 => g.range(750.0, 1450.0),
                _ => g.range(50.0, 650.0),
            };
            rival = format!(
                "car = orange {:.0} {:.0} {:.0} {:.0} 0\nrival = {}\n",
                ox,
                oy,
                yaw,
                speed,
                if normal {
                    "strike"
                } else {
                    "scripted mode=throttle"
                }
            );
            vx = 0.0;
            vy = 0.0;
            vz = 0.0;
        }
        _ => {}
    }
    if f <= 4 || f == 7 {
        let scale = flight_scale(Vec3::new(bx, by, bz), Vec3::new(vx, vy, vz), eta);
        vx *= scale;
        vy *= scale;
    }
    // Cyclic assignments cover all headings, motions, and boost values in each complete cell.
    let h = variant % 4;
    let motion = (variant + cell) % 4;
    let boost = (variant + cell / 3) % 4;
    let goal_side = if target < 0.0 { -1.0 } else { 1.0 };
    let (cx, cy) = if recovery {
        match place {
            0 => (g.range(-1800.0, 1800.0), g.range(-500.0, 800.0)),
            1 => (g.range(-1800.0, 1800.0), g.range(200.0, 1200.0)),
            2 => (g.range(-3400.0, -2400.0), g.range(-1400.0, 600.0)),
            3 => (g.range(2400.0, 3400.0), g.range(-1400.0, 600.0)),
            4 => (
                -goal_side * g.range(1600.0, 3200.0),
                g.range(-1900.0, -600.0),
            ),
            _ => (
                bx + side * g.range(1100.0, 2200.0),
                by + g.range(900.0, 2000.0),
            ),
        }
    } else {
        match place {
            0 => (g.range(-350.0, 350.0), g.range(-5000.0, -4750.0)),
            1 => (goal_side * g.range(500.0, 700.0), g.range(-5050.0, -4750.0)),
            2 => (
                -goal_side * g.range(500.0, 700.0),
                g.range(-5050.0, -4750.0),
            ),
            3 => (g.range(-650.0, 650.0), g.range(-5340.0, -5200.0)),
            4 => (g.range(-850.0, 850.0), g.range(-4400.0, -3900.0)),
            _ => (side * g.range(1100.0, 1900.0), g.range(-4800.0, -4300.0)),
        }
    };
    let yaw = heading(bx - cx, by - cy) + [0.0, 90.0, 180.0, -90.0][h];
    let speed = [0.0, 800.0, -700.0, 1400.0][motion];
    format!(
        "kind = defend\ntime = 5\nball = {:.0} {:.0} {}\nball_vel = {:.0} {:.0} {:.0}\nball_spin = 0 0 {:.0}\ncar = blue {:.0} {:.0} {:.0} {speed} {}\n{rival}",
        bx,
        by,
        if bz == RADIUS { RADIUS } else { bz.round() },
        vx,
        vy,
        vz,
        if f >= 8 { 0.0 } else { g.range(-3.0, 3.0) },
        cx,
        cy,
        yaw,
        BOOST[boost]
    )
}

fn margin(s: &Scenario, trace: &Trace) -> f64 {
    let car = &s.cars[0];
    trace
        .samples
        .iter()
        .map(|&(t, p)| {
            // 2300 is the car speed limit. Add 220 for the car and ball contact radius.
            2300.0 * t + 220.0 - ((p.x - car.x).powi(2) + (p.y - car.y).powi(2)).sqrt()
        })
        .fold(f64::NEG_INFINITY, f64::max)
}

/// Measure travel to an intercept outside the goal, with time left for contact.
fn recovery_measurement(s: &Scenario, trace: &Trace) -> Recovery {
    let car = &s.cars[0];
    let distance = |p: Vec3| ((p.x - car.x).powi(2) + (p.y - car.y).powi(2)).sqrt();
    Recovery {
        goal_distance: ((car.x - car.x.clamp(-800.0, 800.0)).powi(2)
            + (car.y + arena::HALF_LENGTH).powi(2))
        .sqrt(),
        path_distance: trace
            .samples
            .iter()
            .map(|&(_, p)| distance(p))
            .fold(f64::INFINITY, f64::min),
        required_speed: trace
            .samples
            .iter()
            .filter(|&&(t, p)| t >= 0.5 && t <= trace.seconds - 0.35 && p.y >= -4700.0)
            .map(|&(t, p)| (distance(p) - 220.0).max(0.0) / t)
            .fold(f64::INFINITY, f64::min),
    }
}

pub fn generate_recovery(seed: u64, count: usize, _threads: usize) -> Result<Generated, String> {
    if count == 0 || count > 10_000 {
        return Err("Defense count must be in 1..10000".into());
    }
    generate_family(seed, count, 10, true)
}

/// Cells use lane × measured arrival (or rival contact speed) × defender placement.
/// Changing worker count does not change the output, and small counts are prefixes of large counts.
pub fn generate(seed: u64, count: usize, threads: usize) -> Result<Generated, String> {
    generate_profile(seed, count, threads, true)
}

pub fn generate_emergency(seed: u64, count: usize, threads: usize) -> Result<Generated, String> {
    generate_profile(seed, count, threads, false)
}

fn generate_profile(
    seed: u64,
    count: usize,
    threads: usize,
    normal: bool,
) -> Result<Generated, String> {
    if count == 0 || count > 10_000 {
        return Err("Defense count must be in 1..10000".into());
    }
    let workers = threads.clamp(1, FAMILIES.len());
    let mut parts = std::thread::scope(|scope| {
        let handles: Vec<_> = (0..workers)
            .map(|worker| {
                scope.spawn(move || {
                    (worker..FAMILIES.len())
                        .step_by(workers)
                        .filter(|&f| !normal || f != 1)
                        .map(|f| (f, generate_family(seed, count, f, normal)))
                        .collect::<Vec<_>>()
                })
            })
            .collect();
        let mut parts = Vec::new();
        for handle in handles {
            parts.extend(handle.join().map_err(|_| "Defense worker failed")?);
        }
        Ok::<_, String>(parts)
    })?;
    parts.sort_by_key(|(f, _)| *f);
    let errors: Vec<_> = parts
        .iter()
        .filter_map(|(_, part)| part.as_ref().err().cloned())
        .collect();
    if !errors.is_empty() {
        return Err(errors.join("\n"));
    }
    let mut parts: Vec<_> = parts
        .into_iter()
        .map(|(f, part)| (f, part.unwrap()))
        .collect();
    let (_, mut generated) = parts.remove(0);
    for (_, part) in parts {
        generated.pieces.extend(part.pieces);
        generated.report.rejected.extend(part.report.rejected);
        generated.report.plan.extend(part.report.plan);
        generated.report.cases.extend(part.report.cases);
    }
    Ok(generated)
}

fn generate_family(seed: u64, count: usize, f: usize, normal: bool) -> Result<Generated, String> {
    let mut hash = Hash::new();
    hash.bytes(SOURCE.as_bytes());
    let mut report = Report {
        version: 1,
        seed,
        count_per_family: count,
        generator: format!("{:016x}", hash.0),
        simulation: soccar_simulation::recording::engine_version(),
        rejected: BTreeMap::new(),
        plan: BTreeMap::new(),
        cases: BTreeMap::new(),
    };
    let reject = |report: &mut Report, family: &str, reason: &str| {
        *report
            .rejected
            .entry(format!("{family}/{reason}"))
            .or_default() += 1;
    };
    let mut pieces = Vec::new();
    {
        let family = if f == 10 {
            RECOVERY_FAMILY
        } else {
            Family {
                name: if normal {
                    NORMAL_NAMES[f]
                } else {
                    FAMILIES[f].name
                },
                description: FAMILIES[f].description,
            }
        };
        let places = if f == 10 { &RECOVERY_PLACES } else { &PLACES };
        // Gravity makes long, unbounced rising shots below the crossbar impossible.
        let cells: Vec<usize> = (0..CELLS)
            .filter(|c| {
                if normal && (f < 8 || f == 10) {
                    c / 6 % 3 == 2
                } else {
                    f != 1 || c / 6 % 3 == 0
                }
            })
            .collect();
        for index in 0..count {
            let cell = cells[index % cells.len()];
            let variant = index / cells.len();
            let group = format!(
                "{}/{} × {} × {}",
                family.name,
                LANES[cell / 18],
                axis(f, cell, normal),
                places[cell % 6]
            );
            *report.plan.entry(group).or_default() += 1;
            let cell_seed = seed
                ^ (f as u64 + 1).wrapping_mul(0x9e37_79b9_7f4a_7c15)
                ^ (index as u64 + 1).wrapping_mul(0xbf58_476d_1ce4_e5b9);
            let mut g = Rng::new(cell_seed);
            let mut accepted = None;
            for _ in 0..ATTEMPTS {
                let text = candidate(&mut g, f, cell, variant, normal);
                let Ok(mut scenario) = Scenario::parse(&text) else {
                    reject(&mut report, family.name, "placement");
                    continue;
                };
                if scenario.ball_vel.length() > 6000.0 {
                    reject(&mut report, family.name, "speed-limit");
                    continue;
                }
                if normal && mouth_distance(&scenario) < MIN_DISTANCE {
                    reject(&mut report, family.name, "lead-distance");
                    continue;
                }
                if arena::distance(scenario.ball_pos) < 91.25
                    || scenario
                        .cars
                        .iter()
                        .any(|c| scenario.ball_pos.distance(Vec3::new(c.x, c.y, 40.0)) < 230.0)
                    || (scenario.cars.len() == 2
                        && ((scenario.cars[0].x - scenario.cars[1].x).powi(2)
                            + (scenario.cars[0].y - scenario.cars[1].y).powi(2))
                        .sqrt()
                            < 240.0)
                {
                    reject(&mut report, family.name, "overlap");
                    continue;
                }
                let Some(trace) = threat(&scenario) else {
                    reject(&mut report, family.name, "not-a-goal");
                    continue;
                };
                if !matches_family(f, &trace) {
                    reject(&mut report, family.name, "trajectory");
                    continue;
                }
                let axis_matches = if f == 8 || f == 9 {
                    trace
                        .impact
                        .as_ref()
                        .is_some_and(|i| impact_band(i.car_speed) == ARRIVALS[cell / 6 % 3])
                        && arrival_for(trace.seconds, normal).is_some()
                } else {
                    if normal {
                        normal_arrival(trace.seconds).is_some()
                    } else {
                        arrival(trace.seconds) == Some(ARRIVALS[cell / 6 % 3])
                    }
                };
                if lane(trace.entry.x) != LANES[cell / 18] || !axis_matches {
                    reject(&mut report, family.name, "coverage");
                    continue;
                }
                let reach_margin = margin(&scenario, &trace);
                if reach_margin < 0.0 {
                    reject(&mut report, family.name, "travel-bound");
                    continue;
                }
                let recovery = (f == 10).then(|| recovery_measurement(&scenario, &trace));
                if let Some(r) = &recovery {
                    let reason = if r.goal_distance < 2800.0 {
                        Some("recovery-goal-distance")
                    } else if r.path_distance < 1000.0 {
                        Some("recovery-path-distance")
                    } else if r.required_speed < MIN_RECOVERY_SPEED {
                        Some("recovery-too-easy")
                    } else if r.required_speed > MAX_RECOVERY_SPEED {
                        Some("recovery-too-hard")
                    } else {
                        None
                    };
                    if let Some(reason) = reason {
                        reject(&mut report, family.name, reason);
                        continue;
                    }
                }
                scenario.time = (trace.seconds + 1.0).ceil();
                let job = ScenarioJob {
                    scenario: scenario.clone(),
                    brain: idle_brain(),
                };
                let idle = harness::run_scenario(&job);
                if idle.success
                    || idle.goal != Some(1)
                    || (normal && !(MIN_LEAD..=MAX_LEAD).contains(&idle.seconds))
                {
                    reject(&mut report, family.name, "idle-passes");
                    continue;
                }
                scenario.note = format!(
                    "{} threat, {} entry in {:.2}s. Defender {}, {}, {}, boost {}.",
                    family.description.trim_end_matches('.'),
                    lane(trace.entry.x),
                    trace.seconds,
                    places[cell % 6],
                    HEADINGS[variant % 4],
                    MOTIONS[(variant + cell) % 4],
                    scenario.cars[0].boost
                );
                let name = format!(
                    "{}-{}-{}-{:03}",
                    LANES[cell / 18],
                    axis(f, cell, normal),
                    places[cell % 6],
                    variant + 1
                );
                let piece = SetPiece::parse(family.name, &name, &scenario.text())?;
                let measurement = Measurement {
                    hash: piece.hash.clone(),
                    family: family.name.into(),
                    lane: lane(trace.entry.x).into(),
                    arrival: arrival_for(trace.seconds, normal).unwrap().into(),
                    placement: places[cell % 6].into(),
                    heading: HEADINGS[variant % 4].into(),
                    motion: MOTIONS[(variant + cell) % 4].into(),
                    boost: scenario.cars[0].boost as u32,
                    approach: if scenario.ball_pos.x < -600.0 {
                        "left"
                    } else if scenario.ball_pos.x > 600.0 {
                        "right"
                    } else {
                        "center"
                    }
                    .into(),
                    height: if trace.entry.z < 160.0 {
                        "low"
                    } else if trace.entry.z < 350.0 {
                        "middle"
                    } else {
                        "high"
                    }
                    .into(),
                    seconds: round(trace.seconds),
                    entry: xyz(trace.entry).map(round),
                    entry_speed: round(trace.entry_velocity.length()),
                    bounces: trace.bounces,
                    impact: trace.impact,
                    reach_margin: round(reach_margin),
                    idle_seconds: round(idle.seconds),
                    path: trace
                        .samples
                        .iter()
                        .enumerate()
                        .filter(|(i, _)| i % 12 == 0 || *i + 1 == trace.samples.len())
                        .map(|(_, &(t, p))| [round(t), round(p.x), round(p.y), round(p.z)])
                        .collect(),
                    recovery: recovery.map(|r| Recovery {
                        goal_distance: round(r.goal_distance),
                        path_distance: round(r.path_distance),
                        required_speed: round(r.required_speed),
                    }),
                };
                accepted = Some((piece, measurement));
                break;
            }
            let Some((piece, measurement)) = accepted else {
                return Err(format!(
                    "{}: unfilled cell {} × {} × {}, variant {} after {ATTEMPTS} proposals. Rejected: {:?}",
                    family.name,
                    LANES[cell / 18],
                    axis(f, cell, normal),
                    places[cell % 6],
                    variant + 1,
                    report.rejected
                ));
            };
            report.cases.insert(piece.id.clone(), measurement);
            pieces.push(piece);
        }
        eprintln!("{}: {count} measured threats", family.name);
    }
    Ok(Generated { pieces, report })
}

/// Optional metadata never changes a scenario hash. Stale metadata is not displayed.
pub fn load(root: &Path) -> Result<Option<Report>, String> {
    let mut report: Option<Report> = None;
    for name in ["defense-v1.json", "defense-v2.json", "defense-v3.json"] {
        let path = root.join("scenarios").join(name);
        let loaded: Report = match fs::read_to_string(&path) {
            Ok(text) => {
                serde_json::from_str(&text).map_err(|e| format!("{}: {e}", path.display()))?
            }
            Err(e) if e.kind() == std::io::ErrorKind::NotFound => continue,
            Err(e) => return Err(format!("{}: {e}", path.display())),
        };
        if loaded.version != 1
            || loaded.simulation != soccar_simulation::recording::engine_version()
        {
            continue;
        }
        if let Some(old) = report.replace(loaded) {
            let r = report.as_mut().unwrap();
            r.cases.extend(old.cases);
            r.plan.extend(old.plan);
            r.rejected.extend(old.rejected);
        }
    }
    Ok(report)
}

pub fn measurement<'a>(report: Option<&'a Report>, piece: &SetPiece) -> Option<&'a Measurement> {
    report
        .filter(|r| {
            r.version == 1 && r.simulation == soccar_simulation::recording::engine_version()
        })?
        .cases
        .get(&piece.id)
        .filter(|m| m.hash == piece.hash)
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn physics_classifies_bounces_and_goal_entry() {
        let scenario = Scenario::parse("kind = defend\ntime = 5\nball = 500 -3000 93.15\nball_vel = 0 -2000 0\ncar = blue -650 -4950 0 0 0").unwrap();
        let trace = threat(&scenario).unwrap();
        assert!(matches_family(0, &trace));
        assert_eq!(lane(trace.entry.x), "right");
        assert_eq!(trace.entry.y, -5120.0);
        assert_eq!(arrival(trace.seconds), Some("fast"));
        assert!(margin(&scenario, &trace) > 0.0);
    }
    #[test]
    fn labels_use_measured_values_and_have_no_gaps() {
        assert_eq!(arrival(0.65), Some("fast"));
        assert_eq!(arrival(1.65), Some("medium"));
        assert_eq!(arrival(2.65), Some("slow"));
        assert_eq!(arrival(4.3), None);
        assert_eq!(normal_arrival(2.499), None);
        assert_eq!(normal_arrival(2.5), Some("early"));
        assert_eq!(normal_arrival(3.3), Some("middle"));
        assert_eq!(normal_arrival(4.1), Some("late"));
        assert_eq!(normal_arrival(5.0), Some("late"));
        assert_eq!(normal_arrival(5.001), None);
        assert_eq!(surface(Vec3::new(0.0, 0.0, 91.25)), "floor");
        assert_eq!(surface(Vec3::new(0.0, 0.0, 1952.75)), "ceiling");
    }
    #[test]
    fn generation_fills_cells_and_does_not_depend_on_workers() {
        let serial = generate_emergency(PUBLIC_SEED, 54, 1).unwrap();
        let parallel = generate_emergency(PUBLIC_SEED, 54, 4).unwrap();
        assert_eq!(serial.report, parallel.report);
        assert_eq!(serial.pieces.len(), 540);
        for (a, b) in serial.pieces.iter().zip(&parallel.pieces) {
            assert_eq!(a.id, b.id);
            assert_eq!(a.text, b.text);
            assert_eq!(a.scenario.cars.iter().filter(|c| c.team == 0).count(), 1);
        }
        for (group, &quota) in &serial.report.plan {
            let (family, cell) = group.split_once('/').unwrap();
            let labels: Vec<_> = cell.split(" × ").collect();
            let count = serial
                .report
                .cases
                .values()
                .filter(|m| {
                    m.family == family
                        && m.lane == labels[0]
                        && m.placement == labels[2]
                        && if let Some(band) = labels[1].strip_prefix("impact-") {
                            m.impact
                                .as_ref()
                                .is_some_and(|i| impact_band(i.car_speed) == band)
                        } else {
                            Some(m.arrival.as_str()) == labels[1].strip_prefix("arrival-")
                        }
                })
                .count();
            assert_eq!(count, quota, "{group}");
        }
        let small = generate_emergency(PUBLIC_SEED, 1, 2).unwrap();
        for piece in small.pieces {
            assert_eq!(
                serial
                    .pieces
                    .iter()
                    .find(|p| p.id == piece.id)
                    .unwrap()
                    .text,
                piece.text
            );
        }
        let unseen = generate_emergency(1865204, 1, 2).unwrap();
        for (public, holdout) in small_case_texts(&serial).zip(unseen.pieces) {
            assert_ne!(public, holdout.text);
        }
    }
    fn small_case_texts(generated: &Generated) -> impl Iterator<Item = &str> {
        FAMILIES.iter().map(|f| {
            generated
                .pieces
                .iter()
                .find(|p| p.suite == f.name)
                .unwrap()
                .text
                .as_str()
        })
    }
    #[test]
    fn fixed_corpus_matches_physics_and_has_complete_coverage() {
        let root = Path::new(env!("CARGO_MANIFEST_DIR"));
        let report = load(root).unwrap().expect("fixed defense v1 corpus");
        let (_, pieces) = crate::setpieces::load(&root.join("scenarios")).unwrap();
        let measured: Vec<_> = pieces
            .iter()
            .filter(|p| emergency(&p.suite))
            .filter_map(|p| measurement(Some(&report), p).map(|m| (p, m)))
            .collect();
        assert_eq!(measured.len(), FAMILIES.len() * DEFAULT_COUNT);
        assert_eq!(
            report
                .plan
                .iter()
                .filter(|(key, _)| key.starts_with("defense-v1-"))
                .map(|(_, &count)| count)
                .sum::<usize>(),
            measured.len()
        );
        for (piece, m) in measured {
            let f = FAMILIES.iter().position(|f| f.name == piece.suite).unwrap();
            let t = threat(&piece.scenario).expect(&piece.id);
            assert!(matches_family(f, &t), "{}", piece.id);
            assert_eq!(m.seconds, round(t.seconds));
            assert_eq!(m.entry, xyz(t.entry).map(round));
            assert_eq!(m.bounces, t.bounces);
            assert_eq!(m.impact, t.impact);
            assert!(piece.scenario.ball_vel.length() <= 6000.0);
            assert!(m.reach_margin >= 0.0);
            assert_eq!(
                piece.scenario.cars.iter().filter(|c| c.team == 0).count(),
                1
            );
            let idle = harness::run_scenario(&ScenarioJob {
                scenario: piece.scenario.clone(),
                brain: idle_brain(),
            });
            assert!(!idle.success && idle.goal == Some(1), "{}", piece.id);
            assert_eq!(m.idle_seconds, round(idle.seconds));
        }
        for family in FAMILIES {
            for heading in HEADINGS {
                assert_eq!(
                    report
                        .cases
                        .values()
                        .filter(|m| m.family == family.name && m.heading == heading)
                        .count(),
                    54
                );
            }
            for motion in MOTIONS {
                assert_eq!(
                    report
                        .cases
                        .values()
                        .filter(|m| m.family == family.name && m.motion == motion)
                        .count(),
                    54
                );
            }
            for boost in BOOST {
                assert_eq!(
                    report
                        .cases
                        .values()
                        .filter(|m| m.family == family.name && m.boost == boost as u32)
                        .count(),
                    54
                );
            }
        }
    }

    #[test]
    fn normal_tests_have_time_and_distance_before_goal() {
        let root = Path::new(env!("CARGO_MANIFEST_DIR"));
        let report = load(root).unwrap().expect("defense corpus");
        let (_, pieces) = crate::setpieces::load(&root.join("scenarios")).unwrap();
        let normal: Vec<_> = pieces
            .iter()
            .filter(|p| p.suite.starts_with("defense-v2-"))
            .collect();
        assert_eq!(normal.len(), families(false).len() * DEFAULT_COUNT);
        assert_eq!(
            normal.len(),
            report
                .plan
                .iter()
                .filter(|(key, _)| key.starts_with("defense-v2-"))
                .map(|(_, &n)| n)
                .sum::<usize>()
        );
        for family in families(false) {
            let cases: Vec<_> = report
                .cases
                .values()
                .filter(|m| m.family == family.name)
                .collect();
            for heading in HEADINGS {
                assert_eq!(cases.iter().filter(|m| m.heading == heading).count(), 54);
            }
            for motion in MOTIONS {
                assert_eq!(cases.iter().filter(|m| m.motion == motion).count(), 54);
            }
            for boost in BOOST {
                assert_eq!(cases.iter().filter(|m| m.boost == boost as u32).count(), 54);
            }
            for lane in LANES {
                assert_eq!(cases.iter().filter(|m| m.lane == lane).count(), 72);
            }
            if family.name.contains("rival-") {
                for band in ARRIVALS {
                    assert_eq!(
                        cases
                            .iter()
                            .filter(|m| m
                                .impact
                                .as_ref()
                                .is_some_and(|i| impact_band(i.car_speed) == band))
                            .count(),
                        72
                    );
                }
            }
        }
        for piece in normal {
            let m = measurement(Some(&report), piece).expect(&piece.id);
            let t = threat(&piece.scenario).expect(&piece.id);
            let f = NORMAL_NAMES
                .iter()
                .position(|name| *name == piece.suite)
                .unwrap();
            assert!(matches_family(f, &t), "{}", piece.id);
            assert!((MIN_LEAD..=MAX_LEAD).contains(&t.seconds), "{}", piece.id);
            assert!(
                mouth_distance(&piece.scenario) >= MIN_DISTANCE,
                "{}",
                piece.id
            );
            assert_eq!(m.seconds, round(t.seconds));
            let idle = harness::run_scenario(&ScenarioJob {
                scenario: piece.scenario.clone(),
                brain: idle_brain(),
            });
            assert!(!idle.success && idle.goal == Some(1), "{}", piece.id);
            assert!(
                (MIN_LEAD..=MAX_LEAD).contains(&idle.seconds),
                "{}",
                piece.id
            );
        }
        let serial = generate(NORMAL_SEED, 1, 1).unwrap();
        let parallel = generate(NORMAL_SEED, 1, 4).unwrap();
        assert_eq!(serial.report, parallel.report);
    }

    #[test]
    fn recovery_tests_require_travel_before_goal() {
        let root = Path::new(env!("CARGO_MANIFEST_DIR"));
        let report = load(root).unwrap().expect("defense corpus");
        let (_, pieces) = crate::setpieces::load(&root.join("scenarios")).unwrap();
        let pieces: Vec<_> = pieces
            .iter()
            .filter(|p| p.suite == RECOVERY_FAMILY.name)
            .collect();
        assert_eq!(pieces.len(), DEFAULT_COUNT);
        for lane in LANES {
            for place in RECOVERY_PLACES {
                let count = pieces
                    .iter()
                    .filter(|p| {
                        let m = measurement(Some(&report), p).unwrap();
                        m.lane == lane && m.placement == place
                    })
                    .count();
                assert_eq!(count, 12, "{lane} × {place}");
            }
        }
        for piece in &pieces {
            let m = measurement(Some(&report), piece).unwrap();
            let trace = threat(&piece.scenario).expect(&piece.id);
            assert!(matches_family(10, &trace), "{}", piece.id);
            assert!((MIN_LEAD..=MAX_LEAD).contains(&trace.seconds));
            assert!(mouth_distance(&piece.scenario) >= MIN_DISTANCE);
            let travel = recovery_measurement(&piece.scenario, &trace);
            assert!(travel.goal_distance >= 2800.0, "{}", piece.id);
            assert!(travel.path_distance >= 1000.0, "{}", piece.id);
            assert!(
                (MIN_RECOVERY_SPEED..=MAX_RECOVERY_SPEED).contains(&travel.required_speed),
                "{}",
                piece.id
            );
            let saved = m.recovery.as_ref().unwrap();
            assert_eq!(saved.goal_distance, round(travel.goal_distance));
            assert_eq!(saved.path_distance, round(travel.path_distance));
            assert_eq!(saved.required_speed, round(travel.required_speed));
            assert_eq!(m.seconds, round(trace.seconds));
            let idle = harness::run_scenario(&ScenarioJob {
                scenario: piece.scenario.clone(),
                brain: idle_brain(),
            });
            assert!(!idle.success && idle.goal == Some(1));
            assert!((MIN_LEAD..=MAX_LEAD).contains(&idle.seconds));
            assert_eq!(m.idle_seconds, round(idle.seconds));
        }
        for heading in HEADINGS {
            assert_eq!(
                pieces
                    .iter()
                    .filter(|p| measurement(Some(&report), p).unwrap().heading == heading)
                    .count(),
                54
            );
        }
        for motion in MOTIONS {
            assert_eq!(
                pieces
                    .iter()
                    .filter(|p| measurement(Some(&report), p).unwrap().motion == motion)
                    .count(),
                54
            );
        }
        for boost in BOOST {
            assert_eq!(
                pieces
                    .iter()
                    .filter(|p| measurement(Some(&report), p).unwrap().boost == boost as u32)
                    .count(),
                54
            );
        }
        let prefix = generate_recovery(RECOVERY_SEED, 18, 1).unwrap();
        let parallel = generate_recovery(RECOVERY_SEED, 18, 4).unwrap();
        assert_eq!(prefix.report, parallel.report);
        for p in prefix.pieces {
            assert_eq!(
                p.text,
                pieces.iter().find(|fixed| fixed.id == p.id).unwrap().text
            );
        }
        let unseen = generate_recovery(764925, 18, 4).unwrap();
        for p in unseen.pieces {
            assert_ne!(
                p.text,
                pieces.iter().find(|fixed| fixed.id == p.id).unwrap().text
            );
        }
    }
}
