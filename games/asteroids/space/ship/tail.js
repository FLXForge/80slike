/// <reference path="https://flxforge.github.io/FLXEngine/scripts/flx.d.ts" />

const LIVE_TIME = 0.5;

function born(tail) {
    play_timer(tail, "life", LIVE_TIME);
    const ship = find_parent(tail);
    if (ship) apply_angle(tail, ship.angle + 180);
}

function motion(tail) {
    if (!timer_active(tail, "life")) {
        kill(tail);
        return;
    }
    advance(tail);
    const factor = timer_left(tail, "life") / LIVE_TIME;
    resize(tail, 6 * factor, 8 * factor);
}
