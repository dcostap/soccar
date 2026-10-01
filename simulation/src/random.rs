#[derive(Clone, Debug)]
pub struct Random {
    pub state: u32,
}
impl Random {
    pub fn new(seed: u32) -> Self {
        Self { state: seed }
    }
    pub fn next_f64(&mut self) -> f64 {
        self.state = self.state.wrapping_mul(1664525).wrapping_add(1013904223);
        self.state as f64 / 4294967296.0
    }
    // TODO(post-port): Replace the inconsistent random sort with a normal seeded shuffle.
    // V8 uses run detection and binary insertion for this ten-name array.
    // Preserve the random draw count during parity. The names do not affect physics.
    pub fn names(&mut self) -> [usize; 10] {
        let mut names = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        let descending = self.next_f64() - 0.5 < 0.0;
        let mut end = 2;
        while end < 10 {
            let less = self.next_f64() - 0.5 < 0.0;
            if less != descending {
                break;
            }
            end += 1;
        }
        if descending {
            names[..end].reverse();
        }
        for start in end..10 {
            let pivot = names[start];
            let mut left = 0;
            let mut right = start;
            while left < right {
                let mid = left + (right - left) / 2;
                if self.next_f64() - 0.5 < 0.0 {
                    right = mid;
                } else {
                    left = mid + 1;
                }
            }
            for i in (left..start).rev() {
                names[i + 1] = names[i];
            }
            names[left] = pivot;
        }
        names
    }
}
