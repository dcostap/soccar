# Add a set piece from your game

## Give an agent a moment

1. Play a match. The game records resolved controls at each simulation tick.
2. Open **Replays** in the Arena. Select **Copy reference** for the game.
3. Give the reference and an approximate replay time to the contribution agent.
4. Identify the car and describe the useful action near that time.
5. State the test objective when you know it.

For example:

> At 2:14 in this replay, my car starts a passing play and scores.
> Start about three seconds before my first touch. Test whether the brain can score too.

The time does not need to identify the exact simulation tick.
The agent MUST inspect the full source replay and independently select the exact start.
The **C** time and any user timestamp are approximate anchors only.
The agent derives the objective, timeout, name, and other-car behavior from the replay and description.
The agent asks only when the selected car or intended challenge remains ambiguous.
The user does not need to press **C** or prepare the set-piece file.

Manual creation remains available as a fallback.
Watch the replay, pause at the start, and press **C**.
**Shift+C** selects defense by default.

The game keeps every match in the Arena **Replays** view on this device.
It creates a record after play starts and updates active matches every 30 simulation seconds.
It also saves after a score change, when paused, and when the page becomes hidden.
It saves the final recording when the match ends or you leave it.
Starting another match does not replace an earlier recording.
You can watch, download, or delete each stored game from the Arena.
The recording limit is 25 minutes of simulation ticks. A file saved earlier ends at that point.
Clearing site data removes the local history. Browser storage can also become full or fail.
**Download** in the Arena creates a portable recording.
See [player replay history](PLAYER-REPLAYS.md) for storage, versioning, and agent inspection.

## What the set piece preserves

The file contains the full starting state and the resolved controls for other cars.
It preserves airborne motion, active jumps, wheel contacts, ball spin, and boost-pad cooldowns.
The selected team becomes blue. Car IDs and collision order stay the same.
The tested brain starts with fresh memory and controls only the selected car.

Recorded controls drive physical cars. They do not force cars onto stored positions.
These controls cannot react to changed play. Select **Chase** for a reactive challenge instead.
The same choice applies to all other cars, including teammates.

Recorded controls must cover the timeout and three finishing seconds.
The export fails if the player recording ends too soon. Select an earlier moment or a shorter timeout.
Fixed behavior needs no future inputs. It can continue after the source recording ends.
Arena match replays can also export exact moments. The simulation generates their future controls.

Attack passes when blue scores. Defense passes when blue does not concede.
The existing judge can extend play until the ball lands, for up to three seconds.
The file includes a simulation version. Another physics version cannot silently load it.
Brain changes do not change this version. Physics and state-format changes can change it.

## Contribution agent procedure

Use **Download** in the Arena to obtain the referenced replay from the authorized browser profile.
Run `npm run replay:inspect -- <replay.json>` to list its complete event timeline.
Run it again with `--at <MM:SS> --window 5` to inspect exact state samples near the request.
For an Arena match, use `arena/results/matches.jsonl --match <id>` as the source.
Read `summary.humanCar`; do not infer the player from the team.
Use ball-hit, goal, save, score, phase, and statistic events to locate the action.

Treat the supplied time as an approximate search anchor.
Inspect events and states before and after it.
Select a start before the first action that the tested car must decide.
Do not import a candidate clip directly at its **C** timestamp.
If analysis selects the same tick, record why that tick is the useful decision boundary.

Confirm the selected car before discussing the team.
Ask **Which car should the brain control?** only if the selection is missing or unclear.
Do not infer the car from its team. Do not replace every car on that team.
Infer the objective and timeout from the described challenge and observed outcome.
Generate a short test name from the action.
Use recorded controls by default because they preserve the observed challenge.
Use a reactive controller only when the intended test requires changed reactions.
Ask a follow-up question only when the intended outcome remains ambiguous after replay inspection.

After resolving the request, open the replay at the selected tick and create the exact clip.
Use the inspector's `--extract` options or the browser editor.
Keep the replay ID and source tick in the contribution report.

Check whether the chosen car needs to act. Test idle and the current brain.
An idle pass is a warning. A teammate might already solve the task without the selected car.
For defense, make sure the opponent poses a real threat during the timeout.
If the existing judge cannot express the objective, discuss a new judge before adding the test.

Import the file after these checks:

```sh
npm run arena -- setpieces import "path/to/moment.soccar-setpiece.txt"
```

The command checks the state and version. It prints idle and alphabravo results.
Use `--brain name` to select another current brain.
The command adds the test to `arena/scenarios/user-attack.txt` or `arena/scenarios/user-defend.txt`.
It refuses duplicate names and missing descriptions. It cannot replace an accepted test.
It also exports the arena data for browser watch links.

Run the chosen suite:

```sh
npm run arena -- setpieces alphabravo --suite user-attack
npm run arena -- setpieces alphabravo --suite user-defend
npm run test:recordings
```

Review the preview and the results. Commit the scenario file with its recording data.
Do not commit local result logs. Do not change an accepted test to help a brain pass.
Add a new test for another moment, timeout, objective, or other-car behavior.

## Files and limits

- Replays use `.soccar-replay.json`.
- Set pieces use `.soccar-setpiece.txt`.
- Files stay on this device. The game does not upload them.
- A file can contain at most 96 MiB of text.
- A set piece has a timeout of at most 60 seconds.
- A demolished car cannot be the controlled car.
- Countdown, goal, and goal-replay phases cannot start a set piece.
