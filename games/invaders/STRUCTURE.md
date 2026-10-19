# Invaders: initial collection structure

The game uses the collection's 640 × 320 logical screen and existing player-one controls.

- Formation: 11 columns × 6 rows, with two rows each of squid (cyan), crab (green) and octopus (pink). The request's row breakdown summed to seven; this version keeps the stated six-row total.
- Alien silhouettes are built from native FLX filled geometry strips. All three types reuse `invader/invader.json` and its shooting logic. Each alien awards 100 points. Alien firing uses FLX timers: a first delay of 1–24 seconds and later delays of 18–36 seconds, randomized independently per alien. This avoids fractional probabilities, which FLX 0.3.1 truncates to integers.
- Fleet movement uses surviving aliens' bounds, reverses at the sides, descends 8 pixels per turn and destroys the player when the bottom of any surviving alien reaches the player ship's actual Y position, independently of its column. A downward step crossing that line is checked in the same frame.
- UFO: one at a time in the top lane, 500 points. First visit after 12–20 seconds; later visits are separated by 18–28 seconds. It disappears on leaving the screen. It fires downwards after 0.8–1.4 seconds, then every 1.5–2.4 seconds while inside the screen.
- Player: central firing triangle plus two attached reactor triangles. Moving left emits a short trail from the right reactor, and moving right uses the left one. Trails expire independently. Destroying the player removes its reactor parts.
- Four protectors reuse `shield/formation.json`: six rows × fourteen columns of 6-pixel cells, with an arched outline and a lower opening. Each protector contains 68 destructible squares, 272 in total.
- Both player and enemy shots remove one protector square and are consumed. Aliens also destroy every protector square they overlap without being destroyed themselves. Protectors award no points. Collision guards prevent a single projectile from destroying several cells at once.

Native FLX 0.3.1 checks cover alien counts and screen bounds, formation reversal/descent, protector erosion by both projectile types, opposite-side reactor trails, alien/UFO points, UFO scheduling/exit and player death.

This is the initial playfield requested for the collection. Menu, modes, waves and achievement milestones can be designed in the following iteration.

## Audio

All definitions live in games/commons/sounds.json. Player/enemy shots and player/UFO explosions reuse the Asteroids sounds. Invaders adds four descending march notes (invaders_step_0 through invaders_step_3), an alien explosion, a quiet shield chip and two alternating UFO tones. The march interval shortens as the formation loses aliens; no audio loops need to be stopped on defeat. Eight new effects are available in the scrolling sound test.
