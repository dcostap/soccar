//! Narrow browser ABI. Each handle owns one independent simulation.
use crate::{
    DT, arena,
    bot::Skill,
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
}
fn engine<'a>(handle: usize) -> &'a mut Engine {
    unsafe { &mut *(handle as *mut Engine) }
}
#[unsafe(no_mangle)]
pub extern "C" fn sim_create(seed: u32) -> usize {
    Box::into_raw(Box::new(Engine {
        game: Game::new(seed),
        view: Vec::new(),
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
            skill: Skill::from_number(skill),
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
