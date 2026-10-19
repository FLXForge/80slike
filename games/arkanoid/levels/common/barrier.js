function born(wall) { play_timer(wall, "life", 10); }
function action(wall) {
    if (!timer_active(wall, "life")) { kill(wall); return; }
    // Only the visual blinks: protection lasts until the timer expires.
    if (timer_left(wall, "life") < 2 && Math.floor(timer_left(wall, "life") * 8) % 2 == 0) hide(wall);
    else show(wall);
}
