// Checks that a contest branch follows arena/CONTEST.md.
// Usage: node scripts/check-contest.mjs <branch> <name> [base]
import { execFileSync } from "node:child_process";

const [branch, name, base = "contest/start"] = process.argv.slice(2);
if (!branch || !/^[a-z]+$/.test(name ?? "")) {
  console.error("Usage: node scripts/check-contest.mjs <branch> <name> [base]");
  process.exit(1);
}
const git = (...args) => execFileSync("git", args, { encoding: "utf8" });
const problems = [];

const allowed = [
  new RegExp(`^simulation/src/brains/${name}\\.rs$`),
  new RegExp(`^simulation/src/brains/${name}/[^/]+\\.rs$`),
  new RegExp(`^arena/brains/${name}\\.brain$`),
  new RegExp(`^arena/contest/${name}\\.md$`),
];
const changes = git(
  "diff",
  "--name-status",
  "--no-renames",
  `${base}...${branch}`,
)
  .trim()
  .split("\n")
  .filter(Boolean)
  .map((line) => line.split("\t"));
for (const [status, path] of changes) {
  if (!allowed.some((pattern) => pattern.test(path)))
    problems.push(`${status} ${path}: outside the files ${name} may change`);
}

// The entry must exist and use the entrant's module.
const files = git("ls-tree", "-r", "--name-only", branch).split("\n");
const brainFiles = files.filter((f) => f.startsWith(`arena/brains/${name}`));
if (brainFiles.length !== 1 || brainFiles[0] !== `arena/brains/${name}.brain`)
  problems.push(
    `expected exactly one entry file, arena/brains/${name}.brain; found ${brainFiles.join(", ") || "none"}`,
  );
else if (
  !/^\s*module\s*=\s*(\w+)/m.test(
    git("show", `${branch}:arena/brains/${name}.brain`),
  ) ||
  git("show", `${branch}:arena/brains/${name}.brain`).match(
    /^\s*module\s*=\s*(\w+)/m,
  )[1] !== name
)
  problems.push(`arena/brains/${name}.brain must use module = ${name}`);

// Sources that would break determinism or reach outside the simulation.
const forbidden = [
  [/\bunsafe\b/, "unsafe code"],
  [/std::time|\bInstant\b|\bSystemTime\b/, "clocks"],
  [
    /thread_local!|static\s+mut\b|\bAtomic\w+|\bMutex\b|\bOnceLock\b|\bLazyLock\b/,
    "shared mutable state",
  ],
  [
    /std::(fs|env|process|net|thread)\b/,
    "files, environment, processes, network, or threads",
  ],
  [/\bRandom\b|\.random\b/, "the game random generator"],
  [/include_(str|bytes)!/, "embedded files"],
  [
    /f64::(sin|cos|tan|sinh|cosh|tanh|asin|acos|atan|atan2|asinh|acosh|atanh|exp|exp2|exp_m1|ln|ln_1p|log|log2|log10|powf|powi|hypot|cbrt|sin_cos)\b|\.(sin|cos|tan|sinh|cosh|tanh|asin|acos|atan|atan2|asinh|acosh|atanh|exp|exp2|exp_m1|ln|ln_1p|log|log2|log10|powf|powi|hypot|cbrt|sin_cos)\(/,
    "platform math (use crate::math or libm)",
  ],
];
for (const file of files.filter(
  (f) => allowed[0].test(f) || allowed[1].test(f),
)) {
  const source = git("show", `${branch}:${file}`).replace(/\/\/.*$/gm, "");
  for (const [pattern, what] of forbidden)
    if (pattern.test(source)) problems.push(`${file}: ${what}`);
}

const report = {
  branch,
  name,
  base,
  changed: changes.map(([s, p]) => `${s} ${p}`),
  problems,
};
console.log(JSON.stringify(report, null, 2));
process.exit(problems.length ? 1 : 0);
