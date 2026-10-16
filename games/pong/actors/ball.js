/// <reference path="https://flxforge.github.io/FLXEngine/scripts/flx.d.ts" />

function motion(ball) {
    advance(ball);
    if (read_global("effects") == 1 && probability(35)) {
        spawn(ball, "trail");
    }
}

function collision(ball, other, contacts) {
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
        position_origin(ball);
        if (!read_global("pong_frenetic")) {
            restore_speed(ball);
        }
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
            for (let pixel = 0; pixel < 6; pixel++) spawn(ball, "spark");
        }
        apply_speed(ball, ball.speed + 5);
    }
    play_sound(ball, "beep");
}
