# Team play: the `team` strategy

Status: **closed.** 2v2 accepted as `modular-team`. Nothing tried in 3v3 beat `modular-combo`, so 3v3 plays as combo.

`modular-team` is `modular-combo` with team play in 2v2. 1v1, 3v3, and set pieces play exactly as `modular-combo`.

- The attacker is the car that reaches the ball first by `ground_time`, not the nearest (`timecost`).
- The support does not double-commit. It waits wide and deep (`lateral 0.8`, `gap 1900`) and reads the ball
  a second ahead (`lead 1.0`).
- It takes over as soon as the attacker is past the ball or no faster to it (`margin 0`, `past 0`).

Against `modular-combo` in 2v2: +157 [+63, +279] on seeds 150000+. Without `timecost` it was +209 [+95, +391]
on seeds 90000+ and +107 [+30, +194] on seeds 120000+, and first on the 2v2 ladder at 1875 ± 110 to combo's
1740 ± 92, conceding 2.9 goals a match to combo's 3.5. `timecost` added +87 [+20, +160] on seeds 90000+.

## Settings

`strategies/team.rs` runs alphabravo's tactics and replaces only the support's positioning and the choice of attacker.
With default settings it plays exactly as alphabravo (tested in `simulation/tests/modular.rs`).

`team.<key>` sets an option for every team size. `team.2.<key>` and `team.3.<key>` override it for teams of
two or fewer, and of three or more. Select the strategy per size with `strategy.2 = team` and `strategy.3 = team`.

| Setting | Default | Meaning |
| --- | --- | --- |
| `shadow` | false | The support follows the ball instead of challenging it while the attacker has the play |
| `gap` | 1500 | Shadow distance behind the ball |
| `lateral` | 0.5 | Share of the ball's x the shadow keeps |
| `lead` | 0.5 | Seconds ahead on the ball's path that the shadow follows |
| `margin` | 0.4 | The shadow takes over when it reaches the ball this many seconds before the attacker |
| `past` | 300 | The shadow takes over when the attacker is this far upfield of the ball |
| `danger` | 2500 | The shadow always challenges a ball this close to the own goal while goal-side of it |
| `timecost` | false | Choose the attacker by `ground_time` to the ball plus `behind` seconds per unit upfield of it |
| `stick`, `behind` | 0.1, 0.00065 | Preference in seconds for the current attacker; upfield penalty |

## What lost

These were tried against `modular-combo`, 80 pairs each, and removed. All came out negative or within noise.

- **Crossing** (2v2). The attacker passed to a finisher waiting in the slot. Every variant landed between -22 and +30.
  A finisher parked in the slot without passes lost -56.
- **Higher 3v3 keeper.** Standing 3000 behind the ball lost -67, and 4500 lost -191.
- **3v3 keeper joining the attack** when it arrives sooner: -39 to -48, and -163 when it also joined in the rival half.
- **3v3 shadow support** with any spacing: -89 to +4. The best variant, a fast return to a wide, deep spot,
  screened at +22 and confirmed at -34.
- **Arrival-time attacker in 3v3:** 0.
- **Handover on distance** (the shadow takes over when the attacker is far from the ball): -48 in 2v2, -13 to -26 in 3v3.
- **Passive shadow** (2v2), which takes over only when much faster or once the attacker is well past the ball:
  -9, and -39 to -66 with a closer gap or a larger defending zone.

## Lessons

- A passive support loses. The support helps when it hands over at once: as soon as the ball passes the attacker
  or the support is no slower to it.
- In 2v2 the shadow does best wide and deep, reading the ball a second ahead: on the attacker's side of the field,
  ready for the next touch rather than the current one.
- 3v3 needs its pressure and its keeper. Every change to who presses or where the third car stands cost more than it gained.
- Forced crosses add nothing: play from wide already goes through the teammate. Over 24 matches, `modular-team`
  scores 0.50 goals a match within four seconds of a wide touch and a teammate's touch, and combo scores 0.25 to 0.38.
  The gain comes from fewer goals conceded and more direct goals, not from set passes.
- touch-a shoots only when its rollout scores, so a strategy that hides the attacker from it (reporting `Position`)
  costs goals.
- The best of many screened variants overstates its gain: one screened at +137 and confirmed at +38.
  Confirm on fresh seeds before accepting.

## Loop

1. Screen a variant `.brain` with a challenge against `modular-combo`: `--elo0 -20 --elo1 20 --max-pairs 80`.
   About 1.5 minutes on 15 threads, 3 minutes on 6.
2. Confirm on fresh seeds with `--seed-base` and `--max-pairs 150`.
3. The arena checks every brain file at startup. Rebuild it (`cargo build --release --locked --manifest-path
   arena/Cargo.toml`) before adding a brain that uses a new setting, or every challenge in the batch fails.
4. `simulation/tests/passes.rs` counts what follows touches wide in the attacking third: a teammate's touch,
   the same car's, a rival's, and goals. Run it with
   `PASSES_BRAIN=../arena/brains/<brain>.brain cargo test --release --test passes -- --ignored --nocapture`
   from `simulation/`. Twelve matches is a rough look only.
