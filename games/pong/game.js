/// <reference path="https://flxforge.github.io/FLXEngine/scripts/flx.d.ts" />

const MAX_SCORE = 10;
const FIRE_BUTTON = 0;
const EXIT_BUTTON = 0;

function born(game) {
    global["pl1"] = 0;
    global["pl2"] = 0;
    global["players"] = 1;
    global["effects"] = 1;
    global["winer"] = 0;
    play_music(game, "odetojoy");
}

function action(game){
    if (Input.system.pressed(EXIT_BUTTON)) {
        exit();
    }

    if (state_entered(game)){
        if (state_active(game, "game")){
            spawn(game, "player");
            spawn(game, "enemy");
            spawn(game, "ball");
            spawn(game, "court");
        } else {
            keep_only(game);
        }
    } else {   
        if (state_active(game, "menu")){
            if (Input.player(1).pressed(FIRE_BUTTON)) {
                state(game, "game");
                global["players"] = 1;
            } else if (Input.player(2).pressed(FIRE_BUTTON)) {
                state(game, "game");
                global["players"] = 2;
            }
        } else {
            if (Input.player(1).pressed(FIRE_BUTTON) || 
                Input.player(2).pressed(FIRE_BUTTON) || 
                global["pl1"] > MAX_SCORE || 
                global["pl2"] > MAX_SCORE) {
                state(game, "menu");
                if (global["pl1"] > global["pl2"]) {
                    global["winer"] = 1;
                } else if (global["pl1"] < global["pl2"]) {
                    global["winer"] = 2;
                }
                global["pl1"] = 0;
                global["pl2"] = 0;
            }
        }
    }
}

function draw(game) {
    if (state_active(game, "menu")){
        draw_text(115, 50, "PONG", 40);
        if (global["winer"] > 0){
            if (global["winer"] == 1){
                pl = "Player 1";
            } else {
                if (global["players"] == 2){
                    pl = "Player 2";
                } else {
                    pl = "CPU";
                }
            }
            draw_text(100, 100, pl + " IS THE WINER", 10, "red");
        }
        draw_text(100, 120, "1 player game - Fire Pl1")
        draw_text(100, 140, "2 players game - Fire Pl2")
        draw_text(100, 160, "Exit game - Exit button")
    } else {
        if (global["goal_effect"] == 1){
            global["goal_effect"] = 0;
            spawn(game, "goal_effect")
        }
        if (global["pl1"] > 8 ){
            draw_text(80, 5, "TO WIN", 10, "blue");
        }
        draw_text(15,5,"PLAYER 1: " + global["pl1"]);
        if (global["pl2"] > 8 ){
            draw_text(195, 5, "TO WIN", 10, "blue");
        }
        draw_text(240,5,"PLAYER 2: " + global["pl2"]);
        draw_rectangle(10,20,300,150);
        draw_line(160,30,160,160);
    }
}