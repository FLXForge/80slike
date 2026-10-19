function born(game) {
    write_global("score", 0);
    write_global("game_over", 0);
    play_timer(game, "ufo", random(12, 20));
}
function action(game) {
    if (input_pressed(system(), button(0))) { exit(); return; }
    if (read_global("game_over") == 1) return;
    if (!timer_active(game, "ufo") && find_name("ufo").length == 0) {
        spawn(game, "ufo");
        stop_timer(game, "ufo");
        play_timer(game, "ufo", random(18, 28));
    }
}
function draw(game) {
    draw_text(92, 12, "SCORE: " + read_global("score"), 14, "white");
    if (read_global("game_over") == 1) draw_text(320, 200, "GAME OVER", 24, "#ee5a72");
}
