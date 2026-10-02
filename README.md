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

Matches record automatically. Open **Replays** in the Arena to watch any game stored on this device.
Download portable files from the same Arena view.
Use **Copy reference** to give an agent the game, approximate time, car, action, and intended test.
The agent can inspect exact events and states, then create the set piece.
For manual creation, pause and seek, then press **C**. Choose one car for the tested brain.
See [player replay contributions](arena/CONTRIBUTING-SETPIECES.md) for the full steps.
See [player replay history](arena/PLAYER-REPLAYS.md) for local storage and agent inspection.
