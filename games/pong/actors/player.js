/// <reference path="https://flxforge.github.io/FLXEngine/scripts/flx.d.ts" />

const MOVE = direction(0);

function action(paddle) {
    const vertical = input_direction(player(1), MOVE, VERTICAL);
    const previousY = paddle.y;
    move_vertical(paddle, vertical);
    const movement = paddle.y - previousY;
    if (read_global("effects") == 1 && movement != 0 &&
        !timer_active(paddle, "speed_lines")) {
        write_local(paddle, "trail_direction", movement > 0 ? 1 : -1);
        spawn(paddle, "trail");
        stop_timer(paddle, "speed_lines");
        play_timer(paddle, "speed_lines", 0.055);
    }
}

function collision(paddle, other, contacts) {
    if (other.group != "wall") return;
    for (const contact of contacts) {
        position(paddle, contact);
    }
}
