use soccar_simulation::{DT, car::Car, vector::Vec3};

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
