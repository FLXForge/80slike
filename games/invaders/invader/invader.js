function shot_delay(first) {
    const factor = Math.min(2, 1 + 0.07 * (read_global("wave") - 1));
    return (read_global("invaders_active_mode") == 1 ? random(first ? 1 : 7, first ? 12 : 16) : random(first ? 1 : 18, first ? 24 : 36)) / factor;
}
function born(invader) {
    const fleet = find_parent(invader);
    write_local(invader, "slot_x", invader.x - fleet.x);
    write_local(invader, "slot_y", invader.y - fleet.y);
    write_local(invader, "diving", false);
    play_timer(invader, "shot", shot_delay(true)); pause_timer(invader, "shot");
    play_timer(invader, "dive", random(3, 10)); pause_timer(invader, "dive");
}
function motion(invader) {
    if (read_global("invaders_phase") != "active") return;
    if (read_global("invaders_active_mode") == 2) update_dive(invader);
    if (!timer_active(invader, "shot")) {
        spawn(invader, "laser"); stop_timer(invader, "shot");
        play_timer(invader, "shot", read_local(invader, "diving") ? random(0.65, 1.1) : shot_delay(false));
    }
}
function update_dive(invader) {
    const fleet = find_parent(invader);
    if (!fleet) return;
    if (!read_local(invader, "diving")) {
        if (timer_active(invader, "dive")) return;
        const maximum = read_global("wave") >= 5 ? 3 : 2;
        if (read_global("invaders_divers") >= maximum) {
            stop_timer(invader, "dive"); play_timer(invader, "dive", random(0.8, 2.2)); return;
        }
        const player = find_name("player")[0];
        detach(invader);
        write_local(invader, "diving", true); write_local(invader, "dive_age", 0);
        write_local(invader, "start_x", invader.x); write_local(invader, "start_y", invader.y);
        write_local(invader, "target_x", player ? player.x : 320);
        write_local(invader, "side", probability(50) ? 1 : -1);
        write_global("invaders_divers", read_global("invaders_divers") + 1);
        stop_timer(invader, "shot"); play_timer(invader, "shot", 0.35);
    }
    const age = read_local(invader, "dive_age") + delta(); write_local(invader, "dive_age", age);
    const target = read_local(invader, "target_x");
    if (age < 2.6) {
        const t = age / 2.6;
        position(invader, Math.max(20, Math.min(620, read_local(invader, "start_x") + (target - read_local(invader, "start_x")) * t + Math.sin(t * Math.PI * 2) * 35 * read_local(invader, "side"))), read_local(invader, "start_y") + (315 - read_local(invader, "start_y")) * Math.sin(t * Math.PI / 2));
    } else {
        const t = Math.min(1, (age - 2.6) / 2), ease = t * t * (3 - 2 * t);
        const x = fleet.x + read_local(invader, "slot_x"), y = fleet.y + read_local(invader, "slot_y");
        position(invader, target + (x - target) * ease, 315 + (y - 315) * ease);
        if (t >= 1) {
            position(invader, x, y); attach(invader);
            write_local(invader, "diving", false); write_global("invaders_divers", Math.max(0, read_global("invaders_divers") - 1));
            stop_timer(invader, "dive"); play_timer(invader, "dive", random(6, 14));
        }
    }
}
function collision(invader, other) { if (read_global("invaders_phase") == "active" && other.group == "shield") kill(other); }
function dead(invader) {
    if (read_local(invader, "diving")) write_global("invaders_divers", Math.max(0, read_global("invaders_divers") - 1));
}
