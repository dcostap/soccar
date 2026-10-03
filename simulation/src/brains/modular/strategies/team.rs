//! Team play on top of alphabravo's tactics. Every option is off by default, and then this strategy plays
//! exactly as alphabravo: it runs the core tactics and only replaces some cars' positioning.
//!
//! - `team.shadow`: a support stops double-committing. While the attacker has the play, it follows the ball
//!   `team.gap` behind it, ready for a rebound or a pass, and takes over as soon as the attacker loses it.
//! - `team.keeper`: the 3v3 goalkeeper stands this far behind the ball instead of on the goal line.
//! - `team.cross`: with the ball wide in the attacking third, the shadow waits in the slot in front of goal
//!   (`team.wait` 0 disables this),
//!   and the attacker passes the ball to the slot instead of shooting from a poor angle (`team.pass`).
use crate::{
    brains::{
        Context, Params,
        modular::{
            kit::{
                ATTACK, Bot, GOALIE, Maneuver, Mode, Plan, SUPPORT, Settings, Strategy, Team,
                avoid_ball, drive, ground_time, nearest_pad, own_goal_touch,
            },
            tactics::Tactics,
        },
    },
    car::{Car, Controls},
    math::{atan2, clamp, cos, hypot2, sin},
    predictor::Slice,
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
    keeper: f64,
    keepmax: f64,
    cross: bool,
    crossx: f64,
    crossy: f64,
    slot: f64,
    far: f64,
    wait: f64,
    ready: f64,
    crossspeed: f64,
    crossflip: bool,
    pass: bool,
}

/// What this strategy does with a car this tick.
enum Choice {
    /// The core tactics drive it.
    Core,
    /// Drive to a spot, matching the given speed there.
    Spot(Vec3, f64),
    /// Pass the ball to this point.
    Cross(Vec3),
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
            keeper: params.number("team.keeper", 0.0)?,
            // The keeper goes no farther upfield than this, in field units from the center line.
            keepmax: params.number("team.keepmax", -1000.0)?,
            cross: params.flag("team.cross", false)?,
            // A ball at least this far from the middle and this far upfield is crossed.
            crossx: params.number("team.crossx", 1000.0)?,
            crossy: params.number("team.crossy", 3000.0)?,
            // The cross aims this far in front of the rival goal line, `team.far` past the middle.
            slot: params.number("team.slot", 1100.0)?,
            far: params.number("team.far", 300.0)?,
            // The finisher waits this far in front of the rival goal line.
            wait: params.number("team.wait", 2600.0)?,
            // A teammate counts as ready within this distance behind the cross point.
            ready: params.number("team.ready", 2500.0)?,
            crossspeed: params.number("team.crossspeed", 2300.0)?,
            crossflip: params.flag("team.crossflip", true)?,
            // With `team.cross`, false keeps the slot positioning but never passes.
            pass: params.flag("team.pass", true)?,
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
            keeper: params.number(&format!("team.{size}.keeper"), base.keeper)?,
            keepmax: params.number(&format!("team.{size}.keepmax"), base.keepmax)?,
            cross: params.flag(&format!("team.{size}.cross"), base.cross)?,
            crossx: params.number(&format!("team.{size}.crossx"), base.crossx)?,
            crossy: params.number(&format!("team.{size}.crossy"), base.crossy)?,
            slot: params.number(&format!("team.{size}.slot"), base.slot)?,
            far: params.number(&format!("team.{size}.far"), base.far)?,
            wait: params.number(&format!("team.{size}.wait"), base.wait)?,
            ready: params.number(&format!("team.{size}.ready"), base.ready)?,
            crossspeed: params.number(&format!("team.{size}.crossspeed"), base.crossspeed)?,
            crossflip: params.flag(&format!("team.{size}.crossflip"), base.crossflip)?,
            pass: params.flag(&format!("team.{size}.pass"), base.pass)?,
        })
    }
}

impl Strategy for TeamPlay {
    fn assign(&mut self, ctx: &Context) -> Team {
        let team = self.core.assign(ctx);
        self.size = team.count;
        team
    }
    fn mode(&self, i: usize, ctx: &Context, team: Team) -> Mode {
        // A cross reports `Strike`: a skill that finds a scoring touch, such as touch-a, still shoots instead.
        match self.choice(i, ctx, team) {
            Choice::Core => self.core.mode(i, ctx, team),
            Choice::Spot(..) => Mode::Position,
            Choice::Cross(_) => Mode::Strike,
        }
    }
    fn act(&mut self, i: usize, ctx: &Context, team: Team) -> Controls {
        let (spot, pace) = match self.choice(i, ctx, team) {
            Choice::Core => return self.core.act(i, ctx, team),
            Choice::Cross(point) => return self.pass(i, ctx, point),
            Choice::Spot(spot, pace) => (spot, pace),
        };
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
    /// Options for the team size of this tick.
    fn o(&self) -> &Opts {
        &self.opts[usize::from(self.size >= 3)]
    }

    fn d(&self) -> f64 {
        if self.core.team == 0 { 1.0 } else { -1.0 }
    }

    fn choice(&self, i: usize, ctx: &Context, team: Team) -> Choice {
        if self.positions(i, ctx, team) {
            let (spot, pace) = if self.core.bots[i].role == GOALIE {
                self.keep_spot(i, ctx)
            } else {
                self.shadow_spot(i, ctx)
            };
            Choice::Spot(spot, pace)
        } else if let Some(point) = self.cross_point(i, ctx, team) {
            Choice::Cross(point)
        } else {
            Choice::Core
        }
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
            SUPPORT if self.o().shadow => {
                let near = ball.distance(own_goal);
                let engage = goal_side
                    && near < bot.settings.supportbox
                    && (near < self.o().danger || self.lost(c, ctx));
                !engage
            }
            GOALIE if self.o().keeper > 0.0 => {
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
        if self.o().cross
            && self.o().wait > 0.0
            && ball.y * d > self.o().crossy - 800.0
            && ball.x.abs() > self.o().crossx * 0.7
        {
            // Wait in the slot for a cross.
            let spot = Vec3::new(-ball.x * 0.1, d * (5120.0 - self.o().wait), 0.0);
            return (avoid_ball(c.pos, spot, w.ball.pos, own_goal), 0.0);
        }
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

    /// Where the keeper waits: `team.keeper` behind the ball, between the goal line and `team.keepmax`.
    fn keep_spot(&self, i: usize, ctx: &Context) -> (Vec3, f64) {
        let d = self.d();
        let w = ctx.world;
        let bot = &self.core.bots[i];
        let c = &w.cars[bot.car];
        let (ball, _) = self.ahead(ctx);
        let line = -5120.0 + bot.settings.goalie;
        let up = clamp(
            ball.y * d - self.o().keeper,
            line,
            self.o().keepmax.max(line),
        );
        let x = clamp(ball.x * 0.3, -700.0, 700.0) * clamp((up - line) / 2000.0 + 1.0, 1.0, 3.0);
        let mut target = Vec3::new(x, up * d, 0.0);
        let own_goal = Vec3::new(0.0, -d * 5120.0, 0.0);
        if bot.settings.avoid {
            target = avoid_ball(c.pos, target, w.ball.pos, own_goal);
        }
        (target, 0.0)
    }

    /// Where the attacker should cross the ball to, if it should cross now.
    fn cross_point(&self, i: usize, ctx: &Context, team: Team) -> Option<Vec3> {
        let bot = &self.core.bots[i];
        let w = ctx.world;
        let c = &w.cars[bot.car];
        if !self.o().cross
            || !self.o().pass
            || bot.role != ATTACK
            || team.kickoff
            || team.count < 2
            || c.frozen
            || c.is_demoed
            || !matches!(bot.maneuver, Maneuver::None)
            || !c.is_on_ground
            || c.up.z < 0.7
        {
            return None;
        }
        let d = self.d();
        let ball = &w.ball;
        if ball.pos.z > 250.0
            || ball.pos.y * d < self.o().crossy
            || ball.pos.y * d > 5000.0
            || ball.pos.x.abs() < self.o().crossx
        {
            return None;
        }
        // A ball already on its way in needs no pass.
        let line = 5120.0 + ball.radius;
        if ctx.predictor.slices.iter().any(|s| s.pos.y * d > line) {
            return None;
        }
        let side = if ball.pos.x > 0.0 { 1.0 } else { -1.0 };
        let point = Vec3::new(-side * self.o().far, d * (5120.0 - self.o().slot), 0.0);
        // The car must come at the ball from the side away from the point.
        let to_ball = Vec3::new(ball.pos.x - c.pos.x, ball.pos.y - c.pos.y, 0.0);
        let to_point = Vec3::new(point.x - ball.pos.x, point.y - ball.pos.y, 0.0);
        if to_ball.dot(to_point) <= 0.0 {
            return None;
        }
        let ready = w.cars.iter().any(|m| {
            let up = m.pos.y * d;
            m.team == self.core.team
                && m.id != c.id
                && !m.is_demoed
                && !m.frozen
                && up > point.y * d - self.o().ready
                && up < point.y * d + 300.0
                && m.pos.x.abs() < 2500.0
        });
        ready.then_some(point)
    }

    /// Strikes the ball toward `point`, with the core's strike planner and flip.
    fn pass(&mut self, i: usize, ctx: &Context, point: Vec3) -> Controls {
        let w = ctx.world;
        let d = self.d();
        let ball = w.ball.pos;
        let speed = self.o().crossspeed;
        let flip = self.o().crossflip;
        let bot = &mut self.core.bots[i];
        bot.kickoff_flip_done = false;
        let c = &w.cars[bot.car];
        let p = plan_to(ctx, c, bot.settings, point);
        bot.target = p.target;
        let mut output = drive(
            c,
            p.target,
            speed * bot.settings.speed,
            bot.settings.boost && c.boost > 0.0,
        );
        let delta = ball.minus(c.pos);
        let angle = atan2(delta.dot(c.left), delta.dot(c.forward));
        let dist = hypot2(delta.x, delta.y);
        if flip
            && bot.settings.flip
            && !own_goal_touch(c.pos, ball, d)
            && dist < 320.0
            && ball.z < 175.0
            && c.forward_speed() > 650.0
            && angle.abs() < 0.4
        {
            bot.maneuver = Maneuver::Flip {
                t: 0.0,
                pitch: -cos(angle),
                yaw: -sin(angle),
            };
            output = bot.tick(w, ctx.predictor);
        }
        bot.out = output;
        output
    }
}

/// The core's strike search (`tactics::plan`), aimed at `point` instead of the rival goal.
fn plan_to(ctx: &Context, c: &Car, settings: Settings, point: Vec3) -> Plan {
    let w = ctx.world;
    let mut best = Plan {
        slice: Slice {
            t: 0.0,
            pos: w.ball.pos,
            vel: w.ball.vel,
        },
        target: w.ball.pos,
        cost: 100.0,
    };
    let speed = c.forward_speed().max(0.0);
    let boosted = settings.boost && c.boost > 10.0;
    let maximum = (if boosted { 2250.0 } else { 1450.0 }) * settings.speed.max(0.1);
    let acceleration = if boosted { 1400.0 } else { 900.0 };
    for s in ctx.predictor.slices.iter().step_by(2) {
        if s.t > settings.predict || s.pos.z > 450.0 {
            continue;
        }
        let dist = hypot2(s.pos.x - c.pos.x, s.pos.y - c.pos.y);
        let mut aim = point.minus(s.pos);
        aim.z = 0.0;
        aim = aim.normalized();
        let offset = clamp(dist * 0.22 * settings.aim, 65.0, 500.0);
        let target = s.pos.with_scaled(aim, -offset);
        let delta = target.minus(c.pos);
        let angle = atan2(delta.dot(c.left), delta.dot(c.forward)).abs();
        let travel = hypot2(delta.x, delta.y);
        let t = (s.t - angle * 0.32).max(0.0);
        let cap_time = ((maximum - speed) / acceleration).max(0.0);
        let accelerating = t.min(cap_time);
        let reach = speed * accelerating
            + 0.5 * acceleration * accelerating * accelerating
            + maximum * (t - accelerating);
        let height_cost = (s.pos.z - 180.0).max(0.0) * 0.001;
        let deficit = (travel - reach - 120.0).max(0.0) / maximum;
        let cost = s.t + deficit * 2.0 + height_cost;
        if cost < best.cost {
            best = Plan {
                slice: *s,
                target,
                cost,
            };
        }
        if deficit == 0.0 && s.t > height_cost {
            best = Plan {
                slice: *s,
                target,
                cost,
            };
            break;
        }
    }
    best
}
