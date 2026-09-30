# Soccar — local copy

This repo contains the game served at https://soccar-one.vercel.app/.
It uses the deployed game code, models, textures, and sound files. It is not a new game implementation.
Fonts load from local files. The game does not need the original site to run.

## Run

Install Node.js 22.12 or later. Then run:

```sh
npm ci
npm run dev
```

Open the local URL shown in the terminal. Use the game's Controls menu for keyboard and controller settings.

## Build

```sh
npm run build
npm run preview
```

The build writes `dist/`. Serve this folder through HTTP. Do not open `index.html` with a `file:` URL.

## GitHub Pages

The public repo is https://github.com/dcostap/soccar.
The game URL is https://dcostap.github.io/soccar/.

Push to `main` to run tests and deploy through GitHub Actions.
The Pages build adds the repo path to asset URLs. It does not change the captured source files.

To test the Pages paths locally, run:

```sh
npm run build -- --base=/soccar/
npm run preview -- --base=/soccar/
```

Open `/soccar/` on the preview server.

## Files

- `src/game.js`: formatted deployed JavaScript, including Three.js and the game code.
- `src/style.css`: the deployed styles.
- `src/fonts.css`: font rules with local file paths.
- `public/`: models, textures, sounds, and fonts.
- `provenance/`: unmodified game code, styles, page, download URLs, and file hashes.
- `scripts/capture.mjs`: the download script for this deployment version.
- `vite.config.js`: asset path support for GitHub Pages.

## Source limits and rights

No public source repo or source map was found during setup.
The original TypeScript files, module names, and development history are not available here.
Formatting makes the deployed code easier to read. It does not restore the original source files.
The local Vite build uses this deployed code.

Run `npm test` to check file hashes, local fonts, sound files, and the code formatting.
The formatting check describes the captured version. Update this check when you change the game code.

This is an unofficial fan project. It is not affiliated with Epic Games or Psyonix.
The downloaded files retain their existing rights. This repo grants no new license for them.
Check permission before you publish or distribute these files.
