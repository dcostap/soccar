use soccar_simulation::{
    ball::{Ball, STATE_FIELDS},
    car::Controls,
    rotation::Quat,
    snapshot,
    vector::Vec3,
    world::World,
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
fn vec3(r: &mut impl Read) -> io::Result<Vec3> {
    Ok(Vec3::new(number(r)?, number(r)?, number(r)?))
}
fn run() -> io::Result<()> {
    let mut input = io::stdin().lock();
    let mut output = io::BufWriter::new(io::stdout().lock());
    let mut magic = [0; 4];
    input.read_exact(&mut magic)?;
    if &magic != b"SCW1" {
        return Err(io::Error::other("Expected SCW1"));
    }
    let count = u32(&mut input)?;
    output.write_all(b"SCR1")?;
    output.write_all(&count.to_le_bytes())?;
    for _ in 0..count {
        let ticks = u32(&mut input)?;
        let cars = u32(&mut input)?;
        if cars > 6 || ticks > 216000 {
            return Err(io::Error::other("Invalid case limits"));
        }
        let mut world = World::default();
        let mut ball = [0.0; STATE_FIELDS];
        for n in &mut ball {
            *n = number(&mut input)?;
        }
        world.ball = Ball::from_state(ball);
        for _ in 0..cars {
            let team = number(&mut input)? as usize;
            let pos = vec3(&mut input)?;
            let yaw = number(&mut input)?;
            let boost = number(&mut input)?;
            let vel = vec3(&mut input)?;
            let ang = vec3(&mut input)?;
            let pitch = number(&mut input)?;
            let roll = number(&mut input)?;
            let frozen = number(&mut input)? != 0.0;
            let demoed = number(&mut input)? != 0.0;
            let respawn = number(&mut input)?;
            let id = world.add_car(team);
            let c = &mut world.cars[id];
            c.spawn(pos.x, pos.y, yaw, boost);
            c.pos.z = pos.z;
            c.vel = vel;
            c.ang_vel = ang;
            if pitch != 0.0 || roll != 0.0 {
                c.rot = Quat::euler(yaw, pitch, roll);
                c.update_axes();
            }
            c.frozen = frozen;
            c.is_demoed = demoed;
            c.demo_respawn_timer = respawn;
        }
        for tick in 0..=ticks {
            if tick > 0 {
                for c in &mut world.cars {
                    let throttle = number(&mut input)?;
                    let steer = number(&mut input)?;
                    let pitch = number(&mut input)?;
                    let yaw = number(&mut input)?;
                    let roll = number(&mut input)?;
                    let jump = number(&mut input)? != 0.0;
                    let boost = number(&mut input)? != 0.0;
                    let handbrake = number(&mut input)? != 0.0;
                    let dodge = number(&mut input)?;
                    c.controls = Controls {
                        throttle,
                        steer,
                        pitch,
                        yaw,
                        roll,
                        jump,
                        boost,
                        handbrake,
                        dodge_mag: if dodge < 0.0 { None } else { Some(dodge) },
                    };
                }
                world.step();
            }
            let state = snapshot::world(&world);
            output.write_all(&(state.len() as u32).to_le_bytes())?;
            for value in state {
                output.write_all(&value.to_le_bytes())?;
            }
        }
    }
    output.flush()
}
fn main() {
    if let Err(error) = run() {
        eprintln!("world-trace: {error}");
        std::process::exit(1);
    }
}
