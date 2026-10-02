//! The modular brain: a swappable team strategy, with swappable skills on top.
//!
//! - `tactics.rs` and `pilot.rs` are exact copies of alphabravo and alpha's car control. `tactics.rs` is the
//!   default strategy. With no other settings, this brain drives exactly as alphabravo.
//! - `kit.rs` defines the `Strategy` and `Skill` traits, the `Situation` a skill sees, and shared tools.
//! - `strategies/` holds other strategies. A brain selects one for every team size, `strategy = alpha`,
//!   or for one size, `strategy.1 = alpha`. Team size counts a human teammate.
//! - `skills/` holds the skills. A brain selects them in priority order: `skills = aerial, bounce`.
//!   Each tick a skill may take a car from the strategy for that tick, keep it while it finishes a move,
//!   or adjust the strategy's controls. See `kit.rs` and `arena/HACKATHON.md`.
//!
//! The fingerprint covers these four core files and the source of each selected strategy and skill,
//! so adding one retires only the brains that select it. Edits to the core retire every modular brain.
pub mod kit;
pub mod pilot;
pub mod skills;
pub mod strategies;
pub mod tactics;

use super::{Brain, BrainSpec, Context, Params};
use crate::car::Controls;
use kit::{Mode, Role, Situation, Skill, Strategy};
use pilot::{Bot, Maneuver, Settings};

/// Core source text, part of every modular brain's fingerprint.
pub const SOURCE: &str = concat!(
    include_str!("mod.rs"),
    "\n",
    include_str!("pilot.rs"),
    "\n",
    include_str!("tactics.rs"),
    "\n",
    include_str!("kit.rs")
);

#[derive(Clone, Debug)]
struct Modular {
    team: usize,
    /// The distinct selected strategies. `by_size[n]` indexes the one for a team of `n` cars, counting
    /// a human teammate; index 0 serves larger teams.
    strategies: Vec<Box<dyn Strategy>>,
    by_size: [usize; 4],
    /// `skills[i][k]` is skill `k`, in priority order, for the brain's car `i`.
    skills: Vec<Vec<Box<dyn Skill>>>,
    /// The skill that drove car `i` on the previous tick.
    holder: Vec<Option<usize>>,
}

/// Skill names from the `skills` setting, in priority order.
pub fn skill_names(text: &str) -> Result<Vec<&str>, String> {
    let mut names: Vec<&str> = Vec::new();
    for name in text.split(',').map(str::trim).filter(|n| !n.is_empty()) {
        if skills::find(name).is_none() {
            return Err(format!("skills: unknown skill {name}"));
        }
        if names.contains(&name) {
            return Err(format!("skills: duplicate skill {name}"));
        }
        names.push(name);
    }
    Ok(names)
}

/// Strategy names for team sizes 1, 2, and 3 or more, from `strategy` and `strategy.1` to `strategy.3`.
fn strategy_names(get: &mut dyn FnMut(&str, &str) -> String) -> Result<[String; 3], String> {
    let all = get("strategy", "alphabravo");
    let mut names: [String; 3] = Default::default();
    for (n, name) in names.iter_mut().enumerate() {
        *name = get(&format!("strategy.{}", n + 1), &all);
        if strategies::find(name).is_none() {
            return Err(format!("strategy: unknown strategy {name}"));
        }
    }
    Ok(names)
}

/// Source text of the selected strategies and skills, added to the core source in the fingerprint.
pub fn extra_source(spec: &BrainSpec) -> String {
    let mut get = |key: &str, default: &str| {
        spec.settings
            .iter()
            .find(|(k, _)| k == key)
            .map_or(default.to_string(), |(_, v)| v.clone())
    };
    let mut out = String::new();
    let mut seen: Vec<String> = Vec::new();
    for name in strategy_names(&mut get).unwrap_or_default() {
        let def = strategies::find(&name).unwrap();
        if !seen.contains(&name) && !def.source.is_empty() {
            out += &format!("\n[strategy {}]\n{}", def.name, def.source);
        }
        seen.push(name);
    }
    for name in skill_names(&get("skills", "")).unwrap_or_default() {
        let def = skills::find(name).unwrap();
        out += &format!("\n[skill {}]\n{}", def.name, def.source);
    }
    out
}

pub fn create(params: &mut Params, team: usize, cars: &[usize]) -> Result<Box<dyn Brain>, String> {
    let settings = Settings::from_params(params)?;
    let names = strategy_names(&mut |key, default| params.text(key, default))?;
    // Build each distinct strategy once, in size order, so its settings are read once.
    let mut chosen: Vec<&str> = Vec::new();
    let mut strategies = Vec::new();
    let mut by_size = [0; 4];
    for (n, name) in names.iter().enumerate() {
        let k = match chosen.iter().position(|c| c == name) {
            Some(k) => k,
            None => {
                chosen.push(name);
                strategies.push((strategies::find(name).unwrap().create)(
                    params, team, cars, settings,
                )?);
                chosen.len() - 1
            }
        };
        by_size[n + 1] = k;
    }
    by_size[0] = by_size[3];
    let text = params.text("skills", "");
    // Build each skill once, even with no cars, so its settings are checked.
    let prototypes = skill_names(&text)?
        .into_iter()
        .map(|name| (skills::find(name).unwrap().create)(params))
        .collect::<Result<Vec<_>, _>>()?;
    Ok(Box::new(Modular {
        team,
        strategies,
        by_size,
        skills: cars.iter().map(|_| prototypes.clone()).collect(),
        holder: vec![None; cars.len()],
    }))
}

/// The per-car facts a `Situation` adds to the context.
struct Facts {
    index: usize,
    side: usize,
    d: f64,
    mode: Mode,
    team: kit::Team,
}
impl Facts {
    fn situation<'a>(&self, ctx: &'a Context<'a>, bot: &'a Bot) -> Situation<'a> {
        Situation {
            ctx,
            world: ctx.world,
            predictor: ctx.predictor,
            car: &ctx.world.cars[bot.car],
            index: self.index,
            team: self.side,
            d: self.d,
            role: Role::from_core(bot.role),
            mode: self.mode,
            kickoff: self.team.kickoff,
            count: self.team.count,
            core: bot,
        }
    }
}

impl Brain for Modular {
    fn tick(&mut self, ctx: &Context, out: &mut [Controls]) {
        let side = self.team;
        let size = self.skills.len()
            + usize::from(ctx.player.is_some_and(|id| ctx.world.cars[id].team == side));
        let strategy = &mut self.strategies[self.by_size[if size <= 3 { size } else { 0 }]];
        let team = strategy.assign(ctx);
        let d = if side == 0 { 1.0 } else { -1.0 };
        for (i, output) in out.iter_mut().enumerate().take(self.skills.len()) {
            let mode = strategy.mode(i, ctx, team);
            let active = mode != Mode::Inactive && !self.skills[i].is_empty();
            let facts = Facts {
                index: i,
                side,
                d,
                mode,
                team,
            };
            let mut claimed = None;
            if active {
                let s = facts.situation(ctx, &strategy.bots()[i]);
                let skills = &mut self.skills[i];
                if let Some(k) = self.holder[i]
                    && let Some(controls) = skills[k].claim(&s, true)
                {
                    claimed = Some((k, controls));
                }
                if claimed.is_none() {
                    for (k, skill) in skills.iter_mut().enumerate() {
                        if Some(k) == self.holder[i] {
                            continue;
                        }
                        if let Some(controls) = skill.claim(&s, false) {
                            claimed = Some((k, controls));
                            break;
                        }
                    }
                }
            }
            self.holder[i] = claimed.map(|(k, _)| k);
            if let Some((_, controls)) = claimed {
                // The core's own move is abandoned. It plans afresh when it gets the car back.
                let bot = &mut strategy.bots_mut()[i];
                bot.maneuver = Maneuver::None;
                bot.out = controls;
                *output = controls;
                continue;
            }
            let mut controls = strategy.act(i, ctx, team);
            if active {
                let s = facts.situation(ctx, &strategy.bots()[i]);
                for skill in &mut self.skills[i] {
                    skill.adjust(&s, &mut controls);
                }
                strategy.bots_mut()[i].out = controls;
            }
            *output = controls;
        }
    }

    fn reset(&mut self) {
        for strategy in &mut self.strategies {
            strategy.reset();
        }
        self.holder.fill(None);
        for skill in self.skills.iter_mut().flatten() {
            skill.reset();
        }
    }

    fn trace(&self, out: &mut Vec<f64>) {
        for strategy in &self.strategies {
            strategy.trace(out);
        }
        for (holder, skills) in self.holder.iter().zip(&self.skills) {
            out.push(holder.map_or(-1.0, |k| k as f64));
            for skill in skills {
                skill.trace(out);
            }
        }
    }

    fn clone_box(&self) -> Box<dyn Brain> {
        Box::new(self.clone())
    }
}
