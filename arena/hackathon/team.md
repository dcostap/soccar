# Team play: the `team` strategy

Status: **in progress.** Goal: better teamwork than `modular-combo` in 2v2 and 3v3, without double-committing.

`strategies/team.rs` runs alphabravo's tactics and replaces only some cars' positioning.
Every option is off by default, and then it plays exactly as alphabravo (tested in `simulation/tests/modular.rs`).
Variants are `.brain` files, so trying a setting needs no rebuild and retires no other results.

| Setting | Default | Meaning |
| --- | --- | --- |
| `team.shadow` | false | The support follows the ball instead of challenging it while the attacker has the play |
| `team.gap` | 1500 | Shadow distance behind the ball |
| `team.lateral` | 0.5 | Share of the ball's x the shadow keeps |
| `team.lead` | 0.5 | Seconds ahead on the ball's path that the shadow follows |
| `team.margin` | 0.4 | The shadow takes over when it reaches the ball this many seconds before the attacker |
| `team.past` | 300 | The shadow takes over when the attacker is this far upfield of the ball |
| `team.danger` | 2500 | The shadow always challenges a ball this close to the own goal while goal-side of it |
| `team.keeper` | 0 | 3v3 goalkeeper stands this far behind the ball instead of on the line; 0 disables |
| `team.keepmax` | -1000 | The keeper goes no farther upfield than this |

Brains select it with `strategy.2 = team` and `strategy.3 = team`, on top of combo's skills. One strategy instance
serves both sizes, so both get the same settings. Use `strategy.3 = alphabravo` to change 2v2 only.

## Loop

Screen each variant with a challenge against `modular-combo`, `--elo0 -20 --elo1 20 --max-pairs 80`,
about 1.5 minutes on 15 threads. Then confirm a winner on fresh seeds with `--seed-base`:
the best of many screened variants overstates its gain.

## Results against `modular-combo`

| Brain | Settings | 2v2 | 3v3 |
| --- | --- | --- | --- |
| `modular-team-shadow` | shadow | -9 [-59, +41] | **-74** [-140, -12] |
| `modular-team-x-gap800` | shadow, gap 800 | **-66** [-127, -9] | **-89** [-164, -21] |
| `modular-team-x-ownhalf` | shadow, danger 5200 | **-60** [-120, -4] | -43 [-91, +4] |
| `modular-team-x-defend` | shadow, danger 7000 | -39 [-94, +13] | **-117** [-207, -39] |
| `modular-team-x-quick` | shadow, margin 0.1, past 0 | **+82** [+17, +152]; fresh seeds +26 [-15, +67] | -48 [-103, +4] |
| `modular-team-x-quick2` | shadow, margin 0, past 0 | **+67** [+8, +129] | -4 [-61, +52] |
| `modular-team-x-quick3` | quick, gap 2200 | +35 [-20, +91] | |
| `modular-team-x-keep3000` | keeper 3000 | | **-67** [-130, -7] |
| `modular-team-x-keep4500` | keeper 4500, keepmax 0 | | **-191** [-348, -84] |

Losers are in `arena/brains/archive/`.

## Lessons

- A passive support loses. The support helps when it hands over at once: as soon as the ball passes the attacker
  or the support is no slower to it. Then 2v2 gains, and 3v3 roughly breaks even.
- 3v3 needs its pressure. A higher keeper loses, more so the higher it stands.
- Attackers still aim at the goal center. Crosses to a waiting teammate are not implemented yet.
