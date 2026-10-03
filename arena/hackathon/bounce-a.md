# Bounce A — rejected economical assessment

Status: **not a winner**. Set-piece gains do not pass the match rating gates.
Observed combined 1v1 and plain 2v2/3v3 ratings fall below their baselines.
Challenge guards also remain unproved at the revised sample limits.
Branch: `hackathon/bounce-a`. Base: `201fe7b35ebfb7162f5e97fec934609db4dce473`.
The worktree did not rebase, merge, or copy newer main scenarios or results.
Private browser server: port `5181`.

## Idea and claim

Use a timed ground approach after a predicted floor or wall bounce.
Test the approach with car and ball physics before claiming the car.
The test must touch the ball and avoid the own goal through the threat time plus 0.8 seconds.

Claim only for a predicted own-goal threat with the ball in the own half.
Require ground contact, upright wheels, and Save, Intercept, Strike, or Position mode.
Exclude Support cars on teams with more than one car.
Require an abrupt predicted normal-velocity change, then a reachable ball center below 155 units.
Approach from the own-goal side. Test at most six candidates every 12 ticks.
Use `s.d` for both teams. No scenario names or fixed start positions enter the code.

Hold until the planned contact time plus 12 ticks at most.
Release when any car touches the ball after plan start, the threat ends, or the claim conditions fail.
Keep the plan and search tick per car. Include both in `trace`.

Setting: `bounce-a.enabled = true`, by default.
Plain brain: `skills = bounce-a`.
Combination: `skills = bounce-a, aerial-a`.
Source: `simulation/src/brains/modular/skills/bounce_a.rs`.
The registry fingerprints this complete source file. There are no source helpers.
Final fingerprints: plain `d29dc90e06ed447d`; combination `d2028f8a02243536`.
Comparison fingerprints: modular `47dbdcf72f0cd13f`; aerial-a `483540faca92b026`.
Log: `arena/results/bounce-a-list.log`.
Source SHA-256: `da8c85e1abdf4d47813a1621ee3620919f5caa647ab11718c29a0de452b6fc23`.

## Set-piece results

Final source public target results, 864 scenarios per brain:

| Suite | n | modular | bounce | aerial-a | bounce + aerial-a |
|---|---:|---:|---:|---:|---:|
| corner | 216 | 24% | 37% | 91% | 89% |
| double-floor | 216 | 17% | 31% | 86% | 86% |
| floor | 216 | 11% | 23% | 71% | 72% |
| side-wall | 216 | 13% | 46% | 84% | 88% |
| All target pass | 864 | 16% | 34% | 83% | 84% |
| All target credit | 864 | 0.162 | 0.340 | 0.831 | 0.838 |

Log: `arena/results/bounce-a-public.log`.

Final-source holdout 73141, n=864: plain credit 0.329 versus 0.150.
Combination credit 0.828 versus aerial-a 0.814.
Pass rates: 33% versus 15%; combination 83% versus aerial-a 81%.
Log: `arena/results/bounce-a-holdout-73141.log`.

Final-source holdout 73142, n=864: plain credit 0.341 versus 0.154.
Combination credit 0.831 versus aerial-a 0.829.
Pass rates: 34% versus 15%; both aerial variants 83%.
Log: `arena/results/bounce-a-holdout-73142.log`.

Final-source holdout 73143, n=864: plain credit 0.336 versus 0.160.
Combination credit 0.816 versus aerial-a 0.812.
Pass rates: 34% versus 16%; combination 82% versus aerial-a 81%.
Log: `arena/results/bounce-a-holdout-73143.log`.

All normal suites: n=2,627, including 253 attack and 2,374 defense cases.
Plain credit 0.454 versus modular 0.360. Pass rate 44% versus 35%.
Combination credit 0.754 versus aerial-a 0.743. Pass rate 74% versus 73%.
Both credit nondecrease guards pass. These totals cover every normal suite selected by the arena.
Log: `arena/results/bounce-a-all-normal.log`.

Development 3v3 match signal: 33 wins, 27 losses, 30 seed pairs, 55% win rate.
The challenge was undecided: +35 Elo, interval [-46, +120].
Mean team brain time: 251 ms/match versus 210 ms/match, n=60.
This used a previous source fingerprint. It is not final evidence.
Log: `arena/results/bounce-a-dev-challenge-3.log`.

Final debug and release modular tests each passed 9/9.
Final WASM built successfully.
Both custom-brain native/WASM checks pass: 13 cases, 16,453 states, `difference: null`.
Logs: `arena/results/bounce-a-debug-tests.log`, `bounce-a-release-tests.log`, and `bounce-a-wasm-build.log`.
Parity artifacts: `arena/results/bounce-a-parity-plain.json` and `bounce-a-parity-aerial.json`.

## Final-fingerprint match samples

All matches use the default five-minute duration and paired seeds with sides exchanged.
All six challenge verdicts are **undecided**. The reduced caps do not prove the match guards.

| Size | Variant | Pairs | Wins-losses | Win rate | Elo difference [interval] |
|---|---|---:|---:|---:|---:|
| 1 | plain | 170 | 175-165 | 51.5% | +10 [-13, +33] |
| 1 | aerial | 20 | 19-21 | 47.5% | -17 [-77, +41] |
| 2 | plain | 20 | 20-20 | 50.0% | 0 [-85, +85] |
| 2 | aerial | 20 | 24-16 | 60.0% | +70 [-22, +174] |
| 3 | plain | 20 | 19-21 | 47.5% | -17 [-111, +73] |
| 3 | aerial | 20 | 18-22 | 45.0% | -35 [-150, +73] |

Logs: `arena/results/bounce-a-challenge-{plain,aerial}-{1,2,3}.log`.
These summaries use the cleaned ledger, not the interrupted overlapping jobs.

### Team brain time

These are mean team `brainMs` values from the direct comparison matches.
They are not command elapsed time. Each comparison uses the same unique match sample.

| Size | Variant | Matches | Entry ms/match | Baseline ms/match |
|---|---|---:|---:|---:|
| 1 | plain | 340 | 387.6 | 295.0 |
| 1 | aerial | 40 | 4512.0 | 4750.3 |
| 2 | plain | 40 | 224.0 | 191.3 |
| 2 | aerial | 40 | 3565.8 | 3496.3 |
| 3 | plain | 40 | 324.0 | 273.5 |
| 3 | aerial | 40 | 4071.7 | 4529.8 |

Artifact: `arena/results/bounce-a-metrics.json`, including fingerprints and every sampled match ID.
Different match paths and CPU load affect these times. They are not an isolated skill benchmark.

## Full-field economical ladders

Each ladder covers all 12 current brains with `--pairs 1`.
Copied baseline results remain in the rating fit. Each size added 38 missing matches.
Field coverage is complete for one pair, but the default ten-pair coverage is incomplete.
These small samples do not prove rating gains. All ratings use final source fingerprints and cleaned records.

| Size | Variant | Entry Elo / rank / games | Baseline Elo / rank / games | Observed guard |
|---|---|---|---|---|
| 1 | plain | 971 / 9 / 360 | 963 / 10 / 522 | higher, limited evidence |
| 1 | aerial | 1007 / 7 / 60 | 1033 / 6 / 222 | **lower** |
| 2 | plain | 1465 / 8 / 60 | 1501 / 6 / 222 | **lower** |
| 2 | aerial | 1652 / 2 / 60 | 1638 / 3 / 222 | higher, limited evidence |
| 3 | plain | 1839 / 7 / 60 | 1881 / 6 / 222 | **lower** |
| 3 | aerial | 2132 / 1 / 60 | 2130 / 2 / 222 | higher, limited evidence |

Ranks count all 12 brains. Plain compares with modular; aerial compares with modular-aerial-a.
Logs: `arena/results/bounce-a-ladder-{1,2,3}.log`.
The lower observed ratings reject the entry as a winner. Do not treat rank 1 in 3v3 as certification.

## Browser observations

I watched rendered match segments in a separate Playwright Chrome profile on port 5181.
The browser loaded the rebuilt final-source WASM from this worktree.
I inspected saved frames before, during, and after the first goal in each selected match.
These were short segments, not complete match watches.

| Match ID | Size / variant | Observed action |
|---:|---|---|
| 23323 | 1 / plain | Both cars follow the side wall. Blue reaches the orange post and scores at 3:50. |
| 23664 | 1 / aerial, entry orange | The same wall chase ends with blue scoring. Orange does not block this opening. |
| 23703 | 2 / plain | Blue cars enter the orange box together. Car 2 scores; Car 1 gets the assist. |
| 23743 | 2 / aerial | Blue makes an airborne touch near the orange goal, then scores at 4:42. |
| 23783 | 3 / plain | Blue follows a falling ball from the side wall into the orange box and scores. |
| 23825 | 3 / aerial | Two orange cars reach the blue box. A blue car is above the goal; orange scores at 3:01. |

The last segment shows a crowded defense that the isolated-car rollout does not model.
The frames alone do not identify which skill controlled each car.

I also watched both public failures below through their final verdicts.

- `defense-v2-floor/left-lead-in-near-post-001`: the car turns under a high rebound but makes no touch and concedes.
- `defense-v2-corner/center-lead-in-ahead-003`: the car gets a save event, then the ball becomes an own goal.
  The clear delays entry from 4.4 to 5.7 seconds but still fails.
  A short follow window does not prove long-term safety.

Both failure watches displayed **Replay matches the arena result**.
Failure links and setup details: `arena/results/bounce-a-failure-floor.log` and `bounce-a-failure-corner.log`.
The suite listing is `arena/results/bounce-a-failure-suite.log`.
Frames and browser records: `arena/results/bounce-a-watch/`, `observed.json`, and `failures-observed.json`.

Vite stalled at WASM loading. A temporary static server fixed the request path.
The server also handles source CSS imports. It changes no project source or simulation controls.
No script exceptions appeared in the successful watches. Some model requests recorded `ERR_ABORTED` during match watches.
The frames rendered the cars and stadium. I do not claim a full browser test pass from these observations.

## Checks and limits

Final evidence uses one CPU-heavy job at a time, except the Windows child-process overlap described below.
Earlier completed evidence used two threads under the original CPU limit.
After the user changed the limit, arena commands use `--threads 1` and builds use `CARGO_BUILD_JOBS=1`.
Existing final-source tests and parity remain valid. They will not run again without a source change.

Completed sequential evidence:

1. Final public suites: complete.
2. Defense holdout seeds 73141, 73142, 73143: complete.
3. All normal suite totals: complete.
4. Final fingerprints: complete.

Complete: final debug/release tests, rebuilt WASM, native/WASM parity for both variants.
Complete: all-size challenge samples under the user's revised limits.
The saved plain 1v1 sample used `--max-pairs 170`; only its missing half ran.
The five previously empty challenge cells used 20 paired seeds each.
Complete: full-field ladders at each size with `--pairs 1 --threads 1`.
Complete: final team brainMs.
Complete: six browser match segments, public failure `show` output, and two full public failure watches.
Unproved: the challenge guards at exhaustive caps and the default ten-pair ladder coverage.
Failed: observed combined 1v1 and plain 2v2/3v3 ladder rating guards.

Elapsed command time: final set-piece/holdout chain 23 minutes; final test/build/parity chain 5 minutes.
The economical match/field chain took 33 minutes. The successful browser watch chain took 4 minutes.
These times are not team brainMs measurements.
Public, holdout, normal-suite, test, and parity jobs completed before the CPU-limit change.

## Updated economical test plan

The user ordered the two-thread match job to stop when the CPU limit changed.
The later economical plan replaced exhaustive challenge caps and default ten-pair ladders.
Reuse saved final-fingerprint matches. Complete only short samples in empty cells.
Do not tune the source or repeat public suites, holdouts, tests, parity, or builds.
Stop a challenge at its verdict or the revised sample limit.
Label reduced samples and unproved gates. Do not claim full certification.
Keep all-size plain/aerial ratings and several browser observations in the final report.

## Local ledger cleanup

On Windows, the shell stop left the old two-thread Rust child active.
It overlapped the resumed one-thread job and wrote duplicate match records.
The parent stopped the old child. I later stopped the current child at the economical-plan change.
I checked exact executable paths with `Get-CimInstance Win32_Process` before restarting.

With no match process active, I removed 92 duplicate seed-side keys from the ignored match log.
I kept the first record for each ordered fingerprint pair, seed, size, and duration.
All repeated keys had the same score. No match IDs needed renumbering after cleanup.
I removed 184 heatmap rows with ambiguous IDs rather than attach them to the wrong match.
Final challenges and ratings use only the cleaned log. Duplicate matches are not independent evidence.

Backups: `arena/results/bounce-a-precleanup-matches.jsonl` and `bounce-a-precleanup-heatmaps.jsonl`.
Cleanup record: `arena/results/bounce-a-cleanup.json`.
Final audit: 23,976 records, zero duplicate seed-side keys, and zero duplicate match IDs.

## Commands

Historical commands completed before the one-thread policy. Do not repeat these checks.

```sh
npm ci
cp -r C:/Projects/webdev/soccar/arena/results arena/
cp simulation/src/brains/modular/skills/template.rs simulation/src/brains/modular/skills/bounce_a.rs
export CARGO_BUILD_JOBS=2
npm run arena -- setpieces modular modular-bounce-a modular-aerial-a modular-bounce-a-aerial --suite defense-v2-floor,defense-v2-double-floor,defense-v2-side-wall,defense-v2-corner --threads 2
for seed in 73141 73142 73143; do
  npm run arena -- setpieces modular modular-bounce-a modular-aerial-a modular-bounce-a-aerial --defense --holdout $seed --suite defense-v2-floor,defense-v2-double-floor,defense-v2-side-wall,defense-v2-corner --threads 2
done
npm run arena -- setpieces modular modular-bounce-a modular-aerial-a modular-bounce-a-aerial --threads 2
npm run arena -- list --threads 2
cargo test --manifest-path simulation/Cargo.toml --test modular -- --test-threads=2
cargo test --release --manifest-path simulation/Cargo.toml --test modular -- --test-threads=2
npm run build:wasm
node scripts/check-simulation.mjs --brains arena/brains/modular-bounce-a.brain arena/brains/modular.brain
node scripts/check-simulation.mjs --brains arena/brains/modular-bounce-a-aerial.brain arena/brains/modular-aerial-a.brain
```

Completed match and field commands under the one-thread policy:

```sh
export CARGO_BUILD_JOBS=1
npm run arena -- challenge modular-bounce-a modular --size 1 --elo0 -15 --elo1 0 --max-pairs 170 --threads 1
npm run arena -- challenge modular-bounce-a-aerial modular-aerial-a --size 1 --elo0 -15 --elo1 0 --max-pairs 20 --threads 1
for size in 2 3; do
  npm run arena -- challenge modular-bounce-a modular --size $size --elo0 -15 --elo1 0 --max-pairs 20 --threads 1
  npm run arena -- challenge modular-bounce-a-aerial modular-aerial-a --size $size --elo0 -15 --elo1 0 --max-pairs 20 --threads 1
done
for size in 1 2 3; do
  npm run arena -- ladder --size $size --pairs 1 --threads 1
done
npm run arena -- export --size 3 --threads 1
npm run arena -- setpieces show defense-v2-floor --brain modular-bounce-a --threads 1
npm run arena -- setpieces show defense-v2-floor/left-lead-in-near-post-001 --brain modular-bounce-a --url http://127.0.0.1:5181 --threads 1
npm run arena -- setpieces show defense-v2-corner/center-lead-in-ahead-003 --brain modular-bounce-a-aerial --url http://127.0.0.1:5181 --threads 1
```

Temporary browser helpers are under `C:/Users/Darius/AppData/Local/Temp/pi-subagents/sa-9cc5c180/`.
Exact browser commands:

```sh
node C:/Users/Darius/AppData/Local/Temp/pi-subagents/sa-9cc5c180/server.mjs
node C:/Users/Darius/AppData/Local/Temp/pi-subagents/sa-9cc5c180/watch.mjs 23323 23664 23703 23743 23783 23825
node C:/Users/Darius/AppData/Local/Temp/pi-subagents/sa-9cc5c180/watch-failures.mjs
```

Evidence logs use the prefix `arena/results/bounce-a-`.
Match records remain in `arena/results/matches.jsonl`.
Set-piece records remain in `arena/results/setpieces.jsonl`.

## Known limits and desired core changes

The rollout ignores other cars. A rival can invalidate a tested approach.
The controller cannot meet high balls. It leaves those to the core or aerial-a.
The public corner suite loses two percentage points beside aerial-a.
The rollout follows the ball only through the threat time plus a short margin.
It does not prove long-term match safety.

Desired core change: none required for this entry.
No frozen core, other brain, scenario, judge, or baseline files changed.
