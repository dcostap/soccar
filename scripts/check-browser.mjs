import assert from "node:assert/strict";
import { chromium } from "playwright-core";
import { mkdir, writeFile } from "node:fs/promises";
import { preview } from "vite";

await mkdir("artifacts/browser", { recursive: true });
const browser = await chromium.launch({
  channel: "chrome",
  headless: true,
  args: ["--no-sandbox"],
});
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
const errors = [];
const checks = [];
let server;
page.on("pageerror", (e) => errors.push(e.message));
page.on("console", (m) => {
  if (m.type() === "error") errors.push(m.text());
});
page.on("requestfailed", (r) =>
  errors.push(`${r.url()}: ${r.failure()?.errorText}`),
);
await page.addInitScript(() => {
  window.__testFrames = 0;
  const frame = window.requestAnimationFrame;
  window.requestAnimationFrame = (callback) =>
    frame.call(window, (time) => {
      window.__testFrames++;
      callback(time);
    });
  // Observe the real game instance without adding a production test API.
  const original = WebAssembly.instantiate;
  WebAssembly.instantiate = async (...args) => {
    const result = await original(...args);
    const exports = result.instance?.exports;
    if (!exports?.sim_create) return result;
    const test = (window.__simulationTest = { exports, handle: 0, ticks: 0 });
    return {
      ...result,
      instance: {
        exports: {
          ...exports,
          sim_create(seed) {
            test.handle = exports.sim_create(seed);
            return test.handle;
          },
          sim_tick(...args) {
            test.ticks++;
            return exports.sim_tick(...args);
          },
        },
      },
    };
  };
  window.__testPad = null;
  Object.defineProperty(navigator, "getGamepads", {
    value: () => [window.__testPad],
  });
});
const state = () =>
  page.evaluate(() => {
    const t = window.__simulationTest;
    const pointer = t.exports.sim_state(t.handle);
    const data = new Float64Array(
      t.exports.memory.buffer,
      pointer,
      t.exports.sim_state_len(t.handle),
    );
    return {
      tick: data[0],
      cars: data[23],
      pos: [...data.slice(26, 29)],
      vel: [...data.slice(29, 32)],
    };
  });
const menu = (text) => page.locator(".menu-item").filter({ hasText: text });
async function press(key) {
  const before = await page.evaluate(() => window.__testFrames);
  await page.keyboard.down(key);
  await page.waitForFunction(
    (before) => window.__testFrames >= before + 2,
    before,
  );
  await page.keyboard.up(key);
  await page.waitForFunction(
    (before) => window.__testFrames >= before + 4,
    before,
  );
}
try {
  if (process.argv.includes("--preview")) {
    const base = process.env.SOCCAR_TEST_BASE ?? "/";
    assert.ok(
      base.startsWith("/") && base.endsWith("/"),
      "Use an absolute URL base path",
    );
    server = await preview({
      base,
      preview: { host: "127.0.0.1", port: 0 },
    });
  }
  await page.goto(
    process.env.SOCCAR_TEST_URL ??
      (server
        ? `${server.resolvedUrls.local[0]}?mute`
        : "http://127.0.0.1:5173/?mute"),
    { waitUntil: "networkidle" },
  );
  await page.waitForFunction(() => window.__simulationTest?.handle > 0);
  assert.equal((await state()).cars, 2);
  checks.push("menu renders and runs Rust bots");
  await page.screenshot({ path: "artifacts/browser/menu.png" });

  await menu("FREE PLAY").click();
  await page.waitForFunction(() => {
    const t = window.__simulationTest;
    return (
      new Float64Array(
        t.exports.memory.buffer,
        t.exports.sim_state(t.handle),
        24,
      )[23] === 1
    );
  });
  const before = await state();
  await page.keyboard.down("w");
  await page.waitForTimeout(1200);
  await page.keyboard.up("w");
  const moved = await state();
  assert.ok(
    moved.pos[1] > before.pos[1] + 50,
    "Keyboard throttle moves the Rust car",
  );
  checks.push("keyboard freeplay");

  await press("Escape");
  await menu("RESUME").waitFor({ state: "visible" });
  const paused = await state();
  await page.waitForTimeout(400);
  assert.equal((await state()).tick, paused.tick);
  await menu("RESUME").click();
  await press("r");
  await page.waitForTimeout(150);
  assert.ok(Math.abs((await state()).pos[1] + 4608) < 2);
  await press("1");
  await page.waitForTimeout(100);
  await press("2");
  await page.waitForTimeout(100);
  checks.push("pause, resume, reset, and ball placement");

  await page.evaluate(() => {
    window.__testPad = {
      connected: true,
      mapping: "standard",
      id: "Test controller",
      index: 0,
      axes: [0, 0, 0, 0],
      buttons: Array.from({ length: 18 }, () => ({ pressed: false, value: 0 })),
    };
    const event = new Event("gamepadconnected");
    Object.defineProperty(event, "gamepad", { value: window.__testPad });
    window.dispatchEvent(event);
    window.__testPad.buttons[7] = { pressed: true, value: 1 };
  });
  const padBefore = await state();
  await page.waitForTimeout(1000);
  assert.ok(
    (await state()).pos[1] > padBefore.pos[1] + 20,
    "Controller throttle moves the Rust car",
  );
  await page.evaluate(() => {
    window.__testPad = null;
  });
  checks.push("controller freeplay");
  await page.screenshot({ path: "artifacts/browser/freeplay.png" });

  await press("Escape");
  await menu("EXIT TO MAIN MENU").click();
  await menu("HIT THE FIELD").click();
  await page.locator(".menu-title").filter({ hasText: "EXHIBITION" }).waitFor();
  await menu("Mode").locator(".mi-value").click();
  await menu("Mode").locator(".mi-value").click();
  assert.ok((await menu("Mode").textContent()).includes("3v3"));
  await menu("START MATCH").click();
  await page.waitForTimeout(4500);
  assert.equal((await state()).cars, 6);
  assert.ok((await state()).tick > 361);
  checks.push("playable 3v3 match and countdown");
  await page.screenshot({ path: "artifacts/browser/match.png" });
  assert.deepEqual(errors, []);
  console.log(
    JSON.stringify(
      { status: "PASS", url: page.url(), checks, errors },
      null,
      2,
    ),
  );
} catch (error) {
  await page
    .screenshot({ path: "artifacts/browser/failure.png" })
    .catch(() => {});
  errors.push(error.stack ?? String(error));
  console.log(JSON.stringify({ status: "FAIL", checks, errors }, null, 2));
  process.exitCode = 1;
} finally {
  await writeFile(
    "artifacts/browser/report.json",
    JSON.stringify({ checks, errors }, null, 2),
  );
  await browser.close();
  if (server) await new Promise((resolve) => server.httpServer.close(resolve));
}
