/// <reference path="https://flxforge.github.io/FLXEngine/scripts/flx.d.ts" />

const START = button(1);
const ANNOUNCE_SECONDS = 1.4;

function born(ui) {
    if (read_global("inGame") == 1) spawn(ui, "ship");
}

function action(ui) {
    if (read_global("inGame") == 0) {
        if (input_pressed(system(), START)) write_global("asteroids_start", true);
        return;
    }
    if (state_entered(ui) && state_active(ui, "announce")) {
        const wave = read_global("asteroids_wave");
        write_global("asteroids_phase", "announce");
        write_global("asteroids_wave_time", 0);
        write_global("asteroids_speed_factor", Math.min(1 + 0.05 * (wave - 1), 1.5));
        write_global("asteroids_wave_remaining", Math.min(4 + Math.floor((wave - 1) / 2), 10));
        play_sound(ui, "wave");
        if (wave == 5) save("80slike", "asteroids", true);
    }
    if (state_active(ui, "announce")) {
        if (state_time(ui) >= ANNOUNCE_SECONDS) {
            write_global("asteroids_phase", "active");
            state_to(ui, "active");
        }
        return;
    }

    const seconds = read_global("asteroids_wave_time") + delta();
    write_global("asteroids_wave_time", seconds);
    const base = Math.min(1 + 0.05 * (read_global("asteroids_wave") - 1), 1.5);
    const mode = read_global("asteroids_active_mode");
    const growth = mode == 1 ? 0.01 : (mode == 2 ? 0.02 : 0);
    write_global("asteroids_speed_factor", base + growth * seconds);
    if (read_global("asteroids_wave_remaining") == 0 &&
        read_global("asteroids_pending") == 0 && read_global("asteroids") == 0) {
        write_global("asteroids_wave", read_global("asteroids_wave") + 1);
        write_global("asteroids_phase", "announce");
        state_to(ui, "announce");
    }
}

function motion(ui) {
    if (read_global("inGame") == 1 && read_global("shipDead") == 1) {
        write_global("shipDead", 0);
        spawn(ui, "ship");
    }
}

function draw(ui) {
    if (read_global("inGame") == 0) {
        draw_text(320, 90, "GAME OVER", 24);
        draw_text(320, 132, "SCORE: " + read_global("score"), 15);
        draw_text(320, 158, "WAVE: " + read_global("asteroids_wave"), 15);
        draw_text(320, 205, "Start: play again   Mode: menu", 15);
    } else {
        draw_text(70, 12, "SCORE: " + read_global("score"), 11);
        draw_text(70, 28, "LIVES: " + read_global("lives"), 11);
        draw_text(570, 12, "WAVE: " + read_global("asteroids_wave"), 11);
        if (read_global("asteroids_phase") == "announce") {
            draw_text(320, 120, "WAVE " + read_global("asteroids_wave"), 28);
            draw_text(320, 150, read_global("asteroids_wave_remaining") + " ASTEROIDS", 11);
        }
    }
}
