# Pitfall — 80's Like Collection

A compact reinterpretation of the original surface-and-tunnel jungle adventure for FLX 0.3.1. This edition has 24 connected screens and 18 treasures, rather than reproducing the original game's entire 255-screen world. All visuals and audio are procedural FLX resources; no sprites, external libraries, engine modifications or private APIs.

## Files and launch

- Launch `flx.exe run pitfall.flx` from the collection directory.
- Root manifest: `pitfall.flx`, pointing to `games/pitfall.json`.
- Game definitions, rooms and behavior: `games/pitfall/`.
- Original title composition: `games/commons/musics.json`, `under_the_canopy`.
- Nine shared effects in `games/commons/sounds.json`, keys prefixed `pitfall_`.
- Sound Test adds music `m10` and effects `fx48` through `fx56`. Existing bindings remain intact.

## Controls

Uses the collection's shared `controllers.input` without overrides. P1: arrows / joy 1 and the mapped action button (Right Control / joy A). P2: WASD / joy 2 and its mapped action button (Space / joy A).

- Left/right: run; limited air steering preserves momentum after a vine release.
- ACTION: jump. Hold it, or make contact shortly after jumping, to grab a vine.
- While hanging: DOWN or a new ACTION press releases the vine, inheriting its tangential velocity.
- At a ladder: DOWN descends; UP climbs. Reaching the surface steps the explorer out of the opening onto solid ground. Releasing the direction can stop midway on the ladder.
- START: start, pause/resume, or retry on the result screen.
- MODE: change title preset or return to the title from a result screen.
- EXIT: close the game.

Jump input is buffered for 0.12 seconds and allowed for 0.075 seconds after leaving a supported edge. Jumping is triggered by a press, not automatically repeated by holding ACTION.

## Modes

1. **Expedition:** 20 minutes, three lives, 18 treasures.
2. **Time Trial:** the same connected world with an eight-minute deadline.
3. **Wild Jungle:** 12 minutes, faster logs and scorpions, quicker vine swings and crocodile cycles.
4. **Jungle Relay:** two players cooperate by taking turns after a lost life. Three lives each, one shared treasure map and timer, and individual scores combined in the HUD. An eliminated player is skipped. One explorer is active on screen at a time; this is not simultaneous co-op.

The title switches to original English lore after eight idle seconds. The original three-voice title theme, **Under the Canopy**, uses a plucked triangle melody, quiet pulse bass and restrained noise percussion. It stops when play begins.

## World and objectives

Surface exits advance one screen. Underground exits advance three screens. Both directions wrap around the 24-screen world. Jump height and velocity persist across screen changes, so crossing an edge during a jump does not snap the explorer to the floor.

Eighteen screens have treasure; screens 1, 6, 11, 15, 20 and 24 do not (displayed numbering). Treasure stays collected across room visits and relay handoffs. Bags, silver bars, gold bars and rings award 2,000 / 3,000 / 4,000 / 5,000 points. The expedition starts with 2,000 points assigned to P1. Scores cannot fall below zero.

Collecting six treasures writes `save("80slike", "pitfall", true)`. Collecting all eighteen wins and writes the same completion flag. A fresh expedition resets its world, scores and lives but does not clear the hub's completion flag.

Ladders connect surface and tunnels on most screens. Walking into a ladder opening instead of descending deliberately causes a fall into the tunnel and a one-off 100-point deduction. Some tunnel screens have a wall requiring a different route or a return to the surface.

## Hazards and checkpoints

- **Rolling logs:** lose 75 points per contact interval, with a short interruption of movement. They do not cost a life.
- **Fire, snakes and scorpions:** native contact costs a life. Scorpions patrol underground and resolve native wall contacts before reversing direction.
- **Water:** permanently open; cross using the vine or crocodile backs. Water remains lethal during temporary enemy protection.
- **Timed pits:** 3.8 seconds closed followed by 3.2 seconds open. Visible cracks warn during the last second before opening. The support and danger colliders alternate; no invisible support remains over an open pit.
- **Crocodiles:** their backs are supporting surfaces; their heads become dangerous when their jaws open. Each mouth has a phase offset. Jump and choose a landing position rather than treating the whole pool as a continuous bridge.
- **Vines:** an analytic pendulum, 118 units long, with a visible handhold. The explorer attaches only while airborne and within a native contact. DOWN or a new jump press releases with the pendulum's current velocity. A short re-grab lock prevents accidental immediate attachment.

Losing a life freezes the scene briefly, then respawns at the safe entrance checkpoint of the current screen and its entry level. Temporary protection lasts two seconds against enemy/contact hazards; water and falling out of the world remain lethal. The relay changes active player at that point. Losing every available life or reaching the time limit shows game over.

Pausing freezes the expedition timer, physics and hazard cycles. Decorative fireflies and menu/result presentation may continue animating.

## FLX implementation

- JSON declares the root state machine, component scene lifetime, 24 room layouts, native colliders, direct Mechanics, explicit visual depths and audio bindings.
- `runtime.js` holds shared data and named role functions in one script context; separate FLX behavior entries do not share lexical scopes.
- Game code integrates vertical velocity and gravity, then uses public `apply_velocity` and `advance`. It does not mutate RuntimeObject fields or substitute a separate collision engine.
- Native contact normals determine floor support, ceiling hits and wall response. A current/previous frame support marker avoids inventing a persistent contact API.
- The pendulum and its release are gameplay mathematics. The explorer is guided to the handhold while hanging; an object ID, not a RuntimeObject wrapper, is retained between hooks.
- Timed floors and mouths use declared colliders with `collider_on` / `collider_off`. Initial collider state is established during `born`, before the first collision pass of a newly loaded room.
- Killing the scene component removes its descendants through native lifetime rules. Child names include their room index to prevent cross-layout name reuse.
- Menu, HUD, terrain and actors have explicit depths. Filled terrain is declarative; characters, rope, foliage and small effects use public immediate drawing. Text is at least 11 logical units.
- World progress and gameplay state persist only as scalar global/local values. Test input hooks, development checks and isolated saves are not installed in the collection.

## Verification

Native FLX 0.3.1 checks cover title modes and lore; floor support; jump height and landing; holes and their one-off penalty; both ladder directions; real underground exits; all 24 layouts; timed pit support, warning, opening and damage; checkpoint protection; a real jump into a vine, swinging, release and far-bank landing; pause/resume; all treasure contacts; completion milestone and victory.

A separate native suite covers relay handoffs, P2 movement, shared treasure persistence and scoring, crocodile support and mouth danger, log penalties, tunnel walls, scorpion wall response and damage, water during immunity, game over, time expiry and result controls. Audio checks exercise the new music and every new sound through Sound Test.

This is ready for collection playtesting. Human feedback is still needed on visual taste, jump feel, route discovery and final difficulty.
