//! Narrow browser ABI. Each handle owns one independent simulation.
use crate::{
    DT, arena,
    brains::{BrainSpec, Skill},
    car::Controls,
    car::{Car, HALF, OFFSET},
    game::{Config, Game},
    snapshot,
    vector::Vec3,
    world::PADS,
};
// Startup geometry comes from the same definitions that the simulation uses.
#[unsafe(no_mangle)]
pub extern "C" fn sim_geometry_value(index: u32) -> f64 {
    let car = Car::new(0, 0);
    let f = car.wheels[0];
    let b = car.wheels[2];
    let values = [
        DT,
        arena::HALF_WIDTH,
        arena::HALF_LENGTH,
        arena::HEIGHT,
        arena::FIELD_DIAGONAL,
        arena::GOAL_HEIGHT,
        arena::GOAL_LINE,
        crate::ball::PHYSICAL_RADIUS,
        crate::ball::COLLISION_RADIUS,
        HALF.x * 2.0,
        HALF.y * 2.0,
        HALF.z * 2.0,
        OFFSET.x,
        OFFSET.y,
        OFFSET.z,
        f.local.x,
        f.local.y,
        f.radius,
        b.local.x,
        b.local.y,
        b.radius,
        PADS.len() as f64,
        arena::floor_extent(),
    ];
    let index = index as usize;
    if index < values.len() {
        return values[index];
    }
    let offset = index - values.len();
    if let Some(&(x, y, big)) = PADS.get(offset / 3) {
        match offset % 3 {
            0 => x,
            1 => y,
            _ => big as u8 as f64,
        }
    } else {
        f64::NAN
    }
}
#[unsafe(no_mangle)]
pub extern "C" fn sim_arena_query(kind: u32, x: f64, y: f64, z: f64) -> f64 {
    let p = Vec3::new(x, y, z);
    match kind {
        0 => arena::distance(p),
        1 => arena::normal(p).x,
        2 => arena::normal(p).y,
        3 => arena::normal(p).z,
        4 => arena::ramp_radius(x),
        5 => arena::goal_distance(x.abs(), y.abs(), z),
        6 => arena::floor_height(y),
        _ => f64::NAN,
    }
}
struct Engine {
    game: Game,
    view: Vec<f64>,
    /// Brains for the next match, overriding the skill preset per team.
    brains: [Option<BrainSpec>; 2],
    /// Text written by JavaScript, read by `sim_brain`.
    text: Vec<u8>,
}
fn engine<'a>(handle: usize) -> &'a mut Engine {
    unsafe { &mut *(handle as *mut Engine) }
}
#[unsafe(no_mangle)]
pub extern "C" fn sim_create(seed: u32) -> usize {
    Box::into_raw(Box::new(Engine {
        game: Game::new(seed),
        view: Vec::new(),
        brains: [None, None],
        text: Vec::new(),
    })) as usize
}
#[unsafe(no_mangle)]
pub extern "C" fn sim_destroy(handle: usize) {
    if handle != 0 {
        unsafe {
            drop(Box::from_raw(handle as *mut Engine));
        }
    }
}
/// Copies all match state, including brains, prediction caches, and random state.
/// The caller owns the returned handle and must destroy it.
#[unsafe(no_mangle)]
pub extern "C" fn sim_clone(handle: usize) -> usize {
    let e = engine(handle);
    Box::into_raw(Box::new(Engine {
        game: e.game.clone(),
        view: Vec::new(),
        brains: e.brains.clone(),
        text: Vec::new(),
    })) as usize
}
/// Restores a checkpoint without consuming it or changing the destination handle.
#[unsafe(no_mangle)]
pub extern "C" fn sim_restore(handle: usize, checkpoint: usize) {
    if handle == checkpoint {
        return;
    }
    let saved = engine(checkpoint);
    let game = saved.game.clone();
    let brains = saved.brains.clone();
    let e = engine(handle);
    e.game = game;
    e.brains = brains;
    e.view.clear();
}
#[unsafe(no_mangle)]
pub extern "C" fn sim_start(
    handle: usize,
    mode: u32,
    size: u32,
    skill: u32,
    player: i32,
    duration: f64,
    dodge: f64,
) -> u32 {
    if handle == 0
        || !(1..=3).contains(&size)
        || !duration.is_finite()
        || duration < 0.0
        || !dodge.is_finite()
    {
        return 0;
    }
    let e = engine(handle);
    e.game.config.dodge_deadzone = dodge;
    match mode {
        0 => e.game.start_menu(),
        1 => e.game.start_freeplay(),
        2 => e.game.start_match(Config {
            team_size: size as usize,
            brains: [0, 1].map(|team| {
                e.brains[team]
                    .clone()
                    .unwrap_or_else(|| BrainSpec::preset(Skill::from_number(skill)))
            }),
            player_team: player,
            duration,
            dodge_deadzone: dodge,
        }),
        _ => return 0,
    }
    1
}
#[unsafe(no_mangle)]
pub extern "C" fn sim_tick(
    handle: usize,
    throttle: f64,
    steer: f64,
    pitch: f64,
    yaw: f64,
    roll: f64,
    jump: u32,
    boost: u32,
    handbrake: u32,
    dodge: f64,
) {
    let e = engine(handle);
    e.game.tick(Controls {
        throttle,
        steer,
        pitch,
        yaw,
        roll,
        jump: jump != 0,
        boost: boost != 0,
        handbrake: handbrake != 0,
        dodge_mag: if dodge < 0.0 { None } else { Some(dodge) },
    });
}
#[unsafe(no_mangle)]
pub extern "C" fn sim_command(handle: usize, command: u32, value: f64) {
    engine(handle).game.command(command, value);
}
#[unsafe(no_mangle)]
pub extern "C" fn sim_state(handle: usize) -> usize {
    let e = engine(handle);
    e.view = snapshot::view(&e.game);
    e.view.as_ptr() as usize
}
#[unsafe(no_mangle)]
pub extern "C" fn sim_state_len(handle: usize) -> usize {
    engine(handle).view.len()
}
// Full hidden state for native/WASM consistency tests. Rendering uses sim_state instead.
#[unsafe(no_mangle)]
pub extern "C" fn sim_trace(handle: usize) -> usize {
    let e = engine(handle);
    e.view = snapshot::game(&e.game);
    e.view.as_ptr() as usize
}
/// Returns a buffer of `len` bytes for JavaScript to fill before `sim_brain`.
#[unsafe(no_mangle)]
pub extern "C" fn sim_text(handle: usize, len: usize) -> usize {
    let e = engine(handle);
    e.text.clear();
    e.text.resize(len, 0);
    e.text.as_mut_ptr() as usize
}
/// Sets the brain for `team` in later matches from the `.brain` text in the text buffer.
/// Empty text restores the skill preset. Returns 0 when the text is invalid.
#[unsafe(no_mangle)]
pub extern "C" fn sim_brain(handle: usize, team: u32) -> u32 {
    let e = engine(handle);
    let Some(slot) = e.brains.get_mut(team as usize) else {
        return 0;
    };
    let Ok(text) = std::str::from_utf8(&e.text) else {
        return 0;
    };
    if text.trim().is_empty() {
        *slot = None;
        return 1;
    }
    match BrainSpec::parse("custom", text) {
        Ok(spec) => {
            *slot = Some(spec);
            1
        }
        Err(_) => 0,
    }
}
/// Starts a set piece from the scenario text in the text buffer. Blue plays the team-zero brain set by
/// `sim_brain`, or the allstar preset. Returns 0 when the text is invalid.
#[unsafe(no_mangle)]
pub extern "C" fn sim_scenario(handle: usize, dodge: f64) -> u32 {
    let e = engine(handle);
    let Ok(text) = std::str::from_utf8(&e.text) else {
        return 0;
    };
    let Ok(scenario) = crate::scenario::Scenario::parse(text) else {
        return 0;
    };
    let brain = e.brains[0]
        .clone()
        .unwrap_or_else(|| BrainSpec::preset(Skill::Allstar));
    e.game.config.dodge_deadzone = dodge;
    e.game.start_scenario(&scenario, &brain);
    1
}
/// Writes the current moment as set piece text into the text buffer and returns its length in bytes.
/// `team` becomes blue, the side under test. `kind` is 0 for attack and 1 for defend.
#[unsafe(no_mangle)]
pub extern "C" fn sim_capture(handle: usize, team: u32, kind: u32, time: f64) -> usize {
    use crate::scenario::{Kind, Scenario};
    let e = engine(handle);
    let kind = if kind == 1 {
        Kind::Defend
    } else {
        Kind::Attack
    };
    let scenario = Scenario::capture(&e.game, (team as usize).min(1), kind, time);
    e.text = scenario.text().into_bytes();
    e.text.len()
}
/// Address of the text buffer, for reading what `sim_capture` wrote.
#[unsafe(no_mangle)]
pub extern "C" fn sim_text_pointer(handle: usize) -> usize {
    engine(handle).text.as_ptr() as usize
}

fn text_result(e: &mut Engine, result: Result<String, String>) -> i32 {
    match result {
        Ok(text) => {
            e.text = text.into_bytes();
            e.text.len() as i32
        }
        Err(error) => {
            e.text = error.into_bytes();
            -1
        }
    }
}
#[unsafe(no_mangle)]
pub extern "C" fn sim_record_begin(handle: usize) {
    engine(handle).game.begin_recording();
}
#[unsafe(no_mangle)]
pub extern "C" fn sim_record_export(handle: usize) -> i32 {
    let e = engine(handle);
    let result = e
        .game
        .recording
        .as_ref()
        .ok_or("No live recording".to_string())
        .and_then(|r| r.text());
    text_result(e, result)
}
#[unsafe(no_mangle)]
pub extern "C" fn sim_text_len(handle: usize) -> usize {
    engine(handle).text.len()
}
#[unsafe(no_mangle)]
pub extern "C" fn sim_record_load(handle: usize) -> i32 {
    let e = engine(handle);
    let result = std::str::from_utf8(&e.text)
        .map_err(|e| e.to_string())
        .and_then(crate::recording::Replay::parse);
    match result {
        Ok(replay) => {
            e.game = replay.start();
            e.text.clear();
            e.text.shrink_to_fit();
            1
        }
        Err(error) => {
            e.text = error.into_bytes();
            -1
        }
    }
}
#[unsafe(no_mangle)]
pub extern "C" fn sim_record_length(handle: usize) -> usize {
    engine(handle)
        .game
        .playback
        .as_ref()
        .filter(|p| !p.scenario)
        .map_or(0, |p| p.frames.len())
}
#[unsafe(no_mangle)]
pub extern "C" fn sim_record_count(handle: usize) -> usize {
    engine(handle)
        .game
        .recording
        .as_ref()
        .map_or(0, |r| r.frames.len())
}
#[unsafe(no_mangle)]
pub extern "C" fn sim_clip_export(
    handle: usize,
    car: usize,
    kind: u32,
    time: f64,
    mode: u32,
) -> i32 {
    let e = engine(handle);
    let others = match mode {
        0 => Ok(None),
        1..=4 => BrainSpec::parse(
            "fixed",
            &format!(
                "module = scripted\nmode = {}",
                ["idle", "chase", "goalie", "throttle"][mode as usize - 1]
            ),
        )
        .map(Some),
        _ => Err("Invalid other-car controller".into()),
    };
    let result = others
        .and_then(|others| {
            crate::scenario::Scenario::capture_car(
                &e.game,
                car,
                if kind == 1 {
                    crate::scenario::Kind::Defend
                } else {
                    crate::scenario::Kind::Attack
                },
                time,
                others,
            )
        })
        .map(|s| s.text());
    text_result(e, result)
}
