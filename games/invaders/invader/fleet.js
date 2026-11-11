const ALIEN_NAMES = ["squid", "crab", "octopus"];
let fleet_direction = RIGHT;
function born(fleet) {
    fleet_direction = RIGHT; write_local(fleet, "march_note", 0);
    play_timer(fleet, "march", 0.1); pause_timer(fleet, "march");
}
function motion(fleet) {
    if (read_global("invaders_phase") != "active") return;
    const aliens = ALIEN_NAMES.reduce((all, name) => all.concat(find_name(name)), []);
    const formation = aliens.filter(alien => !read_local(alien, "diving"));
    if (formation.length == 0) return;
    const wave_factor = Math.min(2, 1 + 0.08 * (read_global("wave") - 1));
    apply_speed(fleet, 30 * wave_factor * (1 + 2 * (1 - aliens.length / 66)));
    const previous_y = fleet.y;
    const previous_x = fleet.x;
    move_horizontal(fleet, fleet_direction);
    const shift_x = fleet.x - previous_x;
    let left = 640, right = 0, bottom = 0;
    for (const alien of formation) {
        // The attached children update later, so include this frame's parent displacement.
        left = Math.min(left, alien.x + shift_x - alien.width / 2);
        right = Math.max(right, alien.x + shift_x + alien.width / 2);
        bottom = Math.max(bottom, alien.y + alien.height / 2);
    }
    if ((left <= 24 && fleet_direction == LEFT) || (right >= 616 && fleet_direction == RIGHT)) {
        fleet_direction = fleet_direction == LEFT ? RIGHT : LEFT;
        position_y(fleet, fleet.y + 8);
    }
    bottom += fleet.y - previous_y;
    const player = find_name("player")[0];
    if (player && bottom >= player.y) {
        write_global("invaders_invasion", true);
        kill(player);
        write_global("lives", 0);
        return;
    }
    if (!timer_active(fleet, "march")) {
        const note = read_local(fleet, "march_note");
        play_sound(fleet, "step" + note);
        write_local(fleet, "march_note", (note + 1) % 4);
        stop_timer(fleet, "march");
        play_timer(fleet, "march", (0.14 + 0.5 * aliens.length / 66) / Math.min(1.5, wave_factor));
    }
}
