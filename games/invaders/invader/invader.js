function born(invader) {
    play_timer(invader, "shot", random(1, 24));
}
function motion(invader) {
    if (read_global("game_over") == 1) return;
    if (!timer_active(invader, "shot")) {
        spawn(invader, "laser");
        stop_timer(invader, "shot");
        play_timer(invader, "shot", random(18, 36));
    }
}
function collision(invader, other) {
    if (read_global("game_over") == 0 && other.group == "shield") kill(other);
}
