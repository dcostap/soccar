# Nexto export

`simulation/src/brains/nexto/` runs [Nexto](https://github.com/Rolv-Arild/Necto), the deep-RL Rocket League bot
by Rolv, Soren, and several contributors. Its weights and behavior come from `rlbot-support/Nexto` in that repository,
licensed [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/).
The game menu credits it. Keep that credit and the license notice when you copy or change the module.

## Regenerate the weights

The committed `model.bin` comes from Necto commit `2e6ed7d6ed2b352e8ff529d4a12a0c9c70c28cca`.
Regenerating it needs Python with `torch` and `numpy`:

```sh
git clone https://github.com/Rolv-Arild/Necto.git artifacts/necto
python tools/nexto/export.py artifacts/necto/rlbot-support/Nexto
```

The script writes two files:

- `model.bin`: every parameter as little-endian `f32`, in the order listed in `export.py`.
- `vectors.json`: 28 observations of synthetic states, built by Nexto's own `nexto_obs.py`.
  They come with float64 reference logits.

The script checks that the action table matches `agent.py`. It also checks that the float64 reference
and PyTorch pick the same action. The Rust test `brains::nexto::tests::matches_reference_vectors` then compares
observations within 1e-9 and logits within 1e-8.

## Port decisions

- The runner follows Nexto's RLBot `bot.py`. It picks an action every 8 ticks and applies it 6 ticks later,
  holding it for 8 ticks. It always picks the most likely action, never samples, so matches stay deterministic.
- The scripted speed-flip kickoff starts when the countdown ends. The taker is the closest car,
  or the left car of a tied pair.
- Observations follow `rlgym_compat` 1.0.2 as used by RLBot:
  - `on_ground` is any wheel contact or contact within the last 6 ticks.
  - `has_flip` means no double jump or flip since the last landing.
  - Pad timers are on/off, and boost runs from 0 to 1.
- Soccar shares Rocket League's axes and pad order. Only steer, yaw, and roll are negated on output.
- The network runs in f64. `Linear` stores weights input-major and skips zero inputs.
  Both are exact: each output still sums in input order.

## Cost

One decision is about 1.8 ms native: two attention blocks over up to 41 entities.
A 1v1 match costs about 10 s of brain time per Nexto car, against 1 s for `modular-combo`.
The weights add about 1.8 MB to the WASM file.
