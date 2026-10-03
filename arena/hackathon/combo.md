# Combination: `modular-combo`

Status: **accepted**. The hackathon's result brain.

```text
module = modular
skills = recovery-a, blocking-a, bounce-a, scramble-a, aerial-a, touch-a
```

Each skill failed its own track alone; see the team reports in this folder.
Together they beat `modular-aerial-a`, the best brain before the hackathon, at every team size.
aerial-b, shooting-a, and the solo-a strategy did not join. They stay on their `hackathon/*` branches.

## How it was chosen

1. `hackathon/integration-a` screened 768 skill subsets with four games per size. That sample was too small to pick a winner.
2. Three of its best subsets were certified on branch `hackathon/certify`: every normal suite,
   fresh holdouts (seed 731), and paired challenges against `modular-aerial-a` at 1v1, 2v2, and 3v3.
3. Head-to-head challenges picked the full set, there named `modular-cert-3`, over smaller sets.
4. Ablations removed one skill at a time. Removing any skill lost matches, so all six stay.

## Matches

Challenges against `modular-aerial-a`. Elo with 95% intervals; each verdict stopped as soon as it was decided.

| Size | Elo |
| --- | --- |
| 3v3 | +131 [+60, +214] |
| 2v2 | +77 [+27, +129] |
| 1v1 | +126 [+57, +205] |

Head to head, the full set against `recovery-a, bounce-a, aerial-a, touch-a`: 3v3 +13, 2v2 +29 [+6, +53], 1v1 +23.

Ablations: the full set against the same brain without one skill. Positive means the skill helps.

| Removed | 3v3 | 2v2 | 1v1 |
| --- | --- | --- | --- |
| recovery-a | +46 [-3, +95] | -4 [-17, +10] | +17 [-12, +46] |
| blocking-a | +21 [-12, +54] | +3 [-15, +22] | +29 [-9, +68] |
| bounce-a | +46 [-3, +97] | -13 [-37, +12] | +28 [-10, +66] |
| scramble-a | -19 [-50, +12] | +68 [+9, +132] | +5 [-16, +27] |
| touch-a | +61 [+5, +120] | +232 [+109, +452] | +66 [+7, +129] |

touch-a matters most. Every other skill helps at two sizes or more, and no loss is significant.

## Set pieces

Credit, 1 per success.

| Brain | Normal suites | Holdouts | Defense holdouts | Ground-recovery holdout |
| --- | --- | --- | --- | --- |
| `modular-aerial-a` | 0.743 | 0.743 | 0.816 | 0.134 |
| `modular-combo` | 0.765 | 0.787 | 0.832 | 0.181 |

The largest holdout gains: chase-back 81% to 98% (recovery-a), scrambles 67% to 73%, saves 69% to 74%,
and rival-front and rival-cut defense, 84% to 89% and 87% to 93%.

## Cost

Mean brain time per 300-second match: 3.2 s in 1v1, 3.7 s in 2v2, and 4.1 s in 3v3.
That is close to `modular-aerial-a` (2.6, 3.7, and 4.4 s). aerial-a's rollouts take most of it.
Plain `modular` takes 0.1 to 0.3 s.

## Found during certification

`user-defend/deny-immediate-rebound` hung the set-piece runner whenever the ball was still airborne at the time limit.
Its clip held 888 frames, but the judge needed 889 ticks. Recorded set pieces now repeat their last frame
until the judge decides (`simulation/src/recording.rs`).
