// Heatmap figures for the arena page. A map lists seconds per cell, row by row from the bottom goal line,
// `columns` cells per row, with the subject attacking up. See `Heatmaps` in simulation/src/harness.rs.

const RAMP = [
  [11, 17, 32],
  [24, 52, 120],
  [47, 123, 255],
  [64, 200, 190],
  [250, 220, 90],
  [255, 250, 235],
];
const BLUE = [47, 123, 255];
const ORANGE = [255, 138, 42];
const FIELD = [11, 17, 32];

function ramp(t) {
  const x = Math.min(1, Math.max(0, t)) * (RAMP.length - 1);
  const i = Math.min(RAMP.length - 2, Math.floor(x));
  const f = x - i;
  return RAMP[i].map((c, k) => Math.round(c + (RAMP[i + 1][k] - c) * f));
}
const mix = (a, b, t) => a.map((c, k) => Math.round(c + (b[k] - c) * t));
const rgb = (c) => `rgb(${c[0]},${c[1]},${c[2]})`;

/** Shares of time in the defensive, middle, and attacking thirds. */
export function thirds(map, { columns, rows }) {
  const out = [0, 0, 0];
  map.forEach((v, i) => {
    out[Math.min(2, Math.floor((Math.floor(i / columns) * 3) / rows))] += v;
  });
  const total = out.reduce((a, b) => a + b, 0) || 1;
  return out.map((v) => v / total);
}

/** Cell-wise difference of two maps, after scaling each to a total of one. */
export function difference(a, b) {
  const sa = a.reduce((x, y) => x + y, 0) || 1;
  const sb = b.reduce((x, y) => x + y, 0) || 1;
  return a.map((v, i) => v / sa - b[i] / sb);
}

/**
 * A canvas figure. `diff` maps use blue for positive and orange for negative values.
 * Shading is square-root scaled, so quiet areas stay visible beside hot spots such as the kickoff spot.
 * Pass the same `max` to figures that should share one color scale.
 */
export function heatFigure(
  map,
  grid,
  { title, caption, diff = false, scale = 11, unit = "s", max } = {},
) {
  const { columns, rows } = grid;
  const goal = Math.round(scale * 0.8);
  const canvas = document.createElement("canvas");
  const width = columns * scale;
  const height = rows * scale;
  const ratio = globalThis.devicePixelRatio || 1;
  canvas.width = (width + 2) * ratio;
  canvas.height = (height + 2 * goal + 2) * ratio;
  canvas.style.width = `${width + 2}px`;
  canvas.style.height = `${height + 2 * goal + 2}px`;
  const g = canvas.getContext("2d");
  g.scale(ratio, ratio);
  g.translate(1, goal + 1);
  const top =
    max ?? Math.max(1e-9, ...map.map((v) => (diff ? Math.abs(v) : v)));
  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      const v = map[row * columns + column];
      const t = Math.min(1, Math.sqrt(Math.abs(v) / top));
      g.fillStyle = rgb(diff ? mix(FIELD, v >= 0 ? BLUE : ORANGE, t) : ramp(t));
      // Row 0 is the bottom goal line, so it is drawn last.
      g.fillRect(column * scale, (rows - 1 - row) * scale, scale, scale);
    }
  }
  // Field markings: outline, halfway line, center circle, and both goals.
  g.strokeStyle = "rgba(244,247,255,0.35)";
  g.lineWidth = 1;
  g.strokeRect(0, 0, width, height);
  g.beginPath();
  g.moveTo(0, height / 2);
  g.lineTo(width, height / 2);
  g.stroke();
  g.beginPath();
  g.arc(width / 2, height / 2, scale * 1.8, 0, Math.PI * 2);
  g.stroke();
  const mouth = (1786 / 512) * scale;
  g.strokeStyle = "rgba(244,247,255,0.7)";
  g.strokeRect(width / 2 - mouth / 2, -goal, mouth, goal);
  g.strokeRect(width / 2 - mouth / 2, height, mouth, goal);
  // Hovering shows the cell's value.
  canvas.addEventListener("mousemove", (event) => {
    const box = canvas.getBoundingClientRect();
    const column = Math.floor((event.clientX - box.left - 1) / scale);
    const row =
      rows - 1 - Math.floor((event.clientY - box.top - goal - 1) / scale);
    if (column < 0 || column >= columns || row < 0 || row >= rows) {
      canvas.title = "";
      return;
    }
    const v = map[row * columns + column];
    canvas.title = diff
      ? `${v >= 0 ? "+" : ""}${(v * 100).toFixed(2)} percentage points`
      : `${v.toFixed(1)} ${unit}`;
  });
  const figure = document.createElement("figure");
  figure.className = "heat";
  if (title) {
    const heading = document.createElement("figcaption");
    heading.className = "heat-title";
    heading.textContent = title;
    figure.append(heading);
  }
  figure.append(canvas);
  if (!diff) {
    const bar = document.createElement("div");
    bar.className = "thirds";
    const shares = thirds(map, grid);
    for (const [i, name] of ["defense", "middle", "attack"].entries()) {
      const part = document.createElement("span");
      part.className = `third third-${i}`;
      part.style.flexGrow = String(Math.max(shares[i], 0.001));
      part.title = `${name} third ${(shares[i] * 100).toFixed(0)}%`;
      part.textContent = `${(shares[i] * 100).toFixed(0)}%`;
      bar.append(part);
    }
    figure.append(bar);
  }
  if (caption) {
    const text = document.createElement("figcaption");
    text.className = "heat-caption";
    text.textContent = caption;
    figure.append(text);
  }
  return figure;
}
