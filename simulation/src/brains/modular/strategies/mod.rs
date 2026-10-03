//! Strategy registry of the modular brain. Add one `pub mod` line and one `STRATEGIES` entry per strategy.
//! This file is not part of any fingerprint, so adding a strategy does not retire other brains' results.
use super::kit::CreateStrategy;

pub mod alpha;
pub mod team;

pub struct Def {
    /// Name used in `strategy = ...` and as the prefix of the strategy's settings.
    pub name: &'static str,
    /// Source text, part of the fingerprint of every brain that selects this strategy.
    /// Empty for `alphabravo`, which is part of the core. List every file the strategy uses outside the core.
    pub source: &'static str,
    pub create: CreateStrategy,
}

pub const STRATEGIES: &[Def] = &[
    Def {
        name: "alphabravo",
        source: "",
        create: super::tactics::create,
    },
    Def {
        name: "alpha",
        source: include_str!("alpha.rs"),
        create: alpha::create,
    },
    Def {
        name: "team",
        source: include_str!("team.rs"),
        create: team::create,
    },
];

pub fn find(name: &str) -> Option<&'static Def> {
    STRATEGIES.iter().find(|s| s.name == name)
}
