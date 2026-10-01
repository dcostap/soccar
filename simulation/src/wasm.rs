//! Narrow browser ABI. Each handle owns one independent simulation.
use crate::{
    bot::Skill,
    car::Controls,
    game::{Config, Game},
    snapshot,
};
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
    let g = &mut engine(handle).game;
    match command {
        1 => g.reset_freeplay(),
        2 => g.place_ball(false),
        3 => g.place_ball(true),
        4 => {
            g.notifications.clear();
            g.end_replay();
        }
        5 => g.unlimited_boost = value != 0.0,
        6 => {
            if let Some(p) = g.player {
                g.world.cars[p].dodge_deadzone = value;
            }
        }
        _ => {}
    }
}
#[unsafe(no_mangle)]
pub extern "C" fn sim_state(handle: usize) -> usize {
    let e = engine(handle);
    e.view = snapshot::world(&e.game.world);
    let g = &e.game;
    e.view.extend([
        g.mode.number() as f64,
        g.phase.number() as f64,
        g.player.map_or(-1.0, |v| v as f64),
        g.score[0] as f64,
        g.score[1] as f64,
        g.clock,
        g.overtime as u8 as f64,
        g.phase_timer,
        g.countdown_shown as f64,
        g.waiting_for_ground as u8 as f64,
        g.unlimited_boost as u8 as f64,
        g.ball_rot.x,
        g.ball_rot.y,
        g.ball_rot.z,
        g.ball_rot.w,
        g.replay_length as f64,
        g.replay_idx as f64,
        g.replay_end as f64,
        g.replay_scorer as f64,
        g.end_after_replay as u8 as f64,
        g.last_goal_team as f64,
        g.freeplay_goal_timer,
    ]);
    e.view.push(g.names.len() as f64);
    e.view.extend(g.names.iter().map(|&x| x as f64));
    e.view.push(g.stats.len() as f64);
    for s in &g.stats {
        e.view.extend([
            s.score as f64,
            s.goals as f64,
            s.assists as f64,
            s.shots as f64,
            s.saves as f64,
        ]);
    }
    e.view.push(g.notifications.len() as f64);
    for e2 in &g.notifications {
        e.view.extend([
            e2.kind as f64,
            e2.car as f64,
            e2.other as f64,
            e2.team as f64,
            e2.pad as f64,
            e2.position.x,
            e2.position.y,
            e2.position.z,
            e2.strength,
            e2.last_touch as f64,
        ]);
    }
    e.view.as_ptr() as usize
}
#[unsafe(no_mangle)]
pub extern "C" fn sim_state_len(handle: usize) -> usize {
    engine(handle).view.len()
}
// Full hidden state for parity tests. The browser renderer uses sim_state instead.
#[unsafe(no_mangle)]
pub extern "C" fn sim_trace(handle: usize) -> usize {
    let e = engine(handle);
    e.view = snapshot::game(&e.game);
    e.view.as_ptr() as usize
}
