# Add a set piece from your game

## Save and select a moment

1. Play a match. The game records resolved controls at each simulation tick.
2. Select **Game history**, or select **Watch last game**.
3. Select **Save replay** for a portable file. Select **Open file** to open one.
4. Pause the replay. Move the timeline to a live-play moment.
5. Select **Create set piece**, or press **C**. **Shift+C** selects defense.
6. Answer **Which car should the brain control?** This is one car, not one team.
7. Select the objective, timeout, and controls for all other cars.
8. Add a short test name and a description.
9. Select **Preview** to test a brain. **Back to moment** restores the source replay.
10. Select **Download set piece**. Give this file to the contribution agent.

The game keeps every match in **Game history** on this device.
It creates a record after play starts and updates active matches once per minute.
It saves the final recording when the match ends or you leave it.
Starting another match does not replace an earlier recording.
You can watch, download, or delete each stored game.
The recording limit is 25 minutes of simulation ticks. A file saved earlier ends at that point.
Clearing site data removes the local history. Browser storage can also become full or fail.
**Save replay** downloads a portable recording from the current tab.

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

Read the file header first. Confirm the selected car before discussing the team.
Ask **Which car should the brain control?** if the selection is missing or unclear.
Do not infer the car from its team. Do not replace every car on that team.
Ask for any missing objective, timeout, or description. Do not invent these details.
If the user wants another car, ask them to export that car from the source replay.

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
