# Brain arena

The arena plays bot brains against each other, keeps every result with full statistics, and rates the brains.
Any recorded match can be watched in the game, because a bot match depends only on its seed and brains.

```sh
npm run arena -- ladder                 # play all pairings, print the leaderboard
npm run arena -- challenge my-brain     # does my-brain beat the current best?
npm run dev                             # then open http://127.0.0.1:5173/arena.html
```

## Brains

A brain drives every bot car on one team. It has two parts:

- **Module**: Rust code in `simulation/src/brains/`, listed in `MODULES` in `mod.rs`.
- **Settings**: a `.brain` file in `arena/brains/`. The file name is the brain's name.

```text
# Leading comments are the description on the leaderboard.
module = classic
preset = allstar
aim = 0.7
```

`classic` is the original bot. It accepts `preset` (`rookie`, `pro`, `allstar`) and these overrides:
`speed`, `boost`, `flip`, `aerial`, `reaction`, `instant`, `predict`, `aim`. See `Settings` in `classic.rs`.
Unknown or malformed settings are errors.

`alpha` and `bravo` are the two entries of the first brain contest, see `CONTEST.md` and `contest/`.
`alpha` led the first 3v3 and 2v2 ladders. `alpha` settings are fields of `Settings` in `alpha.rs`. `bravo` takes the classic settings plus `spacing`, `keeper`, and `rotation`.

`alphabravo` combines their controllers with goal-side pressure and safe ground paths.
See [its design and checks](alphabravo.md). Its fingerprint includes alpha's shared flight controller source.

`modular` is alphabravo split into a fixed core, a swappable strategy, and swappable skills.
With default settings it plays exactly as alphabravo. `strategy = alpha` plays exactly as alpha,
and `strategy.1 = alpha` does so only for teams of one car.
`skills = a, b` selects skills from `simulation/src/brains/modular/skills/` in priority order.
Its fingerprint covers the core and the selected strategies and skills only. See [the skill hackathon](HACKATHON.md).
`modular-combo`, the hackathon's result, adds six skills and beats `modular-aerial-a` at every team size.

### Try a settings change

Add a file such as `arena/brains/allstar-close.brain`, then challenge the original:

```sh
npm run arena -- challenge allstar-close allstar
```

### Try a code change

1. Copy `simulation/src/brains/classic.rs` to `simulation/src/brains/striker.rs`.
2. In `simulation/src/brains/mod.rs`, add `pub mod striker;` and a `MODULES` entry:
   `Module { name: "striker", source: include_str!("striker.rs"), create: striker::create }`.
3. Edit the new module. Add settings with `params.number`, `params.flag`, or `params.text`.
4. Add `arena/brains/striker.brain` with `module = striker`.
5. Run `npm run arena -- challenge striker`.

Keep a version by copying its module or settings file under a new name before you change it.
Brains must be deterministic: no clocks, no shared mutable state, and no game random numbers.

## Fingerprints

Each brain has a fingerprint: a hash of its name, settings, module source, and the car states of two short mirror matches.
The matches catch changes in shared code and physics that the module source does not show.
Results are stored by fingerprint, so editing a brain retires its old results instead of mixing them in.
Older results stay in the log. Use `--all-versions` or clear "Current versions only" on the page to see them.

## Commands

```text
list                      Brains, fingerprints, and recorded matches
ladder [brain ...]        Round robin up to --pairs seeds per pairing (default 10), then the leaderboard
challenge <brain> [rival] Paired matches until the test decides. The rival defaults to the top brain
ratings                   Leaderboard and head-to-head table
matches                   Matches sorted by any statistic: --sort touches, --sort total:demos, --sort upset
show <id>                 Every statistic of one match and a link to watch it
setpieces [brain ...]     Play set pieces without a current result, then summarize per suite and kind
setpieces show <suite|id> Per-scenario results beside an idle baseline; one scenario adds a watch link
setpieces generate        Rewrite the generated suites, arena/scenarios/gen-*.txt
setpieces generate-defense Add fixed defense-v2 suites with measured physics and longer lead-in
setpieces generate-ground-recovery Add fixed defense-v3 ground threats with defenders farther from goal
setpieces mine            Rewrite arena/scenarios/mined-goals.txt from goals in logged matches
export                    Write public/arena/ for the page and the game menu (ladder and challenge do this)
```

Common options: `--size 1..3` and `--duration seconds` select the format (default 3v3, 300 s).
Each format has separate results and ratings. `--threads` defaults to every CPU but one, so the machine stays responsive.
Run `npm run arena -- --help` for the full list.

Every pairing plays seeds 1, 2, 3, … twice, with sides swapped, so both brains get the same kickoffs.
A match that is already in the log is never played again.

## Ratings

The leaderboard is a Bradley-Terry fit of every win and loss between current brains, on the Elo scale.
Rookie is fixed at 1000. ± is a 95% interval. Win percentage alone misleads when brains play different opponents.

Matches are chaotic. 100 matches only pin a win rate to about ±10%, so small differences need thousands.
In the first ladder, pro led allstar 57-43 after 100 matches; allstar won 57% of the next 900.

`challenge` runs a sequential probability ratio test on seed pairs. It stops as soon as the evidence decides between
"at least `--elo1` better" (default 10) and "at most `--elo0` better" (default 0), with 5% error rates,
or at `--max-pairs` (default 2000). It reuses recorded pairs, so rerunning a challenge is instant.

## Statistics

Every match records, per player: score, goals, assists, shots, saves, touches, demos, times demolished, bumps,
jumps, flips, big and small pads, boost used, distance, supersonic, airborne, and offensive-half seconds,
and mean distance to the ball. Per team: possession time (last touch), time with the ball in their half,
and wall-clock milliseconds spent in the brain. Times count live play only.

The log is `arena/results/matches.jsonl`, one JSON record per line, including both brains' settings text.

### Heatmaps

Every match also records where each team's cars and the ball spent live play, on a 16 by 20 grid of 512-unit cells.
Each team's map is turned so that the team attacks up the field, so a brain's maps compare across sides.
They are in `arena/results/heatmaps.jsonl`, one line per match id: `teams` (blue, orange) and `ball` (seen from blue's side),
in tenths of a second per cell, row by row from the bottom goal line. See `Heatmaps` in `simulation/src/harness.rs`.

```sh
npm run arena -- heatmap alpha              # average of one car and of the ball, with time in each third
npm run arena -- heatmap 2                  # one match: both teams and the ball
npm run arena -- backfill --brain alpha --limit 200   # replay logged matches to add missing heatmaps
```

`backfill` replays only current brain versions and stops if a replayed score differs from the log.
The page shows the maps under Positions, in each brain's details, and in each match's details.

## Set pieces

Matches reward whatever beats the current rivals. Set pieces grade one skill at a time instead:
the ball and cars start placed, and a judge decides one outcome within a few seconds.
In an attack, blue must score. In a defense, blue must not concede.
The brain under test always drives blue, which attacks positive y, so it must also work with no teammates or rivals.

Suites are `arena/scenarios/*.txt`. Each scenario starts with a `[name]` header and uses the text form in
`simulation/src/scenario.rs`:

```text
[goalie-angle]
note = Angled run against a goalie.
kind = attack
time = 4                       # seconds before the judge waits for the ball to land
ball = -1500 2500 93.15        # also ball_vel and ball_spin, x y z
car = blue -1500 800 90 0 33   # team, x, y, yaw in degrees (90 faces orange's goal), speed, boost
car = orange 0 5000 270 0 33
rival = scripted mode=goalie   # idle, throttle, chase, or goalie; boost=true, speed=1400
```

As at the end of a match, the clock runs out and play continues until the ball touches the ground.
A goal ends a set piece at once. A ball still predicted to go in may finish its path, so a shot before the buzzer counts.
Play stops three seconds after the time in any case.

Credit is 1 for a success. A missed attack earns up to 0.5 for how close the ball came to the goal mouth.
An own goal or a conceded goal earns nothing. `setpieces show` compares every brain with an idle car,
which marks scenarios that play themselves.

```sh
npm run arena -- setpieces                       # every brain, every suite
npm run arena -- setpieces alpha --suite saves   # one brain, one suite
npm run arena -- setpieces alpha --suite saves,gen-saves   # several suites
npm run arena -- setpieces show saves            # per-scenario table
npm run arena -- setpieces show saves/breakaway --brain alpha   # one scenario and a watch link
```

`finishing` and `saves` are written by hand. The `gen-*` suites come from randomized families in `arena/src/generate.rs`:
shots, awkward starts, moving balls, a goalie, saves, chase-backs, breakaways, and scrambles in the box.
`setpieces generate` writes `--count` scenarios per family (default 40) with seed 1, after dropping every candidate
that an idle car passes. Change a family by adding a new one, since regenerating replaces the scenarios.

The nine `defense-v2-*` suites add 1,944 fixed threats for a single defender.
Each starts at least 2,000 units from the goal mouth and concedes in 2.5–5 seconds without a defender.
They cover ground and air shots, floor, wall, corner, and ceiling bounces, and rival strikes.
The original `defense-v1-*` suites remain as emergency tests. Use `--emergency` or select a v1 suite to include them.
`defense-v3-ground-recovery` adds 216 rolling threats. Defenders start farther from goal and away from the ball path.
Use `--defense --holdout <seed>` for new cases without changing files or result logs.
See [measured defense tests](DEFENSE.md) for the coverage plan, reports, checks, and limits.

`mined-goals` comes from real play. `setpieces mine` replays the newest `--count` current matches of the format
(default 10) and captures the moment three seconds before each goal twice: as an attack with the scoring team as blue,
and as a defense with the conceding team as blue. Orange's view is turned half a circle, so blue always attacks up.
Teammates and rivals start where they were, and rivals chase the ball. Cars in the air or on a wall start on the floor
below them. Moments that an idle car passes are dropped.

To export a moment, watch a match and press `C` during live play. `Shift+C` selects defense.
The form first asks which car the brain should control. It preserves the full state, including airborne motion.
Other cars use recorded controls or fixed behavior. Recorded controls drive physical cars, not stored positions.
Use **Preview**, then **Download set piece**. Import accepted files into `user-attack` or `user-defend`:

```sh
npm run arena -- setpieces import "path/to/moment.soccar-setpiece.txt"
```

Player matches record automatically. Use **Replays** in the Arena to watch, download, delete, or import recordings.
See [player replay contributions](CONTRIBUTING-SETPIECES.md) for contribution checks and file limits.

The generated suites are public, so a brain can be tuned to them. `--holdout <seed>` plays the same families
with another seed in memory instead of the suites. Use an unannounced seed to check a brain on scenarios nobody saw:

```sh
npm run arena -- setpieces --holdout 90210 --count 20
```

The page's Set pieces section shows success rates per suite and brain, then every scenario with a start diagram,
the idle baseline, and each brain's result. Filter by suite, kind, or a brain's failures, for example
"Failed, while another brain passed", and sort by difficulty, the share of brains that fail.
Each result links to the game, which replays the set piece and checks its verdict against the log.

Results are in `arena/results/setpieces.jsonl`, one line per brain fingerprint and scenario hash.
The hash covers the scenario text and the rival module source, so editing either reruns it.
Set pieces take about a millisecond each, so a full run takes well under a second.

## Watching

`show <id>` and the page's Watch buttons open the game with the match in the link.
The game replays it from the seed and the brain settings, with goal replays.
Keys: `1`-`6` follow a car, `,` and `.` change speed, `P` pauses, `C` copies the moment as a set piece,
`Esc` opens the menu.
Keys `Left` and `Right` seek five seconds. `Home` and `End` seek to the start and end.

The watch timeline shows elapsed playback time and total playback time.
This time includes countdowns, goal replays, and overtime, not just the match clock.
Drag the slider to seek. Playback pauses during dragging, then returns to its previous pause setting.
The timeline also has pause, speed, and previous/next highlight controls.

Team-colored goal markers and an overtime marker show the main highlights.
Hover over a marker for its time and details. Click it to seek three seconds before the event.
Use the shield and cross buttons to show save and demolition markers above the track.
The camera selector changes the followed car. Hover over an icon to see its function.
At the end, rewind or use Restart. The live-match result menu does not cover the watch timeline.

Preparation runs in short slices while watching continues. Seeking becomes available after preparation finishes.
Checkpoints keep complete Rust state, including brains and random state.
Seeking rebuilds goal-replay images and does not play skipped sounds or effects.
Leaving watch mode releases all checkpoints and removes the timeline.
If preparation exceeds 300,000 controller ticks, watching continues without seeking.
These controls apply to arena Watch links. They do not record player-controlled matches.

At the end, the game reports whether the score matches the log. A mismatch means brain code or physics changed.
`npm run test:arena` checks that recorded matches replay exactly through the browser path.
`npm test` compares seeking and continued playback with uninterrupted playback, including full hidden state and goal-replay images.

The game menu also lists arena brains under Bot Difficulty, so you can play against any of them.
Restart `npm run dev`, or reload the page, after an export to refresh that list.
After editing a module, rebuild WASM (`npm run build:wasm`, or restart `npm run dev`) before watching or playing.
