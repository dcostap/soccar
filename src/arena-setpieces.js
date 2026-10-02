// Set pieces view: a suite-by-brain summary and a filterable list of scenarios with start diagrams.
// Data comes from public/arena/setpieces.json, written by `npm run arena -- setpieces`.
import { describe, scenarioDiagram, setPieceUrl } from "./arena-scenarios.js";
import {
  command,
  copy,
  element,
  empty,
  field,
  href,
  panel,
  percent,
  scroll,
  search,
  select,
} from "./arena-ui.js";

const PAGE = 40;

export async function renderSetPieces(root, ctx, route) {
  root.dataset.title = "Set pieces";
  const data = await ctx.setpieces;
  if (!data) {
    root.append(
      panel(
        "Set pieces",
        empty(
          "No set piece results yet",
          "Short placed scenarios that grade one skill at a time. Generate results, then reload.",
        ),
        {},
      ),
      element(
        "p",
        { class: "empty-line" },
        command("npm run arena -- setpieces"),
      ),
    );
    return;
  }
  const { base } = ctx;
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
  const q = route.query;
  const state = {
    suite: q.get("suite") ?? "",
    kind: q.get("kind") ?? "",
    brain: q.get("brain") ?? "",
    filter: q.get("show") ?? "",
    sort: q.get("sort") ?? "id",
    q: q.get("q") ?? "",
    shown: PAGE,
    open: q.get("open"),
  };
  const save = () =>
    ctx.replaceQuery({
      suite: state.suite,
      kind: state.kind,
      brain: state.brain,
      show: state.filter,
      sort: state.sort === "id" ? "" : state.sort,
      q: state.q,
      open: state.open,
      keep: 1,
    });

  // Summary: suites as rows, brains as columns.
  const summary = element("table", { class: "sp-summary" });
  const rate = (indices, brain) => {
    const rs = indices.map((i) => result(brain, i)).filter(Boolean);
    return rs.length ? rs.filter((r) => r[0]).length / rs.length : null;
  };
  const tint = (p) =>
    p === null
      ? ""
      : `--tint:rgba(${p >= 0.5 ? "47,123,255" : "255,138,42"},${Math.min(0.38, Math.abs(p - 0.5) * 0.9)})`;
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
      element("th", { class: "text" }, "Suite"),
      element("th", {}, "n"),
      brains.map((b) =>
        element(
          "th",
          {
            class: `sortable${state.brain === b.name ? " sorted" : ""}`,
            title: `Focus on ${b.name}'s results`,
            tabindex: 0,
            onclick: () => {
              state.brain = state.brain === b.name ? "" : b.name;
              change();
            },
            onkeydown: (event) =>
              event.key === "Enter" && event.currentTarget.click(),
          },
          b.name,
        ),
      ),
    );
    const rows = groups.map((group) => {
      const active =
        (group.suite && state.suite === group.suite) ||
        (group.kind && state.kind === group.kind) ||
        (group.name === "all" && !state.suite && !state.kind);
      return element(
        "tr",
        {
          class: `row${group.suite === undefined ? " total" : ""}${active ? " selected" : ""}`,
          title: group.title ?? "",
          onclick: () => {
            state.suite = group.suite ?? "";
            state.kind = group.kind ?? "";
            change();
          },
        },
        element("td", { class: "text" }, element("b", {}, group.name)),
        element("td", { class: "muted" }, String(group.indices.length)),
        brains.map((b) => {
          const p = rate(group.indices, b);
          return element(
            "td",
            { class: "tinted", style: tint(p) },
            p === null ? "-" : percent(p),
          );
        }),
      );
    });
    const credit = element(
      "tr",
      { class: "total" },
      element(
        "td",
        {
          class: "text",
          title: "Mean credit: a miss earns up to 0.5 for how close it came",
        },
        "credit",
      ),
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
  const suiteSelect = select(
    [["", "All suites"], ...data.suites.map((s) => [s.name, s.name])],
    state.suite,
    (v) => {
      state.suite = v;
      change();
    },
  );
  const kindSelect = select(
    [
      ["", "Attack and defend"],
      ["attack", "Attack"],
      ["defend", "Defend"],
    ],
    state.kind,
    (v) => {
      state.kind = v;
      change();
    },
  );
  const brainSelect = select(
    [["", "Any brain"], ...brains.map((b) => [b.name, b.name])],
    state.brain,
    (v) => {
      state.brain = v;
      change();
    },
  );
  const filterSelect = select(
    [
      ["", "All scenarios"],
      ["fail", "Failed"],
      ["pass", "Passed"],
      ["unique-fail", "Failed, while another brain passed"],
      ["unique-pass", "Passed, while another brain failed"],
    ],
    state.filter,
    (v) => {
      state.filter = v;
      change();
    },
  );
  const sortSelect = select(
    [
      ["id", "Name"],
      ["easy", "Easiest first"],
      ["hard", "Hardest first"],
    ],
    state.sort,
    (v) => {
      state.sort = v;
      change();
    },
  );
  const controls = element(
    "div",
    { class: "toolbar" },
    field("Suite", suiteSelect),
    field("Kind", kindSelect),
    field("Brain", brainSelect),
    field("Show", filterSelect),
    field("Sort", sortSelect),
    search(state.q, "Search scenarios  ( / )", (v) => {
      state.q = v;
      change();
    }),
    element(
      "button",
      {
        class: "button ghost small",
        onclick: () => location.assign(href(["setpieces"])),
      },
      "Clear",
    ),
  );
  const count = element("p", { class: "summary-line" });
  const list = element("table", { class: "sp-list" });
  const listViewport = scroll(list);
  listViewport.classList.add("sp-list-scroll");
  let pan;
  listViewport.addEventListener("pointerdown", (event) => {
    if (
      event.button !== 1 ||
      event.target.closest("a") ||
      listViewport.scrollWidth <= listViewport.clientWidth
    )
      return;
    event.preventDefault();
    pan = {
      pointerId: event.pointerId,
      x: event.clientX,
      scrollLeft: listViewport.scrollLeft,
    };
    listViewport.setPointerCapture(event.pointerId);
    listViewport.classList.add("panning");
  });
  listViewport.addEventListener("pointermove", (event) => {
    if (pan?.pointerId !== event.pointerId) return;
    listViewport.scrollLeft = pan.scrollLeft - (event.clientX - pan.x);
  });
  const stopPanning = (event) => {
    if (pan?.pointerId !== event.pointerId) return;
    pan = null;
    listViewport.classList.remove("panning");
  };
  for (const type of ["pointerup", "pointercancel", "lostpointercapture"])
    listViewport.addEventListener(type, stopPanning);
  const more = element(
    "button",
    {
      class: "button ghost more",
      onclick: () => {
        state.shown += PAGE;
        renderList();
      },
    },
    "Show more",
  );

  function selected() {
    const needle = state.q.trim().toLowerCase();
    let indices = scenarios
      .map((_, i) => i)
      .filter(
        (i) =>
          (!state.suite || scenarios[i].suite === state.suite) &&
          (!state.kind || scenarios[i].kind === state.kind) &&
          (!needle ||
            `${scenarios[i].id} ${scenarios[i].note} ${scenarios[i].rival ?? ""}`
              .toLowerCase()
              .includes(needle)),
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
    if (!r) return element("td", {}, "-");
    return element(
      "td",
      { class: `res${state.brain === brain.name ? " chosen" : ""}` },
      element(
        "a",
        {
          class: `chip ${r[0] ? "pass" : "fail"}`,
          href: setPieceUrl(base, s, brain, r),
          target: "_blank",
          rel: "noopener",
          title: `${r[4]} touches. Watch ${brain.name} play ${s.id}`,
        },
        describe(r, s.kind),
      ),
    );
  }

  function renderList() {
    const indices = selected();
    count.replaceChildren(
      ...[
        element("b", {}, `${indices.length} of ${scenarios.length} scenarios`),
        state.filter && !state.brain
          ? element(
              "span",
              { class: "stale" },
              " Choose a brain to filter by result.",
            )
          : null,
      ].filter(Boolean),
    );
    const head = element(
      "tr",
      {},
      element("th", {}, ""),
      element("th", { class: "text" }, "Scenario"),
      element("th", {}, "Time"),
      element("th", { title: "A car that does nothing" }, "Idle"),
      brains.map((b) =>
        element(
          "th",
          { class: state.brain === b.name ? "sorted" : "" },
          b.name,
        ),
      ),
    );
    const rows = [];
    for (const i of indices.slice(0, state.shown)) {
      const s = scenarios[i];
      rows.push(
        element(
          "tr",
          {
            class: `row${state.open === s.id ? " open" : ""}`,
            onclick: (event) => {
              if (event.target.closest("a")) return;
              state.open = state.open === s.id ? null : s.id;
              save();
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
          element("td", { class: "muted" }, `${s.time} s`),
          element(
            "td",
            { class: "res" },
            element(
              "span",
              { class: `chip idle ${s.idle[0] ? "pass" : "fail"}` },
              describe(s.idle, s.kind),
            ),
          ),
          brains.map((b) => cell(s, i, b)),
        ),
      );
      if (state.open === s.id)
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
                    `Failed by ${Math.round(difficulty[i] * 100)}% of brains. A result opens the replay in the game.`,
                  ),
                  element(
                    "button",
                    {
                      class: "button ghost small",
                      onclick: () => copy(s.text, "Scenario copied"),
                    },
                    "Copy scenario",
                  ),
                ),
              ),
            ),
          ),
        );
    }
    if (!indices.length)
      rows.push(
        element(
          "tr",
          {},
          element(
            "td",
            { colspan: 4 + brains.length },
            empty("No scenarios fit these filters"),
          ),
        ),
      );
    list.replaceChildren(
      element("thead", {}, head),
      element("tbody", {}, rows),
    );
    more.hidden = indices.length <= state.shown;
  }

  function change() {
    state.shown = PAGE;
    suiteSelect.value = state.suite;
    kindSelect.value = state.kind;
    brainSelect.value = state.brain;
    save();
    renderSummary();
    renderList();
  }

  root.append(
    panel("Set pieces", scroll(summary), {
      note: "Short placed scenarios that grade one skill at a time. The brain drives blue, which attacks up. An attack passes on a blue goal, a defense passes if blue does not concede. Idle is a car that does nothing: a scenario it passes plays itself. Click a suite row to list it, a brain header to focus on it.",
    }),
    panel(
      "Scenarios",
      element("div", {}, controls, count, listViewport, more),
      {
        note: "Click a scenario for its start and text, or a result to watch it in the game. Hold the middle mouse button and drag left or right to scroll.",
      },
    ),
  );
  renderSummary();
  renderList();
}
