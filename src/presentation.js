import { ViewVector as e, ViewRotation, createWorldView } from "./view.js";
const emptyStats = () => ({
  score: 0,
  goals: 0,
  assists: 0,
  saves: 0,
  shots: 0,
});
// Draw Rust state. All simulation steps and match transitions go through the WASM bridge.
export class Presentation {
  showMatchEnded(team) {
    const victory = this.player?.team === team;
    this.hud.showBanner(
      team === 0 ? "BLUE WINS" : "ORANGE WINS",
      this.player ? (victory ? "VICTORY" : "DEFEAT") : "",
      team === 0 ? "blue" : "orange",
      999,
    );
    this.audio.whistle();
    this.audio.silenceCars();
    this.hud.showScoreboard(true, this.scoreRows());
    if (!this.watch) this.onMatchEnd?.(team);
  }
  presentEvent(event) {
    const player = this.player;
    switch (event.type) {
      case "ballHit":
        this.renderer.ballHit(event.point, event.strength);
        this.audio.ballHit(event.point, event.strength);
        if (event.car === player)
          this.input.rumble(Math.min(1, event.strength / 2500), 0.4, 90);
        this.excitement = Math.min(1, this.excitement + event.strength / 8000);
        break;
      case "ballBounce":
        this.audio.ballBounce(event.pos, event.speed);
        break;
      case "goal":
        this.onGoal(event.team, event.ballSpeed, event.ballPos);
        break;
      case "demo":
        this.renderer.demoExplosion(event.victim.pos);
        this.audio.demo(event.victim.pos);
        this.hud.notify(
          `${event.attacker.name}  ✖  ${event.victim.name}`,
          event.attacker.team === 0 ? "blue" : "orange",
        );
        if (event.victim === player || event.attacker === player) {
          this.input.rumble(1, 1, 300);
          this.camera.addShake(0.6);
        }
        break;
      case "bump":
        this.audio.bump(event.victim.pos);
        if (event.victim === player || event.attacker === player)
          this.input.rumble(0.7, 0.5, 150);
        break;
      case "boostPickup":
        if (
          event.car === player ||
          event.car.pos.distanceTo(this.renderer.camera.position) < 3000
        )
          this.audio.boostPickup(event.pad.pos, event.pad.big);
        this.renderer.boostPickup(event.pad.pos, event.pad.big);
        break;
      case "jump":
        this.audio.jump(event.car.pos);
        break;
      case "flip":
        this.audio.flip(event.car.pos);
        break;
      case "land":
        this.audio.land(event.car.pos);
        if (event.car === player) this.input.rumble(0.3, 0.1, 60);
        break;
    }
  }
  constructor(api, renderer, hud, audio, input, settings) {
    Object.assign(this, { api, renderer, hud, audio, input, settings });
    this.world = createWorldView();
    this.config = { teamSize: 1, skill: "pro", playerTeam: 0, duration: 300 };
    this.player = null;
    this.paused = false;
    this.acc = 0;
    this.prev = this.cur = null;
    this.ballRot = new ViewRotation();
    this.replayBuf = [];
    this.excitement = 0.3;
    this.menuOrbit = 0;
    this.fpsAcc = this.fpsFrames = this.fps = 0;
    this.camera = new api.FollowCamera(renderer.camera, settings.camera);
    this.replayCam = new api.ReplayCamera(renderer.camera);
    this.camera.ballCam = settings.gameplay.defaultBallCam;
  }
  frame(delta, input) {
    const step = this.api.geometry.dt;
    this.fpsAcc += delta;
    this.fpsFrames++;
    if (this.fpsAcc > 0.5) {
      this.fps = this.fpsFrames / this.fpsAcc;
      this.fpsAcc = this.fpsFrames = 0;
    }
    if (!this.paused && !this.watch?.paused && !this.seeking) {
      if (this.followed()) {
        if (this.settings.camera.ballCamMode === "hold")
          this.camera.ballCam =
            this.settings.gameplay.defaultBallCam !== input.ballCamHeld;
        else if (input.ballCamToggle)
          this.camera.ballCam = !this.camera.ballCam;
      }
      if (this.mode === "freeplay") {
        if (input.resetPressed || input.freeplay.reset) this.resetFreeplay();
        else if (input.freeplay.ballFront) this.placeBall("front");
        else if (input.freeplay.ballTop) this.placeBall("top");
      }
      if (this.phase === "replay" && input.jumpPressed) this.endReplay();
      const speed = this.watch?.speed ?? 1;
      const limit = Math.ceil(12 * speed);
      this.acc += delta * speed;
      let ticks = 0;
      while (this.acc >= step && ticks < limit && !this.seeking) {
        this.acc -= step;
        ticks++;
        this.tick(input);
      }
      if (ticks >= limit) this.acc = 0;
    }
    if (this.seeking) {
      this.renderer.render();
      return;
    }
    this.render(
      delta,
      this.paused || this.watch?.paused ? 1 : this.acc / step,
      input,
    );
  }
  /** The car the camera follows: the player, or the watched car when spectating. */
  followed() {
    return (
      this.player ??
      (this.watch ? (this.world.cars[this.watch.follow] ?? null) : null)
    );
  }
  snapshotNow() {
    this.prev = this.cur;
    let e = this.world;
    ((this.cur = {
      ballPos: e.ball.pos.clone(),
      ballRot: this.ballRot.clone(),
      ballVisible: !(
        this.phase === `goal` ||
        (e.ball.frozen && this.phase !== `countdown` && this.mode !== `menu`)
      ),
      cars: e.cars.map((e) => ({
        pos: e.pos.clone(),
        rot: e.rot.clone(),
        vel: e.vel.clone(),
        boosting: e.isBoosting,
        supersonic: e.isSupersonic,
        demoed: e.isDemoed,
        braking: e.controls.throttle < 0 && e.forwardSpeed > 50,
        onGround: e.isOnGround,
        wheels: e.wheels.map((e) => ({
          len: e.visualLength,
          steer: e.steerAngle,
          spin: e.spin,
          contact: e.inContact,
        })),
      })),
    }),
      (this.prev ||= this.cur));
  }
  recordReplay() {
    if (this.cur) {
      this.replayBuf.push(this.cur);
      const extra = this.replayBuf.length - this.nativeReplayLength;
      if (extra > 0) this.replayBuf.splice(0, extra);
    }
  }
  render(t, n, r) {
    let i = this.renderer,
      a,
      o;
    if (
      (this.phase === `replay`
        ? ((a = this.replayBuf[Math.max(0, this.replayIdx - 1)] ?? null),
          (o = this.replayBuf[this.replayIdx] ?? a))
        : ((a = this.prev), (o = this.cur)),
      !a || !o)
    ) {
      i.render();
      return;
    }
    let s = (t, r) =>
        new e(
          t.x + (r.x - t.x) * n,
          t.y + (r.y - t.y) * n,
          t.z + (r.z - t.z) * n,
        ),
      c = (e, t) => e.clone().slerp(t, n),
      l = this.player ? this.player.id : -1,
      u = this.world.cars;
    o.cars.forEach((e, r) => {
      let o = a.cars[r] ?? e,
        d = u[r];
      if (!d) return;
      let f = o.pos.distanceTo(e.pos) > 300,
        p = {
          id: d.id,
          team: d.team,
          name: d.name,
          pos: f ? e.pos : s(o.pos, e.pos),
          rot: f ? e.rot : c(o.rot, e.rot),
          vel: e.vel,
          boosting: e.boosting,
          supersonic: e.supersonic,
          demoed: e.demoed,
          braking: e.braking,
          onGround: e.onGround,
          wheels: e.wheels.map((e, t) => ({
            len: o.wheels[t].len + (e.len - o.wheels[t].len) * n,
            steer: e.steer,
            spin: o.wheels[t].spin + (e.spin - o.wheels[t].spin) * n,
            contact: e.contact,
          })),
        };
      if (
        (i.syncCar(p, t, l), this.phase !== `replay` && this.phase !== `ended`)
      ) {
        let t =
          (!e.demoed && this.mode !== `menu`) || (this.mode === `menu` && !1);
        this.audio.updateCar(
          d.id,
          p.pos,
          e.vel.length(),
          d.controls.throttle,
          e.boosting,
          e.onGround,
          d === this.player,
          t,
        );
      }
    });
    let d = s(a.ballPos, o.ballPos),
      f = c(a.ballRot, o.ballRot),
      p = new this.api.RenderQuat(f.x, f.y, f.z, f.w);
    if ((i.syncBall(d, p, o.ballVisible), this.phase === `replay`)) {
      let e = u.findIndex((e) => e.id === this.replayScorer),
        n = e >= 0 ? o.cars[e] : null;
      this.replayCam.update(
        t,
        d,
        n && !n.demoed ? s(a.cars[e].pos, n.pos) : null,
      );
    } else if (this.mode === `menu` || this.phase === `ended`) {
      this.menuOrbit += t * 0.07;
      let e = 6200;
      (i.camera.position.set(
        Math.cos(this.menuOrbit) * e,
        Math.sin(this.menuOrbit) * e * 1.1,
        1900,
      ),
        i.camera.up.set(0, 0, 1),
        i.camera.lookAt(d.x * 0.3, d.y * 0.3, 200));
    } else if (this.followed()) {
      let n = this.followed(),
        i = u.indexOf(n),
        l = a.cars[i],
        f = o.cars[i],
        p = s(l.pos, f.pos),
        m = c(l.rot, f.rot),
        h = this.api.rotate(m, new e(1, 0, 0)),
        g = this.api.rotate(m, new e(0, 0, 1)),
        _ = o.ballVisible ? d : null;
      n.isDemoed ||
        this.camera.update(
          t,
          {
            pos: p,
            vel: f.vel,
            angVel: n.angVel,
            forward: h,
            up: g,
            isOnGround: f.onGround,
          },
          _,
          r,
        );
    }
    if ((this.camera.updateProjection(i.aspect), this.mode !== `menu`)) {
      if (
        (this.hud.setScore(this.score[0], this.score[1]),
        this.mode === `match` && this.hud.setClock(this.clock, this.overtime),
        this.hud.setBoost(
          this.player ? this.player.boost : 0,
          !!this.player && this.phase !== `replay` && this.phase !== `ended`,
        ),
        this.hud.setBallCam(this.camera.ballCam, r.usingGamepad),
        this.phase !== `ended`)
      ) {
        let e = r.scoreboard;
        this.hud.showScoreboard(e, e ? this.scoreRows() : []);
      }
      let e = Math.floor(this.clock / 60),
        t = Math.ceil(this.clock % 60);
      if (
        (i.stadium.setScreens(
          this.score[0],
          this.score[1],
          this.mode === `match`
            ? `${this.overtime ? `+` : ``}${e}:${String(t === 60 ? 0 : t).padStart(2, `0`)}`
            : `FREE`,
        ),
        this.settings.gameplay.debugOverlay && this.player)
      ) {
        let e = this.player;
        this.hud.setDebug(
          `FPS ${this.fps.toFixed(0)}\nspeed ${e.vel.length().toFixed(0)}  fwd ${e.forwardSpeed.toFixed(0)}\nboost ${e.boost.toFixed(1)}  ground ${e.isOnGround} wheels ${e.numWheelsInContact}\njumped ${e.hasJumped} flipped ${e.hasFlipped} dbl ${e.hasDoubleJumped}\nsupersonic ${e.isSupersonic}  handbrake ${e.handbrakeVal.toFixed(2)}\nball ${this.world.ball.vel.length().toFixed(0)} uu/s  z ${this.world.ball.pos.z.toFixed(0)}\nin: thr ${e.controls.throttle.toFixed(2)} str ${e.controls.steer.toFixed(2)} p ${e.controls.pitch.toFixed(2)} y ${e.controls.yaw.toFixed(2)} r ${e.controls.roll.toFixed(2)}`,
        );
      } else this.hud.setDebug(null);
    }
    ((this.excitement += (0.3 - this.excitement) * (1 - Math.exp(-0.5 * t))),
      this.audio.setCrowd(Math.min(1.4, this.excitement)),
      this.audio.setListener(i.camera),
      i.update(
        t,
        this.world.pads.map((e) => e.cooldown <= 0),
        Math.min(1, this.excitement - 0.3),
      ),
      this.hud.update(t),
      i.render());
  }
  scoreRows() {
    return this.world.cars.map((e) => {
      let t = this.stats.get(e.id) ?? emptyStats();
      return {
        name: e.name,
        team: e.team,
        ...t,
        isPlayer: e === this.player,
      };
    });
  }
}
