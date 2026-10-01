// Compare view: two brains side by side. Rating, direct record, statistics, set pieces, and positions.
import { difference, heatFigure } from "./arena-heat.js";
import { suiteRates } from "./arena-brain.js";
import {
  STAT_GROUPS,
  element,
  empty,
  expected,
  field,
  fixed,
  href,
  label,
  panel,
  percent,
  scroll,
  segmented,
  select,
  signed,
} from "./arena-ui.js";

const shown = (key, v) =>
  key === "possession"
    ? fixed(100 * v, 1)
    : key === "boostUsed" || key === "distance"
      ? fixed(v, 0)
      : fixed(v, 2);

export async function renderCompare(root, ctx, route) {
  root.dataset.title = "Compare";
  const names = ctx.data.brains.map((b) => b.name);
  const [defaultA, defaultB] = ctx.rated.map((b) => b.name);
  const a0 = ctx.brains.has(route.parts[1]) ? route.parts[1] : defaultA;
  const b0 = ctx.brains.has(route.parts[2])
    ? route.parts[2]
    : defaultB === a0
      ? defaultA
      : defaultB;
  const state = {
    a: a0,
    b: b0,
    view: route.query.get("view") === "ball" ? "ball" : "car",
  };
  const sp = await ctx.setpieces;
  const body = element("div", { class: "compare-body" });

  const go = (a, b) => (location.hash = href(["compare", a, b]));
  const picker = element(
    "div",
    { class: "toolbar picker" },
    field(
      "Brain",
      select(names, state.a, (v) => go(v, state.b), { class: "blue-select" }),
    ),
    element(
      "button",
      {
        class: "button ghost small",
        title: "Swap",
        onclick: () => go(state.b, state.a),
      },
      "⇄ Swap",
    ),
    field(
      "Against",
      select(names, state.b, (v) => go(state.a, v), { class: "orange-select" }),
    ),
  );
  root.append(
    panel("Compare", element("div", {}, picker, body), {
      note: "Two brains side by side. Colors mark which brain has more of something, not which is better.",
    }),
  );
  if (!ctx.brains.has(state.a) || !ctx.brains.has(state.b)) {
    body.append(
      empty("Nothing to compare yet", "Rate at least two brains first."),
    );
    return;
  }
  if (state.a === state.b) {
    body.append(empty("Pick two different brains"));
    return;
  }
  const A = ctx.brains.get(state.a);
  const B = ctx.brains.get(state.b);
  const rated = A.games > 0 && B.games > 0;

  // Verdict ------------------------------------------------------------------------------
  const direct = ctx.records(A.name).get(B.name);
  const verdict = element("div", { class: "versus" });
  const side = (brain, cls, extra) =>
    element(
      "div",
      { class: `vs-side ${cls}` },
      element(
        "a",
        { class: "vs-name", href: href(["brain", brain.name]) },
        brain.name,
      ),
      element(
        "span",
        { class: "vs-elo" },
        brain.games ? `${fixed(brain.elo, 0)} Elo` : "unrated",
      ),
      extra,
    );
  const middle = element("div", { class: "vs-middle" });
  if (direct) {
    const share = direct.wins / (direct.wins + direct.losses || 1);
    middle.append(
      element(
        "div",
        { class: "vs-score" },
        element("b", { class: "blue" }, direct.wins),
        element("span", {}, " – "),
        element("b", { class: "orange" }, direct.losses),
        direct.draws ? element("small", {}, ` (${direct.draws} drawn)`) : null,
      ),
      element(
        "div",
        { class: "split", title: `${percent(share, 1)} for ${A.name}` },
        element("i", { style: `width:${100 * share}%` }),
      ),
      element(
        "a",
        {
          class: "more-link",
          href: href(["matches"], { brain: A.name, vs: B.name }),
        },
        `${direct.games.toLocaleString()} direct matches · goals ${fixed(direct.gf / direct.games, 2)}–${fixed(direct.ga / direct.games, 2)} →`,
      ),
    );
  } else
    middle.append(element("div", { class: "muted" }, "No direct matches yet"));
  if (rated) {
    const e = expected(A.elo - B.elo);
    middle.append(
      element(
        "div",
        { class: "muted" },
        `Elo expects ${e >= 0.5 ? A.name : B.name} to win ${percent(Math.max(e, 1 - e))} (${signed(A.elo - B.elo)} Elo)`,
      ),
    );
  }
  verdict.append(side(A, "blue"), middle, side(B, "orange"));
  body.append(verdict);

  // Statistics --------------------------------------------------------------------------------
  if (rated) {
    const rows = [];
    const stat = (key, text, va, vb, digits) => {
      const top = Math.max(Math.abs(va), Math.abs(vb)) || 1;
      rows.push(
        element(
          "tr",
          {},
          element(
            "td",
            { class: `num${va > vb ? " more blue" : ""}` },
            digits(va),
          ),
          element(
            "td",
            { class: "duel" },
            element(
              "span",
              { class: "duel-bar" },
              element("i", {
                class: "blue",
                style: `width:${(50 * Math.max(0, va)) / top}%`,
              }),
              element("i", {
                class: "orange",
                style: `width:${(50 * Math.max(0, vb)) / top}%`,
              }),
            ),
            element("span", { class: "duel-label" }, text),
          ),
          element(
            "td",
            { class: `num${vb > va ? " more orange" : ""}` },
            digits(vb),
          ),
        ),
      );
    };
    const header = (text) =>
      rows.push(
        element("tr", { class: "group" }, element("td", { colspan: 3 }, text)),
      );
    header("Results");
    stat("win", "Win rate", A.wins / A.games, B.wins / B.games, (v) =>
      percent(v, 1),
    );
    stat("gf", "Goals for", A.goalsFor, B.goalsFor, (v) => fixed(v, 2));
    stat("ga", "Goals against", A.goalsAgainst, B.goalsAgainst, (v) =>
      fixed(v, 2),
    );
    if (A.setPieces?.played && B.setPieces?.played)
      stat(
        "sp",
        "Set pieces passed",
        A.setPieces.passed / A.setPieces.played,
        B.setPieces.passed / B.setPieces.played,
        (v) => percent(v, 1),
      );
    stat("ms", "Brain ms", A.brainMs, B.brainMs, (v) => fixed(v, 0));
    for (const [group, keys] of [
      ["Scoring", ["shots", "saves", "assists"]],
      ...STAT_GROUPS.slice(1),
    ]) {
      const list = keys.filter(
        (k) => Number.isFinite(A.averages[k]) && Number.isFinite(B.averages[k]),
      );
      if (group === "Position") list.push("possession");
      if (!list.length) continue;
      header(group);
      for (const key of list)
        stat(key, label(key), A.averages[key], B.averages[key], (v) =>
          shown(key, v),
        );
    }
    body.append(
      element("h3", {}, "Statistics"),
      scroll(
        element("table", { class: "duel-table" }, element("tbody", {}, rows)),
      ),
    );
  }

  // Set pieces -------------------------------------------------------------------------------------
  const ra = suiteRates(sp, A.name);
  const rb = suiteRates(sp, B.name);
  if (sp && ra.size && rb.size) {
    const rows = sp.suites
      .filter((s) => ra.has(s.name) && rb.has(s.name))
      .map((s) => {
        const [x, y] = [ra.get(s.name), rb.get(s.name)];
        const [pa, pb] = [x.passed / x.played, y.passed / y.played];
        return element(
          "tr",
          { title: s.description },
          element(
            "td",
            { class: `num${pa > pb ? " more blue" : ""}` },
            percent(pa),
          ),
          element(
            "td",
            { class: "duel" },
            element(
              "span",
              { class: "duel-bar" },
              element("i", { class: "blue", style: `width:${50 * pa}%` }),
              element("i", { class: "orange", style: `width:${50 * pb}%` }),
            ),
            element(
              "a",
              {
                class: "duel-label",
                href: href(["setpieces"], { suite: s.name }),
              },
              `${s.name} (${x.played})`,
            ),
          ),
          element(
            "td",
            { class: `num${pb > pa ? " more orange" : ""}` },
            percent(pb),
          ),
        );
      });
    body.append(
      element("h3", {}, "Set pieces"),
      scroll(
        element("table", { class: "duel-table" }, element("tbody", {}, rows)),
      ),
    );
  }

  // Positions ---------------------------------------------------------------------------------------
  const grid = ctx.data.heat;
  const hasHeat = (b) => grid && b.heat?.matches > 0;
  if (hasHeat(A) || hasHeat(B)) {
    const maps = element("div", { class: "heat-row" });
    const paint = () => {
      const view = state.view;
      const shared = Math.max(
        1e-9,
        ...[A, B].filter(hasHeat).flatMap((x) => x.heat[view]),
      );
      const figures = [A, B].map((brain) =>
        hasHeat(brain)
          ? heatFigure(brain.heat[view], grid, {
              title: brain.name,
              caption: `${brain.heat.matches} matches · seconds per match`,
              max: shared,
            })
          : element(
              "p",
              { class: "note" },
              `${brain.name}: no heatmaps yet. Run npm run arena -- backfill.`,
            ),
      );
      if (hasHeat(A) && hasHeat(B))
        figures.push(
          heatFigure(difference(A.heat[view], B.heat[view]), grid, {
            title: `${A.name} − ${B.name}`,
            caption: "share of time · blue: first brain more, orange: second",
            diff: true,
          }),
        );
      maps.replaceChildren(...figures);
    };
    body.append(
      element(
        "div",
        { class: "section-head" },
        element("h3", {}, "Positions"),
        segmented(
          [
            ["car", "One car"],
            ["ball", "Ball"],
          ],
          state.view,
          (v) => {
            state.view = v;
            ctx.replaceQuery({ view: v === "car" ? "" : v, keep: 1 });
            paint();
          },
        ),
      ),
      element(
        "p",
        { class: "note" },
        "Both brains share one color scale. The bar under each map splits time into defensive, middle, and attacking thirds.",
      ),
      maps,
    );
    paint();
  }
}
