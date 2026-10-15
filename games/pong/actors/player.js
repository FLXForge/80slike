/// <reference path="https://flxforge.github.io/FLXEngine/scripts/flx.d.ts" />

const MOVE = direction(0);

function action(paddle) {
    const vertical = input_direction(player(1), MOVE, VERTICAL);
    move_vertical(paddle, vertical);
    if (read_global("effects") == 1 && vertical != 0 && probability(25)) {
        spawn(paddle, "trail");
    }
}

function collision(paddle, other, contacts) {
    if (other.group != "wall") return;
    for (const contact of contacts) {
        position(paddle, contact);
    }
}
