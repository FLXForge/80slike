/// <reference path="https://flxforge.github.io/FLXEngine/scripts/flx.d.ts" />

const ACTION = button(0);

function born(ui) {
    if (read_global("inGame") == 1) spawn(ui, "ship");
}

function action(ui) {
    if (read_global("inGame") == 0 && input_pressed(player(1), ACTION)) {
        write_global("asteroids_start", true);
    }
}

function motion(ui) {
    if (read_global("inGame") == 1 && read_global("shipDead") == 1) {
        write_global("shipDead", 0);
        spawn(ui, "ship");
    }
}

function draw(ui) {
    if (read_global("inGame") == 0) {
        draw_text(320, 100, "GAME OVER", 20);
        draw_text(320, 140, "SCORE: " + read_global("score"), 15);
        draw_text(320, 180, "-- PRESS ACTION TO START --", 15);
    } else {
        draw_text(70, 12, "SCORE: " + read_global("score"), 11);
        draw_text(70, 28, "LIVES: " + read_global("lives"), 11);
    }
}
