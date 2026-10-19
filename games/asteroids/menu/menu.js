/// <reference path="https://flxforge.github.io/FLXEngine/scripts/flx.d.ts" />

const ACTION = button(0);
const MOVE = direction(0);

function born(menu) {
    write_global("option", 1);
}

function action(menu) {
    // Difficulty remains an informational legacy row until modes are designed.
    if (input_pressed(player(1), MOVE, UP)) write_global("option", 1);
    if (input_pressed(player(1), MOVE, DOWN)) write_global("option", 3);
    if (input_pressed(player(1), ACTION)) {
        if (read_global("option") == 1) write_global("asteroids_start", true);
        else if (read_global("option") == 3) exit();
    }
}
