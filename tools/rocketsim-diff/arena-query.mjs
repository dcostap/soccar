// Read Rust arena queries from the existing WASM build. There is no JS geometry here.
import { readFile } from "node:fs/promises";

let input = "";
for await (const chunk of process.stdin) input += chunk;
const points = JSON.parse(input);
const { instance } = await WebAssembly.instantiate(
  await readFile(
    process.argv[2] ??
      new URL(
        "../../public/simulation/soccar_simulation.wasm",
        import.meta.url,
      ),
  ),
);
const query = instance.exports.sim_arena_query;
console.log(
  JSON.stringify(
    points.map(([x, y, z]) => ({
      distance: query(0, x, y, z),
      normal: [query(1, x, y, z), query(2, x, y, z), query(3, x, y, z)],
    })),
  ),
);
