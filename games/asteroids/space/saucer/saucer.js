/// <reference path="https://flxforge.github.io/FLXEngine/scripts/flx.d.ts" />

function born(saucer) {
    write_global("saucers", read_global("saucers") + 1);
    write_global("saucers_pending", Math.max(0, read_global("saucers_pending") - 1));
    write_local(saucer, "destroyed_by_laser", false);
    const rightward = probability(50);
    position(saucer, rightward ? -20 : 660, random(55, 240));
    apply_velocity(saucer, rightward ? 90 : 270, random(60, 85));
    play_timer(saucer, "fire", random(1.1, 1.8));
}

function motion(saucer) {
    if (read_global("inGame") == 0 || read_global("asteroids_phase") != "active") {
        kill(saucer);
        return;
    }
    advance(saucer);
    if (saucer.x < -30 || saucer.x > 670) {
        kill(saucer);
        return;
    }
    if (timer_done(saucer, "fire")) {
        stop_timer(saucer, "fire");
        play_timer(saucer, "fire", random(1.1, 1.8));
        const ships = find_name("ship");
        if (ships.length > 0 && probability(60)) {
            const ship = ships[0];
            const angle = Math.atan2(ship.x - saucer.x, -(ship.y - saucer.y)) * 180 / Math.PI;
            write_local(saucer, "shot_angle", angle + random(-12, 12));
            spawn(saucer, "shot");
            play_sound(saucer, "fire");
        }
    }
}

function collision(saucer, other) {
    if (!other.alive || read_global("inGame") == 0 ||
        read_global("asteroids_phase") != "active") return;
    if (other.group == "laser" || other.group == "ship") {
        write_local(saucer, "destroyed_by_laser", other.group == "laser");
        kill(other);
        kill(saucer);
    }
}

function dead(saucer) {
    write_global("saucers", Math.max(0, read_global("saucers") - 1));
    if (read_global("inGame") == 0 || !read_local(saucer, "destroyed_by_laser")) return;
    write_global("score", read_global("score") + 500);
    play_sound(saucer, "down");
    for (let i = 0; i < 6; i++) spawn(saucer, "fragment");
}
