use soccar_simulation::{
    brains::{BrainSpec, Skill},
    harness::{self, MatchSpec, ScenarioJob},
    scenario::Scenario,
    snapshot,
};

fn brain() -> BrainSpec {
    BrainSpec::parse("alphabravo", "module = alphabravo").unwrap()
}

#[test]
fn fingerprint_source_includes_the_shared_flight_controller() {
    let source = soccar_simulation::brains::module("alphabravo")
        .unwrap()
        .source;
    let alpha = soccar_simulation::brains::module("alpha").unwrap().source;
    assert!(source.ends_with(alpha));
    assert!(source.len() > alpha.len());
}

fn bits(values: Vec<f64>) -> Vec<u64> {
    assert!(values.iter().all(|v| v.is_finite()));
    values.into_iter().map(f64::to_bits).collect()
}

#[test]
fn checkpoints_keep_full_state_for_all_team_sizes_and_both_sides() {
    for size in 1..=3 {
        for side in 0..2 {
            let mut brains = [BrainSpec::preset(Skill::Allstar), brain()];
            brains.swap(1, side);
            let mut a = harness::start(&MatchSpec {
                seed: 81427,
                team_size: size,
                brains,
                duration: 30.0,
                ..MatchSpec::default()
            });
            for _ in 0..1600 {
                a.tick(Default::default());
            }
            let mut b = a.clone();
            for _ in 0..500 {
                a.tick(Default::default());
                b.tick(Default::default());
                assert_eq!(bits(snapshot::game(&a)), bits(snapshot::game(&b)));
            }
        }
    }
}

#[test]
fn scores_a_straight_open_goal() {
    let outcome = harness::run_scenario(&ScenarioJob {
        scenario: Scenario::parse(
            "kind = attack\ntime = 3\nball = 0 3800 93.15\ncar = blue 0 2400 90 0 33",
        )
        .unwrap(),
        brain: brain(),
    });
    assert!(outcome.success, "{outcome:?}");
    assert_eq!(outcome.goal, Some(0));
}

#[test]
fn no_cars_and_unknown_settings_are_safe() {
    let mut controller = brain().create(0, &[]).unwrap();
    let world = Default::default();
    let predictor = Default::default();
    controller.tick(
        &soccar_simulation::brains::Context {
            world: &world,
            predictor: &predictor,
            player: None,
        },
        &mut [],
    );
    controller.reset();
    assert!(BrainSpec::parse("bad", "module = alphabravo\nunknown = 1").is_err());
}

#[test]
fn does_not_drive_a_still_ball_into_its_own_goal() {
    for (ball_y, car_y) in [(2800, 4200), (-4200, -2000)] {
        let scenario = Scenario::parse(&format!(
            "kind = defend\ntime = 5\nball = 0 {ball_y} 93.15\ncar = blue 0 {car_y} 270 0 33"
        ))
        .unwrap();
        let outcome = harness::run_scenario(&ScenarioJob {
            scenario,
            brain: brain(),
        });
        assert_ne!(outcome.goal, Some(1), "{outcome:?}");
    }
}

#[test]
fn frozen_and_demolished_cars_have_no_controls() {
    let mut game = harness::start(&MatchSpec {
        team_size: 3,
        brains: [brain(), brain()],
        ..MatchSpec::default()
    });
    for _ in 0..1000 {
        game.tick(Default::default());
    }
    game.world.cars[0].is_demoed = true;
    game.world.cars[1].frozen = true;
    let mut predictor = soccar_simulation::predictor::Predictor::default();
    predictor.update(&game.world);
    let mut controller = brain().create(0, &[0, 1]).unwrap();
    let mut out = [soccar_simulation::car::Controls::default(); 2];
    controller.tick(
        &soccar_simulation::brains::Context {
            world: &game.world,
            predictor: &predictor,
            player: Some(2),
        },
        &mut out,
    );
    let mut expected = Vec::new();
    snapshot::controls(&mut expected, Default::default());
    for controls in &out[..2] {
        let mut values = Vec::new();
        snapshot::controls(&mut values, *controls);
        assert_eq!(bits(values), bits(expected.clone()));
    }
}

#[test]
fn parallel_scenarios_keep_the_same_outcomes() {
    let jobs: Vec<_> = (0..8).map(|i| ScenarioJob {
        scenario: Scenario::parse(&format!(
            "kind = defend\ntime = 4\nball = {} -2000 93.15\nball_vel = 0 -1100 0\ncar = blue 0 -500 270 1000 50", i * 100
        )).unwrap(),
        brain: brain(),
    }).collect();
    let mut serial = vec![None; jobs.len()];
    let mut parallel = vec![None; jobs.len()];
    harness::run_scenarios(&jobs, 1, |i, result| serial[i] = Some(result));
    harness::run_scenarios(&jobs, 4, |i, result| parallel[i] = Some(result));
    assert_eq!(serial, parallel);
}

#[test]
fn a_recovery_checkpoint_continues_exactly() {
    let scenario = Scenario::parse("kind = defend\ntime = 4\nball = 0 -2000 93.15\nball_vel = 0 -1100 0\ncar = blue 0 -500 270 1000 50").unwrap();
    let mut a = harness::start_scenario(&ScenarioJob {
        scenario,
        brain: brain(),
    });
    for _ in 0..40 {
        a.tick(Default::default());
    }
    let mut b = a.clone();
    while a.outcome.is_none() {
        a.tick(Default::default());
        b.tick(Default::default());
        assert_eq!(bits(snapshot::game(&a)), bits(snapshot::game(&b)));
    }
    assert_eq!(a.outcome, b.outcome);
}
