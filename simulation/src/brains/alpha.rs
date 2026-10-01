//! Contest brain "alpha". It grew from the classic bot: the same intercept and car control,
//! with a team structure (attacker, second man, goalie), kickoff roles, and better shot aim.
use super::{Brain, Context, Params};
use crate::{
    DT,
    car::{Car, Controls},
    math::{atan2, clamp, cos, hypot2, sign, sin},
    predictor::{Predictor, Slice},
    vector::Vec3,
    world::World,
};
#[derive(Clone, Copy, Debug)]
pub struct Settings {
    /// Fraction of the target speed the car drives at.
    pub speed: f64,
    pub boost: bool,
    pub flip: bool,
    pub aerial: bool,
    /// Seconds between control updates. Between updates the bot eases steering toward its new choice.
    pub reaction: f64,
    /// Ignore the reaction delay.
    pub instant: bool,
    /// Prediction horizon in seconds.
    pub predict: f64,
    /// How far behind the ball the car lines up for a shot, from 0 (close) to 1 (far).
    pub aim: f64,
    /// Skill number recorded in regression traces.
    pub level: u32,
    /// 0: one attacker, everyone else supports. 1: attacker, second man, goalie.
    pub roles: u32,
    /// 0: every car goes for the kickoff. 1: only the closest car does.
    pub kickoff: u32,
    /// Goalie distance in front of the goal line.
    pub goalie: f64,
    /// How far the second man stays behind the ball.
    pub depth: f64,
    /// Shots aim at the goal point closest to the ball, at most this far from the center.
    pub post: f64,
    /// Retreat to the far post instead of the near post when caught upfield of the ball.
    pub farpost: bool,
    /// Distance from the ball at which the attacker flips into it.
    pub flipdist: f64,
    /// Line-up distance behind the ball, as a fraction of the distance to it.
    pub lineup: f64,
    /// Supports below this much boost detour to a big pad.
    pub padboost: f64,
    /// Lateral position of the retreat point.
    pub sidepost: f64,
    /// Never flip the ball toward the own goal mouth.
    pub safeflip: bool,
    /// Steer around the ball while retreating.
    pub avoid: bool,
    /// When an opponent reaches the ball this many seconds sooner, the attacker shadows instead of challenging.
    /// Zero disables shadowing.
    pub shadow: f64,
    /// The goalie fetches a big pad near its goal below this much boost while the ball is in the other half.
    pub goaliepad: f64,
    /// Speed of supports on their way to position.
    pub supportspeed: f64,
    /// The attacker boosts when the speed it needs exceeds this.
    pub attackboost: f64,
    /// The goalie moves to where the predicted ball crosses the goal line and jumps for high balls.
    pub keeper: bool,
    /// Upfield share of the clearing direction when hitting the ball away from the own goal.
    pub clear: f64,
    /// Seconds added per radian of turning in the reach estimate.
    pub turn: f64,
    /// Scales the average speed assumed when estimating reach.
    pub pace: f64,
    /// The goalie also attacks a ball this close to the own goal. Zero disables it.
    pub boxdist: f64,
    /// Supports also attack a ball this close to the own goal while goal-side of it. Zero disables it.
    pub supportbox: f64,
    /// Supports and the goalie steer around the ball when retreating past it.
    pub avoidall: bool,
    /// Distance the shadowing attacker keeps from the ball, toward its own goal.
    pub shadowdist: f64,
}
impl Settings {
    pub fn from_params(params: &mut Params) -> Result<Self, String> {
        Ok(Self {
            speed: params.number("speed", 1.0)?,
            boost: params.flag("boost", true)?,
            flip: params.flag("flip", true)?,
            aerial: params.flag("aerial", true)?,
            reaction: params.number("reaction", 0.06)?,
            instant: params.flag("instant", true)?,
            predict: params.number("predict", 4.0)?,
            aim: params.number("aim", 1.0)?,
            level: 2,
            roles: params.number("roles", 1.0)? as u32,
            kickoff: params.number("kickoff", 0.0)? as u32,
            goalie: params.number("goalie", 300.0)?,
            depth: params.number("depth", 2600.0)?,
            post: params.number("post", 0.0)?,
            farpost: params.flag("farpost", true)?,
            flipdist: params.number("flipdist", 330.0)?,
            lineup: params.number("lineup", 0.2)?,
            padboost: params.number("padboost", 40.0)?,
            sidepost: params.number("sidepost", 700.0)?,
            safeflip: params.flag("safeflip", true)?,
            avoid: params.flag("avoid", true)?,
            shadow: params.number("shadow", 0.0)?,
            goaliepad: params.number("goaliepad", 0.0)?,
            supportspeed: params.number("supportspeed", 1700.0)?,
            attackboost: params.number("attackboost", 1300.0)?,
            keeper: params.flag("keeper", false)?,
            clear: params.number("clear", 0.6)?,
            turn: params.number("turn", 0.3)?,
            pace: params.number("pace", 1.0)?,
            boxdist: params.number("boxdist", 6000.0)?,
            supportbox: params.number("supportbox", 20000.0)?,
            avoidall: params.flag("avoidall", false)?,
            shadowdist: params.number("shadowdist", 1400.0)?,
        })
    }
}
/// One `Bot` per car, with roles assigned each tick.
#[derive(Clone, Debug)]
pub struct Alpha {
    pub team: usize,
    pub bots: Vec<Bot>,
}
pub fn create(params: &mut Params, team: usize, cars: &[usize]) -> Result<Box<dyn Brain>, String> {
    let settings = Settings::from_params(params)?;
    Ok(Box::new(Alpha {
        team,
        bots: cars.iter().map(|&car| Bot::new(car, settings)).collect(),
    }))
}
impl Brain for Alpha {
    fn tick(&mut self, ctx: &Context, out: &mut [Controls]) {
        let roles = self.bots.first().map_or(0, |b| b.settings.roles);
        assign_roles(ctx.world, self.team, &mut self.bots, ctx.player, roles);
        let direction = if self.team == 0 { 1.0 } else { -1.0 };
        let depth = |b: &Bot| ctx.world.cars[b.car].pos.y * direction;
        let deepest = self
            .bots
            .iter()
            .filter(|b| !ctx.world.cars[b.car].is_demoed)
            .map(|b| b.car)
            .reduce(|a, b| {
                let (ba, bb) = (&ctx.world.cars[a], &ctx.world.cars[b]);
                let _ = depth;
                if ba.pos.y * direction <= bb.pos.y * direction { a } else { b }
            });
        for bot in &mut self.bots {
            bot.last_line = Some(bot.car) == deepest;
        }
        for (bot, out) in self.bots.iter_mut().zip(out) {
            *out = bot.tick(ctx.world, ctx.predictor);
        }
    }
    fn reset(&mut self) {
        for bot in &mut self.bots {
            bot.reset();
        }
    }
    fn trace(&self, out: &mut Vec<f64>) {
        let v = |out: &mut Vec<f64>, v: Vec3| out.extend([v.x, v.y, v.z]);
        for b in &self.bots {
            out.extend([b.car as f64, b.settings.level as f64, b.reaction_timer]);
            v(out, b.target);
            out.extend([b.kickoff_flip_done as u8 as f64, b.role as f64]);
            crate::snapshot::controls(out, b.out);
            match b.maneuver {
                Maneuver::None => out.push(0.0),
                Maneuver::Flip { t, pitch, yaw } => out.extend([1.0, t, pitch, yaw]),
                Maneuver::Aerial { t, target, arrive } => {
                    out.extend([2.0, t]);
                    v(out, target);
                    out.push(arrive);
                }
            }
        }
    }
    fn clone_box(&self) -> Box<dyn Brain> {
        Box::new(self.clone())
    }
}
pub const ATTACK: u8 = 0;
pub const SUPPORT: u8 = 1;
pub const GOALIE: u8 = 2;
#[derive(Clone, Copy, Debug)]
pub enum Maneuver {
    None,
    Flip { t: f64, pitch: f64, yaw: f64 },
    Aerial { t: f64, target: Vec3, arrive: f64 },
}
#[derive(Clone, Debug)]
pub struct Bot {
    pub car: usize,
    pub settings: Settings,
    pub maneuver: Maneuver,
    pub out: Controls,
    pub reaction_timer: f64,
    pub target: Vec3,
    pub kickoff_flip_done: bool,
    pub role: u8,
    /// Closest to the own goal of the team's bots.
    pub last_line: bool,
}
impl Bot {
    pub fn new(car: usize, settings: Settings) -> Self {
        Self {
            car,
            settings,
            maneuver: Maneuver::None,
            out: Controls::default(),
            reaction_timer: 0.0,
            target: Vec3::default(),
            kickoff_flip_done: false,
            role: ATTACK,
            last_line: false,
        }
    }
    pub fn reset(&mut self) {
        self.maneuver = Maneuver::None;
        self.kickoff_flip_done = false;
    }
    pub fn tick(&mut self, world: &World, predictor: &Predictor) -> Controls {
        let car = &world.cars[self.car];
        let settings = self.settings;
        let mut output = Controls::default();
        if car.is_demoed || car.frozen {
            self.out = output;
            return output;
        }
        let ball = &world.ball;
        let direction = if car.team == 0 { 1.0 } else { -1.0 };
        let own_goal = Vec3::new(0.0, -direction * 5120.0, 0.0);
        let post = settings.post;
        let goal_for = |pos: Vec3| Vec3::new(clamp(pos.x, -post, post), direction * (5120.0 + 400.0), 150.0);
        if matches!(self.maneuver, Maneuver::Flip { .. }) {
            return self.run_flip(car, DT);
        }
        if matches!(self.maneuver, Maneuver::Aerial { .. })
            && let Some(out) = self.run_aerial(car, predictor, DT)
        {
            return out;
        }
        if !car.is_on_ground && car.num_wheels_in_contact == 0 {
            self.recover(car, &mut output);
            output.throttle = 1.0;
            self.out = output;
            return output;
        }
        if car.world_contact && car.up.z < -0.5 {
            output.jump = !self.out.jump;
            self.out = output;
            return output;
        }
        let kickoff = !world.ball_touched
            && ball.vel.length_sq() < 1.0
            && ball.pos.x.abs() < 1.0
            && ball.pos.y.abs() < 1.0;
        let mut boost = false;
        let mut speed = 2300.0;
        if kickoff && (settings.kickoff == 0 || self.role == ATTACK) {
            self.target = Vec3::new(0.0, -direction * 60.0, 0.0);
            boost = settings.boost || car.boost > 0.0;
            let distance = car.pos.distance(ball.pos);
            if settings.flip
                && !self.kickoff_flip_done
                && distance < 520.0 + car.vel.length() * 0.18
                && car.vel.length() > 1000.0
            {
                self.kickoff_flip_done = true;
                return self.start_flip(car, -1.0, 0.0);
            }
        } else {
            self.kickoff_flip_done = false;
            let mut chosen = None;
            let mut last = None;
            let pace = self.average_speed(car).max(400.0) * settings.pace;
            for &slice in &predictor.slices {
                if slice.t > settings.predict {
                    continue;
                }
                last = Some(slice);
                if slice.pos.z > 300.0 && !(settings.aerial && slice.pos.z < 1500.0) {
                    continue;
                }
                // Exact shortcut: the aim point lies 141.25 from the slice, and angle and height only add time.
                // Slices that are out of reach by more than a unit of margin cannot pass the estimate below.
                let reach = slice.t * pace + (91.25 + 50.0) + 1.0;
                let dx = slice.pos.x - car.pos.x;
                let dy = slice.pos.y - car.pos.y;
                if dx * dx + dy * dy > reach * reach {
                    continue;
                }
                let mut aim = goal_for(slice.pos).minus(slice.pos);
                aim.z = 0.0;
                aim = aim.normalized();
                let point = slice.pos.with_scaled(aim, -(91.25 + 50.0));
                let travel = hypot2(point.x - car.pos.x, point.y - car.pos.y) / pace;
                if travel <= slice.t && estimate_time(car, point, slice.pos.z, travel, settings.turn) <= slice.t {
                    chosen = Some(slice);
                    break;
                }
            }
            let ours = chosen.map_or(f64::INFINITY, |s| s.t);
            let slice = chosen.or(last).unwrap_or(Slice {
                t: 0.0,
                pos: ball.pos,
                vel: ball.vel,
            });
            let crossing = if settings.keeper {
                predictor
                    .slices
                    .iter()
                    .take_while(|s| s.t <= 2.5)
                    .find(|s| s.pos.y * direction < -5000.0)
                    .filter(|s| s.pos.x.abs() < 1100.0)
            } else {
                None
            };
            let reach = match self.role {
                GOALIE => settings.boxdist,
                SUPPORT => settings.supportbox,
                _ => 0.0,
            };
            let defend =
                ball.pos.distance(own_goal) < reach && (car.pos.y - ball.pos.y) * direction < 0.0;
            let role = if defend { ATTACK } else { self.role };
            if (role == GOALIE || (role != ATTACK && self.last_line)) && let Some(cross) = crossing {
                self.target = Vec3::new(
                    clamp(cross.pos.x, -850.0, 850.0),
                    own_goal.y + direction * 150.0,
                    0.0,
                );
                let distance = car.pos.distance(self.target);
                speed = 2300.0;
                boost = settings.boost && distance > 400.0;
                let offset = ball.pos.minus(car.pos);
                if car.is_on_ground
                    && hypot2(offset.x, offset.y) < 450.0
                    && ball.pos.z > 170.0
                    && ball.pos.z < 600.0
                {
                    output.jump = true;
                    output.throttle = 1.0;
                    self.out = output;
                    return output;
                }
            } else if role == GOALIE {
                let x = clamp(ball.pos.x * 0.3, -700.0, 700.0);
                self.target = Vec3::new(x, own_goal.y + direction * settings.goalie, 0.0);
                if car.boost < settings.goaliepad
                    && ball.pos.y * direction > 0.0
                    && let Some(pad) = nearest_pad(world, car.pos, true)
                    && (pad.y - own_goal.y).abs() < 1500.0
                {
                    self.target = pad;
                }
                let distance = car.pos.distance(self.target);
                if distance < 200.0 {
                    output.throttle = clamp(-car.forward_speed() / 400.0, -1.0, 1.0);
                    self.out = output;
                    return output;
                }
                speed = clamp(distance * 1.5, 300.0, 2300.0);
                boost = settings.boost && distance > 2500.0;
            } else if role == SUPPORT {
                let y = clamp(ball.pos.y - direction * settings.depth, -4600.0, 4600.0);
                self.target = Vec3::new(clamp(ball.pos.x * 0.4, -2500.0, 2500.0), y, 0.0);
                speed = settings.supportspeed;
                if car.boost < settings.padboost
                    && let Some(pad) = nearest_pad(world, car.pos, true)
                    && pad.distance(car.pos) < 2500.0
                {
                    self.target = pad;
                }
            } else if settings.shadow > 0.0
                && (car.pos.y - ball.pos.y) * direction < 0.0
                && opponent_arrival(world, car.team, predictor, settings.predict) + settings.shadow < ours
            {
                // Stay between the ball and the own goal until the opponent commits.
                let back = own_goal.minus(ball.pos);
                let back = Vec3::new(back.x, back.y, 0.0).normalized();
                self.target = ball.pos.with_scaled(back, settings.shadowdist);
                self.target.z = 0.0;
                let distance = car.pos.distance(self.target);
                if distance < 300.0 {
                    self.target = ball.pos;
                    speed = 600.0;
                } else {
                    speed = clamp(distance * 1.5, 600.0, 2300.0);
                    boost = settings.boost && distance > 1500.0;
                }
            } else {
                let mut aim = goal_for(slice.pos).minus(slice.pos);
                aim.z = 0.0;
                aim = aim.normalized();
                let ahead = (car.pos.y - slice.pos.y) * direction > 200.0;
                let danger =
                    ball.vel.y * -direction > 500.0 && (ball.pos.y - own_goal.y).abs() < 5000.0;
                if ahead && (danger || (slice.pos.y - own_goal.y).abs() < 3000.0) {
                    let signed = sign(if slice.pos.x == 0.0 { 1.0 } else { slice.pos.x });
                    let side = if settings.farpost { -signed } else { signed };
                    let save = Vec3::new(side * settings.sidepost, own_goal.y + direction * 200.0, 0.0);
                    if (car.pos.y - own_goal.y) * direction > 800.0 {
                        self.target = save;
                        if settings.avoid {
                            self.target = avoid_ball(car.pos, save, ball.pos, own_goal);
                        }
                        boost = settings.boost && danger;
                    } else {
                        let aim = Vec3::new(signed, direction * settings.clear, 0.0).normalized();
                        self.target = slice.pos.with_scaled(aim, -(91.25 + 60.0));
                        boost = settings.boost;
                    }
                } else {
                    let offset = clamp(car.pos.distance(slice.pos) * settings.lineup, 91.25 + 40.0, 700.0)
                        * settings.aim
                        + (91.25 + 40.0) * (1.0 - settings.aim);
                    self.target = slice.pos.with_scaled(aim, -offset);
                    let distance = car.pos.distance(self.target);
                    speed = if slice.t > 0.05 {
                        distance / slice.t
                    } else {
                        2300.0
                    };
                    boost = settings.boost && speed > settings.attackboost;
                }
                if settings.aerial
                    && slice.pos.z > 350.0
                    && slice.pos.z < 1600.0
                    && car.boost > 30.0
                    && car.is_on_ground
                    && car.up.z > 0.9
                {
                    let offset = slice.pos.minus(car.pos);
                    let distance = hypot2(offset.x, offset.y);
                    let alignment =
                        (offset.x * car.forward.x + offset.y * car.forward.y) / distance.max(1.0);
                    let time = 0.35 + hypot2(distance, slice.pos.z - car.pos.z) / 1150.0;
                    if alignment > 0.9
                        && (time - slice.t).abs() < 0.25
                        && (slice.pos.y - car.pos.y) * direction > 0.0
                    {
                        self.maneuver = Maneuver::Aerial {
                            t: 0.0,
                            target: slice.pos,
                            arrive: slice.t,
                        };
                        return self.run_aerial(car, predictor, DT).unwrap_or(output);
                    }
                }
                let distance = car.pos.distance(ball.pos);
                if settings.flip
                    && distance < settings.flipdist
                    && ball.pos.z < 180.0
                    && car.vel.length() > 700.0
                {
                    let offset = ball.pos.minus(car.pos);
                    let angle = atan2(offset.dot(car.left), offset.dot(car.forward));
                    let toward_own = settings.safeflip && {
                        let d = Vec3::new(offset.x, offset.y, 0.0).normalized();
                        d.y * direction < -0.1 && {
                            let t = (own_goal.y - ball.pos.y) / d.y;
                            (ball.pos.x + d.x * t).abs() < 1300.0
                        }
                    };
                    if angle.abs() < 0.5 && !toward_own {
                        return self.start_flip(car, -cos(angle), -sin(angle) * 1.2);
                    }
                }
            }
        }
        if settings.avoidall
            && !kickoff
            && self.role != ATTACK
            && (car.pos.y - ball.pos.y) * direction > 0.0
        {
            self.target = avoid_ball(car.pos, self.target, ball.pos, own_goal);
        }
        self.drive_to(
            car,
            &mut output,
            self.target,
            boost,
            speed * settings.speed + (1.0 - settings.speed) * 0.0,
        );
        self.apply_reaction(output, DT);
        self.out
    }
    fn average_speed(&self, car: &Car) -> f64 {
        let settings = self.settings;
        let speed = car.forward_speed().max(0.0);
        let maximum = (if settings.boost && car.boost > 10.0 {
            2000.0
        } else {
            1350.0
        }) * settings.speed;
        let time = ((maximum - speed) / 1400.0).max(0.0);
        speed + (maximum - speed) * (0.5 * time).min(1.0)
    }
    fn drive_to(&self, car: &Car, out: &mut Controls, target: Vec3, boost: bool, speed: f64) {
        let offset = target.minus(car.pos);
        let forward = offset.dot(car.forward);
        let lateral = offset.dot(car.left);
        let angle = atan2(lateral, forward);
        let distance = hypot2(forward, lateral);
        let angular = car.ang_vel.dot(car.up);
        out.steer = clamp(-angle * 3.2 + angular * 0.18, -1.0, 1.0);
        let current = car.forward_speed();
        let desired = clamp(speed, 300.0, 2300.0);
        if angle.abs() > 2.2 && distance < 700.0 && current < 400.0 {
            out.throttle = -1.0;
            out.steer = -out.steer;
        } else {
            out.throttle = if current < desired {
                1.0
            } else if current > desired + 300.0 {
                -0.3
            } else {
                0.1
            };
        }
        out.handbrake = angle.abs() > 1.6 && current > 700.0 && car.is_on_ground;
        out.boost = boost
            && angle.abs() < 0.3
            && current < desired + 100.0
            && current < 2280.0
            && car.is_on_ground
            && car.up.z > 0.6;
    }
    fn apply_reaction(&mut self, out: Controls, dt: f64) {
        self.reaction_timer -= dt;
        if self.reaction_timer <= 0.0 || self.settings.instant {
            self.out = out;
            self.reaction_timer = self.settings.reaction;
        } else {
            self.out.steer += (out.steer - self.out.steer) * 0.35;
            self.out.throttle = out.throttle;
            self.out.jump = out.jump;
        }
    }
    fn recover(&self, car: &Car, out: &mut Controls) {
        let mut direction = car.vel;
        direction.z = 0.0;
        let forward = if direction.length_sq() > 100.0 {
            direction.normalized()
        } else {
            Vec3::new(car.forward.x, car.forward.y, 0.0).normalized()
        };
        orient(car, forward, Vec3::new(0.0, 0.0, 1.0), out);
    }
    fn start_flip(&mut self, car: &Car, pitch: f64, yaw: f64) -> Controls {
        self.maneuver = Maneuver::Flip { t: 0.0, pitch, yaw };
        self.run_flip(car, 0.0)
    }
    fn run_flip(&mut self, car: &Car, dt: f64) -> Controls {
        let Maneuver::Flip { mut t, pitch, yaw } = self.maneuver else {
            unreachable!()
        };
        t += dt;
        let mut out = Controls {
            throttle: 1.0,
            ..Controls::default()
        };
        self.maneuver = Maneuver::Flip { t, pitch, yaw };
        if t < 0.07 {
            out.jump = true;
        } else if t < 0.1 {
            out.jump = false;
        } else if t < 0.2 {
            out.jump = true;
            out.pitch = clamp(pitch, -1.0, 1.0);
            out.yaw = clamp(yaw, -1.0, 1.0);
        } else if t >= 1.1 || car.is_on_ground {
            self.maneuver = Maneuver::None;
        }
        self.out = out;
        out
    }
    fn run_aerial(&mut self, car: &Car, predictor: &Predictor, dt: f64) -> Option<Controls> {
        let Maneuver::Aerial {
            mut t,
            mut target,
            arrive,
        } = self.maneuver
        else {
            unreachable!()
        };
        t += dt;
        let remaining = arrive - t;
        let slice = predictor
            .slices
            .iter()
            .find(|s| s.t >= remaining)
            .or(predictor.slices.last());
        if let Some(slice) = slice {
            target = slice.pos;
        }
        if t > 3.0 || remaining < -0.3 || (t > 0.3 && car.is_on_ground) || car.boost <= 0.0 {
            self.maneuver = Maneuver::None;
            return None;
        }
        self.maneuver = Maneuver::Aerial { t, target, arrive };
        let mut out = Controls::default();
        if t < 0.2 {
            out.jump = true;
        } else if t < 0.23 {
            out.jump = false;
        } else if t < 0.27 {
            out.jump = true;
        }
        let time = remaining.max(0.05);
        let mut correction = target.minus(car.pos).with_scaled(car.vel, -time);
        correction.z -= 0.5 * -650.0 * time * time;
        let forward = correction.normalized();
        let acceleration = (2.0 * correction.length()) / (time * time);
        orient(car, forward, Vec3::new(0.0, 0.0, 1.0), &mut out);
        out.boost = car.forward.dot(forward) > 0.7 && acceleration > 300.0;
        out.throttle = 1.0;
        self.out = out;
        Some(out)
    }
}
/// The earliest time any opponent can reach the ball, by the same estimate the bot uses for itself.
fn opponent_arrival(world: &World, team: usize, predictor: &Predictor, horizon: f64) -> f64 {
    let mut best = f64::INFINITY;
    for car in &world.cars {
        if car.team == team || car.is_demoed {
            continue;
        }
        let speed = car.forward_speed().max(0.0);
        let maximum = if car.boost > 10.0 { 2000.0 } else { 1350.0 };
        let time = ((maximum - speed) / 1400.0).max(0.0);
        let pace = (speed + (maximum - speed) * (0.5 * time).min(1.0)).max(400.0);
        for slice in &predictor.slices {
            if slice.t > horizon || slice.t >= best {
                break;
            }
            if slice.pos.z > 300.0 {
                continue;
            }
            let distance = hypot2(slice.pos.x - car.pos.x, slice.pos.y - car.pos.y) - 141.25;
            let travel = distance.max(0.0) / pace;
            if travel <= slice.t && estimate_time(car, slice.pos, slice.pos.z, travel, 0.45) <= slice.t {
                best = slice.t;
                break;
            }
        }
    }
    best
}
/// If the ball lies near the straight path to `target`, go to a point beside it, toward the goal center line.
fn avoid_ball(from: Vec3, target: Vec3, ball: Vec3, own_goal: Vec3) -> Vec3 {
    let path = Vec3::new(target.x - from.x, target.y - from.y, 0.0);
    let length = path.length();
    if length < 1.0 {
        return target;
    }
    let along = path.scaled(1.0 / length);
    let rel = Vec3::new(ball.x - from.x, ball.y - from.y, 0.0);
    let t = rel.dot(along);
    if t < 0.0 || t > length {
        return target;
    }
    let lateral = rel.x * along.y - rel.y * along.x;
    if lateral.abs() > 350.0 {
        return target;
    }
    // Pass between the ball and the center line, so a graze pushes the ball toward the side wall.
    let normal = Vec3::new(along.y, -along.x, 0.0);
    let side = if (ball.x - own_goal.x) * normal.x >= 0.0 { -1.0 } else { 1.0 };
    Vec3::new(ball.x + normal.x * side * 500.0, ball.y + normal.y * side * 500.0, 0.0)
}
/// `travel` is the horizontal distance divided by the average speed.
fn estimate_time(car: &Car, target: Vec3, height: f64, travel: f64, turn: f64) -> f64 {
    let offset = target.minus(car.pos);
    let angle = atan2(offset.dot(car.left), offset.dot(car.forward)).abs();
    travel + angle * turn + (height - 150.0).max(0.0) * 0.004
}
fn orient(car: &Car, forward: Vec3, up: Vec3, out: &mut Controls) {
    let f = car.mat.transpose_mul(forward);
    let u = car.mat.transpose_mul(up);
    let angular = car.mat.transpose_mul(car.ang_vel);
    let pitch = atan2(
        f.z,
        hypot2(f.x, f.y) * sign(if f.x == 0.0 { 1.0 } else { f.x }),
    );
    let yaw = atan2(-f.y, f.x);
    let roll = atan2(-u.y, u.z);
    out.pitch = clamp(pitch * 3.2 - (-angular.y) * 0.55, -1.0, 1.0);
    out.yaw = clamp(yaw * 3.2 - (-angular.z) * 0.6, -1.0, 1.0);
    out.roll = clamp(roll * 2.2 - angular.x * 0.35, -1.0, 1.0);
    if yaw.abs() > 1.2 {
        out.roll *= 0.3;
    }
}
fn nearest_pad(world: &World, position: Vec3, big: bool) -> Option<Vec3> {
    let mut closest = None;
    let mut minimum = f64::INFINITY;
    for pad in &world.pads {
        if pad.cooldown > 0.0 || (big && !pad.big) {
            continue;
        }
        let distance = pad.pos.distance(position);
        if distance < minimum {
            minimum = distance;
            closest = Some(pad.pos);
        }
    }
    closest
}
/// The car with the lowest cost attacks. With `roles = 1` the remaining car closest to its own goal keeps goal
/// when the team has three, and the rest support. A human teammate takes part in the choice but is never steered.
fn assign_roles(world: &World, team: usize, bots: &mut [Bot], player: Option<usize>, roles: u32) {
    let direction = if team == 0 { 1.0 } else { -1.0 };
    let ids = || {
        bots.iter()
            .map(|b| b.car)
            .chain(player.filter(|&p| world.cars[p].team == team))
    };
    let cost = |id: usize| {
        let car = &world.cars[id];
        car.pos.distance(world.ball.pos) + ((car.pos.y - world.ball.pos.y) * direction).max(0.0) * 1.5
    };
    let best = ids().reduce(|a, b| if cost(a) < cost(b) { a } else { b });
    let mut goalie = None;
    if roles == 1 && ids().count() >= 3 {
        let depth = |id: usize| world.cars[id].pos.y * direction;
        goalie = ids()
            .filter(|&id| Some(id) != best)
            .reduce(|a, b| if depth(a) <= depth(b) { a } else { b });
    }
    for bot in bots.iter_mut() {
        bot.role = if Some(bot.car) == best {
            ATTACK
        } else if Some(bot.car) == goalie {
            GOALIE
        } else {
            SUPPORT
        };
    }
}
