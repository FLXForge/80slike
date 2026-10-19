/// <reference path="https://flxforge.github.io/FLXEngine/scripts/flx.d.ts" />

function born(intro) {
    write_local(intro, "arrived", false);
    play_sound(intro, "travel");
}

function action(intro) {
    const age = state_time(intro);
    const warp = age < 0.8 ? age / 0.8 : age < 2.9 ? 1 : Math.max(0, 1 - (age - 2.9) / 1.1);
    write_global("asteroids_warp", warp);
    write_global("asteroids_warp_distance", read_global("asteroids_warp_distance") + delta() * 260 * warp);
    if (age >= 3.15 && !read_local(intro, "arrived")) {
        play_sound(intro, "arrival");
        write_local(intro, "arrived", true);
    }
    if (age >= 4.4) {
        write_global("asteroids_warp", 0);
        state_to(intro, "game");
    }
}
