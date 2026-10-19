/// <reference path="https://flxforge.github.io/FLXEngine/scripts/flx.d.ts" />

function motion(paddle) {
    if (read_global("arkanoid_mode") == 1) apply_color(paddle, "#e5e5dd");
    else apply_color(paddle, "#b7c8d7");
    const balls = find_name("title_ball");

    if (balls.length > 0) {
        follow_x(paddle, balls[0]);
        position_x(paddle, Math.max(paddle.width / 2, Math.min(640 - paddle.width / 2, paddle.x)));
    }
}

function draw(paddle) {
    if (read_global("arkanoid_mode") != 0) return;
    const half = paddle.width / 2;
    for (let y = -4; y <= 4; y++) {
        draw_line(paddle, -half + 1, y, -half + 9, y, y < -1 ? "#ff7b75" : "#bd3448");
        draw_line(paddle, half - 9, y, half - 1, y, y < -1 ? "#ff7b75" : "#bd3448");
    }
    draw_line(paddle, -half + 10, -4, half - 10, -4, "#f1f7ff");
    draw_line(paddle, -half + 10, 4, half - 10, 4, "#435571");
    draw_rectangle(paddle, 0, 0, Math.max(8, paddle.width - 26), 4, "#7d94ac");
}
