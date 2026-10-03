"""Measure local collision surfaces. Never export source meshes into the public tree."""

import argparse
import json
from pathlib import Path
import struct
import subprocess

import numpy as np

from compare import ROOT, file_hash


def load_mesh(path):
    raw = path.read_bytes()
    triangles, vertices = struct.unpack_from("<ii", raw)
    if triangles <= 0 or vertices <= 0 or len(raw) != 8+12*(triangles+vertices):
        raise ValueError(f"Invalid collision mesh: {path}")
    indices = np.frombuffer(raw, dtype="<i4", count=triangles*3, offset=8).reshape(-1, 3)
    points = np.frombuffer(raw, dtype="<f4", count=vertices*3, offset=8+12*triangles).reshape(-1, 3)
    if indices.min() < 0 or indices.max() >= vertices:
        raise ValueError(f"Invalid triangle index: {path}")
    # RocketSim uses 50 UU per Bullet distance unit.
    return points.astype(np.float64)[indices] * 50


def nearest(triangles, point):
    a, b, c = (triangles[:, i] for i in range(3))
    ab, ac, bc = b-a, c-a, c-b
    normal = np.cross(ab, ac)
    lengths = np.linalg.norm(normal, axis=1)
    valid = lengths > 1e-10
    normal[valid] /= lengths[valid, None]
    d = np.einsum("ij,ij->i", point-a, normal)
    projected = point-d[:, None]*normal
    offset = projected-a
    aa = np.einsum("ij,ij->i", ab, ab)
    bb = np.einsum("ij,ij->i", ac, ac)
    cross = np.einsum("ij,ij->i", ab, ac)
    ua = np.einsum("ij,ij->i", offset, ab)
    ub = np.einsum("ij,ij->i", offset, ac)
    den = aa*bb-cross*cross
    u, v = np.zeros(len(a)), np.zeros(len(a))
    u[valid] = (bb[valid]*ua[valid]-cross[valid]*ub[valid])/den[valid]
    v[valid] = (aa[valid]*ub[valid]-cross[valid]*ua[valid])/den[valid]
    inside = valid & (u >= 0) & (v >= 0) & (u+v <= 1)
    choices = [projected]
    distances = [np.where(inside, d*d, np.inf)]
    for origin, edge in ((a, ab), (a, ac), (b, bc)):
        size = np.einsum("ij,ij->i", edge, edge)
        t = np.zeros(len(a))
        usable = size > 1e-10
        t[usable] = np.einsum("ij,ij->i", (point-origin)[usable], edge[usable])/size[usable]
        closest = origin+np.clip(t, 0, 1)[:, None]*edge
        choices.append(closest)
        distances.append(np.einsum("ij,ij->i", point-closest, point-closest))
    errors = np.asarray(distances)
    choice, index = np.unravel_index(np.argmin(errors), errors.shape)
    closest = choices[choice][index]
    distance = float(np.sqrt(errors[choice, index]))
    return dict(distance=distance, point=closest.tolist(),
                toward_query=((point-closest)/distance).tolist() if distance > 0 else [0, 0, 0])


def goal_section(triangles, height):
    result = []
    for triangle in triangles:
        points = []
        for i in range(3):
            a, b = triangle[i], triangle[(i+1) % 3]
            if a[2] == height:
                points.append(a[:2])
            elif (a[2]-height)*(b[2]-height) < 0:
                t = (height-a[2])/(b[2]-a[2])
                points.append((a+t*(b-a))[:2])
        points = list({tuple(p): p for p in points}.values())
        if len(points) == 2 and any(650 < p[0] < 1450 and 4650 < p[1] < 5500 for p in points):
            result.append([p.tolist() for p in points])
    return result


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--meshes", type=Path, required=True)
    parser.add_argument("--output", type=Path, default=ROOT / "artifacts/rocketsim-diff/goal-surfaces.json")
    parser.add_argument("--wasm", type=Path, default=ROOT / "public/simulation/soccar_simulation.wasm")
    args = parser.parse_args()
    paths = [args.meshes / "soccar" / f"mesh_{i}.cmf" for i in range(16)]
    triangles = np.concatenate([load_mesh(p) for p in paths])
    points = [[x, y, z] for z in (50, 100, 300, 550)
              for x in (750, 850, 900, 950, 1000, 1100, 1200)
              for y in (4900, 5000, 5060, 5100, 5140, 5200)]
    native = subprocess.run(["node", str(ROOT / "tools/rocketsim-diff/arena-query.mjs"), str(args.wasm.resolve())],
                            input=json.dumps(points), text=True, encoding="utf-8", capture_output=True, check=True)
    values = json.loads(native.stdout)
    samples = []
    for point, soccar in zip(points, values):
        closest = nearest(triangles, np.asarray(point))
        # The mesh does not include RocketSim's infinite floor and ceiling planes.
        floor, ceiling = point[2], 2044-point[2]
        if floor >= 0 and floor < closest["distance"]:
            closest = dict(distance=floor, point=[point[0], point[1], 0], toward_query=[0, 0, 1])
        if ceiling >= 0 and ceiling < closest["distance"]:
            closest = dict(distance=ceiling, point=[point[0], point[1], 2044], toward_query=[0, 0, -1])
        samples.append(dict(point=point, soccar=soccar, mesh=closest,
                            distance_error=soccar["distance"]-closest["distance"]))
    report = dict(mesh_sha256={p.name: file_hash(p) for p in paths},
                  wasm_sha256=file_hash(args.wasm),
                  probe_sha256=file_hash(Path(__file__)),
                  query_sha256=file_hash(Path(__file__).with_name("arena-query.mjs")),
                  notes="Mesh distance is unsigned. Interior/exterior classification is not inferred.",
                  samples=samples,
                  sections={str(z): goal_section(triangles, z) for z in (50, 100, 300, 550)})
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(report, indent=2)+"\n", encoding="utf-8", newline="\n")
    print(args.output)


if __name__ == "__main__":
    main()
