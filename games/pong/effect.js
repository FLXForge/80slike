/// <reference path="https://flxforge.github.io/FLXEngine/scripts/flx.d.ts" />

const LIFE = 0.18;

function born(flash){
    apply_color(flash, read_global("goal_scorer") == 1 ? "blue" : "red");
    play_timer(flash, "life", LIFE);
}

function motion(flash){
    if (!timer_active(flash, "life")) {
        kill(flash);
    }
}
