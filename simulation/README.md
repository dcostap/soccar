# Rust simulation

## Source of truth

Rust owns physics, prediction, bots, scoring, statistics, clocks, overtime, and match transitions.
Native tools and the browser use the same library.
There is no JavaScript simulation or archived JavaScript reference in the working tree.

JavaScript handles Three.js rendering, audio, menus, input, camera motion, interpolation, and replay images.
It sends controls and commands to Rust, then reads Rust state and events.
It does not calculate the next physics state or decide a match result.

The browser files have separate functions:

- `src/simulation.js`: load WASM, send commands, and present Rust events.
- `src/simulation-state.js`: decode the Rust state buffer.
- `src/view.js`: data containers and graphics interpolation helpers. These have no physics methods.
- `src/presentation.js`: draw state, store replay images, update audio, and display the HUD.
- `src/watch-replay.js`: prepare arena watch timelines and restore exact Rust checkpoints for seeking.
- `src/replay-timeline.js`: watch controls and highlight markers. Its separate stylesheet leaves the captured styles unchanged.
- `src/game.js`: existing graphics, menus, input, and browser startup.

Rust also supplies arena dimensions, car geometry, pad positions, and arena queries.
The renderer and replay camera use these exports instead of a second collision implementation.
Rust supplies replay indices, replay history length, and the winning team.
Rust rejects freeplay and replay commands outside their applicable mode or phase.

## Build and play

Install Rust and add its WASM target:

```sh
rustup target add wasm32-unknown-unknown
npm ci
npm run dev
```

Open the URL that Vite prints. Choose PLAY or FREE PLAY.
`npm run dev` and `npm run build` build WASM first.
Pages deployment also installs the Rust target before building.

The generated binary is `public/simulation/soccar_simulation.wasm`.
Do not commit it or Cargo build outputs.

CI uses Node 24.14.0 and Rust 1.91.1.
The Rust library uses `f64` and pins `libm` for trigonometry.
Do not use platform `f64::sin`, `cos`, or `atan2`: they call the C library, which differs between Windows, Linux, and WASM.
Do not enable unsafe floating-point optimizations.

## Run headless matches

Run one complete five-minute 3v3 all-star bot match:

```sh
npm run sim -- --seed 12345
```

Run a batch across CPU threads:

```sh
npm run sim -- --seed 12345 --matches 32 --threads 8
```

Pit two brains against each other with `--skill blue,orange`. Each side takes a preset or a `.brain` file:

```sh
npm run sim -- --skill rookie,allstar --matches 1000 --threads 16 > results.jsonl
npm run sim -- --skill arena/brains/pro.brain,allstar --matches 100 --threads 16
```

For ratings, paired tests, and a result log, use [the arena](../arena/README.md).

Each match uses `seed + match index`, with unsigned 32-bit wrapping.
Each worker owns an independent simulation and random generator, so results do not depend on the thread count.
The runner writes one JSON result per match to stdout, in completion order.
Use the `match` field to order results. Blue is team zero; orange is team one.

Results include completion, score, winner, overtime, clock, live play seconds, controller ticks, physics ticks,
elapsed milliseconds, per-team possession, time with the ball in their half, and brain milliseconds,
and per-player statistics: score, goals, assists, shots, saves, touches, demos, times demolished, bumps, jumps, flips,
big and small pads, boost used, distance, supersonic, airborne, and offensive-half seconds, and mean ball distance.
Times count live play only. Touches count ball hits strong enough to raise a hit event.
After the batch, a single JSON summary goes to stderr: wins per team, overtimes, total goals, wall time,
matches per second, and physics ticks per second.
The runner stops after match completion or the tick limit.
Kickoffs, goals, airborne expiry, and overtime can extend a five-minute match.

The native runner skips replay playback by default. This does not change physics ticks or final scores.
Add `--replays` to retain replay timing. The native runner does not record graphics snapshots.

Options:

```text
--team-size 1..3
--duration seconds
--skill rookie|pro|allstar|file.brain[,orange]
--seed unsigned-32-bit-integer
--matches count
--threads count
--max-ticks count
--replays
--help
```

Duration zero means unlimited play. The default limit is 216,000 controller ticks.
A limited match returns `completed: false` and `winner: null`.
Exit code two means at least one match reached its limit. Invalid arguments return exit code one.

### Rust API

Other Rust projects can depend on this crate and call `soccar_simulation::harness` directly:

```rust
use soccar_simulation::{
    brains::{BrainSpec, Skill},
    harness::{self, MatchSpec, Summary},
};

let brains = [BrainSpec::preset(Skill::Pro), BrainSpec::preset(Skill::Allstar)];
let specs: Vec<_> = (0..1000)
    .map(|i| MatchSpec { seed: i, brains: brains.clone(), ..MatchSpec::default() })
    .collect();
let mut summary = Summary::default();
harness::run_batch(&specs, 16, |_index, result| summary.add(&result));
```

`run_match` plays one match on the calling thread. `MatchSpec::default()` is a five-minute 3v3 all-star match.
`run_until` stops a batch when its callback returns false.
`harness::start` builds the `Game` for a spec. For custom control loops, drive it as `harness::run_match` does.

### Brains

A brain drives every bot car on one team. Brains live in `src/brains/`.
Each module implements the `Brain` trait and reads its settings from `Params`; `MODULES` lists them.
`BrainSpec` pairs a module with settings in `key = value` text. Unknown settings are errors.
The built-in difficulties are the `classic` module with `preset = rookie`, `pro`, or `allstar`.

The game updates one shared `Predictor` per tick before brains run. Brains read the world through `Context`
and write controls only for their own cars. They must be deterministic. Do not use clocks or the game random generator.
The browser loads brain text through `sim_text` and `sim_brain`, so any brain can play in the game.

## Checks

```sh
npm test
npm run test:rust
npm run test:cli
npm run test:simulation:full
npm run test:simulation -- --debug
npm run test:presentation
npm run build
npm run test:browser -- --preview
```

The browser check needs Chrome. It starts and closes its own preview server.
Set `SOCCAR_TEST_BASE` when testing a production build with a custom base path.
Without `--preview`, set `SOCCAR_TEST_URL` or run a dev server on port 5173.
The check uses a separate headless profile, not your open browser tabs.
It checks keyboard play, controller play, pause, resume, reset, ball placement, and 3v3 play.

`test:simulation` compares native Rust and WASM tick by tick, with exact floating-point bits.
It checks full hidden state and the browser state buffer. It has no tolerances or allowed differences.
Cases cover menu play, freeplay, all team sizes and skills, player controls, commands, and restarts.
`--full` adds three complete five-minute 3v3 matches, including overtime and replay timing.

`simulation/regression.json` stores SHA-256 hashes of accepted Rust state streams and match results.
These hashes detect changes even when native and WASM implementations change together.
The current baseline was recorded after replacing the JavaScript-compatible math with `libm` trigonometry
and a plain `hypot`, and after randomizing car-ball contact order. It includes 170,333 states and 755,073,539 fields
across 16 cases.

| Seed  | Score | Overtime | Controller ticks | Physics ticks |
| ----- | ----- | -------- | ---------------- | ------------- |
| 12345 | 7–8   | Yes      | 60,223           | 52,077        |
| 67890 | 3–4   | No       | 47,526           | 43,746        |
| 24680 | 2–4   | No       | 46,128           | 42,888        |

The state runner streams bounded blocks instead of retaining complete traces in memory.
A difference reports the case, tick, block, field index, and floating-point bits.
Reports go into `artifacts/simulation/`. Browser and presentation reports have their own artifact folders.

For an approved behavior or state-layout change, review the cause before updating hashes:

```sh
npm run build:wasm
node scripts/check-simulation.mjs --full --record
```

Do not record a new baseline only to make a failed check pass.
The JavaScript fixtures supply test inputs and serialize results. They contain no simulation implementation.

`test:presentation` checks a complete match, replay buffers, scoreboard display, overtime banners, and match-end callbacks.
It also checks live input settings. `test:cli` checks parallel determinism, invalid arguments, and tick limits.
Node replay tests compare full hidden-state hashes after seeks with uninterrupted playback.
They also check continued playback, goal-replay images, highlight times, cancellation, and checkpoint cleanup.
Browser checks cover the watch timeline, markers, pointer scrubbing, keyboard seeking, and leaving watch mode.

CI runs on Windows and Linux. Local checks alone do not prove another platform.
These tests cover selected cases, not every possible input or platform.

## Accepted behavior and future changes

The completed port passed exact JavaScript comparisons before removing the JavaScript engine.
Rust is now authoritative. Those comparisons are history, not a current runtime or test dependency.
The removed engine remains available in Git history at commit `9983451`.

The V8 trigonometry kernels, the scaled V8 `hypot`, the equal tire-grip coefficients, and the manual
max/min bounds were replaced with plain Rust math. This changed results, so the regression baseline was recorded again.

Car-ball contacts used to resolve in car order, blue first. Mirrored kickoffs reach the ball on the same tick,
and the car resolved second wins, so every tied touch went to one team. Mirrored all-star matches were heavily
one-sided: orange won 72% of 3v3 and 66% of 1v1 matches, and blue never recorded an assist.
Each physics step now picks forward or reverse contact order with a coin flip from the match's seeded generator.
Mirrored matches are now even within sampling noise for every team size and skill tested.
Other per-car loops (car-car bumps, pad pickups, wheel contacts on the ball) still run in car order.

The remaining `TODO(post-port)` comments identify inherited behavior choices:

- Random name sorting preserves the accepted random draw sequence.
- Restart retains predictor state, as the original game did.
- One boost pad retains its asymmetric position.

Review each item as a separate behavior or performance change.
Compare native and WASM results and performance before replacing it.
Update regression states only after reviewing the intended change.

## Benchmark

```sh
npm run benchmark
```

The benchmark completes the three five-minute 3v3 all-star matches above, including any overtime.
It checks scores and physics ticks against the Rust regression baseline before accepting timings.
It skips rendering and replay playback, but retains statistics, bot prediction, and match rules.
Results go into `artifacts/benchmark/report.json`.

It then runs four matches per logical CPU in parallel and records the batch summary.

On a Ryzen 7 5800X3D (8 cores, 16 threads), the native median per match fell from about 2.4 seconds to about 0.76 seconds.
The batch runs about 13 complete 3v3 matches per second, or about 580,000 physics ticks per second.
Trace checks include serialization and transfer. Do not use their times as performance measurements.

### Exact optimizations

Performance changes must keep every regression hash unchanged. The current shortcuts are exact:

- Ball and goal predictions reuse the previous trajectory while the real ball still matches a stored state bit for bit.
  Only the new tail is simulated. `tests/prediction.rs` compares reused and fresh predictions.
- Bots skip `atan2` and distance work for predicted slices that cannot pass the reach estimate.
  The skipped terms are non-negative, so rounding cannot change the comparison.
- Arena distance skips divisions and square roots where the result is already determined,
  such as the flat ends of the ramp smoothstep and `sqrt(v * v) == v`.
- Hot paths use fixed arrays instead of heap allocations.

Most remaining time is in arena distance queries for wheel rays and hitbox contacts, then bot decisions.

## Test stream

`game_trace` reads little-endian `SCG2` input and writes `SCM2` output.
Each case supplies configuration, a tick limit, and timed commands.
Each tick emits two length-prefixed `f64` blocks: full core state and browser state.
A zero-length block ends the case. Tick zero is the initial state.

`src/snapshot.rs` defines both state layouts.
The Rust runner and WASM exports use those same functions.
These are test protocols, not public network formats.
