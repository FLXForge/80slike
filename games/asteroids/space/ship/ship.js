/// <reference path="https://flxforge.github.io/FLXEngine/scripts/flx.d.ts" />

const FIRE = button(0);
const MOVE = direction(0);

function born(ship) {
    collider_off(ship, "body");
    play_timer(ship, "protection", read_global("asteroids_phase") == "announce" ? 2.9 : 1.5);
}

function action(ship) {
    if (read_global("inGame") == 0 || read_global("asteroids_phase") != "active") return;
    if (input_down(ship, MOVE, LEFT)) rotate(ship, -1);
    if (input_down(ship, MOVE, RIGHT)) rotate(ship, 1);
    if (input_down(ship, MOVE, UP) && probability(20)) {
        play_sound(ship, "motor");
        spawn(ship, "tail");
    }
    if (input_pressed(ship, FIRE)) {
        play_sound(ship, "laser");
        spawn(ship, "laser");
    }
}

function motion(ship) {
    if (timer_done(ship, "protection")) {
        collider_on(ship, "body");
        stop_timer(ship, "protection");
    }
    if (read_global("inGame") == 0 || read_global("asteroids_phase") != "active") return;
    // accelerate already moves this frame; never advance a second time.
    if (input_down(ship, MOVE, UP)) accelerate(ship);
    else advance(ship);
}

function dead(ship) {
    if (read_global("inGame") == 0) return;
    play_sound(ship, "dead");
    const lives = Math.max(0, read_global("lives") - 1);
    write_global("lives", lives);
    if (lives > 0) write_global("shipDead", 1);
    else write_global("inGame", 0);
    spawn(ship, "fragment");
    spawn(ship, "fragment");
    spawn(ship, "fragment");
}
