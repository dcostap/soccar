# Brain contest

Two agents each build a bot brain. The brains then play each other on matches neither agent has seen.

| Entrant | Branch          | Worktree          | Brain   |
| ------- | --------------- | ----------------- | ------- |
| A       | `contest/alpha` | `../soccar-alpha` | `alpha` |
| B       | `contest/bravo` | `../soccar-bravo` | `bravo` |

Both branches start at the tag `contest/start`. Read `AGENTS.md`, `arena/README.md`, and the code in
`simulation/src/brains/` first. `classic.rs` is the original bot and the strongest built-in brain is `allstar`.

## Your entry

- `simulation/src/brains/<name>.rs` is your module. It is already registered in `MODULES`.
  It starts as a thin wrapper around the classic bot. Replace it with anything you like.
- You may add submodules in `simulation/src/brains/<name>/`, declared from `<name>.rs`.
- `arena/brains/<name>.brain` is your entry. It must use `module = <name>`. Its settings are yours to choose.
- `arena/contest/<name>.md` may hold your notes: approach, experiments, results.

While you work you may add more `arena/brains/<name>-*.brain` files to compare variants.
Delete them before your final commit. The submission must contain exactly one brain file, `<name>.brain`.

## Rules

1. **Change only your own files**, listed above. No edits to physics, game rules, the predictor, the harness,
   the arena, `mod.rs`, `Cargo.toml`, or the other entrant's files. Read-only use of any public simulation API is fine,
   including cloning `World` or `Ball` to simulate ahead.
2. **Deterministic.** No clocks, randomness, threads, shared mutable state, files, environment, or `unsafe`.
   Use `crate::math` or `libm` for trigonometry and other transcendental functions; `sqrt`, `abs`, `floor`, `min`, `max` are fine.
   A brain gets `Context` each tick and must derive everything from it and its own state.
3. **CPU budget.** In the final 3v3 ladder, your brain's `ms/m` (brain milliseconds per match) must be at most
   3 times `allstar`'s from the same run. Over budget is disqualified.
4. **Stay in your worktree.** Do not read the other entrant's worktree or branch.
5. **Fair compute.** Pass `--threads 8` to every arena command. Both entrants share one 16-thread machine.
6. **Commit to your branch** when done. Do not merge, push, or touch other branches.

Your local results live in your worktree's `arena/results/` and are gitignored.
Arena seeds start at 1 by default. The final uses a different, unannounced `--seed-base`,
so tuning against particular seeds does not help.

Check your branch before submitting:

```sh
node scripts/check-contest.mjs contest/<name> <name>
npm run test:rust
npm run build:wasm && npm run test:arena   # your logged matches replay exactly in WASM
```

## Judging

The judge works in a fresh worktree, so nobody's local results count.

```sh
node scripts/check-contest.mjs contest/alpha alpha
node scripts/check-contest.mjs contest/bravo bravo
git worktree add ../soccar-judge -b contest/judge contest/start
cd ../soccar-judge
git merge --no-edit contest/alpha contest/bravo
npm ci && npm run build:wasm && npm run test:rust && npm run test:simulation

# Choose the base now, for example a random number. Do not announce it beforehand.
SEED=<secret>
npm run arena -- ladder alpha bravo --pairs 1000 --seed-base $SEED       # the main event: 2000 matches
npm run arena -- challenge alpha bravo --pairs 1000 --max-pairs 1000 --seed-base $SEED   # head-to-head Elo and interval, no new matches
npm run arena -- ladder --pairs 100 --seed-base $SEED                    # everyone, for context and the CPU budget
npm run arena -- ladder --pairs 100 --seed-base $SEED --size 1
npm run arena -- ladder --pairs 100 --seed-base $SEED --size 2
npm run test:arena                                                        # replays logged matches in WASM
```

**Winner:** the brain that wins more of the 2000 main-event matches,
provided the 95% interval that `challenge` prints for the head-to-head Elo difference excludes zero.
Otherwise it is a draw.
The 1v1, 2v2, and ladder results against the built-in brains are reported but do not decide the winner.
Then open `/arena.html`, sort matches by upset, and watch the highlights.

## Result of the first contest (2026-10-01)

Seed base 1644621265. Both entries passed `check-contest`, and the merged build passed every check.

| Main event, 3v3 | Wins | Elo difference |
| --- | --- | --- |
| alpha vs bravo | 1585-415 (79.2%) | +233 [+214, +252] |

Context ladders, 100 seed pairs per pairing:

| Format | alpha | bravo | allstar | pro | rookie |
| --- | --- | --- | --- | --- | --- |
| 3v3 | 1812 | 1577 | 1131 | 1136 | 1000 |
| 2v2 | 1492 | 1281 | 1177 | 1134 | 1000 |
| 1v1 | 1020 | 962 | 1068 | 1033 | 1000 |

Brain time in the 3v3 ladder: alpha 207, bravo 489, allstar 240 ms per match.
Both brains are built for team play. In 1v1 the classic allstar beats both.
The entrants' notes are in `arena/contest/`. Both brains are now part of the regular roster.
