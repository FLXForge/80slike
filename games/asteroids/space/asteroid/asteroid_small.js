/// <reference path="https://flxforge.github.io/FLXEngine/scripts/flx.d.ts" />

function born(asteroid) {
    write_global("asteroids", read_global("asteroids") + 1);
    const heading = random(0, 360);
    const speed = random(40, 100);
    write_local(asteroid, "drift_speed", speed);
    write_local(asteroid, "destroyed_by_laser", false);
    apply_angle(asteroid, heading);
    apply_velocity(asteroid, heading, speed);
    apply_rotation_speed(asteroid, random(-180, 180));
}

function motion(asteroid) {
    if (read_global("inGame") == 0) {
        kill(asteroid);
        return;
    }
    advance(asteroid);
    rotate(asteroid);
}

function collision(asteroid, other, contacts) {
    if (!asteroid.alive || !other.alive || read_global("inGame") == 0) return;
    if (other.group == "asteroid") {
        for (const contact of contacts) position(asteroid, contact);
        const heading = random(0, 360);
        apply_velocity(asteroid, heading, read_local(asteroid, "drift_speed"));
        apply_velocity(other, heading + 180, read_local(other, "drift_speed"));
        return;
    }
    if (other.group == "laser" || other.group == "ship") {
        write_local(asteroid, "destroyed_by_laser", other.group == "laser");
        kill(other);
        kill(asteroid);
    }
}

function dead(asteroid) {
    write_global("asteroids", Math.max(0, read_global("asteroids") - 1));
    if (read_global("inGame") == 0) return;
    play_sound(asteroid, "pff");
    spawn(asteroid, "fragment");
    spawn(asteroid, "fragment");
    if (!read_local(asteroid, "destroyed_by_laser")) return;
    write_global("score", read_global("score") + 300);
    spawn(asteroid, "fragment");
    spawn(asteroid, "fragment");
    if (probability(50)) {
        spawn(asteroid, "fragment");
        spawn(asteroid, "fragment");
    }
}
