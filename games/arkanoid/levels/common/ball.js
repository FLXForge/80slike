/// <reference path="https://flxforge.github.io/FLXEngine/scripts/flx.d.ts" />

/*
    Arkanoid ball.
    It starts attached to the paddle, bounces through the level,
    destroys bricks and may spawn power-ups.
*/

const DETACH_COOLDOWN = 0.2;
const FIRE_BUTTON = button(0);

function motion(ball){
    if (attach_active(ball)) {
        if (input_pressed(ball, FIRE_BUTTON)) {
            detach(ball);
            apply_angle(ball, 0);
            play_timer(ball, "detach", DETACH_COOLDOWN);
        }

        return;
    }

    advance(ball);

    if (ball.y > 320) {
        write_global("lives", read_global("lives") - 1);
        write_global("ball_lost", 1);

        play_sound(ball, "lost");
        kill(ball);
    }
}

function strongest_contact(contacts) {
    if (contacts.length == 0) {
        return null;
    }

    let strongest = contacts[0];

    for (const contact of contacts) {
        if (contact.penetration > strongest.penetration) {
            strongest = contact;
        }
    }

    return strongest;
}

function separate(ball, contact) {
    if (contact == null) {
        return;
    }

    position(ball, contact);
}

function reflect_from_contact(ball, contact) {
    if (contact == null) {
        return;
    }

    if (Math.abs(contact.normalX) > Math.abs(contact.normalY)) {
        reflect_x(ball);
    } else {
        reflect_y(ball);
    }
}

function collision(ball, other, contacts) {
    if (attach_active(ball)) {
        return;
    }

    const contact = strongest_contact(contacts);

    if (other.group == "wall_top" || other.group == "barrier") {
        separate(ball, contact);
        reflect_from_contact(ball, contact);
        play_sound(ball, "paddle");
        return;
    }

    if (other.group == "wall_side") {
        separate(ball, contact);
        reflect_from_contact(ball, contact);
        play_sound(ball, "paddle");
        return;
    }

    if (other.group == "paddle") {
        separate(ball, contact);
        if (contact && (contact.normalY > 0 || Math.abs(contact.normalX) > Math.abs(contact.normalY))) {
            reflect_from_contact(ball, contact);
            play_sound(ball, "paddle");
            return;
        }

        if (
            timer_active(other, "glue")
            && !timer_active(ball, "detach")
        ){
            attach(ball);
            return;
        }

        let hit = ball.x - other.x;
        let factor = hit / (other.width / 2);

        apply_angle(ball, factor * 60);

        play_sound(ball, "paddle");
        return;
    }

    if (other.group == "brick") {
        if (read_local(other, "destroyed")) return;
        if (read_local(other, "ball_contact") != ball.id) {
            write_local(other, "ball_contact", ball.id);
            write_local(other, "hits", (read_local(other, "hits") || 0) + 1);
        }
        if (!timer_active(find_parent(ball), "pierce")) {
            separate(ball, contact);
            reflect_from_contact(ball, contact);
        }
        play_sound(ball, "paddle");
    }
}
