use soccar_simulation::{car::Car, vector::Vec3, world::car_car};

#[test]
fn level_side_contact_uses_the_low_manifold_response() {
    let mut attacker = Car::new(0, 0);
    attacker.pos = Vec3::new(-120.0, 0.0, 1000.0);
    attacker.vel.x = 800.0;
    attacker.is_on_ground = false;

    let mut victim = Car::new(1, 1);
    victim.pos = Vec3::new(0.0, 0.0, 1000.0);
    victim.is_on_ground = false;

    car_car(&mut attacker, &mut victim, &mut Vec::new());

    assert!((victim.vel.x - 439.3311778755433).abs() < 1e-9);
    assert!((victim.ang_vel.y - 0.46920069062881026).abs() < 1e-9);
    assert!((attacker.ang_vel.y + victim.ang_vel.y).abs() < 1e-12);
}
