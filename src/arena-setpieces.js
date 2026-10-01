// Set pieces on the arena page: a suite-by-brain summary and a filterable list of scenarios with start diagrams.
// Data comes from public/arena/setpieces.json, written by `npm run arena -- setpieces`.
// A result is `[success, credit, seconds, goal, touches]`, with goal -1 when nobody scored.

const HALF_WIDTH = 4096;
const HALF_LENGTH = 5120;
const MOUTH = 893;
const COLORS = ["#2f7bff", "#ff8a2a"];
const PAGE = 60;

const element = (tag, attributes = {}, ...children) => {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attributes)) {
    if (k === "class") node.className = v;
    else if (k.startsWith("on")) node.addEventListener(k.slice(2), v);
    else node.setAttribute(k, v);
  }
  node.append(...children.flat().filter((c) => c != null));
  return node;
};

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
function describe(r, kind) {
  if (!r) return "-";
  const [success, credit, seconds, goal] = r;
  if (goal === 0 && kind === "attack") return `goal ${seconds.toFixed(1)}s`;
  if (goal === 1) return `conceded ${seconds.toFixed(1)}s`;
  if (goal === 0) return `scored ${seconds.toFixed(1)}s`;
  if (success) return "held";
  return credit > 0 ? `miss ${credit.toFixed(2)}` : "miss";
}

export function setPieceUrl(base, s, brain, r) {
  const q = new URLSearchParams({
    setpiece: s.id,
    scenario: s.text,
    names: brain.name,
    blue: brain.text,
  });
  if (r) q.set("expect", r[0] ? "pass" : "fail");
  return `${base}?${q}`;
}

/** Renders the section into `root`. */
export function renderSetPieces(root, data, base) {
  const brains = data.brains;
  const scenarios = data.scenarios;
  const result = (brain, i) => data.results[brain.name]?.[i] ?? null;
  // Difficulty: share of brains that fail, so scenarios sort from easy to hard.
  const difficulty = scenarios.map((_, i) => {
    const played = brains.map((b) => result(b, i)).filter(Boolean);
    return played.length
      ? played.filter((r) => !r[0]).length / played.length
      : 0;
  });
  const state = {
    suite: "",
    kind: "",
    brain: "",
    filter: "",
    sort: "id",
    shown: PAGE,
    open: null,
  };

  // Summary: suites as rows, brains as columns.
  const summary = element("table");
  const rate = (indices, brain) => {
    const rs = indices.map((i) => result(brain, i)).filter(Boolean);
    return rs.length ? rs.filter((r) => r[0]).length / rs.length : null;
  };
  const shade = (p) =>
    p === null
      ? ""
      : `background:rgba(${p >= 0.5 ? "47,123,255" : "255,138,42"},${Math.min(0.55, Math.abs(p - 0.5) * 1.2)})`;
  function renderSummary() {
    const groups = [
      ...data.suites.map((s) => ({
        name: s.name,
        title: s.description,
        indices: scenarios.flatMap((x, i) => (x.suite === s.name ? [i] : [])),
        suite: s.name,
      })),
      ...["attack", "defend"].map((kind) => ({
        name: kind,
        indices: scenarios.flatMap((x, i) => (x.kind === kind ? [i] : [])),
        kind,
      })),
      { name: "all", indices: scenarios.map((_, i) => i) },
    ];
    const head = element(
      "tr",
      {},
      element("th", { class: "text" }, "suite"),
      element("th", {}, "n"),
      brains.map((b) => element("th", {}, b.name)),
    );
    const rows = groups.map((group) =>
      element(
        "tr",
        {
          class: `row${group.suite === undefined ? " total" : ""}${
            (group.suite && state.suite === group.suite) ||
            (group.kind && state.kind === group.kind)
              ? " selected"
              : ""
          }`,
          title: group.title ?? "",
          onclick: () => {
            state.suite = group.suite ?? "";
            state.kind = group.kind ?? "";
            state.shown = PAGE;
            sync();
          },
        },
        element("td", { class: "text" }, element("b", {}, group.name)),
        element("td", {}, String(group.indices.length)),
        brains.map((b) => {
          const p = rate(group.indices, b);
          return element(
            "td",
            { style: shade(p) },
            p === null ? "-" : `${Math.round(100 * p)}%`,
          );
        }),
      ),
    );
    const credit = element(
      "tr",
      { class: "total" },
      element("td", { class: "text" }, "credit"),
      element("td", {}, ""),
      brains.map((b) => {
        const rs = scenarios.map((_, i) => result(b, i)).filter(Boolean);
        return element(
          "td",
          {},
          rs.length
            ? (rs.reduce((a, r) => a + r[1], 0) / rs.length).toFixed(3)
            : "-",
        );
      }),
    );
    summary.replaceChildren(
      element("thead", {}, head),
      element("tbody", {}, rows, credit),
    );
  }

  // Controls.
  const select = (id, options, key) => {
    const node = element(
      "select",
      { id },
      options.map(([value, text]) => element("option", { value }, text)),
    );
    node.addEventListener("change", () => {
      state[key] = node.value;
      state.shown = PAGE;
      sync();
    });
    return node;
  };
  const suiteSelect = select(
    "setSuite",
    [["", "All"], ...data.suites.map((s) => [s.name, s.name])],
    "suite",
  );
  const kindSelect = select(
    "setKind",
    [
      ["", "Both"],
      ["attack", "Attack"],
      ["defend", "Defend"],
    ],
    "kind",
  );
  const brainSelect = select(
    "setBrain",
    [["", "Any brain"], ...brains.map((b) => [b.name, b.name])],
    "brain",
  );
  const filterSelect = select(
    "setFilter",
    [
      ["", "All scenarios"],
      ["fail", "Failed"],
      ["pass", "Passed"],
      ["unique-fail", "Failed, while another brain passed"],
      ["unique-pass", "Passed, while another brain failed"],
    ],
    "filter",
  );
  const sortSelect = select(
    "setSort",
    [
      ["id", "Name"],
      ["easy", "Easiest first"],
      ["hard", "Hardest first"],
    ],
    "sort",
  );
  const label = (text, node) => element("label", {}, text, " ", node);
  const controls = element(
    "div",
    { class: "controls" },
    label("Suite", suiteSelect),
    label("Kind", kindSelect),
    label("Brain", brainSelect),
    label("Show", filterSelect),
    label("Sort", sortSelect),
  );
  const count = element("p", { class: "note" });
  const list = element("table");
  const more = element(
    "button",
    {
      class: "button more",
      onclick: () => {
        state.shown += PAGE;
        renderList();
      },
    },
    "Show more",
  );

  function selected() {
    let indices = scenarios
      .map((_, i) => i)
      .filter(
        (i) =>
          (!state.suite || scenarios[i].suite === state.suite) &&
          (!state.kind || scenarios[i].kind === state.kind),
      );
    const brain = brains.find((b) => b.name === state.brain);
    if (brain && state.filter) {
      indices = indices.filter((i) => {
        const r = result(brain, i);
        if (!r) return false;
        const others = brains
          .filter((b) => b !== brain)
          .map((b) => result(b, i))
          .filter(Boolean);
        switch (state.filter) {
          case "fail":
            return !r[0];
          case "pass":
            return !!r[0];
          case "unique-fail":
            return !r[0] && others.some((o) => o[0]);
          case "unique-pass":
            return !!r[0] && others.some((o) => !o[0]);
        }
        return true;
      });
    }
    if (state.sort !== "id")
      indices.sort(
        (a, b) =>
          (state.sort === "easy" ? 1 : -1) * (difficulty[a] - difficulty[b]) ||
          a - b,
      );
    return indices;
  }

  function cell(s, i, brain) {
    const r = result(brain, i);
    const text = describe(r, s.kind);
    if (!r) return element("td", {}, "-");
    return element(
      "td",
      { class: r[0] ? "pass" : "fail", title: `${r[4]} touches` },
      element(
        "a",
        {
          href: setPieceUrl(base, s, brain, r),
          target: "_blank",
          title: `Watch ${brain.name} play ${s.id}`,
        },
        text,
      ),
    );
  }

  function renderList() {
    const indices = selected();
    count.textContent =
      `${indices.length} of ${scenarios.length} scenarios.` +
      (state.filter && !state.brain
        ? " Choose a brain to filter by result."
        : "");
    const head = element(
      "tr",
      {},
      element("th", {}, ""),
      element("th", { class: "text" }, "scenario"),
      element("th", {}, "time"),
      element("th", { title: "A car that does nothing" }, "idle"),
      brains.map((b) => element("th", {}, b.name)),
    );
    const rows = [];
    for (const i of indices.slice(0, state.shown)) {
      const s = scenarios[i];
      rows.push(
        element(
          "tr",
          {
            class: "row",
            onclick: (event) => {
              if (event.target.closest("a")) return;
              state.open = state.open === i ? null : i;
              renderList();
            },
          },
          element("td", { class: "diagram" }, scenarioDiagram(s)),
          element(
            "td",
            { class: "text" },
            element("b", {}, s.id),
            " ",
            element("span", { class: `kind ${s.kind}` }, s.kind),
            s.rival ? element("span", { class: "rival" }, s.rival) : null,
            element("span", { class: "description" }, s.note),
          ),
          element("td", {}, `${s.time} s`),
          element(
            "td",
            { class: `idle ${s.idle[0] ? "pass" : "fail"}` },
            describe(s.idle, s.kind),
          ),
          brains.map((b) => cell(s, i, b)),
        ),
      );
      if (state.open === i)
        rows.push(
          element(
            "tr",
            { class: "detail" },
            element(
              "td",
              { colspan: 4 + brains.length },
              element(
                "div",
                { class: "setpiece-detail" },
                scenarioDiagram(s, 220),
                element(
                  "div",
                  {},
                  element("pre", {}, s.text),
                  element(
                    "p",
                    { class: "note" },
                    `Failed by ${Math.round(difficulty[i] * 100)}% of brains. Click a result to watch it in the game.`,
                  ),
                ),
              ),
            ),
          ),
        );
    }
    list.replaceChildren(
      element("thead", {}, head),
      element("tbody", {}, rows),
    );
    more.hidden = indices.length <= state.shown;
  }

  function sync() {
    suiteSelect.value = state.suite;
    kindSelect.value = state.kind;
    renderSummary();
    renderList();
  }

  root.replaceChildren(
    element("div", { class: "scroll" }, summary),
    controls,
    count,
    element("div", { class: "scroll" }, list),
    more,
  );
  sync();
}
