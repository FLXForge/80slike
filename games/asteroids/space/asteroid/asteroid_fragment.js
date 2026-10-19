/// <reference path="https://flxforge.github.io/FLXEngine/scripts/flx.d.ts" />

const LIFE = 1.2;

function born(fragment) {
    play_timer(fragment, "life", LIFE);
    apply_angle(fragment, random(0, 360));
    apply_velocity(fragment, random(0, 360), random(20, 120));
    apply_rotation_speed(fragment, random(120, 360));
}

function motion(fragment) {
    if (!timer_active(fragment, "life")) {
        kill(fragment);
        return;
    }
    advance(fragment);
    if (probability(50)) rotate(fragment);
    const factor = timer_left(fragment, "life") / LIFE;
    resize(fragment, factor, 10 * factor);
}
