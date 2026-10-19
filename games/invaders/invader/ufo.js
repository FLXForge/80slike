function born(ufo) {
    play_timer(ufo, "shot", random(0.8, 1.4));
    write_local(ufo, "hum_note", 0);
    const dir = probability(50) ? 1 : -1;
    write_local(ufo, "direction", dir);
    position(ufo, dir > 0 ? -20 : 660, 32);
}
function motion(ufo) {
    if (read_global("game_over") == 1) { kill(ufo); return; }
    move_horizontal(ufo, read_local(ufo, "direction"));
    if (ufo.x > 20 && ufo.x < 620 && !timer_active(ufo, "shot")) {
        spawn(ufo, "laser");
        stop_timer(ufo, "shot");
        play_timer(ufo, "shot", random(1.5, 2.4));
    }
    if (ufo.x < -45 || ufo.x > 685) { kill(ufo); return; }
    if (ufo.x > 0 && ufo.x < 640 && !timer_active(ufo, "hum")) {
        const note = read_local(ufo, "hum_note");
        play_sound(ufo, "hum" + note);
        write_local(ufo, "hum_note", 1 - note);
        stop_timer(ufo, "hum");
        play_timer(ufo, "hum", 0.2);
    }
}
function draw(ufo) {
    draw_line(ufo, -12, 1, 12, 1, "#ffd9df");
    for (const x of [-7, 0, 7]) draw_pixel(ufo, x, 4, "white");
}
