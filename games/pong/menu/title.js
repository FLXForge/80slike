/// <reference path="https://flxforge.github.io/FLXEngine/scripts/flx.d.ts" />

const FLASH_SECONDS = 0.5;
const REACH = 12;

function born(title) {
    play_timer(title, "wait", random(2, 5));
}

function action(title) {
    if (!state_active(title, "menu")) return;
    if (timer_done(title, "wait") && !timer_active(title, "flash")) {
        // Keep every arm inside the title's declared rectangular area.
        write_local(title, "sparkX", Math.floor(random(-48, 48)));
        write_local(title, "sparkY", Math.floor(random(-8, 8)));
        stop_timer(title, "flash");
        play_timer(title, "flash", FLASH_SECONDS);
        stop_timer(title, "wait");
    } else if (timer_done(title, "flash") && !timer_active(title, "wait")) {
        stop_timer(title, "flash");
        play_timer(title, "wait", random(2, 5));
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
