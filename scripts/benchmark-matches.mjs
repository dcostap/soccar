import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { cpus } from "node:os";
import { readFile, mkdir, writeFile } from "node:fs/promises";
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
const binary = fileURLToPath(
  new URL(
    `../simulation/target/release/soccar_sim${process.platform === "win32" ? ".exe" : ""}`,
    import.meta.url,
  ),
);
const golden = JSON.parse(
  await readFile(
    new URL("../simulation/regression.json", import.meta.url),
    "utf8",
  ),
);
const runs = [];
for (const seed of [12345, 67890, 24680]) {
  const result = spawnSync(binary, ["--seed", String(seed)], {
    cwd: root,
    encoding: "utf8",
  });
  if (result.status !== 0) throw new Error(result.stderr);
  const actual = JSON.parse(result.stdout);
  const expected = golden[`full-3v3-${seed}`];
  if (
    !actual.completed ||
    JSON.stringify(actual.score) !== JSON.stringify(expected.score) ||
    actual.physicsTicks !== expected.physicsTicks
  )
    throw new Error(`Benchmark regression for ${seed}`);
  runs.push(actual);
}
// Batch throughput: independent matches on every logical CPU.
const threads = cpus().length;
const batch = spawnSync(
  binary,
  [
    "--seed",
    "1",
    "--matches",
    String(threads * 4),
    "--threads",
    String(threads),
  ],
  { cwd: root, encoding: "utf8", maxBuffer: 64 << 20 },
);
if (batch.status !== 0) throw new Error(batch.stderr);
const median = (values) =>
  [...values].sort((a, b) => a - b)[values.length >> 1];
const report = {
  cpu: cpus()[0].model,
  rust: spawnSync("rustc", ["--version"], { encoding: "utf8" }).stdout.trim(),
  configuration:
    "Native Rust: complete 300-second 3v3 allstar matches, including overtime; no rendering or replay playback",
  runs,
  medianMs: median(runs.map((r) => r.elapsedMs)),
  batch: JSON.parse(batch.stderr),
};
await mkdir(new URL("../artifacts/benchmark/", import.meta.url), {
  recursive: true,
});
await writeFile(
  new URL("../artifacts/benchmark/report.json", import.meta.url),
  JSON.stringify(report, null, 2),
);
console.log(JSON.stringify(report, null, 2));
