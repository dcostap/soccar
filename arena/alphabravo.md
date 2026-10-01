# Alphabravo

Alphabravo is a new brain. It does not change alpha, bravo, physics, or scoring.
Its settings file is `arena/brains/alphabravo.brain`.

## Decisions

- Use alpha's goal-side pressure. Supports can challenge a ball while the third car protects the goal.
- Keep alpha's timed intercepts for moving balls in team attacks.
- Use bravo's acceleration-based intercept search for low defensive balls and solo play.
- Keep one recovery controller until an incoming threat ends. Do not change controllers halfway through a save.
- Route around the ball when a direct touch points into the own goal mouth.
- Reject flips on those own-goal lines. Clear loose defensive balls toward the side.
- Keep the previous attacker when another car has only a small distance advantage.
- Include a human teammate in attacker and goalkeeper selection. Never write that player's controls.

Alpha supplies flight control, recovery, and kickoff control.
Alphabravo supplies ground tactics, controller selection, and team roles.
Its fingerprint includes both module files. A change to either file retires its results.

The `shotzone` setting selects where low-speed team attacks use bravo's strike controller.
The accepted entry uses `5000`: most team attacks keep alpha's timed controller.
Solo play and low defensive balls use the strike controller without that field-position limit.
Other settings come from alpha's `Settings`.

## Development checks

Trials used seed base `700001`. They compared paired five-minute matches and all 466 public set pieces.
More pressure from the third car reduced team results. Disabling aerials gave no clear gain.
Aiming away from a moving goalkeeper also gave no clear gain and added work to each prediction slice.
Those changes were not retained.

The retained design computes the strike plan only when it needs that controller.
It does not clone the world or simulate candidate matches inside a decision.

## Exact state checks

Run the existing baseline check first. It must pass without recording new hashes.
Then compare native and WASM state with the new brain on either side:

```sh
npm run build:wasm
node scripts/check-simulation.mjs --full
node scripts/check-simulation.mjs --full --brains arena/brains/alphabravo.brain arena/brains/bravo.brain
node scripts/check-simulation.mjs --brains arena/brains/alpha.brain arena/brains/alphabravo.brain
node scripts/check-arena-replay.mjs 4 --brain alphabravo
```

The custom brain check compares every state field exactly. It does not compare custom matches with classic baseline scores.
It rejects `--record`, so it cannot replace the baseline with a custom brain run.

Rust tests cover full-state checkpoints, recovery checkpoints, parallel scenarios, inactive cars, and direct own-goal lines.
Node tests cover WASM checkpoints for all team sizes. Arena replay checks compare logged match and set-piece results.

## Final evaluation

The final code uses match seed base `530226683` and holdout scenario seed `400792678`.
Both seeds were drawn after selecting the code and settings.
The holdout has 200 scenarios per family, or 1,600 scenarios.

| Test                                | Alphabravo | Alpha | Bravo |
| ----------------------------------- | ---------- | ----- | ----- |
| Public set pieces, 466 scenarios    | 55.8%      | 50.0% | 53.0% |
| Public credit                       | 0.619      | 0.564 | 0.594 |
| Holdout set pieces, 1,600 scenarios | 61%        | 59%   | 56%   |
| Holdout credit                      | 0.644      | 0.613 | 0.597 |

Each 3v3 comparison played 500 fresh seed pairs, with sides swapped: 1,000 matches per rival.

| 3v3 rival | Wins–losses | Win rate | Elo difference, 95% interval |
| --------- | ----------- | -------- | ---------------------------- |
| Alpha     | 580–420     | 58.0%    | +56 [+34, +78]               |
| Bravo     | 850–150     | 85.0%    | +301 [+274, +332]            |

Both sequential tests accepted that alphabravo is stronger than the rival.
These results apply to this build, match format, and seed sample. They do not prove every matchup.

Smaller-team checks used 100 seed pairs per rival, or 200 matches each:

| Format       | Versus alpha | Versus bravo | Versus allstar |
| ------------ | ------------ | ------------ | -------------- |
| 2v2 win rate | 58.0%        | 80.5%        | Not tested     |
| 1v1 win rate | 35.0%        | 51.0%        | 24.5%          |

This is a team brain. It remains weak in full 1v1 matches, despite its better placed-scenario defense.

Public skill results retain both parents' main strengths:

| Family     | Alphabravo | Alpha | Bravo |
| ---------- | ---------- | ----- | ----- |
| Chase-back | 68%        | 68%   | 18%   |
| Breakaways | 25%        | 8%    | 25%   |
| Saves      | 68%        | 58%   | 68%   |
| Scrambles  | 68%        | 52%   | 75%   |

The holdout favors alpha on moving-ball attacks and bravo on scrambles.
Alphabravo does not beat both parents in every family.

The holdout also found an invalid car start near a rounded corner.
The generator now skips invalid candidates. The evaluation kept the same seed and did not rewrite public scenarios.

The unchanged baseline passed all 170,333 states and 755,073,539 fields.
Alphabravo versus bravo passed full native/WASM comparison: 145,610 states and 644,117,847 fields.
The orange-side check also passed, along with Rust, Node, CLI, presentation, and browser checks.

## Run it

```sh
npm run arena -- setpieces alphabravo alpha bravo
npm run arena -- challenge alphabravo alpha
npm run arena -- export
npm run dev
```

Select `alphabravo` under Bot Difficulty, or use its watch links on `arena.html`.
