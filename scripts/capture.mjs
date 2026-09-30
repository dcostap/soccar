// Capture the public deployment. This does not recover the author's source files.
import { copyFile, mkdir, writeFile } from "node:fs/promises";
import { dirname, basename } from "node:path";
import { createHash } from "node:crypto";

const origin = "https://soccar-one.vercel.app";
const records = new Map();

async function download(url, file, optional = false) {
  const response = await fetch(url, { signal: AbortSignal.timeout(120000) });
  if (optional && response.status === 404) {
    console.log(`Not available: ${url}`);
    return null;
  }
  if (!response.ok) throw new Error(`${response.status}: ${url}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  if (
    response.headers.get("content-type")?.includes("text/html") &&
    !file.endsWith(".html")
  ) {
    throw new Error(`Expected an asset, received HTML: ${url}`);
  }
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, bytes);
  records.set(file, {
    file,
    url,
    bytes: bytes.length,
    sha256: createHash("sha256").update(bytes).digest("hex"),
  });
  console.log(`${file}: ${bytes.length} bytes`);
  return bytes;
}

async function asset(path, optional = false) {
  const file = `public${path}`;
  if (records.has(file)) return;
  const bytes = await download(`${origin}${path}`, file, optional);
  if (!bytes) return;
  let json;
  if (path.endsWith(".gltf")) json = JSON.parse(bytes.toString());
  if (path.endsWith(".glb")) {
    if (bytes.toString("ascii", 0, 4) !== "glTF")
      throw new Error(`Invalid GLB: ${path}`);
    json = JSON.parse(
      bytes.toString("utf8", 20, 20 + bytes.readUInt32LE(12)).trim(),
    );
  }
  if (json) {
    for (const item of [...(json.buffers ?? []), ...(json.images ?? [])]) {
      if (item.uri && !item.uri.startsWith("data:")) {
        const dependency = new URL(item.uri, `${origin}${path}`);
        if (dependency.origin !== origin)
          throw new Error(`External model dependency: ${dependency}`);
        await asset(dependency.pathname);
      }
    }
  }
  return bytes;
}

async function batch(paths) {
  const queue = [...paths];
  await Promise.all(
    Array.from({ length: 6 }, async () => {
      while (queue.length) await asset(queue.shift());
    }),
  );
}

await download(`${origin}/`, "provenance/original-index.html");
await download(`${origin}/assets/index-Bq8bpGmv.js`, "src/game.js");
await download(`${origin}/assets/index-DMF4wMBW.css`, "src/style.css");
await copyFile("src/game.js", "provenance/original-game.js");
await copyFile("src/style.css", "provenance/original-style.css");
await batch([
  "/assets/fennec.glb",
  "/assets/fennec.json",
  "/assets/stadium/stadium.glb",
  "/assets/stadium/lightmap.webp",
  "/assets/stadium/rows.json",
  "/assets/rlball/scene.gltf",
]);
const textures = [
  "grass005",
  "concrete_wall",
  "concrete",
  "track",
  "metal_plate",
  "metal_sheet",
  "leather",
  "brushed",
  "carbon",
  "powder",
  "rubber",
  "swirl",
];
await batch(
  textures.flatMap((name) =>
    ["detail", "normal", "rough"].map(
      (kind) => `/assets/textures/${name}_${kind}.webp`,
    ),
  ),
);

const manifest = JSON.parse(await asset("/audio/rl/manifest.json"));
await batch(
  Object.values(manifest).flatMap((group) =>
    group.items.map((item) => `/audio/rl/${item.file}`),
  ),
);
await asset("/assets/car2.glb", true);
await Promise.all(
  ["body_normal", "body_ao", "body_id"].map((name) =>
    asset(`/assets/car/${name}.webp`, true),
  ),
);

const fontUrl =
  "https://fonts.googleapis.com/css2?family=Saira+Semi+Condensed:wght@300;400;500&family=Saira:wdth,wght@100..125,200..500&display=swap";
const fontBytes = await download(fontUrl, "provenance/original-fonts.css");
let fontCss = fontBytes.toString();
for (const url of new Set(
  [...fontCss.matchAll(/url\((https:[^)]+)\)/g)].map((match) => match[1]),
)) {
  const path = `/fonts/${basename(new URL(url).pathname)}`;
  await download(url, `public${path}`);
  fontCss = fontCss.replaceAll(url, path);
}
await writeFile("src/fonts.css", fontCss);
await writeFile(
  "provenance/files.json",
  JSON.stringify(
    {
      origin,
      capturedAt: new Date().toISOString(),
      note: "Hashes describe downloaded bytes before local code formatting. Fonts use local URLs.",
      files: [...records.values()].sort((a, b) => a.file.localeCompare(b.file)),
    },
    null,
    2,
  ) + "\n",
);
console.log(`Captured ${records.size} files.`);
