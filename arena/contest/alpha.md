# Alpha

Alpha started as a copy of the classic bot. Every idea became a setting with the old behavior as its default,
so variants could race in one build through `arena/brains/alpha-*.brain` files. Ideas were screened at
200 matches (3v3, 300 s), first against `allstar` and, once alpha passed about 85%, head to head against alpha itself.

## What worked

| Change | Setting | Result when adopted |
| --- | --- | --- |
| Retreat to the far post, not the near post, when caught upfield of the ball | `farpost` | 54% vs allstar (600 matches) |
| Goalie role for the third car, lineup closer to the ball | `roles = 1`, `lineup = 0.2` | 64% vs allstar |
| No flips that send the ball toward the own goal mouth; steer around the ball on the retreat | `safeflip`, `avoid` | 69% vs allstar |
| Less time charged for turning in the reach estimate, so the bot commits earlier | `turn = 0.3` | 74% vs allstar |
| Goal-side goalie and supports attack the ball | `boxdist`, `supportbox` | 86-90% vs allstar; 67% vs the previous alpha |
| Goalie only joins inside 6000 of its goal | `boxdist = 6000` | 61% vs `boxdist = 4500` (400 matches), which beat "always" 63% |

The goal diagnostics that pointed the way: in classic mirror matches about 22% of goals were own goals,
mostly a defender upfield of the ball within 1500 of its own goal. After that, most goals against alpha came from
close range with its keeper and two or three defenders already goal-side but passive.

## What did not

Kickoff roles, shot aim at the near post, a reactive keeper on the predicted crossing point, shadow defense
when an opponent reaches the ball first, goalie boost runs, aerials off, other pace and turn values,
more upfield clears, and ball avoidance for every retreating car were all neutral or worse.

## Final

Against allstar at 3v3 over 200 matches: 98.5% wins, 7.46 to 1.80 goals per match. Brain time 131 ms per match against allstar's 167.
