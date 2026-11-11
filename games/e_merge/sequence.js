/// <reference path="https://flxforge.github.io/FLXEngine/scripts/flx.d.ts" />

// Seconds: cells 0..0.9, pullback 0.9..3.35, clean logo 3.65,
// descriptor/signature 3.75..4.5, final hold from 4.5 onward.
const SIGNATURE = [3.75, 3.93, 4.29, 4.47];

function born(identity) {
    write_local(identity, "elapsed", 0);
    write_local(identity, "note", 0);
    play_timer(identity, "to_end", 8);
}

function action(identity) {
    if (timer_done(identity, "to_end")){
        exit();
    }
    const elapsed = Math.min(5, read_local(identity, "elapsed") + delta());
    write_local(identity, "elapsed", elapsed);
    let note = read_local(identity, "note");
    while (note < SIGNATURE.length && elapsed >= SIGNATURE[note]) {
        play_sound(identity, "pi_" + (note + 1));
        note++;
    }
    write_local(identity, "note", note);
}
