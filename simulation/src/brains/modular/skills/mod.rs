//! Skill registry of the modular brain. Add one `pub mod` line and one `SKILLS` entry per skill.
//! This file is not part of any fingerprint, so adding a skill does not retire other brains' results.
use super::kit::Create;

pub mod aerial_a;
pub mod template;

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
];

pub fn find(name: &str) -> Option<&'static Def> {
    SKILLS.iter().find(|s| s.name == name)
}
