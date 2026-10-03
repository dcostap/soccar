# Archived recorded set pieces

The active loader reads only `arena/scenarios/*.txt`.
It does not load files in this archive.

`before-powerslide-5/` preserves the old `user-attack` and `user-defend` suites without changing their clip data.
Those clips use earlier physics versions.
The current engine rejects them rather than changing their recorded action.

Use source commit `8b46ba9` to build the last engine before the powerslide-rate change.
That engine also accepts the preceding save-rule recordings under its narrow compatibility rule.
Keep these files for review or recovery with a matching engine.
Do not change clip fingerprints to make them load under newer physics.
New player contributions belong in fresh active suites.

Local old results and browser exports are in `artifacts/archive/before-powerslide-5/`.
Browser-stored recordings remain available for download; their engine versions do not change.
