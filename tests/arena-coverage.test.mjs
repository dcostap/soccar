import test from "node:test";
import assert from "node:assert/strict";
import {
  coverageGroups,
  coverageValue,
  measurementText,
} from "../src/arena-coverage.js";

test("coverage excludes unmeasured cases and respects the suite filter", () => {
  const scenarios = [
    { suite: "a", measurement: { boost: 0, lane: "left" } },
    { suite: "b", measurement: { boost: 33, lane: "left" } },
    { suite: "a", measurement: { boost: 100, lane: "right" } },
    { suite: "a" },
  ];
  assert.deepEqual(
    coverageGroups(scenarios, "lane", (s) => s.suite === "a"),
    [
      { name: "left", value: "left", indices: [0] },
      { name: "right", value: "right", indices: [2] },
    ],
  );
  assert.equal(coverageValue(scenarios[0], "boost"), "0");
  assert.equal(coverageValue(scenarios[3], "boost"), null);
});

test("rival contact bins use measured contact speed", () => {
  assert.equal(coverageValue({ measurement: {} }, "impact"), null);
  for (const [speed, value] of [
    [999, "slow"],
    [1000, "medium"],
    [1600, "fast"],
  ]) {
    assert.equal(
      coverageValue({ measurement: { impact: { carSpeed: speed } } }, "impact"),
      value,
    );
  }
});

test("measurement details do not claim a save is possible", () => {
  const text = measurementText({
    seconds: 1.2,
    entry: [500, -5120, 400],
    entrySpeed: 2400,
    lane: "right",
    height: "high",
    arrival: "fast",
    approach: "left",
    placement: "mouth",
    heading: "away",
    motion: "reverse",
    boost: 0,
    idleSeconds: 1.2,
    reachMargin: 500,
    bounces: [],
    impact: null,
    recovery: { goalDistance: 5000, pathDistance: 1500, requiredSpeed: 1000 },
  });
  assert.match(text, /does not prove a save is possible/);
  assert.match(text, /speed 2400/);
  assert.match(text, /defender starts 5000 units/);
  assert.match(text, /Required average travel speed: 1000/);
  assert.match(text, /ignores acceleration and turning/);
});
