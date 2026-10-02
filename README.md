# Soccar

https://dcostap.github.io/soccar/

The playable game uses the Rust simulation through WebAssembly.
The native runner uses the same simulation without rendering or real-time waits.
Rust is the only simulation source. JavaScript handles graphics, audio, menus, and input.

```sh
rustup target add wasm32-unknown-unknown
npm ci
npm run dev
```

Run a complete five-minute 3v3 bot match:

```sh
npm run sim -- --seed 12345
```

See [the simulation core](simulation/README.md) for headless matches and exact native/WASM checks.

Rate bot brains against each other, browse every match, and watch any of them in the game:

```sh
npm run arena -- ladder
npm run dev   # then open /arena.html
```

See [the arena](arena/README.md).

Matches record automatically. Select **Save replay** or **Watch last game** in the game.
Pause and seek, then select **Create set piece**. Choose one car for the tested brain.
See [player replay contributions](arena/CONTRIBUTING-SETPIECES.md) for the full steps.
