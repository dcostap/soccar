// Arena page: loads exported results once, then routes between views on the URL hash.
// Data comes from `npm run arena -- export`. Views live in the arena-*.js files.
import { ago, element, href } from "./arena-ui.js";
import { renderBoard } from "./arena-board.js";
import { renderBrain } from "./arena-brain.js";
import { renderCompare } from "./arena-compare.js";
import { renderMatches, renderMatch } from "./arena-matches.js";
import { renderSetPieces } from "./arena-setpieces.js";

const base = import.meta.env?.BASE_URL ?? "/";
const view = document.getElementById("view");
const summary = document.getElementById("summary");

async function loadJson(name, required) {
  try {
    const response = await fetch(`${base}arena/${name}`, { cache: "no-cache" });
    if (!response.ok) throw new Error(String(response.status));
    return await response.json();
  } catch (error) {
    if (required) throw error;
    return null;
  }
}

let data;
try {
  data = await loadJson("arena.json", true);
} catch {
  summary.textContent = "No data yet";
  view.replaceChildren(
    element(
      "div",
      { class: "empty big" },
      element("b", {}, "No arena data yet"),
      element("p", {}, "Play some matches, then reload this page:"),
      element("code", { class: "command" }, "npm run arena -- ladder"),
    ),
  );
  throw new Error("Missing arena data");
}

// Derived data -------------------------------------------------------------------
const stats = data.stats;
const statIndex = Object.fromEntries(stats.map((s, i) => [s, i + 1]));
const brains = new Map(data.brains.map((b) => [b.name, b]));
const rated = data.brains
  .filter((b) => b.games > 0)
  .sort((a, b) => b.elo - a.elo);
const rank = new Map(rated.map((b, i) => [b.name, i + 1]));
const matches = data.matches;
const byId = new Map();
for (const m of matches) {
  m.win = m.score[0] > m.score[1] ? 0 : m.score[1] > m.score[0] ? 1 : -1;
  m.total = m.score[0] + m.score[1];
  m.margin = Math.abs(m.score[0] - m.score[1]);
  byId.set(m.id, m);
}

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

/** Per-opponent records of one brain over current matches. */
function records(name) {
  const out = new Map();
  for (const m of matches) {
    if (!m.current) continue;
    const side = m.brains.indexOf(name);
    if (side < 0) continue;
    const other = m.brains[1 - side];
    const r = out.get(other) ?? {
      wins: 0,
      losses: 0,
      draws: 0,
      games: 0,
      gf: 0,
      ga: 0,
    };
    r.games++;
    if (m.win === side) r.wins++;
    else if (m.win < 0) r.draws++;
    else r.losses++;
    r.gf += m.score[side];
    r.ga += m.score[1 - side];
    out.set(other, r);
  }
  return out;
}

const route = () => {
  const raw = location.hash.replace(/^#\/?/, "");
  const [path, query = ""] = raw.split("?");
  return {
    parts: path.split("/").filter(Boolean).map(decodeURIComponent),
    query: new URLSearchParams(query),
  };
};

const ctx = {
  base,
  data,
  stats,
  statIndex,
  brains,
  rated,
  rank,
  matches,
  byId,
  watchUrl,
  records,
  setpieces: loadJson("setpieces.json", false).then((s) =>
    s?.scenarios?.length ? s : null,
  ),
  /** Rewrites the query of the current URL without re-rendering the view. */
  replaceQuery(query) {
    const { parts } = route();
    history.replaceState(null, "", href(parts, query));
  },
};

summary.textContent =
  `${data.format.size}v${data.format.size} · ${data.format.duration / 60} min · ` +
  `${data.brains.length} brains · ${matches.length.toLocaleString()} matches · updated ${ago(data.generated)}`;

// Router ----------------------------------------------------------------------------
const VIEWS = {
  "": ["leaderboard", renderBoard],
  brain: ["leaderboard", renderBrain],
  matches: ["matches", renderMatches],
  match: ["matches", renderMatch],
  compare: ["compare", renderCompare],
  setpieces: ["setpieces", renderSetPieces],
};
let cleanup = null;
let token = 0;
async function show() {
  const current = route();
  const [tab, render] = VIEWS[current.parts[0] ?? ""] ?? VIEWS[""];
  const mine = ++token;
  cleanup?.();
  cleanup = null;
  for (const link of document.querySelectorAll("#nav a"))
    link.setAttribute("aria-current", String(link.dataset.tab === tab));
  const root = element("div", { class: "view" });
  const result = await render(root, ctx, current);
  if (mine !== token) {
    result?.();
    return;
  }
  cleanup = result ?? null;
  view.replaceChildren(root);
  document.title = `${root.dataset.title ? `${root.dataset.title} · ` : ""}Soccar Arena`;
  if (!current.query.has("keep")) window.scrollTo(0, 0);
}
addEventListener("hashchange", show);

// "/" jumps to the view's search box.
addEventListener("keydown", (event) => {
  if (event.key !== "/" || event.metaKey || event.ctrlKey || event.altKey)
    return;
  if (event.target.closest?.("input, select, textarea")) return;
  const box = view.querySelector("input[type=search]");
  if (!box) return;
  event.preventDefault();
  box.focus();
  box.select();
});

await show();
