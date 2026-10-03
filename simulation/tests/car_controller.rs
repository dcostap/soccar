use soccar_simulation::{DT, car::Car, rotation::Quat, vector::Vec3};

#[test]
fn powerslide_state_matches_reference_rates_at_several_speeds() {
    for speed in [0.0, 500.0, 1500.0, 2200.0] {
        let mut car = Car::new(0, 0);
        car.pos = Vec3::new(0.0, 0.0, 1000.0);
        car.vel.x = speed;
        car.is_on_ground = false;
        car.controls.handbrake = true;
        for tick in 1..=30 {
            car.pre_step(DT, None);
            let expected = (5.0 * tick as f64 * DT).min(1.0);
            assert!((car.handbrake_val - expected).abs() < 1e-12);
        }
        car.controls.handbrake = false;
        for tick in 1..=70 {
            car.pre_step(DT, None);
            let expected = (1.0 - 2.0 * tick as f64 * DT).max(0.0);
            assert!((car.handbrake_val - expected).abs() < 1e-12);
        }
    }
}

fn airborne_car() -> Car {
    let mut car = Car::new(0, 0);
    car.pos = Vec3::new(0.0, 0.0, 400.0);
    car.is_on_ground = false;
    car.num_wheels_in_contact = 0;
    car.has_jumped = true;
    car
}

#[test]
fn air_torque_runs_before_a_new_flip() {
    let mut car = airborne_car();
    car.controls.jump = true;
    car.controls.pitch = 1.0;
    car.controls.dodge_mag = Some(1.0);
    car.pre_step(DT, None);

    let expected = -130.0 * ((2.0 * std::f64::consts::PI) / 65536.0) * 1000.0 * DT;
    assert!((car.ang_vel.y - expected).abs() < 1e-12);
    assert!(car.is_flipping);
}

#[test]
fn auto_flip_uses_the_source_roll_sign_and_blocks_a_double_jump() {
    let mut car = airborne_car();
    car.rot = Quat::euler(0.0, 0.0, 3.0);
    car.update_axes();
    car.world_contact = true;
    car.world_normal = Vec3::new(0.0, 0.0, 1.0);
    car.controls.jump = true;
    car.pre_step(DT, None);

    assert!(car.is_auto_flipping);
    assert!(car.auto_flip_torque_scale < 0.0);
    assert!(!car.has_double_jumped);
    assert!(!car.has_flipped);

    let before = car.ang_vel.dot(car.forward);
    car.controls.jump = false;
    car.controls.roll = 1.0;
    car.pre_step(DT, None);
    let after = car.ang_vel.dot(car.forward);
    assert!((after - before + 50.0 * DT).abs() < 1e-12);

    car.auto_flip_timer = -1.0;
    car.pre_step(DT, None);
    assert!(!car.is_auto_flipping);
    assert_eq!(car.auto_flip_timer.to_bits(), 0.0_f64.to_bits());
}

#[test]
fn auto_roll_requires_throttle() {
    for (throttle, expected_z) in [(0.0, -650.0 * DT), (1.0, -750.0 * DT)] {
        let mut car = airborne_car();
        car.rot = Quat::euler(0.0, 0.0, 1.0);
        car.update_axes();
        car.world_contact = true;
        car.world_normal = Vec3::new(0.0, 0.0, 1.0);
        car.controls.throttle = throttle;
        car.pre_step(DT, None);
        assert!((car.vel.z - expected_z).abs() < 1e-12);
    }
}
