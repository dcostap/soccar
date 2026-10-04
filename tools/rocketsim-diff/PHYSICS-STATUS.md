# RocketSim physics status

## Purpose

Soccar uses one deterministic Rust simulation for native and WASM builds.
The audit compares its trajectories with RocketSim 2.2.1 at 120 Hz.

Agreement means small measured trajectory errors in important gameplay paths.
It does not mean identical floating-point state with RocketSim.

Native and WASM state must remain bit-identical.
The accepted regression baseline remains the product contract.

One Unreal Unit, or UU, is approximately one centimeter in Rocket League.

## Reference and measurement

The harness uses RocketSim 2.2.1 and source commit `2da51b1dac7b8127127613a5ff30e490bdd70dd8`.
Local Rocket League Soccar meshes provide the RocketSim arena.
Distribution rights for those meshes remain unconfirmed, so they stay ignored and local.

The baseline suite contains 78 isolated paths.
It covers air control, jumps, driving, world contacts, ball contacts, bumps, and pads.

Three wider suites protect focused changes:

- The goal suite contains 96 mirrored goal-neighborhood paths.
- The contact suite contains 105 resting, dribble, ground-hit, and air-hit paths.
- The bump suite contains 77 grounded, airborne, angled, tilted, and vertical impacts.

Use peak and final errors together.
Always inspect the first differing contact before changing response code.

## Accepted changes

### Measurement harness

Commit `8b46ba9` added the pinned comparison harness and the original 78 paths.
The harness can reverse Soccar control signs for equivalent RocketSim actions.
The game and bot control signs did not change.

### Powerslide buildup

Commit `8cf1bd9` changed powerslide rise from 6.5 to 5 per second.
The fall rate remains 2 per second.

One-second powerslide peak position errors changed as follows:

| Start speed | Before | After |
|---:|---:|---:|
| 0 UU/s | 5.23 UU | 4.30 UU |
| 500 UU/s | 12.43 UU | 6.71 UU |
| 1,000 UU/s | 25.39 UU | 8.05 UU |
| 1,500 UU/s | 32.92 UU | 9.53 UU |
| 2,200 UU/s | 42.78 UU | 10.49 UU |

Old recordings became incompatible because their trajectories changed.
The loader now requires exact recording-engine equality.

### Recovery and controller order

Commit `02072d5` matched RocketSim's recovery and torque update order.
Air torque now runs before jump and flip updates.
Automatic flips run before extra-jump checks and block air control during the flip.
Automatic roll now requires throttle.

Important peak rotation errors changed as follows:

| Path | Before | After |
|---|---:|---:|
| Roof landing | 179.82 degrees | 4.40 degrees |
| Roof automatic flip | 179.20 degrees | 5.59 degrees |
| Front-flip cancel | 3.32 degrees | 0.000043 degrees |

### Upright car-car response

Commit `19f4881` changed the one-point response for upright side impacts.
The old response applied force at the hitbox center.
The car center of mass is 20.755 UU below that point.
This offset caused much more pitch than RocketSim's box manifold.

The accepted approximation uses the lower contact edge for nearly upright side impacts.
Tilted and vertical impacts retain the prior response.

Median peak errors across fixed paths changed as follows:

| Group | Object | Before | After |
|---|---|---:|---:|
| Ground | Attacker position | 258.2 UU | 8.5 UU |
| Ground | Victim position | 47.0 UU | 22.4 UU |
| Air | Attacker position | 122.5 UU | 26.2 UU |
| Air | Victim position | 45.4 UU | 10.1 UU |
| Angled yaw | Attacker position | 599.0 UU | 80.1 UU |
| Angled yaw | Victim position | 101.7 UU | 71.6 UU |
| Air | Victim rotation | 57.5 degrees | 3.2 degrees |

One changed path regressed from 87.5 to 106.9 UU.
The broad gains justified the accepted approximation.

## Current deterministic baseline

The current recording engine is `0cfac505b21f66a7`.
The approved baseline contains 161,283 states and 714,159,334 fields across 16 cases.
An independent second run matched every native, WASM, and regression field.

All 4,320 fixed defense scenarios still pass their acceptance checks.
Three idle-concession times changed in defense-v1.
Scenario inputs, plans, generator hashes, and rejection counts did not change.

The previous engine, `dcc6aac2894ceb94`, remains under `artifacts/archive/before-low-manifold/`.

## Rejected geometry work

The local CMF mesh probe measures goal surfaces with RocketSim's 50 UU scale.
A broad analytic goal fit improved important headline paths.

- Goal-edge car position improved from 404.78 to 100.21 UU.
- Goal-edge car rotation improved from 119.04 to 25.94 degrees.
- Ball-post position improved from 143.88 to 100.33 UU.

The 96-path goal suite rejected the fit.
One car path rose from approximately 133 to 425 UU.

The analytic surfaces cannot reproduce Bullet's internal-edge contact aggregation.
The prototype remains in `artifacts/rocketsim-diff/goal-prototype.patch`.

Moving world contacts before position integration also produced mixed results.
That prototype remains in `artifacts/rocketsim-diff/contact-order-prototype.patch`.

## Rejected car-ball work

RocketSim uses friction 2, zero restitution, ten solver iterations, and split impulse.
Soccar uses one analytic sphere-box contact and one impulse pass.

A fixed 5 UU penetration allowance improved the original dribble.
Its peak position error fell from 114.96 to 15.65 UU.
The wider contact suite rejected the change.

| Group | Median before | Median prototype |
|---|---:|---:|
| Resting overlap | 12.58 UU | 8.29 UU |
| Dribble | 58.31 UU | 131.99 UU |
| Ground hit | 24.36 UU | 29.28 UU |
| Air hit | 9.13 UU | 6.34 UU |

An ERP-sized correction improved every throttle dribble.
It improved only 3 of 12 coast dribbles.

Matching RocketSim's callback order cut the original dribble to 73.23 UU.
It improved only 7 of 24 dribbles.
Median dribble error rose to 111.20 UU.

An exact Bullet box-margin prototype improved several group medians.
One elevated corner hit rose from 132.27 to 359.98 UU.

These failures indicate a coupled-contact problem.
One correction factor cannot replace Bullet's iterative car, ball, and world solve.

## Rejected car-car work

The bump suite rejected changes to callback timing, integration order, and correction percentage.
Removing the physical collision impulse caused large regressions.

The accepted lower contact point approximates one effective manifold result.
It is not a complete box-box manifold.
Pitch and roll contacts still use the old one-point response.

## Why agreement is not exact

### Different solvers

RocketSim uses Bullet with f32 values and iterative constraint solving.
Soccar uses deterministic f64 analytic contacts.
Its native and WASM builds share exactly the same arithmetic path.

### Contact manifolds

Bullet can keep several contact points between two boxes.
Soccar usually reduces one collision pair to one point and one normal.
That reduction changes torque, friction, and edge behavior.

### Coupled contacts

A dribbling ball can touch a car while the car touches the floor.
A ground collision can also involve four wheels and suspension forces.
Bullet solves these constraints together over several iterations.
Soccar resolves them in a fixed sequence.

### Position correction

Bullet uses ERP, contact thresholds, persistent manifolds, and split impulse.
Soccar usually removes penetration directly in one step.
This difference is important during resting contacts and repeated pushes.

### Arena geometry

RocketSim uses the extracted triangle meshes.
Soccar uses compact analytic arena surfaces.
The analytic model does not represent every seam, bevel, post edge, or triangle normal.

### Tick staging

Bullet detects contacts, solves velocity constraints, integrates transforms, and applies game impulses in separate stages.
Soccar has a smaller fixed update sequence.
Changing one stage can improve one contact and regress another.

### Sleeping and randomness

RocketSim can sleep a motionless ball.
Soccar keeps gravity behavior explicit and deterministic.
RocketSim demolition respawns use an uncontrolled random source in the comparison harness.
Post-respawn position errors therefore include random placement differences.

## Largest known gaps

The following paths remain useful audit targets:

- Goal-edge car contacts have approximately 405 UU peak position error.
- Ball-post contacts have approximately 144 UU peak position error.
- The original ground dribble has approximately 115 UU peak position error.
- Wall entry has approximately 108 UU peak position error.
- Corner entry has approximately 74 UU peak position error.
- Upright bumps improved greatly, but one victim path still has 106.9 UU error.

These values are path peaks, not constant offsets.
A small first-contact difference can grow during a long trace.

## Remaining work

### 1. Coupled car-ball response

Add a small iterative contact solve for car-ball and world constraints.
Test all 105 contact paths before accepting it.
Do not tune only the original dribble.

### 2. Full car-car manifold

Generate several box-box points for pitched, rolled, and vertical impacts.
Preserve the accepted upright response while expanding coverage.
Test all 77 bump paths and demolition timing.

### 3. Goal and arena contacts

Use measured mesh sections to design local surfaces.
Do not use one broad goal fit.
Validate each surface against all 96 mirrored goal paths.

### 4. Wheel and world coupling

Audit how suspension forces interact with car-world and car-car contacts.
Protect roof recovery and powerslide behavior during this work.

### 5. Harness coverage

The harness does not compare countdowns, kickoff scheduling, or scoring rules.
It also does not reproduce seeded simultaneous-contact order or recording compatibility.
Keep those checks in the deterministic game test suite.

## Required workflow

Keep each prototype isolated.
Run its focused suite and the 78-path baseline suite.
Reject improvements that hide large regressions.

Never change a brain module to improve a physics measurement.
Never change a fixed scenario to favor one prototype.

After an approved physics change:

1. Archive the old WASM, arena exports, and measured defense files.
2. Build WASM.
3. Record the full deterministic baseline once.
4. Run the full check again without `--record`.
5. Remeasure all fixed defense scenarios.
6. Generate current arena and set-piece exports.
7. Run Rust, Node, CLI, recording, arena, browser, and replay checks.
8. Update the recording-engine history and reject older recordings.

Do not record a baseline only to remove an unexplained failure.

## Commands

Run the main comparison:

```sh
artifacts/rocketsim-diff/venv/Scripts/python.exe tools/rocketsim-diff/compare.py \
  --match-controls \
  --meshes artifacts/rocketsim-diff/dumper/collision_meshes \
  --output artifacts/rocketsim-diff/run
```

Select a wider suite with `--suite goals`, `--suite contacts`, or `--suite bumps`.

Run harness checks:

```sh
artifacts/rocketsim-diff/venv/Scripts/python.exe tools/rocketsim-diff/check_harness.py
```

Run the deterministic simulation check:

```sh
npm run build:wasm
node scripts/check-simulation.mjs --full
```

Record only an approved behavior change:

```sh
npm run build:wasm
node scripts/check-simulation.mjs --full --record
```

## Related reports

- [Powerslide](POWERSLIDE.md)
- [Recovery order](RECOVERY.md)
- [Goal geometry](GOAL-GEOMETRY.md)
- [Car-ball contacts](CONTACTS.md)
- [Car-car contacts](BUMPS.md)
