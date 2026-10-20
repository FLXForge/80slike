# Tank: collection edition

## Presets and title

MODE cycles 16 presets: four arenas, two tank types and CPU or player-two opposition. Arena changes first, tank model every four steps, and opponent every eight. The menu retains the battlefield and two stationary tanks, and changing presets does not restart the music. START begins the selected battle. Input dismisses the English lore, which appears after eight idle seconds.

The three historical categories come from [Atari's Combat manual](https://atari.com/pages/combat): open field, easy maze and complex maze. These are adaptations rather than pixel-exact copies. Crossfire preserves the example's original four central barriers, shifted to accommodate the HUD. Classic forward/turn-only driving also follows the original input scheme.

## Combat and controls

Both sides begin with three tanks. Each effective shell hit destroys one tank, awards one hit to the shooter and schedules a replacement after one second. The victim then has three seconds of blinking protection. Both tanks also start protected during the 1.5-second opening pause. Protection ignores hits but keeps wall colliders active.

Player 1 uses the existing arrow keys / joystick 1 and action; player 2 uses WASD / joystick 2 and action. Keys remain in the shared controllers.input file. There is no control remapping in game scripts.

Classic human tanks move at 55 with rotation 120 degrees/second; the original CPU has its existing handicap (45 / 90). Advanced human tanks use 80 / 165; advanced CPU uses 70 / 145. Advanced tanks have a different tracked hull and turret, faster shells (190 instead of 150) and human-controlled reverse at 60% speed. Normal tanks keep the original no-reverse rule.

Player reloads are 0.65 seconds (classic) and 0.5 seconds (advanced). CPU reloads are 0.8 and 0.6 seconds. Shells expire after 3.2 seconds and are consumed by walls and tanks. Protected hits do not score. The CPU's original ray-based perception, remembered targets and obstacle avoidance are retained.

## HUD and result

The upper strip displays hit totals as large numbers, side labels and one miniature tank per remaining life. The arena starts below that strip. Exhausting a side's tanks opens the victory screen; simultaneous elimination is a stalemate. START offers a rematch, MODE returns to title. A player-one victory writes save("80slike", "tank", true); CPU/player-two wins do not overwrite or grant that achievement.

## Shared audio

Iron Orders is in games/commons/musics.json: low marching bass, square-wave phrase and restrained snare. The shared tank_fire effect is in commons/sounds.json. Engine rumble and explosions reuse existing shared sounds. The song and cannon are also available in the scrolling sound test.

## Structure and adjustment

- game.js: presets, manual respawns, match result and HUD.
- arena/main.json: shared boundaries; field0-field3.json: reusable obstacle layouts.
- tank/combat.js: shared stats, invulnerability and hit/life accounting.
- tank/player.js: shared player-one/player-two driving, reverse and reload.
- tank/enemy.js: original CPU logic, gated by combat phase.
- tank/player2.json: blue tank with player-two controls; advanced prefabs inherit their role's logic.
- menu/menu.js: title, lore and preset labels.

Native FLX 0.3.1 checks cover all 16 stationary previews, live map/model changes, idle lore, P2 turning/movement, advanced speed/reverse/projectiles, immunity, life loss and protected respawn, scoring, all victory cases, rematch reset, original CPU fire, achievement preservation and sound-test playback. Automated tests accelerate some protection timers; manual visual and balance review remains useful.
