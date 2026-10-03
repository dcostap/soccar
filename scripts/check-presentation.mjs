import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { createTestPresentation } from "./simulation-fixtures.mjs";
let game;
try {
  // Seed 12350 reaches overtime, which exercises the overtime banner.
  const fixture = await createTestPresentation(12350);
  game = fixture.game;
  const { calls, settings } = fixture;
  const config = {
    teamSize: 3,
    skill: "allstar",
    playerTeam: -1,
    duration: 300,
  };
  let ended = 0,
    winner;
  game.onMatchEnd = (team) => {
    ended++;
    winner = team;
  };
  game.startMatch(config);
  let ticks = 0;
  const phases = new Set();
  const rendered = new Set();
  while (game.phase !== "ended" && ticks < 216000) {
    phases.add(game.phase);
    game.tick({
      controls: {
        throttle: 0,
        steer: 0,
        pitch: 0,
        yaw: 0,
        roll: 0,
        jump: false,
        boost: false,
        handbrake: false,
      },
    });
    if (game.phase === "replay") {
      assert.equal(game.replayBuf.length, game.nativeReplayLength);
      assert.ok(game.replayBuf[game.replayIdx]);
      assert.ok(game.replayBuf[game.replayEnd]);
    }
    if (!rendered.has(game.phase)) {
      game.render(1 / 60, 0.5, { usingGamepad: false, scoreboard: false });
      rendered.add(game.phase);
    }
    ticks++;
  }
  assert.equal(game.phase, "ended");
  assert.deepEqual(game.score, [3, 2]);
  assert.equal(ended, 1);
  assert.equal(winner, 0);
  assert.equal(game.world.tick, 42611);
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
    rendered: [...rendered],
  };
  game.startFreeplay();
  settings.input.dodgeDeadzone = 0.75;
  game.player.dodgeDeadzone = 0.75;
  game.tick({
    controls: {
      throttle: 0,
      steer: 0,
      pitch: 0,
      yaw: 0,
      roll: 0,
      jump: false,
      boost: false,
      handbrake: false,
    },
  });
  assert.equal(game.player.dodgeDeadzone, 0.75);
  game.render(1 / 60, 0.5, { usingGamepad: false, scoreboard: false });
  report.liveInputSettings = true;
  const skipped = (await createTestPresentation()).game;
  try {
    skipped.startMatch(config);
    for (
      let tick = 0;
      tick < 216000 && skipped.phase !== "replay" && skipped.phase !== "ended";
      tick++
    )
      skipped.tick({
        controls: {
          throttle: 0,
          steer: 0,
          pitch: 0,
          yaw: 0,
          roll: 0,
          jump: false,
          boost: false,
          handbrake: false,
        },
      });
    assert.equal(skipped.phase, "replay");
    skipped.endReplay();
    assert.equal(skipped.phase, "countdown");
    assert.deepEqual({ ...skipped.cur.ballPos }, { ...skipped.world.ball.pos });
    report.replaySkip = true;
  } finally {
    skipped.destroy();
  }
  // Check save notifications against a real block, a wide shot, and an outgoing clear.
  for (const [x, vy, speed, expected] of [
    [0, -2000, 0, 1],
    [1300, -2000, 0, 0],
    [0, 500, 2000, 0],
  ]) {
    const check = await createTestPresentation(1);
    try {
      check.game.writeText(check.game.handle, "module = scripted\nmode = idle");
      assert.equal(check.wasm.sim_brain(check.game.handle, 0), 1);
      check.game.writeText(
        check.game.handle,
        `kind = defend\ntime = 3\nball = ${x} -4370 93.15\nball_vel = 0 ${vy} 0\ncar = blue ${x} -4500 90 ${speed} 0`,
      );
      assert.equal(check.wasm.sim_scenario(check.game.handle, 0.5), 1);
      check.game.sync();
      check.game.snapshotNow();
      check.game.tick({
        controls: {
          throttle: 0,
          steer: 0,
          pitch: 0,
          yaw: 0,
          roll: 0,
          jump: false,
          boost: false,
          handbrake: false,
        },
      });
      assert.equal(check.game.stats.get(0).saves, expected);
      assert.equal(
        check.calls.filter(
          (c) => c.method === "notify" && c.args[0].startsWith("SAVE "),
        ).length,
        expected,
      );
    } finally {
      check.game.destroy();
    }
  }
  report.saveNotifications = true;
  await mkdir(new URL("../artifacts/presentation/", import.meta.url), {
    recursive: true,
  });
  await writeFile(
    new URL("../artifacts/presentation/report.json", import.meta.url),
    JSON.stringify(report, null, 2),
  );
  console.log(JSON.stringify(report, null, 2));
} finally {
  game?.destroy();
}
