"""Run harness checks. Build the native trace runner before this command."""

import json
import math
import os
from pathlib import Path
import subprocess
import struct
import tempfile
import unittest

import RocketSim as rs
import numpy as np

from compare import ROOT, basis_from_quat, compare_case, f32, reference, rotation_error
from scenarios import suite
from inspect_mesh import goal_section, load_mesh, nearest
from goal_cases import suite as goal_suite
from contact_cases import suite as contact_suite

BINARY = ROOT / "tools/rocketsim-diff/native/target/release" / (
    "soccar-diff-trace.exe" if os.name == "nt" else "soccar-diff-trace")


class HarnessChecks(unittest.TestCase):
    def test_nearest_triangle_face_edge_and_vertex(self):
        triangles = np.asarray([[[0, 0, 0], [1, 0, 0], [0, 1, 0]]], dtype=float)
        for point, distance, expected in (
            ([0.2, 0.3, 1], 1, [0.2, 0.3, 0]),
            ([-0.5, 0.3, 0], 0.5, [0, 0.3, 0]),
            ([-1, -1, 0], math.sqrt(2), [0, 0, 0]),
        ):
            actual = nearest(triangles, np.asarray(point))
            self.assertAlmostEqual(actual["distance"], distance)
            np.testing.assert_allclose(actual["point"], expected, atol=1e-10)

    def test_nearest_triangle_with_zero_area(self):
        triangles = np.asarray([[[0, 0, 0], [0, 0, 0], [0, 0, 0]]], dtype=float)
        self.assertEqual(nearest(triangles, np.asarray([0, 0, 2]))["distance"], 2)

    def test_mesh_format_and_bullet_scale(self):
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / "synthetic.cmf"
            data = struct.pack("<2i3i9f", 1, 3, 0, 1, 2, 0, 0, 0, 1, 0, 0, 0, 1, 0)
            path.write_bytes(data)
            self.assertEqual(load_mesh(path)[0, 1].tolist(), [50, 0, 0])
            path.write_bytes(data+b"x")
            with self.assertRaisesRegex(ValueError, "Invalid collision mesh"):
                load_mesh(path)
            path.write_bytes(struct.pack("<2i3i", 1, 3, 0, 1, 3)+data[20:])
            with self.assertRaisesRegex(ValueError, "Invalid triangle index"):
                load_mesh(path)

    def test_section_through_a_vertex(self):
        triangles = np.asarray([[[850, 5000, 0], [850, 5100, 2], [900, 5200, 1]]], dtype=float)
        section = goal_section(triangles, 1)
        self.assertEqual(len(section), 1)
        self.assertEqual(sorted(section[0]), [[850, 5050], [900, 5200]])

    def test_rotation_identity(self):
        basis = basis_from_quat([0.1, -0.4, 0.3, 0.8])
        self.assertLess(rotation_error(basis, basis), 1e-10)

    def test_rotation_half_turn(self):
        identity = basis_from_quat([0, 0, 0, 1])
        for axis in ([1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0]):
            self.assertAlmostEqual(rotation_error(identity, basis_from_quat(axis)), 180)

    def test_rotation_small_angle_and_quaternion_sign(self):
        angle = 0.00001
        q = [0, 0, math.sin(angle/2), math.cos(angle/2)]
        basis = basis_from_quat(q)
        self.assertAlmostEqual(rotation_error(basis_from_quat([0, 0, 0, 1]), basis), math.degrees(angle))
        self.assertLess(rotation_error(basis, basis_from_quat([-v for v in q])), 1e-10)

    def test_f32_preserves_protocol_types(self):
        values = f32(dict(phases=[dict(ticks=120, controls=[dict(jump=True, throttle=0.1)])], team=0))
        self.assertIs(type(values["phases"][0]["ticks"]), int)
        self.assertIs(type(values["team"]), int)
        self.assertIs(values["phases"][0]["controls"][0]["jump"], True)
        self.assertNotEqual(values["phases"][0]["controls"][0]["throttle"], 0.1)

    def test_scenarios_are_unique_and_controls_cover_cars(self):
        cases = suite() + goal_suite() + contact_suite()
        self.assertEqual(len(cases), len({s["name"] for s in cases}))
        for scenario in cases:
            for phase in scenario["input"]["phases"]:
                self.assertGreater(phase["ticks"], 0)
                self.assertEqual(len(phase["controls"]), len(scenario["input"]["cars"]))

    def test_reference_active_ball_falls(self):
        data = next(s["input"] for s in suite() if s["name"] == "ball-freefall")
        frames = list(reference(rs, f32(data), False))
        self.assertEqual(len(frames), 121)
        self.assertLess(frames[1]["ball"]["vel"][2], -6)

    def test_reference_zero_motion_sleep_is_separate(self):
        data = next(s["input"] for s in suite() if s["name"] == "ball-zero-motion-sleep")
        frames = list(reference(rs, f32(data), False))
        self.assertEqual(frames[0]["ball"], frames[-1]["ball"])

    def test_native_rejects_incomplete_controls(self):
        data = next(s["input"] for s in suite() if s["name"] == "air-coast")
        data["phases"][0]["controls"] = []
        result = subprocess.run([str(BINARY)], input=json.dumps(data), text=True, capture_output=True)
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("one control object per car", result.stderr)

    def test_native_repeats_exactly(self):
        data = f32(next(s["input"] for s in suite() if s["name"] == "air-mixed"))
        def run():
            return subprocess.run([str(BINARY)], input=json.dumps(data), text=True,
                                  capture_output=True, check=True).stdout
        self.assertEqual(run(), run())

    def test_matched_controls_remove_sign_error(self):
        scenario = next(s for s in suite() if s["name"] == "air-yaw-left")
        with tempfile.TemporaryDirectory() as tmp:
            raw = compare_case(rs, scenario, BINARY, Path(tmp), False)
            matched = compare_case(rs, scenario, BINARY, Path(tmp), False, True)
        self.assertGreater(raw["maximum"]["car0.rotation_deg"]["value"], 170)
        self.assertLess(matched["maximum"]["car0.rotation_deg"]["value"], 0.001)
        self.assertLess(matched["maximum"]["car0.pos"]["value"], 0.001)


if __name__ == "__main__":
    unittest.main()
