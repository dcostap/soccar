import { spawn, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { isDeepStrictEqual } from "node:util";
import { cases, controls, loadTestSimulation } from "./simulation-fixtures.mjs";
import { readSimulationState } from "../src/simulation-state.js";
import { createWorldView, ViewRotation } from "../src/view.js";
const root = fileURLToPath(new URL("../", import.meta.url));
const debug = process.argv.includes("--debug"),
  record = process.argv.includes("--record"),
  full = process.argv.includes("--full");
const scenarios = cases(full);
const build = spawnSync(
  "cargo",
  [
    "build",
    "--locked",
    "--manifest-path",
    "simulation/Cargo.toml",
    "--bin",
    "game_trace",
    ...(debug ? [] : ["--release"]),
  ],
  { cwd: root, stdio: "inherit" },
);
if (build.status !== 0) process.exit(build.status ?? 1);
const { wasm, geometry } = await loadTestSimulation();
const goldenUrl = new URL("../simulation/regression.json", import.meta.url);
const golden = record ? {} : JSON.parse(await readFile(goldenUrl, "utf8"));
const results = [];
let states = 0,
  fields = 0;
const bytes = Buffer.alloc(
  8 + scenarios.reduce((n, c) => n + 36 + 16 * (c.actions?.length ?? 0), 0),
);
bytes.write("SCG2");
bytes.writeUInt32LE(scenarios.length, 4);
let cursor = 8;
for (const c of scenarios) {
  for (const v of [c.ticks, c.mode, c.size, c.skill, c.player >>> 0, c.seed]) {
    bytes.writeUInt32LE(v, cursor);
    cursor += 4;
  }
  bytes.writeDoubleLE(c.duration, cursor);
  cursor += 8;
  bytes.writeUInt32LE(c.actions?.length ?? 0, cursor);
  cursor += 4;
  for (const action of c.actions ?? []) {
    bytes.writeUInt32LE(action[0], cursor);
    bytes.writeUInt32LE(action[1], cursor + 4);
    bytes.writeDoubleLE(action[2], cursor + 8);
    cursor += 16;
  }
}
const bin = fileURLToPath(
  new URL(
    `../simulation/target/${debug ? "debug" : "release"}/game_trace${process.platform === "win32" ? ".exe" : ""}`,
    import.meta.url,
  ),
);
const child = spawn(bin, [], { cwd: root, stdio: ["pipe", "pipe", "pipe"] });
let stderr = "";
child.stderr.on("data", (b) => (stderr += b));
const exited = new Promise((resolve, reject) => {
  child.once("error", reject);
  child.once("close", resolve);
});
child.stdin.end(bytes);
let index = 0,
  tick = 0,
  kind = 0,
  handle = 0,
  hash,
  model,
  pending = Buffer.alloc(0),
  header = false,
  difference = null;
function start() {
  const c = scenarios[index];
  handle = wasm.sim_create(c.seed);
  if (
    !wasm.sim_start(handle, c.mode, c.size, c.skill, c.player, c.duration, 0.5)
  )
    throw new Error("Invalid fixture");
  hash = createHash("sha256");
  model = {
    world: createWorldView(),
    ballRot: new ViewRotation(),
    settings: { gameplay: { playerName: "Player" } },
  };
}
function advance() {
  const c = scenarios[index];
  if (tick) wasm.sim_tick(handle, ...controls(c, tick));
  for (const [at, op, value] of c.actions ?? [])
    if (at === tick) {
      if (op >= 7) {
        const mode = { 7: 2, 8: 1, 9: 0 }[op];
        wasm.sim_start(
          handle,
          mode,
          c.size,
          c.skill,
          c.player,
          c.duration,
          0.5,
        );
      } else wasm.sim_command(handle, op, value);
    }
}
start();
try {
  for await (const chunk of child.stdout) {
    pending = pending.length ? Buffer.concat([pending, chunk]) : chunk;
    let offset = 0;
    if (!header) {
      if (pending.length < 8) continue;
      if (
        pending.toString("ascii", 0, 4) !== "SCM2" ||
        pending.readUInt32LE(4) !== scenarios.length
      )
        throw new Error("Trace header");
      header = true;
      offset = 8;
    }
    while (pending.length - offset >= 4) {
      const length = pending.readUInt32LE(offset);
      if (length === 0) {
        if (kind !== 0) throw new Error("Missing view block");
        const c = scenarios[index];
        const result = {
          name: c.name,
          ticks: tick - 1,
          sha256: hash.digest("hex"),
          phase: model.phase,
          score: model.score,
          overtime: model.overtime,
          physicsTicks: model.world.tick,
        };
        if (c.name.startsWith("full-") && model.phase !== "ended")
          throw new Error(`Incomplete match: ${c.name}`);
        if (!record && !isDeepStrictEqual(result, golden[c.name])) {
          difference = {
            case: c.name,
            reason: "Rust regression changed",
            expected: golden[c.name],
            actual: result,
          };
          break;
        }
        golden[c.name] = result;
        results.push(result);
        wasm.sim_destroy(handle);
        handle = 0;
        offset += 4;
        index++;
        tick = 0;
        if (index < scenarios.length) start();
        continue;
      }
      const size = length * 8;
      if (pending.length - offset < 4 + size) break;
      if (kind === 0) advance();
      const pointer =
        kind === 0 ? wasm.sim_trace(handle) : wasm.sim_state(handle);
      const actualLength = wasm.sim_state_len(handle);
      if (actualLength !== length) {
        difference = {
          case: scenarios[index].name,
          tick,
          block: kind ? "view" : "core",
          reason: "length",
          native: length,
          wasm: actualLength,
        };
        break;
      }
      const actual = Buffer.from(wasm.memory.buffer, pointer, size);
      const expected = pending.subarray(offset + 4, offset + 4 + size);
      if (!actual.equals(expected)) {
        let field = 0;
        while (
          field < length &&
          actual.readBigUInt64LE(field * 8) ===
            expected.readBigUInt64LE(field * 8)
        )
          field++;
        difference = {
          case: scenarios[index].name,
          tick,
          block: kind ? "view" : "core",
          field,
          nativeBits: expected.readBigUInt64LE(field * 8).toString(16),
          wasmBits: actual.readBigUInt64LE(field * 8).toString(16),
        };
        break;
      }
      hash.update(pending.subarray(offset, offset + 4 + size));
      fields += length;
      if (kind === 1) {
        readSimulationState(
          new Float64Array(wasm.memory.buffer, pointer, length),
          model,
        );
        if (
          model.world.cars.length !== expected.readDoubleLE(23 * 8) ||
          model.world.pads.length !== geometry.pads.length
        )
          throw new Error("Decoded model counts");
        states++;
        tick++;
      }
      kind = 1 - kind;
      offset += 4 + size;
    }
    if (difference) {
      child.kill();
      break;
    }
    pending = pending.subarray(offset);
  }
  const status = await exited;
  if (
    !difference &&
    (status !== 0 || pending.length || index !== scenarios.length)
  )
    throw new Error(`Incomplete trace: ${status}, ${stderr}`);
  if (record && !difference) {
    if (!full) throw new Error("Use --full when recording regression states");
    await writeFile(goldenUrl, JSON.stringify(golden, null, 2) + "\n");
  }
  const report = {
    status: difference ? "FAIL" : "PASS",
    mode: debug ? "debug" : "release",
    cases: scenarios.length,
    states,
    fields,
    results,
    difference,
  };
  await mkdir(new URL("../artifacts/simulation/", import.meta.url), {
    recursive: true,
  });
  await writeFile(
    new URL(
      `../artifacts/simulation/${debug ? "debug" : "release"}.json`,
      import.meta.url,
    ),
    JSON.stringify(report, null, 2),
  );
  console.log(JSON.stringify(report, null, 2));
  if (difference) process.exitCode = 1;
} finally {
  if (handle) wasm.sim_destroy(handle);
  if (child.exitCode === null && child.signalCode === null) child.kill();
}
