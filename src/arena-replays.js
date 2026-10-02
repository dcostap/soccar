// Local player replay library. Full replay data stays in this browser's IndexedDB.
import {
  MAX_REPLAY_BYTES,
  deleteReplay,
  keepReplay,
  keepStoredFile,
  readScenarioFile,
  replayHistory,
  storedReplay,
} from "./replay-files.js";
import {
  clock,
  copy,
  element,
  empty,
  panel,
  scroll,
  toast,
} from "./arena-ui.js";

function download(text, filename) {
  const url = URL.createObjectURL(
    new Blob([text], { type: "text/plain;charset=utf-8" }),
  );
  const link = element("a", { href: url, download: filename });
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function id(prefix) {
  return `${prefix}:${globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`}`;
}

function gameUrl(base, key, value) {
  const query = new URLSearchParams({ [key]: value });
  return `${base}?${query}`;
}

function replayRecord(text, name) {
  let replay;
  try {
    replay = JSON.parse(text);
  } catch {
    throw new Error("Invalid replay JSON");
  }
  if (
    replay?.format !== 1 ||
    typeof replay.engine !== "string" ||
    !replay.initial?.world ||
    !Array.isArray(replay.frames) ||
    !replay.frames.length
  )
    throw new Error("Invalid replay file");
  const now = Date.now();
  return {
    id: id("game:import"),
    createdAt: now,
    updatedAt: now,
    text,
    name,
    ticks: replay.frames.length,
    score: null,
    teamSize: replay.initial.config?.team_size ?? 1,
    skill: "imported",
  };
}

export async function renderReplays(root, ctx) {
  root.dataset.title = "Replays";
  const input = element("input", {
    type: "file",
    accept: ".json,.txt,.soccar-replay,.soccar-setpiece",
    hidden: true,
    "aria-label": "Open replay or set piece file",
  });
  const open = element(
    "button",
    { type: "button", class: "button", onclick: () => input.click() },
    "Open file",
  );
  const body = element("div");

  async function paint() {
    const games = await replayHistory();
    if (!games.length) {
      body.replaceChildren(
        empty(
          "No recorded games yet",
          "Play a match. It will appear here automatically on this browser and origin.",
        ),
      );
      return;
    }
    const rows = games.map((game) => {
      const score = Array.isArray(game.score)
        ? `${game.score[0]}–${game.score[1]}`
        : "—";
      const watch = element(
        "a",
        {
          class: "button small",
          href: gameUrl(ctx.base, "replay", game.id),
        },
        "Watch",
      );
      const reference = element(
        "button",
        {
          type: "button",
          class: "button small ghost",
          onclick: () =>
            copy(
              `Replay: ${game.id}\nRecorded: ${new Date(game.createdAt ?? game.updatedAt).toISOString()}\nWatch: ${new URL(gameUrl(ctx.base, "replay", game.id), location.href).href}`,
              "Replay reference copied",
            ),
        },
        "Copy reference",
      );
      const save = element(
        "button",
        {
          type: "button",
          class: "button small ghost",
          onclick: async () => {
            try {
              const value = await storedReplay(game.id);
              if (!value) throw new Error("Saved replay is missing");
              download(value.text, value.name);
            } catch (error) {
              toast(error.message);
            }
          },
        },
        "Download",
      );
      const remove = element(
        "button",
        {
          type: "button",
          class: "button small ghost",
          onclick: async () => {
            if (!confirm("Delete this saved game?")) return;
            try {
              await deleteReplay(game.id);
              await paint();
            } catch (error) {
              toast(error.message);
            }
          },
        },
        "Delete",
      );
      return element(
        "tr",
        {},
        element(
          "td",
          { class: "text" },
          new Date(game.createdAt ?? game.updatedAt).toLocaleString(),
        ),
        element("td", {}, `${game.teamSize ?? 1}v${game.teamSize ?? 1}`),
        element("td", {}, score),
        element("td", {}, clock((game.ticks ?? 0) / 120)),
        element(
          "td",
          { class: "replay-actions" },
          watch,
          reference,
          save,
          remove,
        ),
      );
    });
    body.replaceChildren(
      element(
        "div",
        { class: "summary-line" },
        element("b", {}, `${games.length.toLocaleString()} recorded games`),
      ),
      scroll(
        element(
          "table",
          { class: "replays" },
          element(
            "thead",
            {},
            element(
              "tr",
              {},
              element("th", { class: "text" }, "Recorded"),
              element("th", {}, "Match"),
              element("th", {}, "Score"),
              element("th", {}, "Recorded time"),
              element("th", {}, "Actions"),
            ),
          ),
          element("tbody", {}, rows),
        ),
      ),
    );
  }

  input.addEventListener("change", async () => {
    const file = input.files?.[0];
    input.value = "";
    if (!file) return;
    try {
      if (file.size > MAX_REPLAY_BYTES)
        throw new Error("Recording is too large");
      const text = await file.text();
      if (text.trimStart().startsWith("{")) {
        const record = replayRecord(text, file.name);
        await keepReplay(record);
        await paint();
        toast("Replay added");
      } else {
        readScenarioFile(text);
        const key = id("setpiece:import");
        await keepStoredFile({ id: key, text, name: file.name });
        location.assign(gameUrl(ctx.base, "scenarioFile", key));
      }
    } catch (error) {
      toast(error.message);
    }
  });

  root.append(
    panel("Player replays", body, {
      note: "Every player match stays in this browser. Watch, download, or delete it here. Clearing site data removes local recordings.",
      actions: [open, input],
    }),
  );
  await paint();
}
