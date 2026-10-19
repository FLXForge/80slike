function action(board) {
    const arkanoid = read_global("arkanoid_active_mode") == 0;
    for (const name of ["top_wall", "left_wall", "right_wall"]) {
        for (const wall of find_name(name)) apply_color(wall, arkanoid ? "#a2b5c6" : "#d59946");
    }
}

