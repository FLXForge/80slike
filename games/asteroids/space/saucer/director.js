/// <reference path="https://flxforge.github.io/FLXEngine/scripts/flx.d.ts" />

function born(director) {
    play_timer(director, "visit", random(8, 14));
}

function motion(director) {
    if (read_global("inGame") == 0 || read_global("asteroids_phase") != "active") {
        stop_timer(director, "visit");
        play_timer(director, "visit", random(8, 14));
        return;
    }
    const wave = read_global("asteroids_wave");
    if (wave < 5 || !timer_done(director, "visit")) return;
    const capacity = wave >= 10 ? 3 : wave >= 7 ? 2 : 1;
    stop_timer(director, "visit");
    play_timer(director, "visit", random(8, 14) / capacity);
    if (read_global("saucers") + read_global("saucers_pending") < capacity && probability(65)) {
        write_global("saucers_pending", read_global("saucers_pending") + 1);
        spawn(director, "saucer");
    }
}
