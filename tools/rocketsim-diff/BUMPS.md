# Car-car contact audit

## Fixed suite

The bump suite adds 57 paths:

- 30 grounded rear impacts across five attacker speeds, three lateral offsets, and two victim speeds.
- 15 airborne impacts across five attacker speeds and three lateral offsets.
- 12 angled grounded impacts across three attacker speeds, two lateral offsets, and two victim yaws.

Run it with `compare.py --suite bumps`.
The suite stops before normal demolition respawns.

## Approved baseline

| Group | Cases | Attacker median | Attacker mean | Victim median | Victim mean |
|---|---:|---:|---:|---:|---:|
| Ground | 30 | 258.2 UU | 563.4 UU | 47.0 UU | 242.6 UU |
| Air | 15 | 122.5 UU | 258.9 UU | 45.4 UU | 49.5 UU |
| Angled | 12 | 599.0 UU | 921.3 UU | 101.7 UU | 384.2 UU |

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
