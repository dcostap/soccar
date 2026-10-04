//! Nexto's policy network, evaluated in f64 with a fixed operation order.
//!
//! The network is an EARL perceiver: one query (the observing car) attends over every entity
//! (cars, ball, boost pads) through two pre-norm attention blocks with four heads. The result is
//! scored by dot product against an embedding of each of the 90 lookup-table actions.
//! `tools/nexto/export.py` writes `model.bin` from the published TorchScript file.
use std::sync::OnceLock;

pub const QUERY: usize = 32;
pub const ENTITY: usize = 24;
const WIDTH: usize = 128;
const HEADS: usize = 4;
const HEAD: usize = WIDTH / HEADS;
const HIDDEN: usize = 512;
const EMBED: usize = 32;
pub const ACTIONS: usize = 90;

static BYTES: &[u8] = include_bytes!("model.bin");

/// A linear layer. Weights are stored input-major so the inner loop runs over independent outputs.
/// Each output still sums its products in input order, then adds the bias, as a row-by-row dot product
/// would. Skipping a zero input is exact: the sum starts at +0.0 and never becomes -0.0.
struct Linear {
    columns: Vec<f64>,
    bias: Vec<f64>,
}
impl Linear {
    /// Takes PyTorch's row-major `[outputs][inputs]` weight.
    fn new(weight: &[f64], bias: &[f64]) -> Self {
        let (outputs, inputs) = (bias.len(), weight.len() / bias.len());
        let mut columns = vec![0.0; weight.len()];
        for o in 0..outputs {
            for i in 0..inputs {
                columns[i * outputs + o] = weight[o * inputs + i];
            }
        }
        Self {
            columns,
            bias: bias.to_vec(),
        }
    }
    fn apply(&self, x: &[f64], out: &mut [f64]) {
        let n = self.bias.len();
        debug_assert_eq!(x.len() * n, self.columns.len());
        let out = &mut out[..n];
        out.fill(0.0);
        for (&v, column) in x.iter().zip(self.columns.chunks_exact(n)) {
            if v == 0.0 {
                continue;
            }
            for (o, w) in out.iter_mut().zip(column) {
                *o += w * v;
            }
        }
        for (o, b) in out.iter_mut().zip(&self.bias) {
            *o += b;
        }
    }
}

struct Norm {
    weight: Vec<f64>,
    bias: Vec<f64>,
}
impl Norm {
    fn apply(&self, x: &[f64], out: &mut [f64]) {
        let n = x.len() as f64;
        let mean = x.iter().sum::<f64>() / n;
        let var = x.iter().map(|v| (v - mean) * (v - mean)).sum::<f64>() / n;
        let scale = (var + 1e-5).sqrt();
        for (i, o) in out.iter_mut().enumerate() {
            *o = (x[i] - mean) / scale * self.weight[i] + self.bias[i];
        }
    }
}

struct Block {
    /// Query rows of the attention input projection.
    wq: Linear,
    /// Key then value rows, applied together to each entity.
    wkv: Linear,
    out_proj: Linear,
    linear1: Linear,
    linear2: Linear,
    norm1: Norm,
    norm2: Norm,
    norm3: Norm,
}

pub struct Model {
    query1: Linear,
    query2: Linear,
    entity1: Linear,
    entity2: Linear,
    blocks: [Block; 2],
    convert: Linear,
    /// The lookup table, indexed by the network's output.
    pub table: Vec<[f64; 8]>,
    /// Embedding of each lookup-table action, computed once from the action network.
    actions: Vec<[f64; EMBED]>,
}

struct Reader {
    offset: usize,
}
impl Reader {
    fn take(&mut self, n: usize) -> Vec<f64> {
        let out = BYTES[self.offset..self.offset + 4 * n]
            .chunks_exact(4)
            .map(|b| f32::from_le_bytes([b[0], b[1], b[2], b[3]]) as f64)
            .collect();
        self.offset += 4 * n;
        out
    }
    fn linear(&mut self, inputs: usize, outputs: usize) -> Linear {
        let weight = self.take(inputs * outputs);
        Linear::new(&weight, &self.take(outputs))
    }
    fn norm(&mut self) -> Norm {
        Norm {
            weight: self.take(WIDTH),
            bias: self.take(WIDTH),
        }
    }
    fn block(&mut self) -> Block {
        let (weight, bias) = (self.take(3 * WIDTH * WIDTH), self.take(3 * WIDTH));
        let rows = |from: usize, to: usize| {
            Linear::new(&weight[from * WIDTH..to * WIDTH], &bias[from..to])
        };
        Block {
            wq: rows(0, WIDTH),
            wkv: rows(WIDTH, 3 * WIDTH),
            out_proj: self.linear(WIDTH, WIDTH),
            linear1: self.linear(WIDTH, HIDDEN),
            linear2: self.linear(HIDDEN, WIDTH),
            norm1: self.norm(),
            norm2: self.norm(),
            norm3: self.norm(),
        }
    }
}

fn relu(x: &mut [f64]) {
    for v in x {
        if *v < 0.0 {
            *v = 0.0;
        }
    }
}

/// The 90 actions as `[throttle, steer, pitch, yaw, roll, jump, boost, handbrake]`, in Rocket League's
/// control signs. Same order as Nexto's `agent.py`.
pub fn lookup_table() -> Vec<[f64; 8]> {
    let mut out = Vec::with_capacity(ACTIONS);
    for throttle in [-1.0, 0.0, 1.0] {
        for steer in [-1.0, 0.0, 1.0] {
            for boost in [0.0, 1.0] {
                for handbrake in [0.0, 1.0] {
                    if boost == 1.0 && throttle != 1.0 {
                        continue;
                    }
                    let t = if throttle != 0.0 { throttle } else { boost };
                    out.push([t, steer, 0.0, steer, 0.0, 0.0, boost, handbrake]);
                }
            }
        }
    }
    for pitch in [-1.0, 0.0, 1.0] {
        for yaw in [-1.0, 0.0, 1.0] {
            for roll in [-1.0, 0.0, 1.0] {
                for jump in [0.0, 1.0] {
                    for boost in [0.0, 1.0] {
                        if jump == 1.0 && yaw != 0.0 {
                            continue;
                        }
                        if pitch == 0.0 && roll == 0.0 && jump == 0.0 {
                            continue;
                        }
                        let handbrake =
                            if jump == 1.0 && (pitch != 0.0 || yaw != 0.0 || roll != 0.0) {
                                1.0
                            } else {
                                0.0
                            };
                        out.push([boost, yaw, pitch, yaw, roll, jump, boost, handbrake]);
                    }
                }
            }
        }
    }
    out
}

impl Model {
    /// The shared model, parsed on first use.
    pub fn get() -> &'static Model {
        static MODEL: OnceLock<Model> = OnceLock::new();
        MODEL.get_or_init(Model::load)
    }
    fn load() -> Model {
        let mut r = Reader { offset: 0 };
        let query1 = r.linear(QUERY, WIDTH);
        let query2 = r.linear(WIDTH, WIDTH);
        let entity1 = r.linear(ENTITY, WIDTH);
        let entity2 = r.linear(WIDTH, WIDTH);
        let blocks = [r.block(), r.block()];
        let action1 = r.linear(8, EMBED);
        let action2 = r.linear(EMBED, EMBED);
        let action3 = r.linear(EMBED, EMBED);
        let convert = r.linear(WIDTH, EMBED);
        assert_eq!(r.offset, BYTES.len(), "model.bin has an unexpected size");
        let table = lookup_table();
        let actions = table
            .iter()
            .map(|a| {
                let (mut h1, mut h2, mut out) = ([0.0; EMBED], [0.0; EMBED], [0.0; EMBED]);
                action1.apply(a, &mut h1);
                relu(&mut h1);
                action2.apply(&h1, &mut h2);
                relu(&mut h2);
                action3.apply(&h2, &mut out);
                relu(&mut out);
                out
            })
            .collect();
        Model {
            query1,
            query2,
            entity1,
            entity2,
            blocks,
            convert,
            table,
            actions,
        }
    }

    /// Scores every action for one observation. `entities` holds `ENTITY` values per entity.
    pub fn logits(&self, query: &[f64; QUERY], entities: &[f64]) -> [f64; ACTIONS] {
        let n = entities.len() / ENTITY;
        let mut hidden = [0.0; WIDTH];
        let mut x = [0.0; WIDTH];
        self.query1.apply(query, &mut hidden);
        relu(&mut hidden);
        self.query2.apply(&hidden, &mut x);
        relu(&mut x);

        let mut e = vec![0.0; n * WIDTH];
        for (row, out) in entities.chunks_exact(ENTITY).zip(e.chunks_exact_mut(WIDTH)) {
            self.entity1.apply(row, &mut hidden);
            relu(&mut hidden);
            self.entity2.apply(&hidden, out);
            relu(out);
        }

        let mut normed = [0.0; WIDTH];
        let mut keys = vec![0.0; n * 2 * WIDTH];
        let mut wide = [0.0; HIDDEN];
        for block in &self.blocks {
            let (wq, wkv) = (&block.wq, &block.wkv);
            block.norm1.apply(&x, &mut normed);
            let mut q = [0.0; WIDTH];
            wq.apply(&normed, &mut q);
            for (row, out) in e.chunks_exact(WIDTH).zip(keys.chunks_exact_mut(2 * WIDTH)) {
                block.norm2.apply(row, &mut normed);
                wkv.apply(&normed, out);
            }
            let mut attended = [0.0; WIDTH];
            let mut scores = vec![0.0; n];
            let scale = (HEAD as f64).sqrt();
            for h in 0..HEADS {
                let head = h * HEAD..(h + 1) * HEAD;
                let mut max = f64::NEG_INFINITY;
                for (s, kv) in scores.iter_mut().zip(keys.chunks_exact(2 * WIDTH)) {
                    let mut sum = 0.0;
                    for (a, b) in q[head.clone()].iter().zip(&kv[head.clone()]) {
                        sum += (a / scale) * b;
                    }
                    *s = sum;
                    max = max.max(sum);
                }
                let mut total = 0.0;
                for s in scores.iter_mut() {
                    *s = libm::exp(*s - max);
                    total += *s;
                }
                for (s, kv) in scores.iter().zip(keys.chunks_exact(2 * WIDTH)) {
                    let weight = s / total;
                    for (o, v) in attended[head.clone()]
                        .iter_mut()
                        .zip(&kv[WIDTH + h * HEAD..WIDTH + (h + 1) * HEAD])
                    {
                        *o += weight * v;
                    }
                }
            }
            let mut projected = [0.0; WIDTH];
            block.out_proj.apply(&attended, &mut projected);
            for (a, b) in x.iter_mut().zip(&projected) {
                *a += b;
            }
            block.norm3.apply(&x, &mut normed);
            block.linear1.apply(&normed, &mut wide);
            relu(&mut wide);
            block.linear2.apply(&wide, &mut projected);
            for (a, b) in x.iter_mut().zip(&projected) {
                *a += b;
            }
        }
        relu(&mut x);
        let mut embedding = [0.0; EMBED];
        self.convert.apply(&x, &mut embedding);
        let mut out = [0.0; ACTIONS];
        for (o, a) in out.iter_mut().zip(&self.actions) {
            let mut sum = 0.0;
            for (p, q) in a.iter().zip(&embedding) {
                sum += p * q;
            }
            *o = sum;
        }
        out
    }
}

/// Index of the first largest value, like `numpy.argmax`.
pub fn argmax(values: &[f64]) -> usize {
    let mut best = 0;
    for (i, &v) in values.iter().enumerate() {
        if v > values[best] {
            best = i;
        }
    }
    best
}
