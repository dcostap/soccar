export function seededRandom(seed) {
  return () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
}

function scenario(
  name,
  pos,
  vel = [0, 0, 0],
  spin = [0, 0, 0],
  ticks = 1200,
  frozen = false,
) {
  return {
    name,
    ticks,
    state: [...pos, ...vel, ...spin, 91.25, 30, 0, Number(frozen)],
  };
}

export function ballCases() {
  const cases = [
    scenario("rest-five-minutes", [0, 0, 93.15], undefined, undefined, 36000),
    scenario("free-fall", [0, 0, 1800]),
    scenario("floor-spin", [200, -400, 94], [1700, -600, -900], [2, -3, 1]),
    scenario("side-wall", [4000, 0, 800], [2300, 400, 100], [0, 2, -1]),
    scenario("end-wall", [1800, 5000, 800], [0, 2600, 0]),
    scenario("ceiling", [100, 200, 1950], [700, 300, 1200]),
    scenario("corner", [3500, 4000, 240], [2200, 1800, -200], [1, 1, 1]),
    scenario("blue-goal", [0, 4900, 180], [100, 2600, 0]),
    scenario("orange-goal", [0, -4900, 180], [-100, -2600, 0]),
    scenario("goal-post", [850, 5050, 160], [500, 2000, 0]),
    scenario("goal-crossbar", [0, 5080, 600], [0, 1800, 300]),
    scenario("goal-back-lower", [50, 5900, 100], [200, 1800, -600], [1, 2, 3]),
    scenario("goal-back-upper", [50, 5900, 500], [-200, 1800, 600]),
    scenario("speed-clamps", [0, 0, 1000], [8000, -9000, 7000], [9, 8, 7]),
    scenario(
      "frozen-clamps",
      [0, 0, 1000],
      [8000, -9000, 7000],
      [9, 8, 7],
      8,
      true,
    ),
    scenario("negative-zero", [-0, -0, 93.15], [-0, -0, -0], [-0, -0, -0], 8),
    scenario("floor-penetration", [0, 0, -10], [500, 100, -30]),
  ];
  const random = seededRandom(0x50ccab);
  const range = (low, high) => low + random() * (high - low);
  for (let i = 0; i < 64; i++) {
    cases.push(
      scenario(
        `seeded-${i}`,
        [range(-4096, 4096), range(-6004, 6004), range(0, 2044)],
        [range(-6000, 6000), range(-6000, 6000), range(-3000, 3000)],
        [range(-6, 6), range(-6, 6), range(-6, 6)],
        720,
      ),
    );
  }
  return cases;
}
