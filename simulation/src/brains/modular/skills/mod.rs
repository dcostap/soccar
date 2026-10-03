//! Skill registry of the modular brain. Add one `pub mod` line and one `SKILLS` entry per skill.
//! This file is not part of any fingerprint, so adding a skill does not retire other brains' results.
use super::kit::Create;

pub mod aerial_a;
pub mod blocking_a;
pub mod bounce_a;
pub mod recovery_a;
pub mod scramble_a;
pub mod template;
pub mod touch_a;

pub struct Def {
    /// Name used in `skills = ...` and as the prefix of the skill's settings.
    pub name: &'static str,
    /// Source text, part of the fingerprint of every brain that selects this skill.
    /// List every file the skill uses outside the frozen core.
    pub source: &'static str,
    pub create: Create,
}

pub const SKILLS: &[Def] = &[
    Def {
        name: "template",
        source: include_str!("template.rs"),
        create: template::create,
    },
    Def {
        name: "aerial-a",
        source: include_str!("aerial_a.rs"),
        create: aerial_a::create,
    },
    Def {
        name: "recovery-a",
        source: include_str!("recovery_a.rs"),
        create: recovery_a::create,
    },
    Def {
        name: "blocking-a",
        source: include_str!("blocking_a.rs"),
        create: blocking_a::create,
    },
    Def {
        name: "bounce-a",
        source: include_str!("bounce_a.rs"),
        create: bounce_a::create,
    },
    Def {
        name: "scramble-a",
        source: include_str!("scramble_a.rs"),
        create: scramble_a::create,
    },
    Def {
        name: "touch-a",
        source: include_str!("touch_a.rs"),
        create: touch_a::create,
    },
];

pub fn find(name: &str) -> Option<&'static Def> {
    SKILLS.iter().find(|s| s.name == name)
}
