# Adventure — 80's Like Collection

An original procedural presentation of the room-based Atari Adventure concept, built entirely with the public FLX 0.3.1 JSON and JavaScript contracts. No sprites, imported music, engine changes, private APIs or third-party runtime libraries.

## Files and launch

- Run `flx.exe run adventure.flx` from the collection directory.
- Root manifest: `adventure.flx`; root object: `games/adventure.json`.
- All game objects, rooms, behavior and this document: `games/adventure/`.
- Shared original title music: `games/commons/musics.json`, `call_of_the_chalice`.
- Shared effects: `games/commons/sounds.json`, names prefixed `adventure_`.
- Sound test: music `m9`; ten effects `fx23` through `fx32`.

## Controls

The collection's shared `controllers.input` is used unchanged. Directions move. Touch an object with empty hands to pick it up. ACTION drops the carried object; each hero can carry only one. A short pickup cooldown prevents immediate re-grabbing. The sword protects through its actual contact in front of its bearer; there is no separate attack button. Turn toward a dragon to present the blade.

MODE cycles title presets; START begins. On result screens START begins a fresh quest and MODE returns to the title. EXIT closes the game. P1 uses arrows / joy 1 and its mapped action button; P2 uses WASD / joy 2 and its mapped action button.

## Modes

1. **Quest:** fixed kingdom and item placements. Return the chalice to the dais in the Golden Hall.
2. **Lost Kingdom:** gold key, bridge, sword and magnet begin in distinct random rooms in the reachable outer kingdom. The white key stays beyond the river; the black key stays in the White Vault; the chalice stays in the Black Vault. This guarantees an unbroken dependency chain while changing the early exploration.
3. **Dragon Hunt:** all three dragons must be defeated before delivering the chalice. Dragons are slightly faster and follow the room graph toward the current screen while offscreen. A trail message announces their arrival.
4. **Two Heroes:** simultaneous co-op in one room. Each hero has three lives and one inventory slot. Share objects by dropping them. Living heroes must gather at the same exit to change rooms. An eliminated hero stays out while the survivor can continue the quest.

The title swaps its instructions for English lore after eight seconds without input. Music is an original 16-bar, three-voice medieval adventure theme, **Call of the Chalice**, with a herald-like pulse melody, a grounded triangle bass and a plucked triangle arpeggio. Its wider second phrase and final cadence provide an epic call-and-response. It stops when the quest begins; exploration uses quiet surroundings and event cues.

## Kingdom and progression

There are 18 fixed screens. Exit order in `AD_ROOMS` is north, east, south, west; every connection is reciprocal. Names and palettes act as landmarks. Three matching keys open the three castle courts permanently for the current quest.

| Room | Name | Principal role |
| --- | --- | --- |
| 0 | Golden Hall | Chalice destination |
| 1 | Golden Court | Starting court and gold gate |
| 2 | Windward Meadow | Eastern route |
| 3 | Watchwood | Western route |
| 4 | Crossroads | Southern hub |
| 5 | Sunlit Ruins | Gold key; yellow dragon |
| 6 | Old Well | Bridge |
| 7 | Fallen Grove | Sword |
| 8 | Mirror Mere | River crossing |
| 9 | Southern Fen | Route to Black Court |
| 10 | Silver Road | Route to White Court |
| 11 | Hollow Oak | Magnet |
| 12 | White Court | White gate |
| 13 | White Vault | Black key |
| 14 | Moon Maze | White key; green dragon |
| 15 | Black Court | Black gate |
| 16 | Forgotten Shrine | Optional magnet secret |
| 17 | Black Vault | Chalice; red dragon |

The essential sequence is bridge -> white key -> black key -> chalice. The gold key independently opens the destination. The sword and magnet are helpful tools. The magnet attracts nearby loose items while respecting their native wall collisions. Carry it near the Forgotten Shrine inscription for a small secret.

Water at Mirror Mere blocks passage except at its central gap. Carry the bridge through the gap or drop it near the crossing to place it there. A bridge dropped close to that location snaps to a stable position spanning the river, allowing a hero to bring another object across. Ordinary walls remain solid; no whole-object collider is disabled to bypass the river.

## Creatures and lives

- **Yorgle:** yellow, slowest, retreats from a sword at greater distance.
- **Grundle:** green, guards the white key and tolerates a closer sword before retreating.
- **Rhindle:** red, fastest and does not flee from the sword.
- Dragons show a visible warning and sound before a bite becomes dangerous. A lost life drops the carried item and returns the hero to that room's entrance after a pause, followed by temporary protection. Gates, dropped items and defeated dragons persist. Three lives per hero; all heroes eliminated ends the quest.
- The bat roams accessible neighboring rooms. It can steal a loose or carried object, carry it away and leave it in a reachable room before departing. It cannot steal the bridge or enter the river/maze branch, preventing a lost bridge from stranding a hero. It does not enter unopened castle interiors from their courts. Object delivery reuses an existing object when present, avoiding duplicates.

Delivering the chalice inside the Golden Hall wins, subject to the extra dragon requirement in Dragon Hunt, and writes `save("80slike", "adventure", true)`. A fresh quest resets the kingdom and lives. The collection completion save is never cleared by the game.

## Native FLX structure

- JSON declares root states, scene components, 18 room layouts, wall/gate colliders, directed actor contacts, direct Mechanics, visual depths and shared audio bindings.
- Scene replacement kills one component root, allowing native component lifetime cleanup to remove the old room and actors.
- All room child names are unique. Root/menu/HUD depths are explicit; later scene creation cannot cover the menu.
- `runtime.js` uses named role functions in one script context. FLX behavior entries isolate their JavaScript scopes; no invented imports or cross-script lexical globals are assumed.
- Persistent world data is stored as scalar global values: room, position, owner, gate and defeated flags. Runtime objects are resolved in the current hook; wrappers are not kept between hooks.
- Carried objects are constructed at the incoming hero's position, so their first collision pass cannot occur at an old room coordinate.
- Wall and gate response uses `CollisionContact` with native `position(object, contact)`. Dropped items also resolve native wall contacts, preventing equipment from becoming embedded in masonry.
- The river is a specific gameplay rule applied to its central named gap. Dragon navigation between rooms uses the small explicit room graph; within a room, native movement and contacts govern pursuit and sidestepping.
- Background fills and collision walls are native representations. Procedural geometry, details, characters and effects use public `draw_*`; scan-line helpers fill small shapes because `draw_rectangle` is outline-only. Display text is at least 11 logical units.

## Verification

FLX 0.3.1 validation and isolated native runtime tests exercise all title presets and lore, every room layout, object pickup and persistence, key gates, a real room exit, safe drops against walls, carried and placed bridge crossings, all three sword/dragon contacts, chalice completion and save, independent P2 controls, shared exits, item exchange and inventory capacity, magnet attraction, shrine reveal, bat theft and delivery, bridge protection, bite warning, damage, protected respawn, game over, offscreen hunt pursuit, the extra Hunt victory requirement, result controls and replay. Audio playback is checked through the sound-test bindings.

A separate layout check confirms reciprocal exits, unique declaration names, routes wide enough for a hero to reach every exit and starting object, the river's bridge requirement, and progression tiers across 1,000 randomized starts. These static checks complement native contacts; they are not shipped as a replacement collision system.

Tests and their isolated save files are not installed in the collection. Visual taste and full human-playthrough balance remain part of collection playtesting.
