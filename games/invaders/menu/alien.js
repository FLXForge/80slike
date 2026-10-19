function born(alien) { write_local(alien, "age", 0); write_local(alien, "base_y", alien.y); }
function motion(alien) {
    const age = read_local(alien, "age") + delta(); write_local(alien, "age", age);
    position_y(alien, read_local(alien, "base_y") + Math.sin(age * 2 + alien.x * 0.01) * 3);
}
