import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import {
  createTestPresentation,
  loadTestSimulation,
} from "../scripts/simulation-fixtures.mjs";
import { REPLAY_INPUT } from "../src/watch-replay.js";
import { playbackTime } from "../src/replay-timeline.js";

const config = (seed = 91) => ({
  teamSize: 3,
  skill: "allstar",
  playerTeam: -1,
  duration: 300,
  watch: {
    id: "test",
    seed,
    brains: ["", ""],
    names: ["blue", "orange"],
    expect: [4, 5],
  },
});
function trace(wasm, game) {
  const pointer = wasm.sim_trace(game.handle);
  return createHash("sha256")
    .update(
      new Uint8Array(
        wasm.memory.buffer,
        pointer,
        wasm.sim_state_len(game.handle) * 8,
      ),
    )
    .digest("hex");
}

test("playback labels use elapsed time, including minutes beyond an hour", () => {
  assert.equal(playbackTime(-1), "0:00");
  assert.equal(playbackTime(59.99), "0:59");
  assert.equal(playbackTime(3601), "60:01");
});

test("watch seeking keeps exact hidden state, replay images, highlights, and handle ownership", async () => {
  const engine = await loadTestSimulation();
  const exports = engine.wasm;
  const live = new Set();
  engine.wasm = {
    ...exports,
    sim_create(seed) {
      const h = exports.sim_create(seed);
      live.add(h);
      return h;
    },
    sim_clone(handle) {
      assert.ok(live.has(handle));
      const h = exports.sim_clone(handle);
      live.add(h);
      return h;
    },
    sim_destroy(handle) {
      assert.ok(live.delete(handle), "Destroy each handle once");
      exports.sim_destroy(handle);
    },
    sim_restore(handle, saved) {
      assert.ok(live.has(handle) && live.has(saved));
      exports.sim_restore(handle, saved);
    },
  };
  const fixture = await createTestPresentation(1, engine);
  const reference = await createTestPresentation(1, engine);
  const { game, wasm, calls } = fixture;
  try {
    game.startMatch(config());
    game.watch.paused = true;
    const initial = trace(wasm, game);
    assert.equal(await game.watchPreparation, true);
    assert.equal(
      trace(wasm, game),
      initial,
      "Preparation cannot alter the watched match",
    );
    assert.equal(game.watchReplay.position, 0);
    assert.ok(game.watchReplay.checkpoints.length > 5);
    const replay = game.watchReplay;
    game.watch.follow = 4;
    game.watch.speed = 4;
    assert.ok(replay.highlights.some((h) => h.type === "overtime"));
    assert.equal(replay.highlights.filter((h) => h.type === "goal").length, 9);
    assert.ok(replay.highlights.some((h) => h.type === "save"));
    assert.ok(replay.highlights.some((h) => h.type === "demo"));

    const targets = new Set([
      0,
      1,
      100,
      361,
      600,
      1500,
      replay.total - 1,
      replay.total,
    ]);
    for (const h of replay.highlights.filter((h) =>
      ["goal", "overtime"].includes(h.type),
    ))
      for (const offset of [-1, 0, 1]) targets.add(h.tick + offset);
    for (const clip of replay.clips)
      for (const tick of [
        clip.start,
        Math.floor((clip.start + clip.end) / 2),
        clip.end - 1,
        clip.end,
        clip.end + 100,
      ])
        if (tick <= replay.total) targets.add(tick);
    const points = new Set(
      [...targets].flatMap((tick) => [
        tick,
        Math.min(replay.total, tick + 1),
        Math.min(replay.total, tick + 120),
      ]),
    );
    const expected = new Map();
    const expectedMarkers = [];
    let ended = 0;
    reference.game.onMatchEnd = () => ended++;
    reference.game.startMatch(config());
    // The reference needs no index. It only plays forward through the existing presentation path.
    reference.game.watchReplay.dispose();
    reference.game.watchReplay = null;
    const originalPresent = reference.game.present;
    reference.game.present = function (events) {
      for (const event of events)
        if (["goal", "save", "demo", "overtime"].includes(event.type))
          expectedMarkers.push({
            tick: tickNow,
            type: event.type,
            score: [...this.score],
          });
      originalPresent.call(this, events);
    };
    let tickNow = 0;
    while (tickNow <= replay.total) {
      if (points.has(tickNow))
        expected.set(tickNow, {
          hash: trace(wasm, reference.game),
          phase: reference.game.phase,
          cur: reference.game.cur,
          images:
            reference.game.phase === "replay"
              ? reference.game.replayBuf.slice()
              : null,
        });
      if (tickNow === replay.total) break;
      tickNow++;
      reference.game.tick(REPLAY_INPUT);
      if (tickNow % 500 === 0) reference.calls.length = 0;
    }
    assert.equal(reference.game.phase, "ended");
    assert.equal(
      ended,
      0,
      "Watch completion must not open the live-match menu",
    );
    assert.deepEqual(
      replay.highlights.map(({ tick, type, score }) => ({ tick, type, score })),
      expectedMarkers,
    );
    assert.equal(await reference.game.watchPreparation, false);

    // Deliberately alternate forward and backward jumps.
    const ordered = [...targets].sort((a, b) => a - b);
    const alternating = [];
    while (ordered.length) {
      alternating.push(ordered.pop());
      if (ordered.length) alternating.push(ordered.shift());
    }
    for (const target of alternating) {
      calls.length = 0;
      assert.equal(await game.seekWatch(target), true);
      assert.equal(replay.position, target);
      assert.equal(
        game.watch.paused,
        true,
        "Seeking retains the pause setting",
      );
      assert.equal(game.watch.follow, 4);
      assert.equal(game.watch.speed, 4);
      assert.equal(
        trace(wasm, game),
        expected.get(target).hash,
        `Hidden state at ${target}`,
      );
      assert.equal(game.phase, expected.get(target).phase);
      assert.deepEqual(
        game.cur,
        expected.get(target).cur,
        `Current image at ${target}`,
      );
      if (game.phase === "replay") {
        assert.equal(game.replayBuf.length, game.nativeReplayLength);
        assert.deepEqual(
          game.replayBuf,
          expected.get(target).images,
          `Goal replay images at ${target}`,
        );
      }
      assert.ok(
        !calls.some((c) =>
          [
            "goal",
            "demo",
            "ballHit",
            "countdown",
            "whistle",
            "rumble",
          ].includes(c.method),
        ),
        "Fast-forward cannot play skipped effects",
      );
      for (
        let offset = 1;
        offset <= 120 && target + offset <= replay.total;
        offset++
      ) {
        game.tick(REPLAY_INPUT, true);
        if (offset === 1 || offset === 120)
          assert.equal(
            trace(wasm, game),
            expected.get(target + offset).hash,
            `Continuation at ${target}+${offset}`,
          );
      }
    }

    const first = game.seekWatch(replay.total - 1);
    const last = game.seekWatch(100);
    assert.equal(await first, false, "A newer seek cancels the previous seek");
    assert.equal(await last, true);
    assert.equal(trace(wasm, game), expected.get(100).hash);
    assert.equal(game.seeking, false);
    assert.equal(await game.seekWatch(NaN), false);
    assert.equal(await game.seekWatch(-100), true);
    assert.equal(replay.position, 0);
    assert.equal(await game.seekWatch(replay.total + 100), true);
    assert.equal(replay.position, replay.total);

    await game.seekWatch(replay.clips[0].start + 5);
    game.endReplay();
    while (game.seeking) await new Promise((r) => setTimeout(r, 5));
    assert.equal(
      replay.position,
      replay.clips[0].end,
      "Skipping a clip keeps timeline time exact",
    );
    assert.equal(trace(wasm, game), expected.get(replay.position).hash);

    const cancelled = game.seekWatch(replay.total - 1);
    game.startFreeplay();
    assert.equal(await cancelled, false);
    assert.equal(game.mode, "freeplay");
    assert.equal(game.watchReplay, null);
    assert.equal(game.seeking, false);
    assert.equal(live.size, 2, "Only the two active games remain");
  } finally {
    game.destroy();
    reference.game.destroy();
  }
  assert.equal(live.size, 0);
});

test("leaving watch mode cancels preparation and retains live input", async () => {
  const { game } = await createTestPresentation();
  try {
    game.startMatch(config());
    const preparation = game.watchPreparation;
    game.startFreeplay();
    assert.equal(await preparation, false);
    game.tick({ controls: { ...REPLAY_INPUT.controls, throttle: 1 } });
    assert.equal(game.player.controls.throttle, 1);
    assert.equal(game.watchReplay, null);
    assert.equal(await game.seekWatch(100), false);
  } finally {
    game.destroy();
  }
});

test("Rust checkpoints retain every brain module and team size", async () => {
  const { game, wasm } = await createTestPresentation();
  const step = () => wasm.sim_tick(game.handle, 0, 0, 0, 0, 0, 0, 0, 0, -1);
  try {
    for (const module of [
      "classic",
      "alpha",
      "bravo",
      "alphabravo",
      "scripted",
      "strike",
    ])
      for (const size of [1, 2, 3]) {
        const match = config();
        match.teamSize = size;
        match.watch.brains = [`module = ${module}`, `module = ${module}`];
        game.startMatch(match);
        game.watchReplay.dispose();
        game.watchReplay = null;
        await game.watchPreparation;
        for (let tick = 0; tick < 1200; tick++) step();
        const saved = wasm.sim_clone(game.handle);
        try {
          const initial = trace(wasm, game);
          for (let tick = 0; tick < 240; tick++) step();
          const result = trace(wasm, game);
          wasm.sim_restore(game.handle, saved);
          assert.equal(
            trace(wasm, game),
            initial,
            `${module} ${size}v${size} restored state`,
          );
          for (let tick = 0; tick < 240; tick++) step();
          assert.equal(
            trace(wasm, game),
            result,
            `${module} ${size}v${size} continued state`,
          );
        } finally {
          wasm.sim_destroy(saved);
        }
      }
  } finally {
    game.destroy();
  }
});

test("a preparation error releases checkpoints and leaves watching available", async () => {
  const engine = await loadTestSimulation();
  const original = engine.wasm;
  let fail = false;
  engine.wasm = {
    ...original,
    sim_tick(...args) {
      if (fail) throw new Error("Preparation test error");
      original.sim_tick(...args);
    },
  };
  const { game } = await createTestPresentation(1, engine);
  try {
    game.startMatch(config());
    fail = true;
    assert.equal(await game.watchPreparation, false);
    assert.equal(game.watchReplay.error, "Preparation test error");
    assert.equal(game.watchReplay.checkpoints.length, 0);
    assert.equal(game.watchReplay.indexHandle, 0);
    fail = false;
    game.tick(REPLAY_INPUT);
    assert.equal(game.watchReplay.position, 1);
  } finally {
    game.destroy();
  }
});
