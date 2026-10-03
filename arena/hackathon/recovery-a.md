# Recovery A

## Result

**Reject this entry for track selection.** Public and holdout recovery improve, but the plain 2v2 ladder loses Elo.
Five paired guards remain unproved under the user's reduced sample plan. This is an assessment, not full certification.

Branch: `hackathon/recovery-a`.
Base: `201fe7b35ebfb7162f5e97fec934609db4dce473`.
All evidence stays on this base. No newer main scenarios or results were copied.

## Idea, claim, hold, and settings

Test short ground routes before the core retreats to the far post.
Each route uses car and ball physics for 300 ticks, or 2.5 seconds.
Accept a route only if it touches the ball and prevents a goal within that horizon.
This does not prove a lasting clear. The route test ignores other cars and boost pads.

Claim only an upright grounded attacker in `Mode::Save`, with at least one team car.
Require a ball below 180 units, moving goalward faster than 500 units per second.
Require a predicted goal threat and a car more than 200 units upfield of the ball.
Search at least 12 ticks apart. Test predicted ball positions at 0.5-second intervals through three seconds.
Try two lateral offsets, each 150 units. Use the standard ground driver.
Use `s.d` for both sides. No scenario names or fixed test positions enter the skill.

Hold until planned contact, loss of ground contact, a high ball, or a slower goalward ball.
Then release or test a new route. Per-car target, deadline, and search tick enter `trace`.
There are no skill settings. Both brains keep default core settings.

Source: `simulation/src/brains/modular/skills/recovery_a.rs`.
SHA-256: `cb69c3effaf4f812c1382672765fec4915330265f3711da7edd5e2789eeb58e1`.
The registry includes this complete file in the source fingerprint. There are no external source helpers.
No frozen core, scenario, generator, judge, baseline, or other brain changed.

| Brain | Final fingerprint |
| --- | --- |
| modular | `47dbdcf72f0cd13f` |
| modular-recovery-a | `50cee244c569597a` |
| modular-aerial-a | `483540faca92b026` |
| modular-recovery-a-aerial | `0a205958d4ef1fd2` |

## Public target

Each cell shows pass percentage and credit. Defense credit equals the pass fraction.

| Suite | n | modular | recovery | aerial | recovery+aerial |
| --- | ---: | --- | --- | --- | --- |
| defense-v3-ground-recovery | 216 | 15.28% / 0.153 | 21.76% / 0.218 | 18.52% / 0.185 | 21.76% / 0.218 |
| gen-chase-back | 40 | 67.5% / 0.675 | 90% / 0.900 | 67.5% / 0.675 | 90% / 0.900 |
| Combined | 256 | 23.44% / 0.234 | 32.42% / 0.324 | 26.17% / 0.262 | 32.42% / 0.324 |

Combined successes: 60 / 83 / 67 / 83, in the table's brain order.

## Development holdouts

Each row has 60 scenarios. Cells show pass percentage and credit.
Ground recovery used its defense suite alone. Chase back used the separate holdout suite.
These are development seeds, not judging seeds.

| Seed | Suite | modular | recovery | aerial | recovery+aerial |
| --- | --- | --- | --- | --- | --- |
| 3187 | ground recovery | 15% / 0.150 | 21.67% / 0.217 | 15% / 0.150 | 21.67% / 0.217 |
| 8291 | ground recovery | 8.33% / 0.083 | 13.33% / 0.133 | 10% / 0.100 | 13.33% / 0.133 |
| 17389 | ground recovery | 10% / 0.100 | 26.67% / 0.267 | 10% / 0.100 | 26.67% / 0.267 |
| 3187 | chase back | 70% / 0.700 | 86.67% / 0.867 | 70% / 0.700 | 86.67% / 0.867 |
| 8291 | chase back | 73.33% / 0.733 | 90% / 0.900 | 73.33% / 0.733 | 90% / 0.900 |
| 17389 | chase back | 85% / 0.850 | 93.33% / 0.933 | 86.67% / 0.867 | 95% / 0.950 |

Across 180 ground cases: successes are 20 / 37 / 21 / 37.
Across 180 chase cases: successes are 137 / 162 / 138 / 163.
Across all 360 cases: credit is 0.4361 / 0.5528 / 0.4417 / 0.5556.
These combined holdouts weight the two suites equally. Public target totals use a different suite mix.

## All normal totals

All **2,627** normal scenarios use the final source and the fixed base.

| Brain | Passes | Pass % | Mean credit |
| --- | ---: | ---: | ---: |
| modular | 918 | 34.9% | 0.360 |
| recovery | 945 | 36.0% | 0.371 |
| aerial | 1927 | 73.4% | 0.743 |
| recovery+aerial | 1946 | 74.1% | 0.750 |

Total credit does not decrease for either variant. Attack results are unchanged.
Some individual defense cases regress. The aggregate credit guard does not require every case to improve.
`normal.txt` contains all 22 suite rows and coverage groups.

## Paired matches

All matches use the default five-minute duration. Each seed plays both sides.
Only unique final-fingerprint seed-side records count. The thresholds are `elo0=-15`, `elo1=0`.

| Size | Variant | Pairs / matches | Wins | Win % | Paired Elo | Verdict |
| ---: | --- | ---: | ---: | ---: | ---: | --- |
| 1 | plain vs modular | 45 / 90 | 47 | 52.22% | +15.5 | Accepted stronger; stopped early |
| 1 | aerial vs aerial | 55 / 110 | 60 | 54.55% | +31.7 | Undecided; saved reduced sample |
| 2 | plain vs modular | 20 / 40 | 20 | 50% | 0.0 | Undecided; reduced cap |
| 2 | aerial vs aerial | 20 / 40 | 21 | 52.5% | +17.4 | Undecided; reduced cap |
| 3 | plain vs modular | 20 / 40 | 22 | 55% | +34.9 | Undecided; reduced cap |
| 3 | aerial vs aerial | 20 / 40 | 23 | 57.5% | +52.5 | Undecided; reduced cap |

The plain 1v1 final command had the original 300-pair cap and reused its accepted result.
The other guards do not establish the required statistical verdict. Do not treat them as passes.

## Field ladders

The final commands cover all 12 field brains at each size with `--pairs 1`.
They reuse baseline pairings and larger saved challenge samples. Each command adds 38 matches.
This is complete opponent coverage at one paired seed, not the original ten-pair ladder sample.
Ratings use the clean ledger and current fingerprints only. `n` counts all matches in that rating fit.

| Size | Brain | Elo | Rank / 12 | n | Elo vs relevant baseline |
| ---: | --- | ---: | ---: | ---: | ---: |
| 1 | modular | 966.7 | 10 | 272 | — |
| 1 | recovery | 973.9 | 9 | 110 | +7.2 |
| 1 | aerial | 1025.0 | 7 | 292 | — |
| 1 | recovery+aerial | 1041.0 | 6 | 130 | +16.0 |
| 2 | modular | 1500.1 | 6 | 222 | — |
| 2 | recovery | 1466.6 | 8 | 60 | **−33.5: fails** |
| 2 | aerial | 1664.2 | 2 | 222 | — |
| 2 | recovery+aerial | 1699.0 | 1 | 60 | +34.8 |
| 3 | modular | 1874.3 | 6 | 222 | — |
| 3 | recovery | 1874.2 | 7 | 60 | **−0.1: below baseline** |
| 3 | aerial | 2109.3 | 3 | 222 | — |
| 3 | recovery+aerial | 2158.1 | 1 | 60 | +48.8 |

Small samples give wide rating intervals. The high aerial ranks do not certify a track win.
The plain variant fails the measured nondecrease condition at sizes 2 and 3.

## Brain cost

These are mean **team `brainMs` per match**, not elapsed job time.
The table compares both teams within the same paired matches.
Earlier samples ran under shared two-worker load. Later samples used one worker.
Do not treat these mixed-load measurements as a controlled speed benchmark.

| Size | Variant | n matches | Entry ms/match | Baseline ms/match |
| ---: | --- | ---: | ---: | ---: |
| 1 | plain | 90 | 321.3 | 209.5 |
| 1 | aerial | 110 | 7989.0 | 8316.1 |
| 2 | plain | 40 | 541.2 | 419.9 |
| 2 | aerial | 40 | 4336.0 | 4393.4 |
| 3 | plain | 40 | 299.1 | 261.7 |
| 3 | aerial | 40 | 4245.3 | 4348.2 |

Whole-field entry means: plain 300.7 / 440.7 / 278.5 ms at sizes 1 / 2 / 3.
Whole-field aerial entry means: 7258.2 / 4062.0 / 4004.3 ms, with n=130 / 60 / 60.
The plain whole-field sample counts are 110 / 60 / 60.
Full field and paired statistics are in `summary.json` and `ladder-{1,2,3}.json`.

## Tests, parity, and watching

- Debug modular tests: all 9 passed.
- Release modular tests: all 9 passed.
- WASM rebuilt from final source.
- Plain custom-brain parity: PASS, 13 cases, 16,453 states, `difference: null`.
- Aerial custom-brain parity: PASS, 13 cases, 16,453 states, `difference: null`.
- No regression baseline was recorded or changed.

Used Playwright Chrome with a private profile and the worktree server on port 5182.
Watched opening and highlight segments, not complete matches. Inspected the rendered screenshots.
The three selected matches use final fingerprints. Browser diagnostics captured no errors or failed requests.

| Match | Size and entry side | Observations |
| --- | --- | --- |
| 23412 | 1v1, plain blue; logged 5–6 | Blue boosted toward a low ball in the orange goal area. Later blue was airborne after taking a 2–0 lead. |
| 23602 | 2v2, aerial orange; logged 4–10 | An orange car used the side wall while another stayed near the ball. Later an orange car remained at its goal. |
| 23682 | 3v3, aerial orange; logged 7–1 | Orange scored early. Later two blue cars crowded a raised ball beside an airborne orange car near the side wall. |

These observations do not prove that the new skill caused a play or that the full replay score matches.
Also watched `defense-v3-ground-recovery/left-lead-in-midfield-001` after studying `setpieces show`.
The zero-boost defender starts far from its own box. The replay ends in a concession.
The browser states “Replay matches the arena result.” Screenshots preserve this failed case.

The first private Vite server stopped responding after arena exports. Its process was stopped and restarted.
The successful browser run used the restarted server and the same rebuilt WASM. No source rebuild was needed.

## Reduced plan and log cleanup

Development stopped once physics-checked routes improved the target and holdouts.
An earlier direct route lost credit. A reverse-only design gave no measured gain.
The final source stayed fixed during every reported test.

The user changed the CPU limit from two workers to one, then requested an economical finish.
After that update, new commands used `CARGO_BUILD_JOBS=1` and `--threads 1`.
Completed suites, holdouts, Rust tests, builds, and parity were not repeated.
Saved final-fingerprint matches were reused. Empty challenge cells used 20 paired seeds.
Final field ladders used one paired seed. No undecided sample was expanded for certification.
Only one heavy evidence job ran at a time, except the brief Windows child-process overlap below.
The economical native job took 28 minutes. Total work took about 82 minutes, including setup and browser work.

Windows shell termination left an old two-worker Rust child alive during the one-worker restart.
The orchestrator stopped the old child. The agent verified the remaining process by exact path and PID.
Before the economical restart, the agent stopped PID 41632 and verified an empty arena process tree.
The overlap wrote ten duplicate seed-side matches for aerial 1v1 seeds 51–55.
Cleanup kept one record per ordered fingerprint pair, seed, size, and duration.
All duplicate scores, completion states, live times, and tick counts were identical.
Cleanup removed twenty ambiguous heatmap records. Backups preserve the original ignored logs.
Final audit: 23,796 records, zero duplicate IDs or match keys.
Final ratings and sample counts use the clean ledger. Duplicates do not count as independent evidence.

## Known failures and desired core changes

Zero-boost public ground recovery falls from 3.7% to 1.9% over 54 cases.
Wrong-side public recovery falls from 22.2% to 19.4% without aerials over 36 cases.
With aerials, that group falls from 30.6% to 19.4%.
The short route horizon can accept a touch that only delays a later goal.
Other cars can invalidate the route. A held route does not track every change to the ball path.
Plain 2v2 field play loses measured Elo. No further tuning was attempted.

A core route-test API could share exact step code and bound its cost.
It could test the ball after contact for longer and include nearby cars.
These are desired changes only. No core change was made.

## Commands and stable evidence

Evidence root: `arena/results/recovery-a-evidence/` (ignored).
Raw logs: `arena/results/matches.jsonl`, `arena/results/setpieces.jsonl`.
Key files: `public.txt`, `holdout-{ground,chase}-{3187,8291,17389}.txt`, `normal.txt`,
`challenge-plain-{1,2,3}.txt`, `challenge-aerial-1-clean.txt`, `challenge-aerial-{2,3}.txt`,
`ladder-{1,2,3}.{txt,json}`, `summary.json`, `fingerprints.txt`,
`test-{debug,release}.txt`, `build-wasm.txt`, `parity-{plain,aerial}.{txt,json}`,
`data-cleanup.json`, `matches-before-cleanup-*.jsonl`, `heatmaps-before-cleanup-*.jsonl`,
`failures.txt`, `failure-watch-link.txt`, `watch.json`, `watch-*.png`.
The evidence folder also keeps the watch, cleanup, and summary scripts.

Setup and final-source checks before the CPU update:

```sh
npm ci
cp -r /c/Projects/webdev/soccar/arena/results arena/
export CARGO_BUILD_JOBS=2
npm run arena -- setpieces modular modular-recovery-a modular-aerial-a modular-recovery-a-aerial --suite defense-v3-ground-recovery,gen-chase-back --threads 2
for seed in 3187 8291 17389; do
  npm run arena -- setpieces modular modular-recovery-a modular-aerial-a modular-recovery-a-aerial --defense --holdout $seed --suite defense-v3-ground-recovery --count 60 --threads 2
  npm run arena -- setpieces modular modular-recovery-a modular-aerial-a modular-recovery-a-aerial --holdout $seed --suite holdout-chase-back --count 60 --threads 2
done
npm run arena -- setpieces modular modular-recovery-a modular-aerial-a modular-recovery-a-aerial --threads 2
cargo test --manifest-path simulation/Cargo.toml --test modular -- --test-threads=2
cargo test --release --manifest-path simulation/Cargo.toml --test modular -- --test-threads=2
npm run build:wasm
node scripts/check-simulation.mjs --brains arena/brains/modular-recovery-a.brain arena/brains/modular.brain --threads 2
node scripts/check-simulation.mjs --brains arena/brains/modular-recovery-a-aerial.brain arena/brains/modular-aerial-a.brain --threads 2
npm run arena -- challenge modular-recovery-a modular --size 1 --elo0 -15 --elo1 0 --max-pairs 300 --threads 2
```

Economical final evidence after process cleanup:

```sh
export CARGO_BUILD_JOBS=1
node arena/results/recovery-a-evidence/clean-ledger.mjs
npm run arena -- challenge modular-recovery-a-aerial modular-aerial-a --size 1 --elo0 -15 --elo1 0 --max-pairs 55 --threads 1
for size in 2 3; do
  npm run arena -- challenge modular-recovery-a modular --size $size --elo0 -15 --elo1 0 --max-pairs 20 --threads 1
  npm run arena -- challenge modular-recovery-a-aerial modular-aerial-a --size $size --elo0 -15 --elo1 0 --max-pairs 20 --threads 1
done
for size in 1 2 3; do
  npm run arena -- ladder --size $size --pairs 1 --threads 1
  cp public/arena/arena.json arena/results/recovery-a-evidence/ladder-$size.json
done
npm run arena -- list --threads 1
node arena/results/recovery-a-evidence/summary.mjs
npm run arena -- setpieces show defense-v3-ground-recovery --brain modular-recovery-a --threads 1
npm run arena -- setpieces show defense-v3-ground-recovery/left-lead-in-midfield-001 --brain modular-recovery-a --url http://127.0.0.1:5182 --threads 1
node node_modules/vite/bin/vite.js --host 127.0.0.1 --port 5182 --strictPort
node arena/results/recovery-a-evidence/watch.mjs
```
