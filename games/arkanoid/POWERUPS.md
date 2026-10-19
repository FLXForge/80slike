# Power-ups

Only enabled in Arkanoid mode. Breakout style has no capsule drops.

| Capsule | Name | Color | Effect |
| --- | --- | --- | --- |
| E | Expand | Violet | Paddle width × 1.5 for 5 seconds |
| S | Shrink | Orange | Paddle width × 0.65 for 5 seconds |
| G | Glue | Blue | Catches the ball on the upper paddle face for 5 seconds; action releases it |
| P | Pierce | Green | Ball destroys bricks without bouncing for 5 seconds |
| L | Laser | Red | Two paddle cannons; hold action to fire for 8 seconds |
| B | Barrier | Turquoise | Bottom wall for 10 seconds; blinks during the last 2 seconds |
| X | Extra life | Yellow | Adds one life immediately |

Expand and Shrink cancel each other. Other effects can coexist. Collecting the same effect refreshes its timer; collecting Barrier refreshes the existing wall instead of adding another.

Each destroyed brick has a 15% drop chance, for ball and laser hits. The six ordinary capsules have weight 6 each; Extra life has weight 1. This gives about 2.43% per brick for each ordinary capsule and 0.405% for Extra life.

Laser shots disappear on the first brick or the ceiling. Brick destruction awards 100 points once. Cannon positions follow the current paddle width. The blinking barrier remains solid until it expires.

Adjustment points:

- `levels/common/paddle.js`: ordinary effect duration, paddle scale factors, laser duration and firing interval.
- `levels/common/barrier.js`: wall lifetime and warning blink.
- `levels/common/barrier.json`: wall position, dimensions and visual.
- `levels/common/ball.js` and `laser.js`: matching drop probability and weights.
- `levels/common/ball.json` and `laser.json`: matching capsule colors, letters and shapes.
