/// <reference path="https://flxforge.github.io/FLXEngine/scripts/flx.d.ts" />

const EXIT = button(0);
const MODE = button(2);
const INIT_LIVES = 3;
let stars = [];

function born(game) {
    write_global("score", 0);
    write_global("lives", INIT_LIVES);
    write_global("asteroids", 0);
    write_global("asteroids_pending", 0);
    write_global("inGame", 0);
    write_global("shipDead", 0);
    write_global("asteroids_start", false);
    write_global("asteroids_mode", 0);
    write_global("asteroids_active_mode", 0);
    write_global("asteroids_wave", 1);
    write_global("asteroids_phase", "menu");
    write_global("asteroids_speed_factor", 1);
    write_global("asteroids_warp", 0);
    write_global("asteroids_warp_distance", 0);
    write_global("saucers", 0);
    write_global("saucers_pending", 0);
    for (let i = 0; i < 100; i++) stars.push({x: random(0, 639), y: random(0, 319)});
}

function action(game) {
    if (input_pressed(system(), EXIT)) {
        exit();
        return;
    }
    if (state_entered(game)) {
        const playing = state_active(game, "game");
        write_global("inGame", playing ? 1 : 0);
        write_global("asteroids_phase", playing ? "announce" : state_current(game));
        write_global("asteroids_warp", 0);
        keep_only(game);
        if (playing) {
            write_global("asteroids", 0);
            write_global("asteroids_pending", 0);
            write_global("saucers", 0);
            write_global("saucers_pending", 0);
            write_global("shipDead", 0);
            spawn(game, "level");
        } else if (state_active(game, "intro")) {
            stop_music();
            write_global("score", 0);
            write_global("lives", INIT_LIVES);
            write_global("asteroids_wave", 1);
            write_global("asteroids_speed_factor", 1);
            write_global("asteroids_warp_distance", 0);
            spawn(game, "intro");
        } else if (state_active(game, "menu")) {
            play_music(game, "menu");
            spawn(game, "menu");
        } else {
            play_music(game, "menu");
            spawn(game, "level");
        }
        return;
    }
    if (state_active(game, "result") && input_pressed(system(), MODE)) {
        write_global("asteroids_start", false);
        state_to(game, "menu");
        return;
    }
    if (state_active(game, "game") && read_global("inGame") == 0) {
        state_to(game, "result");
    } else if ((state_active(game, "menu") || state_active(game, "result")) &&
               read_global("asteroids_start")) {
        write_global("asteroids_start", false);
        state_to(game, "intro");
    }
}

function draw(game) {
    const warp = read_global("asteroids_warp");
    const distance = read_global("asteroids_warp_distance") * warp;
    for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        if (warp > 0) {
            const y = (star.y + distance) % 320;
            const length = 2 + warp * (24 + (i % 5) * 7);
            const bottom = y + length;
            draw_line(star.x, y, star.x, Math.min(319, bottom), i % 4 == 0 ? "blue" : "white");
            if (bottom > 319) draw_line(star.x, 0, star.x, bottom - 320, "white");
        } else {
            draw_pixel(star.x, star.y, "white");
        }
    }
}
