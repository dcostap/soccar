import test from "node:test";
import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";
import { createHash } from "node:crypto";
import { format } from "prettier";
import { rebaseGameAssets } from "../vite.config.js";

test("downloaded assets match the capture hashes", async () => {
  const manifest = JSON.parse(await readFile("provenance/files.json", "utf8"));
  for (const entry of manifest.files) {
    // The working code has been formatted. Compare the unmodified copies instead.
    const file =
      entry.file === "src/game.js"
        ? "provenance/original-game.js"
        : entry.file === "src/style.css"
          ? "provenance/original-style.css"
          : entry.file;
    const bytes = await readFile(file);
    assert.equal(bytes.length, entry.bytes, file);
    assert.equal(
      createHash("sha256").update(bytes).digest("hex"),
      entry.sha256,
      file,
    );
  }
});

test("working code changes only formatting and approved controller changes", async () => {
  for (const [original, working, parser] of [
    ["provenance/original-game.js", "src/game.js", "babel"],
    ["provenance/original-style.css", "src/style.css", "css"],
  ]) {
    let expected = await format(await readFile(original, "utf8"), { parser });
    if (working === "src/game.js") {
      expected = expected.replace(
        "  let n = wx.poll(t),\n    r = wx.pollAnyPadButton();",
        "  let r = wx.pollAnyPadButton(),\n    n = wx.poll(t);",
      );
      expected = expected
        .replace("    boost: Ot.CIRCLE,", "    boost: Ot.SQUARE,")
        .replace("    powerslide: Ot.SQUARE,", "    powerslide: Ot.R1,")
        .replace("    airRollLeft: Ot.L1,", "    airRollLeft: Ot.R1,")
        .replace("    airRollRight: Ot.R1,", "    airRollRight: Ot.L1,")
        .replace("    ballCam: Ot.TRIANGLE,", "    ballCam: Ot.L1,");
    }
    assert.equal(await readFile(working, "utf8"), expected);
  }
});

test("audio manifest points to local files", async () => {
  const manifest = JSON.parse(
    await readFile("public/audio/rl/manifest.json", "utf8"),
  );
  for (const group of Object.values(manifest)) {
    for (const item of group.items)
      await access(`public/audio/rl/${item.file}`);
  }
});

test("font rules use local files only", async () => {
  const css = await readFile("src/fonts.css", "utf8");
  const urls = [...css.matchAll(/url\(([^)]+)\)/g)].map((match) => match[1]);
  assert.ok(urls.length > 0);
  for (const url of urls) {
    assert.ok(url.startsWith("/fonts/"), url);
    await access(`public${url}`);
  }
});

test("Pages builds change all game asset paths without changing the source", async () => {
  const code = await readFile("src/game.js", "utf8");
  assert.equal(rebaseGameAssets(code, "/"), code);
  const paths = [...code.matchAll(/([`"'])\/(assets|audio)\//g)];
  assert.equal(paths.length, 9);
  const rebased = rebaseGameAssets(code, "/soccar/");
  assert.equal(
    [...rebased.matchAll(/([`"'])\/soccar\/(assets|audio)\//g)].length,
    paths.length,
  );
  assert.doesNotMatch(rebased, /([`"'])\/(assets|audio)\//);
  assert.equal(
    rebased
      .replaceAll("/soccar/assets/", "/assets/")
      .replaceAll("/soccar/audio/", "/audio/"),
    code,
  );
});
