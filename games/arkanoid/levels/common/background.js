function action(background) {
    if (read_global("arkanoid_active_mode") != 1) return;
    for (const name of ["linea", "lineb", "linec"]) {
        for (const line of find_name(name)) apply_color(line, "#77776f");
    }
}
