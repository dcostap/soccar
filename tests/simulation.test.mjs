import test from "node:test";
import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";
import {
  ViewVector,
  ViewRotation,
  createCarView,
  createWorldView,
} from "../src/view.js";
import { Presentation } from "../src/presentation.js";
import { readSimulationState, CAR_SCALARS } from "../src/simulation-state.js";

test("browser models contain data and graphics helpers, not simulation entry points", async () => {
  const world = createWorldView(),
    car = createCarView(),
    rotation = new ViewRotation();
  for (const method of ["step", "setupKickoff", "resetPads"])
    assert.equal(world[method], undefined);
  for (const method of [
    "spawn",
    "preStep",
    "postStep",
    "integrate",
    "applyImpulse",
  ])
    assert.equal(car[method], undefined);
  assert.equal(rotation.integrate, undefined);
  assert.equal(rotation.setFromEuler, undefined);
  const code = await readFile("src/game.js", "utf8");
  assert.doesNotMatch(code, /\b(?:Et|Db|Ub|Kb|qb|Qb)\b/);
  await assert.rejects(access("provenance/original-game.js"), {
    code: "ENOENT",
  });
});
function packet() {
  const values = [
    12, 1, -1, 0, 1, 2, 1, 2, 3, 4, 5, 6, 7, 8, 9, 91.25, 30, 11, 0, 20, 0, 0,
    1, 1,
  ];
  values.push(
    0,
    1,
    10,
    20,
    30,
    4,
    5,
    6,
    1,
    2,
    3,
    0,
    0,
    0,
    1,
    1,
    0,
    0,
    0,
    1,
    0,
    0,
    0,
    1,
    1,
    0,
    0,
    0,
    1,
    0,
    0,
    0,
    1,
    180,
    42,
    0.75,
  );
  values.push(1, 0.5, -0.3, 0.2, 0, 1, 0, 0, -1, 0, 0, 0, 0, 0, 0, 0, 0, -1);
  values.push(
    ...CAR_SCALARS.map((key) =>
      key === "numWheelsInContact" ? 4 : key === "isOnGround" ? 1 : 0,
    ),
  );
  values.push(
    1,
    0,
    0,
    1,
    0,
    1.5,
    0,
    0,
    0,
    0,
    1,
    2,
    0.25,
    99,
    111,
    1,
    0,
    0,
    0,
    777,
  );
  for (let i = 0; i < 4; i++)
    values.push(
      Number(i < 2),
      11,
      12,
      5,
      12,
      13,
      14,
      1,
      0,
      0,
      1,
      2,
      0,
      0,
      1,
      9,
      8,
      0.25,
      2,
      7,
      0.9,
      0.8,
    );
  values.push(
    2,
    1,
    2,
    0,
    1,
    0.5,
    3,
    4,
    0,
    0,
    0,
    1,
    2,
    0,
    -1,
    -1,
    -1,
    10,
    20,
    30,
    999,
    -1,
  );
  values.push(
    2,
    1,
    0,
    2,
    3,
    100,
    1,
    0,
    0,
    0,
    1,
    0,
    0,
    0,
    1,
    10,
    3,
    9,
    0,
    0,
    1,
    0,
    1,
    -1,
    1,
    100,
    1,
    2,
    3,
    4,
    1,
    13,
    -1,
    -1,
    1,
    -1,
    0,
    0,
    0,
    0,
    -1,
  );
  return new Float64Array(values);
}
test("Rust view decoder reads cars, wheels, pads, controls, statistics, and events", () => {
  const game = {
    world: createWorldView(),
    ballRot: new ViewRotation(),
    settings: { gameplay: { playerName: "Alex" } },
  };
  const events = readSimulationState(packet(), game);
  const car = game.world.cars[0];
  assert.deepEqual({ ...car.pos }, { x: 10, y: 20, z: 30 });
  assert.equal(car.name, "Alex");
  assert.equal(car.boost, 42);
  assert.equal(car.forwardSpeed, 4);
  assert.equal(car.dodgeDeadzone, 0.75);
  assert.equal(car.controls.jump, true);
  assert.equal(car.controls.dodgeMag, undefined);
  assert.equal(car.wheels[3].spin, 2);
  assert.equal(car.bumpCooldowns.get(2), 0.25);
  assert.equal(car.numWheelsInContact, 4);
  assert.equal(game.world.pads.length, 2);
  assert.equal(game.world.pads[0].big, true);
  assert.equal(game.world.pads[1].cooldown, 0);
  assert.equal(game.world.lastTouch, car);
  assert.equal(game.world.events[0].car, car);
  assert.deepEqual({ ...game.world.events[0].point }, { x: 10, y: 20, z: 30 });
  assert.equal(game.player, car);
  assert.equal(game.phase, "playing");
  assert.equal(game.overtime, true);
  assert.deepEqual(game.score, [2, 3]);
  assert.deepEqual(game.stats.get(0), {
    score: 100,
    goals: 1,
    assists: 2,
    shots: 3,
    saves: 4,
  });
  assert.equal(events[0].type, "ended");
  assert.equal(events[0].team, 1);
  assert.throws(
    () => readSimulationState(packet().slice(0, -1), game),
    /Simulation state length/,
  );
});
test("render interpolation does not modify the decoded Rust pose", () => {
  const pose = new ViewRotation(0, 0, 0, 1);
  const blended = pose.clone().slerp(new ViewRotation(0, 0, 1, 0), 0.5);
  assert.equal(pose.z, 0);
  assert.ok(blended.z > 0);
  const pos = new ViewVector(1, 2, 3);
  pos.clone().lerp(new ViewVector(2, 4, 6), 0.5);
  assert.deepEqual({ ...pos }, { x: 1, y: 2, z: 3 });
});

test("frame pacing uses the timestep supplied by Rust", () => {
  const view = Object.create(Presentation.prototype);
  let ticks = 0,
    alpha;
  Object.assign(view, {
    api: { geometry: { dt: 0.015625 } },
    paused: false,
    player: null,
    mode: "menu",
    phase: "playing",
    acc: 0,
    fpsAcc: 0,
    fpsFrames: 0,
    tick() {
      ticks++;
    },
    render(_, a) {
      alpha = a;
    },
  });
  view.frame(0.02734375, {});
  assert.equal(ticks, 1);
  assert.equal(alpha, 0.75);
  view.paused = true;
  view.frame(0.1, {});
  assert.equal(ticks, 1);
  assert.equal(alpha, 1);
});
test("the match banner uses the winning team supplied by Rust", () => {
  let banner, winner;
  const view = {
    score: [99, 0],
    player: { team: 0 },
    hud: {
      showBanner(...args) {
        banner = args;
      },
      showScoreboard() {},
    },
    audio: { whistle() {}, silenceCars() {} },
    scoreRows() {
      return [];
    },
    onMatchEnd(team) {
      winner = team;
    },
  };
  Presentation.prototype.showMatchEnded.call(view, 1);
  assert.equal(winner, 1);
  assert.deepEqual(banner.slice(0, 3), ["ORANGE WINS", "DEFEAT", "orange"]);
});
