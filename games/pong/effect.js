/// <reference path="https://flxforge.github.io/FLXEngine/scripts/flx.d.ts" />

const LIFE = 0.18;

function born(flash){
    play_timer(flash, "life", LIFE);
}

function motion(flash){
    if (!timer_active(flash, "life")) {
        kill(flash);
    }
}
