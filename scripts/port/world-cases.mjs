import { seededRandom } from "./cases.mjs";
const car = (overrides = {}) => ({
  team: 0,
  pos: [0, -2000, 17],
  yaw: Math.PI * 0.5,
  boost: 100,
  vel: [0, 0, 0],
  ang: [0, 0, 0],
  pitch: 0,
  roll: 0,
  frozen: false,
  demoed: false,
  respawn: 0,
  ...overrides,
});
const control = (overrides = {}) => ({
  throttle: 0,
  steer: 0,
  pitch: 0,
  yaw: 0,
  roll: 0,
  jump: false,
  boost: false,
  handbrake: false,
  ...overrides,
});
const ball = (pos = [0, 0, 93.15], vel = [0, 0, 0], spin = [0, 0, 0]) => [
  ...pos,
  ...vel,
  ...spin,
  91.25,
  30,
  0,
  0,
];
export function worldCases() {
  const cases = [];
  const add = (name, cars, controls, ticks = 720, b = ball()) =>
    cases.push({ name, cars, controls, ticks, ball: b });
  add("drive", [car()], () => [control({ throttle: 1 })]);
  add("boost-turn", [car()], (t) => [
    control({ throttle: 1, boost: true, steer: t < 240 ? 0 : 0.7 }),
  ]);
  add("reverse-brake", [car()], (t) => [
    control({ throttle: t < 240 ? 1 : -1, steer: 0.35 }),
  ]);
  add("powerslide", [car()], (t) => [
    control({ throttle: 1, steer: 0.8, handbrake: t > 120 && t < 480 }),
  ]);
  add("jump-double", [car()], (t) => [
    control({ throttle: 1, jump: (t >= 60 && t < 80) || (t >= 92 && t < 100) }),
  ]);
  add("flip", [car()], (t) => [
    control({
      throttle: 1,
      jump: (t >= 60 && t < 80) || (t >= 92 && t < 100),
      pitch: t >= 92 ? -1 : 0,
      yaw: t >= 92 ? 0.2 : 0,
    }),
  ]);
  add(
    "air-control",
    [car({ pos: [0, 0, 1200], vel: [100, -200, 100] })],
    (t) => [
      control({
        throttle: 1,
        pitch: 0.3,
        yaw: -0.4,
        roll: 0.2,
        boost: t < 180,
      }),
    ],
  );
  add("inverted-recovery", [car({ pos: [0, 0, 30], roll: Math.PI })], (t) => [
    control({ jump: t >= 120 && t < 150 }),
  ]);
  add(
    "wall-contact",
    [car({ pos: [4050, 0, 700], yaw: 0, vel: [1500, 300, 0] })],
    () => [control({ throttle: 1, boost: true, steer: 0.2 })],
  );
  add("ball-hit", [car({ pos: [0, -350, 17] })], () => [
    control({ throttle: 1, boost: true }),
  ]);
  add(
    "wheels-on-ball",
    [car({ pos: [0, 0, 210], yaw: 0 })],
    () => [control({ throttle: 1 })],
    360,
  );
  add(
    "bump",
    [
      car({ pos: [0, -120, 17], vel: [0, 1200, 0] }),
      car({ pos: [0, 0, 17], team: 1 }),
    ],
    () => [control({ throttle: 1 }), control()],
    360,
  );
  add(
    "demo-respawn",
    [
      car({ pos: [0, -100, 17], vel: [0, 2250, 0] }),
      car({ pos: [0, 100, 17], team: 1 }),
    ],
    () => [control({ throttle: 1, boost: true }), control()],
    720,
  );
  add(
    "forced-respawn",
    [car({ demoed: true, respawn: 0.1 })],
    () => [control()],
    60,
  );
  add(
    "frozen",
    [car({ frozen: true })],
    () => [control({ jump: true, boost: true, throttle: 1 })],
    8,
  );
  add(
    "six-car-controls",
    [
      car(),
      car({ pos: [-1000, -2500, 17], yaw: 0.2 }),
      car({ pos: [1000, -2500, 17], yaw: 2.2 }),
      car({ team: 1, pos: [0, 2000, 17], yaw: Math.PI * 1.5 }),
      car({ team: 1, pos: [-1000, 2500, 17], yaw: -0.2 }),
      car({ team: 1, pos: [1000, 2500, 17], yaw: -2.2 }),
    ],
    (t) =>
      Array.from({ length: 6 }, (_, i) =>
        control({
          throttle: 1,
          steer: Math.sin((t + i * 100) / 200) * 0.7,
          boost: t % 240 < 180,
          jump: t % 240 >= 180 && t % 240 < 210,
          pitch: -0.4,
          yaw: 0.2,
        }),
      ),
    1200,
  );
  const random = seededRandom(8192);
  for (let i = 0; i < 12; i++) {
    const c = car({
      pos: [
        (random() - 0.5) * 7500,
        (random() - 0.5) * 9000,
        17 + random() * 1500,
      ],
      yaw: (random() - 0.5) * 6,
      pitch: (random() - 0.5) * 2,
      roll: (random() - 0.5) * 2,
      vel: [
        (random() - 0.5) * 3000,
        (random() - 0.5) * 3000,
        (random() - 0.5) * 500,
      ],
    });
    const steer = (random() - 0.5) * 2;
    add(
      `random-car-${i}`,
      [c],
      (t) => [
        control({
          throttle: 1,
          steer,
          jump: t % 180 < 25,
          pitch: -0.3,
          yaw: 0.2,
          roll: steer,
          boost: true,
        }),
      ],
      360,
    );
  }
  return cases;
}
