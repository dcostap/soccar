# Car-ball contact audit

## Fixed suite

The contact suite adds 69 paths:

- 18 resting overlaps across three lateral offsets and six ball heights.
- 24 dribbles across four speeds, three lateral offsets, and two throttle values.
- 18 grounded hits across two ball heights, three speeds, and three lateral offsets.
- 9 airborne hits across three speeds and three lateral offsets.

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
