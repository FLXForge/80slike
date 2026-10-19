/// <reference path="https://flxforge.github.io/FLXEngine/scripts/flx.d.ts" />

const ACTION = button(0);
const EXIT = button(0);
const MOVE = direction(0);
const MUSIC_COUNT = 5;
const LABELS = [
    "PONG - Ode to Joy", "ASTEROIDS - Composite 1",
    "PONG - Paddle Ceremony", "ASTEROIDS - One More Pilot",
    "ARKANOID - Brick by Brick",
    "FX - Thruster", "FX - Hyperspace", "FX - Arrival",
    "FX - Player laser", "FX - Ship explosion",
    "FX - Saucer laser", "FX - Saucer explosion", "FX - Wave",
    "INVADERS - March 1", "INVADERS - March 2",
    "INVADERS - March 3", "INVADERS - March 4",
    "INVADERS - Alien down", "INVADERS - Shield chip",
    "INVADERS - UFO low", "INVADERS - UFO high"
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
        if (option < MUSIC_COUNT) {
            const playing = !read_local(test, "playing");
            write_local(test, "playing", playing);
            if (playing) play_music(test, "m" + (option + 1));
            else stop_music();
        } else {
            play_sound(test, "fx" + (option - MUSIC_COUNT));
        }
    }
}

function draw(test) {
    draw_text(320, 28, "SOUND TEST", 24);
    const selected = read_local(test, "option");
    const first = Math.max(0, Math.min(selected - 5, LABELS.length - 11));
    draw_text(320, 49, (selected + 1) + " / " + LABELS.length, 11, "#94b9d2");
    for (let i = first; i < Math.min(LABELS.length, first + 11); i++) {
        draw_text(320, 75 + (i - first) * 18, LABELS[i], 13, selected == i ? "#7edbff" : "white");
    }
    draw_text(320, 303, "Up/Down: select   Action: play/stop   Exit: close", 11);
}
