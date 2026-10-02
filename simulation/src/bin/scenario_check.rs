//! Exact native state output for scenario checks. This does not change the regression baseline.
use soccar_simulation::{
    brains::BrainSpec,
    car::Controls,
    game::{Game, Phase},
    scenario::Scenario,
    snapshot,
};
use std::{
    fs,
    io::{self, Write},
    path::Path,
};

fn run() -> Result<(), Box<dyn std::error::Error>> {
    let args: Vec<_> = std::env::args().skip(1).collect();
    let [scenario, brain, output] = args.as_slice() else {
        return Err("Use scenario_check scenario.txt brain.txt output.bin".into());
    };
    let scenario = Scenario::parse(&fs::read_to_string(scenario)?)?;
    let brain = BrainSpec::parse("custom", &fs::read_to_string(brain)?)?;
    let mut game = Game::new(1);
    game.start_scenario(&scenario, &brain);
    let mut out = io::BufWriter::new(fs::File::create(Path::new(output))?);
    for tick in 0..=1200 {
        if tick != 0 {
            game.tick(Controls::default());
        }
        let words = snapshot::game(&game);
        out.write_all(&(words.len() as u32).to_le_bytes())?;
        for value in words {
            out.write_all(&value.to_le_bytes())?;
        }
        if game.phase == Phase::Ended {
            out.flush()?;
            return Ok(());
        }
    }
    Err("Scenario did not end within 1200 ticks".into())
}
fn main() {
    if let Err(e) = run() {
        eprintln!("scenario-check: {e}");
        std::process::exit(1);
    }
}
