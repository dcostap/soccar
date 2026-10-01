//! Bounded native state stream for regression and native/WASM consistency checks.
use soccar_simulation::{
    brains::{BrainSpec, Skill},
    car::Controls,
    game::{Config, Game, Phase},
    snapshot,
};
use std::io::{self, Read, Write};
fn u32(r: &mut impl Read) -> io::Result<u32> {
    let mut b = [0; 4];
    r.read_exact(&mut b)?;
    Ok(u32::from_le_bytes(b))
}
fn number(r: &mut impl Read) -> io::Result<f64> {
    let mut b = [0; 8];
    r.read_exact(&mut b)?;
    Ok(f64::from_le_bytes(b))
}
fn block(out: &mut impl Write, values: Vec<f64>) -> io::Result<()> {
    out.write_all(&(values.len() as u32).to_le_bytes())?;
    for v in values {
        out.write_all(&v.to_le_bytes())?;
    }
    Ok(())
}
fn run() -> io::Result<()> {
    // Optional brain files let the same exact-state check cover new modules.
    let paths: Vec<_> = std::env::args().skip(1).collect();
    let custom = match paths.as_slice() {
        [] => None,
        [blue, orange] => Some(
            [blue, orange]
                .map(|path| {
                    let text = std::fs::read_to_string(path)?;
                    BrainSpec::parse("custom", &text).map_err(io::Error::other)
                })
                .into_iter()
                .collect::<io::Result<Vec<_>>>()?,
        ),
        _ => return Err(io::Error::other("Expected zero or two brain file paths")),
    };
    let mut input = io::stdin().lock();
    let mut out = io::BufWriter::new(io::stdout().lock());
    let mut magic = [0; 4];
    input.read_exact(&mut magic)?;
    if &magic != b"SCG2" {
        return Err(io::Error::other("Expected SCG2"));
    }
    let count = u32(&mut input)?;
    out.write_all(b"SCM2")?;
    out.write_all(&count.to_le_bytes())?;
    for _ in 0..count {
        let ticks = u32(&mut input)?;
        let mode = u32(&mut input)?;
        let size = u32(&mut input)? as usize;
        let skill = Skill::from_number(u32(&mut input)?);
        let player = u32(&mut input)? as i32;
        let seed = u32(&mut input)?;
        let duration = number(&mut input)?;
        let mut actions = Vec::new();
        for _ in 0..u32(&mut input)? {
            actions.push((u32(&mut input)?, u32(&mut input)?, number(&mut input)?));
        }
        let mut game = Game::new(seed);
        let config = Config {
            team_size: size,
            brains: custom.as_ref().map_or_else(
                || [BrainSpec::preset(skill), BrainSpec::preset(skill)],
                |brains| [brains[0].clone(), brains[1].clone()],
            ),
            player_team: player,
            duration,
            ..Config::default()
        };
        match mode {
            0 => game.start_menu(),
            1 => game.start_freeplay(),
            _ => game.start_match(config.clone()),
        }
        for tick in 0..=ticks {
            if tick > 0 {
                let c = if player >= 0 {
                    Controls {
                        throttle: 1.0,
                        steer: if tick < 180 { 0.0 } else { 0.35 },
                        boost: tick % 240 < 180,
                        jump: tick % 240 >= 180 && tick % 240 < 210,
                        pitch: -0.4,
                        yaw: 0.2,
                        ..Controls::default()
                    }
                } else {
                    Controls::default()
                };
                game.tick(c);
            }
            for &(_, op, value) in actions.iter().filter(|a| a.0 == tick) {
                match op {
                    7 => game.start_match(config.clone()),
                    8 => game.start_freeplay(),
                    9 => game.start_menu(),
                    _ => game.command(op, value),
                }
            }
            block(&mut out, snapshot::game(&game))?;
            block(&mut out, snapshot::view(&game))?;
            if game.phase == Phase::Ended {
                break;
            }
        }
        out.write_all(&0_u32.to_le_bytes())?;
    }
    out.flush()
}
fn main() {
    if let Err(e) = run() {
        eprintln!("game-trace: {e}");
        std::process::exit(1);
    }
}
