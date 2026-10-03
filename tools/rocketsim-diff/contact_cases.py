"""Fixed car-ball contacts across penetration, speed, height, and lateral offset."""

from scenarios import body, car, case, phase


def suite():
    cases = []
    for lateral in (-40, 0, 40):
        for height in (125, 130, 135, 140, 145, 150):
            cases.append(case(f"contact-rest-{lateral}-{height}", "car-ball-contact",
                [car(pos=(0, 0, 17), grounded=True)], [phase(30, {})],
                body((30, lateral, height), (0, 0, -1)), meshes=True))
    for speed in (0, 400, 800, 1200):
        for lateral in (-40, 0, 40):
            for throttle in (0, 0.5):
                cases.append(case(f"contact-dribble-{speed}-{lateral}-{throttle}", "car-ball-contact",
                    [car(pos=(0, -1800, 17), vel=(speed, 0, 0), grounded=True)],
                    [phase(240, dict(throttle=throttle))],
                    body((30, -1800+lateral, 130), (speed, 0, 0)), meshes=True))
    for grounded, height in ((True, 93.15), (True, 130), (False, 1300)):
        for speed in (400, 1200, 2200):
            for lateral in (0, 40, 80):
                z = 17 if grounded else 1300
                cases.append(case(
                    f"contact-hit-{'ground' if grounded else 'air'}-{height}-{speed}-{lateral}",
                    "car-ball-contact", [car(pos=(-300, 0, z), vel=(speed, 0, 0), grounded=grounded)],
                    [phase(120, {})], body((0, lateral, height)), meshes=True))
    return cases
