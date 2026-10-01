import { worldSnapshot } from "./world-reference.mjs";
import { snapshot } from "./reference.mjs";
export function createGame(api, c) {
  api.setSeed(c.seed);
  const noop = () => {};
  const service = new Proxy({}, { get: () => noop });
  const renderer = new Proxy(
    { ball: { visible: true }, camera: { position: { x: 0, y: 0, z: 0 } } },
    { get: (target, key) => (key in target ? target[key] : noop) },
  );
  const settings = {
    camera: {},
    gameplay: { defaultBallCam: true, playerName: "Player" },
    input: { dodgeDeadzone: 0.5 },
  };
  const game = new api.Match(renderer, service, service, service, settings);
  const config = {
    teamSize: c.size,
    skill: c.skill,
    playerTeam: c.player,
    duration: c.duration,
  };
  if (c.mode === 0) game.startMenuBackground();
  else if (c.mode === 1) game.startFreeplay();
  else game.startMatch(config);
  return game;
}
export function gameSnapshot(api, g) {
  const result = worldSnapshot(api, g.world);
  const { values, fields } = result;
  const add = (name, value) => {
    fields.push(name);
    values.push(Number(value));
  };
  const vec = (prefix, v) => {
    for (const k of ["x", "y", "z"]) add(`${prefix}.${k}`, v[k]);
  };
  add("mode", { menu: 0, freeplay: 1, match: 2 }[g.mode]);
  add(
    "phase",
    { countdown: 0, playing: 1, goal: 2, replay: 3, ended: 4 }[g.phase],
  );
  add("player", g.player?.id ?? -1);
  g.score.forEach((s, i) => add(`score[${i}]`, s));
  for (const k of [
    "clock",
    "overtime",
    "phaseTimer",
    "countdownShown",
    "waitingForGroundToEnd",
    "unlimitedBoost",
  ])
    add(k, g[k]);
  for (const k of ["x", "y", "z", "w"]) add(`ballRot.${k}`, g.ballRot[k]);
  add("replayBuf.length", g.replayBuf.length);
  for (const k of [
    "replayIdx",
    "replayEnd",
    "replayScorer",
    "endAfterReplay",
    "lastGoalTeam",
    "freeplayGoalTimer",
  ])
    add(k, g[k]);
  add("goalPrediction", g.goalPrediction ?? -1);
  add("randomState", api.randomState());
  add("stats.length", g.stats.size);
  for (const [id, s] of g.stats) {
    for (const k of ["score", "goals", "assists", "shots", "saves"])
      add(`stats[${id}].${k}`, s[k]);
  }
  add("lastTouches.length", g.lastTouches.length);
  g.lastTouches.forEach((t, i) => {
    add(`lastTouches[${i}].car`, t.car.id);
    add(`lastTouches[${i}].tick`, t.tick);
  });
  snapshot(api, g.predictBall).forEach((x, i) => add(`predictBall[${i}]`, x));
  add("predictor.lastTick", g.predictor.lastTick);
  snapshot(api, g.predictor.sim).forEach((x, i) =>
    add(`predictor.sim[${i}]`, x),
  );
  add("predictor.slices.length", g.predictor.slices.length);
  g.predictor.slices.forEach((s, i) => {
    add(`predictor.slices[${i}].t`, s.t);
    vec(`predictor.slices[${i}].pos`, s.pos);
    vec(`predictor.slices[${i}].vel`, s.vel);
  });
  add("bots.length", g.bots.length);
  g.bots.forEach((b, i) => {
    const p = `bots[${i}]`;
    add(`${p}.car`, b.car.id);
    add(`${p}.skill`, { rookie: 0, pro: 1, allstar: 2 }[b.skill]);
    add(`${p}.reactionTimer`, b.reactionTimer);
    vec(`${p}.target`, b.target);
    add(`${p}.kickoffFlipDone`, b.kickoffFlipDone);
    add(`${p}.role`, b.role === "support");
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
      add(`${p}.out.${k}`, b.out[k]);
    add(`${p}.out.dodgeMag`, b.out.dodgeMag ?? -1);
    add(`${p}.maneuver.kind`, { none: 0, flip: 1, aerial: 2 }[b.m.kind]);
    if (b.m.kind !== "none") {
      add(`${p}.maneuver.t`, b.m.t);
      if (b.m.kind === "flip") {
        add(`${p}.maneuver.pitch`, b.m.pitch);
        add(`${p}.maneuver.yaw`, b.m.yaw);
      } else {
        vec(`${p}.maneuver.target`, b.m.target);
        add(`${p}.maneuver.arrive`, b.m.tArrive);
      }
    }
  });
  return result;
}
