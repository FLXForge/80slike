/// <reference path="https://flxforge.github.io/FLXEngine/scripts/flx.d.ts" />

const MAX_SCORE = 10;
const FIRE_BUTTON = button(0);
const EXIT_BUTTON = button(0);

function born(game) {
    write_global("pl1", 0);
    write_global("pl2", 0);
    write_global("players", 1);
    write_global("effects", 1);
    write_global("winer", 0);
    write_global("goal_effect", 0);

}

function action(game){
    if (input_pressed(system(), EXIT_BUTTON)) {
        exit();
    }

    if (state_entered(game)){
        keep_only(game);
        if (state_active(game, "game")){
            spawn(game, "player");
            spawn(game, "enemy");
            spawn(game, "ball");
            spawn(game, "court");
        } else {
            spawn(game, "menu");
        }
    } else {   
        if (state_active(game, "game")){
            if (input_pressed(player(1), FIRE_BUTTON) || 
                input_pressed(player(2), FIRE_BUTTON) || 
                read_global("pl1") > MAX_SCORE || 
                read_global("pl2") > MAX_SCORE) {
                state_to(game, "menu");
                if (read_global("pl1") > read_global("pl2")) {
                    write_global("winer", 1);
                } else if (read_global("pl1") < read_global("pl2")) {
                    write_global("winer", 2);
                }
                write_global("pl1", 0);
                write_global("pl2", 0);
            }
        }
    }
}

function draw(game) {
    if (state_active(game, "game")){
        if (read_global("goal_effect") == 1){
            write_global("goal_effect", 0);
            spawn(game, "goal_effect")
        }
        if (read_global("pl1") > 8 ){
            draw_text(80, 5, "TO WIN", 10, "blue");
        }
        draw_text(65,10,"PLAYER 1: " + read_global("pl1"));
        if (read_global("pl2") > 8 ){
            draw_text(195, 5, "TO WIN", 10, "blue");
        }
        draw_text(255,10,"PLAYER 2: " + read_global("pl2"));
        draw_rectangle(160,95,300,150);
        draw_line(160,30,160,160);
    }
}
