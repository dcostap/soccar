//! Brain arena: plays bot brains against each other, keeps every result, and rates them.
mod export;
mod heat;
mod ledger;
mod rating;
mod roster;
mod setpieces;

use heat::HeatLog;
use ledger::{Format, Ledger, Record};
use rating::Pairs;
use roster::Entry;
use setpieces::SetPieces;
use soccar_simulation::harness::{self, MatchResult, MatchSpec, PlayerReport};
use std::{
    collections::{BTreeMap, HashMap},
    path::{Path, PathBuf},
    time::Instant,
};

const HELP: &str = "\
arena <command> [options]

Commands:
  list                      Brains, fingerprints, and recorded matches
  ladder [brain ...]        Round robin: play every pairing up to --pairs seeds, then rate
  challenge <brain> [rival] Paired matches until a sequential test decides; rival defaults to the top brain
  ratings                   Leaderboard and head-to-head table
  matches                   List matches, sorted by any statistic
  show <id>                 Every statistic of one match, plus a link to watch it
  heatmap <brain|id>        Where a brain's cars and the ball spend their time, or one match's maps
  backfill                  Replay logged matches without heatmaps to add them (up to --limit)
  setpieces [brain ...]     Play set pieces each brain has no current result for, then summarize
  setpieces show <suite|id> Results of every brain per scenario, or one scenario with a watch link
  export                    Write public/arena/arena.json for the leaderboard page

Options:
  --size 1..3               Team size (default 3)
  --duration seconds        Match length (default 300)
  --threads count           Worker threads (default: all CPUs)
  --pairs count             Ladder seeds per pairing; each seed is played twice with sides swapped (default 10)
  --elo0 x --elo1 y         Challenge hypotheses: not better than x, at least y better (default 0 and 10)
  --max-pairs count         Challenge limit (default 2000)
  --seed-base n             Play seeds n+1, n+2, ... instead of 1, 2, ... A challenge then counts only those seeds.
                            Use an unannounced base to test on matches nobody tuned against.
  --sort key                matches: id, goals, margin, length, upset, any player stat (best player), total:<stat>
  --top count               matches: rows to print (default 20)
  --asc                     matches: smallest first
  --brain name              matches and backfill: only matches with this brain
  --all-versions            matches and ratings: include results of older brain versions
  --url base                Watch link base (default http://127.0.0.1:5173)
  --limit count             backfill: matches to replay (default all)
  --suite name              setpieces: only this suite

Brains live in arena/brains/*.brain. Results are appended to arena/results/matches.jsonl,
and heatmaps to arena/results/heatmaps.jsonl. Set pieces live in arena/scenarios/*.txt,
and their results in arena/results/setpieces.jsonl.";

pub struct Options {
    pub format: Format,
    threads: usize,
    pairs: u32,
    elo0: f64,
    elo1: f64,
    max_pairs: u32,
    seed_base: u32,
    sort: String,
    top: usize,
    asc: bool,
    pub brain: Option<String>,
    pub all_versions: bool,
    pub url: String,
    pub limit: usize,
    pub suite: Option<String>,
}

pub struct Arena {
    pub root: PathBuf,
    pub brains: Vec<Entry>,
    pub ledger: Ledger,
    pub heat: HeatLog,
    pub setpieces: SetPieces,
    pub options: Options,
}

/// Rating and averages of one brain over current results.
pub struct Standing {
    pub elo: f64,
    pub error: f64,
    pub games: usize,
    pub wins: usize,
    pub goals_for: f64,
    pub goals_against: f64,
    pub brain_ms: f64,
    /// Mean team total per match for each player statistic.
    pub averages: BTreeMap<String, f64>,
}

fn main() {
    if let Err(e) = run() {
        eprintln!("arena: {e}");
        std::process::exit(1);
    }
}

fn run() -> Result<(), String> {
    let mut words = Vec::new();
    let mut options = Options {
        format: Format {
            size: 3,
            duration: 300.0,
        },
        threads: std::thread::available_parallelism().map_or(4, |n| n.get()),
        pairs: 10,
        elo0: 0.0,
        elo1: 10.0,
        max_pairs: 2000,
        seed_base: 0,
        sort: "id".into(),
        top: 20,
        asc: false,
        brain: None,
        all_versions: false,
        url: "http://127.0.0.1:5173".into(),
        limit: usize::MAX,
        suite: None,
    };
    let mut args = std::env::args().skip(1);
    while let Some(arg) = args.next() {
        if !arg.starts_with("--") {
            words.push(arg);
            continue;
        }
        match arg.as_str() {
            "--help" => {
                println!("{HELP}");
                return Ok(());
            }
            "--asc" => {
                options.asc = true;
                continue;
            }
            "--all-versions" => {
                options.all_versions = true;
                continue;
            }
            _ => {}
        }
        let value = args
            .next()
            .ok_or_else(|| format!("Missing value for {arg}"))?;
        let bad = || format!("Invalid value for {arg}: {value}");
        match arg.as_str() {
            "--size" => options.format.size = value.parse().map_err(|_| bad())?,
            "--duration" => options.format.duration = value.parse().map_err(|_| bad())?,
            "--threads" => options.threads = value.parse().map_err(|_| bad())?,
            "--pairs" => options.pairs = value.parse().map_err(|_| bad())?,
            "--elo0" => options.elo0 = value.parse().map_err(|_| bad())?,
            "--elo1" => options.elo1 = value.parse().map_err(|_| bad())?,
            "--max-pairs" => options.max_pairs = value.parse().map_err(|_| bad())?,
            "--seed-base" => options.seed_base = value.parse().map_err(|_| bad())?,
            "--sort" => options.sort = value,
            "--top" => options.top = value.parse().map_err(|_| bad())?,
            "--brain" => options.brain = Some(value),
            "--url" => options.url = value.trim_end_matches('/').to_string(),
            "--limit" => options.limit = value.parse().map_err(|_| bad())?,
            "--suite" => options.suite = Some(value),
            _ => return Err(format!("Unknown option: {arg}")),
        }
    }
    if !(1..=3).contains(&options.format.size)
        || !(options.format.duration >= 0.0 && options.format.duration.is_finite())
        || options.threads == 0
        || options.elo1 <= options.elo0
    {
        return Err("Invalid configuration".into());
    }
    let Some(command) = words.first().cloned() else {
        println!("{HELP}");
        return Ok(());
    };
    let root = Path::new(env!("CARGO_MANIFEST_DIR")).to_path_buf();
    let brains = roster::load(&root.join("brains"))?;
    if brains.is_empty() {
        return Err("No brains in arena/brains".into());
    }
    let ledger = Ledger::load(&root.join("results/matches.jsonl"))?;
    let heat = HeatLog::load(&root.join("results/heatmaps.jsonl"))?;
    let setpieces = SetPieces::load(&root)?;
    let mut arena = Arena {
        root,
        brains,
        ledger,
        heat,
        setpieces,
        options,
    };
    let rest = &words[1..];
    match command.as_str() {
        "list" => arena.list(),
        "ladder" => {
            arena.ladder(rest)?;
            arena.export()
        }
        "challenge" => {
            arena.challenge(rest)?;
            arena.export()
        }
        "ratings" => {
            arena.ratings();
            Ok(())
        }
        "matches" => arena.matches(),
        "show" => arena.show(rest),
        "export" => arena.export(),
        "heatmap" => arena.heatmap(rest),
        "setpieces" if rest.first().is_some_and(|w| w == "show") => arena.setpieces(rest),
        "setpieces" => {
            arena.setpieces(rest)?;
            arena.export()
        }
        "backfill" => {
            arena.backfill()?;
            arena.export()
        }
        _ => Err(format!("Unknown command: {command}. Try --help.")),
    }
}

impl Arena {
    pub fn index(&self, name: &str) -> Result<usize, String> {
        self.brains
            .iter()
            .position(|b| b.spec.name == name)
            .ok_or_else(|| format!("Unknown brain: {name}"))
    }
    /// Brain indices of a record when both sides are current brain versions.
    pub fn current(&self, record: &Record) -> Option<[usize; 2]> {
        let find = |fp: &String| self.brains.iter().position(|b| &b.fingerprint == fp);
        Some([
            find(&record.fingerprints[0])?,
            find(&record.fingerprints[1])?,
        ])
    }
    /// Records in the selected format, with current brain indices where both sides are current.
    pub fn records(&self) -> impl Iterator<Item = (&Record, Option<[usize; 2]>)> {
        self.ledger
            .records
            .iter()
            .filter(|r| r.format() == self.options.format)
            .map(|r| (r, self.current(r)))
            .filter(|(_, current)| self.options.all_versions || current.is_some())
    }
    fn spec(&self, blue: usize, orange: usize, seed: u32) -> MatchSpec {
        MatchSpec {
            seed,
            team_size: self.options.format.size,
            brains: [
                self.brains[blue].spec.clone(),
                self.brains[orange].spec.clone(),
            ],
            duration: self.options.format.duration,
            ..MatchSpec::default()
        }
    }
    fn fingerprints(&self, blue: usize, orange: usize) -> [String; 2] {
        [
            self.brains[blue].fingerprint.clone(),
            self.brains[orange].fingerprint.clone(),
        ]
    }

    fn list(&self) -> Result<(), String> {
        let mut counts = vec![0; self.brains.len()];
        let mut stale = 0;
        for r in &self.ledger.records {
            match self.current(r) {
                Some([a, b]) if r.format() == self.options.format => {
                    counts[a] += 1;
                    counts[b] += 1;
                }
                Some(_) => {}
                None => stale += 1,
            }
        }
        println!(
            "{:<20} {:<10} {:<16} {:>8}  description",
            "brain", "module", "fingerprint", "matches"
        );
        for (b, n) in self.brains.iter().zip(counts) {
            println!(
                "{:<20} {:<10} {:<16} {:>8}  {}",
                b.spec.name, b.spec.module, b.fingerprint, n, b.description
            );
        }
        println!(
            "\n{} matches recorded, {} from older brain versions. Format: {}v{}, {} s.",
            self.ledger.records.len(),
            stale,
            self.options.format.size,
            self.options.format.size,
            self.options.format.duration
        );
        Ok(())
    }

    /// Plays specs in parallel, logging each result. `on_result` returns false to stop early.
    fn play(
        &mut self,
        specs: Vec<(MatchSpec, [String; 2])>,
        mut on_result: impl FnMut(&Record) -> bool,
    ) -> Result<usize, String> {
        let (specs, fingerprints): (Vec<_>, Vec<_>) = specs.into_iter().unzip();
        let mut error = None;
        let mut played = 0;
        let ledger = &mut self.ledger;
        let heat = &mut self.heat;
        harness::run_until(
            &specs,
            self.options.threads,
            |index, result: MatchResult| {
                if !result.completed {
                    error = Some(format!(
                        "Match with seed {} hit the tick limit",
                        result.spec.seed
                    ));
                    return false;
                }
                played += 1;
                match ledger
                    .append(&result, fingerprints[index].clone())
                    .and_then(|record| heat.append(record.id, &result.heatmaps).map(|_| record))
                {
                    Ok(record) => on_result(record),
                    Err(e) => {
                        error = Some(e);
                        false
                    }
                }
            },
        );
        error.map_or(Ok(played), Err)
    }

    fn ladder(&mut self, names: &[String]) -> Result<(), String> {
        let chosen: Vec<usize> = if names.is_empty() {
            (0..self.brains.len()).collect()
        } else {
            names
                .iter()
                .map(|n| self.index(n))
                .collect::<Result<_, _>>()?
        };
        let mut specs = Vec::new();
        for (i, &a) in chosen.iter().enumerate() {
            for &b in &chosen[i + 1..] {
                for k in 1..=self.options.pairs {
                    let seed = self.options.seed_base.wrapping_add(k);
                    for (blue, orange) in [(a, b), (b, a)] {
                        let fingerprints = self.fingerprints(blue, orange);
                        if !self
                            .ledger
                            .contains(&fingerprints, seed, self.options.format)
                        {
                            specs.push((self.spec(blue, orange, seed), fingerprints));
                        }
                    }
                }
            }
        }
        let total = specs.len();
        if total > 0 {
            eprintln!(
                "Playing {total} matches on {} threads.",
                self.options.threads
            );
        }
        let start = Instant::now();
        let mut done = 0;
        self.play(specs, |_| {
            done += 1;
            let rate = done as f64 / start.elapsed().as_secs_f64();
            eprint!(
                "\r{done}/{total}  {rate:.1} matches/s  {:.0} s left   ",
                (total - done) as f64 / rate
            );
            true
        })?;
        if total > 0 {
            eprintln!();
        }
        self.ratings();
        Ok(())
    }

    fn challenge(&mut self, names: &[String]) -> Result<(), String> {
        let a = self.index(names.first().ok_or("challenge needs a brain name")?)?;
        let b = match names.get(1) {
            Some(name) => self.index(name)?,
            None => {
                let standings = self.standings();
                (0..self.brains.len())
                    .filter(|&i| i != a && standings[i].games > 0)
                    .max_by(|&i, &j| standings[i].elo.total_cmp(&standings[j].elo))
                    .ok_or("No rated rival yet. Name one, or run the ladder first.")?
            }
        };
        if a == b {
            return Err("A brain cannot challenge itself".into());
        }
        let (name_a, name_b) = (
            self.brains[a].spec.name.clone(),
            self.brains[b].spec.name.clone(),
        );
        let (elo0, elo1) = (self.options.elo0, self.options.elo1);
        let (lower, upper) = ((0.05f64 / 0.95).ln(), (0.95f64 / 0.05).ln());
        println!(
            "{name_a} vs {name_b}: is {name_a} at least {elo1} Elo better (H1) or at most {elo0} (H0)?"
        );
        // Score of brain a in each half of a seed: [a blue, a orange].
        let mut halves: HashMap<u32, [Option<f64>; 2]> = HashMap::new();
        let (fp_a, fp_b) = (
            self.brains[a].fingerprint.clone(),
            self.brains[b].fingerprint.clone(),
        );
        let mut pairs = Pairs::default();
        let mut wins = [0usize; 2];
        let (base, limit) = (self.options.seed_base, self.options.max_pairs);
        let mut add = |record: &Record, pairs: &mut Pairs, wins: &mut [usize; 2]| {
            if record.seed.wrapping_sub(base).wrapping_sub(1) >= limit {
                return;
            }
            let side = if record.fingerprints == [fp_a.clone(), fp_b.clone()] {
                0
            } else if record.fingerprints == [fp_b.clone(), fp_a.clone()] {
                1
            } else {
                return;
            };
            let Some(winner) = record.winner() else {
                return;
            };
            let score = if winner == side { 1.0 } else { 0.0 };
            wins[usize::from(score == 0.0)] += 1;
            let half = halves.entry(record.seed).or_default();
            half[side] = Some(score);
            if let [Some(x), Some(y)] = *half {
                pairs.add((x + y) / 2.0);
            }
        };
        for record in &self.ledger.records {
            if record.format() == self.options.format {
                add(record, &mut pairs, &mut wins);
            }
        }
        let report = |pairs: &Pairs, wins: &[usize; 2], end: &str| {
            let (e, low, high) = pairs.elo();
            eprint!(
                "\rpairs {:>5}  {}-{}  score {:>5.1}%  Elo {:>+6.1} [{:+.0}, {:+.0}]  LLR {:>6.2} ({lower:.2}, {upper:.2}){end}   ",
                pairs.count,
                wins[0],
                wins[1],
                pairs.mean() * 100.0,
                e,
                low,
                high,
                pairs.llr(elo0, elo1),
            );
        };
        let decided = |pairs: &Pairs| {
            let llr = pairs.llr(elo0, elo1);
            pairs.count >= 10 && (llr <= lower || llr >= upper)
        };
        if pairs.count > 0 {
            eprintln!("Reusing {} recorded pairs.", pairs.count);
        }
        if !decided(&pairs) && pairs.count < self.options.max_pairs as usize {
            let mut specs = Vec::new();
            for k in 1..=self.options.max_pairs {
                let seed = self.options.seed_base.wrapping_add(k);
                for (blue, orange) in [(a, b), (b, a)] {
                    let fingerprints = self.fingerprints(blue, orange);
                    if !self
                        .ledger
                        .contains(&fingerprints, seed, self.options.format)
                    {
                        specs.push((self.spec(blue, orange, seed), fingerprints));
                    }
                }
            }
            self.play(specs, |record| {
                let before = pairs.count;
                add(record, &mut pairs, &mut wins);
                if pairs.count > before {
                    report(&pairs, &wins, "");
                }
                !decided(&pairs)
            })?;
        }
        report(&pairs, &wins, "\n");
        let llr = pairs.llr(elo0, elo1);
        let (e, low, high) = pairs.elo();
        let verdict = if llr >= upper {
            format!("{name_a} is stronger: {e:+.0} Elo [{low:+.0}, {high:+.0}].")
        } else if llr <= lower {
            format!("{name_a} is not {elo1} Elo stronger: {e:+.0} Elo [{low:+.0}, {high:+.0}].")
        } else {
            format!(
                "Undecided after {} pairs: {e:+.0} Elo [{low:+.0}, {high:+.0}]. Raise --max-pairs to continue.",
                pairs.count
            )
        };
        println!("{verdict}");
        Ok(())
    }

    pub fn standings(&self) -> Vec<Standing> {
        let n = self.brains.len();
        let mut games = Vec::new();
        let mut standings: Vec<Standing> = (0..n)
            .map(|_| Standing {
                elo: 0.0,
                error: 0.0,
                games: 0,
                wins: 0,
                goals_for: 0.0,
                goals_against: 0.0,
                brain_ms: 0.0,
                averages: BTreeMap::new(),
            })
            .collect();
        for record in &self.ledger.records {
            let Some(sides) = self
                .current(record)
                .filter(|_| record.format() == self.options.format)
            else {
                continue;
            };
            let Some(winner) = record.winner() else {
                continue;
            };
            if sides[0] == sides[1] {
                continue;
            }
            games.push((sides[winner], sides[1 - winner]));
            for team in 0..2 {
                let s = &mut standings[sides[team]];
                s.games += 1;
                s.wins += usize::from(winner == team);
                s.goals_for += record.score[team] as f64;
                s.goals_against += record.score[1 - team] as f64;
                s.brain_ms += record.teams[team].brain_ms;
                for (name, _) in PlayerReport::default().fields() {
                    *s.averages.entry(name.into()).or_default() += record.team_stat(team, name);
                }
                *s.averages.entry("possession".into()).or_default() +=
                    record.teams[team].possession / record.live.max(1e-9);
            }
        }
        let fit = rating::bradley_terry(n, &games);
        // Anchor rookie at 1000 when it has played; otherwise center the field on 1500.
        let rookie = self.brains.iter().position(|b| b.spec.name == "rookie");
        let shift = match rookie.filter(|&i| standings[i].games > 0) {
            Some(i) => 1000.0 - fit[i].0,
            None => {
                let rated: Vec<_> = (0..n).filter(|&i| standings[i].games > 0).collect();
                1500.0 - rated.iter().map(|&i| fit[i].0).sum::<f64>() / rated.len().max(1) as f64
            }
        };
        for (s, (elo, error)) in standings.iter_mut().zip(fit) {
            s.elo = elo + shift;
            s.error = error;
            let g = s.games.max(1) as f64;
            s.goals_for /= g;
            s.goals_against /= g;
            s.brain_ms /= g;
            for v in s.averages.values_mut() {
                *v /= g;
            }
        }
        standings
    }

    fn ratings(&self) {
        let standings = self.standings();
        let mut order: Vec<usize> = (0..self.brains.len()).collect();
        order.sort_by(|&a, &b| {
            (standings[b].games > 0)
                .cmp(&(standings[a].games > 0))
                .then(standings[b].elo.total_cmp(&standings[a].elo))
        });
        println!(
            "\n{:>2}  {:<18} {:>6} {:>5} {:>6} {:>5}  {:>5} {:>5} {:>6} {:>6} {:>6} {:>5} {:>5} {:>6}",
            "#",
            "brain",
            "Elo",
            "±",
            "games",
            "win%",
            "GF",
            "GA",
            "shots",
            "saves",
            "touch",
            "demos",
            "poss%",
            "ms/m"
        );
        for (rank, &i) in order.iter().enumerate() {
            let s = &standings[i];
            if s.games == 0 {
                println!(
                    "{:>2}  {:<18} {:>6}",
                    "-", self.brains[i].spec.name, "unrated"
                );
                continue;
            }
            let avg = |k: &str| s.averages.get(k).copied().unwrap_or(0.0);
            println!(
                "{:>2}  {:<18} {:>6.0} {:>5.0} {:>6} {:>5.1}  {:>5.2} {:>5.2} {:>6.2} {:>6.2} {:>6.1} {:>5.2} {:>5.1} {:>6.0}",
                rank + 1,
                self.brains[i].spec.name,
                s.elo,
                1.96 * s.error,
                s.games,
                s.wins as f64 * 100.0 / s.games as f64,
                s.goals_for,
                s.goals_against,
                avg("shots"),
                avg("saves"),
                avg("touches"),
                avg("demos"),
                avg("possession") * 100.0,
                s.brain_ms,
            );
        }
        // Head to head: row brain's win percentage against column brain.
        let shown: Vec<usize> = order
            .iter()
            .copied()
            .filter(|&i| standings[i].games > 0)
            .take(12)
            .collect();
        if shown.len() < 2 {
            return;
        }
        let mut table = vec![vec![(0usize, 0usize); self.brains.len()]; self.brains.len()];
        for (record, sides) in self.records() {
            let (Some([b, o]), Some(w)) = (sides, record.winner()) else {
                continue;
            };
            table[b][o].1 += 1;
            table[o][b].1 += 1;
            if w == 0 {
                table[b][o].0 += 1;
            } else {
                table[o][b].0 += 1;
            }
        }
        print!("\nwin% row vs column\n{:<18}", "");
        for &j in &shown {
            print!(" {:>8.8}", self.brains[j].spec.name);
        }
        println!();
        for &i in &shown {
            print!("{:<18}", self.brains[i].spec.name);
            for &j in &shown {
                let (w, n) = table[i][j];
                if n == 0 {
                    print!(" {:>8}", "-");
                } else {
                    print!(" {:>8.1}", w as f64 * 100.0 / n as f64);
                }
            }
            println!();
        }
    }

    /// Sort value of a match for `matches --sort`, and the player index it refers to, if any.
    fn sort_value(
        &self,
        record: &Record,
        key: &str,
        standings: &[Standing],
    ) -> Option<(f64, Option<usize>)> {
        Some(match key {
            "id" => (record.id as f64, None),
            "goals" => ((record.score[0] + record.score[1]) as f64, None),
            "margin" => (
                (record.score[0] as f64 - record.score[1] as f64).abs(),
                None,
            ),
            "length" => (record.live, None),
            "upset" => {
                let sides = self.current(record)?;
                let w = record.winner()?;
                (standings[sides[1 - w]].elo - standings[sides[w]].elo, None)
            }
            _ => {
                if let Some(stat) = key.strip_prefix("total:") {
                    (record.team_stat(0, stat) + record.team_stat(1, stat), None)
                } else {
                    let (index, player) = record.players.iter().enumerate().max_by(|a, b| {
                        a.1.stats
                            .get(key)
                            .unwrap_or(&0.0)
                            .total_cmp(b.1.stats.get(key).unwrap_or(&0.0))
                    })?;
                    (*player.stats.get(key)?, Some(index))
                }
            }
        })
    }

    fn matches(&self) -> Result<(), String> {
        let key = self.options.sort.as_str();
        let stats: Vec<&str> = PlayerReport::default()
            .fields()
            .iter()
            .map(|f| f.0)
            .collect();
        let known = ["id", "goals", "margin", "length", "upset"].contains(&key)
            || stats.contains(&key.strip_prefix("total:").unwrap_or(key));
        if !known {
            return Err(format!(
                "Unknown sort key {key}. Use id, goals, margin, length, upset, a stat, or total:<stat>. Stats: {}",
                stats.join(", ")
            ));
        }
        let standings = self.standings();
        let mut rows: Vec<(&Record, f64, Option<usize>)> = self
            .records()
            .filter(|(r, _)| {
                self.options
                    .brain
                    .as_ref()
                    .is_none_or(|b| r.brains.contains(b))
            })
            .filter_map(|(r, _)| {
                let (value, player) = self.sort_value(r, key, &standings)?;
                Some((r, value, player))
            })
            .collect();
        rows.sort_by(|a, b| {
            let order = a.1.total_cmp(&b.1).then(a.0.id.cmp(&b.0.id));
            if self.options.asc {
                order
            } else {
                order.reverse()
            }
        });
        println!(
            "{:>6}  {:<16} {:<16} {:>7} {:>6}  {:>10}  player",
            "id", "blue", "orange", "score", "length", key
        );
        for (r, value, player) in rows.iter().take(self.options.top) {
            let who = player.map_or(String::new(), |p| {
                let team = r.players[p].team;
                format!(
                    "{} car {} ({})",
                    ["blue", "orange"][team],
                    p,
                    r.brains[team]
                )
            });
            println!(
                "{:>6}  {:<16} {:<16} {:>3}-{:<2}{} {:>5.0}s  {:>10.2}  {who}",
                r.id,
                r.brains[0],
                r.brains[1],
                r.score[0],
                r.score[1],
                if r.overtime { "*" } else { " " },
                r.live,
                value,
            );
        }
        println!(
            "{} matches. * means overtime. Use `arena show <id>` for details and a watch link.",
            rows.len()
        );
        Ok(())
    }

    fn show(&self, words: &[String]) -> Result<(), String> {
        let id: u64 = words
            .first()
            .and_then(|w| w.parse().ok())
            .ok_or("show needs a match id")?;
        let r = self
            .ledger
            .records
            .iter()
            .find(|r| r.id == id)
            .ok_or("No such match")?;
        println!(
            "Match {}  seed {}  {}v{}  {} s{}",
            r.id,
            r.seed,
            r.size,
            r.size,
            r.duration,
            if self.current(r).is_some() {
                ""
            } else {
                "  (older brain version)"
            }
        );
        println!(
            "{} {} - {} {}{}   live {:.0} s",
            r.brains[0],
            r.score[0],
            r.score[1],
            r.brains[1],
            if r.overtime { " (OT)" } else { "" },
            r.live
        );
        for (t, team) in r.teams.iter().enumerate() {
            println!(
                "{:<7} possession {:>5.1}%  ball in own half {:>5.1}%  brain {:.0} ms",
                ["blue", "orange"][t],
                team.possession * 100.0 / r.live.max(1e-9),
                team.defending * 100.0 / r.live.max(1e-9),
                team.brain_ms
            );
        }
        let names: Vec<&str> = PlayerReport::default()
            .fields()
            .iter()
            .map(|f| f.0)
            .collect();
        print!("\n{:<12}", "stat");
        for (i, p) in r.players.iter().enumerate() {
            print!(" {:>10}", format!("{}{}", ["B", "O"][p.team], i));
        }
        println!();
        for name in names {
            print!("{name:<12}");
            for p in &r.players {
                print!(" {:>10.1}", p.stats.get(name).unwrap_or(&0.0));
            }
            println!();
        }
        println!("\nWatch: {}", export::watch_url(&self.options.url, r));
        Ok(())
    }
}
