//! Set pieces: short scenarios that grade one skill at a time, such as finishing an open goal or saving a shot.
//! Suites live in `arena/scenarios/*.txt`. Results are appended to `results/setpieces.jsonl`,
//! one line per brain version and scenario version.
use crate::{
    Arena,
    export::{encode, round},
    generate,
    roster::Hash,
};
use serde::{Deserialize, Serialize};
use serde_json::{Value, json};
use soccar_simulation::{
    brains::{self, BrainSpec},
    harness::{self, ScenarioJob},
    scenario::{Kind, Scenario},
    vector::Vec3,
};
use std::{
    collections::HashMap,
    fs::{self, File, OpenOptions},
    io::{BufRead, BufReader, Write},
    path::{Path, PathBuf},
    time::Instant,
};

/// One scenario of a suite.
pub struct SetPiece {
    /// `suite/name`.
    pub id: String,
    pub suite: String,
    pub scenario: Scenario,
    /// Canonical text, which the browser replays.
    pub text: String,
    /// Changes with the scenario text or the rival's module source.
    pub hash: String,
}

impl SetPiece {
    pub fn parse(suite: &str, name: &str, body: &str) -> Result<Self, String> {
        let scenario = Scenario::parse(body)?;
        let text = scenario.text();
        let mut h = Hash::new();
        h.bytes(text.as_bytes());
        if let Some(module) = brains::module(&scenario.rival.module) {
            h.bytes(module.source.as_bytes());
        }
        Ok(Self {
            id: format!("{suite}/{name}"),
            suite: suite.to_string(),
            scenario,
            text,
            hash: format!("{:016x}", h.0),
        })
    }
}

pub struct Suite {
    pub name: String,
    /// Leading comment lines of the suite file.
    pub description: String,
}

/// Loads every `.txt` suite in `dir`, sorted by name. Each scenario starts with a `[name]` header.
pub fn load(dir: &Path) -> Result<(Vec<Suite>, Vec<SetPiece>), String> {
    let Ok(listing) = fs::read_dir(dir) else {
        return Ok((Vec::new(), Vec::new()));
    };
    let mut files: Vec<PathBuf> = listing
        .flatten()
        .map(|i| i.path())
        .filter(|p| p.extension().is_some_and(|x| x == "txt"))
        .collect();
    files.sort();
    let mut suites = Vec::new();
    let mut pieces = Vec::new();
    let mut errors = Vec::new();
    for path in files {
        let suite = path.file_stem().unwrap().to_string_lossy().into_owned();
        let text = fs::read_to_string(&path).map_err(|e| format!("{}: {e}", path.display()))?;
        suites.push(Suite {
            name: suite.clone(),
            description: text
                .lines()
                .map_while(|l| l.trim().strip_prefix('#'))
                .map(str::trim)
                .collect::<Vec<_>>()
                .join(" "),
        });
        // Blocks of (name, first line number, text).
        let mut blocks: Vec<(String, usize, String)> = Vec::new();
        for (number, line) in text.lines().enumerate() {
            if let Some(name) = line
                .trim()
                .strip_prefix('[')
                .and_then(|l| l.strip_suffix(']'))
            {
                blocks.push((name.trim().to_string(), number + 2, String::new()));
            } else if let Some(block) = blocks.last_mut() {
                block.2 += line;
                block.2.push('\n');
            }
        }
        for (name, line, body) in blocks {
            let id = format!("{suite}/{name}");
            if pieces.iter().any(|p: &SetPiece| p.id == id) {
                errors.push(format!(
                    "{suite}.txt line {line}: duplicate scenario {name}"
                ));
                continue;
            }
            match SetPiece::parse(&suite, &name, &body) {
                Ok(piece) => pieces.push(piece),
                Err(e) => errors.push(format!("{suite}.txt [{name}] (from line {line}): {e}")),
            }
        }
    }
    if errors.is_empty() {
        Ok((suites, pieces))
    } else {
        Err(errors.join("\n"))
    }
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct Attempt {
    pub brain: String,
    pub fingerprint: String,
    pub scenario: String,
    pub hash: String,
    pub success: bool,
    pub credit: f64,
    /// Team that scored, if any.
    pub goal: Option<usize>,
    pub seconds: f64,
    pub touches: u32,
    /// Closest the ball came to the attacked goal mouth.
    pub closest: f64,
}

pub struct Log {
    /// Keyed by brain fingerprint and scenario hash.
    pub results: HashMap<(String, String), Attempt>,
    path: PathBuf,
    file: Option<File>,
}
impl Log {
    pub fn load(path: &Path) -> Result<Self, String> {
        let mut log = Self {
            results: HashMap::new(),
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
            let r: Attempt = serde_json::from_str(&line)
                .map_err(|e| format!("{} line {}: {e}", path.display(), number + 1))?;
            log.results
                .insert((r.fingerprint.clone(), r.hash.clone()), r);
        }
        Ok(log)
    }
    fn append(&mut self, result: Attempt) -> Result<(), String> {
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
        let line = serde_json::to_string(&result).map_err(|e| e.to_string())?;
        let file = self.file.as_mut().unwrap();
        writeln!(file, "{line}").map_err(|e| e.to_string())?;
        file.flush().map_err(|e| e.to_string())?;
        self.results
            .insert((result.fingerprint.clone(), result.hash.clone()), result);
        Ok(())
    }
}

/// Totals of one brain over a group of scenarios.
#[derive(Clone, Copy, Debug, Default)]
pub struct Tally {
    pub played: usize,
    pub success: usize,
    pub credit: f64,
}
impl Tally {
    fn add(&mut self, r: &Attempt) {
        self.played += 1;
        self.success += usize::from(r.success);
        self.credit += r.credit;
    }
}

impl Arena {
    /// The current result of a brain on a set piece.
    pub fn setpiece_result(&self, brain: usize, piece: &SetPiece) -> Option<&Attempt> {
        self.setpieces
            .log
            .results
            .get(&(self.brains[brain].fingerprint.clone(), piece.hash.clone()))
    }

    /// Scenarios selected by `--suite`, or all of them.
    fn selected_pieces(&self) -> Vec<usize> {
        (0..self.setpieces.pieces.len())
            .filter(|&i| {
                self.options
                    .suite
                    .as_ref()
                    .is_none_or(|s| &self.setpieces.pieces[i].suite == s)
            })
            .collect()
    }

    /// Plays every selected scenario that a chosen brain has no current result for, then prints a summary.
    pub fn setpieces(&mut self, words: &[String]) -> Result<(), String> {
        match words.first().map(String::as_str) {
            Some("show") => return self.setpiece_show(&words[1..]),
            Some("generate") => return self.setpiece_generate(),
            Some("mine") => return self.setpiece_mine(),
            _ => {}
        }
        if let Some(seed) = self.options.holdout {
            // Scenarios nobody has seen: the generated families with another seed, in memory only.
            self.setpieces.suites = generate::FAMILIES
                .iter()
                .map(|f| Suite {
                    name: f.name.replacen("gen-", "holdout-", 1),
                    description: f.description.into(),
                })
                .collect();
            self.setpieces.pieces =
                generate::generate(seed, self.options.count.unwrap_or(40), self.options.threads)
                    .into_iter()
                    .map(|(family, name, text)| {
                        SetPiece::parse(&family.replacen("gen-", "holdout-", 1), &name, &text)
                    })
                    .collect::<Result<_, _>>()?;
            eprintln!(
                "Holdout seed {seed}: {} scenarios.",
                self.setpieces.pieces.len()
            );
        }
        if self.setpieces.pieces.is_empty() {
            return Err("No scenarios in arena/scenarios".into());
        }
        if let Some(s) = &self.options.suite
            && !self.setpieces.suites.iter().any(|x| &x.name == s)
        {
            return Err(format!("Unknown suite: {s}"));
        }
        let chosen: Vec<usize> = if words.is_empty() {
            (0..self.brains.len()).collect()
        } else {
            words
                .iter()
                .map(|w| self.index(w))
                .collect::<Result<_, _>>()?
        };
        let pieces = self.selected_pieces();
        let mut jobs = Vec::new();
        let mut keys = Vec::new();
        for &b in &chosen {
            for &p in &pieces {
                let piece = &self.setpieces.pieces[p];
                if self.setpiece_result(b, piece).is_none() {
                    jobs.push(ScenarioJob {
                        scenario: piece.scenario.clone(),
                        brain: self.brains[b].spec.clone(),
                    });
                    keys.push((b, p));
                }
            }
        }
        if !jobs.is_empty() {
            eprintln!("Playing {} set pieces.", jobs.len());
            let begin = Instant::now();
            let mut error = None;
            let mut outcomes = vec![None; jobs.len()];
            harness::run_scenarios(&jobs, self.options.threads, |index, outcome| {
                outcomes[index] = Some(outcome);
            });
            // Append in job order, so the log does not depend on thread timing.
            for (&(b, p), outcome) in keys.iter().zip(outcomes) {
                let o = outcome.expect("every job reports");
                let piece = &self.setpieces.pieces[p];
                let result = Attempt {
                    brain: self.brains[b].spec.name.clone(),
                    fingerprint: self.brains[b].fingerprint.clone(),
                    scenario: piece.id.clone(),
                    hash: piece.hash.clone(),
                    success: o.success,
                    credit: o.credit,
                    goal: o.goal,
                    seconds: o.seconds,
                    touches: o.touches,
                    closest: o.closest,
                };
                if let Err(e) = self.setpieces.log.append(result) {
                    error = Some(e);
                    break;
                }
            }
            if let Some(e) = error {
                return Err(e);
            }
            eprintln!("Done in {:.1} s.", begin.elapsed().as_secs_f64());
        }
        self.setpiece_summary(&chosen, &pieces);
        Ok(())
    }

    /// Success rates with suites as rows and brains as columns.
    fn setpiece_summary(&self, chosen: &[usize], pieces: &[usize]) {
        let suites: Vec<&str> = self
            .setpieces
            .suites
            .iter()
            .map(|s| s.name.as_str())
            .filter(|s| pieces.iter().any(|&p| self.setpieces.pieces[p].suite == *s))
            .collect();
        // Rows: each suite, then attack, defend, and all.
        let rows = suites.len() + 3;
        let mut tallies = vec![vec![Tally::default(); chosen.len()]; rows];
        let mut sizes = vec![0; rows];
        for &p in pieces {
            let piece = &self.setpieces.pieces[p];
            let s = suites.iter().position(|s| *s == piece.suite).unwrap();
            let kind = suites.len() + usize::from(piece.scenario.kind == Kind::Defend);
            for row in [s, kind, rows - 1] {
                sizes[row] += 1;
                for (column, &b) in chosen.iter().enumerate() {
                    if let Some(r) = self.setpiece_result(b, piece) {
                        tallies[row][column].add(r);
                    }
                }
            }
        }
        let width = suites.iter().map(|s| s.len()).max().unwrap_or(0).max(6);
        print!("{:<width$} {:>4}", "suite", "n");
        for &b in chosen {
            print!(" {:>9}", self.brains[b].spec.name);
        }
        println!();
        let names: Vec<&str> = suites
            .iter()
            .copied()
            .chain(["attack", "defend", "all"])
            .collect();
        for (row, name) in names.iter().enumerate() {
            if row == suites.len() {
                println!();
            }
            print!("{name:<width$} {:>4}", sizes[row]);
            for t in &tallies[row] {
                if t.played == 0 {
                    print!(" {:>9}", "-");
                } else {
                    print!(" {:>8.0}%", 100.0 * t.success as f64 / t.played as f64);
                }
            }
            println!();
        }
        print!("{:<width$} {:>4}", "credit", "");
        for t in &tallies[rows - 1] {
            print!(" {:>9.3}", t.credit / t.played.max(1) as f64);
        }
        println!(
            "\n\nPercent of scenarios passed. Credit: 1 per success; a missed attack earns up to 0.5\n\
             for bringing the ball toward the goal. `setpieces show <suite>` lists every scenario."
        );
    }

    /// Writes the generated families to arena/scenarios/gen-*.txt.
    fn setpiece_generate(&self) -> Result<(), String> {
        let seed = 1;
        let pieces =
            generate::generate(seed, self.options.count.unwrap_or(40), self.options.threads);
        let dir = self.root.join("scenarios");
        for family in generate::FAMILIES {
            let mut text = format!(
                "# {}\n# Generated by `npm run arena -- setpieces generate --count {}` (seed {seed}). Do not edit by hand.\n",
                family.description,
                self.options.count.unwrap_or(40)
            );
            for (_, name, body) in pieces.iter().filter(|p| p.0 == family.name) {
                text += &format!("\n[{name}]\n{body}");
            }
            let path = dir.join(format!("{}.txt", family.name));
            fs::write(&path, text).map_err(|e| format!("{}: {e}", path.display()))?;
            eprintln!(
                "{}: {} scenarios",
                family.name,
                pieces.iter().filter(|p| p.0 == family.name).count()
            );
        }
        Ok(())
    }

    /// Per-scenario results of every brain for a suite, or details of one scenario.
    fn setpiece_show(&self, words: &[String]) -> Result<(), String> {
        let word = words.first().ok_or("show needs a suite or a scenario id")?;
        let pieces: Vec<&SetPiece> = self
            .setpieces
            .pieces
            .iter()
            .filter(|p| &p.suite == word || &p.id == word)
            .collect();
        if pieces.is_empty() {
            return Err(format!("No suite or scenario named {word}"));
        }
        let names: Vec<&str> = self.brains.iter().map(|b| b.spec.name.as_str()).collect();
        let width = pieces.iter().map(|p| p.id.len()).max().unwrap_or(8).max(8);
        // A car that does nothing shows which scenarios play themselves.
        let idle = idle_brain();
        print!("{:<width$} {:<6} {:>9}", "scenario", "kind", "idle");
        for n in &names {
            print!(" {n:>9}");
        }
        println!();
        for piece in &pieces {
            let baseline = harness::run_scenario(&ScenarioJob {
                scenario: piece.scenario.clone(),
                brain: idle.clone(),
            });
            print!(
                "{:<width$} {:<6} {:>9}",
                piece.id,
                piece.scenario.kind.name(),
                describe(
                    baseline.success,
                    baseline.goal,
                    baseline.seconds,
                    baseline.credit
                )
            );
            for b in 0..self.brains.len() {
                let cell = self.setpiece_result(b, piece).map_or("-".into(), |r| {
                    describe(r.success, r.goal, r.seconds, r.credit)
                });
                print!(" {cell:>9}");
            }
            println!();
        }
        if let [piece] = pieces.as_slice() {
            println!("\n{}", piece.text);
            let brain = match &self.options.brain {
                Some(name) => self.index(name)?,
                None => 0,
            };
            let spec = &self.brains[brain].spec;
            println!(
                "Watch {} (choose another with --brain): {}/?{}",
                spec.name,
                self.options.url,
                watch_query(
                    piece,
                    &spec.name,
                    &spec.text(),
                    self.setpiece_result(brain, piece).map(|r| r.success)
                )
            );
        }
        Ok(())
    }
}

/// The do-nothing baseline.
pub fn idle_brain() -> BrainSpec {
    BrainSpec::parse("idle", "module = scripted\nmode = idle").expect("idle brain")
}

/// Short text for one outcome: a goal with its time, a held defense, a concession, or a miss with its credit.
fn describe(success: bool, goal: Option<usize>, seconds: f64, credit: f64) -> String {
    match (success, goal) {
        (true, Some(0)) => format!("goal {seconds:.1}s"),
        (true, _) => "held".into(),
        (false, Some(1)) => format!("conc {seconds:.1}s"),
        _ => format!("miss {credit:.2}"),
    }
}

/// Query string that replays a set piece in the browser. `expect` is the logged verdict, if any.
pub fn watch_query(piece: &SetPiece, brain: &str, spec: &str, expect: Option<bool>) -> String {
    let mut query = format!(
        "setpiece={}&scenario={}&names={}&blue={}",
        encode(&piece.id),
        encode(&piece.text),
        encode(brain),
        encode(spec)
    );
    if let Some(pass) = expect {
        query += if pass { "&expect=pass" } else { "&expect=fail" };
    }
    query
}

impl Arena {
    /// Writes public/arena/setpieces.json: suites, scenarios with an idle baseline, and every current result.
    /// Results are arrays `[success, credit, seconds, goal, touches]`, with goal -1 when nobody scored.
    pub fn export_setpieces(&self, dir: &Path) -> Result<(), String> {
        let idle = idle_brain();
        let jobs: Vec<ScenarioJob> = self
            .setpieces
            .pieces
            .iter()
            .map(|p| ScenarioJob {
                scenario: p.scenario.clone(),
                brain: idle.clone(),
            })
            .collect();
        let mut baseline = vec![None; jobs.len()];
        harness::run_scenarios(&jobs, self.options.threads, |i, o| baseline[i] = Some(o));
        let row = |success: bool, credit: f64, seconds: f64, goal: Option<usize>, touches: u32| {
            json!([
                u8::from(success),
                round(credit, 3),
                round(seconds, 2),
                goal.map_or(-1, |g| g as i64),
                touches
            ])
        };
        let v = |v: Vec3| [round(v.x, 2), round(v.y, 2), round(v.z, 2)];
        let scenarios: Vec<Value> = self
            .setpieces
            .pieces
            .iter()
            .zip(&baseline)
            .map(|(p, b)| {
                let s = &p.scenario;
                let b = b.expect("every job reports");
                json!({
                    "id": p.id,
                    "suite": p.suite,
                    "kind": s.kind.name(),
                    "time": s.time,
                    "note": s.note,
                    "text": p.text,
                    "ball": v(s.ball_pos),
                    "ballVel": v(s.ball_vel),
                    "cars": s.cars.iter().map(|c| json!({
                        "team": c.team, "x": c.x, "y": c.y, "yaw": c.yaw, "speed": c.speed, "boost": c.boost,
                    })).collect::<Vec<_>>(),
                    "rival": s.cars.iter().any(|c| c.team == 1).then(|| {
                        let mut text = s.rival.module.clone();
                        for (k, val) in &s.rival.settings {
                            text += &format!(" {k}={val}");
                        }
                        text
                    }),
                    "idle": row(b.success, b.credit, b.seconds, b.goal, b.touches),
                })
            })
            .collect();
        let results: serde_json::Map<String, Value> = self
            .brains
            .iter()
            .enumerate()
            .map(|(i, brain)| {
                let cells: Vec<Value> = self
                    .setpieces
                    .pieces
                    .iter()
                    .map(|p| {
                        self.setpiece_result(i, p).map_or(Value::Null, |r| {
                            row(r.success, r.credit, r.seconds, r.goal, r.touches)
                        })
                    })
                    .collect();
                (brain.spec.name.clone(), Value::Array(cells))
            })
            .collect();
        let data = json!({
            "suites": self.setpieces.suites.iter().map(|s| json!({
                "name": s.name,
                "description": s.description,
            })).collect::<Vec<_>>(),
            "scenarios": scenarios,
            "brains": self.brains.iter().map(|b| json!({ "name": b.spec.name, "text": b.spec.text() })).collect::<Vec<_>>(),
            "results": results,
        });
        let path = dir.join("setpieces.json");
        fs::write(&path, data.to_string()).map_err(|e| format!("{}: {e}", path.display()))?;
        Ok(())
    }
}

/// Loaded suites and results.
pub struct SetPieces {
    pub suites: Vec<Suite>,
    pub pieces: Vec<SetPiece>,
    pub log: Log,
}
impl SetPieces {
    pub fn load(root: &Path) -> Result<Self, String> {
        let (suites, pieces) = load(&root.join("scenarios"))?;
        Ok(Self {
            suites,
            pieces,
            log: Log::load(&root.join("results/setpieces.jsonl"))?,
        })
    }
}
