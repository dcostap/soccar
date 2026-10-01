import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { loadReference, TRACE_FIELDS } from "../scripts/port/reference.mjs";
import { ballCases, seededRandom } from "../scripts/port/cases.mjs";
import {
  encodeInput,
  referenceTrace,
  firstDifference,
} from "../scripts/port/trace.mjs";

const reference = await loadReference();
const lock = JSON.parse(
  await readFile(
    new URL("../scripts/port/reference-lock.json", import.meta.url),
    "utf8",
  ),
);

test("port reference reads the locked original game code", () => {
  assert.equal(reference.sourceHash, lock.sourceHash);
  assert.equal(reference.extractedHash, lock.extractedHash);
  assert.equal(reference.dt, 1 / 120);
});

test("JavaScript ball traces repeat exactly for every port case", () => {
  const firstCases = ballCases();
  const secondCases = ballCases();
  assert.deepEqual(firstCases, secondCases);
  const first = referenceTrace(reference, firstCases);
  const second = referenceTrace(reference, secondCases);
  assert.ok(first.equals(second));
  assert.equal(
    createHash("sha256").update(encodeInput(firstCases)).digest("hex"),
    lock.inputHash,
  );
  // The port command requires the locked engine. Other Node versions can still run game tests.
  if (process.version === lock.node && process.versions.v8 === lock.v8) {
    assert.equal(
      createHash("sha256").update(first).digest("hex"),
      lock.traceHash,
    );
  }
  assert.equal(firstDifference(first, second, firstCases), null);
});

test("trace comparison identifies the first tick and field", () => {
  const cases = [{ ...ballCases()[1], ticks: 3 }];
  const expected = referenceTrace(reference, cases);
  const changed = Buffer.from(expected);
  const offset = 12 + TRACE_FIELDS.length * 8 + 3 * 8;
  changed.writeDoubleLE(123, offset);
  const mismatch = firstDifference(expected, changed, cases);
  assert.equal(mismatch.case, "free-fall");
  assert.equal(mismatch.tick, 1);
  assert.equal(mismatch.field, "vel.x");
  assert.equal(mismatch.rust, 123);
  assert.notEqual(mismatch.jsBits, mismatch.rustBits);
});

test("trace comparison preserves negative zero", () => {
  const cases = [
    { ...ballCases().find((c) => c.name === "negative-zero"), ticks: 0 },
  ];
  const expected = referenceTrace(reference, cases);
  const changed = Buffer.from(expected);
  changed.writeDoubleLE(0, 12);
  const mismatch = firstDifference(expected, changed, cases);
  assert.equal(mismatch.field, "pos.x");
  assert.equal(mismatch.jsBits, "0x8000000000000000");
  assert.equal(mismatch.rustBits, "0x0000000000000000");
});

test("binary protocol rejects incomplete or malformed traces", () => {
  const cases = [{ ...ballCases()[0], ticks: 0 }];
  const expected = referenceTrace(reference, cases);
  assert.throws(
    () => firstDifference(expected, expected.subarray(0, 10), cases),
    /header or length/,
  );
  const changed = Buffer.from(expected);
  changed.writeUInt32LE(1, 8);
  assert.throws(() => firstDifference(expected, changed, cases), /tick count/);
  assert.equal(encodeInput(cases).toString("ascii", 0, 4), "SCB1");
  assert.throws(
    () => encodeInput([{ ...cases[0], ticks: -1 }]),
    /Invalid scenario/,
  );
});

test("seeded inputs have a stable integer random sequence", () => {
  const random = seededRandom(1);
  assert.equal(random(), 1015568748 / 4294967296);
  assert.equal(random(), 1586005467 / 4294967296);
});
