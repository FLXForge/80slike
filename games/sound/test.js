
var play = false;
var option = 1;
var upLock = false;
var downLock = false;

function action (test) {
    if (Input.player(1).pressed(0)) {
        play = !play;

        if (play) {
            play_music(test, "m" + option);
        } else {
            stop_music()
        }
    }

    if (Input.player(1).up() && !play) {
        if (!upLock && option > 1) {
            option--;
        }
        upLock = true;
    } else {
        upLock = false;
    }

    if (Input.player(1).down() && !play) {
        if (!downLock && option < 2) {
            option++;
        }
        downLock = true;
    } else {
        downLock = false;
    }
}

function draw(test){
    draw_text(10, 40, "Sound Test", 80);

    draw_text(100, 150, "PONG - Ode to Joy", 30, option == 1 ? "blue" : "white");
    draw_text(100, 200, "ASTEROIDS - A New Day", 30, option == 2 ? "blue" : "white");

    if (play) {
        draw_rectangle (70, 105 + ( 50 * option), 20, 20, "blue")
    } else {
        draw_line(70, 110 + ( 50 * option), 90, 110 + ( 50 * option), "red");
    }
    
}