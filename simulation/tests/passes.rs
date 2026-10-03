//! Pass diagnostics for team strategies. Ignored by default; run with
//! `cargo test --release --test passes -- --ignored --nocapture`.
//! `PASSES_BRAIN` is the brain file to test (default `arena/brains/modular-combo.brain`),
//! `PASSES_SIZE` the team size (default 2), and `PASSES_MATCHES` the match count (default 12).
//! The brain plays blue against `modular-combo` on seeds 1, 2, ...
//! For each team it counts touches in the attacking third, wide of the posts, and what came next.
use soccar_simulation::{
    brains::BrainSpec,
    game::Phase,
    harness::{self, MatchSpec},
    world::BALL_HIT,
};

#[derive(Default, Clone, Copy, Debug)]
struct Counts {
    wide: u32,
    /// The next touch was by a teammate.
    mate: u32,
    /// The next touch was by the same car.
    same: u32,
    /// The next touch was by a rival.
    rival: u32,
    /// The team scored before anyone touched the ball again.
    direct: u32,
    /// The team scored within 4 seconds of the wide touch, after a teammate's touch.
    assisted: u32,
    goals: u32,
}

fn load(path: &str) -> BrainSpec {
    let name = std::path::Path::new(path)
        .file_stem()
        .unwrap()
        .to_string_lossy()
        .to_string();
    let text = std::fs::read_to_string(path).unwrap();
    BrainSpec::parse(&name, &text).unwrap()
}

fn play(seed: u32, size: usize, brain: BrainSpec, rival: BrainSpec) -> [Counts; 2] {
    let mut game = harness::start(&MatchSpec {
        seed,
        team_size: size,
        brains: [brain, rival],
        ..MatchSpec::default()
    });
    let mut counts = [Counts::default(); 2];
    // The open wide touch per team: (car, tick, a teammate touched since).
    let mut open: [Option<(usize, i64, bool)>; 2] = [None; 2];
    let mut score = game.score;
    let mut ticks = 0;
    while !matches!(game.phase, Phase::Ended) && ticks < 400_000 {
        game.tick(Default::default());
        ticks += 1;
        let w = &game.world;
        for e in w.events.iter().filter(|e| e.kind == BALL_HIT && e.car >= 0) {
            let car = e.car as usize;
            let team = w.cars[car].team;
            let d = if team == 0 { 1.0 } else { -1.0 };
            for t in 0..2 {
                if let Some((by, _, mate)) = open[t] {
                    if t != team {
                        counts[t].rival += 1;
                        open[t] = None;
                    } else if by == car && !mate {
                        counts[t].same += 1;
                        open[t] = None;
                    } else if by != car && !mate {
                        counts[t].mate += 1;
                        open[t] = open[t].map(|(b, k, _)| (b, k, true));
                    }
                }
            }
            let ball = w.ball.pos;
            if ball.y * d > 3000.0 && ball.x.abs() > 1000.0 && ball.z < 300.0 {
                counts[team].wide += 1;
                open[team] = Some((car, w.tick, false));
            }
        }
        for t in 0..2 {
            if game.score[t] > score[t] {
                counts[t].goals += 1;
                if let Some((_, tick, mate)) = open[t] {
                    if !mate {
                        counts[t].direct += 1;
                    } else if (w.tick - tick) as f64 / 120.0 < 4.0 {
                        counts[t].assisted += 1;
                    }
                }
            }
            if game.score != score {
                open[t] = None;
            }
        }
        score = game.score;
    }
    counts
}

#[test]
#[ignore]
fn passes() {
    let path = std::env::var("PASSES_BRAIN")
        .unwrap_or_else(|_| "../arena/brains/modular-combo.brain".into());
    let size: usize = std::env::var("PASSES_SIZE").map_or(2, |s| s.parse().unwrap());
    let n: u32 = std::env::var("PASSES_MATCHES").map_or(12, |s| s.parse().unwrap());
    let brain = load(&path);
    let rival = load("../arena/brains/modular-combo.brain");
    let threads = 6;
    let results: Vec<[Counts; 2]> = std::thread::scope(|scope| {
        let handles: Vec<_> = (0..threads)
            .map(|k| {
                let (brain, rival) = (brain.clone(), rival.clone());
                scope.spawn(move || {
                    (1..=n)
                        .filter(|s| s % threads == k)
                        .map(|s| play(s, size, brain.clone(), rival.clone()))
                        .collect::<Vec<_>>()
                })
            })
            .collect();
        handles
            .into_iter()
            .flat_map(|h| h.join().unwrap())
            .collect()
    });
    for (t, name) in [(0, brain.name.as_str()), (1, "modular-combo (rival)")] {
        let mut c = Counts::default();
        for r in &results {
            let x = r[t];
            c.wide += x.wide;
            c.mate += x.mate;
            c.same += x.same;
            c.rival += x.rival;
            c.direct += x.direct;
            c.assisted += x.assisted;
            c.goals += x.goals;
        }
        let m = results.len() as f64;
        println!(
            "{name}: per match wide {:.1}, then mate {:.1}, same {:.1}, rival {:.1}, direct goal {:.2}, \
             assisted goal {:.2}, goals {:.2}",
            c.wide as f64 / m,
            c.mate as f64 / m,
            c.same as f64 / m,
            c.rival as f64 / m,
            c.direct as f64 / m,
            c.assisted as f64 / m,
            c.goals as f64 / m,
        );
    }
}
