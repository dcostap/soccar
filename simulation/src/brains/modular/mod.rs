//! The modular brain: alphabravo's strategy as a fixed core, with swappable skills on top.
//!
//! - `tactics.rs` and `pilot.rs` are exact copies of alphabravo and alpha's car control. They choose roles,
//!   positions, and a default action for every car. With no skills, this brain drives exactly as alphabravo.
//! - `kit.rs` defines the `Skill` trait, the `Situation` a skill sees, and shared tools.
//! - `skills/` holds the skills. A brain selects them in priority order: `skills = aerial, bounce`.
//!   Each tick a skill may take a car from the core for that tick, keep it while it finishes a move,
//!   or adjust the core's controls. See `kit.rs` and `arena/HACKATHON.md`.
//!
//! The fingerprint covers these four core files and the source of each selected skill, so adding a skill
//! retires only the brains that select it. Edits to the core retire every modular brain.
pub mod kit;
pub mod pilot;
pub mod skills;
pub mod tactics;

use super::{Brain, BrainSpec, Context, Params};
use crate::car::Controls;
use kit::{Mode, Role, Situation, Skill};
use pilot::{Bot, Maneuver, Settings};
use tactics::Tactics;

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
    tactics: Tactics,
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

/// Source text of the selected skills, added to the core source in the fingerprint.
pub fn skill_source(spec: &BrainSpec) -> String {
    let text = spec
        .settings
        .iter()
        .find(|(k, _)| k == "skills")
        .map_or("", |(_, v)| v.as_str());
    let mut out = String::new();
    for name in skill_names(text).unwrap_or_default() {
        let def = skills::find(name).unwrap();
        out += &format!("\n[skill {}]\n{}", def.name, def.source);
    }
    out
}

pub fn create(params: &mut Params, team: usize, cars: &[usize]) -> Result<Box<dyn Brain>, String> {
    let settings = Settings::from_params(params)?;
    let shotzone = params.number("shotzone", 5000.0)?;
    let text = params.text("skills", "");
    // Build each skill once, even with no cars, so its settings are checked.
    let prototypes = skill_names(&text)?
        .into_iter()
        .map(|name| (skills::find(name).unwrap().create)(params))
        .collect::<Result<Vec<_>, _>>()?;
    Ok(Box::new(Modular {
        tactics: Tactics {
            team,
            bots: cars.iter().map(|&id| Bot::new(id, settings)).collect(),
            previous: None,
            recovering: vec![false; cars.len()],
            shotzone,
        },
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
    team: tactics::Team,
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
        let team = self.tactics.assign(ctx);
        let side = self.tactics.team;
        let d = if side == 0 { 1.0 } else { -1.0 };
        for (i, output) in out.iter_mut().enumerate().take(self.tactics.bots.len()) {
            let mode = self.tactics.mode(i, ctx, team);
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
                let s = facts.situation(ctx, &self.tactics.bots[i]);
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
                let bot = &mut self.tactics.bots[i];
                bot.maneuver = Maneuver::None;
                bot.out = controls;
                *output = controls;
                continue;
            }
            let mut controls = self.tactics.act(i, ctx, team);
            if active {
                let s = facts.situation(ctx, &self.tactics.bots[i]);
                for skill in &mut self.skills[i] {
                    skill.adjust(&s, &mut controls);
                }
                self.tactics.bots[i].out = controls;
            }
            *output = controls;
        }
    }

    fn reset(&mut self) {
        self.tactics.reset();
        self.holder.fill(None);
        for skill in self.skills.iter_mut().flatten() {
            skill.reset();
        }
    }

    fn trace(&self, out: &mut Vec<f64>) {
        self.tactics.trace(out);
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
