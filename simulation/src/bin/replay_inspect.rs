//! Produce a searchable event timeline and exact state samples from a player replay.
use serde_json::{Value, json};
use soccar_simulation::{
    DT,
    brains::BrainSpec,
    car::Controls,
    game::{COUNTDOWN, Config, ENDED, Game, OVERTIME, SAVE, Stats},
    recording::Replay,
    scenario::{Kind, Scenario},
    world::{BALL_BOUNCE, BALL_HIT, BOOST_PICKUP, BUMP, DEMO, FLIP, GOAL, JUMP, LAND, RESPAWN},
};
use std::{collections::BTreeMap, env, fs, process};

struct Options {
    path: String,
    at: Option<f64>,
    window: f64,
    sample: f64,
    output: Option<String>,
    match_id: Option<u64>,
    extract: Option<String>,
    car: Option<usize>,
    kind: Option<Kind>,
    timeout: Option<f64>,
    name: Option<String>,
    description: Option<String>,
}

fn usage() -> ! {
    eprintln!(
        "Usage: replay_inspect <replay.json|matches.jsonl> [--match <id>] [--at <seconds|MM:SS>] [--window <seconds>] [--sample <seconds>] [--output <report.json>] [--extract <setpiece.txt> --car <id> --kind <attack|defend> --timeout <seconds> --name <name> --description <text>]"
    );
    process::exit(2);
}

fn time(value: &str) -> Result<f64, String> {
    let parts: Vec<_> = value.split(':').collect();
    let number = |part: &str| {
        part.parse::<f64>()
            .map_err(|_| format!("Invalid time: {value}"))
    };
    let seconds = match parts.as_slice() {
        [seconds] => number(seconds)?,
        [minutes, seconds] => number(minutes)? * 60.0 + number(seconds)?,
        [hours, minutes, seconds] => {
            number(hours)? * 3600.0 + number(minutes)? * 60.0 + number(seconds)?
        }
        _ => return Err(format!("Invalid time: {value}")),
    };
    if seconds.is_finite() && seconds >= 0.0 {
        Ok(seconds)
    } else {
        Err(format!("Invalid time: {value}"))
    }
}

fn options() -> Result<Options, String> {
    let mut args = env::args().skip(1);
    let path = args.next().unwrap_or_else(|| usage());
    let mut result = Options {
        path,
        at: None,
        window: 5.0,
        sample: 0.25,
        output: None,
        match_id: None,
        extract: None,
        car: None,
        kind: None,
        timeout: None,
        name: None,
        description: None,
    };
    while let Some(arg) = args.next() {
        let mut value = || {
            args.next()
                .ok_or_else(|| format!("Missing value after {arg}"))
        };
        match arg.as_str() {
            "--at" => result.at = Some(time(&value()?)?),
            "--window" => result.window = time(&value()?)?,
            "--sample" => result.sample = time(&value()?)?,
            "--output" => result.output = Some(value()?),
            "--match" => {
                result.match_id = Some(
                    value()?
                        .parse()
                        .map_err(|_| "Match ID must be an integer".to_string())?,
                )
            }
            "--extract" => result.extract = Some(value()?),
            "--car" => {
                result.car = Some(
                    value()?
                        .parse()
                        .map_err(|_| "Car must be an integer".to_string())?,
                )
            }
            "--kind" => result.kind = Some(Kind::parse(&value()?)?),
            "--timeout" => result.timeout = Some(time(&value()?)?),
            "--name" => result.name = Some(value()?),
            "--description" => result.description = Some(value()?),
            "--help" | "-h" => usage(),
            _ => return Err(format!("Unknown option: {arg}")),
        }
    }
    if result.window <= 0.0 || result.sample <= 0.0 {
        return Err("Window and sample must be positive".into());
    }
    if result.extract.is_some()
        && (result.at.is_none()
            || result.car.is_none()
            || result.kind.is_none()
            || result.timeout.is_none()
            || result.name.is_none()
            || result.description.is_none())
    {
        return Err(
            "Extraction requires --at, --car, --kind, --timeout, --name, and --description".into(),
        );
    }
    Ok(result)
}

fn event_name(kind: u32) -> &'static str {
    match kind {
        BALL_BOUNCE => "ball_bounce",
        BALL_HIT => "ball_hit",
        DEMO => "demolition",
        BUMP => "bump",
        JUMP => "jump",
        FLIP => "flip",
        LAND => "land",
        BOOST_PICKUP => "boost_pickup",
        RESPAWN => "respawn",
        GOAL => "goal",
        COUNTDOWN => "countdown",
        OVERTIME => "overtime",
        ENDED => "match_ended",
        SAVE => "save",
        _ => "unknown",
    }
}

fn moment(game: &Game, tick: usize) -> Value {
    let cars: Vec<_> = game
        .world
        .cars
        .iter()
        .map(|car| {
            json!({
                "id": car.id,
                "team": car.team,
                "position": car.pos,
                "velocity": car.vel,
                "angularVelocity": car.ang_vel,
                "forward": car.forward,
                "up": car.up,
                "boost": car.boost,
                "onGround": car.is_on_ground,
                "demoed": car.is_demoed,
                "controls": car.controls,
                "stats": game.stats.get(car.id),
            })
        })
        .collect();
    json!({
        "tick": tick,
        "time": tick as f64 * DT,
        "clock": game.clock,
        "phase": game.phase,
        "score": game.score,
        "overtime": game.overtime,
        "ball": {
            "position": game.world.ball.pos,
            "velocity": game.world.ball.vel,
            "angularVelocity": game.world.ball.ang_vel,
            "lastTouches": game.last_touches,
        },
        "cars": cars,
    })
}

fn stat_changes(before: &[Stats], game: &Game, tick: usize, events: &mut Vec<Value>) {
    for (car, (old, new)) in before.iter().zip(&game.stats).enumerate() {
        for (name, previous, current) in [
            ("score", old.score, new.score),
            ("goals", old.goals, new.goals),
            ("assists", old.assists, new.assists),
            ("shots", old.shots, new.shots),
            ("saves", old.saves, new.saves),
        ] {
            if current != previous {
                events.push(json!({
                    "tick": tick,
                    "time": tick as f64 * DT,
                    "type": "stat_change",
                    "stat": name,
                    "car": car,
                    "team": game.world.cars.get(car).map(|value| value.team),
                    "previous": previous,
                    "value": current,
                    "score": game.score,
                    "phase": game.phase,
                }));
            }
        }
    }
}

fn run(options: Options) -> Result<(), String> {
    let text = fs::read_to_string(&options.path).map_err(|e| e.to_string())?;
    #[derive(serde::Deserialize)]
    struct LoggedMatch {
        id: u64,
        seed: u32,
        size: usize,
        duration: f64,
        brains: [String; 2],
        specs: [String; 2],
        score: [u32; 2],
        ticks: usize,
    }
    let (
        source_type,
        engine,
        frames,
        human,
        initial_team,
        config,
        initial_score,
        expected,
        mut game,
    ) = if let Some(id) = options.match_id {
        let logged: LoggedMatch = text
            .lines()
            .filter_map(|line| serde_json::from_str(line).ok())
            .find(|value: &LoggedMatch| value.id == id)
            .ok_or_else(|| format!("Match {id} is missing from {}", options.path))?;
        let brains = [0, 1].map(|i| {
            BrainSpec::parse(&logged.brains[i], &logged.specs[i])
                .map_err(|e| format!("Brain {}: {e}", logged.brains[i]))
        });
        let brains = [brains[0].clone()?, brains[1].clone()?];
        let config = Config {
            team_size: logged.size,
            brains,
            player_team: -1,
            duration: logged.duration,
            ..Config::default()
        };
        let mut game = Game::new(logged.seed);
        game.skip_replays = true;
        game.start_match(config.clone());
        (
            "arena_match",
            Value::Null,
            logged.ticks,
            None,
            None,
            config,
            [0, 0],
            Some(logged.score),
            game,
        )
    } else {
        let replay = Replay::parse(&text)?;
        let engine = Value::String(replay.engine.clone());
        let frames = replay.frames.len();
        let human = replay.initial.player;
        let initial_team =
            human.and_then(|id| replay.initial.world.cars.get(id).map(|car| car.team));
        let config = replay.initial.config.clone();
        let initial_score = replay.initial.score;
        let game = replay.start();
        (
            "player_replay",
            engine,
            frames,
            human,
            initial_team,
            config,
            initial_score,
            None,
            game,
        )
    };
    let focus_tick = options
        .at
        .map(|seconds| (seconds / DT).round() as usize)
        .map(|tick| tick.min(frames));
    let radius = (options.window / DT).round() as usize;
    let (from, to) = focus_tick
        .map(|tick| (tick.saturating_sub(radius), (tick + radius).min(frames)))
        .unwrap_or((0, frames));
    let sample_ticks = (options.sample / DT).round().max(1.0) as usize;
    let mut events = Vec::new();
    let mut moments = Vec::new();
    let mut counts = BTreeMap::<String, usize>::new();
    let mut previous_phase = game.phase;
    let mut previous_score = game.score;
    let mut previous_stats = game.stats.clone();
    let mut extracted = None;

    let capture = |game: &Game| -> Result<String, String> {
        let mut scenario = Scenario::capture_car(
            game,
            options.car.unwrap(),
            options.kind.unwrap(),
            options.timeout.unwrap(),
            None,
        )?;
        let source = options
            .match_id
            .map_or_else(|| options.path.clone(), |id| format!("Arena match {id}"));
        scenario.note = format!(
            "{}. Source: {source}, tick {}.",
            options.description.as_ref().unwrap().trim_end_matches('.'),
            focus_tick.unwrap()
        );
        let name = options.name.as_ref().unwrap();
        if name.is_empty()
            || name.len() > 64
            || !name
                .bytes()
                .all(|b| b.is_ascii_lowercase() || b.is_ascii_digit() || b == b'-' || b == b'_')
        {
            return Err(
                "Use a short test name with letters, numbers, dashes, or underscores".into(),
            );
        }
        Ok(format!(
            "[{name}]\n# Final start selected from {} at simulation tick {}.\n{}",
            options
                .match_id
                .map_or("player replay".into(), |id| format!("Arena match {id}")),
            focus_tick.unwrap(),
            scenario.text()
        ))
    };

    if focus_tick.is_none() || from == 0 {
        moments.push(moment(&game, 0));
    }
    if options.extract.is_some() && focus_tick == Some(0) {
        extracted = Some(capture(&game)?);
    }
    for tick in 1..=frames {
        game.tick(Controls::default());
        if options.extract.is_some() && focus_tick == Some(tick) {
            extracted = Some(capture(&game)?);
        }
        let in_window = tick >= from && tick <= to;
        if in_window {
            for event in &game.notifications {
                let name = event_name(event.kind);
                *counts.entry(name.into()).or_default() += 1;
                events.push(json!({
                    "tick": tick,
                    "time": tick as f64 * DT,
                    "type": name,
                    "car": event.car,
                    "other": event.other,
                    "team": event.team,
                    "pad": event.pad,
                    "position": event.position,
                    "strength": event.strength,
                    "lastTouch": event.last_touch,
                    "score": game.score,
                    "phase": game.phase,
                }));
            }
            if game.phase != previous_phase {
                events.push(json!({
                    "tick": tick,
                    "time": tick as f64 * DT,
                    "type": "phase_change",
                    "previous": previous_phase,
                    "phase": game.phase,
                    "score": game.score,
                }));
                *counts.entry("phase_change".into()).or_default() += 1;
            }
            if game.score != previous_score {
                events.push(json!({
                    "tick": tick,
                    "time": tick as f64 * DT,
                    "type": "score_change",
                    "previous": previous_score,
                    "score": game.score,
                    "lastGoalTeam": game.last_goal_team,
                    "scorer": game.replay_scorer,
                }));
                *counts.entry("score_change".into()).or_default() += 1;
            }
            stat_changes(&previous_stats, &game, tick, &mut events);
        }
        let sample = focus_tick.is_some()
            && in_window
            && ((tick - from) % sample_ticks == 0 || Some(tick) == focus_tick || tick == to);
        if sample || (focus_tick.is_none() && tick == frames) {
            moments.push(moment(&game, tick));
        }
        previous_phase = game.phase;
        previous_score = game.score;
        previous_stats.clone_from(&game.stats);
    }

    let report = json!({
        "format": 1,
        "source": options.path,
        "sourceType": source_type,
        "engine": engine,
        "summary": {
            "ticks": frames,
            "duration": frames as f64 * DT,
            "humanCar": human,
            "humanTeam": initial_team,
            "teamSize": config.team_size,
            "matchDuration": config.duration,
            "initialScore": initial_score,
            "finalScore": game.score,
            "expectedScore": expected,
            "reproduced": expected.map(|score| score == game.score),
            "eventCounts": counts,
        },
        "selection": focus_tick.map(|tick| json!({
            "requestedTime": options.at,
            "tick": tick,
            "time": tick as f64 * DT,
            "fromTick": from,
            "toTick": to,
            "window": options.window,
            "sample": options.sample,
        })),
        "events": events,
        "moments": moments,
    });
    let output = serde_json::to_string_pretty(&report).map_err(|e| e.to_string())?;
    if let Some(path) = &options.output {
        fs::write(path, output).map_err(|e| e.to_string())?;
    } else {
        println!("{output}");
    }
    if let Some(path) = &options.extract {
        fs::write(
            path,
            extracted.ok_or("Selected extraction tick is missing")?,
        )
        .map_err(|e| e.to_string())?;
    }
    Ok(())
}

fn main() {
    if let Err(error) = options().and_then(run) {
        eprintln!("replay_inspect: {error}");
        process::exit(1);
    }
}
