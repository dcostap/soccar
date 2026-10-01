use soccar_simulation::{
    ball::{Ball, COLLISION_RADIUS},
    car::{Car, Controls},
    vector::Vec3,
    world::{BOOST_PICKUP, DEMO, RESPAWN, World, car_car},
};
fn bits(v: Vec3) -> [u64; 3] {
    [v.x.to_bits(), v.y.to_bits(), v.z.to_bits()]
}

#[test]
fn ball_floor_contact_preserves_restitution_and_collision_radius() {
    let mut b = Ball::default();
    b.pos.z = 90.0;
    b.vel.z = -1200.0;
    assert_eq!(b.collide_world(), 1200.0);
    assert_eq!(b.last_world_hit_speed, 1200.0);
    assert_eq!(b.pos.z, COLLISION_RADIUS);
    assert_eq!(b.vel.z, 720.0);
}
#[test]
fn ball_speed_limits_apply_to_linear_and_angular_motion() {
    let mut b = Ball {
        vel: Vec3::new(12000.0, 0.0, 0.0),
        ang_vel: Vec3::new(0.0, -12.0, 0.0),
        ..Ball::default()
    };
    b.clamp_velocities();
    assert_eq!(bits(b.vel), bits(Vec3::new(6000.0, 0.0, 0.0)));
    assert_eq!(bits(b.ang_vel), bits(Vec3::new(0.0, -6.0, 0.0)));
}
#[test]
fn a_frozen_car_does_not_drive_boost_or_jump() {
    let mut w = World::default();
    w.ball.frozen = true;
    let id = w.add_car(0);
    w.cars[id].frozen = true;
    w.cars[id].controls = Controls {
        throttle: 1.0,
        boost: true,
        jump: true,
        ..Controls::default()
    };
    let pos = w.cars[id].pos;
    let boost = w.cars[id].boost;
    for _ in 0..120 {
        w.step();
    }
    assert_eq!(bits(w.cars[id].pos), bits(pos));
    assert_eq!(w.cars[id].boost, boost);
    assert!(!w.cars[id].has_jumped);
    assert_eq!(bits(w.cars[id].vel), bits(Vec3::default()));
}
#[test]
fn a_small_boost_pad_fills_boost_and_starts_its_cooldown() {
    let mut w = World::default();
    w.ball.frozen = true;
    let id = w.add_car(0);
    let p = w.pads[0].pos;
    w.cars[id].spawn(p.x, p.y, 0.0, 0.0);
    w.step();
    assert_eq!(w.cars[id].boost, 12.0);
    assert_eq!(w.pads[0].cooldown, 4.0);
    assert!(
        w.events
            .iter()
            .any(|e| e.kind == BOOST_PICKUP && e.car == id as i32 && e.pad == 0)
    );
}
#[test]
fn an_opponent_can_demolish_a_car_with_a_supersonic_front_hit() {
    let mut a = Car::new(0, 0);
    let mut b = Car::new(1, 1);
    b.pos.x = 100.0;
    a.vel.x = 2300.0;
    a.is_supersonic = true;
    let mut events = Vec::new();
    car_car(&mut a, &mut b, &mut events);
    assert!(b.is_demoed);
    assert_eq!(b.demo_respawn_timer, 3.0);
    assert!(
        events
            .iter()
            .any(|e| e.kind == DEMO && e.car == 0 && e.other == 1)
    );
}
#[test]
fn a_demolished_car_respawns_and_emits_an_event() {
    let mut w = World::default();
    w.ball.frozen = true;
    let id = w.add_car(0);
    w.cars[id].demolish();
    for _ in 0..400 {
        w.step();
        if !w.cars[id].is_demoed {
            break;
        }
    }
    assert!(!w.cars[id].is_demoed);
    assert_eq!(w.cars[id].pos.z, 36.0);
    assert_eq!(w.cars[id].boost, 100.0 / 3.0);
    assert!(
        w.events
            .iter()
            .any(|e| e.kind == RESPAWN && e.car == id as i32)
    );
}
