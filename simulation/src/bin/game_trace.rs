use soccar_simulation::{
    bot::Skill,
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
fn run() -> io::Result<()> {
    let mut input = io::stdin().lock();
    let mut out = io::BufWriter::new(io::stdout().lock());
    let mut magic = [0; 4];
    input.read_exact(&mut magic)?;
    if &magic != b"SCG1" {
        return Err(io::Error::other("Expected SCG1"));
    }
    let count = u32(&mut input)?;
    out.write_all(b"SCM1")?;
    out.write_all(&count.to_le_bytes())?;
    for _ in 0..count {
        let ticks = u32(&mut input)?;
        let mode = u32(&mut input)?;
        let size = u32(&mut input)? as usize;
        let skill = Skill::from_number(u32(&mut input)?);
        let player = u32(&mut input)? as i32;
        let seed = u32(&mut input)?;
        let duration = number(&mut input)?;
        let mut game = Game::new(seed);
        let config = Config {
            team_size: size,
            skill,
            player_team: player,
            duration,
            ..Config::default()
        };
        match mode {
            0 => game.start_menu(),
            1 => game.start_freeplay(),
            _ => game.start_match(config),
        };
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
            let state = snapshot::game(&game);
            out.write_all(&(state.len() as u32).to_le_bytes())?;
            for value in state {
                out.write_all(&value.to_le_bytes())?;
            }
            if game.phase == Phase::Ended {
                break;
            }
        }
        out.write_all(&0_u32.to_le_bytes())?;
    }
    out.flush()
}
fn main() {
    if let Err(error) = run() {
        eprintln!("game-trace: {error}");
        std::process::exit(1);
    }
}
