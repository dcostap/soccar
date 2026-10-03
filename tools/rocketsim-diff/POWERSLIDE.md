# Powerslide-rate batch

The only physics change is the handbrake rise rate: 6.5 to 5 per second.
The fall rate remains 2 per second.
`Controls.dodge_mag`, browser input, bot modules, and control signs remain unchanged.

The reference used the same 16 local meshes and all 78 Phase 0 cases.
The simulation version changed from `09645b7b1e85f2e6` to `90163d5a55fc7b2c`.
Local full traces are in `artifacts/rocketsim-diff/powerslide-after/`.

## Measured improvement

Handbrake-state error fell from 0.225 to less than 0.000001 at all four state-test speeds.
The remaining peak value error is 0.000000477, consistent with the reference's `f32` accumulation.

These ground cases hold throttle, steering, and handbrake for one second:

| Starting speed, UU/s | Position error before, UU | Position error after, UU | Rotation error before | Rotation error after |
| --- | --- | --- | --- | --- |
| 0 | 5.228 | 4.298 | 2.153 degrees | 1.445 degrees |
| 500 | 12.430 | 6.713 | 2.986 degrees | 2.802 degrees |
| 1000 | 25.388 | 8.054 | 6.331 degrees | 2.987 degrees |
| 1500 | 32.920 | 9.528 | 7.134 degrees | 2.882 degrees |
| 2200 | 42.781 | 10.494 | 6.952 degrees | 2.147 degrees |

These figures show an improvement, not exact ground-controller agreement.
The larger geometry, contact, and recovery differences remain unchanged by this rate fix.
Demo-case metrics can change across reference runs because its respawn location uses an uncontrolled random source.

## Compatibility and checks

The deterministic baseline was recorded once for this explained, approved physics change.
The full native/WASM check then passed against that baseline without tolerances.
It compared 180,023 states and 798,801,524 fields across 16 cases.

Old recordings now fail the engine-version check.
Recorded player suites moved into `arena/scenarios/archive/before-powerslide-5/` without changing their contents.
Local arena results and exports moved into `artifacts/archive/before-powerslide-5/`.
The browser database still preserves old recordings for download and matching-engine recovery.
The old recording fixture remains as a rejection test.
The clip-tail regression now uses a current-engine synthetic scenario rather than an obsolete player recording.
All 4,320 fixed defense measurements passed the arena's current-physics checks without changing scenario inputs or measured values.
Only their engine-version labels changed. The old metadata remains in the local archive.

The presentation and replay fixtures now use seed 12371: score 4–3 and 55,324 physics ticks.
That seed retains overtime, save, and demolition coverage.
Use [Phase 0](PHASE0.md) for the next subsystem priorities.

## Observed performance

Both benchmark batches used 15 workers, leaving one logical CPU free.
The single-match median changed from 782 ms to 908 ms.
The three matches now have different scores and tick counts, so their run times are not equal-work comparisons.
Their combined tick rate changed from 56,842 to 55,087 ticks/s, about 3% lower.
The 60-match batch changed from 547,175 to 453,891 ticks/s, about 17% lower.

The code change adds no operations, allocations, or geometry queries.
Changed trajectories also change bot and contact work.
These measurements do not isolate instruction cost, and they do not show a performance gain.
Keep this observed cost visible when planning larger contact or geometry changes.
