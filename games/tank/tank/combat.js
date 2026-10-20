function born(tank) {
    const advanced = read_global("tank_advanced") == 1;
    const cpu = tank.group == "enemy" && read_global("tank_pvp") == 0;
    apply_speed(tank, advanced ? (cpu ? 70 : 80) : (cpu ? 45 : 55));
    apply_rotation_speed(tank, advanced ? (cpu ? 145 : 165) : (cpu ? 90 : 120));
    write_local(tank, "protected", read_global("tank_phase") != "menu");
    if (read_global("tank_phase") != "menu") play_timer(tank, "protection", 3);
}
function action(tank) {
    if (!read_local(tank,"protected")) return;
    if (!timer_active(tank,"protection")) { write_local(tank,"protected",false);show(tank);return; }
    if (read_global("tank_phase") != "combat" || Math.floor(timer_left(tank,"protection")*8)%2) show(tank);else hide(tank);
}
function dead(tank) {
    if (read_global("tank_phase") != "combat" || !read_local(tank,"hit_by")) return;
    const victim=tank.group=="player"?1:2, attacker=read_local(tank,"hit_by");
    write_global("tank_lives"+victim,Math.max(0,read_global("tank_lives"+victim)-1));
    write_global("tank_hits"+attacker,read_global("tank_hits"+attacker)+1);
    write_global("tank_respawn"+victim,true);play_sound(tank,"dead");
}
function draw(tank) {
    if(read_global("tank_advanced")!=1)return;
    for(const x of [-11,11])for(let y=-9;y<=9;y+=6)draw_line(tank,x-1,y,x+1,y,"#a6977c");
}
