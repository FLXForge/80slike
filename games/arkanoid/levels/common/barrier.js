function born(wall) { play_timer(wall, "life", 10); }
function action(wall) {
    if (!timer_active(wall, "life")) { kill(wall); return; }
    // Only the visual blinks: protection lasts until the timer expires.
    if (timer_left(wall, "life") < 2 && Math.floor(timer_left(wall, "life") * 8) % 2 == 0) hide(wall);
    else show(wall);
}

function draw(wall) {
    if (!wall.visible) return;
    draw_line(41, 296, 609, 296, "#94b9d2");
    draw_line(41, 304, 609, 304, "#344c6c");
    for (let x = 65; x < 600; x += 40) {
        draw_rectangle(x, 300, 16, 8, "#233952");
        draw_line(x - 5, 298, x + 5, 298, "#89d7ed");
    }
}
