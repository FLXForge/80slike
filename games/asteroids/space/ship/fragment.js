/// <reference path="https://flxforge.github.io/FLXEngine/scripts/flx.d.ts" />

const LIFE = 1.5;

function born(fragment) {
    play_timer(fragment, "life", LIFE);
    write_local(fragment, "mode", random(0, 3));
    apply_angle(fragment, random(0, 360));
    apply_velocity(fragment, random(0, 360), random(10, 200));
    apply_rotation_speed(fragment, random(120, 360));
}

function motion(fragment) {
    if (!timer_active(fragment, "life")) {
        kill(fragment);
        return;
    }
    const mode = read_local(fragment, "mode");
    if (mode < 1 || mode >= 2) advance(fragment);
    if (mode >= 1) rotate(fragment);
    const factor = timer_left(fragment, "life") / LIFE;
    resize(fragment, factor, 10 * factor);
}
