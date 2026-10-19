function born(brick) {
    if (read_global("arkanoid_active_mode") == 1) {
        const rows = ["#c65a4a", "#d59946", "#b9b34d", "#71955b"];
        apply_color(brick, rows[Math.min(3, Math.max(0, Math.floor((brick.y - 65) / 40)))]);
    }
    write_global("briks", read_global("briks") + 1);
}
