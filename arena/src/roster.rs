//! Brain files and fingerprints.
use soccar_simulation::{
    brains::BrainSpec,
    car::Controls,
    harness::{self, MatchSpec},
};
use std::{fs, path::Path, thread};

pub struct Entry {
    pub spec: BrainSpec,
    /// Leading comment lines of the brain file.
    pub description: String,
    /// Changes whenever the brain plays differently. Results are kept per fingerprint.
    pub fingerprint: String,
}

/// Loads every `.brain` file in `dir`, sorted by name.
pub fn load(dir: &Path) -> Result<Vec<Entry>, String> {
    let mut files = Vec::new();
    let listing = fs::read_dir(dir).map_err(|e| format!("{}: {e}", dir.display()))?;
    for item in listing.flatten() {
        let path = item.path();
        if path.extension().is_some_and(|x| x == "brain") {
            let name = path.file_stem().unwrap().to_string_lossy().into_owned();
            let text = fs::read_to_string(&path).map_err(|e| format!("{}: {e}", path.display()))?;
            files.push((name, text));
        }
    }
    files.sort();
    let mut specs = Vec::new();
    let mut errors = Vec::new();
    for (name, text) in &files {
        match BrainSpec::parse(name, text) {
            Ok(spec) => specs.push((spec, describe(text))),
            Err(e) => errors.push(format!("{name}.brain: {e}")),
        }
    }
    if !errors.is_empty() {
        return Err(errors.join("\n"));
    }
    // Fingerprints play short matches, so compute them in parallel.
    let fingerprints: Vec<String> = thread::scope(|scope| {
        let handles: Vec<_> = specs
            .iter()
            .map(|(spec, _)| scope.spawn(move || fingerprint(spec)))
            .collect();
        handles.into_iter().map(|h| h.join().unwrap()).collect()
    });
    Ok(specs
        .into_iter()
        .zip(fingerprints)
        .map(|((spec, description), fingerprint)| Entry {
            spec,
            description,
            fingerprint,
        })
        .collect())
}

fn describe(text: &str) -> String {
    text.lines()
        .map_while(|l| l.trim().strip_prefix('#'))
        .map(str::trim)
        .collect::<Vec<_>>()
        .join(" ")
}

/// FNV-1a, stable across platforms and Rust versions.
pub struct Hash(pub u64);
impl Hash {
    pub fn new() -> Self {
        Self(0xcbf2_9ce4_8422_2325)
    }
    pub fn bytes(&mut self, bytes: &[u8]) {
        for &b in bytes {
            self.0 = (self.0 ^ u64::from(b)).wrapping_mul(0x100_0000_01b3);
        }
    }
    fn number(&mut self, x: f64) {
        self.bytes(&x.to_bits().to_le_bytes());
    }
}

/// Hashes the name, settings, module source, and the car states of short mirror matches.
/// The matches catch changes in shared code and physics that the source text does not show.
pub fn fingerprint(spec: &BrainSpec) -> String {
    let mut h = Hash::new();
    h.bytes(spec.name.as_bytes());
    h.bytes(spec.text().as_bytes());
    h.bytes(spec.source().as_bytes());
    for (size, ticks) in [(1, 2400), (3, 3600)] {
        let mut game = harness::start(&MatchSpec {
            seed: 1,
            team_size: size,
            brains: [spec.clone(), spec.clone()],
            ..MatchSpec::default()
        });
        for _ in 0..ticks {
            game.tick(Controls::default());
            for c in &game.world.cars {
                for x in [
                    c.pos.x, c.pos.y, c.pos.z, c.vel.x, c.vel.y, c.vel.z, c.boost,
                ] {
                    h.number(x);
                }
            }
        }
        h.number(game.score[0] as f64);
        h.number(game.score[1] as f64);
    }
    format!("{:016x}", h.0)
}
