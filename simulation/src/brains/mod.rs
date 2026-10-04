//! Bot brains. A brain drives every bot car on one team.
//!
//! A brain is a code module plus settings. `BrainSpec` names the module and holds its settings as text,
//! in the same `key = value` format as the arena's `.brain` files. To add a module, write a file in this
//! directory and add it to `MODULES`.
//!
//! Brains must be deterministic: no clocks, no thread-local state, and no game random numbers.
use crate::{car::Controls, predictor::Predictor, world::World};
use std::fmt::Debug;

pub mod classic;
// Contest entries. See arena/CONTEST.md.
pub mod alpha;
// Keep existing brain source and fingerprints unchanged for style-only lints.
#[allow(clippy::field_reassign_with_default)]
pub mod alphabravo;
#[allow(clippy::collapsible_if, clippy::field_reassign_with_default)]
pub mod bravo;
// Alphabravo with swappable skills. See arena/HACKATHON.md.
#[allow(clippy::field_reassign_with_default)]
pub mod modular;
// Nexto, a published deep-RL Rocket League bot. See nexto/mod.rs for credit and license.
pub mod nexto;
// Fixed rivals for set pieces. See crate::scenario.
pub mod scripted;
pub mod strike;

/// What a brain can see each tick.
pub struct Context<'a> {
    pub world: &'a World,
    /// Shared ball prediction, updated before brains run.
    pub predictor: &'a Predictor,
    /// The human player's car, if any. It may be a teammate.
    pub player: Option<usize>,
}

pub trait Brain: Debug + Send + Sync {
    /// Sets controls for this brain's cars. `out[i]` drives the i-th car passed at creation.
    fn tick(&mut self, ctx: &Context, out: &mut [Controls]);
    /// Called at every kickoff.
    fn reset(&mut self) {}
    /// Hidden state for the native/WASM consistency check.
    fn trace(&self, _out: &mut Vec<f64>) {}
    fn clone_box(&self) -> Box<dyn Brain>;
}
impl Clone for Box<dyn Brain> {
    fn clone(&self) -> Self {
        self.clone_box()
    }
}

/// Creates a brain for `team` that drives `cars`. Unknown or invalid settings are errors.
pub type Create = fn(&mut Params, usize, &[usize]) -> Result<Box<dyn Brain>, String>;
pub struct Module {
    pub name: &'static str,
    /// Source text, part of the arena fingerprint.
    pub source: &'static str,
    /// Source text that depends on the settings, such as selected skills. Also part of the fingerprint.
    pub extra: fn(&BrainSpec) -> String,
    pub create: Create,
}
fn no_extra(_: &BrainSpec) -> String {
    String::new()
}
pub const MODULES: &[Module] = &[
    Module {
        name: "classic",
        source: include_str!("classic.rs"),
        extra: no_extra,
        create: classic::create,
    },
    Module {
        name: "alpha",
        source: include_str!("alpha.rs"),
        extra: no_extra,
        create: alpha::create,
    },
    Module {
        name: "bravo",
        source: include_str!("bravo.rs"),
        extra: no_extra,
        create: bravo::create,
    },
    Module {
        name: "alphabravo",
        source: concat!(
            include_str!("alphabravo.rs"),
            "\n",
            include_str!("alpha.rs")
        ),
        extra: no_extra,
        create: alphabravo::create,
    },
    Module {
        name: "modular",
        source: modular::SOURCE,
        extra: modular::extra_source,
        create: modular::create,
    },
    Module {
        name: "nexto",
        source: nexto::SOURCE,
        extra: nexto::extra_source,
        create: nexto::create,
    },
    Module {
        name: "scripted",
        source: include_str!("scripted.rs"),
        extra: no_extra,
        create: scripted::create,
    },
    Module {
        name: "strike",
        source: include_str!("strike.rs"),
        extra: no_extra,
        create: strike::create,
    },
];
pub fn module(name: &str) -> Option<&'static Module> {
    MODULES.iter().find(|m| m.name == name)
}

/// Built-in difficulty presets of the classic brain.
#[derive(Clone, Copy, Debug, PartialEq)]
pub enum Skill {
    Rookie,
    Pro,
    Allstar,
}
impl Skill {
    pub fn from_number(n: u32) -> Self {
        match n {
            0 => Self::Rookie,
            1 => Self::Pro,
            _ => Self::Allstar,
        }
    }
    pub fn parse(name: &str) -> Result<Self, String> {
        match name {
            "rookie" => Ok(Self::Rookie),
            "pro" => Ok(Self::Pro),
            "allstar" => Ok(Self::Allstar),
            _ => Err(format!("Unknown skill: {name}")),
        }
    }
    pub fn name(self) -> &'static str {
        match self {
            Self::Rookie => "rookie",
            Self::Pro => "pro",
            Self::Allstar => "allstar",
        }
    }
}

/// Brain settings, read by the module. Reading marks a key as used; `finish` rejects unused keys.
#[derive(Clone, Debug, Default)]
pub struct Params {
    entries: Vec<(String, String, bool)>,
}
impl Params {
    fn get(&mut self, key: &str) -> Option<&str> {
        let entry = self.entries.iter_mut().find(|e| e.0 == key)?;
        entry.2 = true;
        Some(&entry.1)
    }
    pub fn text(&mut self, key: &str, default: &str) -> String {
        self.get(key).unwrap_or(default).to_string()
    }
    pub fn number(&mut self, key: &str, default: f64) -> Result<f64, String> {
        match self.get(key) {
            None => Ok(default),
            Some(v) => v
                .parse::<f64>()
                .ok()
                .filter(|x| x.is_finite())
                .ok_or_else(|| format!("{key}: expected a number, got {v}")),
        }
    }
    pub fn flag(&mut self, key: &str, default: bool) -> Result<bool, String> {
        match self.get(key) {
            None => Ok(default),
            Some("true" | "1" | "yes" | "on") => Ok(true),
            Some("false" | "0" | "no" | "off") => Ok(false),
            Some(v) => Err(format!("{key}: expected true or false, got {v}")),
        }
    }
    fn finish(&self) -> Result<(), String> {
        match self.entries.iter().find(|e| !e.2) {
            Some(e) => Err(format!("Unknown setting: {}", e.0)),
            None => Ok(()),
        }
    }
}

/// A named brain: module plus settings.
#[derive(Clone, Debug, PartialEq, serde::Serialize, serde::Deserialize)]
pub struct BrainSpec {
    pub name: String,
    pub module: String,
    /// Settings in file order.
    pub settings: Vec<(String, String)>,
}
impl BrainSpec {
    /// The classic brain at a built-in difficulty.
    pub fn preset(skill: Skill) -> Self {
        Self {
            name: skill.name().into(),
            module: "classic".into(),
            settings: vec![("preset".into(), skill.name().into())],
        }
    }
    /// Parses `key = value` lines. `#` starts a comment. `module` selects the code module.
    /// The result is validated by building a brain with no cars.
    pub fn parse(name: &str, text: &str) -> Result<Self, String> {
        let mut module = None;
        let mut settings: Vec<(String, String)> = Vec::new();
        for (number, line) in text.lines().enumerate() {
            let line = line.split('#').next().unwrap_or("").trim();
            if line.is_empty() {
                continue;
            }
            let (key, value) = line
                .split_once('=')
                .ok_or_else(|| format!("line {}: expected key = value", number + 1))?;
            let (key, value) = (key.trim().to_string(), value.trim().to_string());
            if key == "module" {
                module = Some(value);
            } else if settings.iter().any(|s| s.0 == key) {
                return Err(format!("line {}: duplicate setting {key}", number + 1));
            } else {
                settings.push((key, value));
            }
        }
        let spec = Self {
            name: name.into(),
            module: module.ok_or("Missing module = <name>")?,
            settings,
        };
        spec.create(0, &[])?;
        Ok(spec)
    }
    /// Canonical text form, accepted by `parse`.
    pub fn text(&self) -> String {
        let mut out = format!("module = {}\n", self.module);
        for (k, v) in &self.settings {
            out += &format!("{k} = {v}\n");
        }
        out
    }
    /// Source text for the fingerprint: the module source and any settings-dependent source.
    pub fn source(&self) -> String {
        match module(&self.module) {
            Some(m) => format!("{}{}", m.source, (m.extra)(self)),
            None => String::new(),
        }
    }
    pub fn create(&self, team: usize, cars: &[usize]) -> Result<Box<dyn Brain>, String> {
        let module =
            module(&self.module).ok_or_else(|| format!("Unknown module: {}", self.module))?;
        let mut params = Params {
            entries: self
                .settings
                .iter()
                .map(|(k, v)| (k.clone(), v.clone(), false))
                .collect(),
        };
        let brain = (module.create)(&mut params, team, cars)?;
        params.finish()?;
        Ok(brain)
    }
}
