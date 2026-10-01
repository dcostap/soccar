import assert from "node:assert/strict";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { loadWorldReference } from "./world-reference.mjs";
import { createRustGame } from "../../src/simulation.js";
const api = await loadWorldReference();
const bytes = await readFile(
  new URL("../../public/simulation/soccar_simulation.wasm", import.meta.url),
);
const fetch = globalThis.fetch;
globalThis.fetch = async () => ({
  ok: true,
  arrayBuffer: async () =>
    bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength),
});
const calls = [];
const service = new Proxy(
  {},
  {
    get:
      (_, method) =>
      (...args) =>
        calls.push({ method, args }),
  },
);
const renderer = new Proxy(
  { ball: { visible: true }, camera: { position: new api.Vec3() } },
  { get: (o, key) => (key in o ? o[key] : () => {}) },
);
const settings = {
  camera: {},
  gameplay: { defaultBallCam: true, playerName: "Player" },
  input: { dodgeDeadzone: 0.5 },
};
let game;
try {
  game = await createRustGame(
    { ...api, Game: api.Match },
    renderer,
    service,
    service,
    service,
    settings,
    12345,
  );
  const config = {
    teamSize: 3,
    skill: "allstar",
    playerTeam: -1,
    duration: 300,
  };
  let ended = 0;
  game.onMatchEnd = () => ended++;
  game.startMatch(config);
  let ticks = 0;
  const phases = new Set();
  while (game.phase !== "ended" && ticks < 216000) {
    phases.add(game.phase);
    game.tick({ controls: api.controls() });
    if (game.phase === "replay") {
      assert.equal(game.replayBuf.length, game.nativeReplayLength);
      assert.ok(game.replayBuf[game.replayIdx]);
      assert.ok(game.replayBuf[game.replayEnd]);
    }
    ticks++;
  }
  assert.equal(game.phase, "ended");
  assert.deepEqual(game.score, [4, 3]);
  assert.equal(ended, 1);
  assert.ok(phases.has("goal") && phases.has("replay") && game.overtime);
  assert.ok(
    calls.some((c) => c.method === "showBanner" && c.args[0] === "OVERTIME"),
  );
  assert.ok(
    calls.some((c) => c.method === "showScoreboard" && c.args[0] === true),
  );
  const report = {
    status: "PASS",
    ticks,
    score: game.score,
    overtime: game.overtime,
    phases: [...phases],
    endedCallbacks: ended,
  };
  game.startFreeplay();
  settings.input.dodgeDeadzone = 0.75;
  game.player.dodgeDeadzone = 0.75;
  game.tick({ controls: api.controls() });
  assert.equal(game.player.dodgeDeadzone, 0.75);
  report.liveInputSettings = true;
  await mkdir(new URL("../../artifacts/presentation-port/", import.meta.url), {
    recursive: true,
  });
  await writeFile(
    new URL("../../artifacts/presentation-port/report.json", import.meta.url),
    JSON.stringify(report, null, 2),
  );
  console.log(JSON.stringify(report, null, 2));
} finally {
  game?.destroy();
  globalThis.fetch = fetch;
}
