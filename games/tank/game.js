const FIELDS=["Crossfire","Open field","Easy maze","Complex maze"];
const ACTORS=["red_classic","red_advanced","cpu_classic","cpu_advanced","blue_classic","blue_advanced"];
function born(game){
    write_global("tank_option",0);write_global("tank_phase","menu");write_global("tank_refresh",false);write_global("tank_start",false);
    write_global("tank_lives1",3);write_global("tank_lives2",3);write_global("tank_hits1",0);write_global("tank_hits2",0);
}
function configuration(){
    const option=read_global("tank_option");
    write_global("tank_field",option%4);write_global("tank_advanced",Math.floor(option/4)%2);write_global("tank_pvp",Math.floor(option/8)%2);
}
function spawn_tank(game,team){
    const role=team==1?"red":read_global("tank_pvp")==1?"blue":"cpu";
    spawn(game,role+(read_global("tank_advanced")==1?"_advanced":"_classic"));
}
function remove_scene(object){
    for(const child of find_children(object))remove_scene(child);
    kill(object);
}
function field(game){
    for(const name of ["arena","field0","field1","field2","field3"].concat(ACTORS))for(const old of find_name(name))remove_scene(old);
    spawn(game,"arena");spawn(game,"field"+read_global("tank_field"));spawn_tank(game,1);spawn_tank(game,2);
}
function start(game){
    configuration();stop_music();write_global("tank_phase","ready");
    write_global("tank_lives1",3);write_global("tank_lives2",3);write_global("tank_hits1",0);write_global("tank_hits2",0);
    for(let team=1;team<=2;team++){write_global("tank_respawn"+team,false);write_local(game,"respawning"+team,false);stop_timer(game,"respawn"+team);}
    state_to(game,"ready");
}
function action(game){
    if(input_pressed(system(),button(0))){stop_music();exit();return;}
    if(state_entered(game)){
        if(state_active(game,"menu")){
            write_global("tank_phase","menu");keep_only(game);spawn(game,"ground");configuration();field(game);spawn(game,"hud");spawn(game,"menu");
        }else if(state_active(game,"ready")){
            keep_only(game);spawn(game,"ground");field(game);spawn(game,"hud");
        }else if(state_active(game,"victory")){
            for(const shot of find_name("missile"))kill(shot);
        }
        return;
    }
    if(state_active(game,"menu")){
        if(read_global("tank_start")){write_global("tank_start",false);start(game);return;}
        if(read_global("tank_refresh")){write_global("tank_refresh",false);configuration();field(game);}return;
    }
    if(state_active(game,"ready")){
        if(state_time(game)>=1.5){write_global("tank_phase","combat");state_to(game,"combat");}return;
    }
    if(state_active(game,"victory")){
        if(input_pressed(system(),button(1)))start(game);
        else if(input_pressed(system(),button(2))){write_global("tank_phase","menu");state_to(game,"menu");}return;
    }
    if(!state_active(game,"combat"))return;
    if(read_global("tank_lives1")==0||read_global("tank_lives2")==0){
        const winner=read_global("tank_lives1")==0?(read_global("tank_lives2")==0?0:2):1;
        write_global("tank_winner",winner);write_global("tank_phase","victory");
        if(winner==1)save("80slike","tank",true);
        state_to(game,"victory");return;
    }
    for(let team=1;team<=2;team++){
        if(read_global("tank_respawn"+team)){
            write_global("tank_respawn"+team,false);write_local(game,"respawning"+team,true);
            stop_timer(game,"respawn"+team);play_timer(game,"respawn"+team,1);
            for(const shot of find_name("missile"))kill(shot);
        }
        if(read_local(game,"respawning"+team)&&!timer_active(game,"respawn"+team)){
            write_local(game,"respawning"+team,false);spawn_tank(game,team);
        }
    }
}
function mini(x,y,color){
    for(let row=-3;row<=3;row++)draw_line(x-3,y+row,x+3,y+row,color);
    draw_line(x-5,y-4,x-5,y+4,color);draw_line(x+5,y-4,x+5,y+4,color);draw_line(x,y-7,x,y-1,color);
}
function draw(game){
    if(state_active(game,"menu"))return;
    draw_text(30,9,"P1",11,"#f29b84");draw_text(610,9,read_global("tank_pvp")==1?"P2":"CPU",11,"#a4c9f0");
    draw_text(175,24,""+read_global("tank_hits1"),30,"#f29b84");draw_text(465,24,""+read_global("tank_hits2"),30,"#a4c9f0");
    for(let i=0;i<read_global("tank_lives1");i++)mini(35+i*20,29,"#f29b84");
    for(let i=0;i<read_global("tank_lives2");i++)mini(565+i*20,29,"#a4c9f0");
    draw_text(320,23,FIELDS[read_global("tank_field")],11,"#d9c49c");
    if(state_active(game,"ready"))draw_text(320,180,"TAKE POSITION",24,"#39271f");
    if(state_active(game,"victory")){
        const winner=read_global("tank_winner");
        const text=winner==0?"STALEMATE":winner==1?"PLAYER 1 WINS":read_global("tank_pvp")==1?"PLAYER 2 WINS":"CPU WINS";
        draw_text(322,146,text,30,"#3c2b23");draw_text(320,144,text,30,"#ffedbc");
        draw_text(320,205,read_global("tank_hits1")+" - "+read_global("tank_hits2"),22,"#39271f");
        draw_text(320,292,"Start: rematch   Mode: title",11,"#39271f");
    }
}
