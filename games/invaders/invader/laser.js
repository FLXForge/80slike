function born(laser) {
    apply_speed(laser, (read_global("invaders_active_mode") == 1 ? 215 : 160) * Math.min(1.45, 1 + 0.035 * (read_global("wave") - 1)));
    play_sound(laser, "shot");
}
function motion(laser) {
    if (read_global("invaders_phase") != "active" || laser.y > 330) { kill(laser); return; }
    advance(laser);
}
function collision(laser, other) {
    if (read_global("invaders_phase") != "active" || read_local(laser, "spent")) return;
    write_local(laser, "spent", true);
    if (other.group == "shield") { play_sound(laser, "shield_hit"); kill(other); }
    kill(laser);
}
