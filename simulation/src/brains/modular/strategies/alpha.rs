//! Alpha's strategy: the closest car attacks with alpha's timed intercepts, the others support.
//! It plays exactly as the alpha brain, which beats alphabravo in 1v1. Copy it to start a new strategy.
use crate::{
    brains::{
        Context, Params,
        modular::kit::{ATTACK, Bot, GOALIE, Maneuver, Mode, SUPPORT, Settings, Strategy, Team},
    },
    car::Controls,
};

#[derive(Clone, Debug)]
pub struct Alpha {
    team: usize,
    bots: Vec<Bot>,
}

pub fn create(
    _params: &mut Params,
    team: usize,
    cars: &[usize],
    settings: Settings,
) -> Result<Box<dyn Strategy>, String> {
    Ok(Box::new(Alpha {
        team,
        bots: cars.iter().map(|&id| Bot::new(id, settings)).collect(),
    }))
}

impl Strategy for Alpha {
    fn assign(&mut self, ctx: &Context) -> Team {
        let w = ctx.world;
        let d = if self.team == 0 { 1.0 } else { -1.0 };
        let ball = w.ball.pos;
        let mate = ctx.player.filter(|&p| w.cars[p].team == self.team);
        let ids = || self.bots.iter().map(|b| b.car).chain(mate);
        let cost = |id: usize| {
            let car = &w.cars[id];
            car.pos.distance(ball) + ((car.pos.y - ball.y) * d).max(0.0) * 1.5
        };
        let best = ids().reduce(|a, b| if cost(a) < cost(b) { a } else { b });
        let count = ids().count();
        let mut goalie = None;
        if self.bots.first().is_some_and(|b| b.settings.roles == 1) && count >= 3 {
            let depth = |id: usize| w.cars[id].pos.y * d;
            goalie = ids()
                .filter(|&id| Some(id) != best)
                .reduce(|a, b| if depth(a) <= depth(b) { a } else { b });
        }
        for bot in &mut self.bots {
            bot.role = if Some(bot.car) == best {
                ATTACK
            } else if Some(bot.car) == goalie {
                GOALIE
            } else {
                SUPPORT
            };
        }
        let kickoff = !w.ball_touched
            && w.ball.vel.length_sq() < 1.0
            && ball.x.abs() < 1.0
            && ball.y.abs() < 1.0;
        Team { kickoff, count }
    }

    fn mode(&self, i: usize, ctx: &Context, team: Team) -> Mode {
        let bot = &self.bots[i];
        let c = &ctx.world.cars[bot.car];
        if c.frozen || c.is_demoed {
            Mode::Inactive
        } else if team.kickoff {
            Mode::Kickoff
        } else if !matches!(bot.maneuver, Maneuver::None) {
            Mode::Maneuver
        } else if !c.is_on_ground {
            Mode::Airborne
        } else if c.up.z < 0.7 {
            Mode::Wall
        } else if bot.role != ATTACK {
            Mode::Position
        } else {
            Mode::Intercept
        }
    }

    fn act(&mut self, i: usize, ctx: &Context, _team: Team) -> Controls {
        self.bots[i].tick(ctx.world, ctx.predictor)
    }

    fn bots(&self) -> &[Bot] {
        &self.bots
    }

    fn bots_mut(&mut self) -> &mut [Bot] {
        &mut self.bots
    }

    fn reset(&mut self) {
        for bot in &mut self.bots {
            bot.reset();
        }
    }

    fn trace(&self, out: &mut Vec<f64>) {
        for bot in &self.bots {
            bot.trace(out);
        }
    }

    fn clone_box(&self) -> Box<dyn Strategy> {
        Box::new(self.clone())
    }
}
