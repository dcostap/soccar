# Blocking A

## Verdict

**Rejected for track selection. Not certified.** Plain 2v2 ladder Elo is 1484 versus modular's 1492.
Several challenges remain undecided. The small field samples do not prove the match gates.
Aerial combination ranks well, but this does not remove the plain variant's failed gate.

Branch: `hackathon/blocking-a`.
Base: `201fe7b35ebfb7162f5e97fec934609db4dce473`.
All evidence stays on that base. No newer main source, scenarios, or results were copied.
Normal scenario count: **2,627**.

## Idea, claim, and release

Meet a low direct shot from the goal side. Do not aim a counter-shot at the far goal.

The skill checks role, mode, team count, and general ball physics. It uses `s.d` on both sides.
It claims upright, grounded cars in Save, Intercept, Strike, or Position modes. It excludes kickoffs.
On larger teams, only Attack or Goalie roles qualify. The ball must predict an own goal within three seconds.
The ball must stay below 180 units and move toward the own goal faster than 300 units/second.
The car must remain at least 60 units goal-side of the ball. The ball must be over 1,000 units downfield.
It chooses the first reachable low slice within 1.5 seconds, with a 70-unit goal-side contact offset.
It controls arrival speed with distance divided by arrival time. It releases when any claim condition fails.

Settings: none. Per-car state: none. No clocks, random generator, or shared mutable state.
No helper source outside the frozen core. The skill source is included in its registry fingerprint.
Started from `skills/template.rs`. Frozen files and other brains remain unchanged.

| Brain | Fingerprint |
|---|---|
| modular | `47dbdcf72f0cd13f` |
| modular-blocking-a | `7b7d4d4c952644b4` |
| modular-aerial-a | `483540faca92b026` |
| modular-blocking-a-aerial | `c12d35a7ee04b928` |

Source: `simulation/src/brains/modular/skills/blocking_a.rs`.
Source stayed unchanged after the first public trial. Final evidence uses these fingerprints.

## Public target

All target cases are defense cases. Their pass rate equals their mean credit.

| Suite | n | modular pass | blocking pass | aerial pass | blocking+aerial pass |
|---|---:|---:|---:|---:|---:|
| saves | 13 | 77% | 77% | 92% | 92% |
| gen-saves | 40 | 68% | 70% | 78% | 80% |
| defense-v2-ground | 216 | 93% | 96% | 94% | 96% |
| defense-v2-rival-front | 216 | 55% | 57% | 81% | 83% |
| defense-v2-rival-cut | 216 | 72% | 69% | 90% | 88% |
| Exact passes | 701 | 511 | 519 | 615 | 621 |
| Total pass | 701 | 72.90% | 74.04% | 87.73% | 88.59% |
| Mean credit | 701 | 0.72896 | 0.74037 | 0.87732 | 0.88588 |

## Development holdouts

These are development seeds, not judging seeds. No holdout scenario was written to disk.
All cases are defense cases; pass percentage equals mean credit times 100.
Defense target contains ground, rival-front, and rival-cut, with 100 cases per suite per seed.

| Family | seed | n | modular credit | blocking credit | aerial credit | blocking+aerial credit |
|---|---:|---:|---:|---:|---:|---:|
| holdout-saves | 48173 | 100 | 0.590 | 0.620 | 0.690 | 0.740 |
| holdout-saves | 92147 | 100 | 0.580 | 0.570 | 0.760 | 0.750 |
| holdout-saves | 61339 | 100 | 0.630 | 0.660 | 0.770 | 0.780 |
| defense target | 48173 | 300 | 0.667 | 0.667 | 0.883 | 0.880 |
| defense target | 92147 | 300 | 0.707 | 0.733 | 0.857 | 0.883 |
| defense target | 61339 | 300 | 0.690 | 0.703 | 0.867 | 0.880 |
| saves aggregate | all three | 300 | 0.6000 | 0.6167 | 0.7400 | 0.7567 |
| defense aggregate | all three | 900 | 0.6878 | 0.7011 | 0.8689 | 0.8811 |

Aggregate passes: saves 180/185/222/227; defense 619/631/782/793, in the same column order.
The gain is small. One saves seed and one aerial defense seed regress.

## All-normal credit guard

All 2,627 normal cases ran. No regression baseline was recorded.

| Measure | modular | blocking | aerial | blocking+aerial |
|---|---:|---:|---:|---:|
| Pass count | 918 | 954 | 1927 | 1961 |
| Pass rate | 34.94% | 36.32% | 73.35% | 74.65% |
| Total credit | 946.66773 | 982.66773 | 1952.52818 | 1986.52818 |
| Mean credit | 0.36036 | 0.37406 | 0.74325 | 0.75620 |

Attack: n=253, rounded passes 52%/52%/56%/56%.
Defense: n=2374, rounded passes 33%/35%/75%/77%.
Total credit did not fall for either variant. Individual rival-cut and side-wall cases regress.

## Paired matches and team brain time

All matches use the default five-minute duration. No shortened matches ran.
Win rates and timings below use complete side-swapped pairs with the final fingerprints.
Duplicate records and unmatched halves do not count in this table.
Timings are team `brainMs` per match, not elapsed job time. Shared-machine timings are noisy.

| Variant | size | pairs / matches | wins–losses | win rate | verdict and Elo interval | entry ms/match | baseline ms/match |
|---|---:|---:|---:|---:|---|---:|---:|
| Plain | 1 | 87 / 174 | 93–81 | 53.45% | H1 accepted, +24 [-0,+49] | 223.69 | 203.50 |
| Plain | 2 | 100 / 200 | 101–99 | 50.50% | Undecided, +3 [-37,+44] | 507.04 | 463.86 |
| Plain | 3 | 30 / 60 | 33–27 | 55.00% | Undecided, +35 [-40,+113] | 235.50 | 217.79 |
| Aerial | 1 | 50 / 100 | 54–46 | 54.00% | H1 accepted, +28 [+2,+54] | 3773.25 | 4049.57 |
| Aerial | 2 | 30 / 60 | 35–25 | 58.33% | Undecided, +58 [-7,+128] | 10086.23 | 10444.62 |
| Aerial | 3 | 20 / 40 | 20–20 | 50.00% | Undecided, 0 [-99,+99] | 6608.70 | 6421.23 |

The test compares H0=-15 Elo with H1=0 Elo. Accepted 1v1 verdicts stopped before their original caps.
Other rows are reduced assessments, not completed 300-pair guard tests. No undecided row proves a pass.
Matches ran during development, starting with plain 3v3, before the holdouts and final field assessment.

## Full-field ladder assessment

Ran all 12 current brains at each size with `--pairs 1 --threads 1`.
Reused baseline pairings and larger saved challenges. Each ladder added 38 matches.
Field coverage is complete at one seed, but sample depth is limited. Ratings use all current logged matches.
Games include any saved unmatched half; the paired table above excludes such halves.
The observed plain 2v2 deficit is a failed ladder gate, not a claim of a statistically proven loss.

| Variant | size | entry Elo ±95% | rank | n games | baseline Elo ±95% | rank | n games | entry / baseline team ms/match |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Plain | 1 | 986 ±49 | 9 | 194 | 967 ±37 | 10 | 356 | 214 / 158 |
| Plain | 2 | 1484 ±46 | 7 | 220 | 1492 ±37 | 6 | 382 | 479 / 331 |
| Plain | 3 | 1915 ±80 | 4 | 80 | 1888 ±54 | 7 | 242 | 248 / 265 |
| Aerial | 1 | 1059 ±62 | 4 | 121 | 1035 ±41 | 7 | 283 | 3691 / 3770 |
| Aerial | 2 | 1712 ±81 | 1 | 80 | 1656 ±53 | 3 | 242 | 8480 / 5745 |
| Aerial | 3 | 2146 ±97 | 1 | 60 | 2127 ±63 | 2 | 222 | 5923 / 5513 |

Ladder CPU averages use different opponent mixes. The paired table gives a closer baseline comparison.
Rank 1 from these small samples does not establish a winner.

## Tests and parity

- Debug modular tests: 9 passed, 0 failed.
- Release modular tests: 9 passed, 0 failed.
- WASM build passed.
- Plain native/WASM custom-brain parity: `difference:null`.
- Aerial combination native/WASM custom-brain parity: `difference:null`.
- Core, scenarios, generators, judge, scripted, strike, and other brains stayed unchanged.

These checks ran once for the final source. They were not repeated after the resource update.

## Browser observations

Used rebuilt WASM, private port 5183, and a separate Playwright Chrome process.
Viewed rendered goal sequences from own matches 23322, 23321, and 23305, not statistics alone.

- Match 23322: orange blocking lost 2–5. Near the second conceded goal, the followed orange car was on the goal wall.
- Match 23321: blue blocking won 6–0. The followed attacker reached the rival goal and continued onto its wall.
- Match 23305: blue blocking lost 3–4 in overtime. The first conceded goal view showed a close car collision.
- Public failure `defense-v2-rival-cut/left-impact-fast-far-post-001`: the browser confirmed the logged concession.

These short views do not prove that the skill caused each event. They show remaining wall and contact limits.
Captured diagnostics: zero page errors, console errors, and failed requests.
Evidence: `arena/results/blocking-a-watch/observed.json` and screenshots in that directory.

## Known limits and desired core change

Public rival-cut credit falls. Some holdout samples also fall slightly.
The skill excludes airborne cars, wall cars, high shots, and upfield chase-back starts.
A useful core change would expose measured ground contact time, including turns and reverse motion.
No core change was implemented. No further tuning followed the economical finish request.

## Resource plan and local data cleanup

The user replaced exhaustive caps and ten-seed ladders with this economical assessment.
Reused public suites, three holdout seeds, normal totals, debug/release tests, WASM, parity, and browser views.
Reused larger saved challenge samples. Filled only the empty aerial 3v3 cell with 20 paired seeds.
Ran one-seed full-field ladders at all sizes. Did not expand uncertain cells or claim certification.
Later commands used one worker and one build job. No source change retired the evidence.

Windows shell termination left the old two-worker Rust child alive. The parent stopped old PID 47284.
The old and resumed jobs overlapped briefly. The audit found five duplicate seed-side keys and duplicate IDs.
Each duplicate had the same deterministic score and tick count. No malformed record or result conflict occurred.
Stopped resumed Rust PID 8376 and checked `Get-CimInstance Win32_Process` before cleanup and restart.
Kept the first match per `(fingerprints, seed, size, duration, side)` key. Removed duplicate heatmaps by ID.
Removed five duplicate match rows and five duplicate heatmap rows from ignored local logs.
No source file changed. No duplicate match counts as independent evidence.
Backups: `arena/results/blocking-a-{matches,heatmaps}-before-cleanup.jsonl`.
Notes: `arena/results/blocking-a-ledger-audit.json`, `blocking-a-cleanup.json`.
Final audit: zero duplicate IDs, zero duplicate keys, zero malformed records.

## Commands and evidence

Setup: `npm ci`; `cp -r C:/Projects/webdev/soccar/arena/results arena/`.
Started with `cp simulation/src/brains/modular/skills/template.rs simulation/src/brains/modular/skills/blocking_a.rs`.

Earlier completed evidence used `CARGO_BUILD_JOBS=2`, `--threads 2`, and Rust `--test-threads=2`.
The later resource update changed these limits to one. No completed check needed to run again.
The following commands record the earlier evidence exactly:

```sh
CARGO_BUILD_JOBS=2 npm run arena -- setpieces modular modular-blocking-a modular-aerial-a modular-blocking-a-aerial --suite saves,gen-saves,defense-v2-ground,defense-v2-rival-front,defense-v2-rival-cut --threads 2
CARGO_BUILD_JOBS=2 npm run arena -- setpieces modular modular-blocking-a modular-aerial-a modular-blocking-a-aerial --threads 2
# Ran both commands for each seed: 48173, 92147, 61339.
CARGO_BUILD_JOBS=2 npm run arena -- setpieces modular modular-blocking-a modular-aerial-a modular-blocking-a-aerial --holdout 48173 --count 100 --suite holdout-saves --threads 2
CARGO_BUILD_JOBS=2 npm run arena -- setpieces modular modular-blocking-a modular-aerial-a modular-blocking-a-aerial --defense --holdout 48173 --count 100 --suite defense-v2-ground,defense-v2-rival-front,defense-v2-rival-cut --threads 2
CARGO_BUILD_JOBS=2 cargo test --manifest-path simulation/Cargo.toml --test modular -- --test-threads=2
CARGO_BUILD_JOBS=2 cargo test --release --manifest-path simulation/Cargo.toml --test modular -- --test-threads=2
CARGO_BUILD_JOBS=2 npm run build:wasm
CARGO_BUILD_JOBS=2 node scripts/check-simulation.mjs --brains arena/brains/modular-blocking-a.brain arena/brains/modular.brain --threads 2
CARGO_BUILD_JOBS=2 node scripts/check-simulation.mjs --brains arena/brains/modular-blocking-a-aerial.brain arena/brains/modular-aerial-a.brain --threads 2
```

Final economical commands:

```sh
CARGO_BUILD_JOBS=1 npm run arena -- challenge modular-blocking-a-aerial modular-aerial-a --size 3 --elo0 -15 --elo1 0 --max-pairs 20 --threads 1
for n in 1 2 3; do CARGO_BUILD_JOBS=1 npm run arena -- ladder --size "$n" --pairs 1 --threads 1; done
CARGO_BUILD_JOBS=1 npm run arena -- list --threads 1
# Reused saved matches only; caps matched complete saved pairs.
for spec in 'modular-blocking-a modular 1 87' 'modular-blocking-a modular 2 100' 'modular-blocking-a modular 3 30' 'modular-blocking-a-aerial modular-aerial-a 1 50' 'modular-blocking-a-aerial modular-aerial-a 2 30' 'modular-blocking-a-aerial modular-aerial-a 3 20'; do
  read -r brain base size cap <<< "$spec"
  CARGO_BUILD_JOBS=1 npm run arena -- challenge "$brain" "$base" --size "$size" --elo0 -15 --elo1 0 --max-pairs "$cap" --threads 1
done
npx vite --host 127.0.0.1 --port 5183 --strictPort
```

Failure inspection used `setpieces show defense-v2-rival-cut --brain modular-blocking-a` and the named failure above.
Match inspection used `show 23322`, `show 23321`, and `show 23305`. Earlier commands used `--threads 2`.

Stable local evidence:

- Raw: `arena/results/matches.jsonl`, `heatmaps.jsonl`, `setpieces.jsonl`.
- Normal: `arena/results/blocking-a-normal.txt`.
- Holdouts: `arena/results/blocking-a-holdout-{saves,defense}-<seed>.txt`.
- Checks: `arena/results/blocking-a-{debug,release,wasm,parity,aerial-parity}.txt`.
- Challenges: `arena/results/blocking-a-reused-verdict-<brain>-<size>.txt`.
- Field: `arena/results/blocking-a-assessment-ladder-<size>.txt`.
- Final fingerprints: `arena/results/blocking-a-final-fingerprints.txt`.
- Exact aggregate counts and paired CPU samples: `arena/results/blocking-a-summary.json`.

Blocking source, registry additions, two brain settings files, and this report are the only committed files.
