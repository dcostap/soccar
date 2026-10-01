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
const bools = new Set([
  "isOnGround",
  "hasJumped",
  "isJumping",
  "hasDoubleJumped",
  "hasFlipped",
  "isFlipping",
  "isBoosting",
  "isSupersonic",
  "isAutoFlipping",
]);
const eventTypes = [
  "",
  "ballBounce",
  "ballHit",
  "demo",
  "bump",
  "jump",
  "flip",
  "land",
  "boostPickup",
  "respawn",
  "goal",
  "countdown",
  "overtime",
  "ended",
  "save",
];
export function readSimulationState(data, game) {
  let offset = 0;
  const read = () => data[offset++];
  const vec = (v) => {
    v.set(read(), read(), read());
  };
  const controls = (c) => {
    for (const key of ["throttle", "steer", "pitch", "yaw", "roll"])
      c[key] = read();
    for (const key of ["jump", "boost", "handbrake"]) c[key] = !!read();
    const dodge = read();
    if (dodge < 0) delete c.dodgeMag;
    else c.dodgeMag = dodge;
  };
  const w = game.world;
  w.tick = read();
  w.goalsEnabled = !!read();
  const goal = read(),
    touch = read();
  w.goalScoredThisTick = goal < 0 ? null : goal;
  w.ballTouchedSinceKickoff = !!read();
  w.respawnRoll = read();
  const b = w.ball;
  vec(b.pos);
  vec(b.vel);
  vec(b.angVel);
  b.radius = read();
  b.mass = read();
  b.lastWorldHitSpeed = read();
  b.frozen = !!read();
  offset += 4;
  const length = read();
  if (w.cars.length !== length) {
    w.cars = Array.from({ length }, () => createCarView());
  }
  for (const c of w.cars) {
    c.id = read();
    c.team = read();
    vec(c.pos);
    vec(c.vel);
    vec(c.angVel);
    c.rot.set(read(), read(), read(), read());
    for (let i = 0; i < 9; i++) c.mat.e[i] = read();
    vec(c.forward);
    vec(c.left);
    vec(c.up);
    c.mass = read();
    c.boost = read();
    c.dodgeDeadzone = read();
    controls(c.controls);
    controls(c.lastControls);
    for (const key of CAR_SCALARS) {
      const value = read();
      c[key] = bools.has(key) ? !!value : value;
    }
    c.worldContact.has = !!read();
    vec(c.worldContact.normal);
    c.isDemoed = !!read();
    c.demoRespawnTimer = read();
    c.frozen = !!read();
    vec(c.velImpulseCache);
    c.bumpCooldowns.clear();
    const cooldowns = read();
    for (let i = 0; i < cooldowns; i++) {
      const id = read();
      c.bumpCooldowns.set(id, read());
    }
    c.lastExtraBallHitTick = read();
    c.lastBallTouchTick = read();
    for (const key of ["jumped", "doubleJumped", "flipped", "landed"])
      c.events[key] = !!read();
    c.events.ballHit = read();
    for (const wheel of c.wheels) {
      wheel.front = !!read();
      vec(wheel.local);
      wheel.radius = read();
      wheel.restLength = read();
      wheel.forceScale = read();
      wheel.inContact = !!read();
      wheel.onBall = !!read();
      vec(wheel.contactPoint);
      vec(wheel.contactNormal);
      for (const key of [
        "suspensionLength",
        "traceLength",
        "steerAngle",
        "spin",
        "visualLength",
        "latFriction",
        "longFriction",
      ])
        wheel[key] = read();
    }
  }
  const pads = read();
  if (w.pads.length !== pads)
    w.pads = Array.from({ length: pads }, () => ({ pos: new ViewVector() }));
  for (const pad of w.pads) {
    vec(pad.pos);
    pad.big = !!read();
    pad.cooldown = read();
  }
  w.lastTouch = touch < 0 ? null : w.cars[touch];
  const events = () => {
    const length = read(),
      result = [];
    for (let i = 0; i < length; i++) {
      const kind = read(),
        car = read(),
        other = read(),
        team = read(),
        pad = read(),
        position = new ViewVector(read(), read(), read()),
        strength = read(),
        lastTouch = read();
      const event = { type: eventTypes[kind], team };
      if (car >= 0) event.car = w.cars[car];
      if (other >= 0) {
        event.attacker = w.cars[car];
        event.victim = w.cars[other];
      }
      if (pad >= 0) event.pad = w.pads[pad];
      if (kind === 1) {
        event.pos = position;
        event.speed = strength;
      }
      if (kind === 2) {
        event.point = position;
        event.strength = strength;
      }
      if (kind === 10) {
        event.ballPos = position;
        event.ballSpeed = strength;
        event.lastTouch = lastTouch < 0 ? null : w.cars[lastTouch];
      }
      result.push(event);
    }
    return result;
  };
  w.events = events();
  game.mode = ["menu", "freeplay", "match"][read()];
  game.phase = ["countdown", "playing", "goal", "replay", "ended"][read()];
  const player = read();
  game.player = player < 0 ? null : w.cars[player];
  game.score = [read(), read()];
  game.clock = read();
  game.overtime = !!read();
  game.phaseTimer = read();
  game.countdownShown = read();
  game.waitingForGroundToEnd = !!read();
  game.unlimitedBoost = !!read();
  game.ballRot.set(read(), read(), read(), read());
  game.nativeReplayLength = read();
  game.replayIdx = read();
  game.replayEnd = read();
  game.replayScorer = read();
  game.endAfterReplay = !!read();
  game.lastGoalTeam = read();
  game.freeplayGoalTimer = read();
  const names = read();
  const botNames = [
    "Nova",
    "Blitz",
    "Comet",
    "Vortex",
    "Jet",
    "Rogue",
    "Flux",
    "Apex",
    "Talon",
    "Echo",
  ];
  for (let i = 0; i < names; i++) {
    const name = read();
    w.cars[i].name =
      name < 0 ? game.settings.gameplay.playerName : botNames[name];
  }
  const stats = read();
  game.stats = new Map();
  for (let i = 0; i < stats; i++) {
    game.stats.set(i, {
      score: read(),
      goals: read(),
      assists: read(),
      shots: read(),
      saves: read(),
    });
  }
  const notifications = events();
  if (offset !== data.length)
    throw new Error(`Simulation state length: ${offset}/${data.length}`);
  return notifications;
}
import { ViewVector, createCarView } from "./view.js";
