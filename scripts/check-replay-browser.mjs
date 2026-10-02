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
  const replayPath = path.resolve(
    "artifacts/replays/player.soccar-replay.json",
  );
  let pending = page.waitForEvent("download");
  await page.getByRole("button", { name: "Save replay", exact: true }).click();
  const replayDownload = await pending;
  await replayDownload.saveAs(replayPath);
  const saved = JSON.parse(await readFile(replayPath, "utf8"));
  assert.ok(saved.frames.length > 2000);
  assert.equal(saved.initial.world.cars.length, 6);
  // A new match gets another history record. It does not replace the first match.
  await page.evaluate(() => {
    const game = window.__presentationGame;
    game.startMatch({ ...game.config });
    const t = window.__recordingTest;
    for (let i = 0; i < 1800; i++)
      t.raw.sim_tick(t.handle, 1, 0.1, 0.2, 0, 0, 0, 0, 0, 1);
  });
  await page.waitForFunction(
    () =>
      new Promise((resolve) => {
        const open = indexedDB.open("soccar-replays", 3);
        open.onsuccess = () => {
          const db = open.result;
          const all = db.transaction("replays").objectStore("replays").getAll();
          all.onsuccess = () => {
            resolve(
              all.result.filter((value) => value?.text && value?.id).length ===
                2,
            );
            db.close();
          };
          all.onerror = () => resolve(false);
        };
        open.onerror = () => resolve(false);
      }),
  );
  await page.getByRole("button", { name: "Game history", exact: true }).click();
  let library = page.getByRole("dialog", { name: "Game history" });
  await library.waitFor();
  assert.equal(await library.locator(".replay-library-item").count(), 2);
  await library
    .locator(".replay-library-item")
    .nth(1)
    .getByRole("button", { name: "Watch", exact: true })
    .click();
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
  await page
    .getByRole("button", { name: "Create set piece", exact: true })
    .click();
  const dialog = page.getByRole("dialog");
  await dialog.waitFor();
  const car = page.getByLabel("Which car should the brain control?");
  assert.equal(await car.inputValue(), "3");
  await page.getByLabel("Objective").selectOption("defend");
  await page.getByLabel("Timeout in seconds").fill("2");
  await page.getByLabel("Short test name").fill("browser-save");
  await page
    .getByLabel("Description")
    .fill("Keep the ball out of this car's goal.");
  await page.screenshot({ path: "artifacts/replays/setpiece-editor.png" });
  pending = page.waitForEvent("download");
  await page
    .getByRole("button", { name: "Download set piece", exact: true })
    .click();
  const piecePath = path.resolve(
    "artifacts/replays/browser-save.soccar-setpiece.txt",
  );
  await (await pending).saveAs(piecePath);
  const text = await readFile(piecePath, "utf8");
  assert.match(text, /^\[browser-save\]/);
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
  await page
    .getByRole("button", { name: "Back to moment", exact: true })
    .waitFor();
  await page.waitForFunction(() =>
    document.querySelector(".hud-banner")?.textContent.match(/PASSED|FAILED/),
  );
  await page
    .getByRole("button", { name: "Back to moment", exact: true })
    .click();
  await page.waitForFunction(
    () =>
      Number(document.querySelector(".watch-range")?.value) === 400 &&
      !document.querySelector(".watch-timeline")?.classList.contains("busy"),
  );
  await page.reload({ waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Game history", exact: true }).click();
  library = page.getByRole("dialog", { name: "Game history" });
  await library.waitFor();
  assert.equal(await library.locator(".replay-library-item").count(), 2);
  await library.getByRole("button", { name: "Close", exact: true }).click();
  const last = page.getByRole("button", {
    name: "Watch last game",
    exact: true,
  });
  await page.waitForFunction(() =>
    [...document.querySelectorAll(".replay-tools button")].some(
      (b) => b.textContent === "Watch last game" && !b.disabled,
    ),
  );
  await last.click();
  await page.waitForFunction(
    () => !document.querySelector(".watch-range")?.disabled,
  );
  await page.locator("input[type=file]").setInputFiles(replayPath);
  await page.waitForFunction(() =>
    [...document.querySelectorAll(".replay-tools button")].some(
      (b) => b.textContent === "Open file" && !b.disabled,
    ),
  );
  await page.locator("input[type=file]").setInputFiles({
    name: "bad.json",
    mimeType: "application/json",
    buffer: Buffer.from("{}"),
  });
  await page
    .getByRole("status")
    .filter({ hasText: "Invalid recording" })
    .waitFor();
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
  await migration.goto(`${server.resolvedUrls.local[0]}?mute`, {
    waitUntil: "networkidle",
  });
  await migration
    .getByRole("button", { name: "Game history", exact: true })
    .click();
  const migratedLibrary = migration.getByRole("dialog", {
    name: "Game history",
  });
  await migratedLibrary.waitFor();
  assert.equal(
    await migratedLibrary.locator(".replay-library-item").count(),
    1,
  );
  assert.match(await migratedLibrary.innerText(), /1v1/);
  await migrationContext.close();
  assert.deepEqual(errors, []);
  console.log(
    "Replay browser checks passed: full history, save, reload, seek, select one car, export, preview, return, and invalid files",
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
