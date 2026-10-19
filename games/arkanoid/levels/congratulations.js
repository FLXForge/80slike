function born(screen) { play_timer(screen, "display", 8); }
function action(screen) {
    const age = 8 - timer_left(screen, "display");
    if (!timer_active(screen, "display") || (age >= 1 && input_pressed(system(), button(1)))) write_global("congratulations", 2);
}
function draw(screen) {
    draw_text(320, 104, "CONGRATULATIONS", 28, "#7edbff");
    draw_text(320, 148, "ALL 15 LEVELS CLEARED", 14, "#d5e4f6");
    draw_text(320, 182, "SCORE: " + read_global("score"), 16, "white");
    draw_text(320, 216, read_global("arkanoid_active_mode") == 0 ? "ARKANOID" : "BREAKOUT STYLE", 12, "#94b9d2");
    draw_text(320, 284, "Start: return to title", 11, "white");
}
