# Car-ball contact audit

## Fixed suite

The contact suite adds 105 paths:

- 18 resting overlaps across three lateral offsets and six ball heights.
- 24 dribbles across four speeds, three lateral offsets, and two throttle values.
- 18 grounded hits across two ball heights, three speeds, and three lateral offsets.
- 45 airborne hits across five relative heights, three speeds, and three lateral offsets.

Run it with `compare.py --suite contacts`.
The suite uses the same pinned RocketSim build and local arena meshes as the baseline suite.

## Contact-arm check

Bullet keeps a point on each body for one contact.
Soccar uses the box point for both the car and the ball.
A prototype used the sphere surface for the ball arm.

The change moved peak errors by less than 0.9 UU in the original contact cases.
It did not improve the 114.96 UU dribble error.
Keep this correction for a solver batch only if wider measurements support it.

## Rejected five-unit penetration fit

In the original dribble, Soccar removes the full first-tick overlap.
RocketSim leaves about 5 UU of overlap after its Bullet solve.
A prototype subtracted 5 UU from every car-ball position correction.

That prototype cut the original `ground-dribble` peak position error from 114.96 to 15.65 UU.
The wider suite rejected it.

| Group | Cases improved | Median before | Median prototype | Mean before | Mean prototype |
|---|---:|---:|---:|---:|---:|
| Resting overlap | 13/18 | 12.58 UU | 8.29 UU | 11.76 UU | 7.75 UU |
| Dribble | 10/24 | 58.31 UU | 131.99 UU | 94.07 UU | 130.88 UU |
| Ground hit | 6/18 | 24.36 UU | 29.28 UU | 44.76 UU | 45.46 UU |
| Air hit | 5/9 | 9.13 UU | 6.34 UU | 14.28 UU | 13.56 UU |

One 1,200 UU/s dribble rose from 40.4 to 229.4 UU.
The prototype is not in the game.

RocketSim uses ten sequential solver iterations, split impulse, and ERP 0.2.
A fixed overlap subtraction cannot represent that response.
The next prototype must model contact correction over time and test all fixed paths.

## Other rejected correction models

Resolving car-ball contact before position integration improved only 9 of 24 dribbles.
Median dribble error rose from 58.31 to 111.94 UU.

The pinned source detects contact before transform integration.
Its callback uses the post-force velocity, then queues the extra hit velocity until tick completion.
A staged prototype reproduced that order in Soccar.
It cut the original dribble from 114.96 to 73.23 UU and improved fast low-ball hits.
It improved only 7 of 24 dribbles, and their median error rose to 111.20 UU.
One elevated 2,200 UU/s hit rose from 131.4 to 141.6 UU.
Soccar's one-pass contact response cannot safely adopt the source order by itself.

Applying 72 percent of each position correction improved 7 of 24 dribbles.
Median dribble error rose to 75.33 UU.

Applying an ERP-sized 20 percent correction improved all 12 throttle dribbles.
Their mean error fell from 101.3 to 52.8 UU.
It improved only 3 of 12 coast dribbles, and their mean error rose from 86.8 to 89.4 UU.
Grounded low-ball hits also regressed unless the prototype restored full correction at world contact.

These results show a missing coupled-contact solve, not one safe correction factor.
None of these prototypes is in the game.

## Extra-impulse direction

RocketSim scales the vertical car-to-ball offset by 0.35.
Soccar uses the same source value.

A 0.65 prototype reduced the six original air-hit position peaks by 3.5 to 39.2 UU.
The wider height sweep rejected it.
It almost doubled mean error when the ball started 40 UU below the car.
It more than doubled mean error when the ball started 20 UU below the car.
It also caused large grounded-hit regressions.

The expanded suite keeps 45 air hits across relative heights from -40 through 40 UU.
Keep the source value and audit Bullet contact normals instead.

## Bullet box margin

The pinned Bullet sphere-box detector clamps against an inset box core.
The Octane box margin is 2 UU.
It adds that margin to the sphere radius and offsets the box contact point along the normal.

An exact analytic prototype improved 13 of 24 dribbles.
Median dribble error fell from 58.31 to 54.56 UU.
It also lowered median grounded-hit error from 24.36 to 21.18 UU.
Median airborne-hit error fell from 24.87 to 21.21 UU.

One elevated corner hit rose from 132.27 to 359.98 UU.
Combining the margin with source callback ordering raised it to 367.62 UU.
The one-pass impulse response cannot safely use Bullet's rounded contact normal by itself.
Keep the current sharp-box approximation until the response solver handles coupled edge contacts.
