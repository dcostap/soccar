// Set piece scenario helpers: start diagrams, short result text, and watch links.
// Data comes from public/arena/setpieces.json, written by `npm run arena -- setpieces`.
// A result is `[success, credit, seconds, goal, touches]`, with goal -1 when nobody scored.

const HALF_WIDTH = 4096;
const HALF_LENGTH = 5120;
const MOUTH = 893;
const COLORS = ["#2f7bff", "#ff8a2a"];

/** Top-down start of a scenario: blue defends the bottom goal, as in the heatmaps. */
export function scenarioDiagram(s, width = 72) {
  const scale = width / (2 * HALF_WIDTH);
  const height = Math.round(2 * HALF_LENGTH * scale);
  const goal = 5;
  const canvas = document.createElement("canvas");
  const ratio = globalThis.devicePixelRatio || 1;
  canvas.width = (width + 2) * ratio;
  canvas.height = (height + 2 * goal + 2) * ratio;
  canvas.style.width = `${width + 2}px`;
  canvas.style.height = `${height + 2 * goal + 2}px`;
  const g = canvas.getContext("2d");
  g.scale(ratio, ratio);
  g.translate(1, goal + 1);
  const px = (x) => (x + HALF_WIDTH) * scale;
  const py = (y) => (HALF_LENGTH - y) * scale;
  g.fillStyle = "#0b1120";
  g.fillRect(0, 0, width, height);
  g.strokeStyle = "rgba(244,247,255,0.3)";
  g.lineWidth = 1;
  g.strokeRect(0, 0, width, height);
  g.beginPath();
  g.moveTo(0, height / 2);
  g.lineTo(width, height / 2);
  g.stroke();
  const mouth = 2 * MOUTH * scale;
  g.strokeStyle = COLORS[1];
  g.strokeRect(width / 2 - mouth / 2, -goal, mouth, goal);
  g.strokeStyle = COLORS[0];
  g.strokeRect(width / 2 - mouth / 2, height, mouth, goal);
  if (s.measurement?.path?.length) {
    g.strokeStyle = "#8fffb580";
    g.setLineDash([3, 3]);
    g.beginPath();
    for (const [i, [, x, y]] of s.measurement.path.entries()) {
      if (i) g.lineTo(px(x), py(y));
      else g.moveTo(px(x), py(y));
    }
    g.stroke();
    g.setLineDash([]);
    for (const bounce of s.measurement.bounces) {
      g.fillStyle = "#8fffb5";
      g.fillRect(px(bounce.position[0]) - 2, py(bounce.position[1]) - 2, 4, 4);
    }
  }
  const arrow = (x, y, vx, vy, color) => {
    // Arrows show one second of travel.
    if (Math.hypot(vx, vy) < 1) return;
    g.strokeStyle = color;
    g.beginPath();
    g.moveTo(px(x), py(y));
    g.lineTo(px(x + vx), py(y + vy));
    g.stroke();
  };
  for (const c of s.cars) {
    const yaw = (c.yaw * Math.PI) / 180;
    const [fx, fy] = [Math.cos(yaw), Math.sin(yaw)];
    arrow(c.x, c.y, fx * c.speed, fy * c.speed, `${COLORS[c.team]}aa`);
    g.save();
    g.translate(px(c.x), py(c.y));
    g.rotate(-yaw);
    // Glyphs grow with the diagram but stay larger than true size, so small diagrams stay readable.
    const k = Math.max(1, width / 110);
    g.fillStyle = COLORS[c.team];
    g.fillRect(-4 * k, -2.5 * k, 8 * k, 5 * k);
    g.fillStyle = "#f4f7ff";
    g.fillRect(2.5 * k, -1 * k, 2 * k, 2 * k);
    if (s.testedCar === s.cars.indexOf(c)) {
      g.strokeStyle = "#8fffb5";
      g.lineWidth = 1.5;
      g.strokeRect(-5 * k, -3.5 * k, 10 * k, 7 * k);
    }
    g.restore();
  }
  const [bx, by, bz] = s.ball;
  arrow(bx, by, s.ballVel[0], s.ballVel[1], "rgba(244,247,255,0.8)");
  g.fillStyle = "#f4f7ff";
  g.beginPath();
  g.arc(
    px(bx),
    py(by),
    Math.max(1, width / 110) * (2.5 + Math.min(2.5, bz / 400)),
    0,
    Math.PI * 2,
  );
  g.fill();
  canvas.title =
    `ball (${bx}, ${by}, ${bz})` +
    s.cars
      .map(
        (c) =>
          `\n${c.team ? "orange" : "blue"} car (${c.x}, ${c.y}) facing ${c.yaw}°` +
          (c.speed ? ` at ${c.speed}` : ""),
      )
      .join("");
  return canvas;
}

/** Short text for a result. */
export function describe(r, kind) {
  if (!r) return "-";
  const [success, credit, seconds, goal] = r;
  if (goal === 0 && kind === "attack") return `goal ${seconds.toFixed(1)}s`;
  if (goal === 1) return `conceded ${seconds.toFixed(1)}s`;
  if (goal === 0) return `scored ${seconds.toFixed(1)}s`;
  if (success) return "held";
  return credit > 0 ? `miss ${credit.toFixed(2)}` : "miss";
}

export function setPieceUrl(base, s, brain, r) {
  const q = new URLSearchParams(
    s.testedCar != null
      ? {
          setpiece: s.id,
          brain: brain.name,
        }
      : {
          setpiece: s.id,
          scenario: s.text,
          names: brain.name,
          blue: brain.text,
        },
  );
  if (r) q.set("expect", r[0] ? "pass" : "fail");
  return `${base}?${q}`;
}
