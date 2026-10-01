import { spawnSync } from "node:child_process";
import { mkdir, copyFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
const root = fileURLToPath(new URL("../", import.meta.url));
const result = spawnSync(
  "cargo",
  [
    "build",
    "--locked",
    "--manifest-path",
    "simulation/Cargo.toml",
    "--lib",
    "--target",
    "wasm32-unknown-unknown",
    "--release",
  ],
  { cwd: root, stdio: "inherit" },
);
if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status ?? 1);
await mkdir(new URL("../public/simulation/", import.meta.url), {
  recursive: true,
});
await copyFile(
  new URL(
    "../simulation/target/wasm32-unknown-unknown/release/soccar_simulation.wasm",
    import.meta.url,
  ),
  new URL("../public/simulation/soccar_simulation.wasm", import.meta.url),
);
