
const ACTION_BUTTON = 0;

var upLock = false;
var downLock = false;

function born(menu) {
    global["option"] = 1;
}

function action(menu) {

    if (Input.player(1).up()) {
        if (!upLock && global["option"] > 1) {
            global["option"]--;
        }
        upLock = true;
    } else {
        upLock = false;
    }

    if (Input.player(1).down()) {
        if (!downLock && global["option"] < 3) {
            global["option"]++;
        }
        downLock = true;
    } else {
        downLock = false;
    }

    if (Input.player(1).pressed(ACTION_BUTTON)) {
        if (global["option"] == 3) {
            exit(0);
        }
    }
}