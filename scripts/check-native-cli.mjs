import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
const root = fileURLToPath(new URL("../", import.meta.url));
const build = spawnSync(
  "cargo",
  [
    "build",
    "--locked",
    "--release",
    "--manifest-path",
    "simulation/Cargo.toml",
    "--bin",
    "soccar_sim",
  ],
  { cwd: root, stdio: "inherit" },
);
assert.equal(build.status, 0);
const bin = fileURLToPath(
  new URL(
    `../simulation/target/release/soccar_sim${process.platform === "win32" ? ".exe" : ""}`,
    import.meta.url,
  ),
);
const run = (args) => spawnSync(bin, args, { cwd: root, encoding: "utf8" });
const one = run(["--duration", "5", "--matches", "4", "--threads", "1"]);
const parallel = run(["--duration", "5", "--matches", "4", "--threads", "2"]);
assert.equal(one.status, 0);
assert.equal(parallel.status, 0);
const parse = (text) =>
  text
    .trim()
    .split("\n")
    .map((line) => {
      // Wall-clock timings vary between runs.
      const { elapsedMs, ...result } = JSON.parse(line);
      for (const team of result.teams) delete team.brainMs;
      return result;
    })
    .sort((a, b) => a.match - b.match);
assert.deepEqual(parse(one.stdout), parse(parallel.stdout));
const summary = JSON.parse(parallel.stderr);
assert.equal(summary.matches, 4);
assert.equal(summary.completed, 4);
assert.equal(summary.blueWins + summary.orangeWins, 4);
const mixed = run([
  "--duration",
  "5",
  "--team-size",
  "1",
  "--skill",
  "rookie,allstar",
]);
assert.equal(mixed.status, 0);
assert.equal(JSON.parse(mixed.stdout).players.length, 2);
assert.equal(run(["--skill", "rookie,expert"]).status, 1);
const limited = run(["--duration", "0", "--max-ticks", "1"]);
assert.equal(limited.status, 2);
const result = JSON.parse(limited.stdout);
assert.equal(result.completed, false);
assert.equal(result.winner, null);
assert.equal(run(["--team-size", "4"]).status, 1);
assert.equal(run(["--unknown", "1"]).status, 1);
console.log(
  JSON.stringify(
    {
      status: "PASS",
      checks: [
        "parallel determinism",
        "batch summary",
        "per-team skills",
        "tick-limit status",
        "invalid arguments",
      ],
    },
    null,
    2,
  ),
);
