/// <reference path="https://flxforge.github.io/FLXEngine/scripts/flx.d.ts" />

/*
    Short ball trail.
    It shrinks quickly and disappears.
*/

const LIFE = 0.18;

function born(trail){
    timer(trail, "life", LIFE);
}

function motion(trail){
    let factor = timer_left(trail, "life") / LIFE;

    trail.width = 4 * factor;
    trail.height = 4 * factor;

    if (!timer_active(trail, "life")) {
        kill(trail);
    }
}