//! Nexto, the deep-RL Rocket League bot by Rolv, Soren, and several contributors, running its published
//! policy network. Source: https://github.com/Rolv-Arild/Necto (`rlbot-support/Nexto`), licensed
//! CC BY-NC-SA 4.0. The weights in `model.bin` come from that repository's `nexto-model.pt`.
//!
//! This module ports Nexto's RLBot runner: `nexto_obs.py` builds the observation, the network picks
//! one of 90 lookup-table actions every 8 ticks (always the most likely one), and a fixed speed-flip
//! sequence takes the kickoff. Nexto uses Rocket League's control signs; Soccar's steer, yaw, and roll
//! are reversed, so actions are converted at the end.
//!
//! Settings: `kickoff = true` uses the scripted kickoff, as the RLBot runner does.
mod model;

use super::{Brain, Context, Params};
use crate::{
    car::{Car, Controls},
    math::{atan2, cos, sin},
    vector::Vec3,
    world::{PADS, World},
};
use model::{ENTITY, Model, QUERY};

/// Hash of the weights, added to the arena fingerprint.
pub fn extra_source(_: &super::BrainSpec) -> String {
    let mut hash: u64 = 0xcbf29ce484222325;
    for &b in include_bytes!("model.bin") {
        hash = (hash ^ b as u64).wrapping_mul(0x100000001b3);
    }
    format!("\nmodel.bin fnv1a64 {hash:016x}\n")
}
pub const SOURCE: &str = concat!(include_str!("mod.rs"), "\n", include_str!("model.rs"));

const TICK_SKIP: u32 = 8;

/// Nexto's scripted kickoff, one action per tick, in Rocket League's control signs.
fn kickoff_action(tick: usize) -> Option<[f64; 8]> {
    // [throttle, steer, pitch, yaw, roll, jump, boost, handbrake], each held for `ticks`.
    const STEPS: [(usize, [f64; 8]); 7] = [
        (44, [1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0]),
        (16, [1.0, -1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0]),
        (8, [1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 1.0, 0.0]),
        (4, [1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0]),
        (4, [1.0, 0.0, -0.7, 0.8, 0.0, 1.0, 1.0, 0.0]),
        (52, [1.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0, 0.0]),
        (40, [1.0, 0.0, 0.5, 0.0, 1.0, 0.0, 0.0, 0.0]),
    ];
    let mut start = 0;
    for (ticks, action) in STEPS {
        if tick < start + ticks {
            return Some(action);
        }
        start += ticks;
    }
    None
}

/// What Nexto's observation needs from one car.
#[derive(Clone, Copy, Debug)]
pub struct CarView {
    pub team: usize,
    pub pos: Vec3,
    pub vel: Vec3,
    pub ang_vel: Vec3,
    pub forward: Vec3,
    pub up: Vec3,
    /// Boost from 0 to 1.
    pub boost: f64,
    pub demoed: bool,
    pub on_ground: bool,
    pub has_flip: bool,
}

pub struct BallView {
    pub pos: Vec3,
    pub vel: Vec3,
    pub ang_vel: Vec3,
}

fn flag(b: bool) -> f64 {
    if b { 1.0 } else { 0.0 }
}

/// Builds the query and entity rows exactly as `NextoObsBuilder` does for car `me`.
/// Cars are ordered as the RLBot runner orders them: self, teammates, opponents.
pub fn observe(
    cars: &[CarView],
    me: usize,
    ball: &BallView,
    pads_active: &[bool; 34],
    previous: &[f64; 8],
) -> ([f64; QUERY], Vec<f64>) {
    let team = cars[me].team;
    let order = std::iter::once(me)
        .chain((0..cars.len()).filter(|&j| j != me && cars[j].team == team))
        .chain((0..cars.len()).filter(|&j| cars[j].team != team));
    let mut rows: Vec<[f64; ENTITY]> = Vec::with_capacity(cars.len() + 35);
    let put = |row: &mut [f64; ENTITY], at: usize, v: Vec3| {
        row[at] = v.x;
        row[at + 1] = v.y;
        row[at + 2] = v.z;
    };
    for j in order {
        let c = &cars[j];
        let mut row = [0.0; ENTITY];
        row[0] = flag(j == me);
        row[1] = flag(c.team == team);
        row[2] = flag(c.team != team);
        put(&mut row, 5, c.pos);
        put(&mut row, 8, c.vel);
        put(&mut row, 11, c.forward);
        put(&mut row, 14, c.up);
        put(&mut row, 17, c.ang_vel);
        row[20] = c.boost;
        row[21] = flag(c.demoed);
        row[22] = flag(c.on_ground);
        row[23] = flag(c.has_flip);
        rows.push(row);
    }
    let mut row = [0.0; ENTITY];
    row[3] = 1.0;
    put(&mut row, 5, ball.pos);
    put(&mut row, 8, ball.vel);
    put(&mut row, 17, ball.ang_vel);
    rows.push(row);
    for (&(x, y, big), &active) in PADS.iter().zip(pads_active) {
        let mut row = [0.0; ENTITY];
        row[4] = 1.0;
        put(&mut row, 5, Vec3::new(x, y, if big { 73.0 } else { 70.0 }));
        row[20] = 0.12 + 0.88 * flag(big);
        row[21] = flag(active);
        rows.push(row);
    }
    for row in &mut rows {
        if team == 1 {
            for k in [5, 6, 8, 9, 11, 12, 14, 15, 17, 18] {
                row[k] = -row[k];
            }
        }
        for v in &mut row[5..11] {
            *v /= 2300.0;
        }
        for v in &mut row[17..20] {
            *v /= 5.5;
        }
    }
    let mut query = [0.0; QUERY];
    query[..ENTITY].copy_from_slice(&rows[0]);
    query[ENTITY..].copy_from_slice(previous);
    let theta = atan2(query[11], query[12]);
    let (ct, st) = (cos(theta), sin(theta));
    let mut entities = Vec::with_capacity(rows.len() * ENTITY);
    for row in &mut rows {
        for k in 5..8 {
            row[k] -= query[k];
        }
        for k in [5, 8, 11, 14, 17] {
            let (x, y) = (row[k], row[k + 1]);
            row[k] = ct * x - st * y;
            row[k + 1] = st * x + ct * y;
        }
        entities.extend_from_slice(row);
    }
    (query, entities)
}

/// Converts a Nexto action to Soccar controls.
pub fn controls(a: &[f64; 8]) -> Controls {
    Controls {
        throttle: a[0],
        steer: -a[1],
        pitch: a[2],
        yaw: -a[3],
        roll: -a[4],
        jump: a[5] > 0.0,
        boost: a[6] > 0.0,
        handbrake: a[7] > 0.0,
        dodge_mag: None,
    }
}

/// One controlled car's runner state, as in Nexto's `bot.py`.
#[derive(Clone, Debug)]
struct Runner {
    car: usize,
    ticks: u32,
    update_action: bool,
    /// Last chosen action. It is also the previous action in the next observation.
    action: [f64; 8],
    controls: [f64; 8],
    /// -1: waiting for a kickoff, -2: not taking this kickoff, otherwise ticks into the kickoff.
    kickoff_index: i64,
}
impl Runner {
    fn new(car: usize, slot: usize) -> Self {
        Self {
            car,
            // Stagger decisions across cars so a team does not run every network on one tick.
            ticks: TICK_SKIP - (slot as u32 % TICK_SKIP),
            update_action: true,
            action: [0.0; 8],
            controls: [0.0; 8],
            kickoff_index: -1,
        }
    }
}

#[derive(Clone, Debug)]
struct Nexto {
    runners: Vec<Runner>,
    scripted_kickoff: bool,
    /// Ticks since each car last had wheel contact, as `rlgym_compat` tracks for `on_ground`.
    off_ground: Vec<u32>,
    model: &'static ModelRef,
}

/// Debug wrapper so the brain can derive `Debug`.
struct ModelRef(&'static Model);
impl std::fmt::Debug for ModelRef {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        f.write_str("Nexto model")
    }
}

pub fn create(params: &mut Params, _: usize, cars: &[usize]) -> Result<Box<dyn Brain>, String> {
    static MODEL: std::sync::OnceLock<ModelRef> = std::sync::OnceLock::new();
    let scripted_kickoff = params.flag("kickoff", true)?;
    Ok(Box::new(Nexto {
        runners: cars
            .iter()
            .enumerate()
            .map(|(slot, &car)| Runner::new(car, slot))
            .collect(),
        scripted_kickoff,
        off_ground: Vec::new(),
        model: MODEL.get_or_init(|| ModelRef(Model::get())),
    }))
}

fn view(car: &Car, off_ground: u32) -> CarView {
    CarView {
        team: car.team,
        pos: car.pos,
        vel: car.vel,
        ang_vel: car.ang_vel,
        forward: car.forward,
        up: car.up,
        boost: car.boost / 100.0,
        demoed: car.is_demoed,
        on_ground: car.num_wheels_in_contact > 0 || off_ground <= 6,
        has_flip: !(car.has_double_jumped || car.has_flipped),
    }
}

impl Nexto {
    fn decide(&self, world: &World, me: usize, previous: &[f64; 8]) -> [f64; 8] {
        let cars: Vec<CarView> = world
            .cars
            .iter()
            .zip(&self.off_ground)
            .map(|(c, &t)| view(c, t))
            .collect();
        let ball = BallView {
            pos: world.ball.pos,
            vel: world.ball.vel,
            ang_vel: world.ball.ang_vel,
        };
        let mut pads = [false; 34];
        for (p, pad) in pads.iter_mut().zip(&world.pads) {
            *p = pad.cooldown <= 0.0;
        }
        let (query, entities) = observe(&cars, me, &ball, &pads, previous);
        let logits = self.model.0.logits(&query, &entities);
        self.model.0.table[model::argmax(&logits)]
    }

    /// Picks the kickoff taker as `bot.py` does: the closest car, and the left one of a tied pair.
    fn takes_kickoff(world: &World, me: usize) -> bool {
        let ball = world.ball.pos;
        let distance = |c: &Car| ((c.pos.x - ball.x).powi(2) + (c.pos.y - ball.y).powi(2)).sqrt();
        let mine = distance(&world.cars[me]);
        let min = world
            .cars
            .iter()
            .map(distance)
            .fold(f64::INFINITY, f64::min);
        if (min - mine).abs() > 10.0 {
            return false;
        }
        let team = world.cars[me].team;
        world.cars.iter().enumerate().all(|(j, c)| {
            if j == me || c.team != team || (distance(c) - mine).abs() > 10.0 {
                return true;
            }
            if team == 0 {
                c.pos.x < world.cars[me].pos.x
            } else {
                c.pos.x > world.cars[me].pos.x
            }
        })
    }
}

impl Brain for Nexto {
    fn tick(&mut self, ctx: &Context, out: &mut [Controls]) {
        let world = ctx.world;
        self.off_ground.resize(world.cars.len(), 0);
        for (t, car) in self.off_ground.iter_mut().zip(&world.cars) {
            *t = if car.num_wheels_in_contact > 0 {
                0
            } else {
                *t + 1
            };
        }
        // Rocket League's kickoff pause: the round is live and the ball still waits at center.
        let kickoff_pause = !world.ball_touched
            && !world.ball.frozen
            && world.ball.pos.x == 0.0
            && world.ball.pos.y == 0.0;
        for (i, slot) in out.iter_mut().enumerate().take(self.runners.len()) {
            let mut r = self.runners[i].clone();
            let me = r.car;
            r.ticks += 1;
            if r.update_action {
                r.update_action = false;
                r.action = self.decide(world, me, &r.action);
            }
            if r.ticks >= TICK_SKIP - 1 {
                r.controls = r.action;
            }
            if r.ticks >= TICK_SKIP {
                r.ticks = 0;
                r.update_action = true;
            }
            if self.scripted_kickoff {
                if kickoff_pause {
                    if r.kickoff_index >= 0 {
                        r.kickoff_index += 1;
                    } else if r.kickoff_index == -1 {
                        r.kickoff_index = if Self::takes_kickoff(world, me) {
                            0
                        } else {
                            -2
                        };
                    }
                    if r.kickoff_index >= 0
                        && let Some(action) = kickoff_action(r.kickoff_index as usize)
                    {
                        r.action = action;
                        r.controls = action;
                    }
                } else {
                    r.kickoff_index = -1;
                }
            }
            *slot = controls(&r.controls);
            self.runners[i] = r;
        }
    }
    fn reset(&mut self) {
        for r in &mut self.runners {
            r.kickoff_index = -1;
        }
    }
    fn trace(&self, out: &mut Vec<f64>) {
        for r in &self.runners {
            out.push(r.ticks as f64);
            out.push(r.kickoff_index as f64);
            out.extend_from_slice(&r.action);
            out.extend_from_slice(&r.controls);
        }
    }
    fn clone_box(&self) -> Box<dyn Brain> {
        Box::new(self.clone())
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use serde_json::Value;

    fn vec3(v: &Value) -> Vec3 {
        Vec3::new(
            v[0].as_f64().unwrap(),
            v[1].as_f64().unwrap(),
            v[2].as_f64().unwrap(),
        )
    }

    /// Compares with Nexto's own observation builder and a float64 reference of its network.
    #[test]
    fn matches_reference_vectors() {
        let data: Value = serde_json::from_str(include_str!("vectors.json")).unwrap();
        let model = Model::get();
        let mut observers = 0;
        for case in data["cases"].as_array().unwrap() {
            let state = &case["state"];
            let cars: Vec<CarView> = state["players"]
                .as_array()
                .unwrap()
                .iter()
                .map(|p| CarView {
                    team: p["team"].as_u64().unwrap() as usize,
                    pos: vec3(&p["pos"]),
                    vel: vec3(&p["vel"]),
                    ang_vel: vec3(&p["ang_vel"]),
                    forward: vec3(&p["forward"]),
                    up: vec3(&p["up"]),
                    boost: p["boost"].as_f64().unwrap(),
                    demoed: p["demoed"].as_bool().unwrap(),
                    on_ground: p["on_ground"].as_bool().unwrap(),
                    has_flip: p["has_flip"].as_bool().unwrap(),
                })
                .collect();
            let b = &state["ball"];
            let ball = BallView {
                pos: vec3(&b["pos"]),
                vel: vec3(&b["vel"]),
                ang_vel: vec3(&b["ang_vel"]),
            };
            let mut pads = [false; 34];
            for (p, v) in pads.iter_mut().zip(state["pads"].as_array().unwrap()) {
                *p = v.as_f64().unwrap() > 0.5;
            }
            for (me, expected) in case["observers"].as_array().unwrap().iter().enumerate() {
                let mut previous = [0.0; 8];
                for (p, v) in previous
                    .iter_mut()
                    .zip(expected["previous_action"].as_array().unwrap())
                {
                    *p = v.as_f64().unwrap();
                }
                let (query, entities) = observe(&cars, me, &ball, &pads, &previous);
                for (a, e) in query.iter().zip(expected["q"].as_array().unwrap()) {
                    assert!((a - e.as_f64().unwrap()).abs() < 1e-9, "query {a} vs {e}");
                }
                // Nexto lists cars in packet order; this module lists self, teammates, opponents.
                // Attention ignores entity order, so compare rows as sets.
                let kv: Vec<Vec<f64>> = expected["kv"]
                    .as_array()
                    .unwrap()
                    .iter()
                    .map(|r| {
                        r.as_array()
                            .unwrap()
                            .iter()
                            .map(|v| v.as_f64().unwrap())
                            .collect()
                    })
                    .collect();
                for row in entities.chunks_exact(ENTITY) {
                    assert!(
                        kv.iter()
                            .any(|k| k.iter().zip(row).all(|(a, b)| (a - b).abs() < 1e-9)),
                        "entity row not found"
                    );
                }
                assert_eq!(entities.len(), kv.len() * ENTITY);
                let logits = model.logits(&query, &entities);
                for (a, e) in logits.iter().zip(expected["logits"].as_array().unwrap()) {
                    assert!((a - e.as_f64().unwrap()).abs() < 1e-8, "logit {a} vs {e}");
                }
                assert_eq!(
                    model::argmax(&logits),
                    expected["action"].as_u64().unwrap() as usize
                );
                observers += 1;
            }
        }
        assert_eq!(observers, 28);
    }

    #[test]
    fn pads_match_nexto_locations() {
        // Nexto's BOOST_LOCATIONS, which keeps the same asymmetric pad as Soccar.
        assert_eq!(PADS[27], (-940.0, 3310.0, false));
        assert_eq!(PADS.iter().filter(|p| p.2).count(), 6);
    }

    #[test]
    fn kickoff_sequence_has_rlbot_length() {
        assert!(kickoff_action(167).is_some());
        assert!(kickoff_action(168).is_none());
    }
}
