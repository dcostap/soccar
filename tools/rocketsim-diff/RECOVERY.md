# Recovery and torque order

## Change

The simulation version changed from `90163d5a55fc7b2c` to `dcc6aac2894ceb94`.
Local results, exports, and the old WASM are in `artifacts/archive/before-recovery-order/`.

Soccar now uses RocketSim's car-controller order for these operations:

1. Apply air torque before jump and flip updates.
2. Start an automatic flip before testing for a double jump or dodge.
3. Block air control and another jump while an automatic flip is active.
4. Apply automatic roll only while throttle is nonzero.
5. Use RocketSim's roll sign for automatic-flip torque.
6. Set an expired automatic-flip timer to zero.

These rules match pinned RocketSim source commit `2da51b1dac7b8127127613a5ff30e490bdd70dd8`.
The source constants already matched: 200 UU impulse, 50 torque, 0.4 seconds, 2.8 radians, and a `sqrt(0.5)` normal threshold.

## Results

The 78-case reference suite passed without blocked cases.

| Case | Measure | Before | After |
|---|---|---:|---:|
| Landing on roof with jump | Peak position | 48.88 UU | 14.21 UU |
| Landing on roof with jump | Peak rotation | 179.82 degrees | 4.40 degrees |
| Roof automatic flip | Peak position | 81.01 UU | 36.23 UU |
| Roof automatic flip | Peak rotation | 179.20 degrees | 5.59 degrees |
| Front-flip cancel | Peak rotation | 3.32 degrees | 0.000043 degrees |
| Front flip | Peak rotation | 3.32 degrees | 2.58 degrees |
| Side flip | Peak rotation | 3.84 degrees | 3.44 degrees |

The change does not improve every contact path.
Peak struck-car position error in `bump-800` rose from 65.72 to 102.18 UU.
The zero-throttle automatic-roll rule still stays because it matches the reference controller.
Car contact response remains a separate audit.

All 4,320 fixed defense inputs still meet their acceptance checks.
Seven idle-defender concession times changed and were remeasured in place.
Scenario text, hashes, coverage plans, and rejection counts stayed unchanged.

The approved regression baseline contains 191,277 states and 849,698,383 fields.
An independent full run matched every native and WASM field exactly.

Combined single-match throughput was 55,019 physics ticks per second.
It was 55,087 before this change.
The 15-worker batch measured 457,121 ticks per second, compared with 453,891 before.
Changed trajectories prevent an equal-work instruction-cost comparison.

Do not compare post-respawn position peaks in `bump-2300`.
RocketSim chooses demo respawn locations from an uncontrolled random source in this harness.
