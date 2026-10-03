# Phase 0: measured differences

## Reference and scope

Soccar engine: `09645b7b1e85f2e6`, source at `b715950`.
Reference: `rocketsim==2.2.1`, Windows CPython 3.12.
The run used 16 meshes from the installed Rocket League's standard Soccar Free Play.
Both engines stepped at 120 Hz with equivalent control directions.

The run measured 78 cases and 14,856 physics ticks.
No physics changed before this report.
[phase0.json](phase0.json) preserves all measured metrics and source hashes.
Local full traces are in `artifacts/rocketsim-diff/phase0/`.

The suite covers driving, braking, steering, powerslide, jumps, post-jump flips, air control, and landings.
It also covers wall, ceiling, corner, and goal-edge motion; ball bounces; hits; dribbles; bumps; and pads.
Countdowns, kickoff scheduling, and scoring rules remain unaudited.
This report does not claim 1:1 agreement or model transfer.

## Gameplay priority

UU means Rocket League's world units.
Numbers below are peak distances at equal ticks, not fitted acceptance limits.

| Priority | Difference | Measured size | Gameplay effect |
| --- | --- | --- | --- |
| 1 | Goal edges and posts | Car: 404.78 UU over 1.5 s. Ball: 143.88 UU over 2 s. | Changes goal-mouth contact and shot results. |
| 2 | Car-ball contact and dribbles | Dribble ball: 114.96 UU over 2 s. Air hit: 51.68 UU over 0.75 s. | Changes ball control and shot placement. |
| 3 | Wall transitions and corners | Wall entry: 107.99 UU over 2 s. Corner entry: 74.11 UU over 1.5 s. | Changes wall approaches and recovery paths. |
| 4 | Roof contact and recovery | Auto-flip case: 81.01 UU and near 180 degrees over 2.5 s. | Changes recovery direction and timing. |
| 5 | Powerslide buildup | Handbrake value: 0.225. Car: 5.23–42.78 UU over 1 s. | Changes turning radius during slide entry. |
| 6 | Steering and braking | Steering: 4.25–26.77 UU over 1 s. Braking: 19.47 UU over 2 s. | Changes path prediction and stop distance. |
| 7 | Flip and short boost boundaries | Flips: 1.94 UU and 3.84 degrees over 1 s. Boost tap: 7.94 UU. | Changes short action timing. |
| 8 | Ball drag and free motion | Falling ball: 0.032 UU. Moving, spinning ball: 0.227 UU over 1 s. | Small isolated error; it can grow over long trajectories. |

Regular air control is already close after converting control signs.
Its position error stays below 0.001 UU over one second.
Its rotation error stays below 0.0001 degrees in the measured cases.
Do not replace correct air-control math to fix an input convention.

## Large errors that need context

The demo case has the largest position error: 4,608 UU.
Much of that error follows different respawn locations.
The demo state differs for one tick; later positions do not isolate the bump impulse.
Audit collision onset and respawn timing separately before changing either rule.

The zero-motion airborne ball differs by 324.40 UU after one second.
RocketSim explicitly sleeps a ball when both motion vectors are zero.
Soccar applies gravity to an unfrozen ball.
This is a reference-state rule, not a gravity-constant error.
Do not freeze all stationary airborne balls merely to reduce this number.

Small-pad cooldown and boost differ at a respawn boundary by one tick.
The peak cooldown difference therefore approaches four seconds, although the event delay is only one tick.
The large-pad cooldown error stays below 0.0001 seconds in the measured case.
One existing small-pad position differs by two units.

## Confirmed controller finding

RocketSim's pinned `RLConst.h` uses rise rate 5 and fall rate 2.
Soccar uses rise rate 6.5 and fall rate 2.
The state tests confirm the same 0.225 peak value difference at speeds 0, 500, 1500, and 2200 UU/s.
Ground powerslide cases confirm a trajectory difference at five speeds.

Change only the rise rate in the first approved behavior batch.
Keep `Controls.dodge_mag` and its fallback rule.
Keep browser and bot control signs; use a reference adapter for imported models.
Measure the remaining timing differences before changing matching constants or rules.

## Proposed agreement targets

These targets are provisional. They are not current passing tolerances.
Increase scenario coverage before accepting them or claiming model transfer.

| Case | Proposed target at every tick |
| --- | --- |
| Car free air, 1 s | Position 0.1 UU; velocity 0.1 UU/s; rotation 0.01 degrees. |
| Handbrake state | Value error below 0.00001 at all tested speeds. |
| Ground driving, 2 s | Position 10 UU; velocity 30 UU/s; rotation 1 degree. |
| Steering and powerslide, 1 s | Position 15 UU; rotation 2 degrees. |
| Post-jump flips, 1 s | Position 3 UU; rotation 0.25 degrees. |
| Ball contacts and hits, 1–2 s | Position 10 UU; inspect contact-onset and post-hit velocity separately. |
| Pickup, jump, demo, and respawn events | Aim for the same tick; document each remaining one-tick difference. |

No tolerance applies to native/WASM parity. That check remains bit-identical.

## Next batches

1. Correct powerslide buildup and archive incompatible recording data.
2. Isolate contact timing from geometry at goal edges and during dribbles.
3. Fit shipped analytic or hand-built geometry to local reference measurements.
4. Check shared ball prediction after each ball or arena change.
5. Add match-rule cases and widen speed, angle, and contact-point coverage.

Keep one subsystem per commit and include before/after measurements.
Do not ship the dumped meshes while their distribution rights remain unconfirmed.
