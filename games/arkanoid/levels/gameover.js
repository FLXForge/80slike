function born(screen) { play_timer(screen, "display", 4); }
function action(screen) {
    const age = 4 - timer_left(screen, "display");
    if (!timer_active(screen, "display") || (age >= 1 && input_pressed(system(), button(1)))) write_global("game_over", 3);
}
function draw(screen) {
    draw_text(320, 104, "GAME OVER", 28, "#ee5a72");
    draw_text(320, 148, "LEVEL " + read_global("level_reached"), 14, "#d5e4f6");
    draw_text(320, 182, "SCORE: " + read_global("score"), 16, "white");
    draw_text(320, 216, read_global("arkanoid_active_mode") == 0 ? "ARKANOID" : "BREAKOUT STYLE", 12, "#94b9d2");
    draw_text(320, 284, "Start: return to title", 11, "white");
}
