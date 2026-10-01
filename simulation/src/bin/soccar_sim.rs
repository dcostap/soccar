use soccar_simulation::{
    bot::Skill,
    car::Controls,
    game::{Config, Game, Phase},
};
use std::{
    io::{self, Write},
    sync::{
        Arc,
        atomic::{AtomicUsize, Ordering},
        mpsc,
    },
    thread,
    time::Instant,
};
fn main() {
    if let Err(e) = run() {
        eprintln!("soccar-sim: {e}");
        std::process::exit(1);
    }
}
fn run() -> Result<(), String> {
    let mut config = Config {
        team_size: 3,
        skill: Skill::Allstar,
        player_team: -1,
        ..Config::default()
    };
    let mut seed = 12345_u32;
    let mut matches = 1_usize;
    let mut threads = 1_usize;
    let mut limit = 216000_u32;
    let mut replays = false;
    let mut args = std::env::args().skip(1);
    while let Some(arg) = args.next() {
        if arg == "--help" {
            println!(
                "soccar-sim [--team-size 1..3] [--duration seconds] [--skill rookie|pro|allstar] [--seed u32] [--matches count] [--threads count] [--max-ticks count] [--replays]\nOutput: one JSON result per match. Exit 2 means at least one match reached its tick limit."
            );
            return Ok(());
        }
        if arg == "--replays" {
            replays = true;
            continue;
        }
        let value = args
            .next()
            .ok_or_else(|| format!("Missing value for {arg}"))?;
        match arg.as_str() {
            "--team-size" => config.team_size = value.parse().map_err(|_| "Invalid team size")?,
            "--duration" => config.duration = value.parse().map_err(|_| "Invalid duration")?,
            "--seed" => seed = value.parse().map_err(|_| "Invalid seed")?,
            "--matches" => matches = value.parse().map_err(|_| "Invalid match count")?,
            "--threads" => threads = value.parse().map_err(|_| "Invalid thread count")?,
            "--max-ticks" => limit = value.parse().map_err(|_| "Invalid tick limit")?,
            "--skill" => {
                config.skill = match value.as_str() {
                    "rookie" => Skill::Rookie,
                    "pro" => Skill::Pro,
                    "allstar" => Skill::Allstar,
                    _ => return Err("Invalid skill".into()),
                }
            }
            _ => return Err(format!("Unknown argument: {arg}")),
        }
    }
    if !(1..=3).contains(&config.team_size)
        || !config.duration.is_finite()
        || config.duration < 0.0
        || matches == 0
        || threads == 0
        || threads > 256
        || limit == 0
    {
        return Err("Invalid configuration".into());
    }
    let next = Arc::new(AtomicUsize::new(0));
    let (tx, rx) = mpsc::channel();
    let mut workers = Vec::new();
    for _ in 0..threads.min(matches) {
        let tx = tx.clone();
        let next = next.clone();
        let worker = move || {
            loop {
                let index = next.fetch_add(1, Ordering::Relaxed);
                if index >= matches {
                    break;
                }
                let match_seed = seed.wrapping_add(index as u32);
                let start = Instant::now();
                let mut game = Game::new(match_seed);
                game.skip_replays = !replays;
                game.start_match(config);
                let mut ticks = 0;
                while game.phase != Phase::Ended && ticks < limit {
                    game.tick(Controls::default());
                    ticks += 1;
                }
                let completed = game.phase == Phase::Ended;
                let winner = if completed {
                    if game.score[0] > game.score[1] {
                        "0"
                    } else {
                        "1"
                    }
                } else {
                    "null"
                };
                let line = format!(
                    "{{\"match\":{index},\"seed\":{match_seed},\"completed\":{completed},\"score\":[{},{}],\"winner\":{winner},\"overtime\":{},\"clock\":{},\"controllerTicks\":{ticks},\"physicsTicks\":{},\"elapsedMs\":{:.3}}}",
                    game.score[0],
                    game.score[1],
                    game.overtime,
                    game.clock,
                    game.world.tick,
                    start.elapsed().as_secs_f64() * 1000.0,
                );
                if tx.send((completed, line)).is_err() {
                    break;
                }
            }
        };
        workers.push(thread::spawn(worker));
    }
    drop(tx);
    let mut all_completed = true;
    let stdout = io::stdout();
    let mut output = stdout.lock();
    for (completed, line) in rx {
        all_completed &= completed;
        writeln!(output, "{line}").map_err(|e| e.to_string())?;
    }
    for worker in workers {
        worker.join().map_err(|_| "Match worker failed")?;
    }
    if !all_completed {
        std::process::exit(2);
    }
    Ok(())
}
