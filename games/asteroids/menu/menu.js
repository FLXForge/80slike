/// <reference path="https://flxforge.github.io/FLXEngine/scripts/flx.d.ts" />

const EXIT = button(0);
const START = button(1);
const MODE = button(2);
const ACTION = button(0);
const MOVE = direction(0);
const DISPLAY_SECONDS = 8;
const MODE_NAMES = ["Classic", "Escalation", "Frenetic"];
const MODE_COLORS = ["blue", "orange", "red"];

function born(menu) {
    write_local(menu, "lore", false);
    play_timer(menu, "display", DISPLAY_SECONDS);
}

function action(menu) {
    if (!state_active(menu, "menu") || input_pressed(system(), EXIT)) return;
    if (input_pressed(system(), START)) {
        // Selection is recorded now; the three gameplay rules come in the next phase.
        write_global("asteroids_active_mode", read_global("asteroids_mode"));
        stop_music();
        play_sound(menu, "start");
        write_global("asteroids_start", true);
        return;
    }
    if (input_pressed(system(), MODE)) {
        write_global("asteroids_mode", (read_global("asteroids_mode") + 1) % MODE_NAMES.length);
        play_sound(menu, "mode");
    }
    if (input_down(system(), MODE) || input_down(system(), START) ||
        input_down(player(1), ACTION) ||
        input_direction(player(1), MOVE, HORIZONTAL) != 0 ||
        input_direction(player(1), MOVE, VERTICAL) != 0) {
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
        draw_text(320, 160, "A vast asteroid storm is heading for Earth.", 15);
        draw_text(320, 181, "Only a seasoned pilot can stop the threat.", 15);
        draw_text(320, 202, "If they fail, we'll send another...", 15);
    } else {
        const mode = read_global("asteroids_mode");
        draw_text(320, 150, "1 PLAYER", 11);
        draw_text(320, 185, MODE_NAMES[mode], 20, MODE_COLORS[mode]);
    }
    draw_text(320, 295, "Mode: change game   Start: play", 11);
}
