import {
  createBall,
  snapshot,
  step,
  STATE_FIELDS,
  TRACE_FIELDS,
} from "./reference.mjs";

export function encodeInput(cases) {
  const buffer = Buffer.alloc(8 + cases.length * (4 + STATE_FIELDS.length * 8));
  buffer.write("SCB1");
  buffer.writeUInt32LE(cases.length, 4);
  let offset = 8;
  for (const scenario of cases) {
    if (
      scenario.state.length !== STATE_FIELDS.length ||
      !scenario.state.every(Number.isFinite) ||
      !Number.isInteger(scenario.ticks) ||
      scenario.ticks < 0 ||
      scenario.ticks > 216000
    ) {
      throw new Error(`Invalid scenario: ${scenario.name}`);
    }
    buffer.writeUInt32LE(scenario.ticks, offset);
    offset += 4;
    for (const value of scenario.state) {
      buffer.writeDoubleLE(value, offset);
      offset += 8;
    }
  }
  return buffer;
}

export function referenceTrace(reference, cases) {
  const size =
    8 +
    cases.reduce(
      (sum, c) => sum + 4 + (c.ticks + 1) * TRACE_FIELDS.length * 8,
      0,
    );
  const buffer = Buffer.alloc(size);
  buffer.write("SCT1");
  buffer.writeUInt32LE(cases.length, 4);
  let offset = 8;
  for (const scenario of cases) {
    buffer.writeUInt32LE(scenario.ticks, offset);
    offset += 4;
    const ball = createBall(reference, scenario.state);
    for (let tick = 0; tick <= scenario.ticks; tick++) {
      if (tick !== 0) step(reference, ball);
      for (const value of snapshot(reference, ball)) {
        if (!Number.isFinite(value))
          throw new Error(
            `Non-finite reference: ${scenario.name}, tick ${tick}`,
          );
        buffer.writeDoubleLE(value, offset);
        offset += 8;
      }
    }
  }
  return buffer;
}

// Compare bytes, not rounded text. Report the first different field in case order.
export function firstDifference(expected, actual, cases) {
  if (
    actual.length !== expected.length ||
    actual.toString("ascii", 0, 4) !== "SCT1" ||
    actual.readUInt32LE(4) !== cases.length
  ) {
    throw new Error("Invalid native trace header or length");
  }
  let offset = 8;
  for (const scenario of cases) {
    if (actual.readUInt32LE(offset) !== scenario.ticks)
      throw new Error("Invalid native tick count");
    offset += 4;
    for (let tick = 0; tick <= scenario.ticks; tick++) {
      for (const field of TRACE_FIELDS) {
        const a = expected.readBigUInt64LE(offset);
        const b = actual.readBigUInt64LE(offset);
        if (a !== b) {
          const js = expected.readDoubleLE(offset);
          const rust = actual.readDoubleLE(offset);
          const bits = (value) => `0x${value.toString(16).padStart(16, "0")}`;
          return {
            case: scenario.name,
            tick,
            field,
            js,
            rust,
            jsBits: bits(a),
            rustBits: bits(b),
            absoluteError: Math.abs(js - rust),
            initialState: scenario.state,
          };
        }
        offset += 8;
      }
    }
  }
  return null;
}
