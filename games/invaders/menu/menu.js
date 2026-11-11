const NAMES = ["Classic", "Assault", "Breakaway"];
const COLORS = ["#7edbff", "#ff9c62", "#d6a0ef"];
const DESCRIPTIONS = ["Endless formations / 3 lives", "Heavier fire / faster enemy shots", "Diving attackers / shifting threats"];
function born(menu) {
    write_local(menu, "star_seed", random(0, 1000)); write_local(menu, "lore", false);
    play_timer(menu, "display", 8); play_music(menu, "theme");
}
function action(menu) {
    if (read_global("invaders_phase") != "menu") return;
    if (input_pressed(system(), button(1))) {
        stop_music(); write_global("invaders_start", true); return;
    }
    if (input_pressed(system(), button(2))) write_global("invaders_mode", (read_global("invaders_mode") + 1) % 3);
    if (input_down(system(), button(1)) || input_down(system(), button(2)) || input_down(player(1), button(0)) ||
        input_direction(player(1), direction(0), HORIZONTAL) != 0 || input_direction(player(1), direction(0), VERTICAL) != 0) {
        write_local(menu, "lore", false); stop_timer(menu,"display"); play_timer(menu,"display",8);
    } else if (timer_done(menu,"display")) {
        write_local(menu,"lore",!read_local(menu,"lore")); stop_timer(menu,"display"); play_timer(menu,"display",8);
    }
}
function draw(menu) {
    if (read_global("invaders_phase") != "menu") return;
    const seed = read_local(menu, "star_seed");
    for (let i = 0; i < 65; i++) draw_pixel((i * 137 + seed) % 640, (i * 79 + Math.floor(seed * 3)) % 320, "#23334c");
    draw_text(323,77,"INVADERS",58,"#152c50");
    draw_text(320,74,"INVADERS",58,"#b7e5f5");
    draw_line(158,107,482,107,"#365a7a");
    if (read_local(menu,"lore")) {
        draw_text(320,181,"The invaders are approaching.",13);
        draw_text(320,201,"They come from outer space.",13);
        draw_text(320,221,"A cosmic horde.",13);
        draw_text(320,241,"To advance, they must first go left... then right.",13);
    } else {
        const mode=read_global("invaders_mode");
        draw_text(320,190,NAMES[mode],24,COLORS[mode]);
        draw_text(320,222,DESCRIPTIONS[mode],12,"#94b9d2");
    }
    draw_text(320,295,"Mode: change game   Start: play",11);
}
