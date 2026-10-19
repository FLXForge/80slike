/// <reference path="https://flxforge.github.io/FLXEngine/scripts/flx.d.ts" />

const MODE_NAMES = ["Arkanoid", "Breakout style"];
const MODE_COLORS = ["#7edbff", "#631d26"];
function born(ui) {
    write_local(ui, "lore", false);
    play_timer(ui, "display", 8);
    play_music(ui, "menu");
}
function action(ui) {
    if (input_pressed(system(), button(2))) write_global("arkanoid_mode", 1 - read_global("arkanoid_mode"));
    const active = input_down(system(), button(1)) || input_down(system(), button(2)) ||
        input_down(player(1), button(0)) ||
        input_direction(player(1), direction(0), HORIZONTAL) != 0 ||
        input_direction(player(1), direction(0), VERTICAL) != 0;
    if (active) {
        write_local(ui, "lore", false);
        stop_timer(ui, "display");
        play_timer(ui, "display", 8);
    } else if (timer_done(ui, "display")) {
        write_local(ui, "lore", !read_local(ui, "lore"));
        stop_timer(ui, "display");
        play_timer(ui, "display", 8);
    }
}
function draw(ui) {
    const ink = read_global("arkanoid_mode") == 0 ? "#e2ecfa" : "black";
    if (read_local(ui, "lore")) {
        draw_text(320, 185, "Bricks have appeared. Out of nowhere.", 13, ink);
        draw_text(320, 205, "The chosen one must solemnly clear the way.", 13, ink);
        draw_text(320, 225, "The paradox? There are always more bricks.", 13, ink);
    } else {
        const mode = read_global("arkanoid_mode");
        draw_text(320, 188, MODE_NAMES[mode], 22, MODE_COLORS[mode]);
        draw_text(320, 217, mode == 0 ? "1 PLAYER / POWER-UPS" : "1 PLAYER / NO POWER-UPS", 11, ink);
    }
    draw_text(320, 305, "Mode: change game   Start: play", 11, "white");
}
