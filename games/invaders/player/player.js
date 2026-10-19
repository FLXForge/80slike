/// <reference path="https://flxforge.github.io/FLXEngine/scripts/flx.d.ts" />

/*
    Player cannon.
    Moves horizontally and fires one laser with a short cooldown.
*/

const SHOT_COOLDOWN = 0.35;
const FIRE_BUTTON = button(0);
const MOVE = direction(0);

function born(player) {
    write_local(player, "protected", true);
    collider_off(player, "body");
    play_timer(player, "protection", 3.5);
}
function visibility(player, visible) {
    if (visible) show(player); else hide(player);
    for (const name of ["reactor_left", "reactor_right"]) for (const part of find_name(name)) {
        if (read_local(part, "owner") != player.id) continue;
        if (visible) show(part); else hide(part);
    }
}

function action(player){
    const active = read_global("invaders_phase") == "active";
    if (read_local(player, "protected")) {
        if (active && !timer_active(player, "protection")) { collider_on(player, "body"); write_local(player, "protected", false); visibility(player, true); }
        else visibility(player, !active || Math.floor(timer_left(player, "protection") * 8) % 2 == 0);
    }
    if (!active) return;

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
    if (read_global("invaders_phase") != "active" || read_local(player, "protected")) return;
    kill(other);
    kill(player);
}

function dead(player){
    if (read_global("invaders_phase") == "active") {
        play_sound(player, "dead");
        write_global("lives", Math.max(0, read_global("lives") - 1));
        write_global("invaders_lost", true);
    }
    for (const name of ["reactor_left", "reactor_right", "trail_left", "trail_right"]) {
        for (const part of find_name(name)) {
            if (read_local(part, "owner") == player.id) kill(part);
        }
    }

}
