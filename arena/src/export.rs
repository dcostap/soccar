//! Data for the leaderboard page and watch links for the game.
use crate::{
    Arena,
    ledger::{Format, Record},
};
use serde_json::{Value, json};
use soccar_simulation::harness::{HEAT_COLUMNS, HEAT_ROWS, PlayerReport};
use std::{
    collections::{HashMap, HashSet},
    fs,
    path::Path,
};

/// Newest matches kept in the export, to bound the page's download.
const EXPORT_MATCHES: usize = 10_000;

pub fn encode(text: &str) -> String {
    let mut out = String::new();
    for b in text.bytes() {
        if b.is_ascii_alphanumeric() || b"-_.~".contains(&b) {
            out.push(b as char);
        } else {
            out += &format!("%{b:02X}");
        }
    }
    out
}

/// A self-contained link: the game replays the match from its seed and brain settings.
pub fn watch_url(base: &str, r: &Record) -> String {
    format!(
        "{base}/?watch={}&seed={}&size={}&duration={}&blue={}&orange={}&names={},{}&expect={}-{}",
        r.id,
        r.seed,
        r.size,
        r.duration,
        encode(&r.specs[0]),
        encode(&r.specs[1]),
        encode(&r.brains[0]),
        encode(&r.brains[1]),
        r.score[0],
        r.score[1],
    )
}

pub fn round(x: f64, digits: i32) -> f64 {
    let scale = 10f64.powi(digits);
    (x * scale).round() / scale
}

/// Writes through a temporary file, so the page and other exports never read a partial file.
fn write_atomic(path: &Path, text: &str) -> Result<(), String> {
    let temp = path.with_extension(format!("{}.tmp", std::process::id()));
    fs::write(&temp, text).map_err(|e| format!("{}: {e}", temp.display()))?;
    fs::rename(&temp, path).map_err(|e| format!("{}: {e}", path.display()))
}

/// File name of a format's page data, such as `arena-3v3.json`.
fn format_file(format: Format) -> String {
    let size = format.size;
    if format.duration == 300.0 {
        format!("arena-{size}v{size}.json")
    } else {
        format!("arena-{size}v{size}-{}s.json", format.duration)
    }
}

impl Arena {
    /// Writes the page data of every format with results, the game menu, and the set pieces.
    pub fn export(&mut self) -> Result<(), String> {
        let dir = self.root.join("../public/arena");
        fs::create_dir_all(&dir).map_err(|e| e.to_string())?;
        let mut formats: Vec<Format> = Vec::new();
        for record in &self.ledger.records {
            if !formats.contains(&record.format()) {
                formats.push(record.format());
            }
        }
        formats.sort_by(|a, b| (a.size, a.duration).partial_cmp(&(b.size, b.duration)).unwrap());
        let selected = self.options.format;
        let mut index = Vec::new();
        let mut heat_ids = HashSet::new();
        for &format in &formats {
            self.options.format = format;
            let file = format_file(format);
            let (data, ids) = self.format_data()?;
            write_atomic(&dir.join(&file), &data)?;
            index.push(json!({
                "name": format!("{}v{}", format.size, format.size),
                "size": format.size,
                "duration": format.duration,
                "file": file,
                "matches": ids.len(),
            }));
            heat_ids.extend(ids.into_iter().filter(|id| self.heat.maps.contains_key(id)));
        }
        // The game menu rates brains by the standard 3v3 format.
        self.options.format = Format {
            size: 3,
            duration: 300.0,
        };
        let standings = self.standings();
        self.options.format = selected;
        let menu = json!({
            "engine": soccar_simulation::recording::engine_version(),
            "brains": self.brains.iter().zip(&standings).map(|(b, s)| json!({
                "name": b.spec.name,
                "description": b.description,
                "text": b.spec.text(),
                "fingerprint": b.fingerprint,
                "elo": round(s.elo, 1),
                "games": s.games,
            })).collect::<Vec<_>>(),
        });
        write_atomic(&dir.join("brains.json"), &menu.to_string())?;
        write_atomic(
            &dir.join("index.json"),
            &json!({ "generated": now(), "formats": index }).to_string(),
        )?;
        self.export_heatmaps(&dir.join("heatmaps"), &heat_ids)?;
        self.export_setpieces(&dir)?;
        // Data from before formats had their own files.
        let _ = fs::remove_file(dir.join("arena.json"));
        let total: usize = index.iter().map(|f| f["matches"].as_u64().unwrap_or(0) as usize).sum();
        let names: Vec<_> = index.iter().filter_map(|f| f["name"].as_str()).collect();
        eprintln!("Exported {total} matches in {} to public/arena/", names.join(", "));
        Ok(())
    }

    /// One small file per exported match with heatmaps, loaded when its details open.
    /// A match's heatmap never changes, so only new files are written and old ones removed.
    fn export_heatmaps(&self, dir: &Path, ids: &HashSet<u64>) -> Result<(), String> {
        fs::create_dir_all(dir).map_err(|e| e.to_string())?;
        let mut present = HashSet::new();
        for item in fs::read_dir(dir).map_err(|e| e.to_string())?.flatten() {
            let path = item.path();
            let id = path
                .file_stem()
                .and_then(|s| s.to_str())
                .and_then(|s| s.parse::<u64>().ok())
                .filter(|_| path.extension().is_some_and(|x| x == "json"));
            match id {
                Some(id) if ids.contains(&id) => {
                    present.insert(id);
                }
                // Stale or partial files.
                _ => {
                    let _ = fs::remove_file(&path);
                }
            }
        }
        for &id in ids.difference(&present) {
            let text = serde_json::to_string(&self.heat.maps[&id]).map_err(|e| e.to_string())?;
            write_atomic(&dir.join(format!("{id}.json")), &text)?;
        }
        Ok(())
    }

    /// Page data of the selected format and the ids of its exported matches.
    fn format_data(&self) -> Result<(String, Vec<u64>), String> {
        let standings = self.standings();
        let stats: Vec<&str> = PlayerReport::default()
            .fields()
            .iter()
            .map(|f| f.0)
            .collect();
        let brains: Vec<Value> = self
            .brains
            .iter()
            .zip(&standings)
            .enumerate()
            .map(|(i, (b, s))| {
                let heat = self.heat_average(i);
                let seconds = |m: &[f64]| m.iter().map(|v| round(*v, 2)).collect::<Vec<_>>();
                json!({
                    "name": b.spec.name,
                    "description": b.description,
                    "module": b.spec.module,
                    "text": b.spec.text(),
                    "fingerprint": b.fingerprint,
                    "elo": round(s.elo, 1),
                    "error": round(s.error, 1),
                    "games": s.games,
                    "wins": s.wins,
                    "goalsFor": round(s.goals_for, 3),
                    "goalsAgainst": round(s.goals_against, 3),
                    "brainMs": round(s.brain_ms, 1),
                    "averages": s.averages.iter().map(|(k, v)| (k.clone(), json!(round(*v, 3)))).collect::<serde_json::Map<_, _>>(),
                    // Seconds per match in each cell for one car and for the ball, with this brain attacking up.
                    "heat": { "matches": heat.matches, "car": seconds(&heat.car), "ball": seconds(&heat.ball) },
                    "setPieces": self.setpiece_totals(i),
                })
            })
            .collect();
        // Settings texts are shared by many matches, so matches refer to them by index.
        let mut specs: Vec<&str> = Vec::new();
        let mut spec_index: HashMap<&str, usize> = HashMap::new();
        // Older brain versions are included and flagged, so the page can show them on request.
        let all: Vec<_> = self
            .ledger
            .records
            .iter()
            .filter(|r| r.format() == self.options.format)
            .map(|r| (r, self.current(r)))
            .collect();
        let start = all.len().saturating_sub(EXPORT_MATCHES);
        for (record, _) in &all[start..] {
            for text in &record.specs {
                spec_index.entry(text.as_str()).or_insert_with(|| {
                    specs.push(text.as_str());
                    specs.len() - 1
                });
            }
        }
        let matches: Vec<Value> = all[start..]
            .iter()
            .map(|(r, current)| {
                json!({
                    "id": r.id,
                    "seed": r.seed,
                    "brains": r.brains,
                    "specs": [spec_index[r.specs[0].as_str()], spec_index[r.specs[1].as_str()]],
                    "current": current.is_some(),
                    "heat": self.heat.maps.contains_key(&r.id),
                    "score": r.score,
                    "overtime": r.overtime,
                    "live": round(r.live, 1),
                    "teams": r.teams.iter().map(|t| json!([round(t.possession, 1), round(t.defending, 1), round(t.brain_ms, 0)])).collect::<Vec<_>>(),
                    "players": r.players.iter().map(|p| {
                        let mut row = vec![json!(p.team)];
                        row.extend(stats.iter().map(|s| json!(round(*p.stats.get(*s).unwrap_or(&0.0), 1))));
                        row
                    }).collect::<Vec<_>>(),
                })
            })
            .collect();
        let data = json!({
            "generated": now(),
            "format": { "size": self.options.format.size, "duration": self.options.format.duration },
            "stats": stats,
            "heat": { "columns": HEAT_COLUMNS, "rows": HEAT_ROWS, "cell": 512 },
            "brains": brains,
            "specs": specs,
            "matches": matches,
        });
        let ids = all[start..].iter().map(|(r, _)| r.id).collect();
        Ok((serde_json::to_string(&data).map_err(|e| e.to_string())?, ids))
    }
}

fn now() -> u64 {
    std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .map_or(0, |d| d.as_secs())
}
