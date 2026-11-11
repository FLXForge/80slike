# Frogger — 80's Like Collection

FLX 0.3.1. Entirely procedural FLX objects, geometry, immediate drawing and generated audio. No sprites, external libraries, engine changes or private runtime APIs.

## Launch and layout

Launch `flx.exe run frogger.flx` from the collection directory.

- `frogger.flx` points to `games/frogger.json`.
- `games/frogger/` contains all game objects and behavior.
- Shared music: `games/commons/musics.json`, `the_other_side`.
- Shared effects: `games/commons/sounds.json`, keys prefixed `frogger_`.
- Sound test: music `m8`, effects `fx17` through `fx22`.

## Controls and modes

Shared `controllers.input` mapping; no game-specific key overrides. P1 uses arrows / joy 1, P2 WASD / joy 2. Directions hop; holding repeats with a 0.17 second cooldown. No action button is required. MODE changes the title preset; START plays. EXIT closes the game. On the result screen START retries and MODE returns to the title.

1. **Classic:** four traffic lanes, a safe median, four river lanes, five homes. Turtles remain afloat. 55 seconds per crossing.
2. **Rush Hour:** 32% faster vehicles and platforms, 35 seconds per crossing.
3. **Wild River:** classic pacing, warning flashes before turtles dive, crocodiles with lethal heads, a snake patrolling the median.
4. **Two Frogs:** simultaneous cooperation with the Wild River hazards. Shared homes; independent scores, timers and three lives each. Frogs do not collide with each other. An eliminated teammate stays out, while the surviving player can complete the game.

Each crossing awards 10 points for each new highest row, plus 100 and twice the remaining whole seconds on reaching a free home. Occupied homes and the bank between homes are unsafe. Each lost life resets that player's crossing timer and returns them to the starting verge after a brief pause. Traffic and river hazards remain in motion while the other player continues.

Five homes finish a round. There are five rounds, each 12% faster than the first, with a short pause and a new board between rounds. Lives and scores carry over. Completing round 3 writes `save("80slike", "frogger", true)`; completing round 5 shows victory. Losing all active players shows game over.

The title alternates its instructions and original English lore after eight seconds without input. Music is an original three-voice composition, **The Other Side**, with a bouncing pulse melody and triangle bass/arpeggio. It stops when play starts.

## FLX implementation

- JSON declares native objects, component lifetime, colliders, depth, music, sounds and the root state machine.
- `runtime.js` groups named role functions and small shared helpers in one documented behavior script context. FLX behavior entries have isolated lexical scopes; no cross-script globals or invented imports are used.
- Native direct Mechanics with `step: 24` quantizes each frog movement. A single `move_horizontal` or `move_vertical` operation is issued per hop. Runtime speed is scaled by the frame delta so the operation is one full step regardless of frame rate. The timed pose is visual only.
- Vehicles and platforms move through native direct Mechanics. Frog contacts are directed native box collisions. `carry(frog, platform)` applies transport once per frame; frog support is confirmed by the preceding collision pass. Water is a lane rule, not an invisible collision engine.
- Partial platform contact does not count as support. Crocodile heads are resolved within their native platform contact. Diving turtles disable their native collider only after a visible warning.
- World objects, menu and HUD have explicit depths. MODE replacement kills the board component; component descendants follow native lifetime cleanup. Every child declaration has a unique logical name.
- Runtime references are never stored across hooks. Persisted local/global values are numbers, strings or booleans.
- World-sized backgrounds are declarative rectangles; procedural details use public `draw_*`. Filled detail helpers emit scan lines because `draw_rectangle` is outline-only. Text is at least 11 logical units.

## Verification

Validated and exercised with FLX 0.3.1. An isolated native test project checked all four menu presets, idle lore, board cleanup, independent P2 step input, road contacts, one life lost per hit, respawn, native carry, drowning, occupied homes, timeout, crocodile heads, surviving co-op players, round difficulty and reset, the round-3 save, victory and game over. Separate native checks cover diving warnings, snake contact, result controls and all new sound-test entries. Test-only input injection and save data are not installed in this game.

Visual balance and the feel of a full human playthrough remain subject to collection playtesting.
