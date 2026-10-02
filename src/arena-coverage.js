// Measured defense groups. Unmeasured scenarios do not enter these totals.
export const COVERAGE = [
  ["", "Suites"],
  ["lane", "Goal entry"],
  ["arrival", "Arrival time"],
  ["height", "Entry height"],
  ["approach", "Ball start side"],
  ["placement", "Defender position"],
  ["heading", "Defender heading"],
  ["motion", "Defender motion"],
  ["boost", "Defender boost"],
  ["impact", "Rival contact speed"],
];

export function coverageValue(s, dimension) {
  const m = s.measurement;
  if (!m) return null;
  if (dimension === "impact") {
    if (!m.impact) return null;
    return m.impact.carSpeed < 1000
      ? "slow"
      : m.impact.carSpeed < 1600
        ? "medium"
        : "fast";
  }
  const value = m[dimension];
  return value == null ? null : String(value);
}

export function coverageGroups(scenarios, dimension, include = () => true) {
  const groups = new Map();
  scenarios.forEach((s, i) => {
    if (!include(s)) return;
    const value = coverageValue(s, dimension);
    if (value === null) return;
    if (!groups.has(value)) groups.set(value, []);
    groups.get(value).push(i);
  });
  return [...groups]
    .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
    .map(([value, indices]) => ({ name: value, value, indices }));
}

export function measurementText(m) {
  if (!m) return "";
  const lines = [
    `Without defender: goal at ${m.seconds.toFixed(2)} s; entry (${m.entry.map(Math.round).join(", ")}); speed ${Math.round(m.entrySpeed)}.`,
    `Entry: ${m.lane}, ${m.height}. Arrival: ${m.arrival}. Start side: ${m.approach}.`,
    `Defender: ${m.placement}, ${m.heading}, ${m.motion}; boost ${m.boost}.`,
    `Idle concedes at ${m.idleSeconds.toFixed(2)} s.`,
    `Travel margin: ${Math.round(m.reachMargin)} units. This estimate does not prove a save is possible.`,
  ];
  if (m.recovery)
    lines.push(
      `Recovery: defender starts ${Math.round(m.recovery.goalDistance)} units from the goal mouth and ${Math.round(m.recovery.pathDistance)} units from the nearest ball path point.`,
      `Required average travel speed: ${Math.round(m.recovery.requiredSpeed)}. This estimate ignores acceleration and turning.`,
    );
  if (m.impact)
    lines.push(
      `Rival contact: ${m.impact.seconds.toFixed(2)} s; car speed ${Math.round(m.impact.carSpeed)}; ball speed ${Math.round(m.impact.ballSpeed)}; offset ${Math.round(m.impact.offset)}.`,
    );
  for (const b of m.bounces)
    lines.push(
      `${b.surface} bounce at ${b.seconds.toFixed(2)} s; speed ${Math.round(b.speed)}.`,
    );
  return lines.join("\n");
}
