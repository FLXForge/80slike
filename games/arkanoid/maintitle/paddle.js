/// <reference path="https://flxforge.github.io/FLXEngine/scripts/flx.d.ts" />

function motion(paddle) {
    if (read_global("arkanoid_mode") == 1) apply_color(paddle, "#e5e5dd");
    else restore_color(paddle);
    const balls = find_name("title_ball");

    if (balls.length > 0) {
        follow_x(paddle, balls[0]);
        position_x(paddle, Math.max(paddle.width / 2, Math.min(640 - paddle.width / 2, paddle.x)));
    }
}
