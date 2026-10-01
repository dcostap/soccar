# Bravo

## Approach

Bravo assigns one attacker each tick. It gives the other cars separate support positions.
The attacker selects the first reachable slice from the shared ball prediction.
It drives through a short approach point behind the ball.
The role cost includes travel, turning, height, and position relative to the ball.
A small role bonus reduces changes between attackers.
The last support car follows predicted shots toward its goal.
Support cars collect large boost pads when the route permits it.
Bravo uses the classic flip, aerial, kickoff, and recovery routines without changing them.

## Experiments

All arena commands used `--threads 8`. Tests used full 300-second matches and swapped sides for each seed.
No test read the other entry.

| Change | Wins against allstar | Matches |
| --- | ---: | ---: |
| First attack override, close support | 25 | 60 |
| Unified interception, 1000/2400 support gaps | 59 | 120 |
| Unified interception, 1800/4000 support gaps | 50 | 80 |
| Unified interception, 2600/3400 support gaps | 144 | 200 |
| Higher cost for cars ahead of the ball | 142 | 200 |
| Defender held behind midfield | 131 | 200 |
| Stronger steering damping | 112 | 200 |
| First reachable slice, 2600/3400 support gaps | 69 | 80 |

Deep support reduced goals against. Holding a fixed defensive position did not help.
Stronger steering damping reduced wins.
The first-reachable version won 60 of 80 matches against the previous attacker.
The final selection also tests attack variants against each other.

The last comparison used seeds 1001–1120.
Deep support beat the short-offset version in 142 of 240 matches.
The combined variant led deep support 124–116. This difference does not establish a better brain.
Deep support beat allstar in 198 of 240 matches.
I selected deep support with the default shot offset. It scored more goals across this comparison.

The final entry uses support gaps of 1800 and 4000 units.
It keeps the default shot offset and role cost.

Elo values from different result pools are not direct comparisons.
Selection uses fixed opponents, direct matches between variants, and new seeds for validation.

## Submission checks

Earlier records remain in the local, ignored file `arena/results/bravo-experiments.jsonl`.
Those records include retired code and temporary settings. They cannot use the final module for exact replays.
The active ledger contains only the final module and built-in brains.
Final validation uses seeds 10001 and later. No further settings change follows this validation.

### Final 3v3 validation

Each opponent played 200 matches against Bravo, with sides swapped for each seed.

| Opponent | Bravo wins | Win rate |
| --- | ---: | ---: |
| allstar | 168/200 | 84% |
| pro | 186/200 | 93% |
| rookie | 200/200 | 100% |

The same 1200-match ladder measured 389.22 brain milliseconds per match for Bravo.
It measured 182.54 for allstar. The ratio was 2.132, below the limit of 3.

The entry targets 3v3. It won 21/80 in 1v1 and 39/80 in 2v2 against allstar.
These smaller formats do not show an advantage.

### Checks

- `node scripts/check-contest.mjs contest/bravo bravo`: passed; checked again after the commit.
- `npm run test:rust`: passed all 19 tests.
- `npm run build:wasm && npm run test:arena`: passed.
- `node scripts/check-arena-replay.mjs 16`: all 16 sampled matches replayed exactly, including all team sizes and overtime.
- `node scripts/check-simulation.mjs`: native/WASM and baseline checks passed for all 13 cases.
- `git diff --check`: passed.

Only the entry module, entry settings, and these notes changed. All temporary brain files were removed.
