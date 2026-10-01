//! Append-only match log: one JSON record per line.
use serde::{Deserialize, Serialize};
use soccar_simulation::harness::MatchResult;
use std::{
    collections::{BTreeMap, HashSet},
    fs::{self, File, OpenOptions},
    io::{BufRead, BufReader, Write},
    path::{Path, PathBuf},
    time::{SystemTime, UNIX_EPOCH},
};

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Team {
    pub possession: f64,
    pub defending: f64,
    pub brain_ms: f64,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct Player {
    pub team: usize,
    /// Every statistic in `harness::PlayerReport::fields`, by name.
    #[serde(flatten)]
    pub stats: BTreeMap<String, f64>,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Record {
    pub id: u64,
    /// Unix seconds.
    pub time: u64,
    pub seed: u32,
    pub size: usize,
    pub duration: f64,
    pub brains: [String; 2],
    pub fingerprints: [String; 2],
    /// Brain file text, so the match can be replayed after the file changes.
    pub specs: [String; 2],
    pub score: [u32; 2],
    pub overtime: bool,
    pub completed: bool,
    /// Seconds of live play.
    pub live: f64,
    pub ticks: i64,
    pub teams: [Team; 2],
    pub players: Vec<Player>,
}
impl Record {
    pub fn winner(&self) -> Option<usize> {
        self.completed
            .then_some(usize::from(self.score[1] > self.score[0]))
    }
    pub fn format(&self) -> Format {
        Format {
            size: self.size,
            duration: self.duration,
        }
    }
    /// Team total of one player statistic.
    pub fn team_stat(&self, team: usize, stat: &str) -> f64 {
        self.players
            .iter()
            .filter(|p| p.team == team)
            .map(|p| p.stats.get(stat).copied().unwrap_or(0.0))
            .sum()
    }
}

#[derive(Clone, Copy, Debug, PartialEq)]
pub struct Format {
    pub size: usize,
    pub duration: f64,
}

type Key = (String, String, u32, usize, u64);
fn key(fingerprints: &[String; 2], seed: u32, format: Format) -> Key {
    (
        fingerprints[0].clone(),
        fingerprints[1].clone(),
        seed,
        format.size,
        format.duration.to_bits(),
    )
}

/// Rounds to millis-level precision to keep the log small.
fn round(x: f64) -> f64 {
    (x * 1000.0).round() / 1000.0
}

pub struct Ledger {
    pub records: Vec<Record>,
    keys: HashSet<Key>,
    path: PathBuf,
    file: Option<File>,
}
impl Ledger {
    pub fn load(path: &Path) -> Result<Self, String> {
        let mut ledger = Self {
            records: Vec::new(),
            keys: HashSet::new(),
            path: path.to_path_buf(),
            file: None,
        };
        let Ok(file) = File::open(path) else {
            return Ok(ledger);
        };
        for (number, line) in BufReader::new(file).lines().enumerate() {
            let line = line.map_err(|e| e.to_string())?;
            if line.trim().is_empty() {
                continue;
            }
            let record: Record = serde_json::from_str(&line)
                .map_err(|e| format!("{} line {}: {e}", path.display(), number + 1))?;
            ledger
                .keys
                .insert(key(&record.fingerprints, record.seed, record.format()));
            ledger.records.push(record);
        }
        Ok(ledger)
    }
    pub fn contains(&self, fingerprints: &[String; 2], seed: u32, format: Format) -> bool {
        self.keys.contains(&key(fingerprints, seed, format))
    }
    pub fn append(
        &mut self,
        result: &MatchResult,
        fingerprints: [String; 2],
    ) -> Result<&Record, String> {
        let spec = &result.spec;
        let record = Record {
            id: self.records.last().map_or(1, |r| r.id + 1),
            time: SystemTime::now()
                .duration_since(UNIX_EPOCH)
                .map_or(0, |d| d.as_secs()),
            seed: spec.seed,
            size: spec.team_size,
            duration: spec.duration,
            brains: spec.brains.clone().map(|b| b.name),
            fingerprints,
            specs: spec.brains.clone().map(|b| b.text()),
            score: result.score,
            overtime: result.overtime,
            completed: result.completed,
            live: round(result.live),
            ticks: result.physics_ticks,
            teams: result.teams.map(|t| Team {
                possession: round(t.possession),
                defending: round(t.defending),
                brain_ms: round(t.brain_ms),
            }),
            players: result
                .players
                .iter()
                .map(|p| Player {
                    team: p.team,
                    stats: p
                        .fields()
                        .iter()
                        .map(|&(k, v)| (k.to_string(), round(v)))
                        .collect(),
                })
                .collect(),
        };
        if self.file.is_none() {
            if let Some(dir) = self.path.parent() {
                fs::create_dir_all(dir).map_err(|e| e.to_string())?;
            }
            self.file = Some(
                OpenOptions::new()
                    .create(true)
                    .append(true)
                    .open(&self.path)
                    .map_err(|e| format!("{}: {e}", self.path.display()))?,
            );
        }
        let line = serde_json::to_string(&record).map_err(|e| e.to_string())?;
        let file = self.file.as_mut().unwrap();
        writeln!(file, "{line}").map_err(|e| e.to_string())?;
        file.flush().map_err(|e| e.to_string())?;
        self.keys
            .insert(key(&record.fingerprints, record.seed, record.format()));
        self.records.push(record);
        Ok(self.records.last().unwrap())
    }
}
