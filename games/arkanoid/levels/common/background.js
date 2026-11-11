function born(background) {
    if (read_global("arkanoid_active_mode") == 0) spawn(background, "checker");
}

function action(background) {
    const colors = read_global("arkanoid_active_mode") == 1 ? ["#c65a4a", "#d59946", "#71955b"] : ["#335578", "#799fbc", "#335578"];
    const names = ["linea", "lineb", "linec"];
    for (let i = 0; i < names.length; i++) for (const line of find_name(names[i])) apply_color(line, colors[i]);
}
