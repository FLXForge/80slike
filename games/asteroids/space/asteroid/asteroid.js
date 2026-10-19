/// <reference path="https://flxforge.github.io/FLXEngine/scripts/flx.d.ts" />

function born(asteroid) {
    write_global("asteroids", read_global("asteroids") + 1);
    write_global("asteroids_pending", Math.max(0, read_global("asteroids_pending") - 1));
    const edge = Math.floor(random(0, 3.99));
    if (edge == 0) position(asteroid, 20, random(30, 290));
    else if (edge == 1) position(asteroid, 620, random(30, 290));
    else if (edge == 2) position(asteroid, random(30, 610), 20);
    else position(asteroid, random(30, 610), 300);
    const heading = random(0, 360);
    const baseSpeed = random(20, 70);
    write_local(asteroid, "heading", heading);
    write_local(asteroid, "base_speed", baseSpeed);
    write_local(asteroid, "destroyed_by_laser", false);
    apply_angle(asteroid, heading);
    apply_velocity(asteroid, heading, baseSpeed * read_global("asteroids_speed_factor"));
    apply_rotation_speed(asteroid, random(-90, 90));
}

function motion(asteroid) {
    if (read_global("inGame") == 0) {
        kill(asteroid);
        return;
    }
    if (read_global("asteroids_phase") != "active") return;
    apply_velocity(asteroid, read_local(asteroid, "heading"),
        read_local(asteroid, "base_speed") * read_global("asteroids_speed_factor"));
    advance(asteroid);
    rotate(asteroid);
}

function collision(asteroid, other, contacts) {
    if (!asteroid.alive || !other.alive || read_global("inGame") == 0 ||
        read_global("asteroids_phase") != "active") return;
    if (other.group == "asteroid") {
        for (const contact of contacts) position(asteroid, contact);
        const heading = random(0, 360);
        write_local(asteroid, "heading", heading);
        write_local(other, "heading", heading + 180);
        const factor = read_global("asteroids_speed_factor");
        apply_velocity(asteroid, heading, read_local(asteroid, "base_speed") * factor);
        apply_velocity(other, heading + 180, read_local(other, "base_speed") * factor);
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
    play_sound(asteroid, "pfooom");
    spawn(asteroid, "fragment");
    spawn(asteroid, "fragment");
    if (!read_local(asteroid, "destroyed_by_laser")) return;
    write_global("score", read_global("score") + 100);
    spawn(asteroid, "fragment");
    spawn(asteroid, "fragment");
    const pieces = read_global("asteroids_active_mode") == 2 ? 3 : 2;
    write_global("asteroids_pending", read_global("asteroids_pending") + pieces);
    for (let i = 0; i < pieces; i++) spawn(asteroid, "small");
}
