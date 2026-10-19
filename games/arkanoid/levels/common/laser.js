function born(laser) {
    const paddle = find_parent(laser);
    const side = laser.name == "laser_left" ? -1 : 1;
    position(laser, paddle.x + side * (paddle.width / 2 - 5), paddle.y - 15);
}
function motion(laser) {
    if (laser.y <= 55 || read_global("show_hud") != 1 || read_global("game_over") != 0 || read_global("briks") <= 0) { kill(laser); return; }
    advance(laser);
}
function collision(laser, other) {
    if (read_local(laser, "spent")) return;
    write_local(laser, "spent", true);
    if (other.group == "brick" && !read_local(other, "destroyed")) {
        write_local(other, "destroyed", true);
        write_global("score", read_global("score") + 100);
        write_global("briks", read_global("briks") - 1);
        try_spawn_powerup(laser);
        kill(other);
    }
    kill(laser);
}
function try_spawn_powerup(source) {
    if (read_global("arkanoid_active_mode") != 0 || !probability(15)) return;
    // Six equal common weights and a much smaller extra-life weight.
    const roll = random(0, 37);
    const names = ["expand", "shrink", "glue", "pierce", "laser", "barrier", "life"];
    spawn(source, names[Math.min(6, Math.floor(roll / 6))]);
}
