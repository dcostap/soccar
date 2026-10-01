import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { mkdir, writeFile } from "node:fs/promises";
import { loadWorldReference, worldSnapshot } from "./world-reference.mjs";
import { worldCases } from "./world-cases.mjs";
import { createBall } from "./reference.mjs";
const root = fileURLToPath(new URL("../../", import.meta.url));
const api = await loadWorldReference();
const cases = worldCases();
const debug = process.argv.includes("--debug");
const build = spawnSync(
  "cargo",
  [
    "build",
    "--locked",
    "--manifest-path",
    "simulation/Cargo.toml",
    "--bin",
    "world_trace",
    ...(debug ? [] : ["--release"]),
  ],
  { cwd: root, encoding: "utf8" },
);
if (build.status !== 0) throw new Error(build.stderr);
process.stderr.write(build.stderr);
const chunks = [];
const uint = (x) => {
  const b = Buffer.alloc(4);
  b.writeUInt32LE(x);
  chunks.push(b);
};
const num = (x) => {
  const b = Buffer.alloc(8);
  b.writeDoubleLE(Number(x));
  chunks.push(b);
};
chunks.push(Buffer.from("SCW1"));
uint(cases.length);
for (const c of cases) {
  uint(c.ticks);
  uint(c.cars.length);
  c.ball.forEach(num);
  for (const car of c.cars) {
    [
      car.team,
      ...car.pos,
      car.yaw,
      car.boost,
      ...car.vel,
      ...car.ang,
      car.pitch,
      car.roll,
      car.frozen,
      car.demoed,
      car.respawn,
    ].forEach(num);
  }
  for (let t = 1; t <= c.ticks; t++) {
    for (const control of c.controls(t)) {
      [
        "throttle",
        "steer",
        "pitch",
        "yaw",
        "roll",
        "jump",
        "boost",
        "handbrake",
      ].forEach((k) => num(control[k]));
      num(control.dodgeMag ?? -1);
    }
  }
}
const input = Buffer.concat(chunks);
const binary = fileURLToPath(
  new URL(
    `../../simulation/target/${debug ? "debug" : "release"}/world_trace${process.platform === "win32" ? ".exe" : ""}`,
    import.meta.url,
  ),
);
const result = spawnSync(binary, [], {
  input,
  maxBuffer: 256 * 1024 * 1024,
  cwd: root,
});
if (result.status !== 0) throw new Error(result.stderr.toString());
const actual = result.stdout;
if (
  actual.toString("ascii", 0, 4) !== "SCR1" ||
  actual.readUInt32LE(4) !== cases.length
)
  throw new Error("Trace header");
let offset = 8,
  states = 0,
  fields = 0,
  difference = null;
outer: for (const c of cases) {
  const world = new api.World();
  world.ball = createBall(api, c.ball);
  for (const car of c.cars) {
    const s = world.addCar(car.team, "Test");
    s.spawn(car.pos[0], car.pos[1], car.yaw, car.boost);
    s.pos.z = car.pos[2];
    s.vel.set(...car.vel);
    s.angVel.set(...car.ang);
    if (car.pitch !== 0 || car.roll !== 0) {
      s.rot.setFromEuler(car.yaw, car.pitch, car.roll);
      s.updateAxes();
    }
    s.frozen = car.frozen;
    s.isDemoed = car.demoed;
    s.demoRespawnTimer = car.respawn;
  }
  for (let tick = 0; tick <= c.ticks; tick++) {
    if (tick) {
      const controls = c.controls(tick);
      world.cars.forEach((car, i) => {
        car.controls = controls[i];
      });
      world.step();
    }
    const snapshot = worldSnapshot(api, world);
    const count = actual.readUInt32LE(offset);
    offset += 4;
    if (count !== snapshot.values.length) {
      difference = {
        case: c.name,
        tick,
        field: "state.length",
        js: snapshot.values.length,
        rust: count,
      };
      break outer;
    }
    const expected = Buffer.alloc(count * 8);
    snapshot.values.forEach((v, i) => expected.writeDoubleLE(v, i * 8));
    for (let i = 0; i < count; i++) {
      const a = expected.readBigUInt64LE(i * 8),
        b = actual.readBigUInt64LE(offset + i * 8);
      if (a !== b) {
        difference = {
          case: c.name,
          tick,
          field: snapshot.fields[i],
          js: snapshot.values[i],
          rust: actual.readDoubleLE(offset + i * 8),
          jsBits: a.toString(16),
          rustBits: b.toString(16),
        };
        break outer;
      }
    }
    offset += count * 8;
    states++;
    fields += count;
  }
}
if (!difference && offset !== actual.length) throw new Error("Trailing trace");
const report = {
  reference: api.reference,
  status: difference ? "FAIL" : "PASS",
  cases: cases.length,
  states,
  fields,
  mode: debug ? "debug" : "release",
  difference,
};
await mkdir(new URL("../../artifacts/world-port/", import.meta.url), {
  recursive: true,
});
await writeFile(
  new URL("../../artifacts/world-port/report.json", import.meta.url),
  JSON.stringify(report, null, 2),
);
console.log(JSON.stringify(report, null, 2));
if (difference) process.exitCode = 1;
