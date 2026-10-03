use soccar_simulation::{
    brains::{BrainSpec, Skill},
    car::Controls,
    game::{Config, Game, Phase},
    recording::{Clip, Replay},
    scenario::{Kind, Scenario},
    snapshot,
};

fn bits(v: Vec<f64>) -> Vec<u64> {
    v.into_iter().map(f64::to_bits).collect()
}

fn legacy_fixture() -> serde_json::Value {
    // Captured with commit cb2b138. Keep the recording and old-engine hashes fixed.
    serde_json::from_str(include_str!("legacy-save-recording.json")).unwrap()
}

fn state_hash(game: &Game) -> String {
    let mut state = snapshot::game(game);
    // The old engine had no scoring-version field. Check that field, then compare every old field.
    assert_eq!(state.pop(), Some(1.0));
    let mut hash = 0xcbf29ce484222325_u64;
    for value in state {
        for byte in value.to_bits().to_le_bytes() {
            hash = (hash ^ byte as u64).wrapping_mul(0x100000001b3);
        }
    }
    format!("{hash:016x}")
}

#[test]
fn the_previous_engine_replays_every_state_and_its_original_save_event() {
    // The previous engine generated this fixture and its hashes before the save update.
    let fixture = legacy_fixture();
    let replay = Replay::parse(&fixture["recording"].to_string()).unwrap();
    let mut live = replay.initial.clone();
    live.tick(Controls::default());
    assert_eq!(live.stats[0].saves, 0);
    let mut replay = replay.start();
    for (tick, expected) in fixture["stateHashes"]
        .as_array()
        .unwrap()
        .iter()
        .enumerate()
    {
        if tick > 0 {
            replay.tick(Controls::default());
        }
        assert_eq!(
            state_hash(&replay),
            expected.as_str().unwrap(),
            "tick {tick}"
        );
    }
    assert_eq!(replay.stats[0].saves, 1);
    assert_eq!(replay.stats[0].score, 50);
}

#[test]
fn recording_and_capturing_an_old_replay_keep_its_scoring_version() {
    let fixture = legacy_fixture();
    let recording = &fixture["recording"];
    let mut replay = Replay::parse(&recording.to_string()).unwrap().start();
    replay.begin_recording();
    replay.tick(Controls::default());
    let saved = replay.recording.as_ref().unwrap().text().unwrap();
    let saved = Replay::parse(&saved).unwrap();
    assert_eq!(saved.engine, recording["engine"].as_str().unwrap());
    let mut saved = saved.start();
    saved.tick(Controls::default());
    let mut expected = replay.clone();
    expected.playback = None;
    expected.recording = None;
    saved.playback = None;
    assert_eq!(
        bits(snapshot::game(&saved)),
        bits(snapshot::game(&expected))
    );

    let idle = BrainSpec::parse("idle", "module = scripted\nmode = idle").unwrap();
    let scenario =
        Scenario::capture_car(&replay, 0, Kind::Defend, 1.0, Some(idle.clone())).unwrap();
    let scenario = Scenario::parse(&scenario.text()).unwrap();
    assert_eq!(
        scenario.clip.as_ref().unwrap().engine,
        recording["engine"].as_str().unwrap()
    );
    let mut captured = Game::new(1);
    captured.start_scenario(&scenario, &idle);
    assert!(captured.playback.as_ref().unwrap().legacy_saves);
}

#[test]
fn old_recordings_still_check_their_format_and_control_values() {
    let mut fixture = legacy_fixture();
    fixture["recording"]["format"] = 2.into();
    assert!(Replay::parse(&fixture["recording"].to_string()).is_err());
    let mut fixture = legacy_fixture();
    fixture["recording"]["frames"][0]["cars"][0][0] = 2.0.into();
    assert!(Replay::parse(&fixture["recording"].to_string()).is_err());
}

#[test]
fn the_first_save_update_build_keeps_contact_based_saves() {
    let mut recording = legacy_fixture()["recording"].clone();
    recording["engine"] = "88f27cd63490dfc3".into();
    let mut replay = Replay::parse(&recording.to_string()).unwrap().start();
    assert!(!replay.playback.as_ref().unwrap().legacy_saves);
    replay.tick(Controls::default());
    assert_eq!(replay.stats[0].saves, 0);
    assert_eq!(replay.stats[0].score, 0);
}

fn human(t: usize) -> Controls {
    Controls {
        throttle: 1.0,
        steer: if t % 300 < 150 { 0.2 } else { -0.4 },
        boost: t % 400 < 200,
        jump: t % 180 >= 150,
        pitch: -0.3,
        yaw: 0.2,
        ..Controls::default()
    }
}
fn start(size: usize, team: i32) -> Game {
    let mut g = Game::new(12345);
    // Keep the same menu-to-match predictor cache as the browser.
    g.start_menu();
    for _ in 0..100 {
        g.tick(Controls::default());
    }
    g.start_match(Config {
        team_size: size,
        player_team: team,
        duration: 15.0,
        brains: [
            BrainSpec::preset(Skill::Allstar),
            BrainSpec::preset(Skill::Allstar),
        ],
        ..Config::default()
    });
    g.begin_recording();
    g
}

#[test]
fn player_and_bot_controls_replay_exactly_for_all_sizes_and_sides() {
    for size in 1..=3 {
        for team in 0..2 {
            let mut g = start(size, team);
            let mut states = Vec::new();
            for t in 0..1800 {
                if t == 650 {
                    g.command(5, 1.0);
                    g.command(6, 0.7);
                }
                if t == 900 {
                    g.command(5, 0.0);
                }
                if g.phase == Phase::Replay {
                    g.command(4, 0.0);
                }
                g.tick(human(t));
                states.push((
                    bits(snapshot::world(&g.world)),
                    g.random.state,
                    g.score,
                    g.stats.clone(),
                ));
            }
            let text = g.recording.as_ref().unwrap().text().unwrap();
            let mut replay = Replay::parse(&text).unwrap().start();
            for (state, random, score, stats) in states {
                replay.tick(Controls::default());
                assert_eq!(bits(snapshot::world(&replay.world)), state);
                assert_eq!(replay.random.state, random);
                assert_eq!(replay.score, score);
                for (a, b) in replay.stats.iter().zip(stats) {
                    assert_eq!(
                        (a.score, a.goals, a.assists, a.shots, a.saves),
                        (b.score, b.goals, b.assists, b.shots, b.saves)
                    );
                }
            }
        }
    }
}

#[test]
fn exact_capture_keeps_airborne_state_and_changes_only_one_controller() {
    let mut g = start(3, 0);
    for t in 0..700 {
        g.tick(human(t));
    }
    let text = g.recording.as_ref().unwrap().text().unwrap();
    let mut r = Replay::parse(&text).unwrap().start();
    for _ in 0..400 {
        r.tick(Controls::default());
    }
    // Enough future samples must exist for the timeout and finishing wait.
    let s = Scenario::capture_car(&r, 0, Kind::Defend, 0.5, None);
    assert!(s.is_err());
    let mut g = start(3, 0);
    for t in 0..1500 {
        g.tick(human(t));
    }
    let text = g.recording.as_ref().unwrap().text().unwrap();
    let mut r = Replay::parse(&text).unwrap().start();
    for _ in 0..700 {
        r.tick(Controls::default());
    }
    let s = Scenario::capture_car(&r, 0, Kind::Defend, 2.0, None).unwrap();
    let back = Scenario::parse(&s.text()).unwrap();
    let clip = back.clip.as_ref().unwrap();
    assert_eq!(
        bits(snapshot::world(&clip.state.world)),
        bits(snapshot::world(&r.world))
    );
    let idle = BrainSpec::parse("idle", "module = scripted\nmode = idle").unwrap();
    let mut test = Game::new(1);
    test.start_scenario(&back, &idle);
    assert_eq!(test.drivers.len(), 1);
    assert_eq!(test.drivers[0].cars, vec![0]);
    test.tick(Controls::default());
    for id in 1..6 {
        assert_eq!(
            soccar_simulation::recording::input(test.world.cars[id].controls),
            clip.frames[0].cars[id]
        );
    }
    assert_eq!(test.world.cars[0].controls.throttle, 0.0);
    assert_eq!(
        bits(snapshot::world(&test.clone().world)),
        bits(snapshot::world(&test.world))
    );
}

#[test]
fn orange_capture_turns_all_world_space_state_and_keeps_car_ids() {
    let mut g = start(3, 1);
    for t in 0..1500 {
        g.tick(human(t));
    }
    let text = g.recording.as_ref().unwrap().text().unwrap();
    let mut r = Replay::parse(&text).unwrap().start();
    for _ in 0..600 {
        r.tick(Controls::default());
    }
    let clip = Clip::capture(&r, 3, 1.0, None).unwrap();
    assert_eq!(clip.state.world.cars[3].team, 0);
    for (a, b) in r.world.cars.iter().zip(&clip.state.world.cars) {
        assert_eq!(a.id, b.id);
        assert_eq!(a.pos.x, -b.pos.x);
        assert_eq!(a.pos.y, -b.pos.y);
        assert_eq!(a.pos.z, b.pos.z);
        assert_eq!(a.vel.z, b.vel.z);
        assert_eq!(a.has_jumped, b.has_jumped);
    }
    for (a, b) in r.world.pads.iter().zip(&clip.state.world.pads) {
        assert_eq!(a.pos.x, -b.pos.x);
        assert_eq!(a.pos.y, -b.pos.y);
        assert_eq!(a.cooldown, b.cooldown);
    }
}

#[test]
fn invalid_and_incompatible_recordings_are_rejected() {
    let mut g = start(1, 0);
    g.tick(Controls::default());
    let text = g.recording.as_ref().unwrap().text().unwrap();
    let mut v: serde_json::Value = serde_json::from_str(&text).unwrap();
    v["engine"] = "other".into();
    assert!(Replay::parse(&v.to_string()).is_err());
    let mut v: serde_json::Value = serde_json::from_str(&text).unwrap();
    v["frames"][0]["cars"][0][0] = 2.0.into();
    assert!(Replay::parse(&v.to_string()).is_err());
    assert!(Replay::parse("{}").is_err());
}
