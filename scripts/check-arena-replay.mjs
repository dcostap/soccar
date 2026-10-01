// Replays recorded arena matches through the browser watch path and compares them with the log.
// Usage: node scripts/check-arena-replay.mjs [count]
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createTestPresentation } from "./simulation-fixtures.mjs";
import { parseWatch } from "../src/simulation.js";

const log = await readFile(
  new URL("../arena/results/matches.jsonl", import.meta.url),
  "utf8",
).catch(() => "");
// Edited brains retire their old records, which no longer replay. The export lists current fingerprints.
const current = await readFile(
  new URL("../public/arena/arena.json", import.meta.url),
  "utf8",
)
  .then((text) => new Set(JSON.parse(text).brains.map((b) => b.fingerprint)))
  .catch(() => null);
const records = log
  .split("\n")
  .filter(Boolean)
  .map((line) => JSON.parse(line))
  .filter((r) => !current || r.fingerprints.every((f) => current.has(f)));
if (!records.length) {
  console.log("No arena results yet. Run `npm run arena -- ladder` first.");
  process.exit(0);
}
// The first, the last, and evenly spaced records between them, preferring an overtime match.
const count = Math.min(Number(process.argv[2] ?? 4), records.length);
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
game.destroy();
