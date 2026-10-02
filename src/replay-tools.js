import "./replay-tools.css";
import {
  MAX_REPLAY_BYTES,
  scenarioFile,
  readScenarioFile,
  keepLatestReplay,
  latestReplay,
} from "./replay-files.js";

function node(tag, text, className) {
  const el = document.createElement(tag);
  if (text) el.textContent = text;
  if (className) el.className = className;
  return el;
}
function button(text, action) {
  const el = node("button", text);
  el.type = "button";
  el.addEventListener("click", action);
  return el;
}
function download(text, filename) {
  const url = URL.createObjectURL(
    new Blob([text], { type: "text/plain;charset=utf-8" }),
  );
  const a = node("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function select(options, value) {
  const el = node("select");
  for (const [key, title] of options) {
    const option = node("option", title);
    option.value = key;
    el.append(option);
  }
  if (value != null) el.value = String(value);
  return el;
}
function field(form, title, input) {
  const label = node("label", title);
  label.append(input);
  form.append(label);
  return input;
}

export function mountReplayTools(game, app) {
  const root = node("section", "", "replay-tools");
  root.setAttribute("aria-label", "Game recordings");
  const row = node("div", "", "replay-tools-buttons");
  const message = node(
    "p",
    "Games record automatically. Save a file to keep more than one game.",
  );
  message.setAttribute("role", "status");
  root.append(row, message);
  document.body.append(root);
  let latest = null,
    opened = null,
    returnToMoment = null,
    busy = false,
    saved = null;
  const report = (error) => {
    message.textContent = error?.message ?? String(error);
  };
  const active = () =>
    game.mode === "match" && !game.watch && game.recordingTicks > 0;

  async function remember() {
    if (!active()) return;
    if (
      saved?.identity === game.recordingIdentity &&
      saved.ticks === game.recordingTicks
    )
      return saved.value;
    const value = {
      text: game.exportRecording(),
      name: `game-${new Date().toISOString().replace(/[:.]/g, "-")}.soccar-replay.json`,
    };
    latest = value;
    saved = {
      identity: game.recordingIdentity,
      ticks: game.recordingTicks,
      value,
    };
    try {
      await keepLatestReplay(value);
      if (!game.watch)
        message.textContent =
          "Latest game saved on this device. You can watch it or save a file.";
    } catch {
      message.textContent = "Replay stays in this tab. Save a file to keep it.";
    }
    update();
    return value;
  }
  game.onRecordingReady = () => {
    remember().catch(report);
  };
  game.onRecordingLeaving = game.onRecordingReady;

  async function watch(value) {
    busy = true;
    update();
    message.textContent = "Opening replay…";
    await new Promise((resolve) => setTimeout(resolve, 0));
    try {
      game.startSavedReplay(value.text, value.name);
      opened = value;
      app.menu.closeAll();
      game.paused = false;
      document.activeElement?.blur?.();
      await game.watchPreparation;
      message.textContent =
        "Pause, seek to a moment, then select Create set piece. C also opens the form.";
    } finally {
      busy = false;
      update();
    }
  }
  const watchLast = button("Watch last game", async () => {
    if (busy) return;
    busy = true;
    update();
    try {
      if (active()) await remember();
      if (latest) await watch(latest);
    } catch (error) {
      report(error);
    } finally {
      busy = false;
      update();
    }
  });
  const save = button("Save replay", async () => {
    try {
      const value = active() ? await remember() : (opened ?? latest);
      if (value) download(value.text, value.name);
    } catch (error) {
      report(error);
    }
  });
  const file = node("input");
  file.type = "file";
  file.accept = ".json,.txt,.soccar-replay,.soccar-setpiece";
  file.hidden = true;
  file.setAttribute("aria-label", "Open replay or set piece file");
  file.addEventListener("change", async () => {
    const selected = file.files?.[0];
    file.value = "";
    if (!selected) return;
    busy = true;
    update();
    try {
      if (selected.size > MAX_REPLAY_BYTES)
        throw new Error("Recording is too large");
      const text = await selected.text();
      if (text.trimStart().startsWith("{"))
        await watch({ text, name: selected.name });
      else {
        const scenario = readScenarioFile(text);
        const brain =
          game.brainChoices.find((b) => b.name === "alphabravo") ??
          game.brainChoices[0];
        game.startUserScenario(scenario.text, scenario.name, brain);
        app.menu.closeAll();
        game.paused = false;
        message.textContent = `Testing ${scenario.name} with ${brain.name}.`;
      }
    } catch (error) {
      report(error);
    }
    busy = false;
    update();
  });
  const open = button("Open file", () => file.click());
  const create = button("Create set piece", () => editor(false));
  const back = button("Back to moment", async () => {
    if (!returnToMoment) return;
    try {
      await returnToMoment();
    } catch (error) {
      report(error);
    }
    update();
  });
  row.append(watchLast, save, open, create, back, file);

  function update() {
    watchLast.disabled = busy || (!latest && !active());
    save.disabled = busy || (!latest && !opened && !active());
    open.disabled = busy;
    create.hidden = !game.watch || !!game.watch.scenario;
    create.disabled =
      busy ||
      game.watchReplay?.total == null ||
      game.phase !== "playing" ||
      game.seeking;
    back.hidden = !game.watch?.scenario || !returnToMoment;
  }
  const timer = setInterval(update, 500);
  latestReplay()
    .then((value) => {
      if (!latest) latest = value;
      update();
    })
    .catch(() => {});
  update();

  function editor(defend) {
    if (
      !game.watch ||
      game.watch.scenario ||
      game.watchReplay?.total == null ||
      game.phase !== "playing" ||
      game.seeking
    ) {
      report(new Error("Choose a live-play moment in a match replay"));
      return;
    }
    const owner = game.watch,
      wasPaused = owner.paused,
      tick = game.watchReplay.position;
    const source = opened,
      config = { ...game.config, watch: { ...owner } };
    owner.paused = true;
    game.acc = 0;
    const dialog = node("dialog", "", "setpiece-editor");
    const form = node("form");
    form.method = "dialog";
    form.append(node("h2", "Create a set piece"));
    form.append(
      node(
        "p",
        "The brain controls one car. All other cars stay in the simulation.",
      ),
    );
    const car = field(
      form,
      "Which car should the brain control?",
      select(
        game.world.cars.map((c) => [
          c.id,
          `${c.team ? "Orange" : "Blue"} · ${c.name} · car ${c.id + 1}${c.isDemoed ? " (demolished)" : ""}`,
        ]),
        game.watch.follow,
      ),
    );
    const kind = field(
      form,
      "Objective",
      select(
        [
          ["attack", "Attack: score a goal"],
          ["defend", "Defend: do not concede"],
        ],
        defend ? "defend" : "attack",
      ),
    );
    const seconds = node("input");
    seconds.type = "number";
    seconds.min = "0.1";
    seconds.max = "60";
    seconds.step = "0.1";
    seconds.value = "4";
    seconds.required = true;
    field(form, "Timeout in seconds", seconds);
    const others = field(
      form,
      "All other cars, including teammates",
      select(
        [
          [0, "Recorded controls: repeat this challenge"],
          [2, "Chase: react to the changed play"],
          [1, "Idle"],
          [3, "Goalie"],
          [4, "Throttle"],
        ],
        0,
      ),
    );
    form.append(
      node(
        "small",
        "Recorded cars use physics, not stored positions. Their inputs cannot react to new play.",
      ),
    );
    const name = node("input");
    name.value = `moment-${tick}`;
    name.required = true;
    name.pattern = "[a-z0-9][a-z0-9_\\-]{0,63}";
    name.maxLength = 64;
    field(form, "Short test name", name);
    const description = node("textarea");
    description.rows = 2;
    description.placeholder =
      "What should this car do? What makes this moment useful?";
    field(
      form,
      "Description (the contribution agent can ask for this later)",
      description,
    );
    const brain = field(
      form,
      "Brain for preview",
      select(
        game.brainChoices.map((b) => [b.name, b.name]),
        game.brainChoices.some((b) => b.name === "alphabravo")
          ? "alphabravo"
          : "allstar",
      ),
    );
    const status = node("p", "", "setpiece-status");
    status.setAttribute("role", "status");
    const actions = node("div", "", "setpiece-actions");
    let text = null;
    function capture() {
      if (!form.reportValidity()) return null;
      text = game.exportCarScenario(
        Number(car.value),
        kind.value,
        Number(seconds.value),
        Number(others.value),
      );
      game.lastSetPiece = text;
      return scenarioFile(text, name.value, description.value);
    }
    const exportButton = button("Download set piece", () => {
      try {
        const result = capture();
        if (!result) return;
        download(result, `${name.value}.soccar-setpiece.txt`);
        status.textContent = `Add this file to user-${kind.value}. Ask the contribution agent to check it.`;
      } catch (error) {
        status.textContent = error.message;
      }
    });
    const copy = button("Copy", async () => {
      try {
        const result = capture();
        if (result) {
          await navigator.clipboard.writeText(result);
          status.textContent = "Copied the full state and controls.";
        }
      } catch (error) {
        status.textContent = `${error.message}. Use Download set piece instead.`;
      }
    });
    const preview = button("Preview", () => {
      try {
        if (!capture()) return;
        const chosen = game.brainChoices.find((b) => b.name === brain.value);
        const withNote = readScenarioFile(
          scenarioFile(text, name.value, description.value),
        ).text;
        game.startUserScenario(withNote, name.value, chosen);
        returnToMoment = async () => {
          if (owner.recording) await watch(source);
          else {
            game.startMatch(config);
            app.menu.closeAll();
            game.paused = false;
            await game.watchPreparation;
          }
          await game.seekWatch(tick);
          game.watch.paused = true;
        };
        dialog.close();
        message.textContent =
          "Watch the result. Back to moment restores the source replay.";
      } catch (error) {
        status.textContent = error.message;
      }
      update();
    });
    actions.append(
      exportButton,
      preview,
      copy,
      button("Close", () => dialog.close()),
    );
    form.append(status, actions);
    dialog.append(form);
    document.body.append(dialog);
    form.addEventListener("submit", (event) => event.preventDefault());
    dialog.addEventListener(
      "close",
      () => {
        if (game.watch === owner) owner.paused = wasPaused;
        dialog.remove();
        update();
      },
      { once: true },
    );
    dialog.addEventListener("keydown", (event) => event.stopPropagation());
    dialog.showModal();
    car.focus();
  }
  game.openScenarioEditor = editor;
  return () => {
    clearInterval(timer);
    root.remove();
  };
}
