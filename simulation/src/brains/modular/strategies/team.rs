//! Team play on top of alphabravo's tactics. Every option is off by default, and then this strategy plays
//! exactly as alphabravo: it runs the core tactics and only replaces some cars' positioning.
//!
//! - `team.shadow`: a support stops double-committing. While the attacker has the play, it follows the ball
//!   `team.gap` behind it, ready for a rebound or a pass, and takes over as soon as the attacker loses it.
//! - `team.keeper`: the 3v3 goalkeeper stands this far behind the ball instead of on the goal line.
use crate::{
    brains::{
        Context, Params,
        modular::{
            kit::{
                Bot, GOALIE, Maneuver, Mode, SUPPORT, Settings, Strategy, Team, avoid_ball,
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
    shadow: bool,
    gap: f64,
    lateral: f64,
    lead: f64,
    margin: f64,
    past: f64,
    danger: f64,
    keeper: f64,
    keepmax: f64,
}

pub fn create(
    params: &mut Params,
    team: usize,
    cars: &[usize],
    settings: Settings,
) -> Result<Box<dyn Strategy>, String> {
    Ok(Box::new(TeamPlay {
        core: Tactics {
            team,
            bots: cars.iter().map(|&id| Bot::new(id, settings)).collect(),
            previous: None,
            recovering: vec![false; cars.len()],
            shotzone: params.number("shotzone", 5000.0)?,
        },
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
        keeper: params.number("team.keeper", 0.0)?,
        // The keeper goes no farther upfield than this, in field units from the center line.
        keepmax: params.number("team.keepmax", -1000.0)?,
    }))
}

impl Strategy for TeamPlay {
    fn assign(&mut self, ctx: &Context) -> Team {
        self.core.assign(ctx)
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
        let target = if self.core.bots[i].role == GOALIE {
            self.keep_spot(i, ctx)
        } else {
            self.shadow_spot(i, ctx)
        };
        let bot = &mut self.core.bots[i];
        bot.kickoff_flip_done = false;
        let c = &ctx.world.cars[bot.car];
        let distance = c.pos.distance(target.0);
        let mut out = Controls::default();
        if distance < 120.0 && target.1 < 300.0 {
            out.throttle = clamp(-c.forward_speed() / 400.0, -1.0, 1.0);
        } else {
            let speed = clamp(distance * 1.5 + target.1, 0.0, 2300.0);
            bot.drive_to(
                c,
                &mut out,
                target.0,
                bot.settings.boost && distance > 1800.0,
                speed,
            );
        }
        bot.target = target.0;
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
    fn d(&self) -> f64 {
        if self.core.team == 0 { 1.0 } else { -1.0 }
    }

    /// True when this strategy, not the core, positions bot `i` this tick.
    fn positions(&self, i: usize, ctx: &Context, team: Team) -> bool {
        let bot = &self.core.bots[i];
        let w = ctx.world;
        let c = &w.cars[bot.car];
        if team.kickoff
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
        match bot.role {
            SUPPORT if self.shadow => {
                let near = ball.distance(own_goal);
                let engage = goal_side
                    && near < bot.settings.supportbox
                    && (near < self.danger || self.lost(c, ctx));
                !engage
            }
            GOALIE if self.keeper > 0.0 => {
                !(goal_side && ball.distance(own_goal) < bot.settings.boxdist)
            }
            _ => false,
        }
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
        if (attacker.pos.y - ball.y) * self.d() > self.past {
            return true;
        }
        ground_time(me, ball, true) + self.margin < ground_time(attacker, ball, true)
    }

    /// The ball's predicted position `team.lead` seconds ahead, and its horizontal speed.
    fn ahead(&self, ctx: &Context) -> (Vec3, f64) {
        let ball = &ctx.world.ball;
        let slice = ctx
            .predictor
            .slices
            .iter()
            .find(|s| s.t >= self.lead)
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
        let (ball, speed) = self.ahead(ctx);
        let mut target = Vec3::new(
            clamp(ball.x * self.lateral, -3000.0, 3000.0),
            clamp(ball.y - d * self.gap, -4700.0, 4700.0),
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
        let own_goal = Vec3::new(0.0, -d * 5120.0, 0.0);
        if bot.settings.avoid {
            target = avoid_ball(c.pos, target, w.ball.pos, own_goal);
        }
        (target, speed)
    }

    /// Where the keeper waits: `team.keeper` behind the ball, between the goal line and `team.keepmax`.
    fn keep_spot(&self, i: usize, ctx: &Context) -> (Vec3, f64) {
        let d = self.d();
        let w = ctx.world;
        let bot = &self.core.bots[i];
        let c = &w.cars[bot.car];
        let (ball, _) = self.ahead(ctx);
        let line = -5120.0 + bot.settings.goalie;
        let up = clamp(ball.y * d - self.keeper, line, self.keepmax.max(line));
        let x = clamp(ball.x * 0.3, -700.0, 700.0) * clamp((up - line) / 2000.0 + 1.0, 1.0, 3.0);
        let mut target = Vec3::new(x, up * d, 0.0);
        let own_goal = Vec3::new(0.0, -d * 5120.0, 0.0);
        if bot.settings.avoid {
            target = avoid_ball(c.pos, target, w.ball.pos, own_goal);
        }
        (target, 0.0)
    }
}
