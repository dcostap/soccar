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
    const pointer = t.exports.sim_state(t.handle);
    return new Float64Array(t.exports.memory.buffer, pointer, 24)[23] === 1;
  });
  const before = await state();
  await page.keyboard.down("w");
  await page.waitForFunction((tick) => {
    const t = window.__simulationTest;
    const pointer = t.exports.sim_state(t.handle);
    return (
      new Float64Array(t.exports.memory.buffer, pointer, 1)[0] >= tick + 120
    );
  }, before.tick);
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
  await page.waitForFunction((tick) => {
    const t = window.__simulationTest;
    const pointer = t.exports.sim_state(t.handle);
    return (
      new Float64Array(t.exports.memory.buffer, pointer, 1)[0] >= tick + 120
    );
  }, padBefore.tick);
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
  await page.waitForFunction(() => {
    const t = window.__simulationTest;
    const pointer = t.exports.sim_state(t.handle);
    return new Float64Array(t.exports.memory.buffer, pointer, 1)[0] > 361;
  });
  assert.equal((await state()).cars, 6);
  assert.ok((await state()).tick > 361);
  checks.push("playable 3v3 match and countdown");
  await page.screenshot({ path: "artifacts/browser/match.png" });
  assert.equal(await page.locator(".watch-timeline").count(), 0);

  const watchUrl = new URL(page.url());
  watchUrl.search = new URLSearchParams({
    mute: "",
    watch: "test",
    seed: "91",
    size: "3",
    duration: "300",
    names: "allstar,allstar",
    expect: "4-5",
  });
  await page.goto(watchUrl.href);
  await page.locator(".watch-timeline").waitFor();
  await page.keyboard.press("p");
  await page
    .getByRole("button", { name: "Play replay", exact: true })
    .waitFor();
  const watchPaused = await state();
  const framesBeforeIndex = await page.evaluate(() => window.__testFrames);
  const range = page.getByRole("slider", { name: "Replay position" });
  await page.waitForFunction(
    () => !document.querySelector(".watch-range")?.disabled,
    null,
    { timeout: 120000 },
  );
  assert.equal(
    (await state()).tick,
    watchPaused.tick,
    "Preparation leaves the paused match unchanged",
  );
  assert.ok(
    await page.evaluate(
      (before) => window.__testFrames > before + 10,
      framesBeforeIndex,
    ),
    "Preparation yields to rendering",
  );
  assert.equal(await page.locator(".watch-marker.goal").count(), 9);
  assert.equal(await page.locator(".watch-marker.overtime").count(), 1);
  assert.ok(await range.evaluate((e) => Number(e.max) > 300 * 120));
  checks.push("watch preparation, goal markers, and overtime duration");

  const idle = async () => page.locator(".watch-timeline:not(.busy)").waitFor();
  const seekInput = async (tick) => {
    await range.evaluate((input, value) => {
      input.value = String(value);
      input.dispatchEvent(new Event("input", { bubbles: true }));
    }, tick);
    await page.waitForFunction((tick) => {
      const input = document.querySelector(".watch-range");
      return (
        Number(input.value) === tick &&
        !document.querySelector(".watch-timeline").classList.contains("busy")
      );
    }, tick);
  };
  const firstGoal = page.locator(".watch-marker.goal").first();
  const goalTick = Number(await firstGoal.getAttribute("data-tick"));
  await firstGoal.click();
  await page.waitForFunction(
    (tick) => Number(document.querySelector(".watch-range").value) === tick,
    Math.max(0, goalTick - 360),
  );
  await idle();
  await page
    .getByRole("button", { name: "Play replay", exact: true })
    .waitFor();
  assert.match(await firstGoal.getAttribute("title"), /Goal.*Car.*Match clock/);
  const showSaves = page.getByRole("button", { name: "Show saves" });
  assert.equal(await showSaves.getAttribute("aria-pressed"), "true");
  assert.ok((await page.locator(".watch-marker.save:visible").count()) > 0);
  await showSaves.click();
  assert.equal(await showSaves.getAttribute("aria-pressed"), "false");
  assert.equal(await page.locator(".watch-marker.save:visible").count(), 0);
  await showSaves.click();
  await page.getByRole("button", { name: "Show demos" }).click();
  assert.ok((await page.locator(".watch-marker.save:visible").count()) > 0);
  assert.ok((await page.locator(".watch-marker.demo:visible").count()) > 0);
  assert.ok((await page.locator(".watch-timeline").boundingBox()).height <= 50);
  assert.equal(await page.locator(".hud-tip:visible").count(), 0);
  await page
    .getByRole("combobox", { name: "Follow car", exact: true })
    .selectOption({ value: "3" });
  assert.equal(
    await page
      .getByRole("combobox", { name: "Follow car", exact: true })
      .inputValue(),
    "3",
  );
  await page.screenshot({ path: "artifacts/browser/watch.png" });
  await page
    .getByRole("button", { name: "Next highlight", exact: true })
    .click();
  await idle();
  await page
    .getByRole("button", { name: "Previous highlight", exact: true })
    .click();
  await idle();
  checks.push(
    "clickable highlights, default save markers, and optional demolition markers",
  );

  await seekInput(0);
  assert.equal((await state()).tick, 0);
  await range.focus();
  await range.press("End");
  await page
    .getByRole("button", { name: "Restart replay", exact: true })
    .waitFor();
  await idle();
  assert.equal(await page.locator(".hud-scoreboard:visible").count(), 1);
  await page.waitForTimeout(2700);
  assert.equal(
    await page.locator(".menu-root.visible").count(),
    0,
    "Watch completion does not cover the timeline with a menu",
  );
  await press("Escape");
  await menu("RESUME").waitFor({ state: "visible" });
  await menu("RESUME").click();
  await range.press("Home");
  await page.waitForFunction(
    () => Number(document.querySelector(".watch-range").value) === 0,
  );
  await idle();
  assert.equal(await page.locator(".hud-scoreboard:visible").count(), 0);
  assert.equal(
    await page.locator(".hud-banner.show").count(),
    0,
    "Seeking clears the old result banner",
  );
  await page.getByRole("combobox", { name: "Replay speed" }).selectOption("2");
  await page.getByRole("button", { name: "Play replay", exact: true }).click();
  await page.waitForFunction(
    () => Number(document.querySelector(".watch-range").value) > 30,
  );
  await page.getByRole("button", { name: "Pause replay", exact: true }).click();
  await page.evaluate(() => document.activeElement.blur());
  const beforeKeySeek = Number(await range.inputValue());
  const maxKeySeek = Number(await range.getAttribute("max"));
  const forwardKeySeek = Math.min(maxKeySeek, beforeKeySeek + 240);
  await page.keyboard.press("ArrowRight");
  await page.waitForFunction(
    (target) =>
      Number(document.querySelector(".watch-range")?.value) === target,
    forwardKeySeek,
  );
  const afterKeySeek = Number(await range.inputValue());
  assert.equal(
    afterKeySeek,
    forwardKeySeek,
    "ArrowRight seeks forward by two seconds without timeline focus",
  );
  await page.keyboard.press("ArrowLeft");
  await page.waitForFunction(
    (target) =>
      Number(document.querySelector(".watch-range")?.value) === target,
    beforeKeySeek,
  );
  assert.equal(
    Number(await range.inputValue()),
    beforeKeySeek,
    "ArrowLeft seeks backward by two seconds without timeline focus",
  );
  await page.keyboard.press("Space");
  await page
    .getByRole("button", { name: "Pause replay", exact: true })
    .waitFor();
  await page.keyboard.press("Space");
  await page
    .getByRole("button", { name: "Play replay", exact: true })
    .waitFor();
  const beforeDrag = await range.evaluate((e) => Number(e.value));
  const bounds = await range.boundingBox();
  await page.mouse.move(
    bounds.x + bounds.width * 0.25,
    bounds.y + bounds.height / 2,
  );
  await page.mouse.down();
  await page.mouse.move(
    bounds.x + bounds.width * 0.65,
    bounds.y + bounds.height / 2,
    { steps: 4 },
  );
  await page.mouse.up();
  await idle();
  assert.ok(
    await range.evaluate((e, before) => Number(e.value) > before, beforeDrag),
  );
  await page
    .getByRole("button", { name: "Play replay", exact: true })
    .waitFor();
  await page.getByRole("button", { name: "Play replay", exact: true }).click();
  await page.mouse.move(
    bounds.x + bounds.width * 0.3,
    bounds.y + bounds.height / 2,
  );
  await page.mouse.down();
  await page
    .getByRole("button", { name: "Play replay", exact: true })
    .waitFor();
  await page.mouse.move(
    bounds.x + bounds.width * 0.4,
    bounds.y + bounds.height / 2,
  );
  await page.mouse.up();
  await page
    .getByRole("button", { name: "Pause replay", exact: true })
    .waitFor();
  await idle();
  await page.getByRole("button", { name: "Pause replay", exact: true }).click();
  checks.push(
    "range keyboard seeking, pointer scrubbing, pause, speed, and end rewind",
  );

  await range.press("End");
  await page
    .getByRole("button", { name: "Restart replay", exact: true })
    .waitFor();
  await idle();
  await press("Escape");
  await menu("RESUME").waitFor({ state: "visible" });
  assert.ok(await page.locator(".watch-timeline").evaluate((e) => e.inert));
  await menu("EXIT TO MAIN MENU").click();
  await menu("FREE PLAY").click();
  assert.equal(await page.locator(".watch-timeline").count(), 0);
  assert.equal(await page.locator(".hud.watching").count(), 0);
  assert.equal(await page.locator(".hud-banner.show").count(), 0);
  assert.equal(await page.locator(".hud-scoreboard:visible").count(), 0);
  checks.push("watch controls stop when leaving the replay");
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
