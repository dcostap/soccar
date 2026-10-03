import test from "node:test";
import assert from "node:assert/strict";
import { createTestPresentation } from "../scripts/simulation-fixtures.mjs";
import { scenarioFile, readScenarioFile } from "../src/replay-files.js";

const input = (tick) => ({
  controls: {
    throttle: 1,
    steer: 0.2,
    pitch: -0.3,
    yaw: 0.1,
    roll: 0,
    jump: tick % 180 > 150,
    boost: tick % 400 < 200,
    handbrake: false,
  },
  dodgeMag: 1,
});
function view(wasm, handle) {
  const pointer = wasm.sim_state(handle);
  return Buffer.from(
    new Uint8Array(wasm.memory.buffer, pointer, wasm.sim_state_len(handle) * 8),
  );
}

test("saved player replays preserve every displayed state and seek exactly", async () => {
  const { game, wasm } = await createTestPresentation(12345);
  try {
    game.startMatch({
      teamSize: 3,
      skill: "allstar",
      playerTeam: 1,
      duration: 60,
    });
    const states = [view(wasm, game.handle)];
    for (let i = 0; i < 1500; i++) {
      game.unlimitedBoost = i >= 900 && i < 1200;
      if (game.phase === "replay") game.endReplay();
      game.tick(input(i));
      states.push(view(wasm, game.handle));
    }
    const file = game.exportRecording();
    game.startSavedReplay(file, "player game");
    await game.watchPreparation;
    assert.equal(game.watchReplay.total, 1500);
    assert.equal(game.followed().id, 3);
    for (let i = 1; i <= 1500; i++) {
      game.tick(input(0));
      assert.deepEqual(view(wasm, game.handle), states[i], `replay frame ${i}`);
    }
    for (const tick of [600, 420, 1000, 1500, 0, 500]) {
      await game.seekWatch(tick);
      assert.deepEqual(
        view(wasm, game.handle),
        states[tick],
        `seek frame ${tick}`,
      );
    }
    game.watch.follow = 0;
    assert.equal(game.followed().id, 0);
    const scenario = game.exportCarScenario(3, "defend", 2, 0);
    const artifact = scenarioFile(
      scenario,
      "test-save",
      "Save the ball #1\nfrom this position.",
    );
    const decoded = readScenarioFile(artifact);
    assert.equal(decoded.name, "test-save");
    game.startUserScenario(decoded.text, decoded.name, {
      name: "idle",
      text: "module = scripted\nmode = idle",
    });
    await game.watchPreparation;
    assert.equal(game.watch.follow, 3);
    assert.match(game.watch.scenario, /kind = defend/);
    assert.ok(game.watchReplay.total > 0);
  } finally {
    game.destroy();
  }
});

test("failed replay imports leave the running game intact", async () => {
  const { game } = await createTestPresentation();
  try {
    game.startMatch({ teamSize: 1, skill: "pro", playerTeam: 0, duration: 60 });
    for (let i = 0; i < 500; i++) game.tick(input(i));
    const handle = game.handle;
    assert.throws(() => game.startSavedReplay("{}"), /Invalid recording/);
    assert.equal(game.handle, handle);
    assert.equal(game.watch, null);
    assert.equal(game.recordingTicks, 500);
  } finally {
    game.destroy();
  }
});

test("a complete match recording retains goals, goal replays, overtime, and the final state", async () => {
  const { game, wasm } = await createTestPresentation(12088);
  try {
    let saved = 0;
    game.onRecordingReady = () => saved++;
    game.startMatch({
      teamSize: 3,
      skill: "allstar",
      playerTeam: -1,
      duration: 300,
    });
    let ticks = 0;
    while (game.phase !== "ended" && ticks++ < 100000) game.tick(input(0));
    assert.equal(game.phase, "ended");
    assert.equal(saved, 1);
    const final = view(wasm, game.handle),
      score = [...game.score];
    const file = game.exportRecording();
    game.startSavedReplay(file, "complete match");
    await game.watchPreparation;
    assert.equal(game.watchReplay.total, ticks);
    assert.ok(game.watchReplay.highlights.some((h) => h.type === "goal"));
    assert.ok(game.watchReplay.clips.length > 0);
    await game.seekWatch(ticks);
    assert.deepEqual(view(wasm, game.handle), final);
    assert.deepEqual(game.score, score);
    assert.equal(
      saved,
      1,
      "Watching a saved game does not save another recording",
    );
  } finally {
    game.destroy();
  }
});

test("set piece files retain descriptions and reject ambiguous names", () => {
  const file = scenarioFile(
    "kind = defend\ntime = 4\n",
    "near-post",
    "Hold the near post #2.",
  );
  const result = readScenarioFile(file);
  assert.equal(result.name, "near-post");
  assert.match(result.text, /note = "Hold the near post #2\."/);
  assert.throws(() => scenarioFile("kind = attack", "../bad"));
  assert.throws(() =>
    readScenarioFile("[one]\nkind = attack\n[two]\nkind = defend"),
  );
});
