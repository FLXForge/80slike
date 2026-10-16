/// <reference path="https://flxforge.github.io/FLXEngine/scripts/flx.d.ts" />

function born(spark) {
    const ball = find_parent(spark);
    if (!ball) {
        kill(spark);
        return;
    }
    position(spark, read_local(ball, "spark_x"), read_local(ball, "spark_y"));
    apply_velocity(spark, read_local(ball, "spark_angle") + random(-55, 55), random(30, 75));
    write_local(spark, "color", read_local(ball, "spark_color"));
    const life = random(0.14, 0.22);
    write_local(spark, "life", life);
    play_timer(spark, "life", life);
}

function motion(spark) {
    if (!timer_active(spark, "life")) {
        kill(spark);
        return;
    }
    advance(spark);
}

function draw(spark) {
    if (!timer_active(spark, "life")) return;
    if (spark.x < 0 || spark.x > 320 || spark.y < 20 || spark.y > 170) return;
    const remaining = timer_left(spark, "life") / read_local(spark, "life");
    draw_pixel(spark, 0, 0, remaining > 0.3 ? "white" : read_local(spark, "color"));
}
