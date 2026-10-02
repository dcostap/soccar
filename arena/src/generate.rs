//! Generated set pieces: families of randomized scenarios around one skill each.
//! `setpieces generate` writes them to `arena/scenarios/gen-*.txt` with a fixed seed. `setpieces --holdout <seed>`
//! plays the same families with another seed without writing them, so brains can be checked on scenarios nobody tuned against.
//!
//! Every scenario that an idle car passes is dropped: it would measure nothing.
//! Positions are rounded to whole units, so the text is exact. Angles use the pinned libm functions.
use soccar_simulation::{
    brains::BrainSpec,
    harness::{self, ScenarioJob},
    math::{atan2, cos, sin},
    scenario::Scenario,
};
use std::f64::consts::PI;

/// SplitMix64: small, fast, and identical everywhere.
pub struct Rng(u64);
impl Rng {
    pub fn new(seed: u64) -> Self {
        Self(seed)
    }
    pub(crate) fn next(&mut self) -> u64 {
        self.0 = self.0.wrapping_add(0x9e37_79b9_7f4a_7c15);
        let mut z = self.0;
        z = (z ^ (z >> 30)).wrapping_mul(0xbf58_476d_1ce4_e5b9);
        z = (z ^ (z >> 27)).wrapping_mul(0x94d0_49bb_1331_11eb);
        z ^ (z >> 31)
    }
    /// Uniform in [0, 1).
    fn unit(&mut self) -> f64 {
        (self.next() >> 11) as f64 / (1u64 << 53) as f64
    }
    pub(crate) fn range(&mut self, low: f64, high: f64) -> f64 {
        low + (high - low) * self.unit()
    }
    pub(crate) fn chance(&mut self, p: f64) -> bool {
        self.unit() < p
    }
}

const GOAL_Y: f64 = 5120.0;
const BALL_Z: f64 = 93.15;
const DEG: f64 = 180.0 / PI;

/// Heading in degrees from one point to another.
fn heading(from: (f64, f64), to: (f64, f64)) -> f64 {
    atan2(to.1 - from.1, to.0 - from.0) * DEG
}
/// A point `distance` away from `from` in direction `degrees`.
fn toward(from: (f64, f64), degrees: f64, distance: f64) -> (f64, f64) {
    let a = degrees / DEG;
    (from.0 + cos(a) * distance, from.1 + sin(a) * distance)
}
/// Keeps a car start inside the field, away from the walls.
fn inside(p: (f64, f64)) -> (f64, f64) {
    (p.0.clamp(-3800.0, 3800.0), p.1.clamp(-4900.0, 4900.0))
}
fn r(x: f64) -> i64 {
    x.round() as i64
}
fn car(team: &str, p: (f64, f64), yaw: f64, speed: f64, boost: f64) -> String {
    let yaw = (yaw.rem_euclid(360.0)).round() as i64 % 360;
    format!(
        "car = {team} {} {} {yaw} {} {}\n",
        r(p.0),
        r(p.1),
        r(speed),
        r(boost)
    )
}
fn ball(p: (f64, f64), z: f64) -> String {
    if z == BALL_Z {
        format!("ball = {} {} {BALL_Z}\n", r(p.0), r(p.1))
    } else {
        format!("ball = {} {} {}\n", r(p.0), r(p.1), r(z))
    }
}
/// Half-second steps.
fn half(t: f64) -> f64 {
    (t * 2.0).round() / 2.0
}

pub struct Family {
    pub name: &'static str,
    pub description: &'static str,
    make: fn(&mut Rng) -> String,
}

/// A still ball in the attacking half and a car behind it, roughly facing it.
fn shots(g: &mut Rng) -> String {
    let y = g.range(1000.0, 4300.0);
    let reach = 700.0 + (GOAL_Y - y) * 0.45;
    let b = (g.range(-reach, reach), y);
    let line = heading(b, (0.0, GOAL_Y));
    let d = g.range(700.0, 2200.0);
    let c = inside(toward(b, line + 180.0 + g.range(-50.0, 50.0), d));
    let speed = if g.chance(0.5) {
        0.0
    } else {
        g.range(400.0, 1300.0)
    };
    format!(
        "note = Still ball, car {} away behind it.\nkind = attack\ntime = {}\n{}{}",
        r(d),
        half(2.5 + d / 1400.0),
        ball(b, BALL_Z),
        car("blue", c, heading(c, b) + g.range(-30.0, 30.0), speed, 33.0)
    )
}

/// A still ball and a car at an awkward angle: beside it, past it, or facing away.
fn awkward(g: &mut Rng) -> String {
    let y = g.range(1200.0, 4000.0);
    let b = (g.range(-1800.0, 1800.0), y);
    let goal_side = g.chance(0.4);
    let base = if goal_side { 90.0 } else { 270.0 };
    let c = inside(toward(
        b,
        base + g.range(-80.0, 80.0),
        g.range(800.0, 1800.0),
    ));
    format!(
        "note = Still ball, car {} the ball, facing anywhere.\nkind = attack\ntime = {}\n{}{}",
        if goal_side {
            "between the goal and"
        } else {
            "behind"
        },
        if goal_side { 5.0 } else { 4.0 },
        ball(b, BALL_Z),
        car("blue", c, g.range(0.0, 360.0), 0.0, 33.0)
    )
}

/// A ball rolling or bouncing in the attacking half and a car behind the play.
fn moving(g: &mut Rng) -> String {
    let b = (g.range(-2500.0, 2500.0), g.range(0.0, 3500.0));
    let airborne = g.chance(0.4);
    let z = if airborne {
        g.range(250.0, 900.0)
    } else {
        BALL_Z
    };
    let dir = g.range(0.0, 360.0);
    let v = toward((0.0, 0.0), dir, g.range(300.0, 1100.0));
    let vz = if airborne {
        g.range(-200.0, 400.0)
    } else {
        0.0
    };
    let c = inside(toward(
        b,
        270.0 + g.range(-60.0, 60.0),
        g.range(1000.0, 2200.0),
    ));
    format!(
        "note = Moving ball, car behind the play.\nkind = attack\ntime = 4\n{}ball_vel = {} {} {}\n{}",
        ball(b, z),
        r(v.0),
        r(v.1),
        r(vz),
        car(
            "blue",
            c,
            heading(c, b) + g.range(-20.0, 20.0),
            g.range(0.0, 1000.0),
            50.0
        )
    )
}

/// `shots` against a goalie that holds the goal line.
fn goalie(g: &mut Rng) -> String {
    let y = g.range(1000.0, 3500.0);
    let b = (g.range(-1800.0, 1800.0), y);
    let line = heading(b, (0.0, GOAL_Y));
    let d = g.range(700.0, 1800.0);
    let c = inside(toward(b, line + 180.0 + g.range(-40.0, 40.0), d));
    format!(
        "note = Still ball against a goalie.\nkind = attack\ntime = {}\n{}{}{}rival = scripted mode=goalie\n",
        half(3.0 + d / 1400.0),
        ball(b, BALL_Z),
        car("blue", c, heading(c, b) + g.range(-20.0, 20.0), 0.0, 33.0),
        car("orange", (g.range(-300.0, 300.0), 5000.0), 270.0, 0.0, 33.0)
    )
}

/// A shot at blue's goal from the defensive half, with the car in or near the goal.
fn saves(g: &mut Rng) -> String {
    let b = (g.range(-2500.0, 2500.0), g.range(-3800.0, -1200.0));
    let target = (g.range(-750.0, 750.0), -GOAL_Y);
    let airborne = g.chance(0.3);
    let z = if airborne {
        g.range(200.0, 500.0)
    } else {
        BALL_Z
    };
    let speed = g.range(1300.0, 2300.0);
    let v = toward((0.0, 0.0), heading(b, target), speed);
    let vz = if airborne { g.range(100.0, 450.0) } else { 0.0 };
    let (c, place) = match g.next() % 3 {
        0 => ((g.range(-600.0, 600.0), -5000.0), "in goal"),
        1 => (
            (
                if g.chance(0.5) { -1.0 } else { 1.0 } * g.range(1000.0, 1800.0),
                g.range(-4900.0, -4200.0),
            ),
            "beside the goal",
        ),
        _ => (
            inside(toward(
                target,
                heading(target, b) + g.range(-35.0, 35.0),
                g.range(700.0, 1500.0),
            )),
            "in front of the goal",
        ),
    };
    format!(
        "note = Shot at {} on goal, car {place}.\nkind = defend\ntime = 3\n{}ball_vel = {} {} {}\n{}",
        r(speed),
        ball(b, z),
        r(v.0),
        r(v.1),
        r(vz),
        car("blue", c, heading(c, b) + g.range(-30.0, 30.0), 0.0, 33.0)
    )
}

/// A slow ball rolling at blue's goal with the car behind the play, driving back.
fn chase_back(g: &mut Rng) -> String {
    let b = (g.range(-1500.0, 1500.0), g.range(-3000.0, -1000.0));
    let target = (g.range(-600.0, 600.0), -GOAL_Y);
    let v = toward((0.0, 0.0), heading(b, target), g.range(900.0, 1400.0));
    let c = inside(toward(
        b,
        90.0 + g.range(-45.0, 45.0),
        g.range(600.0, 1800.0),
    ));
    format!(
        "note = Ball rolling at the goal, car behind the play.\nkind = defend\ntime = 4\n{}ball_vel = {} {} 0\n{}",
        ball(b, BALL_Z),
        r(v.0),
        r(v.1),
        car(
            "blue",
            c,
            270.0 + g.range(-30.0, 30.0),
            g.range(500.0, 1400.0),
            50.0
        )
    )
}

/// A chasing rival drives the ball at blue's goal; blue starts in or near the goal.
fn breakaways(g: &mut Rng) -> String {
    let b = (g.range(-2000.0, 2000.0), g.range(-3500.0, -1500.0));
    let o = inside(toward(
        b,
        90.0 + g.range(-40.0, 40.0),
        g.range(800.0, 1600.0),
    ));
    let boost = g.chance(0.3);
    let c = (g.range(-700.0, 700.0), g.range(-5000.0, -4300.0));
    format!(
        "note = A {} rival drives the ball at the goal.\nkind = defend\ntime = 4\n{}{}{}rival = scripted mode=chase{}\n",
        if boost { "boosting" } else { "driving" },
        ball(b, BALL_Z),
        car("blue", c, heading(c, b), 0.0, 33.0),
        car("orange", o, heading(o, b), g.range(0.0, 800.0), 100.0),
        if boost { " boost=true" } else { "" }
    )
}

/// A loose ball in blue's box, a rival coming for it, and blue anywhere nearby.
fn scrambles(g: &mut Rng) -> String {
    let b = (g.range(-1800.0, 1800.0), g.range(-4600.0, -3300.0));
    let o = inside(toward(
        b,
        90.0 + g.range(-50.0, 50.0),
        g.range(1200.0, 2400.0),
    ));
    let c = inside(toward(b, g.range(0.0, 360.0), g.range(700.0, 1600.0)));
    format!(
        "note = Loose ball in the box, rival coming.\nkind = defend\ntime = 4\n{}{}{}rival = scripted mode=chase\n",
        ball(b, BALL_Z),
        car("blue", c, g.range(0.0, 360.0), g.range(0.0, 900.0), 33.0),
        car("orange", o, heading(o, b), 0.0, 33.0)
    )
}

pub const FAMILIES: &[Family] = &[
    Family {
        name: "gen-shots",
        description: "Still ball in the attacking half, car behind it.",
        make: shots,
    },
    Family {
        name: "gen-awkward",
        description: "Still ball, car beside it, past it, or facing away.",
        make: awkward,
    },
    Family {
        name: "gen-moving",
        description: "Rolling or bouncing ball, car behind the play.",
        make: moving,
    },
    Family {
        name: "gen-goalie",
        description: "Still ball against a scripted goalie.",
        make: goalie,
    },
    Family {
        name: "gen-saves",
        description: "Shots at blue's goal, car in or near the goal.",
        make: saves,
    },
    Family {
        name: "gen-chase-back",
        description: "Ball rolling at blue's goal, car behind the play.",
        make: chase_back,
    },
    Family {
        name: "gen-breakaways",
        description: "A scripted rival drives the ball at blue's goal.",
        make: breakaways,
    },
    Family {
        name: "gen-scrambles",
        description: "Loose ball in blue's box with a rival coming.",
        make: scrambles,
    },
];

/// Up to `count` scenarios per family that an idle car fails, as (family, name, text).
pub fn generate(seed: u64, count: usize, threads: usize) -> Vec<(&'static str, String, String)> {
    let idle = BrainSpec::parse("idle", "module = scripted\nmode = idle").expect("idle brain");
    let mut out = Vec::new();
    for (f, family) in FAMILIES.iter().enumerate() {
        let mut g = Rng::new(seed.wrapping_mul(0x1000_0000_01b3).wrapping_add(f as u64));
        // Draw extra candidates for the idle filter and rounded-corner placement limits.
        let candidates: Vec<String> = (0..count * 3)
            .map(|_| (family.make)(&mut g))
            .filter(|text| Scenario::parse(text).is_ok())
            .collect();
        let jobs: Vec<ScenarioJob> = candidates
            .iter()
            .map(|text| ScenarioJob {
                scenario: Scenario::parse(text)
                    .unwrap_or_else(|e| panic!("{}: {e}\n{text}", family.name)),
                brain: idle.clone(),
            })
            .collect();
        let mut trivial = vec![false; jobs.len()];
        harness::run_scenarios(&jobs, threads, |i, o| trivial[i] = o.success);
        for (text, _) in candidates
            .into_iter()
            .zip(trivial)
            .filter(|(_, t)| !t)
            .take(count)
        {
            let n = out
                .iter()
                .filter(|(name, _, _)| *name == family.name)
                .count()
                + 1;
            out.push((family.name, format!("{n:03}"), text));
        }
    }
    out
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn holdout_skips_starts_outside_the_rounded_field() {
        // This seed previously placed an awkward-start car at (-2994, 4900).
        let scenarios = generate(400792678, 200, 4);
        assert_eq!(scenarios.len(), FAMILIES.len() * 200);
        for (_, _, text) in scenarios {
            assert!(Scenario::parse(&text).is_ok());
        }
    }
}
