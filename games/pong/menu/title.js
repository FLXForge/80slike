/// <reference path="https://flxforge.github.io/FLXEngine/scripts/flx.d.ts" />

const ECHO_SECONDS = 0.18;
const FLASH_SECONDS = 0.5;
const REACH = 12;

function born(title) {
    write_local(title, "next_echo", "red_echo");
    write_local(title, "active_echo", "");
    play_timer(title, "wait", random(0.8, 1.6));
    play_timer(title, "spark_wait", random(2, 5));
}

function action(title) {
    if (!state_active(title, "menu")) return;
    if (timer_done(title, "wait") && !timer_active(title, "echo")) {
        const next = read_local(title, "next_echo");
        write_local(title, "active_echo", next);
        write_local(title, "next_echo", next == "red_echo" ? "blue_echo" : "red_echo");
        stop_timer(title, "wait");
        stop_timer(title, "echo");
        play_timer(title, "echo", ECHO_SECONDS);
    } else if (timer_done(title, "echo") && !timer_active(title, "wait")) {
        write_local(title, "active_echo", "");
        stop_timer(title, "echo");
        play_timer(title, "wait", random(0.8, 1.6));
    }

    if (timer_done(title, "spark_wait") && !timer_active(title, "flash")) {
        write_local(title, "sparkX", Math.floor(random(-48, 48)));
        write_local(title, "sparkY", Math.floor(random(-8, 8)));
        stop_timer(title, "flash");
        play_timer(title, "flash", FLASH_SECONDS);
        stop_timer(title, "spark_wait");
    } else if (timer_done(title, "flash") && !timer_active(title, "spark_wait")) {
        stop_timer(title, "flash");
        play_timer(title, "spark_wait", random(2, 5));
    }

    const active = timer_active(title, "echo") ? read_local(title, "active_echo") : "";
    for (const child of find_children(title)) {
        if (child.name == "face" || child.name == active) {
            show(child);
        } else {
            hide(child);
        }
    }
}

function draw(title) {
    if (!state_active(title, "menu") || !timer_active(title, "flash")) return;
    const progress = 1 - timer_left(title, "flash") / FLASH_SECONDS;
    const head = Math.floor(progress * (REACH + 4));
    const tail = Math.max(0, head - 3);
    const x = read_local(title, "sparkX");
    const y = read_local(title, "sparkY");
    for (let distance = tail; distance <= Math.min(REACH, head); distance++) {
        const color = distance == head ? "white" : "red";
        if (distance == 0) {
            draw_pixel(title, x, y, color);
        } else {
            draw_pixel(title, x + distance, y, color);
            draw_pixel(title, x - distance, y, color);
            draw_pixel(title, x, y + distance, color);
            draw_pixel(title, x, y - distance, color);
        }
    }
}
