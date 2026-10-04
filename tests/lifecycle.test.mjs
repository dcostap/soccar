import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  createTestPresentation,
  loadTestSimulation,
} from "../scripts/simulation-fixtures.mjs";
import { REPLAY_INPUT } from "../src/watch-replay.js";

function trace(wasm, game) {
  const pointer = wasm.sim_trace(game.handle);
  return Buffer.from(
    new Uint8Array(
      wasm.memory.buffer,
      pointer,
      wasm.sim_state_len(game.handle) * 8,
    ),
  );
}

test("scene starts clear result UI, effects, pause, and old timers", async () => {
  const { game, calls, settings } = await createTestPresentation();
  let late = 0;
  try {
    game.startMatch({
      teamSize: 1,
      skill: "allstar",
      playerTeam: 0,
      duration: 1,
    });
    game.showMatchEnded(0);
    game.paused = true;
    game.excitement = 1.5;
    const camera = game.camera;
    const replayCam = game.replayCam;
    game.camera.shakeAmount = 1;
    game.camera.shakeTime = 10;
    game.camera.ballCam = !settings.gameplay.defaultBallCam;
    game.renderer.ball.visible = false;
    game.tipTimer = setTimeout(() => late++, 10);
    game.matchEndTimer = setTimeout(() => late++, 10);
    calls.length = 0;
    game.startFreeplay();
    assert.equal(game.paused, false);
    assert.equal(game.excitement, 0.3);
    assert.notEqual(game.camera, camera);
    assert.notEqual(game.replayCam, replayCam);
    assert.equal(camera.shakeAmount, 0);
    assert.equal(camera.shakeTime, 0);
    assert.equal(game.camera.ballCam, settings.gameplay.defaultBallCam);
    assert.equal(game.renderer.ball.visible, true);
    assert.ok(
      game.cur && game.prev === game.cur,
      "Render the new scene immediately",
    );
    for (const method of ["clearTransient", "silenceCars"])
      assert.ok(
        calls.some((call) => call.method === method),
        method,
      );
    assert.ok(
      calls.some(
        (call) => call.method === "showScoreboard" && call.args[0] === false,
      ),
    );
    assert.ok(
      calls.some((call) => call.method === "setDebug" && call.args[0] === null),
    );
    await new Promise((resolve) => setTimeout(resolve, 25));
    assert.equal(late, 0);
    game.matchEndTimer = setTimeout(() => late++, 10);
  } finally {
    game.destroy();
  }
  await new Promise((resolve) => setTimeout(resolve, 25));
  assert.equal(late, 0, "Destroy cancels the match-end menu");
});

for (const skill of ["allstar", "arena:modular-combo", "arena:nexto"]) {
  test(`restarting ${skill} has the exact state of a fresh simulation`, async () => {
    const engine = await loadTestSimulation();
    engine.brains = [
      {
        name: "modular-combo",
        text: await readFile("arena/brains/modular-combo.brain", "utf8"),
      },
      { name: "nexto", text: "module = nexto\n" },
    ];
    const old = await createTestPresentation(91, engine);
    const fresh = await createTestPresentation(777, engine);
    const config = { teamSize: 1, skill, playerTeam: -1, duration: 60 };
    try {
      old.game.startMatch(config);
      for (let i = 0; i < 900; i++) old.game.tick(REPLAY_INPUT);
      let saved;
      old.game.onRecordingLeaving = () => {
        saved = old.game.exportRecording();
      };
      const identity = old.game.recordingIdentity;
      old.game.nextSeed = 777;
      old.game.startMatch(config);
      fresh.game.startMatch(config);
      assert.ok(
        saved,
        "Save the previous recording before releasing its handle",
      );
      assert.notEqual(old.game.recordingIdentity, identity);
      assert.equal(old.game.recordingTicks, 0);
      assert.deepEqual(
        trace(engine.wasm, old.game),
        trace(engine.wasm, fresh.game),
      );
      for (let i = 0; i < 600; i++) {
        old.game.tick(REPLAY_INPUT);
        fresh.game.tick(REPLAY_INPUT);
        assert.deepEqual(
          trace(engine.wasm, old.game),
          trace(engine.wasm, fresh.game),
          `tick ${i}`,
        );
      }
      for (const start of ["startMenuBackground", "startFreeplay"]) {
        old.game.nextSeed = fresh.game.nextSeed = 123;
        old.game[start]();
        fresh.game[start]();
        assert.deepEqual(
          trace(engine.wasm, old.game),
          trace(engine.wasm, fresh.game),
          start,
        );
      }
    } finally {
      old.game.destroy();
      fresh.game.destroy();
    }
  });
}
