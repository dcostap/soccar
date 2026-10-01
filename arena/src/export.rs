//! Data for the leaderboard page and watch links for the game.
use crate::{Arena, ledger::Record};
use serde_json::{Value, json};
use soccar_simulation::harness::{HEAT_COLUMNS, HEAT_ROWS, PlayerReport};
use std::{collections::HashMap, fs};

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

impl Arena {
    pub fn export(&self) -> Result<(), String> {
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
            "generated": std::time::SystemTime::now().duration_since(std::time::UNIX_EPOCH).map_or(0, |d| d.as_secs()),
            "format": { "size": self.options.format.size, "duration": self.options.format.duration },
            "stats": stats,
            "heat": { "columns": HEAT_COLUMNS, "rows": HEAT_ROWS, "cell": 512 },
            "brains": brains,
            "specs": specs,
            "matches": matches,
        });
        let dir = self.root.join("../public/arena");
        fs::create_dir_all(&dir).map_err(|e| e.to_string())?;
        let path = dir.join("arena.json");
        fs::write(
            &path,
            serde_json::to_string(&data).map_err(|e| e.to_string())?,
        )
        .map_err(|e| format!("{}: {e}", path.display()))?;
        // One small file per exported match with heatmaps, loaded when its details open.
        let heat_dir = dir.join("heatmaps");
        if heat_dir.exists() {
            fs::remove_dir_all(&heat_dir).map_err(|e| e.to_string())?;
        }
        fs::create_dir_all(&heat_dir).map_err(|e| e.to_string())?;
        for (record, _) in &all[start..] {
            if let Some(heat) = self.heat.maps.get(&record.id) {
                let text = serde_json::to_string(heat).map_err(|e| e.to_string())?;
                fs::write(heat_dir.join(format!("{}.json", record.id)), text)
                    .map_err(|e| e.to_string())?;
            }
        }
        // The game menu loads this small file to offer arena brains as opponents.
        let menu = json!({
            "brains": self.brains.iter().zip(&standings).map(|(b, s)| json!({
                "name": b.spec.name,
                "description": b.description,
                "text": b.spec.text(),
                "elo": round(s.elo, 1),
                "games": s.games,
            })).collect::<Vec<_>>(),
        });
        fs::write(dir.join("brains.json"), menu.to_string()).map_err(|e| e.to_string())?;
        self.export_setpieces(&dir)?;
        eprintln!(
            "Exported {} matches to public/arena/arena.json",
            matches.len()
        );
        Ok(())
    }
}
