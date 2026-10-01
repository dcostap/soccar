import { spawn, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { mkdir, writeFile } from "node:fs/promises";
import { loadWorldReference } from "./world-reference.mjs";
import { createGame, gameSnapshot } from "./game-reference.mjs";
const root = fileURLToPath(new URL("../../", import.meta.url));
const debug = process.argv.includes("--debug"),
  full = process.argv.includes("--full");
const api = await loadWorldReference();
const cases = [
  {
    name: "menu",
    mode: 0,
    size: 1,
    skill: "allstar",
    player: -1,
    seed: 12345,
    duration: 300,
    ticks: 1200,
  },
  {
    name: "freeplay",
    mode: 1,
    size: 1,
    skill: "pro",
    player: 0,
    seed: 99,
    duration: 300,
    ticks: 1200,
  },
  ...[1, 2, 3].flatMap((size) =>
    ["rookie", "pro", "allstar"].map((skill) => ({
      name: `${size}v${size}-${skill}`,
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
    skill: "allstar",
    player: 0,
    seed: 67890,
    duration: 30,
    ticks: 1800,
  },
];
if (full)
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
  { cwd: root, encoding: "utf8" },
);
if (build.status !== 0) throw new Error(build.stderr);
process.stderr.write(build.stderr);
const input = Buffer.alloc(8 + cases.length * 32);
input.write("SCG1");
input.writeUInt32LE(cases.length, 4);
let o = 8;
for (const c of cases) {
  for (const n of [
    c.ticks,
    c.mode,
    c.size,
    { rookie: 0, pro: 1, allstar: 2 }[c.skill],
    c.player >>> 0,
    c.seed,
  ]) {
    input.writeUInt32LE(n, o);
    o += 4;
  }
  input.writeDoubleLE(c.duration, o);
  o += 8;
}
const binary = fileURLToPath(
  new URL(
    `../../simulation/target/${debug ? "debug" : "release"}/game_trace${process.platform === "win32" ? ".exe" : ""}`,
    import.meta.url,
  ),
);
const child = spawn(binary, [], { cwd: root, stdio: ["pipe", "pipe", "pipe"] });
const exited = new Promise((resolve, reject) => {
  child.once("error", reject);
  child.once("close", (code) => resolve(code));
});
let stderr = "";
child.stderr.on("data", (b) => {
  stderr += b;
});
child.stdin.end(input);
let pending = Buffer.alloc(0),
  header = false,
  index = 0,
  tick = 0,
  game = createGame(api, cases[0]),
  states = 0,
  fields = 0,
  difference = null;
const results = [];
for await (const chunk of child.stdout) {
  pending = pending.length ? Buffer.concat([pending, chunk]) : chunk;
  let offset = 0;
  if (!header) {
    if (pending.length < 8) continue;
    if (
      pending.toString("ascii", 0, 4) !== "SCM1" ||
      pending.readUInt32LE(4) !== cases.length
    )
      throw new Error("Trace header");
    offset = 8;
    header = true;
  }
  while (pending.length - offset >= 4) {
    const length = pending.readUInt32LE(offset);
    if (length === 0) {
      results.push({
        name: cases[index].name,
        ticks: tick - 1,
        phase: game.phase,
        score: game.score,
        overtime: game.overtime,
      });
      offset += 4;
      index++;
      tick = 0;
      if (index < cases.length) game = createGame(api, cases[index]);
      continue;
    }
    const bytes = length * 8;
    if (pending.length - offset < 4 + bytes) break;
    offset += 4;
    if (tick) {
      const c = cases[index];
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
      game.tick({ controls });
    }
    const expected = gameSnapshot(api, game);
    if (length !== expected.values.length) {
      difference = {
        case: cases[index].name,
        tick,
        field: "state.length",
        js: expected.values.length,
        rust: length,
      };
      break;
    }
    const buf = Buffer.alloc(bytes);
    expected.values.forEach((v, i) => buf.writeDoubleLE(v, i * 8));
    for (let i = 0; i < length; i++) {
      const a = buf.readBigUInt64LE(i * 8),
        b = pending.readBigUInt64LE(offset + i * 8);
      if (a !== b) {
        difference = {
          case: cases[index].name,
          tick,
          field: expected.fields[i],
          js: expected.values[i],
          rust: pending.readDoubleLE(offset + i * 8),
          jsBits: a.toString(16),
          rustBits: b.toString(16),
        };
        break;
      }
    }
    if (difference) break;
    offset += bytes;
    tick++;
    states++;
    fields += length;
  }
  if (difference) {
    child.kill();
    break;
  }
  pending = pending.subarray(offset);
}
const exit = await exited;
if (!difference && (exit !== 0 || pending.length || index !== cases.length))
  throw new Error(`Incomplete trace: ${exit}, ${stderr}`);
const report = {
  reference: api.reference,
  status: difference ? "FAIL" : "PASS",
  mode: debug ? "debug" : "release",
  cases: cases.length,
  states,
  fields,
  results,
  difference,
};
await mkdir(new URL("../../artifacts/game-port/", import.meta.url), {
  recursive: true,
});
await writeFile(
  new URL("../../artifacts/game-port/report.json", import.meta.url),
  JSON.stringify(report, null, 2),
);
console.log(JSON.stringify(report, null, 2));
if (difference) process.exitCode = 1;
