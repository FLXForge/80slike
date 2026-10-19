/// <reference path="https://flxforge.github.io/FLXEngine/scripts/flx.d.ts" />

function motion(ship) {
    const age = state_time(ship);
    const t = Math.min(1, age / 2.4);
    const ease = 1 - (1 - t) * (1 - t);
    position_y(ship, 300 - 140 * ease);
    if (age < 2.9 && !timer_active(ship, "intro_tail")) {
        spawn(ship, "tail");
        stop_timer(ship, "intro_tail");
        play_timer(ship, "intro_tail", 0.055);
    }
    if (age < 2.9 && !timer_active(ship, "intro_motor")) {
        play_sound(ship, "motor");
        stop_timer(ship, "intro_motor");
        play_timer(ship, "intro_motor", 0.12);
    }
}
