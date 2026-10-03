// Compare every native state word with WASM. Do not record a baseline here.
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtemp, readFile, readdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { loadTestSimulation } from "./simulation-fixtures.mjs";

const dir = await mkdtemp(path.join(tmpdir(), "soccar-recordings-"));
try {
  execFileSync(
    "cargo",
    [
      "run",
      "--quiet",
      "--release",
      "--manifest-path",
      "simulation/Cargo.toml",
      "--bin",
      "recording_check",
      "--",
      dir,
    ],
    { stdio: "inherit" },
  );
  const reportPath = path.join(dir, "inspection.json");
  const extractedPath = path.join(dir, "inspection-setpiece.txt");
  execFileSync(
    "cargo",
    [
      "run",
      "--quiet",
      "--release",
      "--manifest-path",
      "simulation/Cargo.toml",
      "--bin",
      "replay_inspect",
      "--",
      path.join(dir, "replay-0.json"),
      "--at",
      "00:10",
      "--window",
      "2",
      "--output",
      reportPath,
      "--extract",
      extractedPath,
      "--car",
      "0",
      "--kind",
      "attack",
      "--timeout",
      "2",
      "--name",
      "inspected-attack",
      "--description",
      "Test the selected car from an independently reviewed start.",
    ],
    { stdio: "inherit" },
  );
  const report = JSON.parse(await readFile(reportPath, "utf8"));
  assert.equal(report.summary.humanCar, 0);
  assert.equal(report.summary.ticks, 2400);
  assert.equal(report.selection.tick, 1200);
  assert(report.events.some((event) => event.type === "ball_hit"));
  assert(report.moments.some((moment) => moment.tick === 1200));
  const extracted = await readFile(extractedPath, "utf8");
  assert.match(extracted, /^\[inspected-attack\]/);
  assert.match(extracted, /simulation tick 1200/);
  assert.match(extracted, /^clip = /m);

  const { wasm } = await loadTestSimulation();
  const put = (handle, text) => {
    const bytes = new TextEncoder().encode(text);
    const pointer = wasm.sim_text(handle, bytes.length);
    new Uint8Array(wasm.memory.buffer, pointer, bytes.length).set(bytes);
  };
  // Preserve old data, but never replay it with different physics.
  const legacy = JSON.parse(
    await readFile(
      new URL(
        "../simulation/tests/archive/legacy-save-recording.json",
        import.meta.url,
      ),
      "utf8",
    ),
  );
  const legacyHandle = wasm.sim_create(1);
  try {
    for (const engine of [
      "0d5bdf1712f5497d",
      "88f27cd63490dfc3",
      "09645b7b1e85f2e6",
      "90163d5a55fc7b2c",
    ]) {
      put(legacyHandle, JSON.stringify({ ...legacy.recording, engine }));
      assert.equal(wasm.sim_record_load(legacyHandle), -1);
      const error = new TextDecoder().decode(
        new Uint8Array(
          wasm.memory.buffer,
          wasm.sim_text_pointer(legacyHandle),
          wasm.sim_text_len(legacyHandle),
        ),
      );
      assert.match(error, /another simulation version/);
    }
    console.log(
      "Previous-engine recordings: rejected after the physics change",
    );
  } finally {
    wasm.sim_destroy(legacyHandle);
  }
  let words = 0;
  for (const file of await readdir(dir)) {
    if (!file.endsWith(".bin")) continue;
    const stem = file.slice(0, -4),
      replay = stem.startsWith("replay-");
    const handle = wasm.sim_create(1);
    try {
      if (replay) {
        put(handle, await readFile(path.join(dir, `${stem}.json`), "utf8"));
        assert.equal(wasm.sim_record_load(handle), 1);
      } else {
        put(handle, "module = alphabravo\nshotzone = 5000");
        assert.equal(wasm.sim_brain(handle, 0), 1);
        put(handle, await readFile(path.join(dir, `${stem}.txt`), "utf8"));
        assert.equal(wasm.sim_scenario(handle, 0.5), 1);
      }
      const native = await readFile(path.join(dir, file));
      let offset = 0,
        tick = 0;
      while (offset < native.length) {
        if (tick) wasm.sim_tick(handle, 0, 0, 0, 0, 0, 0, 0, 0, -1);
        const count = native.readUInt32LE(offset);
        offset += 4;
        const pointer = wasm.sim_trace(handle),
          length = wasm.sim_state_len(handle);
        assert.equal(length, count, `${stem} tick ${tick}: state length`);
        const state = new BigUint64Array(wasm.memory.buffer, pointer, length);
        for (let i = 0; i < count; i++, offset += 8) {
          assert.equal(
            state[i],
            native.readBigUInt64LE(offset),
            `${stem} tick ${tick} field ${i}`,
          );
        }
        words += count;
        tick++;
      }
      console.log(`${stem}: ${tick - 1} ticks match exactly`);
    } finally {
      wasm.sim_destroy(handle);
    }
  }
  console.log(
    `Recording checks passed: ${words.toLocaleString()} exact state words`,
  );
} finally {
  await rm(dir, { recursive: true, force: true });
}
