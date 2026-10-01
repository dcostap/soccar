//! Fixed rival behaviors for set pieces. They are simple on purpose: a set piece measures the brain under test,
//! so its rivals must be predictable and must never change.
//!
//! Settings:
//! - `mode`: `idle` (no input), `throttle` (drive straight ahead), `chase` (drive at the ball),
//!   or `goalie` (hold the middle of the own goal line and face the ball).
//! - `boost`: whether `throttle` and `chase` use boost. Default false.
//! - `speed`: top speed of `chase` and `goalie` without boost. Default 1400.
use super::{Brain, Context, Params};
use crate::{
    arena::HALF_LENGTH,
    car::{Car, Controls},
    math::{atan2, clamp, hypot2},
    vector::Vec3,
};

#[derive(Clone, Copy, Debug, PartialEq)]
enum Mode {
    Idle,
    Throttle,
    Chase,
    Goalie,
}

#[derive(Clone, Debug)]
struct Scripted {
    team: usize,
    cars: Vec<usize>,
    mode: Mode,
    boost: bool,
    speed: f64,
}

pub fn create(params: &mut Params, team: usize, cars: &[usize]) -> Result<Box<dyn Brain>, String> {
    let mode = match params.text("mode", "idle").as_str() {
        "idle" => Mode::Idle,
        "throttle" => Mode::Throttle,
        "chase" => Mode::Chase,
        "goalie" => Mode::Goalie,
        other => {
            return Err(format!(
                "mode: expected idle, throttle, chase, or goalie, got {other}"
            ));
        }
    };
    Ok(Box::new(Scripted {
        team,
        cars: cars.to_vec(),
        mode,
        boost: params.flag("boost", false)?,
        speed: params.number("speed", 1400.0)?,
    }))
}

/// Steers toward `target` and holds `speed`. Reverses when the target is close behind.
fn drive(car: &Car, target: Vec3, speed: f64, boost: bool) -> Controls {
    let offset = target.minus(car.pos);
    let forward = offset.dot(car.forward);
    let lateral = offset.dot(car.left);
    let angle = atan2(lateral, forward);
    let distance = hypot2(forward, lateral);
    let current = car.forward_speed();
    let mut out = Controls {
        steer: clamp(-angle * 3.0, -1.0, 1.0),
        ..Controls::default()
    };
    if angle.abs() > 2.4 && distance < 600.0 {
        out.throttle = -1.0;
        out.steer = -out.steer;
        return out;
    }
    out.throttle = if current < speed {
        1.0
    } else if current > speed + 200.0 {
        -0.2
    } else {
        0.05
    };
    out.handbrake = angle.abs() > 1.6 && current > 500.0;
    out.boost = boost && angle.abs() < 0.3;
    out
}

impl Brain for Scripted {
    fn tick(&mut self, ctx: &Context, out: &mut [Controls]) {
        let ball = ctx.world.ball.pos;
        // Orange defends positive y.
        let home = if self.team == 0 { -1.0 } else { 1.0 };
        for (slot, &id) in out.iter_mut().zip(&self.cars) {
            let car = &ctx.world.cars[id];
            *slot = match self.mode {
                Mode::Idle => Controls::default(),
                Mode::Throttle => Controls {
                    throttle: 1.0,
                    boost: self.boost,
                    ..Controls::default()
                },
                Mode::Chase => drive(
                    car,
                    ball,
                    if self.boost { 2300.0 } else { self.speed },
                    self.boost,
                ),
                Mode::Goalie => {
                    let post = Vec3::new(
                        clamp(ball.x, -700.0, 700.0),
                        home * (HALF_LENGTH - 150.0),
                        0.0,
                    );
                    let near = post.minus(car.pos);
                    if hypot2(near.x, near.y) > 250.0 {
                        let distance = hypot2(near.x, near.y);
                        drive(car, post, clamp(distance * 1.2, 300.0, self.speed), false)
                    } else if ball.distance(car.pos) < 900.0 {
                        // The ball is on top of the goalie: meet it.
                        drive(car, ball, self.speed, false)
                    } else {
                        // Settled: turn in place to face the ball.
                        let offset = ball.minus(car.pos);
                        let angle = atan2(offset.dot(car.left), offset.dot(car.forward));
                        Controls {
                            steer: clamp(-angle * 3.0, -1.0, 1.0),
                            throttle: if angle.abs() > 0.3 { 0.3 } else { 0.0 },
                            ..Controls::default()
                        }
                    }
                }
            };
        }
    }
    fn clone_box(&self) -> Box<dyn Brain> {
        Box::new(self.clone())
    }
}
