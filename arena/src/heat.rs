//! Position heatmaps: where each team's cars and the ball spent live play.
//! One JSON line per match in `results/heatmaps.jsonl`, keyed by match id, beside the match log.
use crate::{Arena, ledger::Record};
use serde::{Deserialize, Serialize};
use soccar_simulation::harness::{self, HEAT_COLUMNS, HEAT_ROWS, Heatmaps, MatchSpec};
use std::{
    collections::HashMap,
    fs::{self, File, OpenOptions},
    io::{BufRead, BufReader, Write},
    path::{Path, PathBuf},
};

/// Heatmaps of one match in tenths of a second per cell. See `harness::Heatmaps` for the layout:
/// rows run from the bottom goal line up, each team attacks up the rows, and the ball is seen from blue's side.
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct HeatRecord {
    pub id: u64,
    pub teams: [Vec<u32>; 2],
    pub ball: Vec<u32>,
}

pub struct HeatLog {
    pub maps: HashMap<u64, HeatRecord>,
    path: PathBuf,
    file: Option<File>,
}
impl HeatLog {
    pub fn load(path: &Path) -> Result<Self, String> {
        let mut log = Self {
            maps: HashMap::new(),
            path: path.to_path_buf(),
            file: None,
        };
        let Ok(file) = File::open(path) else {
            return Ok(log);
        };
        for (number, line) in BufReader::new(file).lines().enumerate() {
            let line = line.map_err(|e| e.to_string())?;
            if line.trim().is_empty() {
                continue;
            }
            let record: HeatRecord = serde_json::from_str(&line)
                .map_err(|e| format!("{} line {}: {e}", path.display(), number + 1))?;
            log.maps.insert(record.id, record);
        }
        Ok(log)
    }
    pub fn append(&mut self, id: u64, heatmaps: &Heatmaps) -> Result<(), String> {
        let tenths = |ticks: &Vec<u32>| ticks.iter().map(|&t| (t + 6) / 12).collect();
        let record = HeatRecord {
            id,
            teams: [tenths(&heatmaps.teams[0]), tenths(&heatmaps.teams[1])],
            ball: tenths(&heatmaps.ball),
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
        self.maps.insert(id, record);
        Ok(())
    }
}

/// A brain's average maps: seconds per match in each cell, for one of its cars and for the ball,
/// both turned so that the brain attacks up the rows.
pub struct Average {
    pub matches: usize,
    pub car: Vec<f64>,
    pub ball: Vec<f64>,
}

/// Half-turn rotation of a map: the cell order reverses.
fn rotated(map: &[u32]) -> impl Iterator<Item = u32> + '_ {
    map.iter().rev().copied()
}

/// Shares of time in the defensive, middle, and attacking thirds of a map that attacks up the rows.
pub fn thirds(map: &[f64]) -> [f64; 3] {
    let mut out = [0.0; 3];
    for (i, v) in map.iter().enumerate() {
        let row = i / HEAT_COLUMNS;
        out[(row * 3 / HEAT_ROWS).min(2)] += v;
    }
    let total: f64 = out.iter().sum();
    out.map(|v| v / total.max(1e-9))
}

/// Text rendering, attacking goal at the top. Each cell is two characters wide, so cells look square.
fn render(map: &[f64]) -> Vec<String> {
    const SHADES: &[u8] = b" .:-=+*#%@";
    let max = map.iter().copied().fold(0.0, f64::max).max(1e-9);
    let edge = format!("+{}+", "-".repeat(HEAT_COLUMNS * 2));
    // The goal mouth spans the middle four columns.
    let goal = format!("{}[ goal ]", " ".repeat(HEAT_COLUMNS - 3));
    let mut lines = vec![goal.clone(), edge.clone()];
    for row in (0..HEAT_ROWS).rev() {
        let mut line = String::from("|");
        for column in 0..HEAT_COLUMNS {
            // Square-root shading keeps quieter areas visible next to hot spots such as the kickoff spot.
            let v = (map[row * HEAT_COLUMNS + column] / max).sqrt();
            let shade =
                SHADES[((v * (SHADES.len() - 1) as f64).round() as usize).min(SHADES.len() - 1)];
            line.push(shade as char);
            line.push(shade as char);
        }
        line.push('|');
        lines.push(line);
    }
    lines.push(edge);
    lines.push(goal);
    lines
}

fn print_panels(panels: &[(String, Vec<f64>)]) {
    let rendered: Vec<Vec<String>> = panels.iter().map(|(_, m)| render(m)).collect();
    let width = HEAT_COLUMNS * 2 + 2;
    println!(
        "{}",
        panels
            .iter()
            .map(|(title, _)| format!("{title:<width$}"))
            .collect::<Vec<_>>()
            .join("   ")
    );
    for i in 0..rendered[0].len() {
        println!(
            "{}",
            rendered
                .iter()
                .map(|r| format!("{:<width$}", r[i]))
                .collect::<Vec<_>>()
                .join("   ")
        );
    }
    println!(
        "{}",
        panels
            .iter()
            .map(|(_, m)| {
                let [d, mid, a] = thirds(m);
                format!(
                    "{:<width$}",
                    format!(
                        "thirds {:.0}% {:.0}% {:.0}%",
                        d * 100.0,
                        mid * 100.0,
                        a * 100.0
                    )
                )
            })
            .collect::<Vec<_>>()
            .join("   ")
    );
}

impl Arena {
    /// Average maps of a brain over current results in the selected format that have heatmaps.
    pub fn heat_average(&self, brain: usize) -> Average {
        let cells = HEAT_COLUMNS * HEAT_ROWS;
        let mut average = Average {
            matches: 0,
            car: vec![0.0; cells],
            ball: vec![0.0; cells],
        };
        for (record, current) in self.records() {
            let (Some(sides), Some(heat)) = (current, self.heat.maps.get(&record.id)) else {
                continue;
            };
            for side in (0..2).filter(|&s| sides[s] == brain) {
                average.matches += 1;
                for (a, &v) in average.car.iter_mut().zip(&heat.teams[side]) {
                    *a += v as f64 / 10.0 / record.size as f64;
                }
                let ball: Vec<u32> = if side == 0 {
                    heat.ball.clone()
                } else {
                    rotated(&heat.ball).collect()
                };
                for (a, v) in average.ball.iter_mut().zip(ball) {
                    *a += v as f64 / 10.0;
                }
            }
        }
        let n = average.matches.max(1) as f64;
        for v in average.car.iter_mut().chain(average.ball.iter_mut()) {
            *v /= n;
        }
        average
    }

    pub fn heatmap(&self, words: &[String]) -> Result<(), String> {
        let word = words
            .first()
            .ok_or("heatmap needs a brain name or a match id")?;
        if let Ok(id) = word.parse::<u64>() {
            let record = self
                .ledger
                .records
                .iter()
                .find(|r| r.id == id)
                .ok_or("No such match")?;
            let heat = self
                .heat
                .maps
                .get(&id)
                .ok_or("This match has no heatmap. Run `backfill` to add it.")?;
            let seconds = |m: &[u32]| m.iter().map(|&v| v as f64 / 10.0).collect::<Vec<_>>();
            println!(
                "Match {}: {} {} - {} {}. Each team attacks up; the ball is seen from {}'s side.\n",
                id,
                record.brains[0],
                record.score[0],
                record.score[1],
                record.brains[1],
                record.brains[0]
            );
            print_panels(&[
                (
                    format!("{} (blue) cars", record.brains[0]),
                    seconds(&heat.teams[0]),
                ),
                (
                    format!("{} (orange) cars", record.brains[1]),
                    seconds(&heat.teams[1]),
                ),
                ("ball".to_string(), seconds(&heat.ball)),
            ]);
            return Ok(());
        }
        let brain = self.index(word)?;
        let average = self.heat_average(brain);
        if average.matches == 0 {
            return Err(format!(
                "No heatmaps for {word} in this format yet. Play matches or run `backfill`."
            ));
        }
        println!(
            "{word}: average of {} matches, {}v{}. {word} attacks up.\n",
            average.matches, self.options.format.size, self.options.format.size
        );
        print_panels(&[
            ("one car".to_string(), average.car),
            ("ball".to_string(), average.ball),
        ]);
        Ok(())
    }

    /// Replays current-version matches that have no heatmap and adds one, checking each score.
    pub fn backfill(&mut self) -> Result<(), String> {
        let mut missing: Vec<(&Record, MatchSpec)> = Vec::new();
        for (record, current) in self.records() {
            let Some(sides) = current else { continue };
            if self.heat.maps.contains_key(&record.id)
                || self
                    .options
                    .brain
                    .as_ref()
                    .is_some_and(|name| !record.brains.contains(name))
            {
                continue;
            }
            missing.push((
                record,
                MatchSpec {
                    seed: record.seed,
                    team_size: record.size,
                    brains: sides.map(|s| self.brains[s].spec.clone()),
                    duration: record.duration,
                    ..MatchSpec::default()
                },
            ));
        }
        missing.truncate(self.options.limit);
        let total = missing.len();
        let (records, specs): (Vec<_>, Vec<_>) = missing.into_iter().unzip();
        let ids: Vec<(u64, [u32; 2])> = records.iter().map(|r| (r.id, r.score)).collect();
        eprintln!("Replaying {total} matches for heatmaps.");
        let mut error = None;
        let mut done = 0;
        let heat = &mut self.heat;
        harness::run_until(&specs, self.options.threads, |index, result| {
            let (id, score) = ids[index];
            if result.score != score {
                error = Some(format!(
                    "Match {id} replayed as {:?}, logged as {score:?}. Brain code or physics changed.",
                    result.score
                ));
                return false;
            }
            if let Err(e) = heat.append(id, &result.heatmaps) {
                error = Some(e);
                return false;
            }
            done += 1;
            if done % 200 == 0 {
                eprintln!("{done}/{total}");
            }
            true
        });
        if let Some(e) = error {
            return Err(e);
        }
        eprintln!("Added {done} heatmaps.");
        Ok(())
    }
}
