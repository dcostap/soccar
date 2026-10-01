// Brain page: rating, strengths against the field, records against each rival, set pieces, positions.
import { heatFigure } from "./arena-heat.js";
import {
  STAT_GROUPS,
  clock,
  command,
  copy,
  element,
  empty,
  expected,
  fixed,
  href,
  label,
  meter,
  panel,
  percent,
  scroll,
  select,
  signed,
} from "./arena-ui.js";

/** Share of set pieces passed per suite for one brain: Map suite → {passed, played}. */
export function suiteRates(sp, name) {
  const out = new Map();
  if (!sp?.results[name]) return out;
  sp.scenarios.forEach((s, i) => {
    const r = sp.results[name][i];
    if (!r) return;
    const cell = out.get(s.suite) ?? { passed: 0, played: 0 };
    cell.played++;
    if (r[0]) cell.passed++;
    out.set(s.suite, cell);
  });
  return out;
}

/** Mean of a stat over rated brains, for comparing one brain with the field. */
const fieldMean = (ctx, key) => {
  const values = ctx.rated.map((b) => b.averages[key]).filter(Number.isFinite);
  return values.reduce((a, b) => a + b, 0) / Math.max(1, values.length);
};

const shown = (key, v) =>
  key === "possession"
    ? fixed(100 * v, 1)
    : key === "boostUsed" || key === "distance"
      ? fixed(v, 0)
      : fixed(v, 2);

export async function renderBrain(root, ctx, route) {
  const name = route.parts[1];
  const b = ctx.brains.get(name);
  root.dataset.title = name ?? "Brain";
  if (!b) {
    root.append(
      panel(
        "Brain not found",
        empty(
          `There is no brain called "${name ?? ""}".`,
          "Pick one from the leaderboard.",
        ),
        {},
      ),
      element("a", { class: "button ghost", href: href([""]) }, "Leaderboard"),
    );
    return;
  }
  const rank = ctx.rank.get(b.name);
  const rated = b.games > 0;
  const mine = ctx.matches.filter((m) => m.brains.includes(b.name));
  const latest = [...mine].reverse().find((m) => m.current);
  const rivals = ctx.records(b.name);
  const sp = await ctx.setpieces;

  // Header -------------------------------------------------------------------------
  const others = ctx.rated.filter((x) => x !== b);
  root.append(
    element(
      "div",
      { class: "crumbs" },
      element("a", { href: href([""]) }, "Leaderboard"),
      " / ",
      b.name,
    ),
    element(
      "section",
      { class: "panel brain-hero" },
      element(
        "div",
        { class: "brain-title" },
        element(
          "span",
          { class: "rank-badge" },
          rated ? `#${rank}` : "unrated",
        ),
        element("h1", {}, b.name),
        element("p", { class: "note" }, b.description),
      ),
      element(
        "div",
        { class: "hero-actions" },
        latest
          ? element(
              "a",
              {
                class: "button",
                href: ctx.watchUrl(latest),
                target: "_blank",
                rel: "noopener",
              },
              "Watch latest match",
            )
          : null,
        element(
          "a",
          { class: "button ghost", href: href(["matches"], { brain: b.name }) },
          "All matches",
        ),
        others.length
          ? select(
              [["", "Compare with…"], ...others.map((x) => [x.name, x.name])],
              "",
              (v) => v && (location.hash = href(["compare", b.name, v])),
              { class: "compact", "aria-label": "Compare with" },
            )
          : null,
      ),
    ),
  );

  if (rated) {
    const wins = b.wins;
    const cards = element("div", { class: "cards" });
    const add = (title, value, detail, accent = "") =>
      cards.append(
        element(
          "div",
          { class: `card ${accent}` },
          element("span", { class: "card-title" }, title),
          element("b", { class: "card-value" }, value),
          element("span", { class: "card-detail" }, detail),
        ),
      );
    add(
      "Elo",
      fixed(b.elo, 0),
      `± ${fixed(1.96 * b.error, 0)} (95%). Rank ${rank} of ${ctx.rated.length}.`,
      "blue",
    );
    add(
      "Win rate",
      percent(wins / b.games, 1),
      `${wins.toLocaleString()} of ${b.games.toLocaleString()} rated matches`,
    );
    add(
      "Goals",
      `${fixed(b.goalsFor, 2)} – ${fixed(b.goalsAgainst, 2)}`,
      `per match, ${signed(b.goalsFor - b.goalsAgainst, 2)} difference`,
    );
    add(
      "Set pieces",
      b.setPieces?.played
        ? percent(b.setPieces.passed / b.setPieces.played, 1)
        : "-",
      b.setPieces?.played
        ? `${b.setPieces.passed} of ${b.setPieces.played} passed, credit ${fixed(b.setPieces.credit, 3)}`
        : "Not played yet",
      "orange",
    );
    add("Brain time", `${fixed(b.brainMs, 0)} ms`, "wall clock per match");
    root.append(cards);
  }

  // Settings --------------------------------------------------------------------------
  root.append(
    panel(
      "Settings",
      element(
        "div",
        { class: "settings" },
        element("pre", {}, b.text.trim()),
        element(
          "ul",
          { class: "facts" },
          element("li", {}, "module ", element("b", {}, b.module)),
          element("li", {}, "fingerprint ", element("b", {}, b.fingerprint)),
          element("li", {}, `file arena/brains/${b.name}.brain`),
          element(
            "li",
            {},
            "play against it: choose ",
            element("b", {}, b.name),
            " under Bot Difficulty",
          ),
        ),
      ),
      {
        actions: element(
          "button",
          {
            class: "button ghost small",
            onclick: () => copy(b.text, "Settings copied"),
          },
          "Copy settings",
        ),
        note: "Editing a brain changes its fingerprint and retires its results.",
      },
    ),
  );

  if (!rated) {
    root.append(
      panel(
        "No results yet",
        element(
          "p",
          { class: "empty-line" },
          "Play it against the others: ",
          command(`npm run arena -- challenge ${b.name}`),
        ),
      ),
    );
    return;
  }

  // Profile ---------------------------------------------------------------------------
  const profile = element("table", { class: "profile" });
  const body = [];
  for (const [group, keys] of [
    ["Scoring", ["shots", "saves", "assists"]],
    ...STAT_GROUPS.slice(1),
  ]) {
    const list = keys.filter((k) => Number.isFinite(b.averages[k]));
    if (group === "Position") list.push("possession");
    if (!list.length) continue;
    body.push(
      element("tr", { class: "group" }, element("td", { colspan: 5 }, group)),
    );
    for (const key of list) {
      const mean = fieldMean(ctx, key);
      const v = b.averages[key];
      const delta = mean ? v / mean - 1 : 0;
      const ranked = [...ctx.rated].sort(
        (x, y) => y.averages[key] - x.averages[key],
      );
      const clipped = Math.max(-0.6, Math.min(0.6, delta)) / 0.6;
      body.push(
        element(
          "tr",
          {},
          element("td", { class: "text" }, label(key)),
          element("td", {}, shown(key, v)),
          element("td", { class: "muted" }, shown(key, mean)),
          element(
            "td",
            { class: "diverge-cell" },
            element(
              "span",
              {
                class: "diverge",
                title: `${signed(100 * delta)}% against the field average`,
              },
              element("i", {
                class: delta >= 0 ? "up" : "down",
                style: `${delta >= 0 ? "left:50%" : `right:50%`};width:${Math.abs(clipped) * 50}%`,
              }),
            ),
          ),
          element(
            "td",
            { class: "muted" },
            `${signed(100 * delta)}% · #${ranked.indexOf(b) + 1}`,
          ),
        ),
      );
    }
  }
  profile.replaceChildren(
    element(
      "thead",
      {},
      element(
        "tr",
        {},
        element("th", { class: "text" }, "per match, team total"),
        element("th", {}, b.name),
        element("th", {}, "field"),
        element("th", { class: "diverge-head" }, "less ← → more"),
        element("th", {}, "vs field · rank"),
      ),
    ),
    element("tbody", {}, body),
  );

  // Rivals ----------------------------------------------------------------------------------
  const rivalRows = [...rivals.entries()]
    .map(([rival, r]) => ({ rival, r, brain: ctx.brains.get(rival) }))
    .sort((x, y) => (y.brain?.elo ?? 0) - (x.brain?.elo ?? 0));
  const rivalTable = element(
    "table",
    { class: "rivals" },
    element(
      "thead",
      {},
      element(
        "tr",
        {},
        element("th", { class: "text" }, "Against"),
        element("th", {}, "Matches"),
        element("th", {}, "W–L–D"),
        element("th", { class: "text" }, "Win rate"),
        element("th", { title: "Rating-based expectation" }, "Expected"),
        element("th", {}, "Goals"),
        element("th", {}, ""),
      ),
    ),
    element(
      "tbody",
      {},
      rivalRows.map(({ rival, r, brain }) => {
        const p = r.wins / r.games;
        const exp = brain ? expected(b.elo - brain.elo) : NaN;
        return element(
          "tr",
          {
            class: "row",
            onclick: (event) =>
              !event.target.closest("a") &&
              (location.hash = href(["matches"], { brain: b.name, vs: rival })),
          },
          element(
            "td",
            { class: "text" },
            element(
              "a",
              { class: "brain-link", href: href(["brain", rival]) },
              rival,
            ),
          ),
          element("td", {}, r.games.toLocaleString()),
          element("td", {}, `${r.wins}–${r.losses}–${r.draws}`),
          element(
            "td",
            { class: "text" },
            meter(p, p >= 0.5 ? "blue" : "orange"),
            " ",
            percent(p, 1),
          ),
          element("td", { class: "muted" }, percent(exp)),
          element(
            "td",
            { class: "muted" },
            `${fixed(r.gf / r.games, 2)}–${fixed(r.ga / r.games, 2)}`,
          ),
          element(
            "td",
            {},
            element(
              "a",
              {
                class: "button ghost small",
                href: href(["compare", b.name, rival]),
              },
              "Compare",
            ),
          ),
        );
      }),
    ),
  );

  root.append(
    panel("Against the field", scroll(profile), {
      note: "Team totals per match compared with the average of all rated brains. The bar shows how far above or below the field. It describes style, not strength.",
    }),
    rivalRows.length
      ? panel("Records", scroll(rivalTable), {
          note: "Current-version matches only. Expected is what the Elo gap predicts. Click a row to list the matches.",
        })
      : null,
  );

  // Set pieces ---------------------------------------------------------------------------------------
  const rates = suiteRates(sp, b.name);
  if (sp && rates.size) {
    const best = (suite) =>
      Math.max(
        ...sp.brains
          .map((x) => suiteRates(sp, x.name).get(suite))
          .filter(Boolean)
          .map((c) => c.passed / c.played),
      );
    root.append(
      panel(
        "Set pieces",
        scroll(
          element(
            "table",
            { class: "rivals" },
            element(
              "thead",
              {},
              element(
                "tr",
                {},
                element("th", { class: "text" }, "Suite"),
                element("th", {}, "Passed"),
                element("th", { class: "text" }, "Rate"),
                element("th", {}, "Best brain"),
              ),
            ),
            element(
              "tbody",
              {},
              sp.suites
                .filter((s) => rates.has(s.name))
                .map((s) => {
                  const c = rates.get(s.name);
                  const p = c.passed / c.played;
                  return element(
                    "tr",
                    {
                      class: "row",
                      title: s.description,
                      onclick: () =>
                        (location.hash = href(["setpieces"], {
                          suite: s.name,
                          brain: b.name,
                        })),
                    },
                    element("td", { class: "text" }, s.name),
                    element(
                      "td",
                      { class: "muted" },
                      `${c.passed} / ${c.played}`,
                    ),
                    element(
                      "td",
                      { class: "text" },
                      meter(p, p >= 0.5 ? "blue" : "orange"),
                      " ",
                      percent(p),
                    ),
                    element("td", { class: "muted" }, percent(best(s.name))),
                  );
                }),
            ),
          ),
        ),
        {
          note: "Click a suite to see its scenarios with this brain's results.",
        },
      ),
    );
  }

  // Positions --------------------------------------------------------------------------------------------
  const grid = ctx.data.heat;
  if (grid && b.heat?.matches > 0) {
    root.append(
      panel(
        "Positions",
        element(
          "div",
          { class: "heat-row" },
          heatFigure(b.heat.car, grid, {
            title: "One car",
            caption: `${b.heat.matches} matches · attacking up`,
            scale: 10,
          }),
          heatFigure(b.heat.ball, grid, {
            title: "Ball",
            caption: "seconds per match",
            scale: 10,
          }),
        ),
        {
          note: "Where its cars and the ball spend live play. Brighter is more time. The bar splits time into defensive, middle, and attacking thirds.",
        },
      ),
    );
  }

  // Matches -------------------------------------------------------------------------------------------------
  const recent = [...mine].reverse().slice(0, 8);
  const decided = mine.filter((m) => m.current && m.win >= 0);
  const side = (m) => (m.brains[0] === b.name ? 0 : 1);
  const pick = (list, score) =>
    list.reduce((best, m) => (score(m) > score(best) ? m : best), list[0]);
  const wonMatches = decided.filter((m) => m.win === side(m));
  const lostMatches = decided.filter((m) => m.win !== side(m));
  const upsetOf = (m) => {
    const rival = ctx.brains.get(m.brains[1 - side(m)]);
    return rival ? rival.elo - b.elo : 0;
  };
  const highlights = [];
  if (wonMatches.length) {
    highlights.push(["Biggest win", pick(wonMatches, (m) => m.margin)]);
    highlights.push(["Best upset", pick(wonMatches, upsetOf)]);
  }
  if (lostMatches.length)
    highlights.push(["Worst loss", pick(lostMatches, (m) => m.margin)]);
  if (decided.length)
    highlights.push(["Highest scoring", pick(decided, (m) => m.total)]);
  const matchLine = (m) =>
    element(
      "li",
      {},
      element("a", { href: href(["match", m.id]) }, `#${m.id}`),
      element(
        "span",
        { class: `blue${m.win === 0 ? " win" : ""}` },
        m.brains[0],
      ),
      element("b", {}, ` ${m.score[0]}–${m.score[1]} `),
      element(
        "span",
        { class: `orange${m.win === 1 ? " win" : ""}` },
        m.brains[1],
      ),
      element(
        "span",
        { class: "muted" },
        ` ${clock(m.live)}${m.overtime ? " OT" : ""}`,
      ),
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
    );
  if (mine.length)
    root.append(
      panel(
        "Matches",
        element(
          "div",
          { class: "two" },
          element(
            "div",
            {},
            element("h3", {}, "Latest"),
            element("ul", { class: "match-list" }, recent.map(matchLine)),
            element(
              "a",
              {
                class: "more-link",
                href: href(["matches"], { brain: b.name }),
              },
              `All ${mine.length.toLocaleString()} matches →`,
            ),
          ),
          highlights.length
            ? element(
                "div",
                {},
                element("h3", {}, "Highlights"),
                element(
                  "ul",
                  { class: "match-list highlights" },
                  highlights.map(([title, m]) => [
                    element("li", { class: "title" }, title),
                    matchLine(m),
                  ]),
                ),
              )
            : null,
        ),
      ),
    );
}
