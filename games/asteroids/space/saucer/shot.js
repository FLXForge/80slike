/// <reference path="https://flxforge.github.io/FLXEngine/scripts/flx.d.ts" />

function born(shot) {
    const saucer = find_parent(shot);
    if (!saucer) {
        kill(shot);
        return;
    }
    apply_angle(shot, read_local(saucer, "shot_angle"));
    play_timer(shot, "life", 3);
}

function motion(shot) {
    if (!timer_active(shot, "life") || read_global("inGame") == 0 ||
        read_global("asteroids_phase") != "active" ||
        shot.x < 0 || shot.x > 640 || shot.y < 0 || shot.y > 320) {
        kill(shot);
        return;
    }
    advance(shot);
}

function collision(shot, other) {
    if (other.alive && other.group == "ship" && read_global("inGame") == 1 &&
        read_global("asteroids_phase") == "active") {
        kill(other);
        kill(shot);
    }
}
