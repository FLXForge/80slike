/// <reference path="https://flxforge.github.io/FLXEngine/scripts/flx.d.ts" />

/* 
	The enemy paddle always follows the ball on the y-axis 
*/

const PLAYER_SPEED = 120;

function motion(enemy) {
    let moved = false;

    if (global["players"] == 1){
        follow_y(enemy, "ball");
        moved = true;    
    } else {
        if (Input.player(2).up()) {
            enemy.y += UP * PLAYER_SPEED * delta();
            moved = true;
        }

        if (Input.player(2).down()) {
            enemy.y += DOWN * PLAYER_SPEED * delta();
            moved = true;
        }
    }

    if (global["effects"] == 1 && moved 
        && probability(25)) {
        spawn(enemy, "trail");
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