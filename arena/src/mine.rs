//! Set pieces mined from logged matches: the moment three seconds before each goal, from both sides.
//! The scoring team becomes blue in an attack, and the conceding team becomes blue in a defense.
//! `setpieces mine` writes them to `arena/scenarios/mined-goals.txt`.
use crate::{Arena, ledger::Record};
use soccar_simulation::{
    DT,
    brains::BrainSpec,
    car::Controls,
    game::Phase,
    harness::{self, MatchSpec, ScenarioJob},
    scenario::{Kind, Scenario},
    world::GOAL,
};
use std::{collections::VecDeque, fs, thread};

/// Seconds before the goal where a mined scenario starts.
const LEAD: f64 = 3.0;
/// A goal sooner than this after a kickoff is skipped: the moment would be the kickoff itself.
const SHORTEST: f64 = 1.5;

struct Mined {
    name: String,
    note: String,
    scenario: Scenario,
}

/// Replays one match and captures the moment before each goal.
fn mine_match(record: &Record, spec: &MatchSpec) -> Vec<Mined> {
    let mut game = harness::start(spec);
    let lead = (LEAD / DT).round() as usize;
    // Blue's view of each live tick, newest last.
    let mut recent: VecDeque<Scenario> = VecDeque::with_capacity(lead + 1);
    let mut out = Vec::new();
    let mut goals = 0;
    let mut ticks = 0;
    while game.phase != Phase::Ended && ticks < spec.max_ticks {
        if game.phase == Phase::Playing && game.world.ball_touched {
            if recent.len() > lead {
                recent.pop_front();
            }
            recent.push_back(Scenario::capture(&game, 0, Kind::Attack, LEAD + 1.0));
        } else {
            recent.clear();
        }
        game.tick(Controls::default());
        ticks += 1;
        let Some(goal) = game.notifications.iter().find(|e| e.kind == GOAL) else {
            continue;
        };
        goals += 1;
        let team = goal.team as usize;
        if (recent.len() as f64) * DT < SHORTEST {
            continue;
        }
        let start = recent.front().unwrap();
        let before = recent.len() as f64 * DT;
        let minute = |clock: f64| format!("{}:{:02}", (clock / 60.0) as u32, (clock % 60.0) as u32);
        let when = if game.overtime {
            "in overtime".to_string()
        } else {
            format!("at {}", minute(game.clock))
        };
        let attack = if team == 0 {
            start.clone()
        } else {
            start.mirrored()
        };
        let mut defend = attack.mirrored();
        defend.kind = Kind::Defend;
        for (scenario, side, role) in [(attack, team, "attack"), (defend, 1 - team, "defend")] {
            out.push(Mined {
                name: format!("m{}-g{goals}-{role}", record.id),
                note: format!(
                    "Match {}: {} vs {}, {:.1} s before {}'s goal {when}. Blue is {}.",
                    record.id,
                    record.brains[0],
                    record.brains[1],
                    before,
                    record.brains[team],
                    record.brains[side]
                ),
                scenario,
            });
        }
    }
    out
}

impl Arena {
    /// Mines the newest current matches of the selected format and writes the scenarios an idle car fails.
    pub fn setpiece_mine(&self) -> Result<(), String> {
        let count = self.options.count.unwrap_or(10);
        let picked: Vec<(&Record, MatchSpec)> = self
            .records()
            .filter_map(|(r, current)| Some((r, current?)))
            .filter(|(r, _)| r.completed && r.score[0] + r.score[1] > 0)
            .collect::<Vec<_>>()
            .into_iter()
            .rev()
            .take(count)
            .map(|(r, sides)| {
                (
                    r,
                    MatchSpec {
                        seed: r.seed,
                        team_size: r.size,
                        brains: sides.map(|s| self.brains[s].spec.clone()),
                        duration: r.duration,
                        ..MatchSpec::default()
                    },
                )
            })
            .collect();
        if picked.is_empty() {
            return Err("No current matches with goals in this format. Play some first.".into());
        }
        eprintln!("Mining {} matches.", picked.len());
        let threads = self.options.threads.min(picked.len());
        let mut mined: Vec<Vec<Mined>> = (0..picked.len()).map(|_| Vec::new()).collect();
        thread::scope(|scope| {
            for (t, chunk) in mined.chunks_mut(picked.len().div_ceil(threads)).enumerate() {
                let picked = &picked;
                let start = t * picked.len().div_ceil(threads);
                scope.spawn(move || {
                    for (i, slot) in chunk.iter_mut().enumerate() {
                        let (record, spec) = &picked[start + i];
                        *slot = mine_match(record, spec);
                    }
                });
            }
        });
        let mined: Vec<Mined> = mined.into_iter().flatten().collect();
        // Drop the moments that finish themselves.
        let idle = BrainSpec::parse("idle", "module = scripted\nmode = idle").expect("idle brain");
        let jobs: Vec<ScenarioJob> = mined
            .iter()
            .map(|m| ScenarioJob {
                scenario: m.scenario.clone(),
                brain: idle.clone(),
            })
            .collect();
        let mut trivial = vec![false; jobs.len()];
        harness::run_scenarios(&jobs, self.options.threads, |i, o| trivial[i] = o.success);
        let mut text = format!(
            "# Moments {LEAD} s before goals in logged {0}v{0} matches, from both sides. Blue's teammates and rivals are\n\
             # placed as they were; rivals chase the ball. Generated by `npm run arena -- setpieces mine --count {count}`.\n",
            self.options.format.size
        );
        let mut kept = 0;
        for (m, _) in mined.iter().zip(&trivial).filter(|(_, t)| !**t) {
            let mut scenario = m.scenario.clone();
            scenario.note = m.note.clone();
            text += &format!("\n[{}]\n{}", m.name, scenario.text());
            kept += 1;
        }
        let path = self.root.join("scenarios/mined-goals.txt");
        fs::write(&path, text).map_err(|e| format!("{}: {e}", path.display()))?;
        eprintln!(
            "Wrote {kept} scenarios to {} ({} dropped because an idle car passes them).",
            path.display(),
            mined.len() - kept
        );
        Ok(())
    }
}
