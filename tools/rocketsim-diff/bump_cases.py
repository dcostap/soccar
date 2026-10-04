"""Fixed car-car contacts across speed, offset, motion, angle, and grounding."""

import math

from scenarios import car, case, phase


def yaw(degrees):
    angle = math.radians(degrees) / 2
    return (0, 0, math.sin(angle), math.cos(angle))


def suite():
    cases = []
    for speed in (400, 800, 1200, 1800, 2300):
        for lateral in (0, 30, 60):
            for victim_speed in (0, 400):
                cases.append(case(
                    f"bump-ground-{speed}-{lateral}-{victim_speed}", "car-car-contact",
                    [car(pos=(-400, 0, 17), vel=(speed, 0, 0), grounded=True),
                     car(pos=(0, lateral, 17), vel=(victim_speed, 0, 0), grounded=True, team=1)],
                    [phase(240, {}, {})], meshes=True))
    for speed in (400, 800, 1200, 1800, 2300):
        for lateral in (0, 30, 60):
            cases.append(case(
                f"bump-air-{speed}-{lateral}", "car-car-contact",
                [car(pos=(-400, 0, 1000), vel=(speed, 0, 0)),
                 car(pos=(0, lateral, 1000), team=1)],
                [phase(120, {}, {})], meshes=True))
    for speed in (800, 1800, 2300):
        for lateral in (0, 40):
            for angle in (-30, 30):
                cases.append(case(
                    f"bump-angle-{speed}-{lateral}-{angle}", "car-car-contact",
                    [car(pos=(-400, 0, 17), vel=(speed, 0, 0), grounded=True),
                     car(pos=(0, lateral, 17), quat=yaw(angle), grounded=True, team=1)],
                    [phase(240, {}, {})], meshes=True))
    return cases
