use soccar_simulation::{
    brains::{BrainSpec, Skill},
    harness::{ScenarioJob, run_scenario, start_scenario},
    scenario::{Kind, Scenario},
};

const OPEN_GOAL: &str = "kind = attack
time = 3
ball = 0 3800 93.15
car = blue 0 2400 90 0 33   # facing the open goal
";
const ROLLING_IN: &str = "kind = defend
time = 3
ball = 300 -3000 93.15
ball_vel = 0 -1200 0
car = blue 1500 -1500 180 0 33
car = orange 0 0 90 0 33
rival = scripted mode=chase
";

fn idle() -> BrainSpec {
    BrainSpec::parse("idle", "module = scripted\nmode = idle").unwrap()
}
fn job(text: &str, brain: BrainSpec) -> ScenarioJob {
    ScenarioJob {
        scenario: Scenario::parse(text).unwrap(),
        brain,
    }
}

#[test]
fn text_form_round_trips() {
    let a = Scenario::parse(ROLLING_IN).unwrap();
    let b = Scenario::parse(&a.text()).unwrap();
    assert_eq!(a.text(), b.text());
    assert_eq!(a.kind, Kind::Defend);
    assert_eq!(a.cars.len(), 2);
    assert_eq!(a.rival.module, "scripted");
}

#[test]
fn bad_text_is_rejected() {
    assert!(Scenario::parse("time = 3\ncar = blue 0 0 90 0 33").is_err());
    assert!(Scenario::parse("kind = attack").is_err());
    assert!(Scenario::parse("kind = attack\ncar = green 0 0 90 0 33").is_err());
    assert!(
        Scenario::parse("kind = attack\ncar = blue 0 0 90 0 33\nrival = scripted mode=dance")
            .is_err()
    );
    assert!(Scenario::parse("kind = attack\ncar = blue 0 0 90 0 33\nwind = 3").is_err());
    // Inside a rounded corner, behind a goal line, and a ball under the floor.
    assert!(Scenario::parse("kind = attack\ncar = blue 3900 4950 90 0 33").is_err());
    assert!(Scenario::parse("kind = attack\ncar = blue 0 7000 90 0 33").is_err());
    assert!(Scenario::parse("kind = attack\nball = 0 0 20\ncar = blue 0 0 90 0 33").is_err());
}

#[test]
fn a_bot_scores_an_open_goal_and_an_idle_car_does_not() {
    let scored = run_scenario(&job(OPEN_GOAL, BrainSpec::preset(Skill::Allstar)));
    assert!(scored.success, "{scored:?}");
    assert_eq!(scored.goal, Some(0));
    assert_eq!(scored.credit, 1.0);
    assert!(scored.touches > 0);
    let missed = run_scenario(&job(OPEN_GOAL, idle()));
    assert!(!missed.success);
    assert_eq!(missed.goal, None);
    assert_eq!(missed.credit, 0.0);
    // Time runs out, then the resting ball counts as landed.
    assert!((missed.seconds - 3.0).abs() < 0.02, "{missed:?}");
}

#[test]
fn an_idle_defender_concedes_a_rolling_ball() {
    // The ball crosses the line just after the time runs out. A ball heading in may finish.
    let outcome = run_scenario(&job(ROLLING_IN, idle()));
    assert_eq!(outcome.goal, Some(1));
    assert!(!outcome.success);
    assert_eq!(outcome.credit, 0.0);
}

#[test]
fn set_pieces_are_deterministic() {
    let j = job(ROLLING_IN, BrainSpec::preset(Skill::Pro));
    let a = run_scenario(&j);
    let b = run_scenario(&j);
    assert_eq!(a, b);
    let mut g1 = start_scenario(&j);
    let mut g2 = start_scenario(&j);
    while g1.outcome.is_none() {
        g1.tick(Default::default());
        g2.tick(Default::default());
        assert_eq!(g1.world.ball.pos.x.to_bits(), g2.world.ball.pos.x.to_bits());
    }
}

#[test]
fn set_pieces_start_without_kickoff_and_with_moving_cars() {
    let g = start_scenario(&job(
        "kind = attack\nball = 0 0 300\nball_vel = 0 500 0\ncar = blue 0 -2000 90 1000 50",
        idle(),
    ));
    assert!(g.world.ball_touched);
    assert!(!g.world.ball.frozen);
    let car = &g.world.cars[0];
    assert!(!car.frozen);
    assert!(
        (car.vel.y - 1000.0).abs() < 1e-6 && car.vel.x.abs() < 1e-6,
        "{:?}",
        car.vel
    );
    assert_eq!(car.boost, 50.0);
    assert_eq!(g.world.ball.vel.y, 500.0);
}

#[test]
fn captured_moments_turn_the_tested_team_into_blue() {
    use soccar_simulation::harness::{MatchSpec, start};
    let mut game = start(&MatchSpec {
        team_size: 2,
        ..MatchSpec::default()
    });
    for _ in 0..1200 {
        game.tick(Default::default());
    }
    let blue = Scenario::capture(&game, 0, Kind::Attack, 3.0);
    let orange = Scenario::capture(&game, 1, Kind::Defend, 3.0);
    assert_eq!(blue.cars.len(), 4);
    assert_eq!(blue.cars.iter().filter(|c| c.team == 0).count(), 2);
    let ball = game.world.ball.pos;
    assert_eq!(blue.ball_pos.x, ball.x.round());
    assert_eq!(orange.ball_pos.x, (-ball.x).round());
    assert_eq!(orange.ball_pos.y, (-ball.y).round());
    // Orange's first car becomes the first blue car, turned half a circle.
    let car = &game.world.cars[2];
    let turned = &orange.cars[0];
    assert_eq!(turned.team, 0);
    if soccar_simulation::scenario::fits(-car.pos.x, -car.pos.y) {
        assert_eq!(turned.x, (-car.pos.x).round());
    }
    let yaw = |c: &soccar_simulation::scenario::CarStart| c.yaw;
    let difference = (yaw(turned) - yaw(&blue.cars[2])).rem_euclid(360.0);
    assert!((difference - 180.0).abs() < 0.2, "{difference}");
    let mut back = blue.mirrored();
    back.kind = Kind::Defend;
    assert_eq!(back.text(), orange.text());
    assert_eq!(blue.mirrored().mirrored().text(), blue.text());
    // The text form is exact.
    for s in [&blue, &orange] {
        assert_eq!(Scenario::parse(&s.text()).unwrap().text(), s.text());
        run_scenario(&ScenarioJob {
            scenario: s.clone(),
            brain: BrainSpec::preset(Skill::Pro),
        });
    }
}
