/// <reference path="https://flxforge.github.io/FLXEngine/scripts/flx.d.ts" />

const SPAWN_INTERVAL = 0.25;

function born(space) {
    play_timer(space, "spawn", SPAWN_INTERVAL);
}

function motion(space) {
    if (read_global("inGame") == 0 || read_global("asteroids_phase") != "active") return;
    if (read_global("asteroids_wave_remaining") <= 0 || !timer_done(space, "spawn")) return;
    stop_timer(space, "spawn");
    play_timer(space, "spawn", SPAWN_INTERVAL);
    write_global("asteroids_pending", read_global("asteroids_pending") + 1);
    write_global("asteroids_wave_remaining", read_global("asteroids_wave_remaining") - 1);
    if (probability(5)) spawn(space, "Asteroid_c");
    else if (probability(25)) spawn(space, "Asteroid_b");
    else spawn(space, "Asteroid_a");
}
