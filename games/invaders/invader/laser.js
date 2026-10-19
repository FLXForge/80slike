function born(laser) { play_sound(laser, "shot"); }
function motion(laser) {
    if (read_global("game_over") == 1 || laser.y > 330) { kill(laser); return; }
    advance(laser);
}
function collision(laser, other) {
    if (read_local(laser, "spent")) return;
    write_local(laser, "spent", true);
    if (other.group == "shield") { play_sound(laser, "shield_hit"); kill(other); }
    kill(laser);
}
