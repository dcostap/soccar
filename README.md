# Soccar

https://dcostap.github.io/soccar/

The playable game uses the Rust simulation through WebAssembly.
The native runner uses the same simulation without rendering or real-time waits.

```sh
rustup target add wasm32-unknown-unknown
npm ci
npm run dev
```

Run a complete five-minute 3v3 bot match:

```sh
npm run sim -- --seed 12345
```

See [the simulation port](simulation/README.md) for Rust code and exact comparison tests.
