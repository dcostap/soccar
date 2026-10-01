import { readFile } from "node:fs/promises";
import { createRustGame, simulationGeometry } from "../src/simulation.js";
import { ViewVector, ViewRotation } from "../src/view.js";
export function cases(full = false) {
  const result = [
    {
      name: "menu",
      mode: 0,
      size: 1,
      skill: 2,
      player: -1,
      seed: 12345,
      duration: 300,
      ticks: 1200,
    },
    {
      name: "freeplay",
      mode: 1,
      size: 1,
      skill: 1,
      player: 0,
      seed: 99,
      duration: 300,
      ticks: 1200,
    },
    ...[1, 2, 3].flatMap((size) =>
      [0, 1, 2].map((skill) => ({
        name: `${size}v${size}-${["rookie", "pro", "allstar"][skill]}`,
        mode: 2,
        size,
        skill,
        player: -1,
        seed: 12345,
        duration: 30,
        ticks: 1200,
      })),
    ),
    {
      name: "player-match",
      mode: 2,
      size: 3,
      skill: 2,
      player: 0,
      seed: 67890,
      duration: 30,
      ticks: 1800,
    },
    {
      name: "commands-and-restarts",
      mode: 1,
      size: 3,
      skill: 2,
      player: 0,
      seed: 12345,
      duration: 30,
      ticks: 1440,
      actions: [
        [120, 2, 0],
        [240, 3, 0],
        [360, 1, 0],
        [400, 6, 0.75],
        [410, 5, 1],
        [420, 7, 0],
        [900, 8, 0],
        [1080, 9, 0],
      ],
    },
  ];
  if (full)
    for (const seed of [12345, 67890, 24680])
      result.push({
        name: `full-3v3-${seed}`,
        mode: 2,
        size: 3,
        skill: 2,
        player: -1,
        seed,
        duration: 300,
        ticks: 216000,
      });
  return result;
}
export function controls(c, tick) {
  return c.player >= 0
    ? [
        1,
        tick < 180 ? 0 : 0.35,
        -0.4,
        0.2,
        0,
        Number(tick % 240 >= 180 && tick % 240 < 210),
        Number(tick % 240 < 180),
        0,
        -1,
      ]
    : [0, 0, 0, 0, 0, 0, 0, 0, -1];
}
export async function loadTestSimulation() {
  const { instance } = await WebAssembly.instantiate(
    await readFile(
      new URL("../public/simulation/soccar_simulation.wasm", import.meta.url),
    ),
  );
  return {
    wasm: instance.exports,
    geometry: simulationGeometry(instance.exports),
  };
}
export async function createTestPresentation(seed = 12345, loaded) {
  const calls = [];
  const service = new Proxy(
    {},
    {
      get:
        (_, method) =>
        (...args) =>
          calls.push({ method, args }),
    },
  );
  const camera = {
    position: new ViewVector(),
    up: new ViewVector(),
    lookAt() {},
  };
  const renderer = new Proxy(
    {
      ball: { visible: true },
      camera,
      aspect: 1,
      stadium: { setScreens() {} },
    },
    { get: (o, k) => (k in o ? o[k] : () => {}) },
  );
  class Camera {
    reset() {}
    snap() {}
    update() {}
    addShake() {}
    updateProjection() {}
  }
  const api = {
    FollowCamera: Camera,
    ReplayCamera: Camera,
    RenderQuat: ViewRotation,
    rotate: (_, v) => v,
  };
  const settings = {
    camera: {},
    gameplay: { defaultBallCam: true, playerName: "Player" },
    input: { dodgeDeadzone: 0.5 },
  };
  const engine = loaded ?? (await loadTestSimulation());
  const game = await createRustGame(
    api,
    renderer,
    service,
    service,
    service,
    settings,
    seed,
    engine,
  );
  return { game, calls, settings, wasm: engine.wasm };
}
