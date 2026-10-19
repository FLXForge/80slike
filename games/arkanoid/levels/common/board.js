function action(board) {
    const arkanoid = read_global("arkanoid_active_mode") == 0;
    for (const name of ["top_wall", "left_wall", "right_wall"]) {
        for (const wall of find_name(name)) apply_color(wall, arkanoid ? "#a2b5c6" : "#d59946");
    }
}

function draw(board) {
    if (read_global("arkanoid_active_mode") != 0) return;
    // Surface trim stays inside the existing wall colliders.
    for (const x of [45, 605]) {
        draw_line(x - 4, 46, x - 4, 294, "#6889a8");
        draw_line(x + 4, 46, x + 4, 294, "#344c6c");
        draw_line(x, 46, x, 294, "#5a7798");
        for (let y = 65; y < 290; y += 40) {
            draw_rectangle(x, y, 8, 16, "#233952");
            draw_line(x - 3, y - 5, x + 3, y - 5, "#89d7ed");
            draw_line(x - 3, y + 5, x + 3, y + 5, "#728da8");
        }
    }
    draw_line(41, 46, 609, 46, "#94b9d2");
    draw_line(41, 54, 609, 54, "#344c6c");
    for (let x = 65; x < 600; x += 40) {
        draw_rectangle(x, 50, 16, 8, "#233952");
        draw_line(x - 5, 48, x + 5, 48, "#89d7ed");
    }
}
