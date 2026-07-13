/// <reference path="https://flxforge.github.io/FLXEngine/scripts/flx.d.ts" />

/*
    Paddle ghost.
    It keeps a copy of the paddle position and shrinks toward its own center.
*/

const LIFE = 0.18;

function born(trail){
    timer(trail, "life", LIFE);

    trail.local["centerX"] = trail.x + trail.width / 2;
    trail.local["centerY"] = trail.y + trail.height / 2;

    trail.local["startWidth"] = trail.width;
    trail.local["startHeight"] = trail.height;
}

function motion(trail){
    let factor = timer_left(trail, "life") / LIFE;

    trail.width = trail.local["startWidth"] * factor;
    trail.height = trail.local["startHeight"] * factor;

    trail.x = trail.local["centerX"] - trail.width / 2;
    trail.y = trail.local["centerY"] - trail.height / 2;

    if (!timer_active(trail, "life")) {
        kill(trail);
    }
}