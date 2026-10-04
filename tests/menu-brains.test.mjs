import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const binary = await readFile("public/simulation/soccar_simulation.wasm");
const comboText = (await readFile("arena/brains/modular-combo.brain", "utf8"))
  .split("\n")
  .filter((line) => !line.startsWith("#"))
  .join("\n")
  .trim();

for (const exported of [
  null,
  [{ name: "modular-combo", text: comboText, games: 10, elo: 1200 }],
]) {
  test(`built-in brains work with ${exported ? "exported" : "missing"} arena data`, async (t) => {
    const previousChoices = globalThis.soccarArenaBrains;
    t.after(() => {
      if (previousChoices === undefined) delete globalThis.soccarArenaBrains;
      else globalThis.soccarArenaBrains = previousChoices;
    });
    t.mock.method(globalThis, "fetch", async (url) => {
      if (url === "/simulation/soccar_simulation.wasm")
        return new Response(binary);
      assert.equal(url, "/arena/brains.json");
      return exported
        ? Response.json({ brains: exported })
        : new Response(null, { status: 404 });
    });
    const { loadSimulation } = await import(
      `../src/simulation.js?menu=${!!exported}`
    );
    const engine = await loadSimulation();
    assert.deepEqual(
      engine.brains.map((b) => b.name),
      ["modular-combo", "nexto"],
    );
    assert.equal(engine.brains[0].text.trim(), comboText);
    assert.deepEqual(globalThis.soccarArenaBrains, [
      {
        value: "arena:modular-combo",
        label: exported ? "modular-combo (1200)" : "Modular Combo",
      },
      { value: "arena:nexto", label: "Nexto" },
    ]);
    if (exported) assert.deepEqual(engine.brains[0], exported[0]);

    const wasm = engine.wasm;
    const handle = wasm.sim_create(1);
    try {
      const text = new TextEncoder().encode(engine.brains[0].text);
      const pointer = wasm.sim_text(handle, text.length);
      new Uint8Array(wasm.memory.buffer, pointer, text.length).set(text);
      assert.equal(
        wasm.sim_brain(handle, 0),
        1,
        "Rust accepts all six combo skills",
      );
    } finally {
      wasm.sim_destroy(handle);
    }
  });
}
