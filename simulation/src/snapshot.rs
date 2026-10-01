use crate::{bot::Maneuver, game::Game};
use crate::{
    car::{Car, Controls},
    vector::Vec3,
    world::World,
};
fn v(out: &mut Vec<f64>, x: Vec3) {
    out.extend([x.x, x.y, x.z]);
}
pub fn controls(out: &mut Vec<f64>, c: Controls) {
    out.extend([
        c.throttle,
        c.steer,
        c.pitch,
        c.yaw,
        c.roll,
        c.jump as u8 as f64,
        c.boost as u8 as f64,
        c.handbrake as u8 as f64,
        c.dodge_mag.unwrap_or(-1.0),
    ]);
}
pub fn car(out: &mut Vec<f64>, c: &Car) {
    out.extend([c.id as f64, c.team as f64]);
    v(out, c.pos);
    v(out, c.vel);
    v(out, c.ang_vel);
    out.extend([c.rot.x, c.rot.y, c.rot.z, c.rot.w]);
    out.extend(c.mat.values);
    v(out, c.forward);
    v(out, c.left);
    v(out, c.up);
    out.extend([c.mass, c.boost, c.dodge_deadzone]);
    controls(out, c.controls);
    controls(out, c.last_controls);
    out.extend([
        c.num_wheels_in_contact as f64,
        c.is_on_ground as u8 as f64,
        c.has_jumped as u8 as f64,
        c.is_jumping as u8 as f64,
        c.jump_time,
        c.has_double_jumped as u8 as f64,
        c.has_flipped as u8 as f64,
        c.is_flipping as u8 as f64,
        c.flip_time,
        c.flip_roll,
        c.flip_pitch,
        c.air_time,
        c.air_time_since_jump,
        c.handbrake_val,
        c.is_boosting as u8 as f64,
        c.boosting_time,
        c.is_supersonic as u8 as f64,
        c.supersonic_time,
        c.is_auto_flipping as u8 as f64,
        c.auto_flip_timer,
        c.auto_flip_torque_scale,
        c.world_contact as u8 as f64,
    ]);
    v(out, c.world_normal);
    out.extend([
        c.is_demoed as u8 as f64,
        c.demo_respawn_timer,
        c.frozen as u8 as f64,
    ]);
    v(out, c.vel_impulse_cache);
    out.push(c.bump_cooldowns.len() as f64);
    for &(id, time) in &c.bump_cooldowns {
        out.extend([id as f64, time]);
    }
    out.extend([
        c.last_extra_ball_hit_tick as f64,
        c.last_ball_touch_tick as f64,
        c.events.jumped as u8 as f64,
        c.events.double_jumped as u8 as f64,
        c.events.flipped as u8 as f64,
        c.events.landed as u8 as f64,
        c.events.ball_hit,
    ]);
    for w in &c.wheels {
        out.push(w.front as u8 as f64);
        v(out, w.local);
        out.extend([
            w.radius,
            w.rest_length,
            w.force_scale,
            w.in_contact as u8 as f64,
            w.on_ball as u8 as f64,
        ]);
        v(out, w.contact_point);
        v(out, w.contact_normal);
        out.extend([
            w.suspension_length,
            w.trace_length,
            w.steer_angle,
            w.spin,
            w.visual_length,
            w.lat_friction,
            w.long_friction,
        ]);
    }
}
pub fn world(w: &World) -> Vec<f64> {
    let mut out = Vec::with_capacity(1600);
    out.extend([
        w.tick as f64,
        w.goals_enabled as u8 as f64,
        w.goal_scored.map_or(-1.0, |v| v as f64),
        w.last_touch.map_or(-1.0, |v| v as f64),
        w.ball_touched as u8 as f64,
        w.respawn_roll as f64,
    ]);
    out.extend(w.ball.trace());
    out.push(w.cars.len() as f64);
    for c in &w.cars {
        car(&mut out, c);
    }
    out.push(w.pads.len() as f64);
    for p in &w.pads {
        v(&mut out, p.pos);
        out.extend([p.big as u8 as f64, p.cooldown]);
    }
    out.push(w.events.len() as f64);
    for e in &w.events {
        out.extend([
            e.kind as f64,
            e.car as f64,
            e.other as f64,
            e.team as f64,
            e.pad as f64,
        ]);
        v(&mut out, e.position);
        out.extend([e.strength, e.last_touch as f64]);
    }
    out
}
pub fn game(g: &Game) -> Vec<f64> {
    let mut out = world(&g.world);
    out.extend([
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
        g.goal_prediction.map_or(-1.0, |v| v as f64),
        g.random.state as f64,
    ]);
    out.push(g.stats.len() as f64);
    for s in &g.stats {
        out.extend([
            s.score as f64,
            s.goals as f64,
            s.assists as f64,
            s.shots as f64,
            s.saves as f64,
        ]);
    }
    out.push(g.last_touches.len() as f64);
    for &(id, tick) in &g.last_touches {
        out.extend([id as f64, tick as f64]);
    }
    out.extend(g.predict_ball.trace());
    out.push(g.predictor.last_tick as f64);
    out.extend(g.predictor.sim.trace());
    out.push(g.predictor.slices.len() as f64);
    for s in &g.predictor.slices {
        out.push(s.t);
        v(&mut out, s.pos);
        v(&mut out, s.vel);
    }
    out.push(g.bots.len() as f64);
    for b in &g.bots {
        out.extend([b.car as f64, b.skill.number() as f64, b.reaction_timer]);
        v(&mut out, b.target);
        out.extend([b.kickoff_flip_done as u8 as f64, b.support as u8 as f64]);
        controls(&mut out, b.out);
        match b.maneuver {
            Maneuver::None => out.push(0.0),
            Maneuver::Flip { t, pitch, yaw } => out.extend([1.0, t, pitch, yaw]),
            Maneuver::Aerial { t, target, arrive } => {
                out.extend([2.0, t]);
                v(&mut out, target);
                out.push(arrive);
            }
        }
    }
    out
}

/// Browser state, including labels and presentation events.
pub fn view(g: &Game) -> Vec<f64> {
    let mut out = world(&g.world);
    out.extend([
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
    out.push(g.names.len() as f64);
    out.extend(g.names.iter().map(|&x| x as f64));
    out.push(g.stats.len() as f64);
    for s in &g.stats {
        out.extend([
            s.score as f64,
            s.goals as f64,
            s.assists as f64,
            s.shots as f64,
            s.saves as f64,
        ]);
    }
    out.push(g.notifications.len() as f64);
    for e2 in &g.notifications {
        out.extend([
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
    out
}
