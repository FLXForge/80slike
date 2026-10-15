/// <reference path="https://flxforge.github.io/FLXEngine/scripts/flx.d.ts" />

const LIFE = 0.18;

function born(trail) {
    play_timer(trail, "life", LIFE);
    write_local(trail, "startWidth", trail.width);
    write_local(trail, "startHeight", trail.height);
}

function motion(trail) {
    const factor = timer_left(trail, "life") / LIFE;
    resize(trail,
        read_local(trail, "startWidth") * factor,
        read_local(trail, "startHeight") * factor);
    if (!timer_active(trail, "life")) {
        kill(trail);
    }
}
