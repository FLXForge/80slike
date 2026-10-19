const MODES = ["Classic", "Assault", "Breakaway"];
function aliens() { return ["squid", "crab", "octopus"].reduce((all, name) => all.concat(find_name(name)), []); }
function born(game) {
    write_global("score", 0); write_global("lives", 3); write_global("wave", 1);
    write_global("game_over", 0); write_global("invaders_mode", 0); write_global("invaders_active_mode", 0);
    write_global("invaders_phase", "menu"); write_global("invaders_lost", false);
    write_global("invaders_invasion", false); write_global("invaders_divers", 0);
}
function transition(game, state) {
    write_global("invaders_phase", state == "playing" ? "active" : state);
    state_to(game, state);
}
function fresh_game(game) {
    write_global("score", 0); write_global("lives", 3); write_global("wave", 1);
    write_global("game_over", 0); write_global("invaders_lost", false); write_global("invaders_invasion", false);
    write_global("invaders_active_mode", read_global("invaders_mode"));
    stop_music(); transition(game, "announce");
}
function combat_timers(game, paused) {
    const objects = aliens().concat(find_name("fleet"), find_name("ufo"));
    for (const object of objects) {
        const names = object.name == "fleet" ? ["march"] : object.name == "ufo" ? ["shot", "hum"] : ["shot", "dive"];
        for (const name of names) { if (paused) pause_timer(object, name); else play_timer(object, name); }
    }
    if (paused) pause_timer(game, "ufo"); else play_timer(game, "ufo");
}
function action(game) {
    if (input_pressed(system(), button(0))) { stop_music(); exit(); return; }
    if (state_entered(game)) {
        if (state_active(game, "menu")) {
            keep_only(game); spawn(game, "menu");
        } else if (state_active(game, "announce")) {
            keep_only(game);
            write_global("invaders_divers", 0); write_global("invaders_invasion", false);
            spawn(game, "fleet");
            for (let i = 1; i <= 4; i++) spawn(game, "shield" + i);
            spawn(game, "player");
            stop_timer(game, "ufo"); play_timer(game, "ufo", random(12, 20)); pause_timer(game, "ufo");
        } else if (state_active(game, "playing")) combat_timers(game, false);
        else if (state_active(game, "respawn")) {
            combat_timers(game, true);
            for (const shot of find_name("laser")) kill(shot);
            spawn(game, "player");
        } else if (state_active(game, "result")) {
            write_global("game_over", 1); keep_only(game);
        }
        return;
    }
    if (state_active(game, "menu")) {
        if (read_global("invaders_start")) { write_global("invaders_start", false); fresh_game(game); }
        return;
    }
    if (state_active(game, "announce")) {
        if (state_time(game) >= 1.6) transition(game, "playing");
        return;
    }
    if (state_active(game, "respawn")) {
        if (state_time(game) >= 1.4) transition(game, "playing");
        return;
    }
    if (state_active(game, "result")) {
        if (input_pressed(system(), button(1))) fresh_game(game);
        else if (input_pressed(system(), button(2))) transition(game, "menu");
        return;
    }
    if (!state_active(game, "playing")) return;
    if (read_global("invaders_lost") || read_global("invaders_invasion")) {
        write_global("invaders_lost", false);
        transition(game, read_global("lives") > 0 && !read_global("invaders_invasion") ? "respawn" : "result");
        return;
    }
    if (aliens().length == 0) {
        write_global("wave", read_global("wave") + 1); transition(game, "announce"); return;
    }
    if (!timer_active(game, "ufo") && find_name("ufo").length == 0) {
        spawn(game, "ufo"); stop_timer(game, "ufo"); play_timer(game, "ufo", random(18, 28));
    }
}
function draw(game) {
    if (state_active(game, "menu")) return;
    if (state_active(game, "result")) {
        draw_text(320, 100, "GAME OVER", 30, "#ee667f");
        draw_text(320, 150, "SCORE: " + read_global("score"), 18);
        draw_text(320, 185, MODES[read_global("invaders_active_mode")] + " / WAVE " + read_global("wave"), 13, "#94b9d2");
        draw_text(320, 280, "Start: play again   Mode: title", 11); return;
    }
    draw_text(90, 12, "SCORE: " + read_global("score"), 13);
    draw_text(330, 12, "WAVE " + read_global("wave"), 12, "#94b9d2");
    draw_text(550, 12, "LIVES: " + read_global("lives"), 13);
    if (state_active(game, "announce")) {
        draw_text(320, 200, "WAVE " + read_global("wave"), 24, "#7edbff");
        draw_text(320, 225, MODES[read_global("invaders_active_mode")], 13);
    } else if (state_active(game, "respawn")) draw_text(320, 210, "GET READY", 22, "#7edbff");
}
