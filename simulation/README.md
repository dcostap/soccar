# Rust simulation

## Current design

The native runner and browser game use the same Rust library.
The browser loads that library through WebAssembly.
Three.js, menus, audio, camera controls, keyboard input, and controller input remain in JavaScript.

The port includes:

- Ball and car physics, suspension, tire forces, and arena collisions.
- Car-ball and car-car collisions, demolition, respawns, and boost pads.
- Ball prediction, all three bot difficulties, roles, flips, and aerials.
- Match clocks, scoring, statistics, airborne expiry, overtime, and replay timing.
- Menu background play, freeplay, ball placement, and player controls.

`src/game.js` retains the original simulation as the comparison reference.
The browser overrides its simulation entry points in `src/simulation.js`.
The original rendering and input code still runs.

## Requirements

Use Node 24.14.0 and Rust 1.91.1 for comparison checks.
The reference uses V8 13.6.233.17-node.41.
The build also needs the WebAssembly target:

```sh
rustup target add wasm32-unknown-unknown
npm ci
```

The Rust library depends on the pinned `libm` crate.
It uses `f64` values and preserves the original arithmetic order.
Do not enable unsafe floating-point optimizations during parity work.

## Play the game

```sh
npm run dev
```

The command builds WebAssembly before starting Vite.
`npm run build` also builds WebAssembly before the production build.
Pages deployment installs the Rust target before building.

The generated browser binary is `public/simulation/soccar_simulation.wasm`.
Do not commit this file or Cargo build outputs.

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
Results arrive in completion order. Use the `match` field to order them.
Each worker owns an independent simulation and random generator.

The runner writes one JSON result per match:

```json
{
  "match": 0,
  "seed": 12345,
  "completed": true,
  "score": [4, 3],
  "winner": 0,
  "overtime": true,
  "clock": 34.64999999999868,
  "controllerTicks": 47706,
  "physicsTicks": 47706,
  "elapsedMs": 2560
}
```

Blue is team zero. Orange is team one.
The runner stops only after match completion or the tick limit.
A five-minute clock can require extra simulation time for kickoffs, goals, airborne expiry, and overtime.

The native runner skips replay playback by default. This does not change physics ticks or final scores.
Add `--replays` to retain the original replay timing.
The native runner does not record graphics snapshots.

Other options:

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

Duration zero means unlimited play. The default tick limit is 216,000 controller ticks.
A limited match returns `completed: false` and `winner: null`.
Exit code two means at least one match reached its limit. Invalid arguments return exit code one.

## Run checks

```sh
npm test
npm run test:rust
npm run test:port
npm run test:world
npm run test:game:full
npm run test:wasm:full
npm run test:presentation
npm run test:cli
```

`test:port` compares isolated ball physics. Add `-- --debug` for the debug build.
`test:world` compares controls, car physics, collisions, pads, and respawns.
`test:game:full` compares hidden state through complete matches, including overtime and replays.
`test:wasm:full` repeats complete-match checks against the browser binary and its state decoder.
`test:presentation` checks replay buffers, scoreboard updates, overtime banners, and match-end callbacks.
`test:cli` checks parallel results, argument errors, and tick-limit reporting.

For browser checks, install Chrome and run the Vite server first:

```sh
npm run test:browser
```

Use `npm run test:browser -- --preview` after building to test the production files.
The check starts and closes its own preview server.
Set `SOCCAR_TEST_BASE` when testing a build with a custom base path.

Set `SOCCAR_TEST_URL` if Vite uses another port or you want to test a production preview.
The browser test uses a separate headless profile. It does not use your open browser tabs.
It checks keyboard play, controller play, pause, resume, reset, ball placement, and a 3v3 match.
Screenshots and reports go into `artifacts/browser/`.

CI checks Windows and Linux. Local results alone do not prove another platform.

## Exact comparison

The reference runner reads the actual JavaScript code. It does not maintain a translated JavaScript model.
It excludes browser startup and rendering, fixes the tick at 120 Hz, and supplies seeded randomness.

`scripts/port/reference-lock.json` records engine versions, source hashes, and isolated-ball trace hashes.
The browser bootstrap is an approved source change. The reference simulation body remains unchanged.
Do not update the lock only to make a failed check pass. Review the cause first.

The current acceptance rule is bit-exact comparison. There are no tolerances or allowed differences.
Comparison includes positions, velocities, rotations, contacts, controls, timers, events, pads, and random state.
It also includes bot maneuvers, reaction state, prediction buffers, match phases, replay counters, and statistics.

The initial complete-match comparison passed for three five-minute 3v3 seeds:

| Seed  | Final score | Overtime | Controller ticks with replays |
| ----- | ----------- | -------- | ----------------------------- |
| 12345 | 4–3         | Yes      | 51,486                        |
| 67890 | 3–5         | No       | 48,944                        |
| 24680 | 2–4         | No       | 46,074                        |

The native suite compared 161,519 states and 505,916,115 fields, including shorter control cases.
The WebAssembly suite also passed complete matches and browser state decoding.
These checks prove the selected cases, not every possible input or target platform.

The runner reports the first difference in case, tick, and field order.
Reports go into `artifacts/ball-port/`, `artifacts/world-port/`, `artifacts/game-port/`, and `artifacts/wasm-port/`.
Ball reports include hexadecimal bits. Add `--record` to `test:port` to save both binary traces.
Game traces use a bounded stream. The runner does not retain gigabytes of complete-match state.
JSON reports are for inspection, not the binary comparison.

## Controlled compatibility changes

Each parity-only change has a `TODO(post-port)` comment at the changed code.
Keep it during parity work. Review it before a separate behavior or performance change.
Compare native and WebAssembly behavior and performance before removing it.
Review the affected comparison baselines. Do not silently weaken the checks.

Current items:

- `src/math.rs`: V8 `Math.hypot` differs from platform `hypot` rounding.
- `src/v8_trig.rs`: V8 cosine differs from `libm` cosine rounding.
- `src/math.rs`: shared software `atan2` avoids separate native and browser calculations.
- `src/random.rs`: the original random name sort consumes a V8-specific sequence of random draws.
- `src/game.rs`: the original restart keeps old predictor ticks and slices.
- `src/car.rs` and `src/arena.rs`: equal coefficients and manual bounds keep the original arithmetic order.
- `src/world.rs`: one boost pad uses an asymmetric original coordinate.

The first `hypot` difference appeared in `blue-goal`, tick 41.
The arena normal differed by approximately `1.37e-14`.
The V8 calculation removed the difference without a tolerance.

The cosine difference appeared in `reverse-brake`, tick 347.
The correction uses V8 kernels and range reduction for game-sized arguments.
Large trigonometric arguments use `libm`. The game checks do not prove those external inputs bit-exact.
The source retains the upstream license notice.

Reference: [V8 13.6.233 math](https://github.com/v8/v8/blob/13.6.233/src/base/ieee754.cc).

## Benchmark

```sh
npm run benchmark
```

The benchmark completes three five-minute 3v3 all-star bot matches, including any overtime.
It disables rendering and replay playback in both versions.
Both versions retain statistics, bot prediction, match rules, and ball rotation.
It checks final scores and physics tick counts before accepting timings.

Initial local results on a Ryzen 7 5800X3D:

| Seed   | JavaScript | Native Rust |
| ------ | ---------- | ----------- |
| 12345  | 7.958 s    | 2.560 s     |
| 67890  | 6.939 s    | 2.316 s     |
| 24680  | 6.795 s    | 2.266 s     |
| Median | 6.939 s    | 2.316 s     |

These are preliminary single-match results, not a maximum-speed claim.
Comparison trace times include serialization and transfer. Do not use them as performance measurements.

## Binary ball protocol

All integers and floating-point values use little-endian byte order without padding.
Input starts with ASCII `SCB1`, then a `u32` case count.
Each case contains a `u32` tick count and 13 `f64` initial values:

```text
pos.x pos.y pos.z
vel.x vel.y vel.z
angVel.x angVel.y angVel.z
radius mass lastWorldHitSpeed frozen
```

`frozen` is zero or one. Values must be finite. Radius and mass must be positive.
Output starts with ASCII `SCT1`, then a `u32` case count.
Each case contains a `u32` tick count and `ticks + 1` states.
Each state contains the 13 initial fields, then:

```text
arena.distance arena.normal.x arena.normal.y arena.normal.z
```

Tick zero is the initial state. Later ticks integrate forces, integrate position, resolve collisions, and limit speed.
The binary format preserves negative zero.

World and game trace runners use length-prefixed arrays because event and prediction counts can change.
Field order is defined by `src/snapshot.rs` and the corresponding JavaScript snapshot functions.
These are test protocols, not public network formats.

## Follow-up work

- Profile native bot decisions and prediction before changing algorithms.
- Review parity-only math and restart changes with their `TODO(post-port)` notes.
- Remove unused JavaScript simulation code from production after moving the locked reference to a separate file.
- Expand complete-match coverage across seeds, skills, player controls, and supported platforms.
