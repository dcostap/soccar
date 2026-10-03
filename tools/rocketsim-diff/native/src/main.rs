use serde::Deserialize;
use serde_json::json;
use soccar_simulation::{car::Controls, rotation::Quat, vector::Vec3, world::World};
use std::io::{self, BufWriter, Write};

#[derive(Deserialize)]
#[serde(deny_unknown_fields)]
struct Body {
    pos: [f64; 3],
    vel: [f64; 3],
    ang_vel: [f64; 3],
}

#[derive(Deserialize)]
#[serde(deny_unknown_fields)]
struct CarStart {
    body: Body,
    quat: [f64; 4],
    boost: f64,
    team: usize,
    is_on_ground: bool,
    has_jumped: bool,
    jump_time: f64,
    air_time: f64,
    air_time_since_jump: f64,
}

#[derive(Deserialize)]
#[serde(deny_unknown_fields)]
struct Phase {
    ticks: usize,
    controls: Vec<Controls>,
}

#[derive(Deserialize)]
#[serde(deny_unknown_fields)]
struct Scenario {
    ball: Body,
    cars: Vec<CarStart>,
    phases: Vec<Phase>,
}

fn vector(v: [f64; 3]) -> Vec3 {
    Vec3::new(v[0], v[1], v[2])
}

fn array(v: Vec3) -> [f64; 3] {
    [v.x, v.y, v.z]
}

fn emit(world: &World, out: &mut impl Write) -> io::Result<()> {
    let cars: Vec<_> = world
        .cars
        .iter()
        .map(|car| {
            json!({
                "pos": array(car.pos), "vel": array(car.vel), "ang_vel": array(car.ang_vel),
                "basis": [array(car.forward), array(car.left), array(car.up)],
                "boost": car.boost,
                "handbrake": car.handbrake_val,
                "arena_clearance": soccar_simulation::arena::distance(car.pos),
                "flags": {"is_on_ground": car.is_on_ground, "has_jumped": car.has_jumped,
                    "has_double_jumped": car.has_double_jumped, "has_flipped": car.has_flipped,
                    "is_supersonic": car.is_supersonic, "is_demoed": car.is_demoed},
            })
        })
        .collect();
    serde_json::to_writer(
        &mut *out,
        &json!({
            "tick": world.tick,
            "simulation_version": (world.tick == 0).then(soccar_simulation::recording::engine_version),
            "ball": {"pos": array(world.ball.pos), "vel": array(world.ball.vel),
                "ang_vel": array(world.ball.ang_vel),
                "arena_clearance": soccar_simulation::arena::distance(world.ball.pos)},
            "cars": cars,
            "pads": world.pads.iter().map(|p| json!({
                "pos": array(p.pos), "big": p.big, "cooldown": p.cooldown,
            })).collect::<Vec<_>>(),
        }),
    )?;
    writeln!(out)
}

fn run() -> Result<(), Box<dyn std::error::Error>> {
    let scenario: Scenario = serde_json::from_reader(io::stdin().lock())?;
    if scenario
        .phases
        .iter()
        .any(|phase| phase.controls.len() != scenario.cars.len())
    {
        return Err("Each phase needs one control object per car".into());
    }
    let mut world = World {
        goals_enabled: false,
        ..World::default()
    };
    world.ball.pos = vector(scenario.ball.pos);
    world.ball.vel = vector(scenario.ball.vel);
    world.ball.ang_vel = vector(scenario.ball.ang_vel);
    for start in scenario.cars {
        if start.team > 1 {
            return Err("Car team must be zero or one".into());
        }
        let id = world.add_car(start.team);
        let car = &mut world.cars[id];
        car.pos = vector(start.body.pos);
        car.vel = vector(start.body.vel);
        car.ang_vel = vector(start.body.ang_vel);
        let [x, y, z, w] = start.quat;
        car.rot = Quat { x, y, z, w };
        car.rot.normalize();
        car.update_axes();
        car.boost = start.boost;
        car.is_on_ground = start.is_on_ground;
        car.has_jumped = start.has_jumped;
        car.jump_time = start.jump_time;
        car.air_time = start.air_time;
        car.air_time_since_jump = start.air_time_since_jump;
    }
    let mut out = BufWriter::new(io::stdout().lock());
    emit(&world, &mut out)?;
    for phase in scenario.phases {
        for _ in 0..phase.ticks {
            for (car, controls) in world.cars.iter_mut().zip(&phase.controls) {
                car.controls = *controls;
            }
            // One-car cases have no contact-order draw. Multi-car cases use fixed order.
            world.step();
            emit(&world, &mut out)?;
        }
    }
    Ok(())
}

fn main() {
    if let Err(error) = run() {
        eprintln!("{error}");
        std::process::exit(1);
    }
}
