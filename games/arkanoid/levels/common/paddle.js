/// <reference path="https://flxforge.github.io/FLXEngine/scripts/flx.d.ts" />

/*
    Arkanoid paddle.
    It moves horizontally, respawns balls and applies temporary power-up effects.
*/

const RESPAWN_TIME = 1;
const POWERUP_TIME = 5;

const BIG_FACTOR = 1.5;
const SMALL_FACTOR = 0.65;

const RESIZE_SPEED = 180;

let normalWidth = 70;
let targetWidth = 70;

function born(paddle){
    apply_color(paddle, read_global("arkanoid_active_mode") == 1 ? "#e5e5dd" : "#b7c8d7");
    normalWidth = paddle.width;
    targetWidth = normalWidth;

    write_global("activeBroken", 0);
    write_global("activeGun", 0);


}

function action(paddle){
    update_laser(paddle);
    update_target_width(paddle);
    update_resize(paddle);
    update_movement(paddle);
    update_respawn(paddle);
}

function update_powerup_flags(paddle){
    write_global("activeBroken", timer_active(paddle, "broken") ? 1 : 0);
    write_global("activeGun", timer_active(paddle, "gun") ? 1 : 0);
}

function update_target_width(paddle){
    if (timer_active(paddle, "expand")) {
        targetWidth = normalWidth * BIG_FACTOR;
        return;
    }

    if (timer_active(paddle, "shrink")) {
        targetWidth = normalWidth * SMALL_FACTOR;
        return;
    }

    targetWidth = normalWidth;
}

function update_resize(paddle){
    if (paddle.width < targetWidth) {
        resize_width(paddle, paddle.width + RESIZE_SPEED * delta());

        if (paddle.width > targetWidth) {
            resize_width(paddle, targetWidth);
        }
    }

    if (paddle.width > targetWidth) {
        resize_width(paddle, paddle.width - RESIZE_SPEED * delta());

        if (paddle.width < targetWidth) {
            resize_width(paddle, targetWidth);
        }
    }
}

function update_movement(paddle){
    const MOVE = direction(0);
    move_horizontal(paddle, input_direction(paddle, MOVE, HORIZONTAL));
}

function update_respawn(paddle){
    if (read_global("ball_lost") == 1) {
        write_global("ball_lost", 0);

        if (read_global("lives") > 0) {
            stop_timer(paddle, "respawn");
            play_timer(paddle, "respawn", RESPAWN_TIME);
            state_to(paddle, "respawn");
        } else {
            write_global("show_hud", 0);
            write_global("game_over", 1);
        }
    }

    if (
        state_active(paddle, "respawn")
        && !timer_active(paddle, "respawn")
    ){
        spawn(paddle, "ball");
        play_sound(paddle, "pop");
        state_to(paddle, "playing");
    }
}

function collision(paddle, other, contacts) {
    if (other.group == "wall_side") {
        for (const contact of contacts) position(paddle, contact);

        return;
    }

    if (other.group == "powerup") {
        apply_powerup(paddle, other);
        kill(other);
    }
}

function apply_powerup(paddle, powerup) {
    if (read_global("arkanoid_active_mode") != 0 || read_local(powerup, "collected")) return;
    write_local(powerup, "collected", true);
    const name = powerup.name;
    if (name == "life") write_global("lives", read_global("lives") + 1);
    else if (name == "barrier") {
        const walls = find_name("barrier").filter(wall => wall.group == "barrier");
        if (walls.length == 0) spawn(paddle, "barrier");
        else for (const wall of walls) { stop_timer(wall, "life"); play_timer(wall, "life", 10); show(wall); }
    } else {
        stop_timer(paddle, name);
        play_timer(paddle, name, name == "laser" ? 8 : POWERUP_TIME);
        if (name == "expand") stop_timer(paddle, "shrink");
        if (name == "shrink") stop_timer(paddle, "expand");
    }
    play_sound(paddle, "pop");
}

function update_laser(paddle) {
    if (!timer_active(paddle, "laser") || timer_active(paddle, "shot") ||
        !input_down(paddle, button(0)) || !state_active(paddle, "playing") || read_global("briks") <= 0) return;
    spawn(paddle, "laser_left");
    spawn(paddle, "laser_right");
    play_sound(paddle, "laser");
    stop_timer(paddle, "shot");
    play_timer(paddle, "shot", 0.22);
}

function draw(paddle) {
    if (read_global("arkanoid_active_mode") != 0) return;
    const half = paddle.width / 2;
    if (timer_active(paddle, "laser")) {
        for (const x of [-half + 5, half - 5]) {
            for (let dx = -2; dx <= 2; dx++) draw_line(paddle, x + dx, -10, x + dx, 2, "#ee5a72");
            draw_line(paddle, x - 1, -10, x + 1, -10, "#fff0e5");
        }
    }
    for (let y = -4; y <= 4; y++) {
        draw_line(paddle, -half + 1, y, -half + 9, y, y < -1 ? "#ff7b75" : "#bd3448");
        draw_line(paddle, half - 9, y, half - 1, y, y < -1 ? "#ff7b75" : "#bd3448");
    }
    draw_line(paddle, -half + 10, -4, half - 10, -4, "#f1f7ff");
    draw_line(paddle, -half + 10, 4, half - 10, 4, "#435571");
    draw_rectangle(paddle, 0, 0, Math.max(8, paddle.width - 26), 4, "#7d94ac");
}
