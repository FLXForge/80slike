
const positions = [215, 255, 295];

function motion(cursor) {
    var index = global["option"] - 1;

    if (cursor.y < positions[index]) {
        cursor.y = cursor.y + 1;
    } else if (cursor.y > positions[index]) {
        cursor.y = cursor.y - 1;
    }
}