# Touch A — economical assessment

Status: rejected for track selection. Plain 2v2 ladder Elo is below the baseline. Five challenge guards remain unproved.
This is a limited assessment, not full certification. Do not select it as a winner.

Branch: `hackathon/touch-a`. Start commit: `201fe7b35ebfb7162f5e97fec934609db4dce473`.

## Idea and scope

Use short physics tests to select a low first touch. Accept a plan only when its isolated ball path scores.

The skill claims an upright, grounded attacker. Team size must be one, two, or three.
It accepts only `Strike` or `Intercept` mode. The ball must be low, upfield, and within 2,200 units.
A moving ball or a poor approach angle starts the search. An own-goal threat prevents a claim.

The search tests five arrival times and two approach distances. Each test uses the actual car and ball physics.
It ignores rivals and teammates. This limits the value of a predicted goal in a match.

The skill holds until contact, a missed arrival, or failed eligibility. It then releases the car to the core.
Per-car state includes the plan start, arrival, approach distance, and last search tick. `trace` records this state.

Setting: `touch-a.enabled = true`, by default. No core settings change.

Sources:

- `simulation/src/brains/modular/skills/touch_a.rs`
- Minimal registration in `simulation/src/brains/modular/skills/mod.rs`
- `arena/brains/modular-touch-a.brain`
- `arena/brains/modular-touch-a-aerial.brain`

The skill fingerprint includes its complete source. It uses frozen-core helpers and no other source files.

## Final source fingerprints

All final evidence uses the committed source below.

Source SHA-256: `900f294aa2a64377e05ee4bb7a18cb76c0e9ed25a20cd6702c517307b9f711cd`.

| Brain | Fingerprint |
| --- | --- |
| modular | `47dbdcf72f0cd13f` |
| modular-touch-a | `8c7c15351a11e05b` |
| modular-aerial-a | `483540faca92b026` |
| modular-touch-a-aerial | `7522cde65ffaf806` |

Evidence: `artifacts/touch-a/fingerprints.txt`. Older experimental fingerprints do not count toward final evidence.

## Public targets

Both suites have 40 scenarios. The combined sample has 80 scenarios per brain.

| Brain | gen-awkward pass | gen-moving pass | Combined pass | Combined credit |
| --- | ---: | ---: | ---: | ---: |
| modular | 30% | 45% | 37.50% | 0.468693 |
| modular-touch-a | 30% | 55% | 42.50% | 0.504407 |
| modular-aerial-a | 32.5% | 52.5% | 42.50% | 0.503291 |
| modular-touch-a-aerial | 32.5% | 60% | 46.25% | 0.532406 |

The gain comes mostly from moving balls. The public awkward suite has no pass gain.

## Development holdouts

These are development seeds, not judging seeds. Each seed supplies 100 scenarios per target family.
Each brain has 200 cases per seed. Printed pass percentages have integer rounding.

| Seed | modular pass / credit | touch pass / credit | aerial pass / credit | touch+aerial pass / credit |
| --- | --- | --- | --- | --- |
| 73191 | 43% / 0.532 | 46% / 0.549 | 46% / 0.549 | 50% / 0.571 |
| 84203 | 34% / 0.446 | 39% / 0.472 | 37% / 0.462 | 41% / 0.485 |
| 95317 | 34% / 0.479 | 42% / 0.527 | 41% / 0.518 | 48% / 0.560 |

Logs: `artifacts/touch-a/holdout-{73191,84203,95317}.txt`.

## All normal set pieces

The sample has all 2,627 normal scenarios. No emergency or archived defense-v1 scenarios count here.

| Brain | Passed | Pass | Credit |
| --- | ---: | ---: | ---: |
| modular | 918 | 34.9448% | 0.360361 |
| modular-touch-a | 927 | 35.2874% | 0.362946 |
| modular-aerial-a | 1927 | 73.3536% | 0.743254 |
| modular-touch-a-aerial | 1933 | 73.5820% | 0.744980 |

Both aggregate credit guards pass. All defensive suite pass rates stayed unchanged.
Evidence: `artifacts/touch-a/normal.txt`, `artifacts/touch-a/summary.json`, and `arena/results/setpieces.jsonl`.

## Matches and CPU cost

All matches use the default five-minute duration. Seeds play on both sides.
Initial work used two threads. The final reduced assessment uses one thread, as requested.
Only one heavy job runs at a time.

Plain means `modular-touch-a` against `modular`. Aerial means `modular-touch-a-aerial` against `modular-aerial-a`.

| Size | Variant | Pairs | Matches | Wins–losses | Win rate | Paired Elo interval | Verdict |
| --- | --- | ---: | ---: | --- | ---: | --- | --- |
| 1 | Plain | 141 | 282 | 173–109 | 61.35% | +80 [+38, +125] | Accepted stronger |
| 1 | Aerial | 37 | 74 | 49–25 | 66.22% | +117 [+39, +208] | Undecided; limited |
| 2 | Plain | 20 | 40 | 25–15 | 62.50% | +89 [-30, +233] | Undecided; limited |
| 2 | Aerial | 20 | 40 | 24–16 | 60.00% | +70 [-22, +174] | Undecided; limited |
| 3 | Plain | 20 | 40 | 23–17 | 57.50% | +53 [-35, +148] | Undecided; limited |
| 3 | Aerial | 20 | 40 | 24–16 | 60.00% | +70 [-34, +190] | Undecided; limited |

The initial 40-pair development sample is part of the final 141-pair sample. It does not add independent evidence.
Only the plain 1v1 challenge guard passed. The reduced limits leave five challenge guards unproved.

### Team controller cost

These means use the paired challenge matches above. Each CPU sample counts matches, not pairs.
`brainMs` measures team controller time, not total job elapsed time. Shared-machine load affects these measurements.
Different runs used different thread limits. These figures are not an isolated speed benchmark.

| Size | Variant | n | Entry brain ms/match | Paired baseline brain ms/match |
| --- | --- | ---: | ---: | ---: |
| 1 | Plain | 282 | 1957.54 | 216.79 |
| 1 | Aerial | 74 | 10829.71 | 8378.21 |
| 2 | Plain | 40 | 2253.48 | 436.99 |
| 2 | Aerial | 40 | 4150.37 | 3709.11 |
| 3 | Plain | 40 | 597.62 | 175.27 |
| 3 | Aerial | 40 | 3070.33 | 2789.02 |

Evidence: `artifacts/touch-a/summary.json`, `challenge-{plain,aerial}-{1,2,3}.txt`, and `arena/results/matches.jsonl`.

### Full-field ladders with limited samples

All three ladders used `--pairs 1`. Each entry faced all 11 other brains, on both sides.
The ladders reused the copied baseline pairings and larger challenge samples. Each size added only 38 new matches.
Most new field opponents have only two matches against each entry. The ratings therefore have incomplete sample coverage.

Ranks count all 12 current brains. `n` counts each brain's current matches in that format.
The displayed ratings use final fingerprints, not retired experiments.

| Size | Variant | Entry Elo / rank / n | Baseline Elo / rank / n | Elo change |
| --- | --- | --- | --- | ---: |
| 1 | Plain | 1029.1 / 7 / 302 | 957.9 / 10 / 464 | +71.2 |
| 1 | Aerial | 1117.9 / 2 / 94 | 1027.9 / 8 / 256 | +90.0 |
| 2 | Plain | 1480.5 / 7 / 60 | 1485.8 / 6 / 222 | **-5.3** |
| 2 | Aerial | 1684.7 / 1 / 60 | 1645.3 / 3 / 222 | +39.4 |
| 3 | Plain | 1868.9 / 6 / 60 | 1867.3 / 7 / 222 | +1.6 |
| 3 | Aerial | 2169.4 / 1 / 60 | 2105.7 / 3 / 222 | +63.7 |

Plain 2v2 fails the observed ladder point-estimate guard. The small sample does not prove lower true strength.
The higher aerial ranks do not certify a winner. Their challenge guards remain unproved.
Evidence: `artifacts/touch-a/ladder-{1,2,3}.txt` and `arena-size-{1,2,3}.json`.

## Other guards and watched matches

Debug and release modular tests each passed all nine tests. The WASM build passed.
Both custom native/WASM checks passed, with `difference: null`. Each checked 13 cases and 16,453 states.
Logs: `artifacts/touch-a/test-{debug,release}.txt`, `build-wasm.txt`, and `parity-{plain,aerial}.json`.

The private browser server uses port 5185. Playwright used a separate Chrome profile and rebuilt WASM.
I inspected rendered clips from three current-source matches, plus both public failure replays.
These are partial match watches, not full replay completion checks.

- Match `23263`: observed blue scoring at 89 KPH and leading 2–0. A later rival goal reduced the lead.
- Match `23264`: observed baseline blue scoring from a wall sequence. Touch orange remained near its goal.
- Match `23265`: observed touch blue leading 3–0. Later, the rival scored a slow 21 KPH goal.
- `gen-moving/034`: the replay ended without a goal. The car reached the attacking corner; the ball stayed outside the mouth.
- `gen-awkward/001`: observed the car rolling in the air under the ball near the attacking box. It did not score.

The rendered clips do not identify which controller caused each goal. I do not assign skill credit from them.
Captured browser errors: none. Evidence: `artifacts/touch-a/watch/observations.json` and its linked PNG files.
Match clips reached replay positions 4:22, 4:45, and 4:35, respectively.

## Known failures and desired core changes

`gen-moving/034` regresses from a baseline goal to a miss with credit 0.49.
`gen-awkward/001` still fails with zero credit. Most awkward starts do not improve.

The isolated search ignores other cars. Its predicted scoring touch can lose to a rival challenge.
For a slow ball, improved alignment can end eligibility before the planned touch. This limits awkward-start gains.

A shared deterministic one-car physics step could remove copied step order. I did not change the frozen core.

## Commands and stable evidence

Setup:

```sh
npm ci
cp -r /c/Projects/webdev/soccar/arena/results arena/
```

Public and normal evidence:

```sh
CARGO_BUILD_JOBS=2 npm run arena -- setpieces modular modular-touch-a modular-aerial-a modular-touch-a-aerial --suite gen-moving,gen-awkward --threads 2
CARGO_BUILD_JOBS=2 npm run arena -- setpieces modular modular-touch-a modular-aerial-a modular-touch-a-aerial --threads 2
for seed in 73191 84203 95317; do
  CARGO_BUILD_JOBS=2 npm run arena -- setpieces modular modular-touch-a modular-aerial-a modular-touch-a-aerial --holdout $seed --suite holdout-moving,holdout-awkward --count 100 --threads 2
done
CARGO_BUILD_JOBS=2 npm run arena -- challenge modular-touch-a modular --size 1 --elo0 -15 --elo1 0 --max-pairs 40 --threads 2
```

Guard job:

```sh
CARGO_BUILD_JOBS=2 cargo test --locked --manifest-path simulation/Cargo.toml --test modular -- --test-threads=2
CARGO_BUILD_JOBS=2 cargo test --release --locked --manifest-path simulation/Cargo.toml --test modular -- --test-threads=2
CARGO_BUILD_JOBS=2 npm run build:wasm
CARGO_BUILD_JOBS=2 node scripts/check-simulation.mjs --brains arena/brains/modular-touch-a.brain arena/brains/modular.brain
CARGO_BUILD_JOBS=2 node scripts/check-simulation.mjs --brains arena/brains/modular-touch-a-aerial.brain arena/brains/modular-aerial-a.brain
```

Original final match job used `--max-pairs 300` and `--threads 2`.
It finished plain 1v1, then stopped during aerial 1v1 after the parent terminated the old process.
The user then requested this reduced final match job:

```sh
CARGO_BUILD_JOBS=1 npm run arena -- challenge modular-touch-a-aerial modular-aerial-a --size 1 --elo0 -15 --elo1 0 --max-pairs 37 --threads 1
for size in 2 3; do
  CARGO_BUILD_JOBS=1 npm run arena -- challenge modular-touch-a modular --size $size --elo0 -15 --elo1 0 --max-pairs 20 --threads 1
  CARGO_BUILD_JOBS=1 npm run arena -- challenge modular-touch-a-aerial modular-aerial-a --size $size --elo0 -15 --elo1 0 --max-pairs 20 --threads 1
done
for size in 1 2 3; do
  CARGO_BUILD_JOBS=1 npm run arena -- ladder --size $size --pairs 1 --threads 1
done
```

Final logs: `artifacts/touch-a/challenge-{plain,aerial}-{1,2,3}.txt` and `ladder-{1,2,3}.txt`.
Each completed ladder preserves its export at `artifacts/touch-a/arena-size-{1,2,3}.json`.

Browser server command: `node node_modules/vite/bin/vite.js --host 127.0.0.1 --port 5185 --strictPort`.
The scratch watch script ran with `node C:/Users/Darius/AppData/Local/Temp/pi-subagents/sa-270f5102/watch-touch.mjs 23263 23264 23265`.

Failure and fingerprint inspection used the release arena executable with `--threads 2`.
Logs: `artifacts/touch-a/show-moving.txt`, `show-awkward.txt`, `failure-moving-034.txt`, and `failure-awkward-001.txt`.

## Data integrity and reduced test plan

The parent terminated old two-thread process PID 37080. No replacement process had started in this worktree.
`Get-CimInstance Win32_Process` confirmed no touch arena or simulation process before restart.
The local ledger had 23,617 matches, with no duplicate IDs or seed-side keys. Heatmap IDs were also unique.
No data cleanup was necessary. Audit evidence: `artifacts/touch-a/ledger-audit-before-resume.json`.

The user paused all work, then authorized resume without source changes.
The second process check found no orphan arena, simulation, or browser process.
The saved ledger then had 23,658 matches, with zero duplicate IDs or seed-side keys.
The resumed job reused plain 1v1, aerial 1v1, and plain 2v2 without adding matches to those cells.
It completed only the three empty cells and the reduced ladders.

The final audit found 23,892 matches and 15,300 heatmaps. Match IDs, seed-side keys, and heatmap IDs were unique.
No cleanup or deduplication was needed. No duplicate matches count as independent evidence.
Final audit evidence: `artifacts/touch-a/ledger-audit-final.json`.

Reuse all final-source set pieces, holdouts, Rust tests, and parity. Do not repeat builds or tune the source.
Reuse the accepted 141-pair plain 1v1 result. Complete only the saved aerial 1v1 half-pair.
Collect 20 pairs in each remaining empty challenge cell. Collect one paired seed against the full field at each size.
Report limited samples and unproved guards. Do not claim a track win from them.

## Final guard summary

| Guard | Result |
| --- | --- |
| All normal credit, plain and aerial | Passed |
| Debug and release modular tests | Passed, 9 tests each |
| WASM build and both custom parity checks | Passed; `difference: null` |
| Plain 1v1 challenge | Passed |
| Five remaining challenge guards | Unproved; reduced samples |
| Plain 2v2 ladder point estimate | Failed |
| Other ladder point estimates | Above baseline; limited evidence |

The resumed evidence job finished in about 17 minutes. All source stayed fixed.
No build, test, parity, public suite, holdout, or browser watch was repeated after resume.
No extra certification work is planned. The entry is rejected for track selection, not declared a winner.
