/// <reference path="https://flxforge.github.io/FLXEngine/scripts/flx.d.ts" />

const ACTION = button(0);
const EXIT = button(0);
const MOVE = direction(0);
const LABELS = [
    "PONG - Ode to Joy", "ASTEROIDS - Composite 1",
    "PONG - Paddle Ceremony", "ASTEROIDS - One More Pilot",
    "FX - Thruster", "FX - Hyperspace", "FX - Arrival",
    "FX - Player laser", "FX - Ship explosion",
    "FX - Saucer laser", "FX - Saucer explosion", "FX - Wave"
];

function born(test) {
    write_local(test, "option", 0);
    write_local(test, "playing", false);
}

function action(test) {
    if (input_pressed(system(), EXIT)) {
        stop_music();
        exit();
        return;
    }
    let option = read_local(test, "option");
    if (!read_local(test, "playing")) {
        if (input_pressed(player(1), MOVE, UP)) option = Math.max(0, option - 1);
        if (input_pressed(player(1), MOVE, DOWN)) option = Math.min(LABELS.length - 1, option + 1);
        write_local(test, "option", option);
    }
    if (input_pressed(player(1), ACTION)) {
        if (option < 4) {
            const playing = !read_local(test, "playing");
            write_local(test, "playing", playing);
            if (playing) play_music(test, "m" + (option + 1));
            else stop_music();
        } else {
            play_sound(test, "fx" + (option - 4));
        }
    }
}

function draw(test) {
    draw_text(320, 28, "SOUND TEST", 24);
    const selected = read_local(test, "option");
    for (let i = 0; i < LABELS.length; i++) {
        draw_text(320, 65 + i * 18, LABELS[i], 13, selected == i ? "blue" : "white");
    }
    draw_text(320, 303, "Up/Down: select   Action: play/stop   Exit: close", 11);
}
