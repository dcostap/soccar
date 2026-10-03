# Scramble A: limited assessment

**Decision: reject this entry for certification. It does not win the track.**

Plain 2v2 and aerial 1v1 fall below their baseline ladder Elo.
All six paired challenges remain undecided. The field samples are small.
Set-piece credit improves, but this does not establish a match gain.

Branch: `hackathon/scramble-a`. Base: `201fe7b35ebfb7162f5e97fec934609db4dce473`.
No rebase, merge, baseline recording, scenario edit, or frozen-core edit occurred.
One skill version produced all final evidence. No tuning followed the first public run.

## Idea and claim

Source: `simulation/src/brains/modular/skills/scramble_a.rs`.
The skill follows the template's Skill interface. Its clearance controller is stateless.
It tries to clear a low contested ball sideways when a direct touch points into the own goal mouth.
It uses `drive_to` and `own_goal_touch` from the frozen toolkit.
The source contains no other helpers. Its registry entry fingerprints the complete skill file.

The skill takes a car only when all these conditions hold:

- Team count is 1–3; role is Attack or Goalie.
- Mode is Strike, Intercept, or Save; this is not kickoff.
- The car is grounded and upright (`up.z >= 0.8`).
- The ball is in the own box (`upfield <= -2800`), below 160, and slower than 900.
- The car is within 1100 of the ball. A rival is within the configured radius.
- No teammate is closer to the ball by more than 150.
- A direct touch could enter the own goal mouth.

The target sits 110 behind a sideways clearance direction, with a short 0.12-second ball projection.
The controller selects speed from target distance, between 650 and 1600.
Every tick checks the same conditions. The skill releases the car immediately when a condition fails.
It stores no changing per-car state, so no trace fields are needed.
It uses team direction and general physics. It reads no scenario name, clock, or random generator.

Setting: `scramble-a.radius = 1700`, the maximum rival distance from the ball.
Both brain files keep every core setting at its default.

| Brain | Final fingerprint |
|---|---|
| modular | `47dbdcf72f0cd13f` |
| modular-scramble-a | `cdf535883296eac9` |
| modular-aerial-a | `483540faca92b026` |
| modular-scramble-a-aerial | `cc01e8e03e48c5a9` |

## Public and normal set pieces

Each cell shows pass percentage and mean credit.

| Suite | n | modular | scramble | aerial-a | scramble + aerial-a |
|---|---:|---:|---:|---:|---:|
| gen-scrambles | 40 | 67.50%; .675000 | 75.00%; .750000 | 70.00%; .700000 | 77.50%; .775000 |
| mined-goals | 115 | 36.52%; .512586 | 36.52%; .512586 | 42.61%; .560374 | 42.61%; .560374 |
| Both targets | 155 | 44.52%; .554499 | 46.45%; .573854 | 49.68%; .596407 | 51.61%; .615762 |
| ALL normal | 2627 | 34.94%; .360361 | 35.06%; .361503 | 73.35%; .743254 | 73.47%; .744396 |

Normal pass counts are 918, 921, 1927, and 1930.
Target pass counts are 69, 72, 77, and 80.
The plain gains are gen-scrambles/020, /034, and /037. No plain pass becomes a failure.
Mined-goals receives no credit gain. Normal total credit does not decrease in either variant.

Evidence: `artifacts/scramble-a/all-normal.txt`, `metrics.json`, and `arena/results/setpieces.jsonl`.
The metrics file selects the final fingerprints and matching scenario hashes.

## Development holdouts

These seeds are development seeds, not judging seeds.
Each cell again shows pass percentage and credit. Every case is a defense.

| Seed | n | modular | scramble | aerial-a | scramble + aerial-a |
|---|---:|---:|---:|---:|---:|
| 81423 | 200 | 71.00%; .710 | 75.00%; .750 | 72.50%; .725 | 75.50%; .755 |
| 92657 | 200 | 66.50%; .665 | 73.50%; .735 | 71.50%; .715 | 76.00%; .760 |
| 107641 | 200 | 64.00%; .640 | 71.00%; .710 | 69.00%; .690 | 73.00%; .730 |
| Pooled | 600 | 67.17%; .671667 | 73.17%; .731667 | 71.00%; .710000 | 74.83%; .748333 |

Evidence: `artifacts/scramble-a/holdout-81423.txt`, `holdout-92657.txt`, and `holdout-107641.txt`.
The arena keeps generated holdouts in memory. These logs preserve their aggregate results.

## Paired matches

Every match uses the default 300-second duration, with sides swapped for each seed.
Tests use `elo0=-15`, `elo1=0`. No test accepted either hypothesis.

| Size | Variant / baseline | Pairs | Wins–losses | Win % | Paired Elo [95% interval] | Verdict |
|---|---|---:|---:|---:|---|---|
| 1 | plain / modular | 300 | 314–286 | 52.33 | +16 [-7,+40] | Undecided at full cap |
| 1 | aerial / modular-aerial-a | 45 | 44–46 | 48.89 | -8 [-75,+59] | Undecided; limited |
| 2 | plain / modular | 20 | 16–24 | 40.00 | -70 [-190,+34] | Undecided; limited |
| 2 | aerial / modular-aerial-a | 20 | 27–13 | 67.50 | +127 [+22,+261] | Undecided; limited |
| 3 | plain / modular | 20 | 22–18 | 55.00 | +35 [-61,+136] | Undecided; limited |
| 3 | aerial / modular-aerial-a | 20 | 21–19 | 52.50 | +17 [-73,+111] | Undecided; limited |

The plain 3v3 sample ran during development and uses the final source fingerprint.
Plain 1v1 reached LLR 2.47; acceptance needs 2.94.
Saved samples replace new runs. The user stopped exhaustive certification and approved the smaller remaining cells.
No sample proves the match guard rails. The positive 2v2 aerial signal does not make this entry a winner.

Logs under `artifacts/scramble-a/`:

- `challenge-plain-1.txt`, `challenge-aerial-1-limited.txt`
- `challenge-plain-2-limited.txt`, `challenge-aerial-2-resume.txt`
- `development-challenge-3.txt`, `challenge-aerial-3-resume.txt`

## Full-field ladders: limited coverage

Each size adds one paired seed against every current brain.
Each ladder played 38 missing matches and reused the copied baseline pairings.
Ratings use all saved current-fingerprint matches, not just the new seed.
There are 12 brains. Most new field comparisons contain only two matches.
Large intervals and uneven sample sizes prevent a reliable field ranking.

| Size | Variant | Entry Elo ±95% | Rank; games | Baseline Elo ±95% | Rank; games | Point-Elo gate |
|---|---|---:|---|---:|---|---|
| 1 | plain | 992 ±27 | 9; 620 | 975 ±25 | 10; 782 | Above baseline |
| 1 | aerial | 999 ±65 | 8; 110 | 1023 ±42 | 6; 272 | **Fails** |
| 2 | plain | 1441 ±93 | 8; 60 | 1513 ±53 | 5; 222 | **Fails** |
| 2 | aerial | 1823 ±107 | 1; 60 | 1669 ±58 | 2; 222 | Above baseline |
| 3 | plain | 1907 ±94 | 4; 60 | 1884 ±57 | 7; 222 | Above baseline |
| 3 | aerial | 2147 ±98 | 1; 60 | 2112 ±63 | 2; 222 | Above baseline |

Baseline is modular for plain and modular-aerial-a for aerial.
A rank of 1 from this small field sample is not a track win.
Evidence: `artifacts/scramble-a/ladder-1-resume.txt`, `ladder-2-resume.txt`, and `ladder-3-resume.txt`.

## Team brain time

These are mean team `brainMs` per match against the paired baseline, not elapsed job time.
They include overtime and mixed worker limits. They do not isolate controller cost.

| Size | Variant | Matches | Entry brainMs/match | Baseline brainMs/match |
|---|---|---:|---:|---:|
| 1 | plain | 600 | 258.64 | 250.88 |
| 1 | aerial | 90 | 8152.22 | 8646.68 |
| 2 | plain | 40 | 446.31 | 428.48 |
| 2 | aerial | 40 | 4548.36 | 4282.33 |
| 3 | plain | 40 | 223.28 | 215.50 |
| 3 | aerial | 40 | 3290.82 | 3482.19 |

Evidence: `artifacts/scramble-a/metrics.json` and `arena/results/matches.jsonl`.

## Technical guards

- DEBUG modular tests: 9 passed, 0 failed.
- RELEASE modular tests: 9 passed, 0 failed.
- WASM build: passed.
- Plain custom native/WASM parity: PASS, 13 cases, 16,453 states, `difference: null`.
- Aerial custom native/WASM parity: PASS, 13 cases, 16,453 states, `difference: null`.
- ALL normal total credit: nondecreasing for both variants.
- Paired match gates: unproved.
- Ladder gates: plain size2 and aerial size1 fail.

The completed technical checks predate the worker-limit change. Their source is the final committed source.
The user approved reuse. No technical check or WASM build repeated after resume.

Evidence: `rust-debug.txt`, `rust-release.txt`, `build-wasm.txt`, `parity-plain.txt`, and `parity-aerial.txt`.
All paths in this section are under `artifacts/scramble-a/`.

## Watching and public failures

I watched rendered save and conceded-goal sequences from four own matches on private port 5186.
Playwright used a separate Chrome profile and the rebuilt private WASM.
I reviewed before, action, and after screenshots. I did not watch every minute of each match.
These observations describe visible play, not proof that the scramble skill claimed the car.

| Match | Size; variant; final score | Observed sequence |
|---|---|---|
| 23303 | 1; plain blue; loss 3–4 | At overtime +0:35, Car1 flips for a save. It lands near the side wall; the ball stays nearby. |
| 24033 | 2; aerial blue; win 10–8 | At 3:46, Car1 is airborne in a crowded goal mouth. The rival scores despite Car2's saves. |
| 23263 | 3; plain orange; win 3–2 | Car6 saves a high ball near 1:30. Orange cars stay near the mouth; play then moves toward midfield. |
| 24073 | 3; aerial blue; loss 3–4 | An early high-ball save leaves cars airborne or sideways near the goal. At 4:30, Car1 is inside the goal as Car5 scores. |

No watch claim applies to earlier failed page loads.
The private sandbox server required CSS module support. No project infrastructure changed.
The successful run captured no page exceptions or console errors.
Navigation or closure aborted four model requests. The saved frames show the stadium and cars correctly.

Evidence: `watch-final.txt`, `watch-observations.json`, and `watch-<id>-<sequence>-*.png` under `artifacts/scramble-a/`.

`setpieces show` inspected gen-scrambles/007 and mined-goals/m5032-g1-attack with watch links.
In /007, the brain concedes at 2.48 seconds without a touch. The attacker starts upfield of the ball.
In the mined attack, the ball is upfield and too high for this skill. The brain misses with .19 credit.

I also watched /007. Blue retreats beside the rival but does not stop the shot near the post.
The browser ends with “CONCEDED · Replay matches the arena result.”
Evidence: `watch-scenario-final.txt`, `scenario-failure-*.png`, and `scenario-browser-errors.json`.

Evidence: `show-failure.txt` and `show-mined-failure.txt` under `artifacts/scramble-a/`.

## Data and process safety

I installed dependencies with `npm ci` and copied `C:/Projects/webdev/soccar/arena/results` once.
I did not copy newer data after main advanced.
Windows process checks verified no old scramble arena process before each evidence restart.
The stopped one-worker Rust child used PID 37032; I stopped that exact PID before restarting.

Final ledger audit: 24,226 parsed matches; zero duplicate IDs and zero duplicate ordered seed-side keys.
The key contains ordered fingerprints, seed, size, and duration. No data cleanup was necessary.
Duplicate matches did not contribute to any reported sample.
Evidence: `artifacts/scramble-a/ledger-audit.json`.

## Exact commands and reduced plan

The earlier commands used the then-approved two-worker limit:

```sh
npm ci
cp -r /c/Projects/webdev/soccar/arena/results arena/
export CARGO_BUILD_JOBS=2
npm run arena -- setpieces modular modular-scramble-a modular-aerial-a modular-scramble-a-aerial --suite gen-scrambles,mined-goals --threads 2
npm run arena -- setpieces modular modular-scramble-a modular-aerial-a modular-scramble-a-aerial --threads 2
for seed in 81423 92657 107641; do
  npm run arena -- setpieces modular modular-scramble-a modular-aerial-a modular-scramble-a-aerial --holdout "$seed" --suite holdout-scrambles --count 200 --threads 2
done
cargo test --manifest-path simulation/Cargo.toml --test modular -- --test-threads=2
cargo test --release --manifest-path simulation/Cargo.toml --test modular -- --test-threads=2
npm run build:wasm
node scripts/check-simulation.mjs --brains arena/brains/modular-scramble-a.brain arena/brains/modular.brain --threads 2
node scripts/check-simulation.mjs --brains arena/brains/modular-scramble-a-aerial.brain arena/brains/modular-aerial-a.brain --threads 2
npm run arena -- challenge modular-scramble-a modular --size 3 --elo0 -15 --elo1 0 --max-pairs 20 --threads 2
npm run arena -- challenge modular-scramble-a modular --size 1 --elo0 -15 --elo1 0 --max-pairs 300 --threads 2
```

The user then set one worker and approved an economical finish.
Aerial 1v1 stopped after 45 saved pairs. Empty cells used at most 20 paired seeds.
The assessment reused all larger samples and added one field seed per pairing.
One heavy job ran at a time. The final missing matches and ladders took about 12 minutes after resume.
No tuning, extra holdout seed, repeated completed guard, or default-ten-pair field expansion occurred.

```sh
export CARGO_BUILD_JOBS=1
npm run arena -- challenge modular-scramble-a-aerial modular-aerial-a --size 1 --elo0 -15 --elo1 0 --max-pairs 45 --threads 1
npm run arena -- challenge modular-scramble-a modular --size 2 --elo0 -15 --elo1 0 --max-pairs 20 --threads 1
npm run arena -- challenge modular-scramble-a-aerial modular-aerial-a --size 2 --elo0 -15 --elo1 0 --max-pairs 20 --threads 1
npm run arena -- challenge modular-scramble-a-aerial modular-aerial-a --size 3 --elo0 -15 --elo1 0 --max-pairs 20 --threads 1
for n in 1 2 3; do
  npm run arena -- ladder --size "$n" --pairs 1 --threads 1
done
npm run arena -- setpieces show gen-scrambles/007 --brain modular-scramble-a --url http://127.0.0.1:5186 --threads 1
npm run arena -- setpieces show mined-goals/m5032-g1-attack --brain modular-scramble-a --url http://127.0.0.1:5186 --threads 1
```

The persistent arena evidence is ignored local data. It is not part of the commit.
Browser helper scripts stay in `C:/Users/Darius/AppData/Local/Temp/pi-subagents/sa-cc3cf8d2/`.
Screenshots, browser diagnostics, and statistics stay in `artifacts/scramble-a/`.

The watch commands used that sandbox:

```sh
node C:/Users/Darius/AppData/Local/Temp/pi-subagents/sa-cc3cf8d2/server.mjs
node C:/Users/Darius/AppData/Local/Temp/pi-subagents/sa-cc3cf8d2/watch.mjs 23303 24033 23263 24073
node C:/Users/Darius/AppData/Local/Temp/pi-subagents/sa-cc3cf8d2/watch-scenario.mjs
```

The private server and all owned browser processes stopped after these observations.

## Known limits and desired core changes

The skill improves three public scramble cases but does not improve mined-goals.
Its narrow limits leave fast shots, high balls, support cars, and many races to the core.
Side clearances can still fail after a rival collision. They do not guarantee a safe touch.
Plain 2v2 loses the small paired sample. Aerial 1v1 falls below its field baseline.

Desired core changes: none. These results do not justify a frozen-core change.
No further tuning or certification is planned for this entry.
