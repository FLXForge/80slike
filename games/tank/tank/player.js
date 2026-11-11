const MOVE=direction(0), FIRE=button(0);
function action(tank) {
    if(read_global("tank_phase")!="combat")return;
    const forward=-input_direction(tank,MOVE,VERTICAL), rotation=input_direction(tank,MOVE,HORIZONTAL);
    if(rotation!=0)rotate(tank,rotation);
    if(forward>0)advance(tank);
    else if(forward<0&&read_global("tank_advanced")==1){
        const angle=tank.angle,speed=tank.speed;
        apply_angle(tank,angle+180);apply_speed(tank,speed*0.6);advance(tank);apply_angle(tank,angle);apply_speed(tank,speed);
    }
    if(forward!=0&&!timer_active(tank,"engine")) {play_sound(tank,"engine");stop_timer(tank,"engine");play_timer(tank,"engine",0.15);}
    if(input_pressed(tank,FIRE)&&!timer_active(tank,"reload")){
        spawn(tank,"missile");play_sound(tank,"fire");stop_timer(tank,"reload");play_timer(tank,"reload",read_global("tank_advanced")==1?0.5:0.65);
    }
}
function collision(tank,other,contacts){for(const contact of contacts)position(tank,contact);}
