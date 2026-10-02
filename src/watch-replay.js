import { readSimulationState } from "./simulation-state.js";
import { createWorldView, ViewRotation } from "./view.js";

export const REPLAY_INPUT = {
  controls: {
    throttle: 0,
    steer: 0,
    pitch: 0,
    yaw: 0,
    roll: 0,
    jump: false,
    boost: false,
    handbrake: false,
  },
};

const yieldToPage = () => new Promise((resolve) => setTimeout(resolve, 0));

/** A watch-only index. Checkpoints own Rust state, not serialized graphics frames. */
export class WatchReplay {
  constructor(wasm, handle, settings, dt, unlimitedBoost = false) {
    Object.assign(this, { wasm, settings, dt, unlimitedBoost });
    this.checkpoints = [];
    this.highlights = [];
    this.clips = [];
    this.position = this.indexed = this.frames = 0;
    this.total = null;
    this.error = "";
    this.disposed = false;
    this.revision = 0;
    this.indexHandle = wasm.sim_clone(handle);
    this.recordedLength = wasm.sim_record_length?.(handle) || null;
    this.checkpoint();
  }
  checkpoint() {
    this.checkpoints.push({
      tick: this.indexed,
      frames: this.frames,
      handle: this.wasm.sim_clone(this.indexHandle),
    });
  }
  read(handle, view) {
    const w = this.wasm;
    const pointer = w.sim_state(handle);
    return readSimulationState(
      new Float64Array(w.memory.buffer, pointer, w.sim_state_len(handle)),
      view,
    );
  }
  async prepare() {
    const w = this.wasm;
    const view = {
      world: createWorldView(),
      ballRot: new ViewRotation(),
      settings: this.settings,
    };
    try {
      // Let startup draw before the first preparation slice.
      await yieldToPage();
      if (this.disposed) return false;
      this.read(this.indexHandle, view);
      const interval = Math.round(5 / this.dt);
      const limit = this.recordedLength ?? 300000;
      while (view.phase !== "ended" && this.indexed < limit) {
        const deadline = performance.now() + 8;
        do {
          const before = view.phase;
          const worldTick = view.world.tick;
          w.sim_command(this.indexHandle, 5, Number(this.unlimitedBoost));
          w.sim_tick(this.indexHandle, 0, 0, 0, 0, 0, 0, 0, 0, -1);
          const events = this.read(this.indexHandle, view);
          this.indexed++;
          if (before !== "countdown" && view.world.tick !== worldTick)
            this.frames++;
          for (const event of events) this.highlight(event, view);
          if (before !== "replay" && view.phase === "replay")
            this.clips.push({ start: this.indexed, end: null });
          if (before === "replay" && view.phase !== "replay")
            this.clips.at(-1).end = this.indexed;
          if (this.indexed % interval === 0) this.checkpoint();
        } while (
          view.phase !== "ended" &&
          this.indexed < limit &&
          performance.now() < deadline
        );
        await yieldToPage();
        if (this.disposed) return false;
      }
      if (view.phase !== "ended" && !this.recordedLength)
        throw new Error("Match exceeded the replay preparation limit.");
      this.total = this.indexed;
      return true;
    } catch (error) {
      this.error = error.message;
      // A failed index must not prevent normal watching or retain its checkpoints.
      this.freeCheckpoints();
      return false;
    } finally {
      if (this.indexHandle) w.sim_destroy(this.indexHandle);
      this.indexHandle = 0;
    }
  }
  highlight(event, view) {
    if (!["goal", "overtime", "save", "demo"].includes(event.type)) return;
    const car =
      event.type === "goal"
        ? view.world.cars[view.replayScorer]
        : (event.car ?? event.attacker);
    this.highlights.push({
      tick: this.indexed,
      type: event.type,
      team: event.type === "overtime" ? -1 : (car?.team ?? event.team),
      name: car?.name ?? "Own goal",
      victim: event.victim?.name,
      score: [...view.score],
      clock: view.clock,
      overtime: view.overtime,
    });
    // Own goals belong to the scoring team, not the last car to touch the ball.
    if (event.type === "goal") this.highlights.at(-1).team = event.team;
  }
  /** Start early enough to rebuild all 1080 goal-replay images from simulation steps. */
  seekCheckpoint(target) {
    const anchor = this.checkpoints.findLast((c) => c.tick <= target);
    return (
      this.checkpoints.findLast((c) => c.frames <= anchor.frames - 1080) ??
      this.checkpoints[0]
    );
  }
  async seek(game, tick) {
    if (this.disposed || this.total === null || !Number.isFinite(tick))
      return false;
    const target = Math.max(0, Math.min(this.total, Math.round(tick)));
    const revision = ++this.revision;
    const checkpoint = this.seekCheckpoint(target);
    game.seeking = true;
    game.clearWatchEffects();
    this.wasm.sim_restore(game.handle, checkpoint.handle);
    game.sync();
    game.replayBuf = [];
    game.prev = game.cur = null;
    game.acc = 0;
    game.snapshotNow();
    this.position = checkpoint.tick;
    try {
      while (this.position < target) {
        const deadline = performance.now() + 8;
        do {
          game.tick(REPLAY_INPUT, true);
        } while (this.position < target && performance.now() < deadline);
        await yieldToPage();
        if (this.disposed || revision !== this.revision) return false;
      }
      game.acc = 0;
      game.finishWatchSeek();
      return true;
    } finally {
      if (!this.disposed && revision === this.revision) game.seeking = false;
    }
  }
  freeCheckpoints() {
    for (const checkpoint of this.checkpoints)
      this.wasm.sim_destroy(checkpoint.handle);
    this.checkpoints.length = 0;
  }
  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    this.revision++;
    this.freeCheckpoints();
    if (this.indexHandle) this.wasm.sim_destroy(this.indexHandle);
    this.indexHandle = 0;
  }
}
