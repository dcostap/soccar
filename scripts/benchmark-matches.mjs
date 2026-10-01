import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { performance } from "node:perf_hooks";
import { cpus } from "node:os";
import { mkdir, writeFile } from "node:fs/promises";
import { loadWorldReference } from "./port/world-reference.mjs";
import { createGame } from "./port/game-reference.mjs";
const root = fileURLToPath(new URL("../", import.meta.url));
const build = spawnSync(
  "cargo",
  [
    "build",
    "--release",
    "--locked",
    "--manifest-path",
    "simulation/Cargo.toml",
    "--bin",
    "soccar_sim",
  ],
  { cwd: root, stdio: "inherit" },
);
if (build.status !== 0) process.exit(build.status ?? 1);
const api = await loadWorldReference();
function javascript(seed, duration = 300) {
  const start = performance.now();
  const game = createGame(api, {
    seed,
    mode: 2,
    size: 3,
    skill: "allstar",
    player: -1,
    duration,
  });
  game.snapshotNow = () => {};
  game.recordReplay = () => {};
  game.replayBuf = [];
  game.prev = game.cur = null;
  game.beginReplay = function (end) {
    this.endAfterReplay = end;
    end ? this.endMatch() : this.startKickoff();
  };
  let ticks = 0;
  while (game.phase !== "ended" && ticks < 216000) {
    game.tick({ controls: api.controls() });
    ticks++;
  }
  return {
    elapsedMs: performance.now() - start,
    completed: game.phase === "ended",
    score: game.score,
    physicsTicks: game.world.tick,
  };
}
javascript(99, 30);
const binary = fileURLToPath(
  new URL(
    `../simulation/target/release/soccar_sim${process.platform === "win32" ? ".exe" : ""}`,
    import.meta.url,
  ),
);
const runs = [];
for (const seed of [12345, 67890, 24680]) {
  const js = javascript(seed);
  const result = spawnSync(binary, ["--seed", String(seed)], {
    cwd: root,
    encoding: "utf8",
  });
  if (result.status !== 0) throw new Error(result.stderr);
  const rust = JSON.parse(result.stdout);
  if (
    !js.completed ||
    !rust.completed ||
    JSON.stringify(js.score) !== JSON.stringify(rust.score) ||
    js.physicsTicks !== rust.physicsTicks
  )
    throw new Error(`Benchmark parity failed for ${seed}`);
  runs.push({
    seed,
    score: rust.score,
    overtime: rust.overtime,
    physicsTicks: rust.physicsTicks,
    jsMs: Math.round(js.elapsedMs),
    rustMs: Math.round(rust.elapsedMs),
  });
}
const median = (values) =>
  [...values].sort((a, b) => a - b)[values.length >> 1];
const report = {
  cpu: cpus()[0].model,
  node: process.version,
  rust: spawnSync("rustc", ["--version"], { encoding: "utf8" }).stdout.trim(),
  configuration:
    "3v3 allstar bots, 300-second match clock, full completion including overtime; no rendering or replay playback; both retain statistics and ball rotation",
  runs,
  median: {
    jsMs: median(runs.map((r) => r.jsMs)),
    rustMs: median(runs.map((r) => r.rustMs)),
  },
};
await mkdir(new URL("../artifacts/benchmark/", import.meta.url), {
  recursive: true,
});
await writeFile(
  new URL("../artifacts/benchmark/report.json", import.meta.url),
  JSON.stringify(report, null, 2),
);
console.log(JSON.stringify(report, null, 2));
