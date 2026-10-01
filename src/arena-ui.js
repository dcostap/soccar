// Small DOM and formatting helpers shared by the arena page views.

export const TEAM = ["blue", "orange"];

export const LABELS = {
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
export const label = (stat) => LABELS[stat] ?? stat;

/** Stats in reading order, for match and brain detail tables. */
export const STAT_GROUPS = [
  ["Scoring", ["score", "goals", "assists", "shots", "saves"]],
  ["Contact", ["touches", "demos", "demoed", "bumps"]],
  ["Movement", ["jumps", "flips", "distance", "supersonic", "airborne"]],
  ["Boost", ["bigPads", "smallPads", "boostUsed"]],
  ["Position", ["offense", "ballDistance"]],
];

export const fixed = (x, digits = 1) =>
  Number.isFinite(x) ? x.toFixed(digits) : "-";
export const percent = (x, digits = 0) =>
  Number.isFinite(x) ? `${(100 * x).toFixed(digits)}%` : "-";
export const count = (x) => (Number.isFinite(x) ? x.toLocaleString() : "-");
export const signed = (x, digits = 0) =>
  Number.isFinite(x)
    ? `${x > 0 ? "+" : x < 0 ? "−" : ""}${Math.abs(x).toFixed(digits)}`
    : "-";
export const clock = (seconds) =>
  `${Math.floor(seconds / 60)}:${String(Math.round(seconds % 60)).padStart(2, "0")}`;
/** A number with no useless decimals: integers stay whole. */
export const smart = (x) => fixed(x, Number.isInteger(x) ? 0 : 1);
/** Chance that a brain rated `diff` Elo above another wins a match. */
export const expected = (diff) => 1 / (1 + 10 ** (-diff / 400));

export function ago(seconds) {
  const minutes = Math.max(0, Math.round((Date.now() / 1000 - seconds) / 60));
  if (minutes < 1) return "just now";
  if (minutes < 90) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 48) return `${hours} h ago`;
  return `${Math.round(hours / 24)} days ago`;
}

export const element = (tag, attributes = {}, ...children) => {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attributes ?? {})) {
    if (v == null || v === false) continue;
    if (k === "class") node.className = v;
    else if (k.startsWith("on")) node.addEventListener(k.slice(2), v);
    else node.setAttribute(k, v === true ? "" : v);
  }
  node.append(
    ...children.flat(Infinity).filter((c) => c != null && c !== false),
  );
  return node;
};

/** Hash URL for a view. `parts` is a path array or string; empty query values are dropped. */
export function href(parts, query = {}) {
  const path = [parts].flat().map(encodeURIComponent).join("/");
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(query))
    if (v !== "" && v != null && v !== false) q.set(k, String(v));
  const text = q.toString();
  return `#/${path}${text ? `?${text}` : ""}`;
}

export function select(options, value, onChange, attributes = {}) {
  const option = (o) => {
    const [v, t] = Array.isArray(o) ? o : [o, o];
    return element("option", { value: v }, t);
  };
  const node = element(
    "select",
    attributes,
    options.map((o) =>
      o.group
        ? element("optgroup", { label: o.group }, o.options.map(option))
        : option(o),
    ),
  );
  node.value = value;
  node.addEventListener("change", () => onChange(node.value));
  return node;
}

export const field = (text, node) =>
  element("label", { class: "field" }, element("span", {}, text), node);

export function toggle(text, checked, onChange) {
  const input = element("input", { type: "checkbox" });
  input.checked = checked;
  input.addEventListener("change", () => onChange(input.checked));
  return element("label", { class: "check" }, input, element("span", {}, text));
}

/** A row of mutually exclusive buttons. */
export function segmented(options, value, onChange) {
  const root = element("div", { class: "segmented", role: "group" });
  const paint = (current) =>
    root.replaceChildren(
      ...options.map(([v, text]) =>
        element(
          "button",
          {
            type: "button",
            "aria-pressed": String(v === current),
            onclick: () => {
              paint(v);
              onChange(v);
            },
          },
          text,
        ),
      ),
    );
  paint(value);
  return root;
}

export function search(value, placeholder, onInput) {
  const input = element("input", {
    type: "search",
    placeholder,
    value,
    "aria-label": placeholder,
  });
  input.addEventListener("input", () => onInput(input.value));
  return input;
}

export const panel = (title, body, { note, actions, id } = {}) =>
  element(
    "section",
    { class: "panel", id },
    element(
      "div",
      { class: "panel-head" },
      element(
        "div",
        {},
        element("h2", {}, title),
        note ? element("p", { class: "note" }, note) : null,
      ),
      actions ? element("div", { class: "panel-actions" }, actions) : null,
    ),
    body,
  );

export const scroll = (...children) =>
  element("div", { class: "scroll" }, ...children);

export const empty = (title, detail) =>
  element(
    "div",
    { class: "empty" },
    element("b", {}, title),
    detail ? element("p", {}, detail) : null,
  );

export const command = (text) => element("code", { class: "command" }, text);

let toastTimer = 0;
export function toast(text) {
  let node = document.getElementById("toast");
  if (!node) {
    node = element("div", { id: "toast", role: "status" });
    document.body.append(node);
  }
  node.textContent = text;
  node.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => node.classList.remove("show"), 1600);
}

export async function copy(text, message = "Copied") {
  try {
    await navigator.clipboard.writeText(text);
    toast(message);
  } catch {
    toast("Copy failed");
  }
}

/** A brain name as a link to its page. */
export const brainLink = (name, extra = "") =>
  element(
    "a",
    { class: `brain-link ${extra}`, href: href(["brain", name]) },
    name,
  );

/** Horizontal bar of a share, 0..1. */
export const meter = (share, className = "") =>
  element(
    "span",
    { class: `meter ${className}` },
    element("i", {
      style: `width:${Math.round(100 * Math.min(1, Math.max(0, share)))}%`,
    }),
  );
