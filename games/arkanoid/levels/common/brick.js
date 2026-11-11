function normal_color(brick) {
    const warm = ["#c65a4a", "#d59946", "#b9b34d", "#71955b"];
    if (read_global("arkanoid_active_mode") == 1) return warm[Math.min(3, Math.max(0, Math.floor((brick.y - 65) / 40)))];
    const colors = { R: "#d95b65", B: "#547edb", C: "#45bbc6", Y: "#e0bc51", V: "#a66ed4" };
    return colors[brick.name] || "#d95b65";
}
function appearance(brick) {
    const hp = read_local(brick, "hp");
    apply_color(brick, hp == 3 ? "#d6b357" : hp == 2 ? "#b6bec9" : normal_color(brick));
}
function born(brick) {
    write_local(brick, "hp", brick.name == "gold" ? 3 : brick.name == "silver" ? 2 : 1);
    write_local(brick, "hits", 0);
    appearance(brick);
    write_global("briks", read_global("briks") + 1);
}
function action(brick) {
    const contact = read_local(brick, "ball_contact");
    if (contact) {
        const ball = find_id(contact);
        if (!ball || Math.abs(ball.x - brick.x) > (brick.width + ball.width) / 2 + 1 ||
            Math.abs(ball.y - brick.y) > (brick.height + ball.height) / 2 + 1) write_local(brick, "ball_contact", "");
    }
    const hits = read_local(brick, "hits");
    if (!hits || read_local(brick, "destroyed")) return;
    write_local(brick, "hits", 0);
    const hp = Math.max(0, read_local(brick, "hp") - hits);
    write_local(brick, "hp", hp);
    if (hp > 0) { appearance(brick); return; }
    write_local(brick, "destroyed", true);
    write_global("score", read_global("score") + 100);
    write_global("briks", read_global("briks") - 1);
    if (read_global("arkanoid_active_mode") == 0 && probability(15)) {
        const names = ["expand", "shrink", "glue", "pierce", "laser", "barrier", "life"];
        spawn(brick, names[Math.min(6, Math.floor(random(0, 37) / 6))]);
    }
    kill(brick);
}

function draw(brick) {
    if (read_global("arkanoid_active_mode") != 0) return;
    const x = brick.width / 2, y = brick.height / 2;
    draw_line(brick, -x + 1, -y + 1, x - 1, -y + 1, "#d8e2ed");
    draw_line(brick, -x + 1, -y + 1, -x + 1, y - 1, "#a4b6c9");
    draw_line(brick, -x + 1, y - 1, x - 1, y - 1, "#18263d");
    draw_line(brick, x - 1, -y + 1, x - 1, y - 1, "#18263d");
}
