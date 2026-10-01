// Leaderboard and match explorer for arena results. Data comes from `npm run arena -- export`.
const base = import.meta.env?.BASE_URL ?? "/";
const $ = (id) => document.getElementById(id);
const TEAM = ["blue", "orange"];
const LABELS = {
  score: "Score",
  goals: "Goals",
  assists: "Assists",
  shots: "Shots",
  saves: "Saves",
  touches: "Touches",
  demos: "Demos",
  demoed: "Demoed",
  bumps: "Bumps",
  jumps: "Jumps",
  flips: "Flips",
  bigPads: "Big pads",
  smallPads: "Small pads",
  boostUsed: "Boost used",
  distance: "Distance",
  supersonic: "Supersonic s",
  airborne: "Airborne s",
  offense: "Offense s",
  ballDistance: "Ball distance",
  possession: "Possession",
};
const label = (stat) => LABELS[stat] ?? stat;
const fixed = (x, digits = 1) => (Number.isFinite(x) ? x.toFixed(digits) : "-");
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

let data;
try {
  const response = await fetch(`${base}arena/arena.json`, {
    cache: "no-cache",
  });
  if (!response.ok) throw new Error(String(response.status));
  data = await response.json();
} catch {
  $("summary").textContent =
    "No arena data yet. Run `npm run arena -- ladder` and reload.";
  throw new Error("Missing arena data");
}

const stats = data.stats;
const statIndex = Object.fromEntries(stats.map((s, i) => [s, i + 1]));
const brains = new Map(data.brains.map((b) => [b.name, b]));
const current = data.brains.filter((b) => b.games > 0);
const matches = data.matches;
const minutes = Math.round((Date.now() / 1000 - data.generated) / 60);
$("summary").textContent =
  `${data.format.size}v${data.format.size} · ${data.format.duration / 60} min · ` +
  `${data.brains.length} brains · ${matches.length} matches · updated ${minutes < 1 ? "just now" : `${minutes} min ago`}`;

/** A link that opens the game and replays the match from its seed and brain settings. */
function watchUrl(m) {
  const q = new URLSearchParams({
    watch: m.id,
    seed: m.seed,
    size: data.format.size,
    duration: data.format.duration,
    blue: data.specs[m.specs[0]],
    orange: data.specs[m.specs[1]],
    names: m.brains.join(","),
    expect: m.score.join("-"),
  });
  return `${base}?${q}`;
}

// Leaderboard ------------------------------------------------------------
const columns = [
  ["elo", "Elo", (b) => b.elo, (b) => `${fixed(b.elo, 0)}`],
  ["error", "±", (b) => b.error * 1.96, (b) => fixed(b.error * 1.96, 0)],
  ["games", "Games", (b) => b.games, (b) => b.games],
  [
    "win",
    "Win %",
    (b) => b.wins / b.games,
    (b) => fixed((100 * b.wins) / b.games),
  ],
  ["gf", "GF", (b) => b.goalsFor, (b) => fixed(b.goalsFor, 2)],
  ["ga", "GA", (b) => b.goalsAgainst, (b) => fixed(b.goalsAgainst, 2)],
  ...[
    "shots",
    "saves",
    "assists",
    "touches",
    "demos",
    "bumps",
    "boostUsed",
    "airborne",
    "supersonic",
  ].map((s) => [
    s,
    label(s),
    (b) => b.averages[s],
    (b) => fixed(b.averages[s], s === "boostUsed" ? 0 : 2),
  ]),
  [
    "possession",
    "Poss %",
    (b) => b.averages.possession,
    (b) => fixed(100 * b.averages.possession),
  ],
  ["ms", "Brain ms", (b) => b.brainMs, (b) => fixed(b.brainMs, 0)],
];
let boardSort = "elo";
let openBrain = null;
function renderLeaderboard() {
  const column = columns.find((c) => c[0] === boardSort);
  const rows = [...current].sort((a, b) => column[2](b) - column[2](a));
  const unrated = data.brains.filter((b) => b.games === 0);
  const maxElo = Math.max(...current.map((b) => b.elo));
  const minElo = Math.min(...current.map((b) => b.elo));
  const head = element(
    "tr",
    {},
    element("th", {}, "#"),
    element("th", { class: "text" }, "Brain"),
    columns.map(([key, name]) =>
      element(
        "th",
        {
          class: `sortable${key === boardSort ? " sorted" : ""}`,
          onclick: () => {
            boardSort = key;
            renderLeaderboard();
          },
        },
        name,
      ),
    ),
  );
  const body = [];
  [...rows, ...unrated].forEach((b, i) => {
    const rated = b.games > 0;
    body.push(
      element(
        "tr",
        {
          class: "row",
          onclick: () => {
            openBrain = openBrain === b.name ? null : b.name;
            renderLeaderboard();
          },
        },
        element("td", {}, rated ? i + 1 : "-"),
        element(
          "td",
          { class: "text" },
          element("b", {}, b.name),
          element("span", { class: "description" }, b.description),
        ),
        rated
          ? columns.map(([key, , , show]) =>
              element(
                "td",
                {},
                show(b),
                key === "elo"
                  ? element("span", {
                      class: "bar",
                      style: `width:${4 + (40 * (b.elo - minElo)) / Math.max(1, maxElo - minElo)}px`,
                    })
                  : null,
              ),
            )
          : element(
              "td",
              { colspan: columns.length, class: "text stale" },
              "unrated: run the ladder",
            ),
      ),
    );
    if (openBrain === b.name) {
      body.push(
        element(
          "tr",
          { class: "detail" },
          element(
            "td",
            { colspan: columns.length + 2 },
            element("pre", {}, b.text),
            element(
              "div",
              { class: "stale" },
              `module ${b.module} · fingerprint ${b.fingerprint} · pick "${b.name}" under Bot Difficulty to play against it`,
            ),
          ),
        ),
      );
    }
  });
  $("leaderboard").replaceChildren(
    element("thead", {}, head),
    element("tbody", {}, body),
  );
}

// Head to head -------------------------------------------------------------
function renderMatrix() {
  const order = [...current].sort((a, b) => b.elo - a.elo).slice(0, 16);
  const table = new Map();
  for (const m of matches) {
    if (!m.current) continue;
    const winner = m.score[0] > m.score[1] ? 0 : 1;
    for (const side of [0, 1]) {
      const key = `${m.brains[side]}|${m.brains[1 - side]}`;
      const cell = table.get(key) ?? { wins: 0, games: 0 };
      cell.games++;
      if (winner === side) cell.wins++;
      table.set(key, cell);
    }
  }
  const head = element(
    "tr",
    {},
    element("th", { class: "text" }, ""),
    order.map((b) => element("th", {}, b.name)),
  );
  const body = order.map((row) =>
    element(
      "tr",
      {},
      element("td", { class: "text" }, element("b", {}, row.name)),
      order.map((col) => {
        const cell = table.get(`${row.name}|${col.name}`);
        if (row === col || !cell) return element("td", {}, "-");
        const p = cell.wins / cell.games;
        const color = p >= 0.5 ? "47,123,255" : "255,138,42";
        return element(
          "td",
          {
            title: `${cell.wins} of ${cell.games} matches`,
            style: `background:rgba(${color},${Math.min(0.55, Math.abs(p - 0.5) * 1.6)})`,
          },
          fixed(100 * p),
        );
      }),
    ),
  );
  $("matrix").replaceChildren(
    element("thead", {}, head),
    element("tbody", {}, body),
  );
}

// Matches ------------------------------------------------------------------
const stat = (player, name) => player[statIndex[name]];
const teamTotal = (m, team, name) =>
  m.players
    .filter((p) => p[0] === team)
    .reduce((sum, p) => sum + stat(p, name), 0);
/** Sort keys: [id, label, value(m) → number or [number, player index]]. */
const sorts = [
  ["id", "Newest", (m) => m.id],
  ["goals", "Total goals", (m) => m.score[0] + m.score[1]],
  ["margin", "Goal margin", (m) => Math.abs(m.score[0] - m.score[1])],
  ["length", "Match length (s)", (m) => m.live],
  [
    "upset",
    "Upset (loser's Elo lead)",
    (m) => {
      const w = m.score[0] > m.score[1] ? 0 : 1;
      const [winner, loser] = [
        brains.get(m.brains[w]),
        brains.get(m.brains[1 - w]),
      ];
      return m.current && winner && loser ? loser.elo - winner.elo : NaN;
    },
  ],
  ["brainMs", "Brain time (ms)", (m) => m.teams[0][2] + m.teams[1][2]],
  [
    "possessionGap",
    "Possession gap (s)",
    (m) => Math.abs(m.teams[0][0] - m.teams[1][0]),
  ],
  ...stats.flatMap((s) => [
    [
      `best:${s}`,
      `Best player: ${label(s)}`,
      (m) => {
        let best = 0;
        m.players.forEach((p, i) => {
          if (stat(p, s) > stat(m.players[best], s)) best = i;
        });
        return [stat(m.players[best], s), best];
      },
    ],
    [
      `total:${s}`,
      `Match total: ${label(s)}`,
      (m) => teamTotal(m, 0, s) + teamTotal(m, 1, s),
    ],
    [
      `gap:${s}`,
      `Team gap: ${label(s)}`,
      (m) => Math.abs(teamTotal(m, 0, s) - teamTotal(m, 1, s)),
    ],
  ]),
];
$("sort").append(
  ...sorts.map(([key, name]) => element("option", { value: key }, name)),
);
$("brain").append(
  ...data.brains.map((b) => element("option", { value: b.name }, b.name)),
);
let openMatch = null;
function renderMatches() {
  const sort = sorts.find((s) => s[0] === $("sort").value) ?? sorts[0];
  const ascending = $("order").value === "asc";
  const brain = $("brain").value;
  const rows = [];
  for (const m of matches) {
    if ($("current").checked && !m.current) continue;
    if ($("overtime").checked && !m.overtime) continue;
    if (brain && !m.brains.includes(brain)) continue;
    const value = sort[2](m);
    const [number, player] = Array.isArray(value) ? value : [value, null];
    if (!Number.isFinite(number)) continue;
    rows.push({ m, number, player });
  }
  rows.sort(
    (a, b) =>
      (ascending ? a.number - b.number : b.number - a.number) ||
      b.m.id - a.m.id,
  );
  $("matchCount").textContent =
    `${rows.length} matches. Showing the first 100. * means overtime.`;
  const head = element(
    "tr",
    {},
    ["#", "Blue", "Orange", "Score", "Length", sort[1], "Standout", ""].map(
      (h, i) =>
        element(
          "th",
          { class: i === 1 || i === 2 || i === 6 ? "text" : "" },
          h,
        ),
    ),
  );
  const body = [];
  for (const { m, number, player } of rows.slice(0, 100)) {
    const w = m.score[0] > m.score[1] ? 0 : 1;
    const p = player == null ? null : m.players[player];
    body.push(
      element(
        "tr",
        {
          class: "row",
          onclick: (event) => {
            if (event.target.closest("a")) return;
            openMatch = openMatch === m.id ? null : m.id;
            renderMatches();
          },
        },
        element("td", {}, m.id),
        element(
          "td",
          { class: `text blue${w === 0 ? " win" : ""}` },
          m.brains[0],
        ),
        element(
          "td",
          { class: `text orange${w === 1 ? " win" : ""}` },
          m.brains[1],
        ),
        element(
          "td",
          {},
          `${m.score[0]}-${m.score[1]}${m.overtime ? "*" : ""}`,
        ),
        element(
          "td",
          {},
          `${Math.floor(m.live / 60)}:${String(Math.round(m.live % 60)).padStart(2, "0")}`,
        ),
        element("td", {}, fixed(number, Number.isInteger(number) ? 0 : 1)),
        element(
          "td",
          { class: `text ${p ? TEAM[p[0]] : ""}` },
          p ? `car ${player + 1} (${m.brains[p[0]]})` : "",
          m.current
            ? null
            : element("span", { class: "stale" }, " older version"),
        ),
        element(
          "td",
          {},
          element(
            "a",
            { class: "button small", href: watchUrl(m), target: "_blank" },
            "Watch",
          ),
        ),
      ),
    );
    if (openMatch === m.id) body.push(matchDetail(m));
  }
  $("matches").replaceChildren(
    element("thead", {}, head),
    element("tbody", {}, body),
  );
}
function matchDetail(m) {
  const head = element(
    "tr",
    {},
    element("th", { class: "text" }, `seed ${m.seed}`),
    m.players.map((p, i) =>
      element("th", { class: TEAM[p[0]] }, `car ${i + 1}`),
    ),
    element("th", { class: "blue" }, "blue"),
    element("th", { class: "orange" }, "orange"),
  );
  const rows = stats.map((s) =>
    element(
      "tr",
      {},
      element("td", { class: "text" }, label(s)),
      m.players.map((p) =>
        element(
          "td",
          {},
          fixed(stat(p, s), Number.isInteger(stat(p, s)) ? 0 : 1),
        ),
      ),
      [0, 1].map((t) => element("td", {}, fixed(teamTotal(m, t, s), 0))),
    ),
  );
  for (const [i, name] of [
    "Possession s",
    "Ball in own half s",
    "Brain ms",
  ].entries()) {
    rows.push(
      element(
        "tr",
        {},
        element("td", { class: "text" }, name),
        m.players.map(() => element("td", {}, "")),
        [0, 1].map((t) => element("td", {}, fixed(m.teams[t][i], 0))),
      ),
    );
  }
  return element(
    "tr",
    { class: "detail" },
    element(
      "td",
      { colspan: 8 },
      element(
        "table",
        {},
        element("thead", {}, head),
        element("tbody", {}, rows),
      ),
    ),
  );
}
for (const id of ["sort", "order", "brain", "current", "overtime"])
  $(id).addEventListener("change", renderMatches);

renderLeaderboard();
renderMatrix();
renderMatches();
