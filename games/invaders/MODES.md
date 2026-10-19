# Invaders: title and modes

The root state machine runs menu → announce → playing, with respawn and result states. All gameplay actors respect invaders_phase; timer-driven attacks pause during respawn.

## Title

MODE cycles Classic, Assault and Breakaway. START records the selection and begins a new run. After eight seconds without player-one input, the mode description gives way to the English lore; another idle interval restores the options. Input dismisses the lore. The three alien previews reuse the fleet's visual prefabs with collisions disabled.

Cosmic Side Step is defined inside games/commons/musics.json and is the sixth music selection in the sound test. Existing compositions are unchanged.

## Shared run rules

- Three lives, score and wave number shown in the HUD.
- An initial 1.6-second wave announcement; movement and attacks wait until it ends.
- A normal player death costs one life. The formation and shield damage persist. Projectiles are cleared and the replacement ship waits through a 1.4-second pause.
- The ship has 3.5 seconds of protection from birth, covering the pause and about two seconds of active play. It blinks during active protection.
- Clearing every alien, including detached attackers, starts the next wave without a level cap. Score and remaining lives persist. Each wave restores the formation and four protectors.
- The fleet crossing the player's Y line is an invasion and ends the run, regardless of remaining lives. Individual diving attacks can cost one life but do not count as formation invasion.
- At GAME OVER, START restarts the selected mode; MODE returns to title. System exit works in all states.

## Modes and progression

Classic preserves the formation's side-to-side movement and 8-pixel descent. Fleet speed is 30 × min(2, 1 + 0.08 × (wave − 1)) × (1 + 2 × (1 − survivors/66)). The march tempo also responds to survivor count and wave. First alien shots use 1–24 seconds; repeats use 18–36 seconds.

Assault uses the same movement rule but first shots use 1–12 seconds and repeats 7–16 seconds. Enemy projectile speed starts at 215 instead of 160. It increases pressure through firing and projectile speed, not an additional formation-speed multiplier.

In all modes, firing intervals divide by min(2, 1 + 0.07 × (wave − 1)), and enemy projectile speed multiplies by min(1.45, 1 + 0.035 × (wave − 1)).

Breakaway uses the Classic formation fire rules. Individual aliens detach, follow a curved attack towards the player's recorded X position, and return to their original slot in the moving formation. A flight lasts about 4.6 active seconds and pauses with the game. Two aliens may attack simultaneously initially, rising to three from wave 5. Divers shoot every 0.65–1.1 seconds. Destroying one releases its attack slot.

## Adjustment points

- game.js: state transitions, wave/respawn pauses, lives, wave reset policy.
- menu/menu.js: lore, labels, idle delay and title drawing.
- invader/fleet.js: formation speed, invasion boundary and march tempo.
- invader/invader.js: shooting intervals, diving paths, concurrency and return.
- invader/laser.js: enemy projectile speed and progression.
- player/player.js: protection and player death handling.

## Validation

Native FLX 0.3.1 runs cover title idle/MODE, Classic waves 1–3 and survivor acceleration, three-life loss and restart, frozen formation and frozen diver during respawn, protection, persistent score/shield damage, new-wave reset, Assault shooting/speed, Breakaway detach/return/concurrency/slot release and invasion defeat. The theme is also played through sound test alias m6. These are automated functional checks; the feel and balance still need manual play.
