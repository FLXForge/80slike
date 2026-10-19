/// <reference path="https://flxforge.github.io/FLXEngine/scripts/flx.d.ts" />

const MAX_LIFE_TIME = 4;

function born(laser) {
    play_timer(laser, "life", MAX_LIFE_TIME);
}

function motion(laser) {
    if (!timer_active(laser, "life") || read_global("inGame") == 0 || read_global("asteroids_phase") != "active") {
        kill(laser);
        return;
    }
    advance(laser);
    const factor = timer_left(laser, "life") / MAX_LIFE_TIME;
    resize(laser, factor, 10 * factor);
}
