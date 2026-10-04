"""Exports Nexto's weights for the Rust brain and writes reference test vectors.

Usage: python tools/nexto/export.py <Necto checkout>/rlbot-support/Nexto

Writes simulation/src/brains/nexto/model.bin and simulation/src/brains/nexto/vectors.json.
The vectors hold synthetic game states, Nexto's observation built by its own nexto_obs.py,
float32 PyTorch logits, and float64 NumPy logits. Rust tests compare against the float64 values.
"""
import json
import math
import os
import sys
import types

import numpy as np
import torch

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT = os.path.join(ROOT, "simulation", "src", "brains", "nexto")

# Parameter order in model.bin. Each tensor is stored row-major as little-endian float32.
ORDER = [
    "net.earl.query_preprocess.0.weight", "net.earl.query_preprocess.0.bias",
    "net.earl.query_preprocess.2.weight", "net.earl.query_preprocess.2.bias",
    "net.earl.key_value_preprocess.0.weight", "net.earl.key_value_preprocess.0.bias",
    "net.earl.key_value_preprocess.2.weight", "net.earl.key_value_preprocess.2.bias",
]
for b in range(2):
    ORDER += [f"net.earl.blocks.{b}.{n}" for n in (
        "attention.in_proj_weight", "attention.in_proj_bias",
        "attention.out_proj.weight", "attention.out_proj.bias",
        "linear1.weight", "linear1.bias", "linear2.weight", "linear2.bias",
        "norm1.weight", "norm1.bias", "norm2.weight", "norm2.bias", "norm3.weight", "norm3.bias")]
ORDER += [
    "net.output.net.0.weight", "net.output.net.0.bias",
    "net.output.net.2.weight", "net.output.net.2.bias",
    "net.output.net.4.weight", "net.output.net.4.bias",
    "net.output.emb_convertor.weight", "net.output.emb_convertor.bias",
]


def load_nexto(folder):
    # nexto_obs.py imports rlgym_compat only for names the batched builder does not use.
    for name in ("rlgym_compat", "rlgym_compat.common_values", "rlgym_compat.game_state"):
        sys.modules[name] = types.ModuleType(name)
    sys.modules["rlgym_compat.common_values"].BLUE_TEAM = 0
    sys.modules["rlgym_compat.common_values"].ORANGE_TEAM = 1
    sys.modules["rlgym_compat.game_state"].GameState = object
    sys.modules["rlgym_compat.game_state"].PlayerData = object
    sys.path.insert(0, folder)
    import nexto_obs
    from agent import Agent
    return nexto_obs, Agent


def reference_forward(p, q, kv):
    """Float64 forward pass that mirrors the TorchScript graph for one observation."""
    relu = lambda x: np.maximum(x, 0.0)
    lin = lambda x, n: x @ p[n + ".weight"].T + p[n + ".bias"]

    def norm(x, n):
        mean = x.mean(-1, keepdims=True)
        var = ((x - mean) ** 2).mean(-1, keepdims=True)
        return (x - mean) / np.sqrt(var + 1e-5) * p[n + ".weight"] + p[n + ".bias"]

    x = relu(lin(relu(lin(q, "net.earl.query_preprocess.0")), "net.earl.query_preprocess.2"))
    e = relu(lin(relu(lin(kv, "net.earl.key_value_preprocess.0")), "net.earl.key_value_preprocess.2"))
    for b in range(2):
        pre = f"net.earl.blocks.{b}."
        w, bias = p[pre + "attention.in_proj_weight"], p[pre + "attention.in_proj_bias"]
        qn, kn = norm(x, pre + "norm1"), norm(e, pre + "norm2")
        qq = qn @ w[:128].T + bias[:128]
        kk = kn @ w[128:256].T + bias[128:256]
        vv = kn @ w[256:].T + bias[256:]
        heads = []
        for h in range(4):
            s = slice(32 * h, 32 * h + 32)
            scores = (qq[s] / math.sqrt(32)) @ kk[:, s].T
            scores = np.exp(scores - scores.max())
            heads.append((scores / scores.sum()) @ vv[:, s])
        x = x + lin(np.concatenate(heads), pre + "attention.out_proj")
        x = x + lin(relu(lin(norm(x, pre + "norm3"), pre + "linear1")), pre + "linear2")
    emb = lin(relu(x), "net.output.emb_convertor")
    return emb, x


def action_embeddings(p, table):
    relu = lambda x: np.maximum(x, 0.0)
    a = table
    for n in ("net.output.net.0", "net.output.net.2", "net.output.net.4"):
        a = relu(a @ p[n + ".weight"].T + p[n + ".bias"])
    return a


def basis(rng):
    """A random right-handed basis: forward, left, up."""
    m, _ = np.linalg.qr(rng.normal(size=(3, 3)))
    if np.linalg.det(m) < 0:
        m[:, 2] *= -1
    return m


def random_state(rng, n_blue, n_orange):
    players = []
    for team, count in ((0, n_blue), (1, n_orange)):
        for _ in range(count):
            m = basis(rng) if rng.random() < 0.6 else np.eye(3) @ np.array(
                [[math.cos(a := rng.uniform(-math.pi, math.pi)), -math.sin(a), 0], [math.sin(a), math.cos(a), 0], [0, 0, 1]])
            players.append(dict(
                team=team,
                pos=[rng.uniform(-4000, 4000), rng.uniform(-5000, 5000), rng.uniform(17, 1900)],
                forward=m[:, 0].tolist(), left=m[:, 1].tolist(), up=m[:, 2].tolist(),
                vel=rng.uniform(-1500, 1500, 3).tolist(), ang_vel=rng.uniform(-5.5, 5.5, 3).tolist(),
                boost=float(rng.uniform(0, 1)), demoed=bool(rng.random() < 0.1),
                on_ground=bool(rng.random() < 0.5), has_flip=bool(rng.random() < 0.6)))
    ball = dict(pos=[rng.uniform(-4000, 4000), rng.uniform(-5000, 5000), rng.uniform(93, 1900)],
                vel=rng.uniform(-3000, 3000, 3).tolist(), ang_vel=rng.uniform(-6, 6, 3).tolist())
    pads = [float(rng.random() < 0.7) for _ in range(34)]
    return dict(players=players, ball=ball, pads=pads)


def encode(nexto_obs, state):
    """Builds nexto_obs.encode_gamestate's flat layout from a plain state."""
    vals = [0, 0, 0] + state["pads"]
    b = state["ball"]
    inv = np.array([-1, -1, 1])
    for sign in (np.ones(3), inv):
        vals += (np.array(b["pos"]) * sign).tolist() + (np.array(b["vel"]) * sign).tolist() + (
            np.array(b["ang_vel"]) * sign).tolist()
    for i, p in enumerate(state["players"]):
        vals += [i, p["team"]]
        m = np.array([p["forward"], p["left"], p["up"]]).T
        for sign in (np.ones(3), inv):
            mm = np.diag(sign) @ m
            vals += (np.array(p["pos"]) * sign).tolist() + nexto_obs.rotation_to_quaternion(mm).tolist()
            vals += (np.array(p["vel"]) * sign).tolist() + (np.array(p["ang_vel"]) * sign).tolist()
        vals += [0, 0, 0, 0, 0, float(p["demoed"]), float(p["on_ground"]), 0, float(p["has_flip"]), p["boost"]]
    return np.array(vals, dtype=np.float64)


def main():
    folder = sys.argv[1]
    nexto_obs, Agent = load_nexto(folder)
    model = torch.jit.load(os.path.join(folder, "nexto-model.pt"))
    params = dict(model.named_parameters())
    assert sorted(params) == sorted(ORDER), "unexpected parameter set"
    table = model.net.output.code_with_constants[1].const_mapping["c0"].numpy().astype(np.float64)
    assert np.array_equal(table, Agent.make_lookup_table()), "action table differs from agent.py"
    scale = getattr(model.net.earl.blocks, "0").attention.code_with_constants[1].const_mapping["c1"].item()
    assert scale == math.sqrt(32), scale

    blob = b"".join(params[n].detach().numpy().astype("<f4").tobytes() for n in ORDER)
    os.makedirs(OUT, exist_ok=True)
    with open(os.path.join(OUT, "model.bin"), "wb") as f:
        f.write(blob)
    p64 = {n: params[n].detach().numpy().astype(np.float64) for n in ORDER}
    actions = action_embeddings(p64, table)

    rng = np.random.default_rng(20261004)
    builder = nexto_obs.NextoObsBuilder()
    cases = []
    worst = 0.0
    for sizes in [(1, 1), (1, 1), (2, 2), (3, 3), (1, 2), (3, 3), (2, 1), (1, 1)]:
        state = random_state(rng, *sizes)
        obs = builder.batched_build_obs(np.expand_dims(encode(nexto_obs, state), 0))
        observers = []
        for i, (q, kv, m) in enumerate(obs):
            prev = table[rng.integers(90)]
            builder.add_actions(obs, prev, i)
            with torch.no_grad():
                out, _ = model(tuple(torch.from_numpy(a).float() for a in (q, kv, m)))
            logits32 = out[0].numpy().astype(np.float64)
            emb, _ = reference_forward(p64, q[0, 0], kv[0])
            logits64 = actions @ emb
            worst = max(worst, float(np.abs(logits32 - logits64).max()))
            assert int(np.argmax(logits32)) == int(np.argmax(logits64))
            observers.append(dict(previous_action=prev.tolist(), q=q[0, 0].tolist(), kv=kv[0].tolist(),
                                  logits=logits64.tolist(), action=int(np.argmax(logits64))))
        cases.append(dict(state=state, observers=observers))
    with open(os.path.join(OUT, "vectors.json"), "w", newline="", encoding="utf-8") as f:
        json.dump(dict(cases=cases), f, separators=(",", ":"))
        f.write("\n")
    print(f"model.bin: {len(blob)} bytes, {len(blob) // 4} floats")
    print(f"{sum(len(c['observers']) for c in cases)} observers; float32 vs float64 logits differ by at most {worst:.2e}")


if __name__ == "__main__":
    main()
