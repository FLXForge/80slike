function draw(wall) {
    if (read_global("arkanoid_active_mode") != 0) return;
    const horizontal = wall.width > wall.height;
    const half = (horizontal ? wall.width : wall.height) / 2;
    if (horizontal) {
        draw_line(wall, -half + 1, -4, half - 1, -4, "#94b9d2");
        draw_line(wall, -half + 1, 4, half - 1, 4, "#344c6c");
        for (let x = -half + 25; x < half - 8; x += 40) {
            draw_rectangle(wall, x, 0, 16, 8, "#233952");
            draw_line(wall, x - 5, -2, x + 5, -2, "#89d7ed");
        }
    } else {
        draw_line(wall, -4, -half + 1, -4, half - 1, "#94b9d2");
        draw_line(wall, 4, -half + 1, 4, half - 1, "#344c6c");
        for (let y = -half + 20; y < half - 8; y += 40) {
            draw_rectangle(wall, 0, y, 8, 16, "#233952");
            draw_line(wall, -2, y - 5, -2, y + 5, "#89d7ed");
        }
    }
}
