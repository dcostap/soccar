# Goal geometry audit

This audit used the 16 local DFH Stadium Soccar collision meshes.
No mesh data forms part of the repository.

## Mesh measurements

The mesh scale is 50 UU per stored unit.
The goal mouth starts near 896 UU at most measured heights.
The flat inner side is near 896 UU.
Its field face is near 904 UU and 5120 UU.
The lower field ramp varies across the goal width.
It is near 96 UU at the center and 160 UU across much of the end wall.

The committed analytic geometry uses a 893 UU half-width.
It grows its lower ramp from 5.12 UU to 256 UU across the goal edge.
That approximation creates a large car error near the post.

The local probe compared 48 exterior points at or inside 850 UU.
Unsigned surface-distance RMS error was 4.95 UU.
Peak error was 15.33 UU.

## Rejected broad fit

A prototype changed the goal half-width to 896 UU and goal height to 640 UU.
It added an 8 UU mouth bevel and used a 96 UU inner corner.
It also fitted the measured lower-ramp radii across the end wall.

On the original 78 cases, peak `drive-goal-edge` position error fell from 404.78 to 100.21 UU.
Peak rotation error fell from 119.04 to 25.94 degrees.
Peak `ball-post` position error fell from 143.88 to 100.33 UU.
The same 48 surface probes fell from 4.95 to 1.15 UU RMS.

The wider goal suite found important regressions.
It uses 96 mirrored car and ball paths across both goals.

| Subject | Measure | Before | Prototype |
|---|---:|---:|---:|
| Car | Median peak position error | 343.78 UU | 73.91 UU |
| Car | Mean peak position error | 358.35 UU | 139.37 UU |
| Car | Worst peak position error | 847.26 UU | 424.95 UU |
| Ball | Median peak position error | 70.49 UU | 43.66 UU |
| Ball | Mean peak position error | 241.05 UU | 176.77 UU |
| Ball | Worst peak position error | 917.36 UU | 833.94 UU |

Only 38 of 48 car cases improved. Only 24 of 48 ball cases improved.
One 1,500 UU/s car case at 830 UU rose from 133.22 to 424.95 UU.
One 150 UU-high ball case at 830 UU rose from 304.43 to 387.47 UU.

The prototype is not in the game.
Its patch and reports remain under ignored `artifacts/rocketsim-diff/`.
The next geometry model must keep the measured surfaces without one broad signed-distance blend.
