//! Generate portable recordings and exact native traces for the WASM checks.
use soccar_simulation::{
    brains::BrainSpec,
    car::Controls,
    game::{Config, Game, Phase},
    recording::Replay,
    scenario::{Kind, Scenario},
    snapshot,
};
use std::{fs, io::Write, path::Path};

fn row(file: &mut impl Write, game: &Game) {
    let state = snapshot::game(game);
    file.write_all(&(state.len() as u32).to_le_bytes()).unwrap();
    for value in state {
        file.write_all(&value.to_bits().to_le_bytes()).unwrap();
    }
}
fn trace(path: &Path, mut game: Game, ticks: usize) {
    let mut file = std::io::BufWriter::new(fs::File::create(path).unwrap());
    row(&mut file, &game);
    for _ in 0..ticks {
        game.tick(Controls::default());
        row(&mut file, &game);
        if game.phase == Phase::Ended {
            break;
        }
    }
}
fn main() {
    let dir = std::env::args()
        .nth(1)
        .expect("recording_check <output-directory>");
    let dir = Path::new(&dir);
    fs::create_dir_all(dir).unwrap();
    for team in 0..2 {
        let mut game = Game::new(12345);
        game.start_menu();
        for _ in 0..100 {
            game.tick(Controls::default());
        }
        game.start_match(Config {
            team_size: 3,
            player_team: team,
            duration: 60.0,
            ..Config::default()
        });
        game.begin_recording();
        for tick in 0..2400 {
            if tick == 900 {
                game.command(5, 1.0);
                game.command(6, 0.7);
            }
            if tick == 1600 {
                game.command(5, 0.0);
            }
            if game.phase == Phase::Replay {
                game.command(4, 0.0);
            }
            game.tick(Controls {
                throttle: 1.0,
                steer: if tick % 300 < 150 { 0.2 } else { -0.4 },
                boost: tick % 400 < 200,
                jump: tick % 180 >= 150,
                pitch: -0.3,
                yaw: 0.2,
                ..Controls::default()
            });
        }
        let text = game.recording.as_ref().unwrap().text().unwrap();
        fs::write(dir.join(format!("replay-{team}.json")), &text).unwrap();
        trace(
            &dir.join(format!("replay-{team}.bin")),
            Replay::parse(&text).unwrap().start(),
            2400,
        );
        let mut replay = Replay::parse(&text).unwrap().start();
        for _ in 0..600 {
            replay.tick(Controls::default());
        }
        assert_eq!(replay.phase, Phase::Playing);
        let brain = BrainSpec::parse("alphabravo", "module = alphabravo\nshotzone = 5000").unwrap();
        for car in [0, 3] {
            for recorded in [true, false] {
                let other = (!recorded)
                    .then(|| BrainSpec::parse("fixed", "module = scripted\nmode = chase").unwrap());
                let scenario =
                    Scenario::capture_car(&replay, car, Kind::Defend, 2.0, other).unwrap();
                let stem = format!(
                    "clip-{team}-{car}-{}",
                    if recorded { "recorded" } else { "chase" }
                );
                fs::write(dir.join(format!("{stem}.txt")), scenario.text()).unwrap();
                let mut test = Game::new(1);
                test.start_scenario(&scenario, &brain);
                trace(&dir.join(format!("{stem}.bin")), test, 1000);
            }
        }
    }
}
