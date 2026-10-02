export function playbackTime(seconds) {
  const value = Math.max(0, Math.floor(seconds));
  return `${Math.floor(value / 60)}:${String(value % 60).padStart(2, "0")}`;
}

const icons = {
  play: '<path d="m6 4 12 8-12 8Z" fill="currentColor" stroke="none"/>',
  pause:
    '<path d="M6 4h4v16H6zm8 0h4v16h-4z" fill="currentColor" stroke="none"/>',
  restart: '<path d="M4 10a8 8 0 1 1 1 8M4 4v6h6"/>',
  previous: '<path d="M5 5v14m13-14-9 7 9 7Z"/>',
  next: '<path d="M19 5v14M6 5l9 7-9 7Z"/>',
  camera:
    '<rect x="3" y="6" width="13" height="12" rx="2"/><path d="m16 10 5-3v10l-5-3"/>',
  goal: '<circle cx="12" cy="12" r="9"/><path d="m12 7 5 4-2 6H9l-2-6Zm0-4v4m9 2-4 2m1 10-3-4M6 20l3-3M3 9l4 2"/>',
  overtime: '<circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/>',
  save: '<path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6Z"/><path d="m8 12 3 3 5-6"/>',
  demo: '<path d="m5 5 14 14M19 5 5 19"/>',
};
function setIcon(node, name) {
  if (node.dataset.icon === name) return;
  node.dataset.icon = name;
  node.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name]}</svg>`;
}

/** DOM controls for arena watch links. Live matches do not create these controls. */
export class ReplayTimeline {
  constructor(game, parent) {
    this.game = game;
    this.abort = new AbortController();
    this.dragging = false;
    this.preview = null;
    this.markersReady = false;
    const element = (tag, className, text, parentElement = this.root) => {
      const node = document.createElement(tag);
      node.className = className;
      if (text) node.textContent = text;
      parentElement.append(node);
      return node;
    };
    this.root = document.createElement("section");
    this.root.className = "watch-timeline ui-layer";
    this.root.setAttribute("aria-label", "Replay controls");
    parent.append(this.root);
    parent.classList.add("watching");
    const controls = element("div", "watch-controls");
    const listen = (node, event, handler) =>
      node.addEventListener(event, handler, { signal: this.abort.signal });
    const button = (icon, label, handler, parentElement = controls) => {
      const node = element("button", "watch-button", "", parentElement);
      setIcon(node, icon);
      node.type = "button";
      node.title = label;
      node.setAttribute("aria-label", label);
      listen(node, "click", handler);
      return node;
    };
    this.play = button("pause", "Pause replay", () => {
      if (this.dragging) return;
      const ended = game.phase === "ended" || game.watchReplay.position === game.watchReplay.total;
      if (ended) this.requestSeek(0);
      game.watch.paused = ended ? false : !game.watch.paused;
      game.showWatchTip();
    });
    this.previous = button("previous", "Previous highlight", () =>
      this.jumpHighlight(-1),
    );
    this.next = button("next", "Next highlight", () => this.jumpHighlight(1));
    this.play.classList.add("watch-play");
    this.previous.classList.add("watch-jump");
    this.next.classList.add("watch-jump");
    this.time = element("output", "watch-time", "", controls);
    this.elapsed = element("span", "watch-elapsed", "0:00", this.time);
    this.duration = element("span", "watch-duration", " / —", this.time);
    const track = element("div", "watch-track", "", controls);
    this.range = element("input", "watch-range", "", track);
    this.range.type = "range";
    this.range.min = "0";
    this.range.max = "1";
    this.range.step = "1";
    this.range.value = "0";
    this.range.disabled = true;
    this.range.setAttribute("aria-label", "Replay position");
    listen(this.range, "pointerdown", () => {
      if (this.range.disabled) return;
      this.dragging = true;
      this.wasPaused = game.watch.paused;
      game.watch.paused = true;
      game.showWatchTip();
    });
    const release = () => {
      if (!this.dragging) return;
      this.dragging = false;
      game.watch.paused = this.wasPaused;
      game.showWatchTip();
    };
    listen(window, "pointerup", release);
    listen(window, "pointercancel", release);
    listen(window, "blur", release);
    listen(this.range, "input", () =>
      this.requestSeek(Number(this.range.value)),
    );
    this.markers = element("div", "watch-markers", "", track);
    const camera = element("label", "watch-camera", "", controls);
    const cameraIcon = element("span", "watch-camera-icon", "", camera);
    setIcon(cameraIcon, "camera");
    this.camera = element("select", "", "", camera);
    this.camera.setAttribute("aria-label", "Follow car");
    for (const [index, car] of game.world.cars.entries()) {
      const option = element("option", "", String(index + 1), this.camera);
      option.value = String(index);
      option.title = `${car.name} · ${car.team === 0 ? "Blue" : "Orange"}`;
    }
    listen(this.camera, "change", () => {
      game.watch.follow = Number(this.camera.value);
      game.camera.reset();
      game.showWatchTip();
    });
    this.speed = element("select", "watch-speed", "", controls);
    this.speed.setAttribute("aria-label", "Replay speed");
    this.speed.title = "Playback speed";
    for (const speed of [0.25, 0.5, 1, 2, 4, 8, 16]) {
      const option = element("option", "", `${speed}×`, this.speed);
      option.value = String(speed);
    }
    listen(this.speed, "change", () => {
      game.watch.speed = Number(this.speed.value);
      game.showWatchTip();
    });
    const filters = element("div", "watch-filters", "", controls);
    this.filters = {};
    for (const [type, label] of [
      ["save", "saves"],
      ["demo", "demos"],
    ]) {
      const active = type === "save";
      const toggle = button(
        type,
        `Show ${label}`,
        () => {
          const active = toggle.getAttribute("aria-pressed") !== "true";
          toggle.setAttribute("aria-pressed", String(active));
          this.root.classList.toggle(`show-${type}`, active);
        },
        filters,
      );
      toggle.setAttribute("aria-pressed", String(active));
      this.root.classList.toggle(`show-${type}`, active);
      this.filters[type] = toggle;
    }
    this.status = element("span", "watch-status", "Preparing replay…");
    this.status.id = "watch-replay-status";
    this.status.setAttribute("role", "status");
    this.range.setAttribute("aria-describedby", this.status.id);
    // Do not send focused control keys to spectator or driving input handlers.
    for (const type of ["keydown", "keyup"])
      listen(this.root, type, (event) => {
        if (event.code !== "Escape") event.stopPropagation();
      });
    this.update();
  }
  requestSeek(tick) {
    if (this.game.paused) return;
    this.preview = tick;
    this.pending = tick;
    this.seekRevision = (this.seekRevision ?? 0) + 1;
    if (this.request) return;
    this.request = requestAnimationFrame(async () => {
      this.request = 0;
      const target = this.pending;
      const revision = this.seekRevision;
      try {
        await this.game.seekWatch(target);
      } finally {
        if (this.seekRevision === revision) this.preview = null;
      }
    });
    this.update();
  }
  jumpHighlight(direction) {
    const replay = this.game.watchReplay;
    if (replay.total === null) return;
    const candidates = replay.highlights.filter((h) =>
      ["goal", "overtime"].includes(h.type),
    );
    const lead = Math.round(3 / replay.dt);
    const position = this.preview ?? replay.position;
    const point =
      direction > 0
        ? candidates.find((h) => Math.max(0, h.tick - lead) > position + 1)
        : candidates.findLast((h) => Math.max(0, h.tick - lead) < position - 1);
    if (point) this.requestSeek(Math.max(0, point.tick - lead));
  }
  addMarkers() {
    const replay = this.game.watchReplay;
    for (const h of replay.highlights) {
      const marker = document.createElement("button");
      marker.type = "button";
      marker.dataset.tick = String(h.tick);
      marker.className = `watch-marker ${h.type} ${h.team === 0 ? "blue" : h.team === 1 ? "orange" : "neutral"}`;
      marker.style.left = `${(h.tick / replay.total) * 100}%`;
      setIcon(marker, h.type);
      const detail = {
        goal: `Goal · ${h.name} · ${h.score.join("–")}`,
        overtime: "Overtime begins",
        save: `Save · ${h.name}`,
        demo: `Demolition · ${h.name} → ${h.victim}`,
      }[h.type];
      const clock = `${h.overtime ? "+" : ""}${playbackTime(h.clock)}`;
      marker.title = `${playbackTime(h.tick * replay.dt)} · ${detail} · Match clock ${clock}`;
      marker.setAttribute("aria-label", marker.title);
      marker.addEventListener(
        "click",
        () => this.requestSeek(Math.max(0, h.tick - Math.round(3 / replay.dt))),
        { signal: this.abort.signal },
      );
      this.markers.append(marker);
    }
    this.markersReady = true;
  }
  update() {
    const game = this.game,
      replay = game.watchReplay;
    if (!replay) return;
    const ready = replay.total !== null;
    this.root.inert = !!game.paused;
    const position = this.preview ?? replay.position;
    if (ready && !this.markersReady) this.addMarkers();
    this.range.disabled = !ready || game.paused;
    this.previous.disabled = this.next.disabled = !ready || game.paused;
    this.play.disabled =
      this.speed.disabled =
      this.camera.disabled =
        game.paused;
    this.range.max = String(replay.total ?? 1);
    if (!this.dragging) this.range.value = String(position);
    this.range.style.setProperty(
      "--progress",
      `${ready ? (position / Math.max(1, replay.total)) * 100 : 0}%`,
    );
    const elapsed = playbackTime(position * replay.dt);
    const total = ready ? playbackTime(replay.total * replay.dt) : "—";
    this.elapsed.textContent = elapsed;
    this.duration.textContent = ` / ${total}`;
    this.range.setAttribute("aria-valuetext", `${elapsed} of ${total}`);
    const action =
      game.phase === "ended" || replay.position === replay.total ? "Restart" : game.watch.paused ? "Play" : "Pause";
    setIcon(this.play, action.toLowerCase());
    this.play.title = `${action} replay`;
    this.play.setAttribute("aria-label", this.play.title);
    this.camera.value = String(game.watch.follow);
    const car = game.world.cars[game.watch.follow];
    this.camera.parentElement.title = `Follow ${car?.name ?? "car"} (${car?.team === 0 ? "Blue" : "Orange"})`;
    this.speed.value = String(game.watch.speed);
    const status =
      replay.error ||
      (!ready
        ? `Preparing replay · ${playbackTime(replay.indexed * replay.dt)} indexed`
        : game.seeking || this.preview !== null
          ? "Seeking…"
          : "");
    if (this.status.textContent !== status) this.status.textContent = status;
    this.root.title =
      status || `Watching #${game.watch.id} · ${game.watch.names.join(" vs ")}`;
    this.root.classList.toggle("error", !!replay.error);
    this.root.setAttribute(
      "aria-busy",
      String(!ready || game.seeking || this.preview !== null),
    );
    this.root.classList.toggle(
      "busy",
      !ready || game.seeking || this.preview !== null,
    );
  }
  destroy() {
    this.abort.abort();
    if (this.request) cancelAnimationFrame(this.request);
    this.root.parentElement?.classList.remove("watching");
    this.root.remove();
  }
}
