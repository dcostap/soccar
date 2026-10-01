//! Reused predictions must equal predictions computed from scratch, bit for bit.
use soccar_simulation::{
    ball::Ball,
    car::Controls,
    game::{Config, Game},
    predictor::Predictor,
};
fn bits(b: &Ball) -> Vec<u64> {
    b.trace().map(f64::to_bits).to_vec()
}
fn match_game() -> Game {
    let mut game = Game::new(4242);
    game.skip_replays = true;
    game.start_match(Config {
        team_size: 3,
        player_team: -1,
        ..Config::default()
    });
    game
}

#[test]
fn reused_ball_predictions_match_fresh_predictions() {
    let mut game = match_game();
    let mut reused = Predictor::default();
    for _ in 0..3000 {
        reused.update(&game.world);
        if reused.last_tick == game.world.tick {
            let mut fresh = Predictor::default();
            fresh.update(&game.world);
            assert_eq!(bits(&reused.sim), bits(&fresh.sim));
            assert_eq!(reused.slices.len(), fresh.slices.len());
            for (a, b) in reused.slices.iter().zip(&fresh.slices) {
                let values = |s: &soccar_simulation::predictor::Slice| {
                    [s.t, s.pos.x, s.pos.y, s.pos.z, s.vel.x, s.vel.y, s.vel.z].map(f64::to_bits)
                };
                assert_eq!(values(a), values(b), "tick {}", game.world.tick);
            }
        }
        game.tick(Controls::default());
    }
}

#[test]
fn reused_goal_predictions_match_fresh_predictions() {
    let mut game = match_game();
    for _ in 0..3000 {
        game.tick(Controls::default());
        let mut fresh = Game::new(0);
        fresh.world = game.world.clone();
        let expected = fresh.predict_goal();
        assert_eq!(game.predict_goal(), expected, "tick {}", game.world.tick);
        assert_eq!(bits(&game.predict_ball), bits(&fresh.predict_ball));
    }
}
