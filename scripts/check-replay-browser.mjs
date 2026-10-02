import assert from "node:assert/strict";
import { chromium } from "playwright-core";
import { mkdir, readFile } from "node:fs/promises";
import { preview } from "vite";
import path from "node:path";
import { readScenarioFile } from "../src/replay-files.js";

await mkdir("artifacts/replays", { recursive: true });
const server = await preview({ preview: { host: "127.0.0.1", port: 0 } });
const browser = await chromium.launch({
  channel: "chrome",
  headless: true,
  args: ["--no-sandbox"],
});
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
page.on("console", (m) => {
  if (m.type() === "error") errors.push(m.text());
});
await page.addInitScript(() => {
  window.__replayFrames = 0;
  const raf = window.requestAnimationFrame;
  window.requestAnimationFrame = (callback) =>
    raf.call(window, (time) => {
      window.__replayFrames++;
      callback(time);
    });
  Object.defineProperty(Object.prototype, "recordingIdentity", {
    configurable: true,
    set(value) {
      Object.defineProperty(this, "recordingIdentity", {
        value,
        writable: true,
        configurable: true,
      });
      window.__presentationGame = this;
      delete Object.prototype.recordingIdentity;
    },
  });
  Object.defineProperty(Object.prototype, "openScenarioEditor", {
    configurable: true,
    set(value) {
      Object.defineProperty(this, "openScenarioEditor", {
        value,
        writable: true,
        configurable: true,
      });
      window.__presentationGame = this;
      delete Object.prototype.openScenarioEditor;
    },
  });
  const instantiate = WebAssembly.instantiate;
  WebAssembly.instantiate = async (...args) => {
    const result = await instantiate(...args),
      raw = result.instance?.exports;
    if (!raw?.sim_create) return result;
    const test = (window.__recordingTest = { raw, handle: 0 });
    return {
      ...result,
      instance: {
        exports: {
          ...raw,
          sim_create(seed) {
            const handle = raw.sim_create(seed);
            test.handle ||= handle;
            return handle;
          },
          sim_start(...args) {
            const result = raw.sim_start(...args);
            if (result) test.handle = args[0];
            return result;
          },
          sim_record_load(handle) {
            const result = raw.sim_record_load(handle);
            if (result > 0) test.handle = handle;
            return result;
          },
          sim_scenario(...args) {
            const result = raw.sim_scenario(...args);
            if (result) test.handle = args[0];
            return result;
          },
        },
      },
    };
  };
});
const menu = (text) => page.locator(".menu-item").filter({ hasText: text });
const range = page.getByRole("slider", { name: "Replay position" });
async function press(key) {
  const before = await page.evaluate(() => window.__replayFrames);
  await page.keyboard.down(key);
  await page.waitForFunction((n) => window.__replayFrames >= n + 2, before);
  await page.keyboard.up(key);
  await page.waitForFunction((n) => window.__replayFrames >= n + 4, before);
}
async function seek(tick) {
  await range.evaluate((el, tick) => {
    el.value = String(tick);
    el.dispatchEvent(new Event("input", { bubbles: true }));
  }, tick);
  await page.waitForFunction(
    (tick) =>
      Number(document.querySelector(".watch-range")?.value) === tick &&
      !document.querySelector(".watch-timeline")?.classList.contains("busy"),
    tick,
  );
}
try {
  await page.goto(`${server.resolvedUrls.local[0]}?mute`, {
    waitUntil: "networkidle",
  });
  assert.equal(await page.locator(".replay-tools").count(), 0);
  assert.equal(
    await page
      .getByRole("button", { name: "Game history", exact: true })
      .count(),
    0,
  );
  await menu("HIT THE FIELD").click();
  await menu("Mode").locator(".mi-value").click();
  await menu("Mode").locator(".mi-value").click();
  await menu("START MATCH").click();
  await page.waitForFunction(() => {
    const t = window.__recordingTest;
    return (
      new Float64Array(t.raw.memory.buffer, t.raw.sim_state(t.handle), 1)[0] >
      370
    );
  });
  await press("Escape");
  await menu("RESUME").waitFor();
  // Add resolved simulation ticks while the presentation stays paused.
  await page.evaluate(() => {
    const t = window.__recordingTest;
    for (let i = 0; i < 1800; i++)
      t.raw.sim_tick(
        t.handle,
        1,
        0.2,
        -0.3,
        0.1,
        0,
        i % 180 > 150,
        i % 400 < 200,
        0,
        1,
      );
  });
  // A new match gets another history record. It does not replace the first match.
  await page.evaluate(() => {
    const game = window.__presentationGame;
    game.startMatch({ ...game.config });
    const t = window.__recordingTest;
    for (let i = 0; i < 1800; i++)
      t.raw.sim_tick(t.handle, 1, 0.1, 0.2, 0, 0, 0, 0, 0, 1);
  });
  await page.waitForTimeout(1500);
  const stored = await page.evaluate(
    () =>
      new Promise((resolve) => {
        const open = indexedDB.open("soccar-replays", 3);
        open.onsuccess = () => {
          const db = open.result;
          const tx = db.transaction(["replays", "history"]);
          const replays = tx.objectStore("replays").getAll();
          const history = tx.objectStore("history").getAll();
          tx.oncomplete = () => {
            resolve({
              replays: replays.result.filter(
                (value) => value?.text && value?.id,
              ).length,
              history: history.result.filter((value) => value?.id).length,
            });
            db.close();
          };
        };
      }),
  );
  assert.deepEqual(stored, { replays: 2, history: 2 });
  await page.goto(`${server.resolvedUrls.local[0]}arena.html#/replays`, {
    waitUntil: "networkidle",
  });
  await page.waitForFunction(() =>
    document
      .querySelector(".summary-line")
      ?.textContent.includes("2 recorded games"),
  );
  let rows = page.locator("table.replays tbody tr");
  assert.equal(await rows.count(), 2);
  const replayPath = path.resolve(
    "artifacts/replays/player.soccar-replay.json",
  );
  let pending = page.waitForEvent("download");
  await rows
    .nth(1)
    .getByRole("button", { name: "Download", exact: true })
    .click();
  await (await pending).saveAs(replayPath);
  const saved = JSON.parse(await readFile(replayPath, "utf8"));
  assert.ok(saved.frames.length > 2000);
  assert.equal(saved.initial.world.cars.length, 6);
  await rows.nth(1).getByRole("link", { name: "Watch", exact: true }).click();
  await range.waitFor();
  await page.waitForFunction(
    () => !document.querySelector(".watch-range")?.disabled,
  );
  await page.getByRole("button", { name: "Pause replay", exact: true }).click();
  await seek(400);
  await page
    .getByRole("combobox", { name: "Follow car", exact: true })
    .selectOption({ value: "3" });
  assert.equal(
    await page.evaluate(() => window.__presentationGame.watch.follow),
    3,
  );
  await page.evaluate(() => document.activeElement?.blur());
  await page.keyboard.press("c");
  const dialog = page.getByRole("dialog");
  await dialog.waitFor();
  const car = page.getByLabel("Which car should the brain control?");
  assert.equal(await car.inputValue(), "3");
  await page
    .getByLabel("Candidate objective (the agent verifies it)")
    .selectOption("defend");
  await page.getByLabel("Candidate timeout (the agent verifies it)").fill("2");
  await page.getByLabel("Candidate name").fill("browser-save");
  await page
    .getByLabel("Describe what makes this moment useful")
    .fill("Keep the ball out of this car's goal.");
  await page.screenshot({ path: "artifacts/replays/setpiece-editor.png" });
  pending = page.waitForEvent("download");
  await page
    .getByRole("button", { name: "Download candidate", exact: true })
    .click();
  const piecePath = path.resolve(
    "artifacts/replays/browser-save.soccar-setpiece.txt",
  );
  await (await pending).saveAs(piecePath);
  const text = await readFile(piecePath, "utf8");
  assert.match(text, /^\[browser-save\]/);
  assert.match(text, /^# This is an approximate anchor\./m);
  assert.match(text, /^# Candidate replay: game:/m);
  assert.match(text, /^# Candidate anchor: playback tick 400 /m);
  const clip = JSON.parse(/^clip\s*=\s*(.*)$/m.exec(text)[1]);
  assert.equal(clip.car, 3);
  assert.equal(clip.source_team, 1);
  assert.equal(clip.source_tick, 400);
  assert.equal(clip.state.world.cars[3].team, 0);
  assert.equal(clip.others, null);
  await page.getByRole("button", { name: "Preview", exact: true }).click();
  await dialog.waitFor({ state: "detached" });
  assert.ok(
    await page.evaluate(() => {
      const game = window.__presentationGame;
      const visual = game.renderer.arena.group.children.at(-1).children;
      return game.world.pads.every(
        (p, i) =>
          visual[i].position.x === p.pos.x && visual[i].position.y === p.pos.y,
      );
    }),
    "Pad visuals follow the exact rotated physics layout",
  );
  await page.waitForFunction(() =>
    document.querySelector(".hud-banner")?.textContent.match(/PASSED|FAILED/),
  );
  await page.keyboard.press("b");
  await page.waitForFunction(
    () =>
      Number(document.querySelector(".watch-range")?.value) === 400 &&
      !document.querySelector(".watch-timeline")?.classList.contains("busy"),
  );
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForFunction(
    () => !document.querySelector(".watch-range")?.disabled,
  );
  assert.equal(await page.locator(".replay-tools").count(), 0);
  await page.goto(`${server.resolvedUrls.local[0]}arena.html#/replays`, {
    waitUntil: "networkidle",
  });
  rows = page.locator("table.replays tbody tr");
  assert.equal(await rows.count(), 2);
  const picker = page.getByLabel("Open replay or set piece file");
  await picker.setInputFiles(replayPath);
  await page.getByRole("status").filter({ hasText: "Replay added" }).waitFor();
  assert.equal(await rows.count(), 3);
  await picker.setInputFiles({
    name: "bad.json",
    mimeType: "application/json",
    buffer: Buffer.from("{}"),
  });
  await page
    .getByRole("status")
    .filter({ hasText: "Invalid replay file" })
    .waitFor();
  await picker.setInputFiles(piecePath);
  await range.waitFor();
  await page.route("**/arena/setpieces.json", (route) =>
    route.fulfill({
      json: {
        scenarios: [
          { id: "user-defend/browser-save", text: readScenarioFile(text).text },
        ],
        brains: [
          { name: "alphabravo", text: "module = alphabravo\nshotzone = 5000" },
        ],
      },
    }),
  );
  await page.goto(
    `${server.resolvedUrls.local[0]}?setpiece=user-defend%2Fbrowser-save&brain=alphabravo&mute`,
    { waitUntil: "networkidle" },
  );
  await range.waitFor();
  await page.waitForFunction(
    () => !document.querySelector(".watch-range")?.disabled,
  );
  assert.ok(
    page.url().length < 200,
    "Exact-state watch links do not place recordings in URLs",
  );
  const migrationContext = await browser.newContext();
  const migration = await migrationContext.newPage();
  const setupUrl = `${server.resolvedUrls.local[0]}storage-setup`;
  await migration.route(setupUrl, (route) =>
    route.fulfill({ contentType: "text/html", body: "<!doctype html>" }),
  );
  await migration.goto(setupUrl);
  await migration.evaluate(
    () =>
      new Promise((resolve, reject) => {
        const open = indexedDB.open("soccar-replays", 1);
        open.onupgradeneeded = () => open.result.createObjectStore("replays");
        open.onsuccess = () => {
          const db = open.result;
          const tx = db.transaction("replays", "readwrite");
          tx.objectStore("replays").put(
            { text: "{}", name: "legacy.soccar-replay.json" },
            "latest",
          );
          tx.oncomplete = () => {
            db.close();
            resolve();
          };
          tx.onerror = () => reject(tx.error);
        };
        open.onerror = () => reject(open.error);
      }),
  );
  await migration.unroute(setupUrl);
  await migration.goto(`${server.resolvedUrls.local[0]}arena.html#/replays`, {
    waitUntil: "networkidle",
  });
  const migratedRows = migration.locator("table.replays tbody tr");
  await migratedRows.first().waitFor();
  assert.equal(await migratedRows.count(), 1);
  assert.match(await migratedRows.first().innerText(), /1v1/);
  await migrationContext.close();
  assert.deepEqual(errors, []);
  console.log(
    "Replay browser checks passed: Arena history, imports, reload, seek, exact export, preview, return, and migration",
  );
} catch (error) {
  console.error(
    await page.evaluate(() => ({
      follow: window.__presentationGame?.watch?.follow,
      followed: window.__presentationGame?.followed()?.id,
      phase: window.__presentationGame?.phase,
      selects: [...document.querySelectorAll("dialog select")].map((s) => ({
        value: s.value,
        text: s.textContent,
      })),
    })),
  );
  await page.screenshot({ path: "artifacts/replays/failure.png" });
  throw error;
} finally {
  await browser.close();
  await server.close();
}
