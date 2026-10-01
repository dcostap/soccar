//! Ratings and significance tests on the Elo scale.

const ELO: f64 = 400.0 / std::f64::consts::LN_10;

/// Bradley-Terry fit by minorization-maximization. `games` holds (winner, loser) index pairs.
/// Each brain also plays one virtual win and one virtual loss against a fixed 0 Elo opponent,
/// which keeps unbeaten brains finite. Returns (Elo, standard error) per brain.
pub fn bradley_terry(count: usize, games: &[(usize, usize)]) -> Vec<(f64, f64)> {
    let mut wins = vec![1.0; count];
    let mut played = vec![vec![0.0; count]; count];
    for &(w, l) in games {
        wins[w] += 1.0;
        played[w][l] += 1.0;
        played[l][w] += 1.0;
    }
    let mut gamma = vec![1.0; count];
    for _ in 0..100_000 {
        let mut change: f64 = 0.0;
        for i in 0..count {
            let mut denominator = 2.0 / (gamma[i] + 1.0);
            for j in 0..count {
                if played[i][j] > 0.0 {
                    denominator += played[i][j] / (gamma[i] + gamma[j]);
                }
            }
            let next: f64 = wins[i] / denominator;
            change = change.max((next / gamma[i]).ln().abs());
            gamma[i] = next;
        }
        if change < 1e-10 {
            break;
        }
    }
    (0..count)
        .map(|i| {
            let p = |j: f64| gamma[i] / (gamma[i] + j);
            let mut information = 2.0 * p(1.0) * (1.0 - p(1.0));
            for j in 0..count {
                information += played[i][j] * p(gamma[j]) * (1.0 - p(gamma[j]));
            }
            (gamma[i].ln() * ELO, ELO / information.sqrt())
        })
        .collect()
}

/// Expected score of a player `elo` points stronger.
pub fn expected(elo: f64) -> f64 {
    1.0 / (1.0 + 10f64.powf(-elo / 400.0))
}
/// Elo difference for an expected score.
pub fn elo(score: f64) -> f64 {
    let s = score.clamp(1e-6, 1.0 - 1e-6);
    -400.0 * (1.0 / s - 1.0).log10()
}

/// Running statistics over paired games. A pair plays one seed with sides swapped,
/// so each sample is 0, 0.5, or 1 and side and kickoff luck cancel out.
#[derive(Clone, Copy, Debug, Default)]
pub struct Pairs {
    pub count: usize,
    pub sum: f64,
    pub squares: f64,
}
impl Pairs {
    pub fn add(&mut self, score: f64) {
        self.count += 1;
        self.sum += score;
        self.squares += score * score;
    }
    pub fn mean(&self) -> f64 {
        self.sum / self.count.max(1) as f64
    }
    fn variance(&self) -> f64 {
        let m = self.mean();
        (self.squares / self.count.max(1) as f64 - m * m).max(0.0)
    }
    /// Elo estimate with a 95% interval.
    pub fn elo(&self) -> (f64, f64, f64) {
        let m = self.mean();
        let margin = 1.96 * (self.variance() / self.count.max(1) as f64).sqrt();
        (elo(m), elo(m - margin), elo(m + margin))
    }
    /// Generalized sequential probability ratio test, normal approximation, for H0 elo0 against H1 elo1.
    pub fn llr(&self, elo0: f64, elo1: f64) -> f64 {
        let (s0, s1) = (expected(elo0), expected(elo1));
        // A floor on the variance stops a short unbeaten run from looking infinitely certain.
        let variance = self.variance().max(0.01);
        self.count as f64 * (s1 - s0) * (2.0 * self.mean() - s0 - s1) / (2.0 * variance)
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn bradley_terry_recovers_a_known_gap() {
        // 76% expected score is about 200 Elo.
        let mut games = vec![(0, 1); 760];
        games.extend(vec![(1, 0); 240]);
        let r = bradley_terry(2, &games);
        assert!(((r[0].0 - r[1].0) - 200.0).abs() < 5.0, "{r:?}");
        assert!(r[0].1 < 20.0);
    }
    #[test]
    fn elo_and_expected_are_inverse() {
        for x in [-300.0, -50.0, 0.0, 120.0] {
            assert!((elo(expected(x)) - x).abs() < 1e-9);
        }
    }
    #[test]
    fn llr_moves_toward_the_true_hypothesis() {
        let mut better = Pairs::default();
        let mut equal = Pairs::default();
        for i in 0..2000 {
            better.add([1.0, 0.5, 0.5, 0.0, 1.0][i % 5]);
            equal.add([1.0, 0.5, 0.0, 0.5][i % 4]);
        }
        assert!(better.llr(0.0, 20.0) > 2.94);
        assert!(equal.llr(0.0, 20.0) < -2.94);
    }
}
