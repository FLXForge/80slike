/// <reference path="https://flxforge.github.io/FLXEngine/scripts/flx.d.ts" />

const WIN_SCORE = 11;
const FIRE_BUTTON = button(0);
const EXIT_BUTTON = button(0);
const START_BUTTON = button(1);
const MODE_BUTTON = button(2);

function born(game) {
    write_global("pl1", 0);
    write_global("pl2", 0);
    write_global("players", 1);
    write_global("pong_variant", 0);
    write_global("pong_frenetic", false);
    write_global("pong_cpu_progressive", false);
    write_global("effects", 1);
    write_global("winer", 0);
    write_global("goal_effect", 0);
    write_global("pong_round_over", false);
}

function action(game) {
    if (input_pressed(system(), EXIT_BUTTON)) {
        exit();
        return;
    }

    if (state_entered(game)) {
        keep_only(game);
        if (state_active(game, "game")) {
            write_global("pl1", 0);
            write_global("pl2", 0);
            write_global("winer", 0);
            write_global("goal_effect", 0);
            write_global("pong_round_over", false);
            spawn(game, "player");
            spawn(game, "enemy");
            spawn(game, "ball");
            spawn(game, "court");
        } else if (state_active(game, "result")) {
            play_timer(game, "result_guard", 0.45);
        } else {
            spawn(game, "menu");
        }
        return;
    }

    if (state_active(game, "result")) {
        if (timer_active(game, "result_guard")) return;
        if (input_pressed(system(), START_BUTTON)) {
            state_to(game, "game");
        } else if (input_pressed(system(), MODE_BUTTON)) {
            state_to(game, "menu");
        }
        return;
    }

    if (!state_active(game, "game")) return;
    if (read_global("pl1") >= WIN_SCORE || read_global("pl2") >= WIN_SCORE) {
        write_global("winer", read_global("pl1") > read_global("pl2") ? 1 : 2);
        write_global("pong_round_over", true);
        state_to(game, "result");
        return;
    }
    if (input_pressed(player(1), FIRE_BUTTON) || input_pressed(player(2), FIRE_BUTTON)) {
        write_global("pong_round_over", true);
        state_to(game, "menu");
    }
}

function draw(game) {
    if (state_active(game, "result")) {
        const winner = read_global("winer");
        const name = winner == 1 ? "PLAYER 1" : (read_global("players") == 1 ? "CPU" : "PLAYER 2");
        draw_text(160, 35, "GAME OVER", 24);
        draw_text(160, 70, name + " WINS", 20, winner == 1 ? "blue" : "red");
        draw_text(160, 110, read_global("pl1") + " - " + read_global("pl2"), 28);
        draw_text(160, 138, "FIRST TO 11", 11);
        draw_text(160, 160, "Start: rematch   Mode: menu", 11);
        return;
    }
    if (!state_active(game, "game")) return;
    if (read_global("goal_effect") == 1) {
        write_global("goal_effect", 0);
        spawn(game, "goal_effect");
    }
    draw_text(65, 10, "PLAYER 1: " + read_global("pl1"), 11,
        read_global("pl1") > 8 ? "blue" : "white");
    const opponent = read_global("players") == 1 ? "CPU: " : "PLAYER 2: ";
    draw_text(255, 10, opponent + read_global("pl2"), 11,
        read_global("pl2") > 8 ? "blue" : "white");
    draw_rectangle(160, 95, 300, 150);
    draw_line(160, 30, 160, 160);
}
