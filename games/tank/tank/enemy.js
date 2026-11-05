/// <reference path="https://flxforge.github.io/FLXEngine/scripts/flx.d.ts" />
const VISION_DISTANCE = 700;
const VISION_ANGLE = 18;
const WALL_DISTANCE = 38;
const TARGET_DISTANCE = 24;
const FIRE_DELAY = 0.8;
function born(tank) {
    write_local(tank,"has_target",false);
    write_local(tank,"search_turn",1);
    play_timer(tank,"search",random(0.6,1.4));
    play_timer(tank,"fire",FIRE_DELAY);
}
function wall_distance(hit) {
    return hit && hit.object.group=="wall" ? hit.distance : VISION_DISTANCE;
}
function reverse(tank) {
    // Public movement mechanics, as used for the advanced player's reverse.
    const angle=tank.angle,speed=tank.speed;
    apply_angle(tank,angle+180);apply_speed(tank,speed*0.6);
    advance(tank);apply_angle(tank,angle);apply_speed(tank,speed);
}
function avoid_wall(tank,contact) {
    // Rotating hulls can graze a wall for many frames. Keep one decision instead
    // of restarting the timer and randomly reversing the turn on every contact.
    if(timer_active(tank,"reverse")||timer_active(tank,"avoid"))return;
    const left=wall_distance(ray(tank,tank.angle-65,VISION_DISTANCE));
    const right=wall_distance(ray(tank,tank.angle+65,VISION_DISTANCE));
    const turn=left==right?(read_local(tank,"search_turn")||1):(left>right?-1:1);
    write_local(tank,"avoid_turn",turn);write_local(tank,"search_turn",turn);
    write_local(tank,"has_target",false);
    stop_timer(tank,"search");stop_timer(tank,"escape");
    play_timer(tank,"reverse",contact?0.4:0.3);
}
function action(tank) {
    if(read_global("tank_phase")!="combat")return;
    const center=ray(tank,tank.angle,VISION_DISTANCE);
    const left=ray(tank,tank.angle-VISION_ANGLE,VISION_DISTANCE);
    const right=ray(tank,tank.angle+VISION_ANGLE,VISION_DISTANCE);
    const seen=[center,left,right].find(hit=>hit&&hit.object.group=="player");
    if(seen) {
        write_local(tank,"target_x",seen.object.x);write_local(tank,"target_y",seen.object.y);
        write_local(tank,"has_target",true);
        stop_timer(tank,"memory");play_timer(tank,"memory",4);
    } else if(!timer_active(tank,"memory"))write_local(tank,"has_target",false);
    if(center&&center.object.group=="player"&&!timer_active(tank,"fire")) {
        spawn(tank,"missile");play_sound(tank,"fire");
        stop_timer(tank,"fire");play_timer(tank,"fire",read_global("tank_advanced")==1?0.6:FIRE_DELAY);
    }
    if(timer_active(tank,"reverse")) {reverse(tank);return;}
    if(timer_done(tank,"reverse")) {
        stop_timer(tank,"reverse");play_timer(tank,"avoid",95/Math.max(60,tank.rotationSpeed));
    }
    if(timer_active(tank,"avoid")) {rotate(tank,read_local(tank,"avoid_turn"));return;}
    if(timer_done(tank,"avoid")) {
        stop_timer(tank,"avoid");write_local(tank,"has_target",false);play_timer(tank,"escape",0.65);
    }
    // Wide probes account for the body, not only the narrow cannon axis.
    // Commit to leaving the wall after turning. A lateral feeler may still
    // see the wall we are driving alongside; it must not restart the turn.
    if(timer_active(tank,"escape")&&wall_distance(center)>24) {advance(tank);return;}
    const side=Math.min(wall_distance(ray(tank,tank.angle-35,70)),wall_distance(ray(tank,tank.angle+35,70)));
    if(wall_distance(center)<WALL_DISTANCE||side<22) {avoid_wall(tank,false);return;}
    if(timer_active(tank,"escape")) {advance(tank);return;}
    if(read_local(tank,"has_target")) {
        const dx=read_local(tank,"target_x")-tank.x,dy=read_local(tank,"target_y")-tank.y;
        if(dx*dx+dy*dy<TARGET_DISTANCE*TARGET_DISTANCE) {
            write_local(tank,"has_target",false);play_timer(tank,"search",random(0.5,1));
        } else {
            const target=Math.atan2(dx,-dy)*180/Math.PI;
            const difference=((target-tank.angle+540)%360)-180;
            if(Math.abs(difference)>6)rotate(tank,difference>0?1:-1);else advance(tank);
        }
        return;
    }
    if(timer_active(tank,"search")) {rotate(tank,read_local(tank,"search_turn"));return;}
    advance(tank);
    if(probability(1,120)) {
        write_local(tank,"search_turn",probability(50)?-1:1);
        stop_timer(tank,"search");play_timer(tank,"search",random(0.4,1.2));
    }
}
function collision(tank,other,contacts) {
    for(const contact of contacts)position(tank,contact);
    if(other.group=="wall")avoid_wall(tank,true);
}
