/// <reference path="https://flxforge.github.io/FLXEngine/scripts/flx.d.ts" />

const MOVE = direction(0);
const PLAYER_SPEED = 120;
const CPU_STEP = 2;
const CPU_LIMIT = 95;

function born(enemy) {
    write_local(enemy, "cpu_start_speed", enemy.speed);
}

function motion(enemy) {
    const previousY = enemy.y;
    if (read_global("players") == 1) {
        if (read_global("pong_cpu_progressive")) {
            const points = read_global("pl1") + read_global("pl2");
            const base = read_local(enemy, "cpu_start_speed");
            apply_speed(enemy, Math.min(base + points * CPU_STEP, CPU_LIMIT));
        }
        const balls = find_name("ball");
        if (balls.length > 0) {
            follow_y(enemy, balls[0]);

        }
    } else {
        const vertical = input_direction(player(2), MOVE, VERTICAL);
        position_y(enemy, enemy.y + vertical * PLAYER_SPEED * delta());

    }
    const movement = enemy.y - previousY;
    if (read_global("effects") == 1 && movement != 0 &&
        !timer_active(enemy, "speed_lines")) {
        write_local(enemy, "trail_direction", movement > 0 ? 1 : -1);
        spawn(enemy, "trail");
        stop_timer(enemy, "speed_lines");
        play_timer(enemy, "speed_lines", 0.055);
    }
}

function collision(paddle, other, contacts) {
    if (other.group != "wall") return;
    for (const contact of contacts) {
        position(paddle, contact);
    }
}
