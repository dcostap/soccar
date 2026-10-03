"""A fixed goal neighborhood. Do not change cases to hide a physics regression."""

import math

from scenarios import body, car, case, phase


def suite():
    cases = []
    for sx in (-1, 1):
        for sy in (-1, 1):
            tag = f"x{sx}-y{sy}"
            for x in (780, 830, 880, 930, 1000, 1250):
                for speed in (500, 1500):
                    cases.append(case(f"goal-car-{tag}-{x}-{speed}", "goal-geometry",
                        [car(pos=(sx*x, sy*4700, 17), vel=(0, sy*speed, 0), grounded=True,
                             quat=(0, 0, sy*math.sqrt(0.5), math.sqrt(0.5)))],
                        [phase(180, dict(throttle=1))], meshes=True))
            for x in (780, 830, 930, 1000):
                for height in (93.15, 150, 550):
                    cases.append(case(f"goal-ball-{tag}-{x}-{height}", "goal-geometry",
                        phases=[phase(240)], ball=body((sx*x, sy*4700, height), (0, sy*1200, 0)),
                        meshes=True))
    return cases
