/// <reference path="https://flxforge.github.io/FLXEngine/scripts/flx.d.ts" />

/*
    Short ball trail.
    It shrinks quickly and disappears.
*/

const LIFE = 0.18;

function born(trail){
    play_timer(trail, "life", LIFE);
}

function motion(trail){
    let factor = timer_left(trail, "life") / LIFE;

    resize(trail, 4 * factor, 4 * factor);

    if (!timer_active(trail, "life")) {
        kill(trail);
    }
}
