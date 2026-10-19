/// <reference path="https://flxforge.github.io/FLXEngine/scripts/flx.d.ts" />

const EXIT = button(0);
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
    for (let i = 0; i < 100; i++) {
        stars.push({x: random(0, 639), y: random(0, 319)});
    }
}

function action(game) {
    if (input_pressed(system(), EXIT)) {
        exit();
        return;
    }
    if (state_entered(game)) {
        const playing = state_active(game, "game");
        write_global("inGame", playing ? 1 : 0);
        keep_only(game);
        if (playing) {
            stop_music();
            write_global("score", 0);
            write_global("lives", INIT_LIVES);
            write_global("asteroids", 0);
            write_global("asteroids_pending", 0);
            write_global("shipDead", 0);
            spawn(game, "level");
        } else if (state_active(game, "menu")) {
            play_music(game, "menu");
            spawn(game, "menu");
        } else {
            play_music(game, "menu");
            spawn(game, "level");
        }
        return;
    }
    if (state_active(game, "game") && read_global("inGame") == 0) {
        state_to(game, "result");
    } else if (!state_active(game, "game") && read_global("asteroids_start")) {
        write_global("asteroids_start", false);
        state_to(game, "game");
    }
}

function draw(game) {
    for (const star of stars) draw_pixel(star.x, star.y, "white");
}
