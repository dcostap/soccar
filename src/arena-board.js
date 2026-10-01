// Leaderboard view: ratings with uncertainty, sortable statistics, and the head-to-head matrix.
import {
  command,
  count,
  element,
  expected,
  fixed,
  href,
  label,
  panel,
  percent,
  scroll,
  search,
  segmented,
  signed,
} from "./arena-ui.js";

/** key, header, value, text, better (1 high, -1 low, 0 neutral), set */
const spRate = (b) =>
  b.setPieces?.played ? b.setPieces.passed / b.setPieces.played : NaN;
const style = (key, digits = 2, header = label(key)) => ({
  key,
  header,
  value: (b) => b.averages[key],
  text: (b) => fixed(b.averages[key], digits),
  better: 0,
  set: "style",
  bar: true,
});
const COLUMNS = [
  {
    key: "games",
    header: "Games",
    value: (b) => b.games,
    text: (b) => count(b.games),
    better: 0,
    set: "results",
  },
  {
    key: "win",
    header: "Win %",
    value: (b) => b.wins / b.games,
    text: (b) => percent(b.wins / b.games, 1),
    better: 1,
    set: "results",
    title: "Share of rated matches won",
  },
  {
    key: "setPieces",
    header: "Set pieces",
    value: spRate,
    text: (b) => percent(spRate(b), 1),
    better: 1,
    set: "results",
    title: "Share of set pieces passed",
  },
  {
    key: "gf",
    header: "GF",
    value: (b) => b.goalsFor,
    text: (b) => fixed(b.goalsFor, 2),
    better: 1,
    set: "results",
    title: "Goals for per match",
  },
  {
    key: "ga",
    header: "GA",
    value: (b) => b.goalsAgainst,
    text: (b) => fixed(b.goalsAgainst, 2),
    better: -1,
    set: "results",
    title: "Goals against per match",
  },
  {
    key: "gd",
    header: "GD",
    value: (b) => b.goalsFor - b.goalsAgainst,
    text: (b) => signed(b.goalsFor - b.goalsAgainst, 2),
    better: 1,
    set: "results",
    title: "Goal difference per match",
  },
  {
    key: "ms",
    header: "Brain ms",
    value: (b) => b.brainMs,
    text: (b) => fixed(b.brainMs, 0),
    better: -1,
    set: "results",
    title: "Wall-clock milliseconds the brain used per match",
  },
  style("shots"),
  style("saves"),
  style("assists"),
  style("touches"),
  style("demos"),
  style("bumps"),
  style("boostUsed", 0),
  style("airborne"),
  style("supersonic"),
  {
    key: "possession",
    header: "Poss %",
    value: (b) => b.averages.possession,
    text: (b) => fixed(100 * b.averages.possession),
    better: 0,
    set: "style",
    bar: true,
  },
];
const SETS = [
  ["results", "Results"],
  ["style", "Play style"],
  ["all", "Everything"],
];

export function renderBoard(root, ctx, route) {
  root.dataset.title = "Leaderboard";
  const { data, rated, rank } = ctx;
  const state = {
    sort: route.query.get("sort") || "elo",
    dir: route.query.get("dir") || "desc",
    cols: route.query.get("cols") || "results",
    q: route.query.get("q") || "",
  };
  const save = () =>
    ctx.replaceQuery({
      sort: state.sort === "elo" ? "" : state.sort,
      dir: state.dir === "desc" ? "" : state.dir,
      cols: state.cols === "results" ? "" : state.cols,
      q: state.q,
      keep: 1,
    });

  // Summary cards ---------------------------------------------------------------
  const cards = element("div", { class: "cards" });
  const [first, second] = rated;
  if (first) {
    const lead = second ? first.elo - second.elo : 0;
    cards.append(
      card(
        "Leader",
        element("a", { href: href(["brain", first.name]) }, first.name),
        second
          ? `${fixed(first.elo, 0)} Elo · ${signed(lead)} on ${second.name}, wins ${percent(expected(lead))} of matches`
          : `${fixed(first.elo, 0)} Elo`,
        "blue",
      ),
    );
  }
  cards.append(
    card(
      "Matches",
      count(ctx.matches.length),
      `${data.format.size}v${data.format.size}, ${data.format.duration / 60} minutes. Each format has its own ratings.`,
    ),
  );
  const current = ctx.matches.filter((m) => m.current).length;
  cards.append(
    card(
      "Current versions",
      `${count(current)} of ${count(ctx.matches.length)}`,
      current < ctx.matches.length
        ? "Matches of edited brains stay in the log but are not rated."
        : "Every logged match is rated.",
    ),
  );
  const best = [...rated]
    .filter((b) => b.setPieces?.played)
    .sort((a, b) => spRate(b) - spRate(a))[0];
  cards.append(
    card(
      "Best at set pieces",
      best
        ? element("a", { href: href(["brain", best.name]) }, best.name)
        : "-",
      best
        ? `${percent(spRate(best), 1)} of ${count(best.setPieces.played)} passed`
        : "Run set pieces to see this.",
      "orange",
    ),
  );
  root.append(cards);

  // Leaderboard -----------------------------------------------------------------
  const table = element("table", { class: "board" });
  const tools = element("span", { class: "result-count" });
  function renderTable() {
    const shown = COLUMNS.filter(
      (c) => state.cols === "all" || c.set === state.cols,
    );
    const needle = state.q.trim().toLowerCase();
    const matching = (b) =>
      !needle ||
      `${b.name} ${b.description} ${b.module}`.toLowerCase().includes(needle);
    const sortColumn =
      state.sort === "elo"
        ? { value: (b) => b.elo }
        : state.sort === "error"
          ? { value: (b) => b.error }
          : (COLUMNS.find((c) => c.key === state.sort) ?? {
              value: (b) => b.elo,
            });
    const sign = state.dir === "asc" ? 1 : -1;
    const rows = rated.filter(matching).sort((a, b) => {
      const [x, y] = [sortColumn.value(a), sortColumn.value(b)];
      const [nx, ny] = [Number.isFinite(x), Number.isFinite(y)];
      if (nx !== ny) return nx ? -1 : 1;
      return sign * (x - y) || b.elo - a.elo;
    });
    const unrated = ctx.data.brains.filter((b) => b.games === 0 && matching(b));
    tools.textContent = `${rows.length + unrated.length} of ${data.brains.length} brains`;

    const low = Math.min(...rated.map((b) => b.elo - 1.96 * b.error));
    const high = Math.max(...rated.map((b) => b.elo + 1.96 * b.error));
    const at = (elo) => `${(100 * (elo - low)) / Math.max(1, high - low)}%`;
    const leaders = new Map(
      COLUMNS.filter((c) => c.better).map((c) => {
        const values = rated.map(c.value).filter(Number.isFinite);
        return [
          c.key,
          c.better > 0 ? Math.max(...values) : Math.min(...values),
        ];
      }),
    );
    const maxima = new Map(
      COLUMNS.filter((c) => c.bar).map((c) => [
        c.key,
        Math.max(1e-9, ...rated.map(c.value).filter(Number.isFinite)),
      ]),
    );
    const sortable = (key, header, title, className = "") =>
      element(
        "th",
        {
          class: `sortable ${className}${key === state.sort ? " sorted" : ""}`,
          title,
          "aria-sort":
            key === state.sort
              ? state.dir === "asc"
                ? "ascending"
                : "descending"
              : "none",
          tabindex: 0,
          onclick: () => {
            if (state.sort === key)
              state.dir = state.dir === "desc" ? "asc" : "desc";
            else {
              state.sort = key;
              state.dir =
                key === "ga" || key === "ms" || key === "error"
                  ? "asc"
                  : "desc";
            }
            save();
            renderTable();
          },
          onkeydown: (event) =>
            event.key === "Enter" && event.currentTarget.click(),
        },
        header,
        key === state.sort
          ? element("span", { class: "arrow" }, state.dir === "asc" ? "▲" : "▼")
          : null,
      );
    const head = element(
      "tr",
      {},
      element("th", { class: "rank" }, "#"),
      element("th", { class: "text name" }, "Brain"),
      sortable(
        "elo",
        "Elo ± 95%",
        "Bradley-Terry rating, Rookie fixed at 1000",
        "rating-head",
      ),
      shown.map((c) => sortable(c.key, c.header, c.title ?? "")),
    );
    const body = rows.map((b) =>
      element(
        "tr",
        {
          class: "row",
          onclick: (event) => {
            if (!event.target.closest("a"))
              location.hash = href(["brain", b.name]);
          },
        },
        element("td", { class: "rank" }, rank.get(b.name)),
        element(
          "td",
          { class: "text name" },
          element(
            "a",
            { class: "brain-name", href: href(["brain", b.name]) },
            b.name,
          ),
          element(
            "span",
            { class: "description", title: b.description },
            b.description,
          ),
        ),
        element(
          "td",
          { class: "rating" },
          element(
            "div",
            { class: "rating-cell" },
            element("b", {}, fixed(b.elo, 0)),
            element("small", {}, `±${fixed(1.96 * b.error, 0)}`),
            element(
              "span",
              {
                class: "whisker",
                title: `${fixed(b.elo - 1.96 * b.error, 0)} to ${fixed(b.elo + 1.96 * b.error, 0)}`,
              },
              element("i", {
                class: "span",
                style: `left:${at(b.elo - 1.96 * b.error)};right:calc(100% - ${at(b.elo + 1.96 * b.error)})`,
              }),
              element("i", { class: "dot", style: `left:${at(b.elo)}` }),
            ),
          ),
        ),
        shown.map((c) => {
          const v = c.value(b);
          const lead = c.better && v === leaders.get(c.key);
          return element(
            "td",
            {
              class: lead ? "lead" : "",
              style:
                c.bar && Number.isFinite(v)
                  ? `--share:${Math.round((100 * v) / maxima.get(c.key))}%`
                  : null,
              "data-bar": c.bar ? "" : null,
            },
            c.text(b),
          );
        }),
      ),
    );
    for (const b of unrated)
      body.push(
        element(
          "tr",
          {
            class: "row unrated",
            onclick: () => (location.hash = href(["brain", b.name])),
          },
          element("td", { class: "rank" }, "-"),
          element(
            "td",
            { class: "text name" },
            element(
              "a",
              { class: "brain-name", href: href(["brain", b.name]) },
              b.name,
            ),
            element(
              "span",
              { class: "description", title: b.description },
              b.description,
            ),
          ),
          element(
            "td",
            { class: "text stale", colspan: shown.length + 1 },
            "unrated: run ",
            command("npm run arena -- ladder"),
          ),
        ),
      );
    if (!body.length)
      body.push(
        element(
          "tr",
          {},
          element(
            "td",
            { colspan: shown.length + 3, class: "text stale" },
            "No brain matches this search.",
          ),
        ),
      );
    table.replaceChildren(
      element("thead", {}, head),
      element("tbody", {}, body),
    );
  }
  root.append(
    panel("Leaderboard", scroll(table), {
      note: "Bradley-Terry ratings from every match between current brain versions. Rookie is fixed at 1000. The whisker is a 95% interval: overlapping whiskers are not yet a real difference. Click a brain for details.",
      actions: [
        tools,
        search(state.q, "Search brains  ( / )", (value) => {
          state.q = value;
          save();
          renderTable();
        }),
        segmented(SETS, state.cols, (value) => {
          state.cols = value;
          save();
          renderTable();
        }),
      ],
    }),
  );
  renderTable();

  // Head to head ------------------------------------------------------------------
  const cells = new Map();
  for (const m of ctx.matches) {
    if (!m.current) continue;
    for (const side of [0, 1]) {
      const key = `${m.brains[side]}|${m.brains[1 - side]}`;
      const cell = cells.get(key) ?? { wins: 0, games: 0 };
      cell.games++;
      if (m.win === side) cell.wins++;
      cells.set(key, cell);
    }
  }
  const matrix = element(
    "table",
    { class: "matrix" },
    element(
      "thead",
      {},
      element(
        "tr",
        {},
        element("th", { class: "text" }, "row beats column"),
        rated.map((b) =>
          element(
            "th",
            {},
            element("a", { href: href(["brain", b.name]) }, b.name),
          ),
        ),
      ),
    ),
    element(
      "tbody",
      {},
      rated.map((row) =>
        element(
          "tr",
          {},
          element(
            "th",
            { class: "text" },
            element("a", { href: href(["brain", row.name]) }, row.name),
          ),
          rated.map((col) => {
            const cell = cells.get(`${row.name}|${col.name}`);
            if (row === col) return element("td", { class: "self" }, "");
            if (!cell) return element("td", { class: "none" }, "-");
            const p = cell.wins / cell.games;
            const color = p >= 0.5 ? "47,123,255" : "255,138,42";
            return element(
              "td",
              {
                style: `--tint:rgba(${color},${Math.min(0.38, Math.abs(p - 0.5) * 1.1)})`,
              },
              element(
                "a",
                {
                  href: href(["compare", row.name, col.name]),
                  title: `${row.name} won ${cell.wins} of ${cell.games} against ${col.name}. Click to compare.`,
                },
                fixed(100 * p, 0),
                element("small", {}, cell.games),
              ),
            );
          }),
        ),
      ),
    ),
  );
  root.append(
    panel("Head to head", scroll(matrix), {
      note: "Win percentage of the row brain against the column brain, with matches played under it. Blue: row wins more. Orange: column wins more. Click a cell to compare the pair.",
    }),
  );
}

function card(title, value, detail, accent = "") {
  return element(
    "div",
    { class: `card ${accent}` },
    element("span", { class: "card-title" }, title),
    element("b", { class: "card-value" }, value),
    element("span", { class: "card-detail" }, detail),
  );
}
