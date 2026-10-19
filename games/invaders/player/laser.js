function born(laser) { play_sound(laser, "shot"); }
function motion(laser) {
    if (read_global("game_over") == 1 || laser.y < -10) { kill(laser); return; }
    advance(laser);
}
function collision(laser, other) {
    if (read_local(laser, "spent")) return;
    write_local(laser, "spent", true);
    if (read_local(other, "destroyed")) { kill(laser); return; }
    write_local(other, "destroyed", true);
    if (other.group == "shield") play_sound(laser, "shield_hit");
    else if (other.group == "invader") play_sound(laser, "alien_hit");
    else if (other.group == "ufo") play_sound(laser, "ufo_hit");
    if (other.group == "invader" || other.group == "ufo") write_global("score", read_global("score") + (other.group == "ufo" ? 500 : 100));
    kill(other);
    kill(laser);
}
