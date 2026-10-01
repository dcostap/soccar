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
The Rust library uses `f64`, preserves arithmetic order, and pins `libm`.
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

Each match uses `seed + match index`, with unsigned 32-bit wrapping.
Each worker owns an independent simulation and random generator.
The runner writes one JSON result per match, in completion order.
Use the `match` field to order results. Blue is team zero; orange is team one.

Results include completion, score, winner, overtime, clock, controller ticks, physics ticks, and elapsed milliseconds.
The runner stops after match completion or the tick limit.
Kickoffs, goals, airborne expiry, and overtime can extend a five-minute match.

The native runner skips replay playback by default. This does not change physics ticks or final scores.
Add `--replays` to retain replay timing. The native runner does not record graphics snapshots.

Options:

```text
--team-size 1..3
--duration seconds
--skill rookie|pro|allstar
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
The initial baseline includes 162,960 states and 721,810,980 fields across 16 cases.

| Seed  | Score | Overtime | Controller ticks | Physics ticks |
| ----- | ----- | -------- | ---------------- | ------------- |
| 12345 | 4–3   | Yes      | 51,486           | 47,706        |
| 67890 | 3–5   | No       | 48,944           | 44,624        |
| 24680 | 2–4   | No       | 46,074           | 42,834        |

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

CI runs on Windows and Linux. Local checks alone do not prove another platform.
These tests cover selected cases, not every possible input or platform.

## Accepted behavior and future changes

The completed port passed exact JavaScript comparisons before removing the JavaScript engine.
Rust is now authoritative. Those comparisons are history, not a current runtime or test dependency.
The removed engine remains available in Git history at commit `9983451`.

The existing `TODO(post-port)` comments still identify inherited compatibility choices:

- Software trigonometry and scaled `hypot` preserve the accepted floating-point behavior.
- Equal tire-grip coefficients and manual bounds preserve arithmetic order.
- Random name sorting preserves the accepted random draw sequence.
- Restart retains predictor state, as the original game did.
- One boost pad retains its asymmetric position.

This cleanup does not change those rules or calculations.
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

The initial native median was approximately 2.3 seconds on a Ryzen 7 5800X3D.
Trace checks include serialization and transfer. Do not use their times as performance measurements.

## Test stream

`game_trace` reads little-endian `SCG2` input and writes `SCM2` output.
Each case supplies configuration, a tick limit, and timed commands.
Each tick emits two length-prefixed `f64` blocks: full core state and browser state.
A zero-length block ends the case. Tick zero is the initial state.

`src/snapshot.rs` defines both state layouts.
The Rust runner and WASM exports use those same functions.
These are test protocols, not public network formats.
