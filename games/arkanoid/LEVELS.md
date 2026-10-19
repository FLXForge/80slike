# Level design and maintenance

The active game uses one level prefab (levels/level.json), one controller (levels/level.js), one shared layout palette (levels/common/layout.json), and 15 native FLX grid patterns (levels/layouts/01.json through 15.json). Root game progression spawns the same level and selects its layout by number. No JavaScript grid construction is needed.

Act boundaries are design guidance only and never appear in the game: levels 1-5 teach ordinary patterns, 6-10 introduce armor and corridors, and 11-15 combine complex patterns and stronger armor.

| Level | Design | Bricks | Grey | Gold | Hits to clear |
| --- | --- | ---: | ---: | ---: | ---: |
| 1 | First contact | 45 | 0 | 0 | 45 |
| 2 | Open lanes | 45 | 0 | 0 | 45 |
| 3 | Steps | 60 | 0 | 0 | 60 |
| 4 | Twin towers | 55 | 0 | 0 | 55 |
| 5 | Prism | 80 | 0 | 0 | 80 |
| 6 | First armor | 90 | 22 | 0 | 112 |
| 7 | Channels | 51 | 17 | 0 | 68 |
| 8 | Chambers | 60 | 22 | 0 | 82 |
| 9 | Switchbacks | 64 | 27 | 0 | 91 |
| 10 | Fortress | 71 | 47 | 16 | 150 |
| 11 | Golden weave | 90 | 25 | 14 | 143 |
| 12 | Nested vaults | 91 | 54 | 15 | 175 |
| 13 | Crossfire | 90 | 55 | 15 | 175 |
| 14 | Citadel | 102 | 61 | 21 | 205 |
| 15 | The Brick Warden | 114 | 92 | 22 | 250 |

## Editing layouts

Each pattern has 15 columns. Palette keys are R, B, C, Y and V for ordinary colors, silver for two hits, gold for three, and gap for an empty cell. A gap is a manual invisible template, so FLX leaves that grid cell empty. Grid cells are 35 by 14; brick bodies remain 30 by 10, leaving gaps. The playing layout begins at (65,65). Avoid adding rows below y=220 without reviewing clearance above the paddle.

Grey and gold retain their armor colors in both modes. Their ordinary stage uses the mode's normal palette. The final Brick Warden is an original arcade robot face, containing 92 grey and 22 gold bricks.

The earlier level1-level4 files are retained as historical references and are no longer wired into the active root.

## Damage and progression

Ball and laser contacts enqueue damage on the brick. Only levels/common/brick.js owns health, color transitions, drops, score and the remaining-brick counter. Gold becomes grey, then ordinary, then disappears. Intermediate hits do not decrement the counter, award score or drop capsules. Multiple hits can be processed together, and each destroyed brick awards 100 points once. Pierce delivers one damage per pass rather than once per frame while inside a brick.

A level ends when its actual remaining-brick count reaches zero. Completing level 15 writes save("80slike", "arkanoid", true). Losing does not overwrite achievements. Game over displays the reached level, score and style for four seconds; victory displays all 15 levels cleared for eight seconds. START returns to title after the first second.

## Validation

FLX 0.3.1 validation and accelerated native runs cover all 15 layouts in both modes, identical coordinates, actual counts and health totals, ball and laser armor hits, final scoring, victory, save timing and preservation, new runs, three-life defeat and return to title. Focused checks cover the full gold-to-grey-to-normal progression and Pierce's one-hit-per-contact rule. The automated run clears remaining bricks through the shared damage path and accelerates transitions; it does not replace a complete manual balance playthrough.
