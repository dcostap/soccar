# Car-car contact audit

## Fixed suite

The bump suite adds 77 paths:

- 30 grounded rear impacts across five attacker speeds, three lateral offsets, and two victim speeds.
- 15 airborne impacts across five attacker speeds and three lateral offsets.
- 12 angled grounded impacts across three attacker speeds, two lateral offsets, and two victim yaws.
- 16 tilted airborne impacts across roll, pitch, speed, and lateral offset.
- 4 vertical impacts across two speeds and two victim rolls.

Run it with `compare.py --suite bumps`.
The suite stops before normal demolition respawns.

## Approved baseline

| Group | Cases | Attacker median | Attacker mean | Victim median | Victim mean |
|---|---:|---:|---:|---:|---:|
| Ground | 30 | 258.2 UU | 563.4 UU | 47.0 UU | 242.6 UU |
| Air | 15 | 122.5 UU | 258.9 UU | 45.4 UU | 49.5 UU |
| Angled | 12 | 599.0 UU | 921.3 UU | 101.7 UU | 384.2 UU |
| Tilted | 16 | 74.6 UU | 92.9 UU | 43.2 UU | 44.6 UU |
| Vertical | 4 | 329.9 UU | 402.6 UU | 220.3 UU | 228.5 UU |

The worst victim paths are offset or angled contacts.
This points to contact-manifold response rather than one bump-force constant.

## Rejected timing changes

RocketSim queues the added bump velocity from its contact callback.
Applying Soccar's queued velocity at the end of the same tick did not improve peak positions.
It raised median grounded victim-velocity error from 284.6 to 553.6 UU/s.
It raised median airborne victim-velocity error from 304.4 to 1,047.5 UU/s.

Resolving car-car contact before position integration produced mixed results.
Grounded victim mean position error fell from 242.6 to 223.7 UU.
Its median rose from 47.0 to 53.8 UU.
Angled victim mean fell from 384.2 to 355.2 UU, but only 5 of 12 paths improved.

Neither timing change is in the game.
The next prototype must produce a box-box contact manifold instead of changing tick order alone.

## Rejected response changes

Removing the physical car-car impulse caused large regressions in every group.
For example, median airborne attacker error rose from 122.5 to 458.8 UU.
The added Rocket League bump velocity does not replace rigid-body contact response.

Applying only 20 percent of each position correction had almost no effect.
It improved 10 of 30 grounded victim paths, but median error rose from 47.0 to 47.2 UU.
Attacker errors rose in all 57 paths.

Keep the current impulse and correction until the manifold prototype can replace them together.

## Accepted low side-manifold response

The car center of mass is 20.755 UU below the hitbox center.
The old one-point response applies a side impact at the hitbox center.
An 800 UU/s centered air impact then produces 5.17 rad/s of pitch.
RocketSim's box manifold produces 0.49 rad/s.

For nearly upright side impacts, Soccar now uses the lower edge of the contact face.
It produces 0.469 rad/s and matches RocketSim's post-bump speed within 0.1 UU/s.

| Group | Attacker median before | Candidate | Victim median before | Candidate |
|---|---:|---:|---:|---:|
| Ground | 258.2 UU | 8.5 UU | 47.0 UU | 22.4 UU |
| Air | 122.5 UU | 26.2 UU | 45.4 UU | 10.1 UU |
| Angled yaw | 599.0 UU | 80.1 UU | 101.7 UU | 71.6 UU |

Median rotation errors also fall from 11.6 to 1.2 degrees for grounded attackers.
They fall from 57.5 to 3.2 degrees for airborne victims.
Tilted and vertical impacts keep the approved response.

Only one changed path has a larger peak position error.
Its grounded victim rises from 87.5 to 106.9 UU.
The broader gains justify this approximation until Soccar gains a full contact manifold.
