import { readSimulationState } from "./simulation-state.js";
import { createWorldView } from "./view.js";
import { Presentation } from "./presentation.js";

export function simulationGeometry(wasm) {
  const read = wasm.sim_geometry_value;
  const values = Array.from({ length: 23 }, (_, i) => read(i));
  return {
    dt: values[0],
    halfWidth: values[1],
    halfLength: values[2],
    height: values[3],
    diagonal: values[4],
    goalHeight: values[5],
    goalLine: values[6],
    ballRadius: values[7],
    ballCollisionRadius: values[8],
    car: {
      hitboxSize: values.slice(9, 12),
      hitboxOffset: values.slice(12, 15),
      frontWheel: { x: values[15], y: values[16], radius: values[17] },
      backWheel: { x: values[18], y: values[19], radius: values[20] },
    },
    pads: Array.from({ length: values[21] }, (_, i) => ({
      x: read(23 + i * 3),
      y: read(24 + i * 3),
      big: !!read(25 + i * 3),
    })),
    floorExtent: values[22],
  };
}
let simulation;
export function loadSimulation() {
  return (simulation ??= (async () => {
    const response = await fetch(
      `${import.meta.env?.BASE_URL ?? "/"}simulation/soccar_simulation.wasm`,
      { cache: "no-cache" }, // Revalidate the binary after a browser bundle or ABI change.
    );
    if (!response.ok)
      throw new Error(`Simulation download failed: ${response.status}`);
    const { instance } = await WebAssembly.instantiate(
      await response.arrayBuffer(),
    );
    return {
      wasm: instance.exports,
      geometry: simulationGeometry(instance.exports),
    };
  })());
}

export async function createRustGame(
  api,
  renderer,
  hud,
  audio,
  input,
  settings,
  seed = crypto.getRandomValues(new Uint32Array(1))[0],
  loaded,
) {
  const engine = loaded ?? (await loadSimulation());
  const wasm = engine.wasm;
  api = { ...api, geometry: engine.geometry };
  class RustGame extends Presentation {
    constructor() {
      super(api, renderer, hud, audio, input, settings);
      this.handle = wasm.sim_create(seed);
      this.sync();
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
      );
    }
    destroy() {
      clearTimeout(this.tipTimer);
      if (this.handle) wasm.sim_destroy(this.handle);
      this.handle = 0;
    }
    clearPresentation() {
      this.renderer.removeAllCars();
      this.world = createWorldView();
      this.replayBuf = [];
      this.prev = this.cur = null;
      this.acc = 0;
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
      if (this.phase === "countdown") this.snapshotNow();
      this.present(events);
    }
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
          this.showMatchEnded(event.team);
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
          this.presentEvent(event);
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
