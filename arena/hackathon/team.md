# Team play: the `team` strategy

Status: **2v2 accepted, 3v3 open.** Goal: better teamwork than `modular-combo` in 2v2 and 3v3, without double-committing.

`modular-team` is `modular-combo` with the shadow support of `modular-team-x-all3` in 2v2:
the support waits wide and deep (`lateral 0.8`, `gap 1900`), reads the ball a second ahead (`lead 1.0`),
and takes over as soon as the attacker is past the ball or no faster to it (`margin 0`, `past 0`).
Against `modular-combo` in 2v2: +209 [+95, +391] on seeds 90000+ and +107 [+30, +194] on seeds 120000+.
Against `modular-team-x-quick2`: +31 [-8, +70]. 1v1, 3v3, and set pieces play exactly as `modular-combo`.
On the 2v2 ladder it ranks first at 1875 ± 110, ahead of `modular-combo` at 1740 ± 92. It concedes 2.9 goals
a match there against combo's 3.5, and scores the same 8.0.

`strategies/team.rs` runs alphabravo's tactics and replaces only some cars' choices.
Every option is off by default, and then it plays exactly as alphabravo (tested in `simulation/tests/modular.rs`).
Variants are `.brain` files, so trying a setting needs no rebuild and retires no other results.

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
| `keeper` | 0 | 3v3 goalkeeper stands this far behind the ball instead of on the line; 0 disables |
| `keepmax` | -1000 | The keeper goes no farther upfield than this |
| `cross` | false | Crossing: the shadow waits in the slot, and the attacker passes to it from wide |
| `crossx`, `crossy` | 1000, 3000 | A low ball at least this far from the middle and this far upfield is crossed |
| `slot`, `far` | 1100, 300 | The cross aims this far in front of the goal line and this far past the middle |
| `wait` | 2600 | The finisher waits this far in front of the goal line; 0 keeps the normal shadow spot |
| `ready` | 2500 | A teammate within this distance behind the cross point counts as ready |
| `crossspeed`, `crossflip` | 2300, true | Approach speed and flip of the cross |
| `pass` | true | With `cross`, false keeps the slot positioning but never passes |

A cross reports `Mode::Strike`, so a skill that finds a scoring touch (touch-a) still shoots first.

## Loop

1. Screen each variant with a challenge against `modular-combo`: `--elo0 -20 --elo1 20 --max-pairs 80`.
   About 1.5 minutes on 15 threads, 3 minutes on 6.
2. Confirm on fresh seeds with `--seed-base` and `--max-pairs 150`. The best of many screened variants
   overstates its gain: `quick` screened at +82 and confirmed at +26, `lead10` at +137 and +38.
3. `simulation/tests/passes.rs` counts what follows touches wide in the attacking third: a teammate's touch,
   the same car's, a rival's, and goals. Run it with
   `PASSES_BRAIN=../arena/brains/<brain>.brain cargo test --release --test passes -- --ignored --nocapture`
   from `simulation/`. Twelve matches is a rough look only.

## Results against `modular-combo`

Elo with 95% intervals. Seeds 1+ unless marked. Brains not in `arena/brains/` are in `arena/brains/archive/`.

| Brain | Settings | 2v2 | 3v3 |
| --- | --- | --- | --- |
| `modular-team-shadow` | shadow | -9 [-59, +41] | **-74** [-140, -12] |
| `modular-team-x-gap800` | shadow, gap 800 | **-66** [-127, -9] | **-89** [-164, -21] |
| `modular-team-x-ownhalf` | shadow, danger 5200 | **-60** [-120, -4] | -43 [-91, +4] |
| `modular-team-x-defend` | shadow, danger 7000 | -39 [-94, +13] | **-117** [-207, -39] |
| `modular-team-x-quick` | shadow, margin 0.1, past 0 | **+82** [+17, +152]; seeds 70000+: +26 [-15, +67] | -48 [-103, +4] |
| `modular-team-x-quick2` | shadow, margin 0, past 0 | **+67** [+8, +129]; seeds 90000+: **+83** [+18, +153] | -4 [-61, +52] |
| `modular-team-x-quick3` | quick, gap 2200 | +35 [-20, +91] | |
| `modular-team-x-keep3000` | keeper 3000 | | **-67** [-130, -7] |
| `modular-team-x-keep4500` | keeper 4500, keepmax 0 | | **-191** [-348, -84] |
| `modular-team-x-cross` | quick2, cross | -22 [-76, +31] | |
| `modular-team-x-cross-soft` | cross, no flip, speed 1600 | +30 [-24, +86] | |
| `modular-team-x-cross-wide` | cross, crossx 1800, crossy 2500 | +4 [-52, +61] | |
| `modular-team-x-slotonly` | cross, pass false | **-56** [-113, -2] | |
| `modular-team-x-passonly` | cross, wait 0, soft | +4 [-48, +57] | |
| `modular-team-x-pass2` | cross, wait 0, reported as Strike | +13 [-42, +68] | -30 [-85, +22] |
| `modular-team-x-pass2-soft` | pass2, soft | -4 [-54, +45] | |
| `modular-team-x-3own` | 3v3: quick2, danger 5200 | | -9 [-59, +41] |
| `modular-team-x-3close` | 3v3: quick2, gap 1000 | | +4 [-49, +58] |
| `modular-team-x-lead02` | 2v2: quick2, lead 0.2 | +17 [-35, +71] | |
| `modular-team-x-lead10` | 2v2: quick2, lead 1.0 | **+137** [+52, +241]; seeds 90000+: +38 [-6, +84] | |
| `modular-team-x-lat02` | 2v2: quick2, lateral 0.2 | +17 [-39, +75] | |
| `modular-team-x-lat08` | 2v2: quick2, lateral 0.8 | **+107** [+30, +194]; seeds 90000+: **+103** [+31, +186] | |
| `modular-team-x-gap1200` | 2v2: quick2, gap 1200 | +26 [-26, +80] | |
| `modular-team-x-gap1900` | 2v2: quick2, gap 1900 | **+124** [+42, +223]; seeds 90000+: +28 [-12, +68] | |
| `modular-team-x-all3` | 2v2: quick2, lead 1.0, lateral 0.8, gap 1900 | seeds 90000+: **+209** [+95, +391]; seeds 120000+: **+107** [+30, +194] | |
| `modular-team-x-3lead` | 3v3: quick2, lead 1.0 | | **-86** [-161, -19] |
| `modular-team-x-3all3` | 3v3: all3's settings | | -26 [-80, +26] |

## Lessons

- A passive support loses. The support helps when it hands over at once: as soon as the ball passes the attacker
  or the support is no slower to it. Then 2v2 gains clearly, and 3v3 roughly breaks even.
- In 2v2 the shadow does best wide and deep, reading the ball a second ahead: the attacker's side of the field,
  ready for the next touch rather than the current one.
- 3v3 needs its pressure. A higher keeper loses, more so the higher it stands, and no shadow variant gains there.
- Forced crosses lose or break even. The pass diagnostic shows why the shadow already works:
  quick2 scores about 0.6 goals a match within four seconds of a wide touch and a teammate's touch, combo about 0.1.
  A finisher parked in the slot wastes a car.
- touch-a shoots only when its rollout scores, so anything that hides the attacker from it (reporting `Position`)
  costs goals.
