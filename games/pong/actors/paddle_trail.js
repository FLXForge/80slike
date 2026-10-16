/// <reference path="https://flxforge.github.io/FLXEngine/scripts/flx.d.ts" />

const LIFE = 0.14;

function born(trail) {
    const paddle = find_parent(trail);
    if (!paddle) {
        kill(trail);
        return;
    }
    write_local(trail, "direction", read_local(paddle, "trail_direction"));
    const firstLane = Math.floor(random(0, 2.99));
    const secondLane = (firstLane + 1 + Math.floor(random(0, 1.99))) % 3;
    write_local(trail, "lane0", firstLane);
    write_local(trail, "lane1", secondLane);
    for (let line = 0; line < 2; line++) {
        write_local(trail, "length" + line, random(7, 18));
        write_local(trail, "offset" + line, random(-2, 6));
        write_local(trail, "drift" + line, random(6, 13));
    }
    play_timer(trail, "life", LIFE);
}

function motion(trail) {
    const paddle = find_parent(trail);
    if (!paddle || !paddle.alive || !timer_active(trail, "life")) kill(trail);
}

function draw(trail) {
    if (!timer_active(trail, "life")) return;
    const paddle = find_parent(trail);
    if (!paddle || !paddle.alive) return;
    const remaining = timer_left(trail, "life") / LIFE;
    const progress = 1 - remaining;
    const behind = -read_local(trail, "direction");
    const color = progress < 0.45 ? "white" : "blue";

    // Draw in the live paddle's local space, inside its horizontal footprint.
    // Independent strokes travel backward and shorten, without a stepped fan.
    for (let line = 0; line < 2; line++) {
        const lane = read_local(trail, "lane" + line);
        const x = (lane - 1) * Math.max(0, paddle.width / 2 - 0.5);
        const start = behind * (paddle.height / 2 +
            read_local(trail, "offset" + line) +
            progress * read_local(trail, "drift" + line));
        const end = start + behind * read_local(trail, "length" + line) * remaining;
        const y1 = Math.max(20, Math.min(170, paddle.y + start)) - paddle.y;
        const y2 = Math.max(20, Math.min(170, paddle.y + end)) - paddle.y;
        if (Math.abs(y2 - y1) >= 1) {
            draw_line(paddle, x, y1, x, y2, color);
        }
    }
}
