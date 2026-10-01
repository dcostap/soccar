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
      const { elapsedMs, ...result } = JSON.parse(line);
      return result;
    })
    .sort((a, b) => a.match - b.match);
assert.deepEqual(parse(one.stdout), parse(parallel.stdout));
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
        "tick-limit status",
        "invalid arguments",
      ],
    },
    null,
    2,
  ),
);
