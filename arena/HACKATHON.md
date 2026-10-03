# Skill hackathon

Teams improve one gameplay skill each, in separate worktrees, on top of one shared baseline.
Then skills compete per track, and the best ones combine into one brain.

**Result of the first hackathon:** `modular-combo` (`recovery-a, blocking-a, bounce-a, scramble-a, aerial-a, touch-a`)
beats `modular-aerial-a` by 77 to 131 Elo at every team size. See [the combination report](hackathon/combo.md).
A next round starts from `modular-combo`. Challenge it, not `modular`, and remove a skill only after an ablation.

## The baseline: `modular`

`modular` is alphabravo, the top-rated brain, split into a fixed core and swappable skills.
With no skills selected, it plays exactly as alphabravo.
Tests compare every tick of 1v1, 2v2, and 3v3 matches on both sides.
All 4,786 public and archived set pieces give identical results.

```text
simulation/src/brains/modular/
  mod.rs       Brain, strategy choice, skill arbitration, fingerprint   frozen
  tactics.rs   alphabravo strategy: roles, pressure, strikes (default)  frozen
  pilot.rs     alpha car control: intercepts, flips, aerials            frozen
  kit.rs       Strategy and Skill traits, Situation, shared tools       frozen
  strategies/
    mod.rs     registry: add one line per strategy
    alpha.rs   alpha's strategy; plays exactly as the alpha brain; copy it to start
  skills/
    mod.rs     registry: add one line per skill
    template.rs  worked example; copy it to start
```

A **strategy** chooses roles, positioning, and a default action for every car.
A **skill** overrides the strategy for a moment, as a player reacts to a bounce, a shot, or an opening.

### Strategies

The default strategy is alphabravo's. A brain can pick another for every team size or for one size:

```text
strategy = alpha        # every team size
strategy.1 = alpha      # teams of one car; strategy.2 and strategy.3 likewise
```

Team size counts a human teammate. Teams larger than three use `strategy.3`.
Each strategy reads its own settings, named `<strategy>.<key>`. `shotzone` belongs to `alphabravo`.

Each tick, for each bot car:

1. The strategy assigns roles and works out its `Mode`: the branch it would take this tick.
   Modes are `Kickoff`, `Maneuver`, `Airborne`, `Wall`, `Position`, `Save`, `Intercept`, and `Strike`.
2. The skill that drove the car on the previous tick is offered it first, with `holding = true`.
   This lets it finish a flip, an aerial, or a dribble without interruption.
3. Every other selected skill is offered the car in priority order.
   The first skill that returns `Some(controls)` drives the car for this tick.
   The strategy's own flip or aerial is abandoned; it plans afresh when it gets the car back.
4. If no skill claims the car, the strategy drives it. Every skill may then `adjust` its controls.

A brain selects skills in priority order:

```text
# arena/brains/modular-aerial-a.brain
module = modular
skills = aerial-a
aerial-a.minheight = 300
```

Skill settings use the skill name as a prefix. Unknown settings are errors.
Core settings are alpha's `Settings`, `shotzone`, and the strategy choice. Skill tracks keep `modular`'s.

### Fingerprints

A modular brain's fingerprint covers the four core files and the source of each selected strategy and skill.
Editing your skill or strategy retires only the brains that select it.
Adding one to a registry retires nothing.
Editing any core file retires every modular brain, so core files are frozen during the hackathon.

## Tracks

Each team takes one track. Target suites measure progress. Holdouts check that the skill generalizes.
Baseline numbers are `modular` on the public suites.

| Track      | Skill                                                          | Target suites                                                                               | Baseline pass | Credit |
| ---------- | -------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | ------------- | ------ |
| `aerial`   | Meet falling and high balls in the air                         | `defense-v2-falling`, `defense-v2-ceiling`                                                  | 3%            | 0.025  |
| `bounce`   | Read floor, wall, and corner bounces; meet the ball after them | `defense-v2-floor`, `defense-v2-double-floor`, `defense-v2-side-wall`, `defense-v2-corner`  | 16%           | 0.162  |
| `recovery` | Get back from upfield or out of position in time               | `defense-v3-ground-recovery`, `gen-chase-back`                                              | 23%           | 0.234  |
| `blocking` | Shadow, block, and clear direct shots                          | `saves`, `gen-saves`, `defense-v2-ground`, `defense-v2-rival-front`, `defense-v2-rival-cut` | 73%           | 0.729  |
| `shooting` | Finish still and slow balls, beat a goalkeeper                 | `finishing`, `gen-shots`, `gen-goalie`, `gen-breakaways`                                    | 70%           | 0.734  |
| `touch`    | First touches on moving balls and awkward starts               | `gen-moving`, `gen-awkward`                                                                 | 38%           | 0.469  |
| `scramble` | Close play in the box with rivals near the ball                | `gen-scrambles`, `mined-goals`                                                              | 45%           | 0.554  |

### The `solo` track: a 1v1 strategy

alphabravo's strategy leads 2v2 and 3v3 but is last in 1v1. Alpha's strategy is stronger there,
so `modular-solo` (`strategy.1 = alpha`) starts the track. It costs set pieces, because every set piece
puts one car on a team and so runs the 1v1 strategy:

| Brain                   | 1v1 Elo | Set pieces | Credit |
| ----------------------- | ------- | ---------- | ------ |
| `modular`               | 972     | 35%        | 0.360  |
| `modular-solo`          | 1068    | 32%        | 0.334  |
| `modular-aerial-a`      | 1036    | 73%        | 0.744  |
| `modular-solo-aerial-a` | 1150    | 72%        | 0.726  |

Alpha's strategy loses mostly attacking set pieces: `gen-breakaways` 25% to 8%, `finishing` 78% to 61%.
The solo team writes `strategies/solo_<team>.rs`, starting from a copy of `strategies/alpha.rs`,
and selects it with `strategy.1 = solo-<team>`. It must beat `modular-solo` in 1v1 matches
and keep set-piece credit at least `modular-solo`'s, with and without `aerial-a`.
Its 2v2 and 3v3 play does not change, so its ladders there need not run.

```sh
npm run arena -- challenge modular-solo-<team> modular-solo --size 1 --elo0 0 --elo1 30 --max-pairs 500
npm run arena -- challenge modular-solo-<team>-aerial modular-solo-aerial-a --size 1 --elo0 0 --elo1 30 --max-pairs 500
npm run arena -- ladder --size 1
npm run arena -- setpieces modular-solo modular-solo-<team> modular-solo-aerial-a modular-solo-<team>-aerial
```

Kickoffs have no track. No set piece measures them, so judge them only with matches.

Track commands, with `<skill>` for the brain under test:

```sh
# aerial
npm run arena -- setpieces modular <skill> --suite defense-v2-falling,defense-v2-ceiling
npm run arena -- setpieces modular <skill> --defense --holdout <seed> --suite defense-v2-falling,defense-v2-ceiling

# bounce
npm run arena -- setpieces modular <skill> --suite defense-v2-floor,defense-v2-double-floor,defense-v2-side-wall,defense-v2-corner
npm run arena -- setpieces modular <skill> --defense --holdout <seed> --suite defense-v2-floor,defense-v2-double-floor,defense-v2-side-wall,defense-v2-corner

# recovery (the ground-recovery holdout takes that suite alone)
npm run arena -- setpieces modular <skill> --suite defense-v3-ground-recovery,gen-chase-back
npm run arena -- setpieces modular <skill> --defense --holdout <seed> --suite defense-v3-ground-recovery
npm run arena -- setpieces modular <skill> --holdout <seed> --suite holdout-chase-back

# blocking
npm run arena -- setpieces modular <skill> --suite saves,gen-saves,defense-v2-ground,defense-v2-rival-front,defense-v2-rival-cut
npm run arena -- setpieces modular <skill> --holdout <seed> --suite holdout-saves
npm run arena -- setpieces modular <skill> --defense --holdout <seed> --suite defense-v2-ground,defense-v2-rival-front,defense-v2-rival-cut

# shooting
npm run arena -- setpieces modular <skill> --suite finishing,gen-shots,gen-goalie,gen-breakaways
npm run arena -- setpieces modular <skill> --holdout <seed> --suite holdout-shots,holdout-goalie,holdout-breakaways

# touch
npm run arena -- setpieces modular <skill> --suite gen-moving,gen-awkward
npm run arena -- setpieces modular <skill> --holdout <seed> --suite holdout-moving,holdout-awkward

# scramble
npm run arena -- setpieces modular <skill> --suite gen-scrambles,mined-goals
npm run arena -- setpieces modular <skill> --holdout <seed> --suite holdout-scrambles
```

`--holdout` generates fresh scenarios in memory and writes no results. Add `--count 200` for a larger sample.
Use your own seeds while developing. The judges keep the final holdout seeds secret.
`setpieces show <suite> --brain <skill>` lists every scenario. `setpieces show <suite>/<name> --brain <skill>`
prints a watch link. Run `npm run build:wasm` before watching a changed skill in the browser.

## Rules

1. **Write only your own files**: `skills/<track>_<team>.rs`, helper files named `skills/<track>_<team>_*.rs`,
   `arena/brains/modular-<track>-<team>*.brain`, and your report.
   Add one `pub mod` line and one `SKILLS` entry to `skills/mod.rs`.
   The solo track writes `strategies/solo_<team>.rs` and its helpers instead, and registers it in `strategies/mod.rs`.
   List every file your skill uses in its `source`, with `concat!(include_str!(...), ...)`.
2. **Do not edit the core**: `mod.rs`, `tactics.rs`, `pilot.rs`, `kit.rs`. Copy a helper into your file to change it.
   If the core needs a change, describe it in your report instead.
3. **Do not edit scenarios, generators, the judge, `scripted`, `strike`, or other brains.**
   Set pieces are fixed tests. Do not tune to individual scenario names or positions.
4. **Determinism**: no clocks, no shared mutable state, no game random numbers, only `crate::math` trigonometry.
   Keep all per-car state in the skill's fields and push it in `trace`.
5. **Claim narrowly.** Return `None` outside your skill's moments, so the core keeps the strategy.
   Check `s.role`, `s.mode`, `s.count`, and the ball, not only the set-piece layout.
   A skill must also work for every car of a 3v3 team, on both sides: use `s.d` for direction.
6. **Hold honestly.** Return `None` when your move is done or no longer makes sense.
   A skill that never releases the car disables the strategy.

## Team workflow

```sh
git worktree add ../soccar-<track>-<team> -b hackathon/<track>-<team>
cd ../soccar-<track>-<team>
npm ci
cp -r ../soccar/arena/results arena/      # reuse logged matches, so ladders play only new pairings
cp simulation/src/brains/modular/skills/template.rs simulation/src/brains/modular/skills/<track>_<team>.rs
```

1. Rename the struct and the settings prefix. Register the skill in `skills/mod.rs` as `<track>-<team>`.
2. Add `arena/brains/modular-<track>-<team>.brain` with `module = modular` and `skills = <track>-<team>`.
   Add `arena/brains/modular-<track>-<team>-aerial.brain` with `skills = <track>-<team>, aerial-a`.
   The final brain will include `aerial-a`, so a skill must also help next to it.
3. Run your track's public suites. Study failures with `setpieces show` and watch links.
4. Check holdouts with several seeds. A public gain that disappears on holdouts is overfitting.
5. Play matches (below) as you go, not only at the end. A set-piece gain that loses matches is not a gain.
6. Check the guard rails below. Fix regressions before reporting.
7. Write `arena/hackathon/<track>-<team>.md`: the idea, when the skill claims, settings, public and holdout
   results against `modular`, match results, brain time per match, guard-rail results, known failures,
   and any core change you would want.
8. Commit on your branch. Do not merge it.

## Matches

Set pieces measure one moment. Matches measure whether the skill wins games. Every entry reports both.

```sh
# Paired matches against the baseline, 3v3 and 1v1.
npm run arena -- challenge modular-<track>-<team> modular --elo0 -15 --elo1 0 --max-pairs 300
npm run arena -- challenge modular-<track>-<team> modular --size 1 --elo0 -15 --elo1 0 --max-pairs 300
# Next to aerial-a, against aerial-a alone.
npm run arena -- challenge modular-<track>-<team>-aerial modular-aerial-a --elo0 -15 --elo1 0 --max-pairs 300
# Against the field at every team size: rates both brains on the shared leaderboard.
for n in 1 2 3; do npm run arena -- ladder --size $n; done
npm run arena -- export --size 3          # the page shows the last exported format
```

Formats differ a lot. alphabravo leads 3v3 but is last in 1v1, where allstar and pro beat it.
Report the challenge verdicts and win rates, the ladder Elo and rank of both brains at each size, and `brainMs` per match.
Look at a few matches too: `arena matches --brain <name>` and `arena show <id>` print watch links.
Watching shows what numbers miss, such as a car that leaves the goal empty to chase an aerial.

## Guard rails

A skill must not damage play outside its moments.

```sh
cargo test --release --manifest-path simulation/Cargo.toml --test modular
npm run arena -- setpieces modular modular-<track>-<team>          # every normal suite
npm run build:wasm
node scripts/check-simulation.mjs --brains arena/brains/modular-<track>-<team>.brain arena/brains/modular.brain
```

- Total set-piece credit, over all normal suites, must not fall.
- The 3v3 and 1v1 challenges against `modular` should accept "not worse than 15 Elo".
  If one reaches the limit undecided, report the win rate.
- At each team size, the ladder Elo must not fall below `modular`'s.
- The native/WASM check must report `"difference": null`.

## Judging and combining

1. **Per track**: an entry must pass the guard rails, including matches. Rank passing entries by holdout
   credit on the track, then by ladder Elo. Report both for every entry.
2. **Swap tests**: pit the winners against each other, against `modular`, and against the field with `arena ladder` and `challenge`.
3. **Combine**: an integration branch merges the winning skill branches. Conflicts in `skills/mod.rs` only
   join two lists: keep both sides. Then add brains with several skills in priority order, for example
   `skills = recovery-a, aerial-b, bounce-a, blocking-c, shooting-a, touch-b`.
   Order matters: the first skill to claim a car wins the tick.
   Put defensive emergencies before attacking skills.
   Keep a skill in the combination only if removing it loses matches or set pieces.
4. **Final**: run every normal suite, fresh holdouts for every track, the ladder against every brain,
   and paired matches against alphabravo at 1v1, 2v2, and 3v3.
   Keep the best combination as a new brain. Keep earlier versions under their own names.
