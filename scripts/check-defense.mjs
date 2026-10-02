// Verify a spread of measured defense tests through native and WASM physics, word for word.
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtemp, readFile, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadTestSimulation } from "./simulation-fixtures.mjs";

const data = JSON.parse(
  await readFile(
    new URL("../public/arena/setpieces.json", import.meta.url),
    "utf8",
  ),
);
const measured = data.scenarios.filter((s) => s.measurement);
assert.ok(measured.length, "Generate defense suites and run setpieces first");
const families = [...new Set(measured.map((s) => s.suite))];
assert.equal(
  families.filter((f) => f.startsWith("defense-v2-")).length,
  9,
  "All nine normal families must exist",
);
assert.equal(
  families.filter((f) => f.startsWith("defense-v1-")).length,
  10,
  "Emergency families remain available",
);
assert.ok(
  families.includes("defense-v3-ground-recovery"),
  "Ground recovery exists",
);
for (const s of measured.filter((s) => !s.emergency)) {
  assert.ok(
    s.measurement.seconds >= 2.5 && s.measurement.seconds <= 5,
    `${s.id}: lead-in`,
  );
  assert.ok(
    s.measurement.idleSeconds >= 2.5 && s.measurement.idleSeconds <= 5,
    `${s.id}: idle lead-in`,
  );
  assert.ok(
    Math.hypot(
      s.ball[0] - Math.max(-800, Math.min(800, s.ball[0])),
      s.ball[1] + 5120,
    ) >= 2000,
    `${s.id}: start distance`,
  );
  if (s.suite === "defense-v3-ground-recovery") {
    const r = s.measurement.recovery;
    assert.ok(
      r?.goalDistance >= 2800 && r.pathDistance >= 1000,
      `${s.id}: recovery distance`,
    );
    assert.ok(
      r.requiredSpeed >= 600 && r.requiredSpeed <= 1600,
      `${s.id}: required travel`,
    );
  }
}
const brains = [
  { name: "idle", text: "module = scripted\nmode = idle" },
  data.brains.find((b) => b.name === "alphabravo"),
];
assert.ok(brains[1], "alphabravo exists");
execFileSync(
  "cargo",
  [
    "build",
    "--release",
    "--locked",
    "--manifest-path",
    "simulation/Cargo.toml",
    "--bin",
    "scenario_check",
  ],
  { stdio: "inherit" },
);
const bin = fileURLToPath(
  new URL(
    `../simulation/target/release/scenario_check${process.platform === "win32" ? ".exe" : ""}`,
    import.meta.url,
  ),
);
const { wasm } = await loadTestSimulation();
const dir = await mkdtemp(path.join(tmpdir(), "soccar-defense-"));
let words = 0,
  cases = 0;
try {
  for (const family of families) {
    const members = measured.filter((s) => s.suite === family);
    const away = members.filter((s) => s.measurement.heading === "away");
    const far = (s) =>
      s.measurement.lane === "right" &&
      ["beside", "chase"].includes(s.measurement.placement);
    const picked = [
      members.find((s) => s.measurement.heading === "facing"),
      away.find(
        (s) => far(s) && ["slow", "late"].includes(s.measurement.arrival),
      ) ??
        away.find(far) ??
        away[0],
    ];
    assert.ok(picked.every(Boolean), `${family}: heading coverage`);
    for (const scenario of picked)
      for (const brain of brains) {
        const scenarioPath = path.join(dir, "scenario.txt"),
          brainPath = path.join(dir, "brain.txt"),
          output = path.join(dir, "state.bin");
        await writeFile(scenarioPath, scenario.text);
        await writeFile(brainPath, brain.text);
        execFileSync(bin, [scenarioPath, brainPath, output]);
        const native = await readFile(output);
        const handle = wasm.sim_create(1);
        const put = (text) => {
          const bytes = new TextEncoder().encode(text);
          const pointer = wasm.sim_text(handle, bytes.length);
          new Uint8Array(wasm.memory.buffer, pointer, bytes.length).set(bytes);
        };
        try {
          put(brain.text);
          assert.equal(wasm.sim_brain(handle, 0), 1);
          put(scenario.text);
          assert.equal(wasm.sim_scenario(handle, 0.5), 1);
          let tick = 0;
          for (let offset = 0; offset < native.length; tick++) {
            if (tick) wasm.sim_tick(handle, 0, 0, 0, 0, 0, 0, 0, 0, -1);
            const count = native.readUInt32LE(offset);
            offset += 4;
            const pointer = wasm.sim_trace(handle);
            assert.equal(
              wasm.sim_state_len(handle),
              count,
              `${scenario.id}: tick ${tick} length`,
            );
            const actual = Buffer.from(wasm.memory.buffer, pointer, count * 8);
            const expected = native.subarray(offset, offset + count * 8);
            if (!actual.equals(expected)) {
              for (let i = 0; i < count; i++)
                assert.equal(
                  actual.readBigUInt64LE(i * 8),
                  expected.readBigUInt64LE(i * 8),
                  `${brain.name} on ${scenario.id}: tick ${tick}, word ${i}`,
                );
            }
            words += count;
            offset += count * 8;
          }
          console.log(`${brain.name}: ${scenario.id}, ${tick - 1} exact ticks`);
          cases++;
        } finally {
          wasm.sim_destroy(handle);
        }
      }
  }
  console.log(
    `Defense checks passed: ${cases} cases, ${words.toLocaleString()} exact state words`,
  );
} finally {
  await rm(dir, { recursive: true, force: true });
}
