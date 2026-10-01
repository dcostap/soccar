use soccar_simulation::{
    bot::Skill,
    harness::{self, MatchResult, MatchSpec, Summary},
};
use std::{
    io::{self, Write},
    time::Instant,
};
fn main() {
    match run() {
        Ok(true) => {}
        Ok(false) => std::process::exit(2),
        Err(e) => {
            eprintln!("soccar-sim: {e}");
            std::process::exit(1);
        }
    }
}
fn skill(value: &str) -> Result<Skill, String> {
    match value {
        "rookie" => Ok(Skill::Rookie),
        "pro" => Ok(Skill::Pro),
        "allstar" => Ok(Skill::Allstar),
        _ => Err("Invalid skill".into()),
    }
}
/// Returns whether every match completed.
fn run() -> Result<bool, String> {
    let mut spec = MatchSpec::default();
    let mut matches = 1_usize;
    let mut threads = 1_usize;
    let mut args = std::env::args().skip(1);
    while let Some(arg) = args.next() {
        if arg == "--help" {
            println!(
                "soccar-sim [--team-size 1..3] [--duration seconds] [--skill rookie|pro|allstar[,orange skill]] [--seed u32] [--matches count] [--threads count] [--max-ticks count] [--replays]\nOutput: one JSON result per match on stdout and a batch summary on stderr. Exit 2 means at least one match reached its tick limit."
            );
            return Ok(true);
        }
        if arg == "--replays" {
            spec.replays = true;
            continue;
        }
        let value = args
            .next()
            .ok_or_else(|| format!("Missing value for {arg}"))?;
        match arg.as_str() {
            "--team-size" => spec.team_size = value.parse().map_err(|_| "Invalid team size")?,
            "--duration" => spec.duration = value.parse().map_err(|_| "Invalid duration")?,
            "--seed" => spec.seed = value.parse().map_err(|_| "Invalid seed")?,
            "--matches" => matches = value.parse().map_err(|_| "Invalid match count")?,
            "--threads" => threads = value.parse().map_err(|_| "Invalid thread count")?,
            "--max-ticks" => spec.max_ticks = value.parse().map_err(|_| "Invalid tick limit")?,
            "--skill" => {
                spec.skills = match value.split_once(',') {
                    Some((blue, orange)) => [skill(blue)?, skill(orange)?],
                    None => [skill(&value)?; 2],
                }
            }
            _ => return Err(format!("Unknown argument: {arg}")),
        }
    }
    if !(1..=3).contains(&spec.team_size)
        || !spec.duration.is_finite()
        || spec.duration < 0.0
        || matches == 0
        || threads == 0
        || threads > 256
        || spec.max_ticks == 0
    {
        return Err("Invalid configuration".into());
    }
    // Each match uses seed + index, with unsigned 32-bit wrapping.
    let specs: Vec<_> = (0..matches)
        .map(|index| MatchSpec {
            seed: spec.seed.wrapping_add(index as u32),
            ..spec
        })
        .collect();
    let start = Instant::now();
    let mut summary = Summary::default();
    let mut output = io::BufWriter::new(io::stdout().lock());
    let mut failure = None;
    harness::run_batch(&specs, threads, |index, result| {
        summary.add(&result);
        if failure.is_none()
            && let Err(e) =
                writeln!(output, "{}", json(index, &result)).and_then(|_| output.flush())
        {
            failure = Some(e.to_string());
        }
    });
    if let Some(e) = failure {
        return Err(e);
    }
    let seconds = start.elapsed().as_secs_f64();
    eprintln!(
        "{{\"matches\":{},\"completed\":{},\"blueWins\":{},\"orangeWins\":{},\"overtimes\":{},\"goals\":[{},{}],\"threads\":{},\"wallMs\":{:.3},\"matchesPerSecond\":{:.3},\"physicsTicksPerSecond\":{:.0}}}",
        summary.matches,
        summary.completed,
        summary.wins[0],
        summary.wins[1],
        summary.overtimes,
        summary.goals[0],
        summary.goals[1],
        threads.min(matches),
        seconds * 1000.0,
        summary.matches as f64 / seconds,
        summary.physics_ticks as f64 / seconds,
    );
    Ok(summary.completed == summary.matches)
}
fn json(index: usize, r: &MatchResult) -> String {
    let players: Vec<_> = r
        .players
        .iter()
        .map(|(team, s)| {
            format!(
                "{{\"team\":{team},\"score\":{},\"goals\":{},\"assists\":{},\"shots\":{},\"saves\":{}}}",
                s.score, s.goals, s.assists, s.shots, s.saves
            )
        })
        .collect();
    let winner = r.winner().map_or("null".into(), |t| t.to_string());
    format!(
        "{{\"match\":{index},\"seed\":{},\"completed\":{},\"score\":[{},{}],\"winner\":{winner},\"overtime\":{},\"clock\":{},\"controllerTicks\":{},\"physicsTicks\":{},\"elapsedMs\":{:.3},\"players\":[{}]}}",
        r.spec.seed,
        r.completed,
        r.score[0],
        r.score[1],
        r.overtime,
        r.clock,
        r.controller_ticks,
        r.physics_ticks,
        r.elapsed.as_secs_f64() * 1000.0,
        players.join(","),
    )
}
