/// <reference path="https://flxforge.github.io/FLXEngine/scripts/flx.d.ts" />

/*
    Player cannon.
    Moves horizontally and fires one laser with a short cooldown.
*/

const SHOT_COOLDOWN = 0.35;
const FIRE_BUTTON = button(0);
const MOVE = direction(0);

function action(player){
    if (read_global("game_over") == 1) {
        return;
    }

    const move = input_direction(player, MOVE, HORIZONTAL);
    move_horizontal(player, move);
    if (move != 0 && !timer_active(player, "trail")) {
        spawn(player, move < 0 ? "trail_right" : "trail_left");
        stop_timer(player, "trail");
        play_timer(player, "trail", 0.035);
    }

    if (player.x < 24) {
        position_x(player, 24);
    }

    if (player.x > 616) {
        position_x(player, 616);
    }

    if (input_pressed(player, FIRE_BUTTON) && !timer_active(player, "shot")) {
        spawn(player, "laser");
        play_timer(player, "shot", SHOT_COOLDOWN);
    }
}

function collision(player, other){
    kill(other);
    kill(player);
}

function dead(player){
    play_sound(player, "dead");
    for (const name of ["reactor_left", "reactor_right", "trail_left", "trail_right"]) {
        for (const part of find_name(name)) kill(part);
    }
    write_global("game_over", 1);
}
