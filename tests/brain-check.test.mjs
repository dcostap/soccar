import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import test from "node:test";

test("custom brain checks cannot replace the regression baseline", async () => {
  const root = fileURLToPath(new URL("../", import.meta.url));
  const baseline = new URL("../simulation/regression.json", import.meta.url);
  const before = await readFile(baseline);
  for (const [args, message] of [
    [["--brains"], "Use --brains blue.brain orange.brain"],
    [
      [
        "--full",
        "--record",
        "--brains",
        "arena/brains/alphabravo.brain",
        "arena/brains/bravo.brain",
      ],
      "Custom brain checks cannot record the regression baseline",
    ],
  ]) {
    const result = spawnSync(
      process.execPath,
      ["scripts/check-simulation.mjs", ...args],
      {
        cwd: root,
        encoding: "utf8",
      },
    );
    assert.notEqual(result.status, 0);
    assert.ok(result.stderr.includes(message), result.stderr);
    assert.deepEqual(await readFile(baseline), before);
  }
});
