# Player replay history

This document defines local player replay storage and the data available for future mining.
Read it before changing replay storage, playback, or player-moment extraction.

## Purpose

The browser keeps every player match for later review.
A future miner can extract human goals, saves, shots, and useful set-piece moments.
Do not reduce stored data to summaries. Exact replay is the source record.

## Storage

`src/replay-files.js` owns the IndexedDB database.
`src/arena-replays.js` owns the visible replay library.
The game page records in the background and does not show a replay toolbar.

- Database: `soccar-replays`
- Current database version: 3
- `replays` store: full replay records, keyed by `game:<uuid>`
- `history` store: small list metadata, keyed by the same ID
- `replays/latest`: ID of the newest updated replay

The separate metadata store keeps the Arena **Replays** view fast with many large recordings.
The application does not remove old games automatically.
The user can watch, download, or delete one game from the Arena **Replays** view.
The Arena can also import portable replay and set-piece files.

Storage belongs to one browser profile and one web origin.
The scheme, host, and port are part of the origin.
A different development port has a different replay history.
The application does not upload or synchronize recordings.
Clearing site data removes them.
The application requests persistent browser storage, but the browser can refuse or exhaust its quota.

The game creates a record after match play starts.
It replaces that game's record after each 30 simulation seconds.
It also saves after a score change, when paused, and when the page becomes hidden.
It writes the final available recording when the match ends or another game mode starts.
Starting another match creates another ID. It does not replace an earlier game.

Database upgrades preserve the old version-one `latest` recording.
Version-two records gain entries in the metadata store.
Keep these migrations when changing the database version.

## Replay record

`simulation/src/recording.rs` defines the portable replay format.
A full record contains:

- `format`: recording format version
- `engine`: exact simulation fingerprint
- `initial`: complete initial `Game`
- `frames`: resolved controls and replay commands for each simulation tick

`initial.player` identifies the human-controlled car.
`initial.world` contains every car, the ball, pads, and physical state.
Each frame contains controls for every physical car.
It also stores unlimited boost, dodge deadzone, and replay-skip input.

The history metadata includes the local ID, dates, filename, tick count, score, team size, and skill.
Metadata helps users find a game. Do not use it as the source for mining.
Load the full replay record before analysis.

The recorder stores at most 180,000 ticks, which is 25 simulation minutes.
The portable text limit is 96 MiB.
A recording stops growing at either limit.
Document any future limit change.

## Exact playback

A replay stores inputs, not one complete state for each tick.
The matching simulation reconstructs every state and event exactly.
Use `Replay::parse` and `Replay::start`, or the matching WASM replay functions.
Do not approximate physics in JavaScript.

The engine fingerprint covers physics and state behavior.
Normal playback rejects another engine version.
Keep the Git commit that produced stored recordings.
An older commit can rebuild the matching engine for later mining.
Do not silently accept a fingerprint mismatch.

Run these checks after replay changes:

```sh
npm test
npm run test:recordings
npm run test:replay-browser
npm run test:simulation:full
```

`test:recordings` compares native and WASM state exactly.
`test:replay-browser` checks multiple stored games, reload, older-game playback, and database migration.

## Agent inspection

The user can give an agent a replay reference, approximate time, car, action, and intended test.
The user does not need to find the exact tick or create a set-piece file.
The agent must treat the supplied time as an approximate search anchor.
It must inspect the source replay and independently select the final start tick.
It derives the objective, timeout, name, and other-car behavior when the evidence is clear.
It asks only when the selected car or intended challenge remains ambiguous.

Use the native inspector on a replay downloaded from the Arena:

```sh
npm run replay:inspect -- "path/to/game.soccar-replay.json"
npm run replay:inspect -- "path/to/game.soccar-replay.json" --at 2:14 --window 5 --output report.json
npm run replay:inspect -- arena/results/matches.jsonl --match 19424 --at 48.8 --window 5
```

The first command produces the complete event timeline.
The focused command samples exact physical state every 0.25 seconds around the requested time.
The match form reconstructs a logged Arena match from its seed and brain specifications.
The JSON report includes:

- The replay fingerprint, duration, score, and human car.
- Ball hits, bounces, goals, saves, jumps, flips, bumps, demolitions, pads, and phase changes.
- Per-car score, goal, assist, shot, and save changes.
- Exact ball and car state, controls, boost, grounding, and statistics at each sample.

Use the timeline to find the event.
Then inspect a short window to choose an exact source tick before the action.
Never accept a **C** timestamp as authoritative.
Do not approximate physics or infer events from browser geometry.

## Goal and save mining

The stored format has enough data for deterministic mining.
Use the inspector as the base for bulk candidate extraction.

For each replay:

1. Load the full record from IndexedDB or a portable file.
2. Select the matching simulation engine from its fingerprint.
3. Read `initial.player` to identify the human car.
4. Re-simulate every recorded frame in order.
5. Track changes in `game.stats[player]`.
6. A `goals` increase marks a human goal.
7. A `saves` increase marks the simulation's human save event.
8. Retain tick numbers and a useful lead-up window.
9. Let a user review each candidate before adding a permanent set piece.

The simulation also reports goal, ball-hit, shot, and save events.
Use simulation events and statistics instead of a browser-side geometric guess.
A save is the simulation's current save rule, not proof of an ideal defensive action.
Document any extra mining rule and keep it versioned.

A mined set piece needs state before the event and controls after that state.
Use the existing exact clip export path.
The selected human car becomes the tested car.
Other cars can use recorded controls or one fixed reactive controller.
Follow `CONTRIBUTING-SETPIECES.md` before accepting a mined moment.

Do not add every detected event automatically.
Reject duplicates, idle passes, unclear objectives, and moments without enough recorded tail.
Keep the source replay ID and source tick in any future mining report.
Do not put local replay payloads in Git.
Commit only reviewed set pieces and their required exact clip data.
