import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
export async function loadWorldReference() {
  const source = await readFile(
    new URL("../../src/game.js", import.meta.url),
    "utf8",
  );
  const lock = JSON.parse(
    await readFile(new URL("reference-lock.json", import.meta.url), "utf8"),
  );
  const sourceHash = createHash("sha256").update(source).digest("hex");
  for (const [key, value] of Object.entries({
    node: process.version,
    v8: process.versions.v8,
    sourceHash,
  }))
    if (lock[key] !== value) throw new Error(`Reference lock mismatch: ${key}`);
  const code =
    source.slice(
      source.indexOf("var e = class e {"),
      source.indexOf("var Ot = {"),
    ) +
    source.slice(
      source.indexOf("var xb = new e(),"),
      source.indexOf("function ex(t, n) {"),
    );
  class Camera {
    reset() {}
    addShake() {}
    snap() {}
  }
  let seed = 1;
  const math = Object.create(Math);
  math.random = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  const api = new Function(
    "Em",
    "km",
    "Math",
    `${code}\nreturn {Ball:Db,World:Ub,Car:Et,Bot:qb,Predictor:Kb,Match:Qb,Vec3:e,Quat:t,controls:at,dt:o,distance:et,normal:nt};`,
  )(Camera, Camera, math);
  api.setSeed = (value) => {
    seed = value;
  };
  api.randomState = () => seed;
  api.reference = {
    node: process.version,
    v8: process.versions.v8,
    sourceHash,
    extractedHash: createHash("sha256").update(code).digest("hex"),
  };
  return api;
}
export const CAR_SCALARS = [
  "numWheelsInContact",
  "isOnGround",
  "hasJumped",
  "isJumping",
  "jumpTime",
  "hasDoubleJumped",
  "hasFlipped",
  "isFlipping",
  "flipTime",
  "flipRoll",
  "flipPitch",
  "airTime",
  "airTimeSinceJump",
  "handbrakeVal",
  "isBoosting",
  "boostingTime",
  "isSupersonic",
  "supersonicTime",
  "isAutoFlipping",
  "autoFlipTimer",
  "autoFlipTorqueScale",
];
export function worldSnapshot(api, world) {
  const values = [],
    fields = [];
  const add = (name, value) => {
    fields.push(name);
    values.push(Number(value));
  };
  const vec = (prefix, v) => {
    for (const k of ["x", "y", "z"]) add(`${prefix}.${k}`, v[k]);
  };
  const controls = (prefix, c) => {
    for (const k of [
      "throttle",
      "steer",
      "pitch",
      "yaw",
      "roll",
      "jump",
      "boost",
      "handbrake",
    ])
      add(`${prefix}.${k}`, c[k]);
    add(`${prefix}.dodgeMag`, c.dodgeMag ?? -1);
  };
  add("tick", world.tick);
  add("goalsEnabled", world.goalsEnabled);
  add("goalScoredThisTick", world.goalScoredThisTick ?? -1);
  add("lastTouch", world.lastTouch?.id ?? -1);
  add("ballTouchedSinceKickoff", world.ballTouchedSinceKickoff);
  add("respawnRoll", world.respawnRoll);
  const b = world.ball;
  vec("ball.pos", b.pos);
  vec("ball.vel", b.vel);
  vec("ball.angVel", b.angVel);
  for (const k of ["radius", "mass", "lastWorldHitSpeed", "frozen"])
    add(`ball.${k}`, b[k]);
  add("arena.distance", api.distance(b.pos.x, b.pos.y, b.pos.z));
  vec("arena.normal", api.normal(b.pos, new api.Vec3()));
  add("cars.length", world.cars.length);
  for (const c of world.cars) {
    const p = `cars[${c.id}]`;
    add(`${p}.id`, c.id);
    add(`${p}.team`, c.team);
    vec(`${p}.pos`, c.pos);
    vec(`${p}.vel`, c.vel);
    vec(`${p}.angVel`, c.angVel);
    for (const k of ["x", "y", "z", "w"]) add(`${p}.rot.${k}`, c.rot[k]);
    c.mat.e.forEach((x, i) => add(`${p}.mat[${i}]`, x));
    for (const k of ["forward", "left", "up"]) vec(`${p}.${k}`, c[k]);
    for (const k of ["mass", "boost", "dodgeDeadzone"]) add(`${p}.${k}`, c[k]);
    controls(`${p}.controls`, c.controls);
    controls(`${p}.lastControls`, c.lastControls);
    for (const k of CAR_SCALARS) add(`${p}.${k}`, c[k]);
    add(`${p}.worldContact.has`, c.worldContact.has);
    vec(`${p}.worldContact.normal`, c.worldContact.normal);
    for (const k of ["isDemoed", "demoRespawnTimer", "frozen"])
      add(`${p}.${k}`, c[k]);
    vec(`${p}.velImpulseCache`, c.velImpulseCache);
    add(`${p}.bumpCooldowns.length`, c.bumpCooldowns.size);
    for (const [id, time] of c.bumpCooldowns) {
      add(`${p}.bumpCooldowns.id`, id);
      add(`${p}.bumpCooldowns.time`, time);
    }
    for (const k of ["lastExtraBallHitTick", "lastBallTouchTick"])
      add(`${p}.${k}`, c[k]);
    for (const k of ["jumped", "doubleJumped", "flipped", "landed", "ballHit"])
      add(`${p}.events.${k}`, c.events[k]);
    c.wheels.forEach((w, i) => {
      const p2 = `${p}.wheels[${i}]`;
      add(`${p2}.front`, w.front);
      vec(`${p2}.local`, w.local);
      for (const k of [
        "radius",
        "restLength",
        "forceScale",
        "inContact",
        "onBall",
      ])
        add(`${p2}.${k}`, w[k]);
      vec(`${p2}.contactPoint`, w.contactPoint);
      vec(`${p2}.contactNormal`, w.contactNormal);
      for (const k of [
        "suspensionLength",
        "traceLength",
        "steerAngle",
        "spin",
        "visualLength",
        "latFriction",
        "longFriction",
      ])
        add(`${p2}.${k}`, w[k]);
    });
  }
  world.pads.forEach((pad, i) => {
    vec(`pads[${i}].pos`, pad.pos);
    add(`pads[${i}].big`, pad.big);
    add(`pads[${i}].cooldown`, pad.cooldown);
  });
  add("events.length", world.events.length);
  const types = {
    ballBounce: 1,
    ballHit: 2,
    demo: 3,
    bump: 4,
    jump: 5,
    flip: 6,
    land: 7,
    boostPickup: 8,
    respawn: 9,
    goal: 10,
  };
  world.events.forEach((e, i) => {
    const p = `events[${i}]`;
    add(`${p}.kind`, types[e.type]);
    add(`${p}.car`, e.car?.id ?? e.attacker?.id ?? -1);
    add(`${p}.other`, e.victim?.id ?? -1);
    add(`${p}.team`, e.team ?? -1);
    add(`${p}.pad`, e.pad?.index ?? -1);
    vec(`${p}.position`, e.pos ?? e.point ?? e.ballPos ?? { x: 0, y: 0, z: 0 });
    add(`${p}.strength`, e.speed ?? e.strength ?? e.ballSpeed ?? 0);
    add(`${p}.lastTouch`, e.lastTouch?.id ?? -1);
  });
  return { values, fields };
}
