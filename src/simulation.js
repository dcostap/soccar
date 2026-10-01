import { readSimulationState } from "./simulation-state.js";

export async function createRustGame(
  api,
  renderer,
  hud,
  audio,
  input,
  settings,
  seed = crypto.getRandomValues(new Uint32Array(1))[0],
) {
  const response = await fetch(
    `${import.meta.env?.BASE_URL ?? "/"}simulation/soccar_simulation.wasm`,
  );
  if (!response.ok)
    throw new Error(`Simulation download failed: ${response.status}`);
  const { instance } = await WebAssembly.instantiate(
    await response.arrayBuffer(),
  );
  const wasm = instance.exports;
  class RustGame extends api.Game {
    constructor() {
      super(renderer, hud, audio, input, settings);
      this.handle = wasm.sim_create(seed);
    }
    sync() {
      const pointer = wasm.sim_state(this.handle);
      return readSimulationState(
        new Float64Array(
          wasm.memory.buffer,
          pointer,
          wasm.sim_state_len(this.handle),
        ),
        this,
        api,
      );
    }
    destroy() {
      clearTimeout(this.tipTimer);
      if (this.handle) wasm.sim_destroy(this.handle);
      this.handle = 0;
    }
    clearPresentation() {
      this.renderer.removeAllCars();
      this.world = new api.World();
      this.bots = [];
      this.replayBuf = [];
      this.prev = this.cur = null;
      this.acc = 0;
      this.lastTouches = [];
      this.goalPrediction = null;
      this.camera.reset();
      this.hud.setReplay(false);
      this.hud.showScoreboard(false);
    }
    start(mode, config = this.config) {
      this.clearPresentation();
      this.config = config;
      const skill = { rookie: 0, pro: 1, allstar: 2 }[config.skill] ?? 1;
      if (
        !wasm.sim_start(
          this.handle,
          mode,
          config.teamSize ?? 1,
          skill,
          config.playerTeam ?? 0,
          config.duration ?? 300,
          this.settings.input.dodgeDeadzone,
        )
      )
        throw new Error("Invalid simulation configuration");
      this.sync();
    }
    startMenuBackground() {
      this.start(0);
      this.hud.setVisible(false);
    }
    startFreeplay() {
      this.start(1);
      this.hud.setVisible(true);
      this.hud.setMatchUi(false);
      const glyph = api.prompt ?? ((_, key) => key);
      this.hud.setTip(() =>
        (api.promptDevice?.() ?? "kbm") === "kbm"
          ? `FREE PLAY &nbsp; ${glyph("select", "R")} RESET &nbsp; ${glyph("x", "1")} BALL IN FRONT &nbsp; ${glyph("y", "2")} BALL ON CAR &nbsp; ${glyph("start", "ESC")} MENU`
          : `FREE PLAY &nbsp; D-PAD ◀ RESET &nbsp; ▼ BALL IN FRONT &nbsp; ▲ BALL ON CAR &nbsp; ${glyph("start", "ESC")} MENU`,
      );
      this.tipTimer = setTimeout(() => this.hud.setTip(""), 6000);
    }
    startMatch(config) {
      this.start(2, config);
      this.hud.setVisible(true);
      this.hud.setMatchUi(true);
      this.hud.setTip("");
      this.renderer.ball.visible = true;
      this.snapshotNow();
    }
    resetFreeplay() {
      wasm.sim_command(this.handle, 1, 0);
      this.sync();
      this.camera.reset();
    }
    placeBall(which) {
      wasm.sim_command(this.handle, which === "front" ? 2 : 3, 0);
      this.sync();
    }
    endReplay() {
      wasm.sim_command(this.handle, 4, 0);
      const events = this.sync();
      this.phasePresentation("replay");
      this.present(events);
    }
    evaluateShotSave() {} // Rust owns all statistics and shot/save prediction.
    blastCars() {} // Rust applies the goal impulse. Presentation must not change physics.
    tick(frame) {
      const before = this.phase;
      const worldTick = this.world.tick;
      this.previousStats = this.stats;
      wasm.sim_command(this.handle, 5, Number(this.unlimitedBoost));
      wasm.sim_command(this.handle, 6, this.settings.input.dodgeDeadzone);
      const c = frame.controls;
      wasm.sim_tick(
        this.handle,
        c.throttle,
        c.steer,
        c.pitch,
        c.yaw,
        c.roll,
        Number(c.jump),
        Number(c.boost),
        Number(c.handbrake),
        c.dodgeMag ?? -1,
      );
      const events = this.sync();
      this.phasePresentation(before);
      if (this.world.tick !== worldTick) {
        if (before !== "countdown") this.recordReplay();
        this.snapshotNow();
        // The original overtime transition takes a kickoff snapshot inside the tick.
        if (before === "playing" && this.phase === "countdown")
          this.snapshotNow();
      } else if (before === "replay" && this.phase === "countdown")
        this.snapshotNow();
      this.present(events);
    }
    phasePresentation(before) {
      if (before !== this.phase) {
        if (this.phase === "replay") {
          this.hud.setReplay(true);
          this.audio.silenceCars();
          const frame = this.replayBuf[this.replayIdx];
          if (frame) this.replayCam.snap(frame.ballPos);
        } else if (before === "replay" || this.phase === "countdown") {
          this.hud.setReplay(false);
          this.camera.reset();
          this.lastTouches = [];
        }
        this.renderer.ball.visible = this.phase !== "goal";
      }
    }
    present(events) {
      for (const event of events) {
        if (event.type === "countdown") {
          this.hud.countdown(event.team);
          this.audio.countdown(event.team);
        } else if (event.type === "overtime") {
          this.hud.showBanner("OVERTIME", "Next goal wins", "white", 3);
          this.audio.whistle();
        } else if (event.type === "ended") {
          // This method changes only presentation fields already supplied by Rust.
          api.Game.prototype.endMatch.call(this);
        } else if (event.type === "save") {
          this.hud.notify(
            `SAVE ${event.car.name}`,
            event.car.team === 0 ? "blue" : "orange",
          );
          if (event.car === this.player)
            this.hud.showBanner(
              "SAVE!",
              "",
              event.car.team === 0 ? "blue" : "orange",
              1.5,
            );
        } else if (this.mode === "menu") {
          if (event.type === "goal")
            this.renderer.goalExplosion(event.ballPos, event.team);
        } else {
          this.handleEvents([event]);
        }
      }
    }
    onGoal(team, speed, position) {
      this.renderer.goalExplosion(position, team);
      this.audio.goal();
      this.camera.addShake(0.8);
      this.input.rumble(0.8, 0.8, 400);
      this.excitement = 1.5;
      this.renderer.ball.visible = false;
      const kph = Math.round(speed * 0.036),
        color = team === 0 ? "blue" : "orange";
      if (this.mode === "freeplay") {
        this.hud.showBanner("GOAL!", `${kph} KPH`, color, 2);
        return;
      }
      const scorer = this.world.cars[this.replayScorer];
      const name = scorer?.name ?? "Own goal";
      const assist = this.world.cars.find(
        (car) =>
          (this.stats.get(car.id)?.assists ?? 0) >
          (this.previousStats?.get(car.id)?.assists ?? 0),
      );
      this.hud.showBanner(
        `${name.toUpperCase()} SCORED!`,
        `${kph} KPH${assist ? ` · Assist: ${assist.name}` : ""}`,
        color,
        3,
      );
      this.hud.notify(`GOAL ${name}`, color);
    }
  }
  return new RustGame();
}
