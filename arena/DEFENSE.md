# Measured defense tests

## Normal tests

The default measured benchmark has 2,160 tests.
Nine `defense-v2-*` families supply 1,944 tests with public seed `1396790854`.
`defense-v3-ground-recovery` adds 216 tests with defenders farther from goal.

Every normal threat starts at least 2,000 horizontal units from the goal mouth.
Physics must report a goal between **2.5 and 5 seconds** after the start.
The idle defender must also concede within that window.
These limits prevent a short ball movement near the net from becoming a normal test.

The tested brain controls one blue car. Some tests include one fixed orange rival.
No current brain participates in candidate selection.

```sh
# Add v2 once, in a checkout without the v2 files.
npm run arena -- setpieces generate-defense

# Test normal and existing non-emergency suites, then export browser data.
npm run arena -- setpieces

# Test one normal family.
npm run arena -- setpieces alphabravo --suite defense-v2-ceiling

# Test new normal cases without changing files, browser data, or result logs.
npm run arena -- setpieces alphabravo alpha bravo --defense --holdout 90210

# Check native and WASM state, plus real Chrome controls and replay.
npm run test:defense
```

`generate-defense` refuses to replace existing files.
Accepted tests stay fixed. Add a new version to extend them.
`--count` changes the cases per family. The default is 216.
Smaller counts give less coverage.
Worker count does not change cases, order, or measurements.
Small runs use prefixes of larger runs within each family.

Use an undisclosed seed for a real holdout. A published seed is no longer unseen.

## Families

### Ground recovery

`defense-v3-ground-recovery` tests travel and interception, not saves from an existing goal position.
The defender starts at least 2,800 units from the goal mouth.
Its starting position stays at least 1,000 units from every point on the undefended ball path.
The original `defense-v2-ground` cases and results stay unchanged.

Six position groups cover midfield, the attack half, both wide sides, the wrong side, and chasing from behind.
Three entry lanes give 18 cells with twelve tests each.
Heading, motion, and boost totals remain equal. All threats are rolling ground shots.
Goal windows remain 2.5–5 seconds. The proposal targets 3.4–4.65 seconds to allow travel.

The required average travel speed must be between 600 and 1,600 units per second.
This estimate subtracts contact reach and uses intercepts before the goal mouth.
It leaves at least 0.35 seconds before the undefended goal.
It ignores acceleration, heading, and boost. It does not prove that a save is possible.
The browser details show the measured distances and required speed.
No current brain selects accepted cases.

```sh
npm run arena -- setpieces generate-ground-recovery
npm run arena -- setpieces --suite defense-v3-ground-recovery
npm run arena -- setpieces alphabravo alpha bravo --defense --suite defense-v3-ground-recovery --holdout 90210
```

The fixed public seed is `1396790855`. Measurements are in `arena/scenarios/defense-v3.json`.

### Original normal families

| Normal suffix | Measured path |
| --- | --- |
| `ground` | Low goal entry, with no strong bounce |
| `falling` | Falling goal entry, with no strong bounce |
| `floor` | One strong floor bounce |
| `double-floor` | Two strong floor bounces |
| `side-wall` | One side-wall bounce; floor bounces may follow |
| `corner` | One diagonal corner bounce; floor bounces may follow |
| `ceiling` | One ceiling bounce; floor bounces may follow |
| `rival-front` | One centered strike on a still ball |
| `rival-cut` | One offset strike on a still ball |

Normal strike rivals drive straight, then brake after ball contact.
They remain physical cars. They do not chase the ball or take a planned second shot.
The new `strike` module leaves the existing `scripted` module unchanged.

A strong bounce has normal impact speed above 150 units per second.
This excludes normal floor contact from a rolling ball.
Strong rival contacts have reported impulse strength above 60.
Consecutive strong contacts within six ticks count as one contact period.
A later second strong contact rejects the candidate. Light contacts remain part of the physical path.

Goal entry uses the ball center at the field goal plane, not its starting direction.
Arrival time ends when physics reports a goal.
Rival speed comes from the car state immediately before the collision impulse.

## Coverage

Seven ball-flight families use 18 cells: three entry lanes × six defender positions.
Each cell has twelve cases at the default count.
The two rival families add three measured contact-speed groups, giving 54 cells each.
Each rival cell has four cases.
The normal plan has 234 cells in total.

| Dimension | Groups |
| --- | --- |
| Entry lane | Left: x below -300; center: -300 through 300; right: x above 300 |
| Defender position | Goal mouth, near post, far post, inside goal, ahead, beside |
| Defender heading | Toward the starting ball, leftward, away, rightward |
| Defender motion | Stopped, forward at 800, reverse at 700, forward at 1,400 |
| Defender boost | 0, 12, 33, 100 |
| Rival contact speed | Slow: below 1,000; medium: 1,000–1,600; fast: at least 1,600 |

Speeds use game units per second.
Each family has equal heading, motion, and boost totals at the default count.
Cyclic assignments vary combinations across cells. They do not cover every possible combination.
Rival contact-speed groups also have equal totals.

Normal arrival groups are early: 2.5–3.3 s; middle: 3.3–4.1 s; late: 4.1–5 s.
Arrival groups are measured distributions, not quotas. The generator does not force short reaction windows to fill them.
Start side and entry height are also measured distributions.
Entry heights are low below 160, middle below 350, and high at least 350.

Ball starts, speeds, heights, angles, and spin vary within the plan.
Defender positions vary independently when candidates are proposed.
Acceptance can change these distributions. Reports show the accepted distributions.

## Acceptance checks

The generator uses the shared Rust physics for every accepted threat.

1. Reject wall overlap, car overlap, and ball speeds above 6,000.
2. Require at least 2,000 horizontal units between the starting ball and the goal mouth.
3. Remove the defender and run the complete threat through physics.
4. Require a blue concession in 2.5–5 seconds, the specified bounce family, and the planned coverage cell.
5. Reject cases outside an optimistic horizontal travel bound.
6. Run the idle defender. Require it to concede in 2.5–5 seconds too.
7. Record entry, arrival, speed, bounces, rival contact, and sampled path.

The travel bound allows 2,300 units per second plus 220 units for contact reach.
It ignores acceleration, heading, vertical travel, and available boost.
**A positive travel margin does not prove that a save is possible.**
These are verified threats, not certified solvable puzzles.
Future reference controllers or saved successful runs can provide stronger evidence.
Do not remove a case because all current brains fail it.

Candidate helpers estimate velocities and solve some flights in a floor-and-ceiling corridor.
Those helpers propose starts only. Complete arena physics decides acceptance.
The generator fills requested cells or returns an error. It never hides missing coverage.

## Emergency archive

The original 2,160 `defense-v1-*` cases stay fixed, with their measurements and results.
They are excluded from default runs and default browser totals.
Select **Include emergency tests**, name a v1 suite, or use `--emergency` to include them.
Short-window tests belong here, not in the normal benchmark.
Some archived v1 cases already have longer windows.

```sh
npm run arena -- setpieces alphabravo --suite defense-v1-rising
npm run arena -- setpieces alphabravo --emergency
npm run arena -- setpieces alphabravo --defense --emergency --holdout 90210
```

The direct rising family remains in the archive only.
Gravity prevents a long, unbounced rising shot from entering below the crossbar.
The v1 public seed is `1396790853`. Its arrival groups retain their original boundaries.
Archive scenarios remain in exported data, so their existing watch links still work.

## Reports and checks

`arena/scenarios/defense-v2.json` stores the normal plan, rejected counts, and measurements.
`defense-v1.json` retains the emergency archive.
Measurements include the physics version and scenario hash.
The export hides stale measurements instead of attaching them to changed tests.
The physics version is `recording::engine_version()`, which also changes with game rules such as save detection.
After such a change the three defense tests in `npm run test:arena` find no measurements.
If the change cannot alter set-piece play, set each file's `simulation` field to the new version.
Then run `cargo test --release --manifest-path arena/Cargo.toml defense::`.
It re-simulates every measured threat and fails on any difference.

If approved physics can alter set-piece play, remeasure the fixed inputs:

```sh
npm run arena -- setpieces remeasure-defense
```

The command updates physics-derived metadata only.
It stops if a fixed threat no longer meets its family or acceptance checks.
It does not change scenario text, hashes, plans, or rejection counts.

The CLI reports each family and each measured dimension.
The browser adds **Group results by**, row filters, measured details, and dashed undefended paths.
Select a suite before grouping to inspect one family.
Percentages use completed results. Cell tooltips show the number tested.

Rust tests check public threats, idle results, lead-in limits, worker independence, and different seeds.
`test:defense` compares normal and archived native/WASM runs, including idle and alphabravo.
It also checks browser filters and a short-link replay in real Chrome.

These tests do not yet cover airborne defenders, wall starts, active jumps, or multiple attackers.
Use exact player-replay contributions for those states, or add a new generated version.
