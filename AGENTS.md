# Agent notes

Soccar is a car-soccer game, a headless match harness, and a bot-brain arena. All three share one Rust simulation.

- `simulation/`: the Rust simulation, compiled natively and to WASM. Physics, bots ("brains"), rules, harness. See `simulation/README.md`.
- `arena/`: a separate Rust crate that rates brains, logs matches, and exports data for `arena.html`. See `arena/README.md`.
- `src/`: browser rendering, audio, menus, and input. `src/game.js` is a large captured bundle. Edit it only with small hooks.

## Rules

- **Determinism is the product.** Native and WASM must produce bit-identical state. Arena replays and watch links depend on it.
  Use the pinned `libm` trigonometry, never platform `f64::sin`, `cos`, or `atan2`. Brains must not read clocks or the game random generator.
- **Optimizations must be exact.** A performance change must keep every hash in `simulation/regression.json` unchanged.
- **Behavior changes are deliberate.** Re-record the baseline only after the user approves a behavior change:
  `npm run build:wasm && node scripts/check-simulation.mjs --full --record`. Then update `scripts/check-presentation.mjs`
  and the baseline table in `simulation/README.md`. Never re-record only to make a failing check pass.
- **Brain fingerprints include the module source text.** Any edit to a brain module, even formatting or comments, retires that brain's arena results.
  Add a new module instead of rewriting one whose results matter.

## Checks

```sh
npm run test:rust                 # Rust unit and integration tests
npm run test:simulation:full      # native vs WASM vs baseline, bit for bit (several minutes)
npm test                          # Node tests
npm run test:cli                  # native runner
npm run test:presentation         # browser presentation on Node
npm run test:arena                # arena unit tests and exact replay of logged matches
npm run test:browser              # real Chrome via Playwright
npm run benchmark                 # speed, after checking results against the baseline
```

Run `npm run build:wasm` after changing Rust that the browser uses. Checks that load WASM read `public/simulation/`.

## Gotchas

- Windows locks a running `.exe`. To rebuild while a batch runs, build with another `--target-dir`.
- Keep LF line endings and UTF-8. Python on Windows needs `newline=''` and `encoding='utf-8'` when writing files.
- `arena/results/` and `public/arena/` are local data and are gitignored. `npm run arena -- ladder` rebuilds them.
- Remaining legacy behavior is marked `TODO(post-port)`.
