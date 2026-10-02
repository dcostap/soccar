//! Fixed set-piece rival: drive straight until contact, then brake and remain stopped.
use super::{Brain, Context, Params};
use crate::car::{Car, Controls};

#[derive(Clone, Debug)]
struct Strike {
    cars: Vec<usize>,
}

pub fn create(_: &mut Params, _: usize, cars: &[usize]) -> Result<Box<dyn Brain>, String> {
    Ok(Box::new(Strike {
        cars: cars.to_vec(),
    }))
}

pub fn controls(car: &Car) -> Controls {
    Controls {
        throttle: if car.last_ball_touch_tick < 0 {
            1.0
        } else if car.forward_speed() > 50.0 {
            -1.0
        } else {
            0.0
        },
        ..Controls::default()
    }
}

impl Brain for Strike {
    fn tick(&mut self, ctx: &Context, out: &mut [Controls]) {
        for (slot, &id) in out.iter_mut().zip(&self.cars) {
            *slot = controls(&ctx.world.cars[id]);
        }
    }
    fn clone_box(&self) -> Box<dyn Brain> {
        Box::new(self.clone())
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn brakes_after_contact_without_reversing() {
        let mut car = Car::new(0, 1);
        car.spawn(0.0, 0.0, 0.0, 0.0);
        car.vel = car.forward.scaled(900.0);
        assert_eq!(controls(&car).throttle, 1.0);
        car.last_ball_touch_tick = 10;
        assert_eq!(controls(&car).throttle, -1.0);
        car.vel = car.forward.scaled(40.0);
        assert_eq!(controls(&car).throttle, 0.0);
    }
}
