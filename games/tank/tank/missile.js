function born(missile){
    play_timer(missile,"life",3.2);apply_speed(missile,read_global("tank_advanced")==1?190:150);
}
function motion(missile){
    if(read_global("tank_phase")!="combat"||!timer_active(missile,"life")){kill(missile);return;}
    advance(missile);
    if(missile.x<0||missile.x>640||missile.y<44||missile.y>320)kill(missile);
}
function collision(missile,other){
    if(read_global("tank_phase")!="combat"||read_local(missile,"spent"))return;
    write_local(missile,"spent",true);
    if(other.group=="enemy"&&!read_local(other,"protected")&&!read_local(other,"hit_by")){
        write_local(other,"hit_by",1);kill(other);
    }
    kill(missile);
}
