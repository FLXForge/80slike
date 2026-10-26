# E-Merge Identity

Run from the project root: `flx run e_merge.flx`.
Enter replays the sequence; Escape closes it. The completed logo stays visible.

The manifest intentionally omits `machine=`: FLX 0.3.1 supplies its internal
640 x 480 machine. A white root rectangle supplies the background. The official
1285 x 491 design is fitted proportionally, without stretching or cropping.

## Files

- `geometry.js`: traced vector contours, pixel lettering, four valid glider
  generations, aligned grid levels, camera and drawing helpers.
- `sequence.js`: timing, replay and four synthesized audio events.
- `../e_merge.json`: single runtime object and resource bindings.
- `../commons/e_merge.json`: native generated tones, also bound in Sound Test.
- `controls.input`: complete mapping for the default machine.

The JavaScript files use separate FLX script scopes. They communicate only
through the object's `elapsed` local value. No hub or game behavior is needed.

## Timeline (seconds)

| Time | Sequence |
| --- | --- |
| 0–0.9 | Four Conway glider states in a small visible grid |
| 0.9–3.35 | Continuous exponential pullback, progressive brand reveal |
| 3.1–3.65 | Last cells fill; grid fades away |
| 3.75–4.47 | Pixel GAMES cycles red/green/blue; four-note signature |
| 4.47–5 | Solid red descriptor and final hold |

`BRAND` is measured in reference-image coordinates. `draw_brand(view)` also
draws the static mark. `DESCRIPTOR` stores the custom 7-row pixel glyphs;
it does not depend on the engine's text font. `VIEW.scale` controls the fit.
The paired diagonal strokes and disconnected bars are deliberate brand shapes.

FLX 0.3.1 exposes immediate lines and rectangle outlines, but no immediate filled
polygon function. `fill_polygon()` therefore emits clipped horizontal line spans
using public `draw_line()`. The runtime contains one object, no image assets,
no particles, no random numbers and no generated cell objects.

To extract the project, copy `e_merge.flx`, `games/e_merge.json`,
`games/e_merge/` and `games/commons/e_merge.json`, preserving these paths.
The preview images and test harness used during development are not runtime files.
