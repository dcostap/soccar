"""Fixed inputs for one physics subsystem at a time. Units are UU and seconds."""

import math


def body(pos=(2000, -2000, 1300), vel=(0, 0, -1), ang_vel=(0, 0, 0)):
    return dict(pos=list(pos), vel=list(vel), ang_vel=list(ang_vel))


def car(pos=(0, 0, 1000), vel=(0, 0, 0), quat=(0, 0, 0, 1),
        boost=50, grounded=False, jumped=False, team=0, ang_vel=(0, 0, 0)):
    return dict(body=body(pos, vel, ang_vel), quat=list(quat), boost=boost, team=team,
                is_on_ground=grounded, has_jumped=jumped,
                jump_time=0.05 if jumped else 0,
                air_time=0.05 if jumped else 0,
                air_time_since_jump=0.05 if jumped else 0)


def phase(ticks=120, *controls):
    defaults = dict(throttle=0, steer=0, pitch=0, yaw=0, roll=0,
                    jump=False, boost=False, handbrake=False)
    return dict(ticks=ticks, controls=[dict(defaults, **c) for c in controls])


def case(name, subsystem, cars=(), phases=None, ball=None, meshes=False):
    cars = list(cars)
    return dict(name=name, subsystem=subsystem, meshes=meshes,
                input=dict(ball=ball or body(), cars=cars,
                           phases=phases or [phase(120, *[{} for _ in cars])]))


def suite():
    cases = []
    for name, controls in [
        ("coast", {}), ("throttle", dict(throttle=1)), ("reverse", dict(throttle=-1)),
        ("boost", dict(boost=True)), ("pitch-up", dict(pitch=1)),
        ("pitch-down", dict(pitch=-1)), ("yaw-left", dict(yaw=1)),
        ("yaw-right", dict(yaw=-1)), ("roll-left", dict(roll=1)),
        ("roll-right", dict(roll=-1)), ("mixed", dict(pitch=0.4, yaw=-0.7, roll=0.2)),
    ]:
        cases.append(case("air-" + name, "air", [car()], [phase(120, controls)]))
    cases.append(case("air-damping", "air", [car(ang_vel=(1, -2, 0.5))]))
    cases.append(case("air-boost-release", "boost", [car()],
                      [phase(1, dict(boost=True)), phase(119, {})]))
    cases.append(case("air-boost-empty", "boost", [car(boost=1)],
                      [phase(120, dict(boost=True))]))
    for speed in (0, 500, 1500, 2200):
        cases.append(case(f"air-handbrake-state-{speed}", "handbrake-state",
                          [car(vel=(speed, 0, 0))],
                          [phase(24, dict(handbrake=True)), phase(60, {})]))
    for name, controls in [
        ("double", {}), ("front", dict(pitch=-1)), ("back", dict(pitch=1)),
        ("side-left", dict(yaw=-1)), ("side-right", dict(yaw=1)),
        ("diagonal", dict(pitch=-1, yaw=1)),
    ]:
        cases.append(case("postjump-" + name, "flip", [car(jumped=True, vel=(600, 0, 100))],
                          [phase(1, dict(jump=True, **controls)), phase(119, controls)]))
    cases.append(case("postjump-front-cancel", "flip", [car(jumped=True, vel=(600, 0, 100))],
                      [phase(1, dict(jump=True, pitch=-1)), phase(19, {}),
                       phase(100, dict(pitch=1))]))
    cases.append(case("ball-freefall", "ball-air", ball=body((0, 0, 1300))))
    cases.append(case("ball-zero-motion-sleep", "reference-sleep",
                      ball=body((0, 0, 1300), (0, 0, 0))))
    cases.append(case("ball-drag-spin", "ball-air",
                      ball=body((0, 0, 1300), (900, -300, 200), (1, 2, -3))))
    for speed in (400, 1200, 2200):
        for offset in (0, 40):
            cases.append(case(f"air-hit-{speed}-{offset}", "car-ball",
                              [car(pos=(-300, 0, 1000), vel=(speed, 0, 0))],
                              [phase(90, {})], body((0, offset, 1020))))

    def ground(vel=(0, 0, 0), **kwargs):
        return car(pos=(-2000, -1800, 17), vel=vel, grounded=True, **kwargs)

    for name, controls, speed in [
        ("throttle", dict(throttle=1), 0), ("boost", dict(boost=True), 0),
        ("coast", {}, 1400), ("brake", dict(throttle=-1), 1400),
        ("reverse", dict(throttle=-1), 0),
    ]:
        cases.append(case("drive-" + name, "drive", [ground((speed, 0, 0))],
                          [phase(240, controls)], meshes=True))
    for speed in (0, 500, 1000, 1500, 2200):
        for slide in (False, True):
            cases.append(case(f"steer-{speed}-slide-{slide}", "steering",
                              [ground((speed, 0, 0))],
                              [phase(120, dict(throttle=1, steer=1, handbrake=slide))], meshes=True))
    for held in (1, 24):
        cases.append(case(f"jump-held-{held}", "jump", [ground()],
                          [phase(held, dict(jump=True)), phase(240-held, {})], meshes=True))
    cases.append(case("ground-double-jump", "jump", [ground()],
                      [phase(24, dict(jump=True)), phase(12, {}),
                       phase(1, dict(jump=True)), phase(203, {})], meshes=True))
    for roof in (False, True):
        cases.append(case(f"landing-roof-{roof}", "landing",
                          [car(pos=(0, -1800, 400), quat=(1, 0, 0, 0) if roof else (0, 0, 0, 1))],
                          [phase(240, {})], meshes=True))
    cases.append(case("drive-wall", "geometry",
                      [car(pos=(3000, 0, 17), vel=(1200, 0, 0), grounded=True)],
                      [phase(240, dict(throttle=1, boost=True))], meshes=True))
    cases.append(case("drive-corner", "geometry",
                      [car(pos=(3000, 4000, 17), vel=(800, 800, 0), grounded=True,
                           quat=(0, 0, math.sin(math.pi/8), math.cos(math.pi/8)))],
                      [phase(180, dict(throttle=1))], meshes=True))
    cases.append(case("drive-wall-along", "geometry",
                      [car(pos=(4079, -2000, 800), quat=(-0.5, -0.5, 0.5, 0.5), grounded=True)],
                      [phase(180, dict(throttle=1))], meshes=True))
    cases.append(case("drive-ceiling", "geometry",
                      [car(pos=(0, 2000, 2027), quat=(1, 0, 0, 0), vel=(800, 0, 0), grounded=True)],
                      [phase(180, dict(throttle=1))], meshes=True))
    cases.append(case("drive-goal-edge", "geometry",
                      [car(pos=(900, 4700, 17), vel=(0, 1000, 0), grounded=True,
                           quat=(0, 0, math.sqrt(0.5), math.sqrt(0.5)))],
                      [phase(180, dict(throttle=1))], meshes=True))
    cases.append(case("roof-auto-flip", "landing",
                      [car(pos=(0, -1800, 400), quat=(1, 0, 0, 0))],
                      [phase(150, {}), phase(1, dict(jump=True)), phase(149, {})], meshes=True))
    for name, pos, vel, spin in [
        ("floor", (0, 0, 500), (200, 0, -600), (0, 0, 0)),
        ("wall", (3700, 0, 800), (1200, 0, 0), (0, 0, 0)),
        ("corner", (3400, 4400, 600), (700, 700, 0), (0, 0, 0)),
        ("ceiling", (0, 0, 1600), (0, 0, 1200), (0, 0, 0)),
        ("post", (890, 4700, 150), (0, 1200, 0), (0, 0, 0)),
        ("crossbar", (0, 4700, 630), (0, 1200, 300), (0, 0, 0)),
        ("rolling", (0, 0, 93.15), (800, 0, 0), (0, 800/91.25, 0)),
    ]:
        cases.append(case("ball-" + name, "ball-contact", phases=[phase(240)],
                          ball=body(pos, vel, spin), meshes=True))
    for speed in (400, 1200, 2200):
        for offset in (0, 40):
            cases.append(case(f"ground-hit-{speed}-{offset}", "car-ball",
                              [car(pos=(-300, 0, 17), vel=(speed, 0, 0), grounded=True)],
                              [phase(120, {})], body((0, offset, 93.15)), meshes=True))
    cases.append(case("ground-dribble", "car-ball",
                      [car(pos=(0, -1800, 17), vel=(800, 0, 0), grounded=True)],
                      [phase(240, dict(throttle=0.5))], body((30, -1800, 130), (800, 0, 0)), meshes=True))
    for speed in (800, 2300):
        cases.append(case(f"bump-{speed}", "bump-demo",
                          [car(pos=(-400, 0, 17), vel=(speed, 0, 0), grounded=True),
                           car(pos=(0, 0, 17), grounded=True, team=1)],
                          [phase(480, {}, {})], meshes=True))
    for big, pos in [(False, (0, -1024, 17)), (True, (3584, 0, 17))]:
        cases.append(case(f"pad-big-{big}", "pads",
                          [car(pos=pos, grounded=True, boost=0)],
                          [phase(1, dict(boost=True)), phase(1319, {})], meshes=True))
    return cases
