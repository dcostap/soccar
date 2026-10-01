import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";

// Read the actual game code. Do not maintain a second JavaScript physics model.
export async function loadReference() {
  const source = await readFile(
    new URL("../../src/game.js", import.meta.url),
    "utf8",
  );
  const section = (start, end) => {
    const offset = source.indexOf(start);
    const limit = source.indexOf(end, offset);
    if (
      offset < 0 ||
      limit < 0 ||
      source.indexOf(start, offset + start.length) >= 0
    ) {
      throw new Error(`Reference boundary changed: ${start}`);
    }
    return source.slice(offset, limit);
  };
  const code =
    section("var e = class e {", "var Ot = {") +
    section("var xb = new e(),", "function Rb(t, n, r) {");
  const api = new Function(
    `${code}\nreturn { Ball: Db, Vec3: e, dt: o, distance: et, normal: nt };`,
  )();
  return {
    ...api,
    sourceHash: createHash("sha256").update(source).digest("hex"),
    extractedHash: createHash("sha256").update(code).digest("hex"),
  };
}

export const STATE_FIELDS = [
  "pos.x",
  "pos.y",
  "pos.z",
  "vel.x",
  "vel.y",
  "vel.z",
  "angVel.x",
  "angVel.y",
  "angVel.z",
  "radius",
  "mass",
  "lastWorldHitSpeed",
  "frozen",
];
export const TRACE_FIELDS = [
  ...STATE_FIELDS,
  "arena.distance",
  "arena.normal.x",
  "arena.normal.y",
  "arena.normal.z",
];

export function createBall(reference, state) {
  const ball = new reference.Ball();
  ball.pos.set(...state.slice(0, 3));
  ball.vel.set(...state.slice(3, 6));
  ball.angVel.set(...state.slice(6, 9));
  [ball.radius, ball.mass, ball.lastWorldHitSpeed] = state.slice(9, 12);
  ball.frozen = state[12] !== 0;
  return ball;
}

export function snapshot(reference, ball) {
  const normal = reference.normal(ball.pos, new reference.Vec3());
  return [
    ball.pos.x,
    ball.pos.y,
    ball.pos.z,
    ball.vel.x,
    ball.vel.y,
    ball.vel.z,
    ball.angVel.x,
    ball.angVel.y,
    ball.angVel.z,
    ball.radius,
    ball.mass,
    ball.lastWorldHitSpeed,
    Number(ball.frozen),
    reference.distance(ball.pos.x, ball.pos.y, ball.pos.z),
    normal.x,
    normal.y,
    normal.z,
  ];
}

export function step(reference, ball) {
  ball.integrateForces(reference.dt);
  ball.integratePosition(reference.dt);
  ball.collideWorld();
  ball.clampVelocities();
}
