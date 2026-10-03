// Replays recorded arena matches through the browser watch path and compares them with the log.
// Usage: node scripts/check-arena-replay.mjs [count] [--brain name]
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createTestPresentation } from "./simulation-fixtures.mjs";
import { parseWatch } from "../src/simulation.js";

const brainArg = process.argv.indexOf("--brain");
const onlyBrain = brainArg < 0 ? null : process.argv[brainArg + 1];
if (brainArg >= 0 && (!onlyBrain || onlyBrain.startsWith("--")))
  throw new Error("Use --brain name");

const log = await readFile(
  new URL("../arena/results/matches.jsonl", import.meta.url),
  "utf8",
).catch(() => "");
// Edited brains retire their old records, which no longer replay. The export lists current fingerprints.
const current = await readFile(
  new URL("../public/arena/brains.json", import.meta.url),
  "utf8",
)
  .then((text) => new Set(JSON.parse(text).brains.map((b) => b.fingerprint)))
  .catch(() => null);
const records = log
  .split("\n")
  .filter(Boolean)
  .map((line) => JSON.parse(line))
  .filter((r) => !current || r.fingerprints.every((f) => current.has(f)))
  .filter((r) => !onlyBrain || r.brains.includes(onlyBrain));
if (!records.length) {
  if (onlyBrain) throw new Error(`No current matches for ${onlyBrain}`);
  console.log("No arena results yet. Run `npm run arena -- ladder` first.");
  process.exit(0);
}
// The first, the last, and evenly spaced records between them, preferring an overtime match.
const count = Math.min(
  Number(process.argv[2]?.startsWith("--") ? 4 : (process.argv[2] ?? 4)),
  records.length,
);
const picked = new Set(
  Array.from({ length: count }, (_, i) =>
    Math.round((i * (records.length - 1)) / Math.max(1, count - 1)),
  ).map((i) => records[i]),
);
const overtime = records.find((r) => r.overtime);
if (overtime && picked.size > 1) {
  picked.delete([...picked][1]);
  picked.add(overtime);
}
const { game } = await createTestPresentation(1);
const statNames = ["score", "goals", "assists", "shots", "saves"];
for (const r of picked) {
  const query = new URLSearchParams({
    watch: r.id,
    seed: r.seed,
    size: r.size,
    duration: r.duration,
    blue: r.specs[0],
    orange: r.specs[1],
    names: r.brains.join(","),
    expect: r.score.join("-"),
  });
  const watch = parseWatch(`?${query}`);
  game.startMatch({
    teamSize: watch.size,
    skill: "allstar",
    playerTeam: -1,
    duration: watch.duration,
    watch,
  });
  let ticks = 0;
  while (game.phase !== "ended" && ticks < 300000) {
    game.tick({
      controls: { throttle: 0, steer: 0, pitch: 0, yaw: 0, roll: 0 },
    });
    ticks++;
  }
  assert.equal(game.phase, "ended", `match ${r.id} did not end`);
  assert.deepEqual(game.score, r.score, `match ${r.id} score`);
  assert.equal(game.world.tick, r.ticks, `match ${r.id} physics ticks`);
  r.players.forEach((p, i) => {
    const s = game.stats.get(i);
    for (const k of statNames)
      assert.equal(s[k], p[k], `match ${r.id} car ${i} ${k}`);
  });
  console.log(
    `match ${r.id}: ${r.brains[0]} ${r.score[0]}-${r.score[1]} ${r.brains[1]}${r.overtime ? " (OT)" : ""} replayed exactly, ${r.ticks} physics ticks`,
  );
}

// A moment copied while watching (key C) must start as a set piece.
{
  const r = records[0];
  game.startMatch({
    teamSize: r.size,
    skill: "allstar",
    playerTeam: -1,
    duration: r.duration,
    watch: parseWatch(
      `?${new URLSearchParams({ watch: r.id, seed: r.seed, size: r.size, duration: r.duration, blue: r.specs[0], orange: r.specs[1], names: r.brains.join(",") })}`,
    ),
  });
  for (let i = 0; i < 1500; i++)
    game.tick({
      controls: { throttle: 0, steer: 0, pitch: 0, yaw: 0, roll: 0 },
    });
  game.watch.follow = r.size; // An orange car, so the capture turns the field.
  const block = game.captureSetPiece(true);
  assert.ok(block?.includes("kind = defend"), "captured a defense");
  const text = block.split("\n").slice(1).join("\n");
  const ball = game.world.ball.pos;
  const [x, y] = /^ball = (\S+) (\S+)/m.exec(text).slice(1).map(Number);
  assert.equal(x, Math.round(-ball.x) + 0, "captured ball x, turned");
  assert.equal(y, Math.round(-ball.y) + 0, "captured ball y, turned");
  game.startMatch({
    teamSize: 1,
    playerTeam: -1,
    duration: 0,
    watch: parseWatch(
      `?${new URLSearchParams({ setpiece: "captured", scenario: text })}`,
    ),
  });
  console.log(
    `captured match ${r.id} at tick ${game.world.tick}: ${game.world.cars.length} cars, starts as a set piece`,
  );
}

// Set pieces: replay a spread of logged results through the browser path and compare each verdict.
const setpieces = await readFile(
  new URL("../public/arena/setpieces.json", import.meta.url),
  "utf8",
)
  .then(JSON.parse)
  .catch(() => null);
const cells = [];
for (const brain of setpieces?.brains ?? []) {
  if (onlyBrain && brain.name !== onlyBrain) continue;
  setpieces.results[brain.name].forEach((r, i) => {
    if (r) cells.push({ brain, scenario: setpieces.scenarios[i], r });
  });
}
const step = Math.max(1, Math.floor(cells.length / 6));
for (const { brain, scenario, r } of cells.filter((_, i) => i % step === 0)) {
  const watch = parseWatch(
    `?${new URLSearchParams({ setpiece: scenario.id, scenario: scenario.text, names: brain.name, blue: brain.text, expect: r[0] ? "pass" : "fail" })}`,
  );
  game.startMatch({ teamSize: 1, playerTeam: -1, duration: 0, watch });
  let ticks = 0;
  while (game.phase !== "ended" && ticks < 10000) {
    game.tick({
      controls: { throttle: 0, steer: 0, pitch: 0, yaw: 0, roll: 0 },
    });
    ticks++;
  }
  assert.equal(game.phase, "ended", `set piece ${scenario.id} did not end`);
  const result = game.setPieceResult();
  assert.equal(
    result.success,
    r[0] === 1,
    `${brain.name} on ${scenario.id}: ${result.note}`,
  );
  assert.equal(
    Math.round(ticks / 1.2) / 100,
    r[2],
    `${brain.name} on ${scenario.id} length`,
  );
  console.log(
    `set piece ${scenario.id} for ${brain.name}: ${result.success ? "passed" : "failed"} (${result.detail}) in ${r[2]} s, replayed exactly`,
  );
}
game.destroy();
