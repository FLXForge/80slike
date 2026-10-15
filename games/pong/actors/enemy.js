/// <reference path="https://flxforge.github.io/FLXEngine/scripts/flx.d.ts" />

const MOVE = direction(0);
const PLAYER_SPEED = 120;

function motion(enemy) {
    let moved = false;
    if (read_global("players") == 1) {
        const balls = find_name("ball");
        if (balls.length > 0) {
            follow_y(enemy, balls[0]);
            moved = true;
        }
    } else {
        const vertical = input_direction(player(2), MOVE, VERTICAL);
        position_y(enemy, enemy.y + vertical * PLAYER_SPEED * delta());
        moved = vertical != 0;
    }
    if (read_global("effects") == 1 && moved && probability(25)) {
        spawn(enemy, "trail");
    }
}

function collision(paddle, other, contacts) {
    if (other.group != "wall") return;
    for (const contact of contacts) {
        position(paddle, contact);
    }
}
