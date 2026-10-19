/// <reference path="https://flxforge.github.io/FLXEngine/scripts/flx.d.ts" />

const POSITIONS = [215, 255, 295];

function motion(cursor) {
    const target = POSITIONS[read_global("option") - 1];
    const step = 60 * delta();
    position_y(cursor, cursor.y + Math.max(-step, Math.min(step, target - cursor.y)));
}
