use std::io::{self, Read, Write};
fn main() {
    let mut input = Vec::new();
    io::stdin().read_to_end(&mut input).unwrap();
    let mut out = io::BufWriter::new(io::stdout().lock());
    for bytes in input.chunks_exact(8) {
        let x = f64::from_le_bytes(bytes.try_into().unwrap());
        for value in [
            soccar_simulation::math::sin(x),
            soccar_simulation::math::cos(x),
            soccar_simulation::math::atan2(x, 1.0),
        ] {
            out.write_all(&value.to_le_bytes()).unwrap();
        }
    }
}
