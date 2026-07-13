/// <reference path="https://flxforge.github.io/FLXEngine/scripts/flx.d.ts" />

/* 
    The player moves using the up and down keys. 
*/

function action(player) {
    let moved = false;

    if (Input.player(1).up()) {
        move_y(player, UP);
        moved = true;
    }

    if (Input.player(1).down()) {
        move_y(player, DOWN);
        moved = true;
    }

    if (global["effects"] == 1 && moved 
        && probability(25)) {
        spawn(player, "trail");
    }
}

function collision(paddle, other) {
    if (other.group != "wall") {
        return;
    }

    if (other.role == "top") {
        paddle.y = other.y + other.height;
    }

    if (other.role == "bottom") {
        paddle.y = other.y - paddle.height;
    }
}