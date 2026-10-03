# RocketSim comparison

This local tool compares Soccar with the pinned RocketSim Python build.
It does not form part of the browser build or shipped Rust crates.
See [the Phase 0 report](PHASE0.md) before changing physics.

## Install and run

Use Python 3.12 and the existing Rust toolchain.
Run these commands from the repository root on Windows:

```sh
python -m venv artifacts/rocketsim-diff/venv
artifacts/rocketsim-diff/venv/Scripts/python.exe -m pip install --only-binary=:all: -r tools/rocketsim-diff/requirements.txt
cargo build --release --locked --manifest-path tools/rocketsim-diff/native/Cargo.toml
artifacts/rocketsim-diff/venv/Scripts/python.exe tools/rocketsim-diff/check_harness.py
artifacts/rocketsim-diff/venv/Scripts/python.exe tools/rocketsim-diff/compare.py --match-controls --meshes artifacts/rocketsim-diff/dumper/collision_meshes
```

On Linux, replace `Scripts/python.exe` with `bin/python`.
The native runner uses a separate Cargo target directory.
Use `--no-build` after a build, or `--filter steer-` to select cases.
Use `--output <folder>` to keep separate reports before and after each change.

The report contains peak, RMS, and final errors for each body.
It also reports state-flag differences, boost, handbrake value, and pad cooldowns.
Trace files contain both states and their differences at each tick.
`inputs.json` preserves the scenario inputs.
The report records the simulation version, binary hashes, suite hash, and mesh hashes.

`phase0.json` preserves the first measured engine, not an acceptance baseline.
Do not replace it when a new engine differs.
Keep later measurements in separate reports.

## Get local meshes

The Epic install is `F:/games/rocketleague` on this machine.
Epic records build `++Prime+Update60-CL-528869-pchotfix4`.
Do not copy authentication arguments from a game process into reports.

1. Use Epic's **Launch without EAC** option.
2. Enter unpaused Free Play on a standard Soccar map, such as DFH Stadium.
3. Check that no Rocket League EAC process is running.
4. Run [RLArenaCollisionDumper](https://github.com/ZealanL/RLArenaCollisionDumper) from a local artifact folder.
5. Give `--meshes` the output folder that contains `soccar/`, not `soccar/` itself.

Epic supports [offline play without EAC](https://www.epicgames.com/help/c-37599050/a10791900).
The dumper briefly patches the game process, then restores its instructions.
Do not stop it while it waits for the patched function.
Keep Free Play unpaused until the dumper reports completion.
This audit used release `v1.0.0` and obtained 16 Soccar meshes.
The dumper executable SHA-256 was `91a40fc8d705a4c44b692c534f826253cf7b60b34bfacd4b90c6f6029875e5c5`.

Keep mesh files and third-party binaries under ignored `artifacts/`.
Game ownership does not establish permission to distribute game assets.
No game mesh forms part of this public repository or the Pages build.

## Compare equivalent inputs

Both engines step at 120 Hz.
The tool rounds shared scalar inputs to `f32` before giving them to either engine.
It checks starting position, velocity, rotation, boost, and exposed state flags.
Each phase holds controls for its exact tick count.
Rotation error uses normalized quaternions and the shortest angle.
Soccar has no stored ball orientation, so the tool compares ball angular velocity only.

Soccar reverses RocketSim's steer, yaw, and roll input signs.
`--match-controls` applies that sign conversion only in the native test input.
It does not change the game, bots, browser controls, or `Controls.dodge_mag`.
Without this option, identical numeric controls test the API difference rather than equivalent actions.

Without meshes, the tool uses RocketSim's `THE_VOID` mode with explicit Soccar mutators.
It skips ground cases and checks that Soccar bodies stay away from arena geometry.
Never present a mesh-free run as a full arena comparison.

RocketSim freezes balls with exactly zero linear and angular velocity.
Normal airborne cases start with a small downward velocity in both engines.
`ball-zero-motion-sleep` measures the zero-motion difference separately.
Do not mistake it for an error in gravity.

## Limits and next checks

This is a physics-world harness, not a match-clock harness.
It does not yet compare countdowns, kickoff scheduling, or scoring rules.
Multi-car cases use a fixed native contact order, not the match's seeded order.
Demo respawn locations do not share a random source, so later position errors include that difference.
Pad matching reports the existing two-unit pad-position difference instead of hiding it.

The scenarios isolate useful actions, but they do not cover every contact point or speed.
Long contact traces can amplify an early collision difference.
Use peak and final errors together; inspect first contact before changing a solver.
Reports are measurements, not a claim that Rocket League and Soccar agree.

Keep native/WASM checks exact.
Keep RocketSim tolerances separate from the deterministic regression hashes.
Archive incompatible recordings before changing physics.
Re-record the deterministic baseline once per approved, explained behavior batch.

## Licenses

[RocketSim](https://github.com/ZealanL/RocketSim/blob/main/LICENSE) uses MIT, copyright 2022 ZealanL.
Retain its copyright and permission notice when copying substantial source code.
The installed Python wheel includes that license.
Its PyPI provenance identifies source commit `2da51b1dac7b8127127613a5ff30e490bdd70dd8`.

[Bundled Bullet](https://github.com/ZealanL/RocketSim/blob/main/libsrc/bullet3-3.24/LICENSE.txt) uses zlib.
Retain its notice, identify changed source, and do not misrepresent its origin.
Its license excludes `Extras` and `examples/ThirdPartyLibs`; check such files separately before using them.

The [dumper](https://github.com/ZealanL/RLArenaCollisionDumper/blob/main/LICENSE) uses MIT, copyright 2023 ZealanL.
These source licenses do not grant rights to Rocket League meshes.
This harness uses external packages; it does not copy RocketSim or Bullet implementations into Soccar.
