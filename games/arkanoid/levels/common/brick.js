function born(brick) {
    if (read_global("arkanoid_active_mode") == 1) {
        const rows = ["#c65a4a", "#d59946", "#b9b34d", "#71955b"];
        apply_color(brick, rows[Math.min(3, Math.max(0, Math.floor((brick.y - 65) / 40)))]);
    }
    write_global("briks", read_global("briks") + 1);
}

function draw(brick) {
    if (read_global("arkanoid_active_mode") != 0) return;
    const x = brick.width / 2, y = brick.height / 2;
    draw_line(brick, -x + 1, -y + 1, x - 1, -y + 1, "#d8e2ed");
    draw_line(brick, -x + 1, -y + 1, -x + 1, y - 1, "#a4b6c9");
    draw_line(brick, -x + 1, y - 1, x - 1, y - 1, "#18263d");
    draw_line(brick, x - 1, -y + 1, x - 1, y - 1, "#18263d");
}
