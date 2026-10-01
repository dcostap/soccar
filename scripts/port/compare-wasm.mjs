import { readFile, mkdir, writeFile } from "node:fs/promises";
import { loadWorldReference, worldSnapshot } from "./world-reference.mjs";
import { createGame, gameSnapshot } from "./game-reference.mjs";
import { readSimulationState } from "../../src/simulation-state.js";
const bytes = await readFile(
  new URL("../../public/simulation/soccar_simulation.wasm", import.meta.url),
);
const { instance } = await WebAssembly.instantiate(bytes);
const wasm = instance.exports;
const api = await loadWorldReference();
let states = 0,
  fields = 0;
const seed = 12345;
const handle = wasm.sim_create(seed);
const presentation = {
  world: new api.World(),
  ballRot: new api.Quat(),
  settings: { gameplay: { playerName: "Player" } },
};
const cases = [
  {
    name: "menu",
    mode: 0,
    size: 1,
    skill: "allstar",
    player: -1,
    seed,
    duration: 300,
    ticks: 720,
  },
  {
    name: "freeplay",
    mode: 1,
    size: 1,
    skill: "pro",
    player: 0,
    seed,
    duration: 300,
    ticks: 720,
  },
  ...[1, 2, 3].map((size) => ({
    name: `match-${size}`,
    mode: 2,
    size,
    skill: "allstar",
    player: -1,
    seed,
    duration: 30,
    ticks: 1200,
  })),
];
if (process.argv.includes("--full"))
  for (const seed of [12345, 67890, 24680])
    cases.push({
      name: `full-3v3-${seed}`,
      mode: 2,
      size: 3,
      skill: "allstar",
      player: -1,
      seed,
      duration: 300,
      ticks: 216000,
    });
// Each case gets a fresh handle. Restart checks below reuse one handle.
let difference = null;
const results = [];
const bits = (value) => {
  const b = Buffer.alloc(8);
  b.writeDoubleLE(value);
  return `0x${b.readBigUInt64LE().toString(16).padStart(16, "0")}`;
};
function check(g, h, name, tick) {
  const expected = gameSnapshot(api, g);
  const pointer = wasm.sim_trace(h);
  const actual = new Float64Array(
    wasm.memory.buffer,
    pointer,
    wasm.sim_state_len(h),
  );
  if (actual.length !== expected.values.length)
    return {
      case: name,
      tick,
      field: "length",
      js: expected.values.length,
      rust: actual.length,
    };
  for (let i = 0; i < actual.length; i++) {
    if (
      !Number.isFinite(actual[i]) ||
      !Number.isFinite(expected.values[i]) ||
      !Object.is(actual[i], expected.values[i])
    )
      return {
        case: name,
        tick,
        field: expected.fields[i],
        js: expected.values[i],
        rust: actual[i],
        jsBits: bits(expected.values[i]),
        rustBits: bits(actual[i]),
      };
  }
  states++;
  fields += actual.length;
  const viewPointer = wasm.sim_state(h);
  readSimulationState(
    new Float64Array(wasm.memory.buffer, viewPointer, wasm.sim_state_len(h)),
    presentation,
    api,
  );
  const decoded = worldSnapshot(api, presentation.world),
    world = worldSnapshot(api, g.world);
  if (decoded.values.length !== world.values.length)
    return { case: name, tick, field: "decoded.length" };
  for (let i = 0; i < decoded.values.length; i++)
    if (!Object.is(decoded.values[i], world.values[i]))
      return {
        case: name,
        tick,
        field: `decoded.${world.fields[i]}`,
        js: world.values[i],
        rust: decoded.values[i],
      };
  for (const key of [
    "mode",
    "phase",
    "clock",
    "overtime",
    "phaseTimer",
    "countdownShown",
    "waitingForGroundToEnd",
    "unlimitedBoost",
    "replayIdx",
    "replayEnd",
    "replayScorer",
    "endAfterReplay",
    "lastGoalTeam",
    "freeplayGoalTimer",
  ])
    if (!Object.is(presentation[key], g[key]))
      return {
        case: name,
        tick,
        field: `decoded.${key}`,
        js: g[key],
        rust: presentation[key],
      };
  for (const key of ["x", "y", "z", "w"])
    if (!Object.is(presentation.ballRot[key], g.ballRot[key]))
      return { case: name, tick, field: `decoded.ballRot.${key}` };
  for (let i = 0; i < g.world.cars.length; i++)
    if (presentation.world.cars[i].name !== g.world.cars[i].name)
      return {
        case: name,
        tick,
        field: `decoded.cars[${i}].name`,
        js: g.world.cars[i].name,
        rust: presentation.world.cars[i].name,
      };
  if (presentation.stats.size !== g.stats.size)
    return { case: name, tick, field: "decoded.stats.length" };
  for (const [id, stats] of g.stats)
    for (const key of ["score", "goals", "assists", "shots", "saves"])
      if (presentation.stats.get(id)?.[key] !== stats[key])
        return { case: name, tick, field: `decoded.stats[${id}].${key}` };
  if (
    JSON.stringify(presentation.score) !== JSON.stringify(g.score) ||
    presentation.nativeReplayLength !== g.replayBuf.length
  )
    return { case: name, tick, field: "decoded.score/replay" };
  return null;
}
for (const c of cases) {
  const h = wasm.sim_create(c.seed);
  const g = createGame(api, c);
  wasm.sim_start(h, c.mode, c.size, 2, c.player, c.duration, 0.5);
  for (let tick = 0; tick <= c.ticks; tick++) {
    if (tick) {
      const controls =
        c.player >= 0
          ? {
              ...api.controls(),
              throttle: 1,
              steer: tick < 180 ? 0 : 0.35,
              boost: tick % 240 < 180,
              jump: tick % 240 >= 180 && tick % 240 < 210,
              pitch: -0.4,
              yaw: 0.2,
            }
          : api.controls();
      g.tick({ controls });
      wasm.sim_tick(
        h,
        controls.throttle,
        controls.steer,
        controls.pitch,
        controls.yaw,
        controls.roll,
        Number(controls.jump),
        Number(controls.boost),
        Number(controls.handbrake),
        -1,
      );
    }
    difference = check(g, h, c.name, tick);
    if (difference || g.phase === "ended") break;
  }
  wasm.sim_destroy(h);
  if (difference) break;
  if (c.name.startsWith("full-") && g.phase !== "ended") {
    difference = { case: c.name, field: "completion", js: g.phase };
    break;
  }
  results.push({ name: c.name, phase: g.phase, score: g.score });
}
// Compare commands and restart state, including the original predictor restart error.
if (!difference) {
  let g = createGame(api, cases[1]);
  wasm.sim_start(handle, 1, 1, 1, 0, 300, 0.5);
  for (let tick = 1; tick <= 120; tick++) {
    const controls = { ...api.controls(), throttle: 1 };
    g.tick({ controls });
    wasm.sim_tick(handle, 1, 0, 0, 0, 0, 0, 0, 0, -1);
  }
  for (const [op, action] of [
    [2, () => g.placeBall("front")],
    [3, () => g.placeBall("top")],
    [1, () => g.resetFreeplay()],
  ]) {
    action();
    wasm.sim_command(handle, op, 0);
    difference = check(g, handle, `freeplay-command-${op}`, 0);
    if (difference) break;
  }
  if (!difference) {
    const config = {
      teamSize: 3,
      skill: "allstar",
      playerTeam: 0,
      duration: 30,
    };
    g.startMatch(config);
    wasm.sim_start(handle, 2, 3, 2, 0, 30, 0.5);
    difference = check(g, handle, "restart-match", 0);
  }
}
wasm.sim_destroy(handle);
const report = {
  reference: api.reference,
  status: difference ? "FAIL" : "PASS",
  states,
  fields,
  results,
  difference,
};
await mkdir(new URL("../../artifacts/wasm-port/", import.meta.url), {
  recursive: true,
});
await writeFile(
  new URL("../../artifacts/wasm-port/report.json", import.meta.url),
  JSON.stringify(report, null, 2),
);
console.log(JSON.stringify(report, null, 2));
if (difference) process.exitCode = 1;
