//! Team play on top of alphabravo's tactics. Every option is off by default, and then this strategy plays
//! exactly as alphabravo: it runs the core tactics and only replaces some cars' positioning.
//!
//! - `team.shadow`: a support stops double-committing. While the attacker has the play, it follows the ball
//!   `team.gap` behind it, ready for a rebound or a pass, and takes over as soon as the attacker loses it.
//! - `team.timecost`: the attacker is the car that reaches the ball first, not the nearest.
use crate::{
    brains::{
        Context, Params,
        modular::{
            kit::{
                ATTACK, Bot, GOALIE, Maneuver, Mode, SUPPORT, Settings, Strategy, Team, avoid_ball,
                ground_time, nearest_pad,
            },
            tactics::Tactics,
        },
    },
    car::{Car, Controls},
    math::clamp,
    vector::Vec3,
};

#[derive(Clone, Debug)]
pub struct TeamPlay {
    core: Tactics,
    /// Options for teams of two or fewer cars, then for three or more.
    opts: [Opts; 2],
    /// Cars on the team this tick, counting a human teammate. Set by `assign`.
    size: usize,
}

/// Strategy options. `team.<key>` sets one for every team size; `team.2.<key>` and `team.3.<key>` override it.
#[derive(Clone, Copy, Debug)]
struct Opts {
    shadow: bool,
    gap: f64,
    lateral: f64,
    lead: f64,
    margin: f64,
    past: f64,
    danger: f64,
    timecost: bool,
    stick: f64,
    behind: f64,
}

pub fn create(
    params: &mut Params,
    team: usize,
    cars: &[usize],
    settings: Settings,
) -> Result<Box<dyn Strategy>, String> {
    let base = Opts::defaults(params)?;
    Ok(Box::new(TeamPlay {
        core: Tactics {
            team,
            bots: cars.iter().map(|&id| Bot::new(id, settings)).collect(),
            previous: None,
            recovering: vec![false; cars.len()],
            shotzone: params.number("shotzone", 5000.0)?,
        },
        opts: [Opts::read(params, 2, &base)?, Opts::read(params, 3, &base)?],
        size: cars.len(),
    }))
}

impl Opts {
    fn defaults(params: &mut Params) -> Result<Self, String> {
        Ok(Self {
            shadow: params.flag("team.shadow", false)?,
            // Distance behind the ball, toward the own goal.
            gap: params.number("team.gap", 1500.0)?,
            // Share of the ball's x the shadow keeps; lower stays nearer the middle.
            lateral: params.number("team.lateral", 0.5)?,
            // Seconds ahead on the ball's predicted path that the shadow follows.
            lead: params.number("team.lead", 0.5)?,
            // The shadow takes over when it reaches the ball this many seconds before the attacker.
            margin: params.number("team.margin", 0.4)?,
            // The shadow takes over when the attacker is this far upfield of the ball.
            past: params.number("team.past", 300.0)?,
            // The shadow always challenges a ball this close to the own goal while goal-side of it.
            danger: params.number("team.danger", 2500.0)?,
            // Choose the attacker by estimated arrival time instead of distance.
            timecost: params.flag("team.timecost", false)?,
            // Seconds of preference for the current attacker, against role flicker.
            stick: params.number("team.stick", 0.1)?,
            // Seconds added per unit a car is upfield of the ball. Alphabravo's distance cost uses 1.5 units per unit.
            behind: params.number("team.behind", 0.00065)?,
        })
    }
    fn read(params: &mut Params, size: usize, base: &Self) -> Result<Self, String> {
        Ok(Self {
            shadow: params.flag(&format!("team.{size}.shadow"), base.shadow)?,
            gap: params.number(&format!("team.{size}.gap"), base.gap)?,
            lateral: params.number(&format!("team.{size}.lateral"), base.lateral)?,
            lead: params.number(&format!("team.{size}.lead"), base.lead)?,
            margin: params.number(&format!("team.{size}.margin"), base.margin)?,
            past: params.number(&format!("team.{size}.past"), base.past)?,
            danger: params.number(&format!("team.{size}.danger"), base.danger)?,
            timecost: params.flag(&format!("team.{size}.timecost"), base.timecost)?,
            stick: params.number(&format!("team.{size}.stick"), base.stick)?,
            behind: params.number(&format!("team.{size}.behind"), base.behind)?,
        })
    }
}

impl Strategy for TeamPlay {
    fn assign(&mut self, ctx: &Context) -> Team {
        let team = self.core.assign(ctx);
        self.size = team.count;
        if !team.kickoff {
            self.reassign(ctx, team);
        }
        team
    }
    fn mode(&self, i: usize, ctx: &Context, team: Team) -> Mode {
        if self.positions(i, ctx, team) {
            Mode::Position
        } else {
            self.core.mode(i, ctx, team)
        }
    }
    fn act(&mut self, i: usize, ctx: &Context, team: Team) -> Controls {
        if !self.positions(i, ctx, team) {
            return self.core.act(i, ctx, team);
        }
        let (spot, pace) = self.shadow_spot(i, ctx);
        let bot = &mut self.core.bots[i];
        bot.kickoff_flip_done = false;
        let c = &ctx.world.cars[bot.car];
        let distance = c.pos.distance(spot);
        let mut out = Controls::default();
        if distance < 120.0 && pace < 300.0 {
            out.throttle = clamp(-c.forward_speed() / 400.0, -1.0, 1.0);
        } else {
            let speed = clamp(distance * 1.5 + pace, 0.0, 2300.0);
            bot.drive_to(
                c,
                &mut out,
                spot,
                bot.settings.boost && distance > 1800.0,
                speed,
            );
        }
        bot.target = spot;
        bot.out = out;
        out
    }
    fn bots(&self) -> &[Bot] {
        &self.core.bots
    }
    fn bots_mut(&mut self) -> &mut [Bot] {
        &mut self.core.bots
    }
    fn reset(&mut self) {
        self.core.reset()
    }
    fn trace(&self, out: &mut Vec<f64>) {
        self.core.trace(out)
    }
    fn clone_box(&self) -> Box<dyn Strategy> {
        Box::new(self.clone())
    }
}

impl TeamPlay {
    /// Replaces the core's attacker by `team.timecost`, then assigns the other roles as the core does.
    fn reassign(&mut self, ctx: &Context, team: Team) {
        let o = *self.o();
        if !o.timecost {
            return;
        }
        let w = ctx.world;
        let d = self.d();
        let ball = w.ball.pos;
        let mate = ctx.player.filter(|&id| w.cars[id].team == self.core.team);
        let ids: Vec<usize> = self.core.bots.iter().map(|b| b.car).chain(mate).collect();
        let active = |id: usize| !w.cars[id].is_demoed && !w.cars[id].frozen;
        let previous = self.core.previous;
        let cost = |id: usize| {
            ground_time(&w.cars[id], ball, true)
                + ((w.cars[id].pos.y - ball.y) * d).max(0.0) * o.behind
                - if previous == Some(id) { o.stick } else { 0.0 }
        };
        let attacker = ids
            .iter()
            .copied()
            .filter(|&id| active(id))
            .min_by(|&a, &b| cost(a).total_cmp(&cost(b)));
        if attacker == previous {
            return;
        }
        self.core.previous = attacker;
        let deep = ids
            .iter()
            .copied()
            .filter(|&id| Some(id) != attacker && active(id))
            .min_by(|&a, &b| (w.cars[a].pos.y * d).total_cmp(&(w.cars[b].pos.y * d)));
        for bot in &mut self.core.bots {
            bot.role = if Some(bot.car) == attacker {
                ATTACK
            } else if team.count >= 3 && bot.settings.roles == 1 && Some(bot.car) == deep {
                GOALIE
            } else {
                SUPPORT
            };
        }
    }

    /// Options for the team size of this tick.
    fn o(&self) -> &Opts {
        &self.opts[usize::from(self.size >= 3)]
    }

    fn d(&self) -> f64 {
        if self.core.team == 0 { 1.0 } else { -1.0 }
    }

    /// True when this strategy, not the core, positions bot `i` this tick.
    fn positions(&self, i: usize, ctx: &Context, team: Team) -> bool {
        let bot = &self.core.bots[i];
        let w = ctx.world;
        let c = &w.cars[bot.car];
        if !self.o().shadow
            || bot.role != SUPPORT
            || team.kickoff
            || c.frozen
            || c.is_demoed
            || !matches!(bot.maneuver, Maneuver::None)
            || !c.is_on_ground
            || c.up.z < 0.7
        {
            return false;
        }
        let d = self.d();
        let ball = w.ball.pos;
        let own_goal = Vec3::new(0.0, -d * 5120.0, 0.0);
        let goal_side = (c.pos.y - ball.y) * d < 0.0;
        let near = ball.distance(own_goal);
        let engage = goal_side
            && near < bot.settings.supportbox
            && (near < self.o().danger || self.lost(c, ctx));
        !engage
    }

    /// The attacker no longer has the play: it is gone, beaten by the ball, or much slower to it than `me`.
    fn lost(&self, me: &Car, ctx: &Context) -> bool {
        let w = ctx.world;
        let Some(id) = self.core.previous else {
            return true;
        };
        let attacker = &w.cars[id];
        if attacker.is_demoed || attacker.frozen || id == me.id {
            return true;
        }
        let ball = w.ball.pos;
        if (attacker.pos.y - ball.y) * self.d() > self.o().past {
            return true;
        }
        ground_time(me, ball, true) + self.o().margin < ground_time(attacker, ball, true)
    }

    /// The ball's predicted position `team.lead` seconds ahead, and its horizontal speed.
    fn ahead(&self, ctx: &Context) -> (Vec3, f64) {
        let ball = &ctx.world.ball;
        let slice = ctx
            .predictor
            .slices
            .iter()
            .find(|s| s.t >= self.o().lead)
            .or(ctx.predictor.slices.last());
        let (pos, vel) = slice.map_or((ball.pos, ball.vel), |s| (s.pos, s.vel));
        (pos, Vec3::new(vel.x, vel.y, 0.0).length())
    }

    /// Where the shadow waits, and the speed of that spot.
    fn shadow_spot(&self, i: usize, ctx: &Context) -> (Vec3, f64) {
        let d = self.d();
        let w = ctx.world;
        let bot = &self.core.bots[i];
        let c = &w.cars[bot.car];
        let own_goal = Vec3::new(0.0, -d * 5120.0, 0.0);
        let (ball, speed) = self.ahead(ctx);
        let mut target = Vec3::new(
            clamp(ball.x * self.o().lateral, -3000.0, 3000.0),
            clamp(ball.y - d * self.o().gap, -4700.0, 4700.0),
            0.0,
        );
        // Top up on the way, but only from a big pad close to the spot.
        if c.boost < bot.settings.padboost
            && let Some(pad) = nearest_pad(w, c.pos, true)
            && pad.distance(c.pos) < 1500.0
            && pad.distance(target) < 2500.0
        {
            target = pad;
        }
        if bot.settings.avoid {
            target = avoid_ball(c.pos, target, w.ball.pos, own_goal);
        }
        (target, speed)
    }
}
