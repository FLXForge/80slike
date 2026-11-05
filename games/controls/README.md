# HOW TO PLAY — collection controls

Standalone FLX 0.3.1 project with a native 320 × 180 output surface. The project
contains one runtime object, two views, code-drawn keys/controllers and pixel
labels. No images, external fonts, hub functions or external dependencies.

## Run and compile

From the directory containing `flx.exe` and the `80slike` checkout:

```powershell
.\flx.exe run .\80slike\controls.flx
.\flx.exe compile --output=.\80slike\controls.flxc .\80slike\controls.flx
.\flx.exe run-compiled .\80slike\controls.flxc
```

## Source files

- `controls.flx`: collection-style manifest; root resource `games/controls.json`.
- `machines/controls.yml`: 320 × 180, nearest-neighbour scaling, full UI palette;
  reuses `chips/input/80arcade.yml` and `chips/audio/asteroids.yml` unchanged.
- `games/controls.json`: root size, origin, visual and `delimit: true`, matching
  the viewport convention of collection games.
- `games/controls/runtime.js`: presentation, interaction and lifecycle.
- `games/controls/controllers.input`: exact copy of the collection mapping.

The native title uses `draw_text()`. Small labels use local 5 × 7 glyph patterns
drawn at 11 logical pixels high with public `draw_pixel()`, avoiding the known
FLX 0.3.1 small-text raster issue. These are UI glyph definitions, not a font
subsystem. Filled panels and device shells use public line/pixel primitives.

## Controls

| Input | Effect |
| --- | --- |
| Left or Right Shift / JOY1 Select | Toggle KEYBOARD / GAMEPAD |
| Enter / JOY1 Start | Continue: request `exit()` |
| Escape / Left Alt + Q | Back: request `exit()` |
| P1 arrows / JOY1 D-pad | Highlight P1 movement control |
| P1 Right Ctrl / JOY1 A | Highlight P1 action |
| P2 W A S D / JOY2 D-pad | Highlight P2 movement control |
| P2 Space / JOY2 A | Highlight P2 action |

P1 controls the hub and the games. P2 participates in compatible games. JOY2
does not acquire Start, Select or Back functionality. There is no mapped
gamepad Back button; the page explicitly shows the keyboard Back binding.
Holding Select does not cycle repeatedly. The page never exits on a timer.

## Embedded execution

Compile once and load `controls.flxc` through the host's public `FlxSession` API.
The compiled artifact contains the scene, script, mapping and Machine. It needs
neither source paths nor `flx.exe` at embedded runtime. The host owns its graphics
context and window and composes the borrowed 320 × 180 `session.output()` texture.
The script only calls `exit()`: it never closes a window or terminates a process.

Both Continue and Back produce `FlxSessionExitReason::ScriptRequestedExit`.
Public JavaScript `exit()` has no argument, so it cannot supply a separate
confirm/cancel reason. No save file, global-message protocol or engine extension
has been invented to work around that limitation. A host that must distinguish
the paths will need an explicitly agreed future contract.

## Verification

- Native validation and compilation without errors/warnings.
- Standalone compiled execution and real window inspection of KEYBOARD.
- Both final views and pressed-state rendering exported from the actual FLX
  session output at 320 × 180 and visually inspected.
- An isolated C++ harness loaded the final `.flxc` using existing FLX session
  libraries and a deterministic `PhysicalInputProvider`.
- All eight keyboard directions, both actions, both Shifts, all eight gamepad
  directions, both A buttons, JOY1 Select and Start were exercised.
- Checked held Select, unmapped JOY2 system buttons, Q alone, Alt+Q, Escape and
  Enter; verified no automatic exit and window survival across four sessions.

The harness and exported review images are development artifacts outside this
project. Neither the engine nor the hub was changed. A physical controller has
not been tested; physical device discovery/platform mappings remain to verify.
