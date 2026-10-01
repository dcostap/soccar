use soccar_simulation::{
    car::Controls,
    game::{Config, Game, Phase},
    random::Random,
    world::{GOAL, World},
};

#[test]
fn random_draws_match_the_javascript_integer_generator() {
    let mut r = Random::new(1);
    assert_eq!(r.next_f64(), 1015568748.0 / 4294967296.0);
    assert_eq!(r.next_f64(), 1586005467.0 / 4294967296.0);
}

fn expired_game(score: [u32; 2]) -> Game {
    let mut g = Game::new(1);
    g.start_match(Config {
        duration: 1.0 / 120.0,
        ..Config::default()
    });
    g.drivers.clear();
    g.phase = Phase::Playing;
    for c in &mut g.world.cars {
        c.frozen = false;
    }
    g.world.ball.frozen = false;
    g.world.ball_touched = true;
    g.score = score;
    g.tick(Controls::default());
    g
}

#[test]
fn a_tied_expired_clock_starts_overtime() {
    let g = expired_game([0, 0]);
    assert!(g.overtime);
    assert_eq!(g.clock, 0.0);
    assert_eq!(g.phase, Phase::Countdown);
    assert!(g.world.ball.frozen);
}

#[test]
fn an_untied_expired_clock_ends_after_ground_contact() {
    let mut g = expired_game([1, 0]);
    assert_eq!(g.phase, Phase::Ended);
    let tick = g.world.tick;
    g.tick(Controls::default());
    assert_eq!(g.world.tick, tick);
}

#[test]
fn disabled_goals_do_not_emit_a_goal() {
    let mut w = World {
        goals_enabled: false,
        ..World::default()
    };
    w.ball.pos.y = 5500.0;
    w.step();
    assert!(w.goal_scored.is_none());
    assert!(!w.events.iter().any(|e| e.kind == GOAL));
}

#[test]
fn a_zero_duration_match_has_no_clock_expiry() {
    let mut g = Game::new(1);
    g.start_match(Config {
        duration: 0.0,
        ..Config::default()
    });
    g.phase = Phase::Playing;
    g.world.ball.frozen = false;
    g.world.ball_touched = true;
    g.score = [1, 0];
    for _ in 0..10 {
        g.tick(Controls::default());
    }
    assert_eq!(g.phase, Phase::Playing);
    assert_eq!(g.clock, 0.0);
}

#[test]
fn scene_commands_do_not_change_a_match_outside_their_mode() {
    let mut g = Game::new(1);
    g.start_match(Config {
        player_team: 0,
        ..Config::default()
    });
    let before = soccar_simulation::snapshot::game(&g);
    for op in 1..=4 {
        g.command(op, 0.0);
    }
    let after = soccar_simulation::snapshot::game(&g);
    assert_eq!(
        before.iter().map(|v| v.to_bits()).collect::<Vec<_>>(),
        after.iter().map(|v| v.to_bits()).collect::<Vec<_>>()
    );
}
