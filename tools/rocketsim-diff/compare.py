"""Local trajectory comparison. This tool does not change simulation code or assets."""

import argparse
import hashlib
import importlib.metadata
import json
import math
import os
from pathlib import Path
import platform
import struct
import subprocess
import sys

from scenarios import suite

ROOT = Path(__file__).resolve().parents[2]
FLAGS = ("is_on_ground", "has_jumped", "has_double_jumped", "has_flipped",
         "is_supersonic", "is_demoed")


def f32(value):
    """Give both engines the same representable scalar inputs."""
    if isinstance(value, bool):
        return value
    if isinstance(value, (int, float)):
        return struct.unpack("f", struct.pack("f", value))[0]
    if isinstance(value, list):
        return [f32(v) for v in value]
    if isinstance(value, dict):
        return {key: (v if key in ("ticks", "team") else f32(v)) for key, v in value.items()}
    return value


def basis_from_quat(q):
    x, y, z, w = (v / math.sqrt(sum(a*a for a in q)) for v in q)
    return [[1-2*(y*y+z*z), 2*(x*y+w*z), 2*(x*z-w*y)],
            [2*(x*y-w*z), 1-2*(x*x+z*z), 2*(y*z+w*x)],
            [2*(x*z+w*y), 2*(y*z-w*x), 1-2*(x*x+y*y)]]


def quat_from_basis(basis):
    # Columns hold body axes. Normalize the extracted quaternion to remove f32 drift.
    m = [[basis[j][i] for j in range(3)] for i in range(3)]
    trace = sum(m[i][i] for i in range(3))
    if trace > 0:
        s = math.sqrt(trace + 1) * 2
        q = [(m[2][1]-m[1][2])/s, (m[0][2]-m[2][0])/s,
             (m[1][0]-m[0][1])/s, s/4]
    else:
        i = max(range(3), key=lambda k: m[k][k])
        j, k = (i+1) % 3, (i+2) % 3
        s = math.sqrt(max(0, 1+m[i][i]-m[j][j]-m[k][k])) * 2
        q = [0.0]*4
        q[i] = s/4
        q[j] = (m[j][i]+m[i][j])/s
        q[k] = (m[k][i]+m[i][k])/s
        q[3] = (m[k][j]-m[j][k])/s
    length = math.sqrt(sum(v*v for v in q))
    return [v/length for v in q]


def rotation_error(a, b):
    qa, qb = quat_from_basis(a), quat_from_basis(b)
    if sum(x*y for x, y in zip(qa, qb)) < 0:
        qb = [-v for v in qb]
    # Chord length is stable near zero, unlike acos(dot).
    chord = math.sqrt(sum((x-y)**2 for x, y in zip(qa, qb)))
    return math.degrees(4 * math.asin(min(1, chord/2)))


def errors(a, b):
    result = {key: math.dist(a[key], b[key]) for key in ("pos", "vel", "ang_vel")}
    if "basis" in a:
        result["rotation_deg"] = rotation_error(a["basis"], b["basis"])
        result["boost"] = abs(a["boost"]-b["boost"])
        result["handbrake"] = abs(a["handbrake"]-b["handbrake"])
        result["flags"] = [key for key in FLAGS if a["flags"][key] != b["flags"][key]]
    return result


def rs_frame(arena, cars):
    ball = arena.ball.get_state()
    def motion(state):
        return {key: list(getattr(state, key).as_tuple()) for key in ("pos", "vel", "ang_vel")}
    values = []
    for car in cars:
        state = car.get_state()
        values.append(dict(**motion(state), basis=[list(v.as_tuple()) for v in state.rot_mat.as_tuple()], boost=state.boost,
                           handbrake=state.handbrake_val,
                           flags={key: bool(getattr(state, key)) for key in FLAGS}))
    pads = [dict(pos=list(p.get_pos().as_tuple()), big=p.is_big,
                 cooldown=p.get_state().cooldown) for p in arena.get_boost_pads()]
    return dict(tick=arena.tick_count, ball=motion(ball), cars=values, pads=pads)


def reference(rs, data, meshes):
    mode = rs.GameMode.SOCCAR if meshes else rs.GameMode.THE_VOID
    arena = rs.Arena(mode, tick_rate=120.0)
    # Explicit Soccar mutators also apply in THE_VOID. No fabricated mesh is used.
    arena.set_mutator_config(rs.MutatorConfig(rs.GameMode.SOCCAR))
    ball = data["ball"]
    arena.ball.set_state(rs.BallState(**{k: rs.Vec(*v) for k, v in ball.items()}))
    cars = []
    for initial in data["cars"]:
        car = arena.add_car(rs.Team.BLUE if initial["team"] == 0 else rs.Team.ORANGE,
                            rs.CarConfig.OCTANE)
        fields = {k: initial[k] for k in ("boost", "is_on_ground", "has_jumped", "jump_time",
                                          "air_time", "air_time_since_jump")}
        fields.update({k: rs.Vec(*v) for k, v in initial["body"].items()})
        fields["rot_mat"] = rs.RotMat(*[rs.Vec(*v) for v in basis_from_quat(initial["quat"])])
        car.set_state(rs.CarState(**fields))
        cars.append(car)
    yield rs_frame(arena, cars)
    for phase in data["phases"]:
        for car, controls in zip(cars, phase["controls"]):
            car.set_controls(rs.CarControls(**controls))
        for _ in range(phase["ticks"]):
            arena.step(1)
            yield rs_frame(arena, cars)


def compare_case(rs, scenario, binary, output, meshes, match_controls=False):
    data = f32(scenario["input"])
    native_data = json.loads(json.dumps(data))
    if match_controls:
        for phase in native_data["phases"]:
            for controls in phase["controls"]:
                controls["yaw"] *= -1
                controls["roll"] *= -1
                controls["steer"] *= -1
    trace = subprocess.run([str(binary)], input=json.dumps(native_data), text=True,
                           encoding="utf-8", capture_output=True, check=True)
    native = [json.loads(line) for line in trace.stdout.splitlines()]
    expected = 1+sum(p["ticks"] for p in data["phases"])
    if len(native) != expected:
        raise ValueError("Native trace length does not match inputs")
    maxima, squared, final, flag_ticks, count = {}, {}, {}, {}, 0
    pad_pairs, pad_layout = [], []
    initial_error = {}
    filename = output / (scenario["name"] + ".jsonl")
    with filename.open("w", encoding="utf-8", newline="\n") as out:
        for tick, ref in enumerate(reference(rs, data, meshes)):
            state = native[tick]
            if state["tick"] != tick or ref["tick"] != tick:
                raise ValueError("Engines did not step at the same tick")
            if len(state["cars"]) != len(ref["cars"]):
                raise ValueError("Engine car counts differ")
            if not meshes:
                # THE_VOID is valid only while Soccar cannot touch its arena.
                if state["ball"]["arena_clearance"] <= 94:
                    raise ValueError("Mesh-free ball reached arena geometry")
                if any(c["arena_clearance"] <= 120 for c in state["cars"]):
                    raise ValueError("Mesh-free car reached arena geometry")
            diffs = {"ball": errors(state["ball"], ref["ball"])}
            diffs.update({f"car{i}": errors(a, b)
                          for i, (a, b) in enumerate(zip(state["cars"], ref["cars"]))})
            if tick == 0:
                initial_error = diffs
                for body in diffs.values():
                    if (body["pos"] > 0.001 or body["vel"] > 0.001 or body["ang_vel"] > 0.0001
                            or body.get("rotation_deg", 0) > 0.01 or body.get("boost", 0) > 0.0001
                            or body.get("flags", [])):
                        raise ValueError("Initial states differ; comparison is invalid")
                if meshes:
                    unused = set(range(len(ref["pads"])))
                    for i, pad in enumerate(state["pads"]):
                        j = min(unused, key=lambda n: math.dist(pad["pos"][:2], ref["pads"][n]["pos"][:2]))
                        other = ref["pads"][j]
                        distance = math.dist(pad["pos"][:2], other["pos"][:2])
                        if distance > 4 or pad["big"] != other["big"]:
                            raise ValueError("Boost pad layout cannot be matched")
                        unused.remove(j)
                        pad_pairs.append((i, j))
                        if distance:
                            pad_layout.append(dict(native=i, reference=j, xy_error=distance))
                    if unused:
                        raise ValueError("Boost pad counts differ")
            if pad_pairs:
                diffs["pads"] = {"cooldown": max(abs(state["pads"][i]["cooldown"] -
                                                     ref["pads"][j]["cooldown"]) for i, j in pad_pairs)}
            out.write(json.dumps(dict(tick=tick, soccar=state, rocketsim=ref, error=diffs), allow_nan=False)+"\n")
            if tick == 0:
                continue
            count += 1
            for body, fields in diffs.items():
                for field, value in fields.items():
                    key = body+"."+field
                    if field == "flags":
                        for flag in value:
                            flag_key = body+"."+flag
                            info = flag_ticks.setdefault(flag_key, dict(first_tick=tick, count=0))
                            info["count"] += 1
                        continue
                    if key not in maxima or value > maxima[key]["value"]:
                        maxima[key] = dict(value=value, tick=tick)
                    squared[key] = squared.get(key, 0)+value*value
                    final[key] = value
    if count+1 != expected:
        raise ValueError("Reference trace length does not match inputs")
    return dict(name=scenario["name"], subsystem=scenario["subsystem"], ticks=count,
                subjects=(["ball"] if not data["cars"] else
                          [f"car{i}" for i in range(len(data["cars"]))] +
                          (["ball"] if scenario["subsystem"] == "car-ball" else [])),
                simulation_version=native[0]["simulation_version"],
                initial_error=initial_error, maximum=maxima,
                rms={k: math.sqrt(v/count) for k, v in squared.items()},
                final=final, flag_mismatch=flag_ticks, pad_layout_error=pad_layout)


def file_hash(path):
    h = hashlib.sha256()
    with path.open("rb") as stream:
        for block in iter(lambda: stream.read(1024*1024), b""):
            h.update(block)
    return h.hexdigest()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--meshes", type=Path, help="Local collision-meshes folder from the dumper")
    parser.add_argument("--output", type=Path, default=ROOT / "artifacts/rocketsim-diff/run")
    parser.add_argument("--filter", default="", help="Scenario name substring")
    parser.add_argument("--no-build", action="store_true")
    parser.add_argument("--match-controls", action="store_true",
                        help="Reverse Soccar steer, yaw, and roll inputs to match RocketSim's signs")
    args = parser.parse_args()
    import RocketSim as rs
    if importlib.metadata.version("rocketsim") != "2.2.1":
        parser.error("Install the pinned requirements first")
    args.output.mkdir(parents=True, exist_ok=True)
    mesh_hashes = {}
    if args.meshes:
        args.meshes = args.meshes.resolve()
        if not args.meshes.is_dir():
            parser.error("Mesh folder does not exist")
        mesh_hashes = {p.relative_to(args.meshes).as_posix(): file_hash(p)
                       for p in sorted(args.meshes.rglob("*")) if p.is_file()}
        rs.init(str(args.meshes))
    manifest = ROOT / "tools/rocketsim-diff/native/Cargo.toml"
    if not args.no_build:
        subprocess.run(["cargo", "build", "--locked", "--release", "--manifest-path", str(manifest)], check=True)
    binary = manifest.parent / "target/release" / ("soccar-diff-trace.exe" if os.name == "nt" else "soccar-diff-trace")
    selected = [s for s in suite() if args.filter in s["name"]]
    if not selected:
        parser.error("No scenarios match the filter")
    report = dict(schema=1, reference="rocketsim==2.2.1", tick_rate=120,
                  reference_mode="SOCCAR" if args.meshes else "THE_VOID + Soccar mutators",
                  native_control_signs=dict(yaw=-1 if args.match_controls else 1,
                                            roll=-1 if args.match_controls else 1,
                                            pitch=1, steer=-1 if args.match_controls else 1, throttle=1),
                  complete=False, python=sys.version, platform=platform.platform(),
                  soccar_commit=subprocess.check_output(["git", "rev-parse", "HEAD"], cwd=ROOT, text=True).strip(),
                  native_binary_sha256=file_hash(binary),
                  reference_binary_sha256=file_hash(Path(rs.__file__)),
                  suite_sha256=file_hash(Path(__file__).with_name("scenarios.py")),
                  harness_sha256=file_hash(Path(__file__)),
                  mesh_sha256=mesh_hashes, results=[], blocked=[],
                  unsupported=["match countdown and kickoff timing", "ball orientation (Soccar does not store it)",
                               "seeded simultaneous contact ordering", "recording compatibility"])
    for scenario in selected:
        if scenario["meshes"] and not args.meshes:
            report["blocked"].append(dict(name=scenario["name"], reason="Requires real arena meshes"))
            continue
        print(scenario["name"], flush=True)
        report["results"].append(compare_case(rs, scenario, binary, args.output, bool(args.meshes), args.match_controls))
    report["simulation_version"] = report["results"][0]["simulation_version"] if report["results"] else None
    report["suite_complete"] = not report["blocked"]
    (args.output / "inputs.json").write_text(json.dumps(selected, indent=2)+"\n", encoding="utf-8", newline="\n")
    report["ranking_by_position"] = sorted(
        [dict(name=r["name"], maximum=max(v["value"] for k, v in r["maximum"].items()
                                         if k.endswith(".pos") and k.split(".")[0] in r["subjects"]))
         for r in report["results"] if r["subsystem"] != "reference-sleep"],
        key=lambda r: r["maximum"], reverse=True)
    (args.output / "report.json").write_text(json.dumps(report, indent=2, allow_nan=False)+"\n", encoding="utf-8", newline="\n")
    print(f"Measured {len(report['results'])}; blocked {len(report['blocked'])}. Report: {args.output / 'report.json'}")


if __name__ == "__main__":
    main()
