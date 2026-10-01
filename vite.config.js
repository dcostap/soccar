import { defineConfig } from "vite";

// The captured game uses root paths. Pages serves it under a repository path.
// Change these paths during the build, not in the captured source.
export function rebaseGameAssets(code, base) {
  if (base === "/") return code;
  if (!base.startsWith("/") || !base.endsWith("/")) {
    throw new Error("Use an absolute base path with a final slash.");
  }
  return code.replace(/([`"'])\/(assets|audio)\//g, `$1${base}$2/`);
}

let assetBase = "/";

export default defineConfig({
  build: {
    rollupOptions: {
      input: { main: "index.html", arena: "arena.html" },
    },
  },
  plugins: [
    {
      name: "soccar-asset-base",
      configResolved(config) {
        assetBase = config.base;
      },
      transform(code, id) {
        if (id.replaceAll("\\", "/").split("?")[0].endsWith("/src/game.js")) {
          return rebaseGameAssets(code, assetBase);
        }
      },
    },
  ],
});
