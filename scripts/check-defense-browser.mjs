// Check measured groups, diagrams, details, and short watch links in real Chrome.
import assert from "node:assert/strict";
import { readFile, mkdir } from "node:fs/promises";
import { chromium } from "playwright-core";
import { preview } from "vite";

const data = JSON.parse(await readFile("public/arena/setpieces.json", "utf8"));
const brain = data.brains.findIndex((b) => b.name === "alphabravo");
assert.ok(brain >= 0);
const server = await preview({ preview: { host: "127.0.0.1", port: 0 } });
const browser = await chromium.launch({
  channel: "chrome",
  headless: true,
  args: ["--no-sandbox"],
});
const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
const errors = [];
const observe = (page) => {
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("requestfailed", (request) =>
    errors.push(`${request.url()}: ${request.failure()?.errorText}`),
  );
};
observe(page);
try {
  await page.goto(`${server.resolvedUrls.local[0]}arena.html#/setpieces`, {
    waitUntil: "networkidle",
  });
  assert.equal(
    await page.getByLabel("Include emergency tests").isChecked(),
    false,
  );
  assert.equal(
    await page
      .locator(".sp-summary")
      .getByText("defense-v1-ceiling", { exact: true })
      .count(),
    0,
  );
  await page
    .getByLabel("Suite", { exact: true })
    .selectOption("defense-v2-ceiling");
  await page
    .getByLabel("Group results by", { exact: true })
    .selectOption("lane");
  const groupRows = page.locator(".sp-summary tbody tr:not(.total)");
  assert.equal(await groupRows.count(), 3);
  for (const row of await groupRows.all())
    assert.equal((await row.locator("td").nth(1).innerText()).trim(), "72");
  await groupRows
    .filter({ has: page.getByText("left", { exact: true }) })
    .click();
  assert.match(await page.locator(".summary-line").innerText(), /^72 of /);
  assert.match(page.url(), /group=lane/);
  assert.match(page.url(), /value=left/);
  await page.reload({ waitUntil: "networkidle" });
  assert.match(await page.locator(".summary-line").innerText(), /^72 of /);
  await page
    .getByLabel("Group results by", { exact: true })
    .selectOption("boost");
  assert.equal(await groupRows.count(), 4);
  for (const row of await groupRows.all())
    assert.equal((await row.locator("td").nth(1).innerText()).trim(), "54");
  await page
    .locator(".sp-list tbody tr.row")
    .first()
    .locator("td.text")
    .click();
  const detail = page.locator(".setpiece-detail");
  await detail.waitFor();
  assert.match(await detail.innerText(), /ceiling bounce at/);
  assert.match(await detail.innerText(), /does not prove a save is possible/);
  assert.equal(await detail.locator("canvas").count(), 1);
  const link = await page
    .locator(".sp-list tbody tr.row")
    .first()
    .locator("td")
    .nth(4 + brain)
    .locator("a")
    .getAttribute("href");
  const watchUrl = new URL(link, page.url());
  const query = watchUrl.searchParams;
  assert.equal(query.get("brain"), "alphabravo");
  assert.ok(query.get("setpiece").startsWith("defense-v2-ceiling/"));
  assert.equal(query.has("scenario"), false);
  await mkdir("artifacts/defense", { recursive: true });
  await page.screenshot({
    path: "artifacts/defense/coverage.png",
    fullPage: true,
  });

  // Rival speed groups are balanced and exclude families without a rival.
  await page
    .getByLabel("Suite", { exact: true })
    .selectOption("defense-v2-rival-cut");
  await page
    .getByLabel("Group results by", { exact: true })
    .selectOption("impact");
  assert.equal(await groupRows.count(), 3);
  for (const row of await groupRows.all())
    assert.equal((await row.locator("td").nth(1).innerText()).trim(), "72");
  await page
    .getByLabel("Suite", { exact: true })
    .selectOption("defense-v3-ground-recovery");
  await page
    .getByLabel("Group results by", { exact: true })
    .selectOption("placement");
  assert.equal(await groupRows.count(), 6);
  for (const row of await groupRows.all())
    assert.equal((await row.locator("td").nth(1).innerText()).trim(), "36");
  await groupRows
    .filter({ has: page.getByText("attack-half", { exact: true }) })
    .click();
  assert.match(await page.locator(".summary-line").innerText(), /^36 of /);
  await page
    .locator(".sp-list tbody tr.row")
    .first()
    .locator("td.text")
    .click();
  await detail.waitFor();
  assert.match(await detail.innerText(), /Recovery: defender starts/);
  assert.match(await detail.innerText(), /Required average travel speed/);
  const recoveryLink = await page
    .locator(".sp-list tbody tr.row")
    .first()
    .locator("td")
    .nth(4 + brain)
    .locator("a")
    .getAttribute("href");
  const recoveryUrl = new URL(recoveryLink, page.url());
  assert.ok(
    recoveryUrl.searchParams
      .get("setpiece")
      .startsWith("defense-v3-ground-recovery/"),
  );
  await page.getByLabel("Group results by", { exact: true }).selectOption("");
  await page.getByLabel("Include emergency tests").check();
  assert.equal(
    await page
      .locator(".sp-summary")
      .getByText("defense-v1-ceiling", { exact: true })
      .count(),
    1,
  );
  await page.getByLabel("Include emergency tests").uncheck();
  assert.equal(
    await page
      .locator(".sp-summary")
      .getByText("defense-v1-ceiling", { exact: true })
      .count(),
    0,
  );
  for (const url of [watchUrl, recoveryUrl]) {
    const watch = await browser.newPage();
    observe(watch);
    await watch.goto(`${url.href}&mute`, { waitUntil: "networkidle" });
    await watch.locator(".watch-timeline").waitFor();
    await watch
      .getByRole("combobox", { name: "Replay speed", exact: true })
      .selectOption("4");
    await watch.waitForFunction(() =>
      document.querySelector(".hud-banner")?.textContent.match(/PASSED|FAILED/),
    );
    assert.match(
      await watch.locator("body").innerText(),
      /Replay matches the arena result/,
    );
    await watch.close();
  }
  assert.deepEqual(errors, []);
  console.log(
    "Defense browser checks passed: balanced groups, filters, details, diagrams, and exact short-link replay",
  );
} catch (error) {
  await page
    .screenshot({ path: "artifacts/defense/failure.png", fullPage: true })
    .catch(() => {});
  console.error(await page.locator("body").innerText());
  throw error;
} finally {
  await browser.close();
  await server.close();
}
