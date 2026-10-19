function born(trail) {
    const player = find_parent(trail);
    const side = trail.name == "trail_left" ? -1 : 1;
    position(trail, player.x + side * 18, player.y + 8);
    apply_angle(trail, side < 0 ? 270 : 90);
    play_timer(trail, "life", 0.24);
}
function motion(trail) {
    if (!timer_active(trail, "life")) { kill(trail); return; }
    advance(trail);
    const t = timer_left(trail, "life") / 0.24;
    resize(trail, 6 * t, 4 * t);
}
