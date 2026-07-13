/// <reference path="https://flxforge.github.io/FLXEngine/scripts/flx.d.ts" />

/*
    The ball always moves forward. The collision determines its trajectory depending on what it hits:
        -If it collides with the goal, it returns to the starting point.
        -If it collides with the wall, it bounces along the y-axis.
        -If it collides with the paddle, it bounces along the x-axis and accelerates.
*/

function motion(ball) {
    advance(ball);
    if (global["effects"] == 1 && probability(35)) {
        spawn(ball, "trail");
    }
}

function collision(ball, other) {
    if (other.group == "goal") {
        if (other.role == "left") {
            global["pl2"] += 1;
            play_sound(ball, "goal_left");
        }
        if (other.role == "right") {
            global["pl1"] += 1;
            play_sound(ball, "goal_right");
        }
        global["goal_effect"] = 1;
        to_origin(ball);
    } else if (other.group == "wall") {
        bounce_y(ball);
        play_sound(ball, "beep");
    } else if (other.group == "paddle") {
        bounce_x(ball);
        accelerate(ball, 5);
        play_sound(ball, "beep");
    }
    
}