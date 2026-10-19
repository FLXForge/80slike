/// <reference path="https://flxforge.github.io/FLXEngine/scripts/flx.d.ts" />

function born(title) { write_local(title, "origin_y", title.y); }
function motion(title) {
    apply_color(title, read_global("arkanoid_mode") == 0 ? "#d5e4f6" : "black");
    const remaining = timer_left(title, "hit");
    const t = 0.45 - remaining;
    const offset = timer_active(title, "hit") ? Math.sin(t * 24) * 4 * remaining / 0.45 : 0;
    // Text and its single collider move together.
    position_y(title, read_local(title, "origin_y") - offset);
}
