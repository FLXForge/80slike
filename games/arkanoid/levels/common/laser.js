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
        write_local(other, "hits", (read_local(other, "hits") || 0) + 1);
    }
    kill(laser);
}
