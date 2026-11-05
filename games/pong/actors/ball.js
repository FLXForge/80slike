/// <reference path="https://flxforge.github.io/FLXEngine/scripts/flx.d.ts" />

const SERVE_PAUSE = 0.65;
// Matches the native limit in ball.json. Request valid speeds so saturation
// does not emit a mechanics warning on every subsequent paddle contact.
const MAX_BALL_SPEED = 300;

function born(ball) {
    play_timer(ball, "serve_pause", SERVE_PAUSE);
}

function motion(ball) {
    if (read_global("pong_round_over") || timer_active(ball, "serve_pause")) return;
    advance(ball);
    if (read_global("effects") == 1 && probability(35)) {
        spawn(ball, "trail");
    }
}

function collision(ball, other, contacts) {
    if (read_global("pong_round_over") || timer_active(ball, "serve_pause")) return;
    if (other.group == "goal") {
        if (other.name == "left_goal") {
            write_global("pl2", read_global("pl2") + 1);
            write_global("goal_scorer", 2);
            play_sound(ball, "goal_left");
        } else if (other.name == "right_goal") {
            write_global("pl1", read_global("pl1") + 1);
            write_global("goal_scorer", 1);
            play_sound(ball, "goal_right");
        }
        write_global("goal_effect", 1);
        stop_timer(ball, "impact_pulse");
        position_origin(ball);
        if (!read_global("pong_frenetic")) {
            restore_speed(ball);
        }
        // Reverse the horizontal serve and vary its slope after each goal.
        // Frenetic keeps the accumulated speed, but not an automatic goal loop.
        apply_angle(ball, other.name == "right_goal" ? random(235, 305) : random(55, 125));
        stop_timer(ball, "serve_pause");
        play_timer(ball, "serve_pause", SERVE_PAUSE);
        return;
    }

    if (other.group != "wall" && other.group != "paddle") return;
    for (const contact of contacts) {
        position(ball, contact);
        if (Math.abs(contact.normalX) > Math.abs(contact.normalY)) {
            reflect_x(ball);
        } else {
            reflect_y(ball);
        }
    }
    if (other.group == "paddle") {
        if (read_global("effects") == 1 && contacts.length > 0) {
            const hit = contacts[0];
            write_local(ball, "spark_x", hit.pointX);
            write_local(ball, "spark_y", hit.pointY);
            write_local(ball, "spark_angle", Math.atan2(hit.normalX, -hit.normalY) * 180 / Math.PI);
            write_local(ball, "spark_color", other.x < 160 ? "blue" : "red");
            for (let pixel = 0; pixel < 8; pixel++) spawn(ball, "spark");
        }
        if (ball.speed < MAX_BALL_SPEED) {
            apply_speed(ball, Math.min(ball.speed + 5, MAX_BALL_SPEED));
        }
    }
    if (read_global("effects") == 1 && contacts.length > 0) {
        stop_timer(ball, "impact_pulse");
        play_timer(ball, "impact_pulse", 0.10);
    }
    play_sound(ball, "beep");
}

function draw(ball) {
    if (read_global("effects") != 1 || !timer_active(ball, "impact_pulse")) return;
    const pulse = timer_left(ball, "impact_pulse") / 0.10;
    // Visual outline only: the ball and its collider keep their original size.
    draw_rectangle(ball, 0, 0, ball.width + 2 * pulse, ball.height + 2 * pulse, "white");
}
