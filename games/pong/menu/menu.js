/// <reference path="https://flxforge.github.io/FLXEngine/scripts/flx.d.ts" />

const EXIT = button(0);
const START = button(1);
const MODE = button(2);
const ACTION = button(0);
const MOVE = direction(0);
const DISPLAY_SECONDS = 8;

function born(menu) {
    write_local(menu, "lore", false);
    play_timer(menu, "display", DISPLAY_SECONDS);
    play_music(menu, "theme");
}

function action(menu) {
    if (!state_active(menu, "menu")) return;
    if (input_pressed(system(), EXIT)) return;

    if (input_pressed(system(), START)) {
        stop_music();
        play_sound(menu, "start");
        state_to(menu, "game");
        return;
    }

    if (input_pressed(system(), MODE)) {
        write_global("players", read_global("players") == 1 ? 2 : 1);
        play_sound(menu, "mode");
    }

    // Logical FLX controls only; unmapped keyboard keys are not observable.
    if (input_down(system(), MODE) || input_down(system(), START) ||
        input_down(player(1), ACTION) || input_down(player(2), ACTION) ||
        input_direction(player(1), MOVE, VERTICAL) != 0 ||
        input_direction(player(2), MOVE, VERTICAL) != 0) {
        write_local(menu, "lore", false);
        stop_timer(menu, "display");
        play_timer(menu, "display", DISPLAY_SECONDS);
    } else if (timer_done(menu, "display")) {
        write_local(menu, "lore", !read_local(menu, "lore"));
        stop_timer(menu, "display");
        play_timer(menu, "display", DISPLAY_SECONDS);
    }
}

function draw(menu) {
    if (!state_active(menu, "menu")) return;
    if (read_local(menu, "lore")) {
        draw_text(160, 98, "Every few years, two paddle warriors", 8);
        draw_text(160, 110, "are summoned to the great Pong tournament.", 8);
        draw_text(160, 122, "Nobody knows who keeps booking the court.", 8);
    } else {
        draw_text(106, 110, "1 Player", 10);
        draw_text(151, 110, "Vs", 10, "red");
        draw_text(202, 110, read_global("players") == 1 ? "Computer" : "2 Player", 10);
    }
    draw_text(160, 160, "Mode: change game   Start: play", 8);
}
