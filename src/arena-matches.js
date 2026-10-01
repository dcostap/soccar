// Matches view (filter, sort, inspect) and the single match page.
import { heatFigure } from "./arena-heat.js";
import {
  STAT_GROUPS,
  TEAM,
  clock,
  copy,
  element,
  empty,
  field,
  fixed,
  href,
  label,
  panel,
  percent,
  scroll,
  select,
  smart,
  toggle,
} from "./arena-ui.js";

const PAGE = 50;

function sortList(ctx) {
  const { stats, statIndex, brains } = ctx;
  const stat = (p, name) => p[statIndex[name]];
  const teamTotal = (m, team, name) =>
    m.players
      .filter((p) => p[0] === team)
      .reduce((sum, p) => sum + stat(p, name), 0);
  const general = [
    ["id", "Newest", (m) => m.id],
    ["goals", "Total goals", (m) => m.total],
    ["margin", "Goal margin", (m) => m.margin],
    ["length", "Match length (s)", (m) => m.live],
    [
      "upset",
      "Upset (loser's Elo lead)",
      (m) => {
        if (m.win < 0) return NaN;
        const winner = brains.get(m.brains[m.win]);
        const loser = brains.get(m.brains[1 - m.win]);
        return m.current && winner && loser ? loser.elo - winner.elo : NaN;
      },
    ],
    ["brainMs", "Brain time (ms)", (m) => m.teams[0][2] + m.teams[1][2]],
    [
      "possessionGap",
      "Possession gap (s)",
      (m) => Math.abs(m.teams[0][0] - m.teams[1][0]),
    ],
  ];
  const best = stats.map((s) => [
    `best:${s}`,
    label(s),
    (m) => {
      let top = 0;
      m.players.forEach((p, i) => {
        if (stat(p, s) > stat(m.players[top], s)) top = i;
      });
      return [stat(m.players[top], s), top];
    },
  ]);
  const total = stats.map((s) => [
    `total:${s}`,
    label(s),
    (m) => teamTotal(m, 0, s) + teamTotal(m, 1, s),
  ]);
  const gap = stats.map((s) => [
    `gap:${s}`,
    label(s),
    (m) => Math.abs(teamTotal(m, 0, s) - teamTotal(m, 1, s)),
  ]);
  return { general, best, total, gap, teamTotal, stat };
}

export function renderMatches(root, ctx, route) {
  root.dataset.title = "Matches";
  const sorts = sortList(ctx);
  const all = [
    ...sorts.general,
    ...sorts.best.map(([k, n, f]) => [k, `Best player: ${n}`, f]),
    ...sorts.total.map(([k, n, f]) => [k, `Match total: ${n}`, f]),
    ...sorts.gap.map(([k, n, f]) => [k, `Team gap: ${n}`, f]),
  ];
  const q = route.query;
  const state = {
    brain: q.get("brain") || "",
    vs: q.get("vs") || "",
    result: q.get("result") || "",
    sort: all.some((s) => s[0] === q.get("sort")) ? q.get("sort") : "id",
    order: q.get("order") || "desc",
    current: q.get("all") !== "1",
    overtime: q.get("overtime") === "1",
    id: q.get("id") || "",
    page: Math.max(1, Number(q.get("page")) || 1),
  };
  let focus = -1;
  let opened = null;
  let visible = [];
  const save = () =>
    ctx.replaceQuery({
      brain: state.brain,
      vs: state.vs,
      result: state.brain ? state.result : "",
      sort: state.sort === "id" ? "" : state.sort,
      order: state.order === "desc" ? "" : state.order,
      all: state.current ? "" : 1,
      overtime: state.overtime ? 1 : "",
      id: state.id,
      page: state.page > 1 ? state.page : "",
      keep: 1,
    });

  const summary = element("div", { class: "summary-line" });
  const table = element("table", { class: "matches" });
  const pager = element("div", { class: "pager" });
  const names = ctx.data.brains.map((b) => b.name);
  const controls = element("div", { class: "toolbar" });

  function filtered() {
    const sort = all.find((s) => s[0] === state.sort);
    const rows = [];
    for (const m of ctx.matches) {
      if (state.current && !m.current) continue;
      if (state.overtime && !m.overtime) continue;
      if (state.brain && !m.brains.includes(state.brain)) continue;
      if (state.vs && !m.brains.includes(state.vs)) continue;
      if (state.id && !String(m.id).startsWith(state.id)) continue;
      if (state.brain && state.result) {
        const side = m.brains[0] === state.brain ? 0 : 1;
        const outcome = m.win < 0 ? "draw" : m.win === side ? "won" : "lost";
        if (outcome !== state.result) continue;
      }
      const value = sort[2](m);
      const [number, player] = Array.isArray(value) ? value : [value, null];
      if (!Number.isFinite(number)) continue;
      rows.push({ m, number, player });
    }
    const sign = state.order === "asc" ? 1 : -1;
    rows.sort((a, b) => sign * (a.number - b.number) || b.m.id - a.m.id);
    return { rows, sort };
  }

  const side = (m) => (m.brains[0] === state.brain ? 0 : 1);
  function renderSummary(rows) {
    const bits = [element("b", {}, `${rows.length.toLocaleString()} matches`)];
    if (state.brain && rows.length) {
      let wins = 0;
      let losses = 0;
      let gf = 0;
      let ga = 0;
      for (const { m } of rows) {
        const s = side(m);
        if (m.win === s) wins++;
        else if (m.win >= 0) losses++;
        gf += m.score[s];
        ga += m.score[1 - s];
      }
      bits.push(
        element(
          "span",
          {},
          `${state.brain}${state.vs ? ` vs ${state.vs}` : ""}: `,
          element("b", { class: "win-text" }, `${wins} won`),
          ` · ${losses} lost · ${rows.length - wins - losses} drawn · ${percent(wins / rows.length, 1)} win rate · goals ${fixed(gf / rows.length, 2)}–${fixed(ga / rows.length, 2)} per match`,
        ),
      );
    }
    bits.push(element("span", { class: "stale" }, "* overtime"));
    summary.replaceChildren(...bits);
  }

  function renderTable() {
    const { rows, sort } = filtered();
    const pages = Math.max(1, Math.ceil(rows.length / PAGE));
    state.page = Math.min(state.page, pages);
    const slice = rows.slice((state.page - 1) * PAGE, state.page * PAGE);
    visible = slice.map((r) => r.m);
    renderSummary(rows);
    const showValue = state.sort !== "id";
    const showStandout = state.sort.startsWith("best:");
    const head = element(
      "tr",
      {},
      element("th", {}, "#"),
      state.brain ? element("th", {}, "") : null,
      element("th", { class: "text" }, "Blue"),
      element("th", {}, "Score"),
      element("th", { class: "text" }, "Orange"),
      element("th", {}, "Length"),
      showValue ? element("th", { class: "sorted" }, sort[1]) : null,
      showStandout ? element("th", { class: "text" }, "Standout") : null,
      element("th", {}, ""),
    );
    const columns =
      6 + (state.brain ? 1 : 0) + (showValue ? 1 : 0) + (showStandout ? 1 : 0);
    const body = [];
    slice.forEach(({ m, number, player }, index) => {
      const p = player == null ? null : m.players[player];
      const s = state.brain ? side(m) : 0;
      const outcome = m.win < 0 ? "D" : m.win === s ? "W" : "L";
      body.push(
        element(
          "tr",
          {
            class: `row${opened === m.id ? " open" : ""}${focus === index ? " focus" : ""}`,
            "data-id": m.id,
            onclick: (event) => {
              if (event.target.closest("a, button")) return;
              focus = index;
              toggleOpen(m.id);
            },
          },
          element(
            "td",
            { class: "id" },
            element("a", { href: href(["match", m.id]) }, m.id),
          ),
          state.brain
            ? element(
                "td",
                {},
                element("span", { class: `result ${outcome}` }, outcome),
              )
            : null,
          element(
            "td",
            { class: `text blue${m.win === 0 ? " win" : ""}` },
            element(
              "a",
              {
                class: `brain-link${m.brains[0] === state.brain ? " me" : ""}`,
                href: href(["brain", m.brains[0]]),
              },
              m.brains[0],
            ),
          ),
          element(
            "td",
            { class: "score" },
            element("span", { class: m.win === 0 ? "win" : "" }, m.score[0]),
            "–",
            element("span", { class: m.win === 1 ? "win" : "" }, m.score[1]),
            m.overtime ? element("sup", { title: "Overtime" }, "OT") : null,
          ),
          element(
            "td",
            { class: `text orange${m.win === 1 ? " win" : ""}` },
            element(
              "a",
              {
                class: `brain-link${m.brains[1] === state.brain ? " me" : ""}`,
                href: href(["brain", m.brains[1]]),
              },
              m.brains[1],
            ),
          ),
          element("td", { class: "muted" }, clock(m.live)),
          showValue ? element("td", { class: "sorted" }, smart(number)) : null,
          showStandout
            ? element(
                "td",
                { class: `text ${p ? TEAM[p[0]] : ""}` },
                p ? `car ${player + 1} (${m.brains[p[0]]})` : "",
                m.current
                  ? null
                  : element("span", { class: "stale" }, " older version"),
              )
            : null,
          element(
            "td",
            { class: "actions" },
            element(
              "a",
              {
                class: "button small",
                href: ctx.watchUrl(m),
                target: "_blank",
                rel: "noopener",
              },
              "Watch",
            ),
          ),
        ),
      );
      if (opened === m.id)
        body.push(
          element(
            "tr",
            { class: "detail" },
            element(
              "td",
              { colspan: columns },
              matchPanel(ctx, m, { compact: true }),
            ),
          ),
        );
    });
    if (!slice.length)
      body.push(
        element(
          "tr",
          {},
          element(
            "td",
            { colspan: columns },
            empty(
              "No matches fit these filters",
              "Loosen a filter or clear the brain.",
            ),
          ),
        ),
      );
    table.replaceChildren(
      element("thead", {}, head),
      element("tbody", {}, body),
    );
    pager.replaceChildren(
      ...(pages > 1
        ? [
            pageButton("«", 1, state.page === 1),
            pageButton("‹ Prev", state.page - 1, state.page === 1),
            element("span", {}, `Page ${state.page} of ${pages}`),
            pageButton("Next ›", state.page + 1, state.page === pages),
            pageButton("»", pages, state.page === pages),
          ]
        : []),
    );
    save();
  }
  const pageButton = (text, page, disabled) =>
    element(
      "button",
      {
        class: "button ghost small",
        disabled,
        onclick: () => {
          state.page = page;
          opened = null;
          focus = -1;
          renderTable();
          table.scrollIntoView({ block: "start" });
        },
      },
      text,
    );
  function toggleOpen(id) {
    opened = opened === id ? null : id;
    renderTable();
  }
  const reset = () => {
    state.page = 1;
    opened = null;
    focus = -1;
    renderTable();
  };

  const idInput = element("input", {
    type: "search",
    inputmode: "numeric",
    placeholder: "Match #",
    value: state.id,
    "aria-label": "Match number",
  });
  idInput.addEventListener("input", () => {
    state.id = idInput.value.replace(/\D/g, "");
    reset();
  });
  const brainSelect = select(
    [["", "Any brain"], ...names],
    state.brain,
    (v) => {
      state.brain = v;
      if (!v) state.result = "";
      resultField.hidden = !v;
      reset();
    },
  );
  const vsSelect = select([["", "Anyone"], ...names], state.vs, (v) => {
    state.vs = v;
    reset();
  });
  const resultSelect = select(
    [
      ["", "Any result"],
      ["won", "Won"],
      ["lost", "Lost"],
      ["draw", "Drawn"],
    ],
    state.result,
    (v) => {
      state.result = v;
      reset();
    },
  );
  const resultField = field("Result", resultSelect);
  resultField.hidden = !state.brain;
  const sortSelect = select(
    [
      { group: "Match", options: sorts.general.map(([k, n]) => [k, n]) },
      { group: "Best player", options: sorts.best.map(([k, n]) => [k, n]) },
      { group: "Match total", options: sorts.total.map(([k, n]) => [k, n]) },
      { group: "Team gap", options: sorts.gap.map(([k, n]) => [k, n]) },
    ],
    state.sort,
    (v) => {
      state.sort = v;
      reset();
    },
  );
  const orderSelect = select(
    [
      ["desc", "Largest first"],
      ["asc", "Smallest first"],
    ],
    state.order,
    (v) => {
      state.order = v;
      reset();
    },
  );
  controls.append(
    field("Brain", brainSelect),
    field("Against", vsSelect),
    resultField,
    field("Sort by", sortSelect),
    field("Order", orderSelect),
    field("Find", idInput),
    toggle("Overtime only", state.overtime, (v) => {
      state.overtime = v;
      reset();
    }),
    toggle("Current versions only", state.current, (v) => {
      state.current = v;
      reset();
    }),
    element(
      "button",
      {
        class: "button ghost small",
        onclick: () => location.assign(href(["matches"])),
      },
      "Clear",
    ),
  );

  root.append(
    panel(
      "Matches",
      element("div", {}, controls, summary, scroll(table), pager),
      {
        note: "Every logged match. Sort by any statistic to find the interesting ones. Click a row for its statistics and positions, Watch to replay it in the game.",
      },
    ),
    element(
      "p",
      { class: "hint" },
      element("kbd", {}, "j"),
      " ",
      element("kbd", {}, "k"),
      " move · ",
      element("kbd", {}, "Enter"),
      " details · ",
      element("kbd", {}, "w"),
      " watch · ",
      element("kbd", {}, "o"),
      " open page",
    ),
  );
  renderTable();

  const onKey = (event) => {
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    if (event.target.closest?.("input, select, textarea, button, a")) return;
    const key = event.key;
    if (!["j", "k", "Enter", "w", "o"].includes(key)) return;
    if (!visible.length) return;
    event.preventDefault();
    if (key === "j" || key === "k") {
      focus = Math.min(
        visible.length - 1,
        Math.max(0, focus + (key === "j" ? 1 : -1)),
      );
      for (const row of table.querySelectorAll("tr.row"))
        row.classList.toggle(
          "focus",
          Number(row.dataset.id) === visible[focus].id,
        );
      table.querySelector("tr.focus")?.scrollIntoView({ block: "nearest" });
      return;
    }
    const m = visible[focus];
    if (!m) return;
    if (key === "Enter") toggleOpen(m.id);
    else if (key === "w") window.open(ctx.watchUrl(m), "_blank", "noopener");
    else location.hash = href(["match", m.id]);
  };
  addEventListener("keydown", onKey);
  return () => removeEventListener("keydown", onKey);
}

/** Statistics and positions of one match: used inline in the list and on the match page. */
export function matchPanel(ctx, m, { compact = false } = {}) {
  const { stats, statIndex, data } = ctx;
  const stat = (p, name) => p[statIndex[name]];
  const totals = (team, name) =>
    m.players
      .filter((p) => p[0] === team)
      .reduce((sum, p) => sum + stat(p, name), 0);
  const cars = m.players.map((p, i) => ({ p, i }));
  const head = element(
    "tr",
    {},
    element("th", { class: "text" }, `seed ${m.seed}`),
    cars.map(({ p, i }) =>
      element("th", { class: TEAM[p[0]] }, `car ${i + 1}`),
    ),
    element("th", { class: "blue sep" }, "blue"),
    element("th", { class: "orange" }, "orange"),
  );
  const rows = [];
  const slots = cars.length + 2;
  const present = new Set(stats);
  for (const [group, keys] of STAT_GROUPS) {
    const list = keys.filter((k) => present.has(k));
    if (!list.length) continue;
    rows.push(
      element(
        "tr",
        { class: "group" },
        element("td", { colspan: slots + 1 }, group),
      ),
    );
    for (const s of list) {
      const values = m.players.map((p) => stat(p, s));
      const top = Math.max(...values);
      rows.push(
        element(
          "tr",
          {},
          element("td", { class: "text" }, label(s)),
          values.map((v, i) =>
            element(
              "td",
              { class: v === top && top > 0 ? "best" : "" },
              smart(v),
            ),
          ),
          [0, 1].map((t) =>
            element(
              "td",
              { class: t === 0 ? "sep" : "" },
              fixed(totals(t, s), 0),
            ),
          ),
        ),
      );
    }
  }
  rows.push(
    element(
      "tr",
      { class: "group" },
      element("td", { colspan: slots + 1 }, "Team"),
    ),
  );
  for (const [i, name] of [
    "Possession s",
    "Ball in own half s",
    "Brain ms",
  ].entries())
    rows.push(
      element(
        "tr",
        {},
        element("td", { class: "text" }, name),
        cars.map(() => element("td", {}, "")),
        [0, 1].map((t) =>
          element(
            "td",
            { class: t === 0 ? "sep" : "" },
            fixed(m.teams[t][i], 0),
          ),
        ),
      ),
    );

  const heat = element("div", { class: "heat-row" });
  if (m.heat && data.heat) {
    fetch(`${ctx.base}arena/heatmaps/${m.id}.json`)
      .then((response) => (response.ok ? response.json() : null))
      .then((maps) => {
        if (!maps) return;
        const seconds = (map) => map.map((v) => v / 10);
        heat.replaceChildren(
          ...[0, 1].map((t) =>
            heatFigure(seconds(maps.teams[t]), data.heat, {
              title: `${m.brains[t]} (${TEAM[t]}) cars`,
              caption: "attacking up · seconds",
              scale: compact ? 8 : 10,
            }),
          ),
          heatFigure(seconds(maps.ball), data.heat, {
            title: "Ball",
            caption: `${m.brains[0]} attacking up · seconds`,
            scale: compact ? 8 : 10,
          }),
        );
      })
      .catch(() => {});
  }
  return element(
    "div",
    { class: "match-panel" },
    element(
      "div",
      { class: "match-stats" },
      scroll(
        element(
          "table",
          { class: "stats" },
          element("thead", {}, head),
          element("tbody", {}, rows),
        ),
      ),
    ),
    heat,
    compact
      ? element(
          "div",
          { class: "match-actions" },
          element(
            "a",
            { class: "button ghost small", href: href(["match", m.id]) },
            "Open match page",
          ),
          element(
            "button",
            {
              class: "button ghost small",
              onclick: () =>
                copy(
                  new URL(ctx.watchUrl(m), location.href).href,
                  "Watch link copied",
                ),
            },
            "Copy watch link",
          ),
        )
      : null,
  );
}

export function renderMatch(root, ctx, route) {
  const id = Number(route.parts[1]);
  const m = ctx.byId.get(id);
  root.dataset.title = `Match ${id}`;
  if (!m) {
    root.append(
      panel(
        "Match not found",
        empty(
          `There is no match ${route.parts[1] ?? ""} in the log.`,
          "It may belong to another format.",
        ),
        {},
      ),
      element(
        "a",
        { class: "button ghost", href: href(["matches"]) },
        "All matches",
      ),
    );
    return;
  }
  const ids = ctx.matches;
  const index = ids.indexOf(m);
  const near = (step) => ids[index + step];
  const winner = m.win < 0 ? "Draw" : `${m.brains[m.win]} won`;
  const link = (other, text) =>
    other
      ? element(
          "a",
          { class: "button ghost small", href: href(["match", other.id]) },
          text,
        )
      : element("span", { class: "button ghost small disabled" }, text);
  root.append(
    element(
      "div",
      { class: "crumbs" },
      element("a", { href: href(["matches"]) }, "Matches"),
      " / ",
      `Match ${m.id}`,
    ),
    element(
      "section",
      { class: "panel match-hero" },
      element(
        "div",
        { class: "scoreboard" },
        element(
          "a",
          { class: "side blue", href: href(["brain", m.brains[0]]) },
          m.brains[0],
        ),
        element(
          "div",
          { class: "final" },
          element("span", { class: m.win === 0 ? "win" : "" }, m.score[0]),
          element("span", { class: "dash" }, "–"),
          element("span", { class: m.win === 1 ? "win" : "" }, m.score[1]),
        ),
        element(
          "a",
          { class: "side orange", href: href(["brain", m.brains[1]]) },
          m.brains[1],
        ),
      ),
      element(
        "p",
        { class: "note center" },
        `${winner} · ${clock(m.live)} of live play${m.overtime ? " · overtime" : ""} · seed ${m.seed}${m.current ? "" : " · older brain version"}`,
      ),
      element(
        "div",
        { class: "hero-actions" },
        element(
          "a",
          {
            class: "button",
            href: ctx.watchUrl(m),
            target: "_blank",
            rel: "noopener",
          },
          "Watch in game",
        ),
        element(
          "button",
          {
            class: "button ghost",
            onclick: () =>
              copy(
                new URL(ctx.watchUrl(m), location.href).href,
                "Watch link copied",
              ),
          },
          "Copy watch link",
        ),
        element(
          "a",
          {
            class: "button ghost",
            href: href(["matches"], {
              brain: m.brains[0],
              vs: m.brains[1] === m.brains[0] ? "" : m.brains[1],
            }),
          },
          "More of this pairing",
        ),
        link(near(-1), "‹ Previous"),
        link(near(1), "Next ›"),
      ),
    ),
    panel("Statistics", matchPanel(ctx, m), {
      note: "Per car and per team. The top car in each row is highlighted. Possession counts the last touch.",
    }),
  );
}
