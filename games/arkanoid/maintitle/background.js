function action(background) {
    const arkanoid = read_global("arkanoid_mode") == 0;
    for (const name of ["skyTop", "skyMid", "sunsetYellow", "sunsetOrange", "sunsetRed", "floor"]) {
        for (const band of find_name(name)) { if (arkanoid) hide(band); else show(band); }
    }
    const grids = find_name("checker");
    if (arkanoid && grids.length == 0) spawn(background, "checker");
    if (!arkanoid) for (const checker of grids) kill(checker);
}
