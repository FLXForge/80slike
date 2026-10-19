/// <reference path="https://flxforge.github.io/FLXEngine/scripts/flx.d.ts" />

function motion(ball) { advance(ball); }
function collision(ball, other, contacts) {
    if (contacts.length == 0) return;
    let contact = contacts[0];
    for (const candidate of contacts) {
        if (candidate.penetration > contact.penetration) contact = candidate;
    }
    position(ball, contact);
    // Ignore a face the ball is already leaving.
    const radians = ball.angle * Math.PI / 180;
    if (Math.sin(radians) * contact.normalX - Math.cos(radians) * contact.normalY >= 0) return;
    if (Math.abs(contact.normalX) > Math.abs(contact.normalY)) reflect_x(ball);
    else reflect_y(ball);
    if (other.group == "title") {
        stop_timer(other, "hit");
        play_timer(other, "hit", 0.45);
    } else play_sound(ball, "paddle");
}
