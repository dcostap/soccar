# Brain arena

The arena plays bot brains against each other, keeps every result with full statistics, and rates the brains.
Any recorded match can be watched in the game, because a bot match depends only on its seed and brains.

```sh
npm run arena -- ladder                 # play all pairings, print the leaderboard
npm run arena -- challenge my-brain     # does my-brain beat the current best?
npm run dev                             # then open http://127.0.0.1:5173/arena.html
```

## Brains

A brain drives every bot car on one team. It has two parts:

- **Module**: Rust code in `simulation/src/brains/`, listed in `MODULES` in `mod.rs`.
- **Settings**: a `.brain` file in `arena/brains/`. The file name is the brain's name.

```text
# Leading comments are the description on the leaderboard.
module = classic
preset = allstar
aim = 0.7
```

`classic` is the original bot. It accepts `preset` (`rookie`, `pro`, `allstar`) and these overrides:
`speed`, `boost`, `flip`, `aerial`, `reaction`, `instant`, `predict`, `aim`. See `Settings` in `classic.rs`.
Unknown or malformed settings are errors.

### Try a settings change

Add a file such as `arena/brains/allstar-close.brain`, then challenge the original:

```sh
npm run arena -- challenge allstar-close allstar
```

### Try a code change

1. Copy `simulation/src/brains/classic.rs` to `simulation/src/brains/striker.rs`.
2. In `simulation/src/brains/mod.rs`, add `pub mod striker;` and a `MODULES` entry:
   `Module { name: "striker", source: include_str!("striker.rs"), create: striker::create }`.
3. Edit the new module. Add settings with `params.number`, `params.flag`, or `params.text`.
4. Add `arena/brains/striker.brain` with `module = striker`.
5. Run `npm run arena -- challenge striker`.

Keep a version by copying its module or settings file under a new name before you change it.
Brains must be deterministic: no clocks, no shared mutable state, and no game random numbers.

## Fingerprints

Each brain has a fingerprint: a hash of its name, settings, module source, and the car states of two short mirror matches.
The matches catch changes in shared code and physics that the module source does not show.
Results are stored by fingerprint, so editing a brain retires its old results instead of mixing them in.
Older results stay in the log. Use `--all-versions` or clear "Current versions only" on the page to see them.

## Commands

```text
list                      Brains, fingerprints, and recorded matches
ladder [brain ...]        Round robin up to --pairs seeds per pairing (default 10), then the leaderboard
challenge <brain> [rival] Paired matches until the test decides. The rival defaults to the top brain
ratings                   Leaderboard and head-to-head table
matches                   Matches sorted by any statistic: --sort touches, --sort total:demos, --sort upset
show <id>                 Every statistic of one match and a link to watch it
export                    Write public/arena/ for the page and the game menu (ladder and challenge do this)
```

Common options: `--size 1..3` and `--duration seconds` select the format (default 3v3, 300 s).
Each format has separate results and ratings. `--threads` defaults to every CPU.
Run `npm run arena -- --help` for the full list.

Every pairing plays seeds 1, 2, 3, … twice, with sides swapped, so both brains get the same kickoffs.
A match that is already in the log is never played again.

## Ratings

The leaderboard is a Bradley-Terry fit of every win and loss between current brains, on the Elo scale.
Rookie is fixed at 1000. ± is a 95% interval. Win percentage alone misleads when brains play different opponents.

Matches are chaotic. 100 matches only pin a win rate to about ±10%, so small differences need thousands.
In the first ladder, pro led allstar 57-43 after 100 matches; allstar won 57% of the next 900.

`challenge` runs a sequential probability ratio test on seed pairs. It stops as soon as the evidence decides between
"at least `--elo1` better" (default 10) and "at most `--elo0` better" (default 0), with 5% error rates,
or at `--max-pairs` (default 2000). It reuses recorded pairs, so rerunning a challenge is instant.

## Statistics

Every match records, per player: score, goals, assists, shots, saves, touches, demos, times demolished, bumps,
jumps, flips, big and small pads, boost used, distance, supersonic, airborne, and offensive-half seconds,
and mean distance to the ball. Per team: possession time (last touch), time with the ball in their half,
and wall-clock milliseconds spent in the brain. Times count live play only.

The log is `arena/results/matches.jsonl`, one JSON record per line, including both brains' settings text.

## Watching

`show <id>` and the page's Watch buttons open the game with the match in the link.
The game replays it from the seed and the brain settings, with goal replays.
Keys: `1`-`6` follow a car, `,` and `.` change speed, `P` pauses, `Esc` opens the menu.
At the end, the game reports whether the score matches the log. A mismatch means brain code or physics changed.
`npm run test:arena` checks that recorded matches replay exactly through the browser path.

The game menu also lists arena brains under Bot Difficulty, so you can play against any of them.
Restart `npm run dev`, or reload the page, after an export to refresh that list.
After editing a module, rebuild WASM (`npm run build:wasm`, or restart `npm run dev`) before watching or playing.
