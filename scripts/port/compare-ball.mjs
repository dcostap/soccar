import { readFile, mkdir, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import { performance } from "node:perf_hooks";
import { loadReference, TRACE_FIELDS } from "./reference.mjs";
import { ballCases } from "./cases.mjs";
import { encodeInput, referenceTrace, firstDifference } from "./trace.mjs";

const root = fileURLToPath(new URL("../../", import.meta.url));
const reference = await loadReference();
const lock = JSON.parse(
  await readFile(new URL("reference-lock.json", import.meta.url), "utf8"),
);
for (const [key, value] of Object.entries({
  node: process.version,
  v8: process.versions.v8,
  sourceHash: reference.sourceHash,
  extractedHash: reference.extractedHash,
})) {
  if (lock[key] !== value)
    throw new Error(
      `Reference lock mismatch: ${key}. Review the change before updating the lock.`,
    );
}

const mode = process.argv.includes("--debug") ? "debug" : "release";
function command(name, args, options = {}) {
  const result = spawnSync(name, args, { cwd: root, ...options });
  if (result.error) throw result.error;
  if (result.status !== 0)
    throw new Error(
      `${name} failed (${result.status}): ${result.stderr?.toString()}`,
    );
  return result;
}
const build = command("cargo", [
  "build",
  "--locked",
  "--manifest-path",
  "simulation/Cargo.toml",
  "--bin",
  "ball-trace",
  ...(mode === "release" ? ["--release"] : []),
]);
process.stderr.write(build.stderr);
const cases = ballCases();
const hash = (data) => createHash("sha256").update(data).digest("hex");
const input = encodeInput(cases);
if (hash(input) !== lock.inputHash)
  throw new Error("Input corpus changed. Review before updating the lock.");
const start = performance.now();
const expected = referenceTrace(reference, cases);
const jsMs = performance.now() - start;
if (hash(expected) !== lock.traceHash)
  throw new Error("JavaScript trace changed. Review before updating the lock.");
const executable = fileURLToPath(
  new URL(
    `../../simulation/target/${mode}/ball-trace${process.platform === "win32" ? ".exe" : ""}`,
    import.meta.url,
  ),
);
const nativeStart = performance.now();
const actual = command(executable, [], {
  input,
  maxBuffer: expected.length + 1024 * 1024,
}).stdout;
const nativeMs = performance.now() - nativeStart;
const difference = firstDifference(expected, actual, cases);
const states = cases.reduce((sum, c) => sum + c.ticks + 1, 0);
const report = {
  status: difference ? "FAIL" : "PASS",
  comparison: "bit-exact; no tolerances or exceptions",
  node: process.version,
  v8: process.versions.v8,
  platform: process.platform,
  arch: process.arch,
  rust: command("rustc", ["--version"]).stdout.toString().trim(),
  mode,
  sourceHash: reference.sourceHash,
  extractedHash: reference.extractedHash,
  cases: cases.length,
  states,
  fieldsPerState: TRACE_FIELDS.length,
  jsTraceHash: hash(expected),
  rustTraceHash: hash(actual),
  jsMs,
  nativeMs,
  difference,
};
const directory = new URL(
  `../../artifacts/ball-port/${mode}/`,
  import.meta.url,
);
await mkdir(directory, { recursive: true });
await writeFile(
  new URL("report.json", directory),
  `${JSON.stringify(report, null, 2)}\n`,
);
if (difference || process.argv.includes("--record")) {
  await writeFile(new URL("js.bin", directory), expected);
  await writeFile(new URL("rust.bin", directory), actual);
  await writeFile(new URL("input.bin", directory), input);
}
console.log(JSON.stringify(report, null, 2));
if (difference) process.exitCode = 1;
