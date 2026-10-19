/// <reference path="https://flxforge.github.io/FLXEngine/scripts/flx.d.ts" />

/*
    Arkanoid power-up.
    It falls down and disappears when it leaves the screen.
*/

function motion(powerup){
    move_vertical(powerup, 1);

    if (powerup.y > 320) {
        kill(powerup);
    }
}

function draw(powerup) {
    // Curved end rims and a lit upper edge leave the letter unobstructed.
    draw_line(powerup, -9, -6, 9, -6, "#e9f2ff");
    draw_line(powerup, -9, -6, -11, -3, "#c5d4e6");
    draw_line(powerup, 9, -6, 11, -3, "#c5d4e6");
    draw_line(powerup, -11, -3, -11, 3, "#70849c");
    draw_line(powerup, 11, -3, 11, 3, "#34445b");
    draw_line(powerup, -11, 3, -9, 6, "#34445b");
    draw_line(powerup, 11, 3, 9, 6, "#26364b");
    draw_line(powerup, -9, 6, 9, 6, "#26364b");
    // End-cap seams give the shell depth without adding collision bodies.
    draw_line(powerup, -8, -3, -8, 3, "#e0ebf5");
    draw_line(powerup, -7, -3, -7, 3, "#53667f");
    draw_line(powerup, 8, -3, 8, 3, "#53667f");
    draw_line(powerup, 9, -2, 9, 2, "#c5d4e6");
    const shine = Math.sin(powerup.y * 0.08) * 6;
    draw_line(powerup, shine - 1, -5, shine + 1, -5, "#ffffff");
}
