//! Binary comparison runner. Do not put logs on stdout.
use soccar_simulation::ball::{Ball, STATE_FIELDS};
use std::io::{self, Read, Write};

fn read_u32(input: &mut impl Read) -> io::Result<u32> {
    let mut bytes = [0; 4];
    input.read_exact(&mut bytes)?;
    Ok(u32::from_le_bytes(bytes))
}

fn run() -> io::Result<()> {
    let mut input = io::stdin().lock();
    let mut output = io::BufWriter::new(io::stdout().lock());
    let mut magic = [0; 4];
    input.read_exact(&mut magic)?;
    if &magic != b"SCB1" {
        return Err(io::Error::other("Expected SCB1 input"));
    }
    let count = read_u32(&mut input)?;
    if count > 4096 {
        return Err(io::Error::other("Too many cases"));
    }
    output.write_all(b"SCT1")?;
    output.write_all(&count.to_le_bytes())?;
    for _ in 0..count {
        let ticks = read_u32(&mut input)?;
        if ticks > 216_000 {
            return Err(io::Error::other("Too many ticks"));
        }
        let mut state = [0.0; STATE_FIELDS];
        for value in &mut state {
            let mut bytes = [0; 8];
            input.read_exact(&mut bytes)?;
            *value = f64::from_le_bytes(bytes);
        }
        if state.iter().any(|v| !v.is_finite())
            || state[9] <= 0.0
            || state[10] <= 0.0
            || (state[12] != 0.0 && state[12] != 1.0)
        {
            return Err(io::Error::other("Invalid ball state"));
        }
        let mut ball = Ball::from_state(state);
        output.write_all(&ticks.to_le_bytes())?;
        for tick in 0..=ticks {
            if tick != 0 {
                ball.step();
            }
            for value in ball.trace() {
                output.write_all(&value.to_le_bytes())?;
            }
        }
    }
    let mut trailing = [0];
    if input.read(&mut trailing)? != 0 {
        return Err(io::Error::other("Trailing input"));
    }
    output.flush()
}

fn main() {
    if let Err(error) = run() {
        eprintln!("ball-trace: {error}");
        std::process::exit(1);
    }
}
