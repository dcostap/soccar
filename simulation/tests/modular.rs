use soccar_simulation::{
    brains::{BrainSpec, Skill},
    harness::{self, MatchSpec, ScenarioJob},
    scenario::Scenario,
    snapshot,
};

fn spec(name: &str, text: &str) -> BrainSpec {
    BrainSpec::parse(name, text).unwrap()
}

fn alphabravo() -> BrainSpec {
    spec("alphabravo", "module = alphabravo\nshotzone = 5000")
}

fn bits(values: Vec<f64>) -> Vec<u64> {
    assert!(values.iter().all(|v| v.is_finite()));
    values.into_iter().map(f64::to_bits).collect()
}

/// Plays two matches that differ only in one team's brain and compares the world on every tick.
fn same_world(size: usize, side: usize, brain: BrainSpec, ticks: usize) {
    let start = |b: BrainSpec| {
        let mut brains = [BrainSpec::preset(Skill::Allstar), b];
        brains.swap(1, side);
        harness::start(&MatchSpec {
            seed: 4242 + size as u32,
            team_size: size,
            brains,
            ..MatchSpec::default()
        })
    };
    let mut a = start(alphabravo());
    let mut b = start(brain);
    for tick in 0..ticks {
        a.tick(Default::default());
        b.tick(Default::default());
        assert_eq!(
            bits(snapshot::world(&a.world)),
            bits(snapshot::world(&b.world)),
            "size {size}, side {side}, tick {tick}"
        );
    }
    assert_eq!(a.score, b.score);
}

#[test]
fn without_skills_it_drives_exactly_as_alphabravo() {
    for size in 1..=3 {
        for side in 0..2 {
            same_world(size, side, spec("modular", "module = modular"), 6000);
        }
    }
}

#[test]
fn a_skill_that_never_claims_changes_nothing() {
    same_world(
        3,
        0,
        spec("modular-template", "module = modular\nskills = template"),
        4000,
    );
}

#[test]
fn set_pieces_match_alphabravo() {
    let scenarios = [
        "kind = attack\ntime = 3\nball = 0 3800 93.15\ncar = blue 0 2400 90 0 33",
        "kind = defend\ntime = 4\nball = 300 -2000 93.15\nball_vel = 0 -1100 0\ncar = blue 0 -500 270 1000 50",
        "kind = defend\ntime = 5\nball = -1500 -1500 600\nball_vel = 400 -1300 500\ncar = blue 0 -4800 90 0 100",
        "kind = attack\ntime = 4\nball = -1500 2500 93.15\ncar = blue -1500 800 90 0 33\ncar = orange 0 5000 270 0 33\nrival = scripted mode=goalie",
    ];
    for text in scenarios {
        let scenario = Scenario::parse(text).unwrap();
        let outcome = |brain| {
            harness::run_scenario(&ScenarioJob {
                scenario: scenario.clone(),
                brain,
            })
        };
        assert_eq!(
            outcome(alphabravo()),
            outcome(spec("modular", "module = modular")),
            "{text}"
        );
    }
}

#[test]
fn an_enabled_skill_plays_and_checkpoints_exactly() {
    let brain = spec(
        "modular-template",
        "module = modular\nskills = template\ntemplate.enabled = true\ntemplate.height = 400",
    );
    let mut a = harness::start(&MatchSpec {
        seed: 99,
        team_size: 2,
        brains: [brain.clone(), BrainSpec::preset(Skill::Allstar)],
        duration: 30.0,
        ..MatchSpec::default()
    });
    for _ in 0..1500 {
        a.tick(Default::default());
    }
    let mut b = a.clone();
    for _ in 0..1500 {
        a.tick(Default::default());
        b.tick(Default::default());
        assert_eq!(bits(snapshot::game(&a)), bits(snapshot::game(&b)));
    }
}

#[test]
fn settings_are_checked() {
    assert!(BrainSpec::parse("x", "module = modular\nskills = nothing").is_err());
    assert!(BrainSpec::parse("x", "module = modular\nskills = template, template").is_err());
    assert!(BrainSpec::parse("x", "module = modular\ntemplate.enabled = true").is_err());
    assert!(
        BrainSpec::parse("x", "module = modular\nskills = template\ntemplate.bad = 1").is_err()
    );
    assert!(
        BrainSpec::parse(
            "x",
            "module = modular\nskills = template\ntemplate.enabled = true"
        )
        .is_ok()
    );
}

#[test]
fn the_fingerprint_source_covers_the_core_and_selected_skills_only() {
    let plain = spec("modular", "module = modular").source();
    let with = spec("modular", "module = modular\nskills = template").source();
    let template = soccar_simulation::brains::modular::skills::find("template")
        .unwrap()
        .source;
    assert!(plain.contains("pub struct Tactics"));
    assert!(plain.contains("pub trait Skill"));
    assert!(!plain.contains(template));
    assert!(with.starts_with(&plain));
    assert!(with.ends_with(template));
    // Other modules keep their exact source.
    assert_eq!(
        alphabravo().source(),
        soccar_simulation::brains::module("alphabravo")
            .unwrap()
            .source
    );
}

#[test]
fn the_aerial_skill_saves_a_falling_shot_that_the_baseline_concedes() {
    // defense-v2-falling/center-lead-in-mouth-001: a dropping shot over a reversing defender.
    let scenario = Scenario::parse(
        "kind = defend\ntime = 5\nseed = 1\nball = -1448 -2449 114\nball_vel = 440 -793 1278\n\
         ball_spin = 0 0 2\ncar = blue 266 -4751 127 -700 33\nrival = scripted mode=idle",
    )
    .unwrap();
    let outcome = |brain| {
        harness::run_scenario(&ScenarioJob {
            scenario: scenario.clone(),
            brain,
        })
    };
    assert!(!outcome(spec("modular", "module = modular")).success);
    let aerial = spec("modular-aerial-a", "module = modular\nskills = aerial-a");
    let result = outcome(aerial);
    assert!(result.success, "{result:?}");
}
