/// <reference path="https://flxforge.github.io/FLXEngine/scripts/flx.d.ts" />
// One shared behavior context; FLX isolates the lexical scope of separate scripts.
const PF_MODES=["EXPEDITION","TIME TRIAL","WILD JUNGLE","JUNGLE RELAY"];
const PF_COLORS=["#d7db91","#f0be76","#e5a08b","#92cbd3"];
const PF_TYPES=["trail","logs","pond","fire","crocs","tunnel","tar","snake","logs","pond","ruins","crocs","fire","tar","grove","pond","snake","crocs","logs","tunnel","tar","pond","fire","ruins"];
const PF_NAMES=["BASE CAMP","ROLLING TROUBLE","MIRROR POOL","EMBER GROVE","CROCODILE CROSSING","ROOT CELLAR","BREATHING EARTH","COBRA COURT","FALLEN TIMBER","DEEPWATER BEND","THE OLD STEPS","JAWS OF THE JUNGLE","FIREFLY CLEARING","HUNGRY GROUND","THE QUIET GROVE","THE LONG SWING","SERPENT GARDEN","THREE LITTLE SMILES","TIMBER TRAIL","THE LOST PASSAGE","SINKING FEELING","LAST LIGHT LAGOON","ASHES AND GOLD","THE FORGOTTEN GATE"];
const PF_EMPTY=[0,5,10,14,19,23];
const PF_VALUES=[2000,3000,4000,5000];
const PF_GRAVITY=600,PF_JUMP=-232,PF_RUN=110;
function pg(key){return read_global("pf_"+key);}function pw(key,value){write_global("pf_"+key,value);}
function wild(){return pg("mode")==2;}
function ladder(room){return room%4!=2;}
function has_vine(room){return PF_TYPES[room]=="pond"||PF_TYPES[room]=="tar";}
function has_treasure(room){return PF_EMPTY.indexOf(room)<0;}
function explorer(){return find_name("pf_explorer")[0];}
function team(){return pg("team");}
function points(value){pw("score"+team(),Math.max(0,pg("score"+team())+value));}
function total_score(){return pg("score1")+pg("score2");}
function message(text){pw("message",text);pw("message_until",pg("clock")+2.7);}
function fill(x,y,w,h,color){for(let j=0;j<h;j++)draw_line(x-w/2,y-h/2+j,x+w/2,y-h/2+j,color);}
function box(o,x,y,w,h,color){for(let j=0;j<h;j++)draw_line(o,x-w/2,y-h/2+j,x+w/2,y-h/2+j,color);}
function vel(o,vx,vy){apply_velocity(o,Math.atan2(vx,-vy)*180/Math.PI,Math.sqrt(vx*vx+vy*vy));}
function pit_open(){return (pg("time")+pg("room")*0.63)%7>=3.8;}
function pit_warning(){const t=(pg("time")+pg("room")*0.63)%7;return t>=2.8&&t<3.8;}
function jaw_open(index){return (pg("time")*(wild()?1.22:1)+index*0.6)%4>=2.75;}
function vine_pose(){
    const t=pg("time")*(wild()?1.12:1)+pg("room")*0.42;
    const rate=1.15*(wild()?1.12:1),angle=1.02*Math.sin(t*1.15),omega=1.02*rate*Math.cos(t*1.15);
    return {x:320+118*Math.sin(angle),y:56+118*Math.cos(angle),vx:118*Math.cos(angle)*omega,vy:-118*Math.sin(angle)*omega};
}
function initialize(){
    pw("room",0);pw("layer",0);pw("team",1);pw("treasures",0);pw("count",0);pw("time",0);
    pw("remaining",pg("mode")==1?480:pg("mode")==2?720:1200);pw("score1",2000);pw("score2",0);
    pw("lives1",3);pw("lives2",pg("mode")==3?3:0);pw("x",160);pw("y",189);pw("vx",0);pw("vy",0);
    pw("entry_x",160);pw("entry_layer",0);pw("face",1);pw("immune",1.8);pw("message","");
    pw("message_until",0);pw("falls",0);pw("jumps",0);pw("switches",0);pw("reason","");
}
function rebuild(game){for(const scene of find_name("pf_scene"))kill(scene);spawn(game,"pf_scene");}
function begin(game){
    stop_music();for(const menu of find_name("pf_menu"))kill(menu);initialize();pw("phase","ready");
    rebuild(game);state_to(game,"ready");
}
function travel(game,dir){
    const p=explorer();if(!p)return;
    const layer=p.y>236?1:pg("layer"),step=layer==1?3:1;
    pw("room",(pg("room")+dir*step+24)%24);pw("layer",layer);pw("x",dir>0?18:622);pw("y",p.y);
    pw("vx",read_local(p,"vx"));pw("vy",read_local(p,"vy"));pw("entry_x",dir>0?28:612);pw("entry_layer",layer);
    pw("switches",pg("switches")+1);rebuild(game);
    if(layer==1)message("UNDERGROUND PASSAGE: THREE SCREENS AHEAD.");
}
function lose(p,reason){
    if(pg("phase")!="play"||pg("time")<pg("immune")&&reason!="water"&&reason!="fall")return;
    pw("lives"+team(),Math.max(0,pg("lives"+team())-1));pw("reason",reason);
    pw("death_x",p.x);pw("death_y",p.y);pw("phase","respawn");
    collider_off(p,"body");vel(p,0,0);play_sound(p,"hurt");state_to(find_name("pitfall")[0],"respawn");
}
function game_born(game){pw("mode",0);pw("clock",0);pw("tick",0);pw("phase","menu");initialize();}
function game_action(game){
    pw("clock",pg("clock")+delta());pw("tick",pg("tick")+1);
    if(input_pressed(system(),button(0))){stop_music();exit();return;}
    if(state_entered(game)){
        if(state_active(game,"menu")){pw("phase","menu");initialize();rebuild(game);spawn(game,"pf_menu");}
        return;
    }
    if(state_active(game,"menu")){
        if(pg("refresh")){pw("refresh",false);initialize();rebuild(game);}
        if(pg("start")){pw("start",false);begin(game);}return;
    }
    if(state_active(game,"ready")){
        if(state_time(game)>=1.2){pw("phase","play");state_to(game,"play");}return;
    }
    if(state_active(game,"pause")){
        if(input_pressed(system(),button(1))){pw("phase","play");state_to(game,"play");}return;
    }
    if(state_active(game,"victory")||state_active(game,"over")){
        if(input_pressed(system(),button(1)))begin(game);
        else if(input_pressed(system(),button(2))){pw("phase","menu");state_to(game,"menu");}return;
    }
    if(state_active(game,"respawn")){
        if(state_time(game)<1)return;
        if(pg("lives1")==0&&pg("lives2")==0){pw("phase","over");state_to(game,"over");play_sound(game,"over");return;}
        if(pg("mode")==3){const other=team()==1?2:1;if(pg("lives"+other)>0)pw("team",other);}
        pw("layer",pg("entry_layer"));pw("x",pg("entry_x"));pw("y",pg("entry_layer")==0?189:271);
        pw("vx",0);pw("vy",0);pw("immune",pg("time")+2);pw("phase","play");rebuild(game);state_to(game,"play");
        if(pg("mode")==3)message("PLAYER "+team()+" TAKES THE NEXT LEG.");return;
    }
    if(!state_active(game,"play"))return;
    if(input_pressed(system(),button(1))){pw("phase","pause");state_to(game,"pause");return;}
    pw("time",pg("time")+delta());pw("remaining",Math.max(0,pg("remaining")-delta()));
    if(pg("remaining")<=0){pw("reason","time");pw("phase","over");state_to(game,"over");play_sound(game,"over");return;}
    if(pg("count")>=18){pw("phase","victory");state_to(game,"victory");save("80slike","pitfall",true);play_sound(game,"victory");return;}
    const p=explorer();if(p){
        if(p.x>=632){travel(game,1);return;}if(p.x<=8){travel(game,-1);return;}
    }
}
function scene_born(scene){spawn(scene,"pf_room_"+pg("room"));spawn(scene,"pf_explorer");}
function explorer_born(p){
    position(p,pg("x"),pg("y"));write_local(p,"vx",pg("vx"));write_local(p,"vy",pg("vy"));
    write_local(p,"state","air");write_local(p,"ground_tick",-100);write_local(p,"ground_time",-100);
    write_local(p,"jump_until",-1);write_local(p,"vine_lock",-1);write_local(p,"log_until",-1);write_local(p,"log_hit",-10);
    write_local(p,"last_jump",-100);
}
function explorer_action(p){
    if(pg("phase")!="play"){vel(p,0,0);return;}
    const t=pg("time"),dt=delta(),subject=player(team());
    const hx=input_direction(subject,direction(0),HORIZONTAL),hy=input_direction(subject,direction(0),VERTICAL);
    const pressed=input_pressed(subject,button(0));
    if(pressed)write_local(p,"jump_until",t+0.12);
    let state=read_local(p,"state"),vx=read_local(p,"vx"),vy=read_local(p,"vy");
    const ground=read_local(p,"ground_tick")>=pg("tick")-1&&vy>=0;
    if(ground){write_local(p,"ground_time",t);if(state=="air")state="walk";}
    if(state=="vine"){
        const vine=find_id(read_local(p,"vine_id"));
        if(!vine){state="air";vy=0;}
        else if(hy>0||pressed){
            const pose=vine_pose();vx=pose.vx;vy=pose.vy;state="air";
            write_local(p,"vine_lock",t+0.4);write_local(p,"jump_until",-1);play_sound(p,"vine");
        }else{vel(p,0,0);write_local(p,"state","vine");return;}
    }
    if(state!="vine"&&state!="climb"&&ladder(pg("room"))&&Math.abs(p.x-96)<19){
        if(hy>0&&pg("layer")==0&&Math.abs(p.y-189)<18||hy<0&&pg("layer")==1&&Math.abs(p.y-271)<16){
            state="climb";vx=0;vy=0;position_x(p,96);write_local(p,"jump_until",-1);
        }
    }
    if(state=="climb"){
        vx=0;vy=hy*72;position_x(p,96);
        if(hy<0&&p.y<=189){
            position(p,hx<0?64:128,189);pw("layer",0);state="walk";vy=0;write_local(p,"ground_tick",pg("tick"));
        }else if(hy>0&&p.y>=271){position_y(p,271);pw("layer",1);state="walk";vy=0;write_local(p,"ground_tick",pg("tick"));}
        else if(p.y>236)pw("layer",1);
    }else{
        if(t<read_local(p,"log_until"))vx=-65;
        else if(ground)vx=hx*PF_RUN;
        else if(hx!=0)vx+=Math.max(-420*dt,Math.min(420*dt,hx*PF_RUN-vx));
        else vx*=Math.exp(-0.7*dt);
        if(hx!=0)pw("face",hx>0?1:-1);
        if(read_local(p,"jump_until")>=t&&(ground||t-read_local(p,"ground_time")<0.075)){
            vy=PF_JUMP;state="air";write_local(p,"jump_until",-1);write_local(p,"ground_time",-100);
            write_local(p,"ground_tick",-100);write_local(p,"last_jump",t);pw("jumps",pg("jumps")+1);play_sound(p,"jump");
        }
        if(!ground||vy<0){vy=Math.min(300,vy+PF_GRAVITY*dt);state="air";}else vy=0;
        if(p.y>239&&pg("layer")==0){
            pw("layer",1);points(-100);pw("falls",pg("falls")+1);message("A SHORTCUT. AN EXPENSIVE SHORTCUT.");play_sound(p,"tunnel");
        }
    }
    write_local(p,"state",state);write_local(p,"vx",vx);write_local(p,"vy",vy);vel(p,vx,vy);
    if(p.y>318)lose(p,"fall");
}
function explorer_motion(p){
    if(pg("phase")!="play")return;
    if(read_local(p,"state")=="vine"){
        const vine=find_id(read_local(p,"vine_id"));if(vine)position(p,vine.x,vine.y+10);
    }else advance(p);
    position_x(p,Math.max(6,Math.min(634,p.x)));
    pw("x",p.x);pw("y",p.y);pw("vx",read_local(p,"vx"));pw("vy",read_local(p,"vy"));
}
function explorer_collision(p,other,contacts){
    if(pg("phase")!="play")return;
    const t=pg("time"),state=read_local(p,"state");
    if(other.group=="pf_vine"){
        const wants=input_down(player(team()),button(0))||t-read_local(p,"last_jump")<0.8;
        if(state=="air"&&t>read_local(p,"vine_lock")&&wants){
            write_local(p,"state","vine");write_local(p,"vine_id",other.id);write_local(p,"vx",0);write_local(p,"vy",0);
            vel(p,0,0);position(p,other.x,other.y+10);play_sound(p,"vine");
        }return;
    }
    if(other.group=="pf_treasure"){
        const room=pg("room"),bit=1<<room;
        if(pg("layer")==0&&(pg("treasures")&bit)==0){
            pw("treasures",pg("treasures")|bit);pw("count",pg("count")+1);points(PF_VALUES[room%4]);kill(other);play_sound(p,"treasure");
            message("TREASURE "+pg("count")+" / 18 / THE JUNGLE KEEPS COUNT.");
            if(pg("count")>=6)save("80slike","pitfall",true);
        }return;
    }
    if(other.group=="pf_hazard"){lose(p,other.name.indexOf("water")>=0?"water":"hazard");return;}
    if(other.group=="pf_log"){
        if(t-read_local(p,"log_hit")>0.65){
            points(-75);write_local(p,"log_hit",t);write_local(p,"log_until",t+0.16);play_sound(p,"log");
        }return;
    }
    if(other.group=="pf_floor"||other.group=="pf_wall"){
        if(state=="vine")return;
        for(const c of contacts){
            position(p,c);
            if(c.normalY< -0.5&&read_local(p,"vy")>=0){
                if(read_local(p,"vy")>100)play_sound(p,"land");
                write_local(p,"vy",0);write_local(p,"ground_tick",pg("tick"));write_local(p,"ground_time",t);
                if(state!="climb")write_local(p,"state","walk");
            }else if(c.normalY>0.5&&read_local(p,"vy")<0)write_local(p,"vy",0);
            if(Math.abs(c.normalX)>0.5)write_local(p,"vx",0);
        }
    }
}
function vine_born(vine){const v=vine_pose();position(vine,v.x,v.y);}
function vine_action(vine){if(pg("phase")=="play"){const v=vine_pose();position(vine,v.x,v.y);}}
function terrain_born(o){terrain_action(o);}
function terrain_action(o){
    const name=o.name;
    if(name.indexOf("pf_tar_land_")==0){if(pit_open())collider_off(o,"body");else collider_on(o,"body");}
    else if(name.indexOf("pf_tar_water_")==0){if(pit_open())collider_on(o,"body");else collider_off(o,"body");}
    else if(name.indexOf("pf_mouth_")==0){const index=Number(name.split("_").pop());if(jaw_open(index))collider_on(o,"body");else collider_off(o,"body");}
}
function creature_born(o){
    write_local(o,"dir",-1);apply_speed(o,o.group=="pf_log"?(wild()?51:34):(wild()?47:29));
    if(o.group=="pf_treasure"&&(pg("treasures")&(1<<pg("room")))!=0)kill(o);
}
function creature_action(o){
    if(pg("phase")!="play")return;
    if(o.group=="pf_log"){
        move_horizontal(o,-1);if(o.x<170)position_x(o,600);
    }else if(o.name.indexOf("pf_scorpion_")==0){
        let dir=read_local(o,"dir");if(o.x<188)dir=1;if(o.x>550)dir=-1;write_local(o,"dir",dir);move_horizontal(o,dir);
    }
}
function creature_collision(o,other,contacts){
    if(pg("phase")!="play"||o.name.indexOf("pf_scorpion_")!=0||other.group!="pf_wall")return;
    for(const contact of contacts)position(o,contact);
    write_local(o,"dir",-read_local(o,"dir"));
}
function menu_born(menu){write_local(menu,"lore",false);play_timer(menu,"idle",8);play_music(menu,"theme");}
function menu_action(menu){
    if(input_pressed(system(),button(1))){pw("start",true);return;}
    if(input_pressed(system(),button(2))){pw("mode",(pg("mode")+1)%4);pw("refresh",true);play_sound(menu,"select");}
    let used=input_down(system(),button(1))||input_down(system(),button(2));
    for(let n=1;n<=2;n++)used=used||input_down(player(n),button(0))||input_direction(player(n),direction(0),HORIZONTAL)!=0||input_direction(player(n),direction(0),VERTICAL)!=0;
    if(used){write_local(menu,"lore",false);stop_timer(menu,"idle");play_timer(menu,"idle",8);}
    else if(timer_done(menu,"idle")){write_local(menu,"lore",!read_local(menu,"lore"));play_timer(menu,"idle",8);}
}
function explorer_draw(p){
    if(pg("phase")=="menu")return;
    if(pg("phase")=="over"&&pg("lives1")==0&&pg("lives2")==0)return;
    if(pg("phase")=="respawn"){
        const age=state_time(find_name("pitfall")[0]);if(age>0.7)return;
        for(let i=0;i<8;i++){const a=i*Math.PI/4,r=6+age*24;draw_line(p.x+Math.cos(a)*r,p.y+Math.sin(a)*r,p.x+Math.cos(a)*(r+4),p.y+Math.sin(a)*(r+4),"#e8c689");}return;
    }
    if(pg("time")<pg("immune")&&pg("phase")=="play"&&Math.floor(pg("clock")*10)%2==0)return;
    const state=read_local(p,"state"),face=pg("face"),run=Math.abs(read_local(p,"vx"))>10;
    const swing=state=="walk"&&run?Math.sin(pg("time")*18)*3:state=="climb"?Math.sin(pg("time")*14)*2:0;
    const shirt=team()==1?"#e3c274":"#8ccbd1",skin="#ddb58d",boot="#493e35";
    box(p,1,2,13,17,"#1b302d");box(p,0,-1,10,10,shirt);box(p,0,5,9,5,"#a46e4e");
    box(p,0,-10,9,7,skin);box(p,-face*2,-13,11,4,"#c8ad76");box(p,face*2,-11,16,3,"#e3c68b");
    draw_pixel(p,face*4,-10,"#25352e");
    const air=state=="air",hanging=state=="vine";
    if(hanging){draw_line(p,-5,-3,-3,-13,skin);draw_line(p,5,-3,3,-13,skin);}
    else if(state=="climb"){
        box(p,-6,-4+swing,3,8,skin);box(p,6,-4-swing,3,8,skin);
    }else{
        draw_line(p,-5,-3,-7,air?-8:4+swing,skin);draw_line(p,5,-3,7,air?-8:4-swing,skin);
    }
    const leg=hanging?2:air?3:swing;
    draw_line(p,-3,7,-3-leg,12,"#b88d64");draw_line(p,3,7,3+leg,12,"#b88d64");
    box(p,-3-leg,12,6,3,boot);box(p,3+leg,12,6,3,boot);
}
function vine_draw(vine){
    draw_line(319,56,vine.x-1,vine.y,"#6f8650");draw_line(320,56,vine.x,vine.y,"#d1c38b");
    for(let i=1;i<=6;i++){const f=i/7;fill(320+(vine.x-320)*f,56+(vine.y-56)*f,4,3,"#b5af73");}
    fill(vine.x,vine.y,9,4,"#e4d39b");
}
function room_draw(room){
    const r=pg("room"),type=PF_TYPES[r],t=pg("clock");
    // Layered geometric forest: sky, distant trunks, canopy and low fern silhouettes.
    for(let i=0;i<8;i++){
        const x=18+i*91+(r*17+i*7)%24;
        fill(x,118,12+(i%3)*4,162,"#294a42");
        draw_line(x,92,x-23,69,"#35564a");draw_line(x,111,x+27,83,"#35564a");
    }
    for(let i=0;i<7;i++){
        const x=i*104+(r%3)*13;
        fill(x,43,118,25,"#284c3d");fill(x+31,58,80,19,"#365c42");fill(x+18,65,51,12,"#54744b");
        draw_line(x-27,60,x+24,60,"#72875b");
    }
    for(let i=0;i<4;i++){
        const x=35+i*184+(r*11)%37;
        fill(x,123,17,127,"#4b6145");fill(x-4,124,4,126,"#7b7a52");
        draw_line(x,92,x-22,74,"#566e47");draw_line(x,112,x+27,89,"#566e47");
        fill(x+16,88,38,8,"#607b4d");
    }
    for(let x=8;x<640;x+=37){
        const y=195+(x+r)%3;draw_line(x,y,x-5,y-7,"#8e9b63");draw_line(x,y,x+7,y-4,"#8e9b63");
    }
    fill(320,249,640,66,"#23372e");
    for(let x=12;x<640;x+=31){draw_line(x,217,x+8,224,"#4b5437");draw_line(x+12,217,x+16,228,"#4b5437");}
    if(ladder(r)){
        fill(96,236,42,92,"#23372e");
        draw_line(81,193,81,282,"#a88b60");draw_line(111,193,111,282,"#a88b60");
        for(let y=201;y<282;y+=11)draw_line(81,y,111,y,"#d3ae73");
    }
    if(type=="pond"||type=="crocs"||type=="tar"){
        fill(320,218,180,28,type=="tar"?"#253330":"#1b4c54");
        for(let x=238;x<405;x+=28){const drift=(pg("time")*7)%14;draw_line(x+drift,215,x+drift+12,215,type=="tar"?"#566047":"#528280");}
        draw_line(230,203,410,203,type=="tar"?"#818058":"#85a58a");
    }
    // Tiny fireflies stay decorative and never create colliders.
    for(let i=0;i<5;i++){
        const x=55+i*127+Math.sin(t*0.7+i+r)*8,y=85+(i*29+r*7)%80+Math.cos(t+i)*4;
        if(Math.sin(t*1.5+i)>0.15)draw_pixel(x,y,"#c6ca85");
    }
}
function ground_draw(o){
    const w=o.width,h=o.height;
    draw_line(o,-w/2,-h/2,w/2,-h/2,"#c1b57c");draw_line(o,-w/2,-h/2+2,w/2,-h/2+2,"#8c9c61");
    if(o.name.indexOf("pf_floor_")==0&&o.y<230){
        for(let x=-w/2+8;x<w/2;x+=29)draw_line(o,x,-h/2+7,x+7,-h/2+9,"#8b7850");
    }
}
function tar_draw(o){
    if(pit_open())return;
    box(o,0,0,180,14,"#687346");draw_line(o,-90,-7,90,-7,"#bdad77");
    if(pit_warning()){
        const c=Math.floor(pg("time")*8)%2?"#d2a56e":"#29372e";
        for(let x=-75;x<80;x+=24){draw_line(o,x,-4,x+8,3,c);draw_line(o,x+8,3,x+15,-3,c);}
    }
}
function creature_draw(o){
    const name=o.name,t=pg("time"),face=read_local(o,"dir")||-1;
    if(o.group=="pf_log"){
        box(o,0,0,22,16,"#6f5137");box(o,0,-2,20,10,"#a17d4d");
        draw_rectangle(o,0,0,15,12,"#d0ae71");draw_rectangle(o,0,0,8,6,"#d0ae71");
        const a=-t*6;draw_line(o,0,0,Math.cos(a)*8,Math.sin(a)*6,"#574c35");return;
    }
    if(name.indexOf("pf_scorpion_")==0){
        box(o,0,0,15,7,"#a9a075");
        for(let i=0;i<3;i++){draw_line(o,-6+i*5,2,-10+i*7,6,"#cebd87");}
        draw_line(o,-face*6,-2,-face*11,-10,"#cebd87");draw_line(o,-face*11,-10,-face*17,-8,"#cebd87");
        box(o,face*10,0,5,4,"#cebd87");draw_pixel(o,face*5,-2,"#172d2d");return;
    }
    if(name.indexOf("pf_snake_")==0){
        for(let i=0;i<5;i++)box(o,-8+i*4,Math.sin(t*5+i)*2,5,5,i%2?"#c4a16a":"#779263");
        box(o,5,-7,9,8,"#bca46e");draw_pixel(o,3,-9,"#203932");draw_line(o,0,-7,-4,-7,"#d78b72");return;
    }
    if(name.indexOf("pf_fire_")==0){
        draw_line(o,-10,5,10,1,"#a17c50");draw_line(o,-9,1,8,6,"#a17c50");
        const h=10+Math.floor(Math.sin(t*14)*3);box(o,0,-3,11,h,"#d79359");box(o,1,-3,6,h-3,"#e9bd72");box(o,0,-4,3,5,"#f4d99a");return;
    }
    if(name.indexOf("pf_croc_")==0){
        const index=Number(name.split("_").pop()),open=jaw_open(index);
        box(o,0,3,37,11,"#3b6551");box(o,-4,0,27,8,"#91a66c");box(o,12,-1,14,7,"#9bb875");
        draw_pixel(o,9,-5,"#e7d394");draw_pixel(o,10,-5,"#263d36");
        for(let x=-16;x<2;x+=7)draw_line(o,x,-2,x+3,-6,"#d0c58b");
        if(open){
            box(o,14,-5,15,5,"#172e30");draw_line(o,7,-8,21,-12,"#c3c88c");
            for(let x=9;x<21;x+=4)draw_line(o,x,-7,x,-4,"#ebdfb4");
        }else draw_line(o,7,0,21,0,"#254439");return;
    }
}
function treasure_draw(o){
    const type=pg("room")%4;
    box(o,1,3,22,12,"#22392f");
    if(type==0){box(o,0,0,15,13,"#bd9d67");box(o,0,-7,8,4,"#e2bf7e");draw_line(o,-2,-3,-2,4,"#e2bf7e");}
    else if(type==3){draw_rectangle(o,0,-1,14,14,"#dbd5b4");draw_rectangle(o,0,-1,10,10,"#dbd5b4");box(o,0,-9,7,5,"#92d2cd");}
    else{
        const c=type==1?"#b9c5b5":"#d8b96e";box(o,0,1,22,10,c);box(o,0,-4,17,5,type==1?"#e1e2cb":"#f1d893");draw_line(o,-9,5,9,5,"#8e805b");
    }
    const blink=Math.floor(pg("clock")*5)%8;if(blink<2){draw_line(o,15,-13,15,-5,"#f5e4ab");draw_line(o,11,-9,19,-9,"#f5e4ab");}
}
function menu_draw(menu){
    draw_rectangle(320,158,542,240,"#6a7d52");
    draw_text(323,78,"PITFALL",55,"#665d3b");draw_text(320,73,"PITFALL",55,"#e2ca84");
    draw_text(320,108,"THE JUNGLE DOES NOT OFFER REFUNDS",11,"#b8c799");draw_line(96,124,544,124,"#5f7951");
    if(read_local(menu,"lore")){
        draw_text(320,150,"Eighteen treasures are waiting in the jungle.",13,"#d8deba");
        draw_text(320,177,"So are the crocodiles.",14,"#d8deba");
        draw_text(320,203,"The vine looks perfectly safe.",13,"#b7c8a8");
        draw_text(320,231,"The previous explorer said the same thing.",13,"#e3c18b");
    }else{
        const m=pg("mode");draw_text(320,151,PF_MODES[m],24,PF_COLORS[m]);
        const lines=["24 screens. 18 treasures. One questionable plan.","Eight minutes. Make every shortcut count.","Faster hazards. A less forgiving jungle.","Two explorers. Share the treasure. Take turns."];
        draw_text(320,182,lines[m],13,"#d3dbb7");
        draw_text(320,208,m==3?"2 PLAYERS / SWITCH AFTER LOSING A LIFE":"1 PLAYER / SURFACE AND UNDERGROUND",11,"#abc399");
        draw_text(320,239,"Action: jump / grab   Down: release vine",11,"#c9d2ab");
    }
    draw_text(320,269,"Mode: change expedition   Start: play",11,"#e8dfb6");
}
function game_draw(game){
    if(pg("phase")=="menu")return;
    const left=Math.max(0,Math.ceil(pg("remaining"))),minutes=Math.floor(left/60),seconds=(left%60<10?"0":"")+(left%60);
    draw_text(93,12,"SCORE "+total_score(),13,"#e4d196");draw_text(320,12,minutes+":"+seconds,15,left<60?"#efaa83":"#d2d9b1");
    draw_text(545,12,"TREASURE "+pg("count")+" / 18",13,"#c9d7a9");
    for(let i=0;i<pg("lives"+team());i++){
        fill(22+i*17,308,8,9,team()==1?"#e2c17e":"#91cbd2");fill(22+i*17,302,11,3,"#d4b679");
    }
    draw_text(139,308,"P"+team()+" / "+(pg("layer")==1?"TUNNEL":"SURFACE"),11,"#bac69c");
    draw_text(377,308,PF_NAMES[pg("room")],11,"#b5c7a3");draw_text(606,308,(pg("room")+1)+" / 24",11,"#b5c7a3");
    if(pg("phase")=="play"&&pg("message")&&pg("message_until")>pg("clock")){
        fill(320,37,560,19,"#1c3431");draw_text(320,37,pg("message"),11,"#e3d6a3");
    }
    if(pg("phase")=="play")return;
    if(pg("phase")=="respawn"){
        draw_text(320,115,pg("mode")==3?"PASS THE ADVENTURE ON":"THE JUNGLE CLAIMS ANOTHER",20,"#e4b78a");return;
    }
    fill(320,148,484,100,"#1d3731");draw_rectangle(320,148,484,100,"#7f8d59");
    if(pg("phase")=="ready"){
        draw_text(320,129,"FORTUNE FAVOURS THE BRAVE",23,"#e2ca84");
        draw_text(320,166,"UP / DOWN: LADDERS   ACTION: JUMP AND CATCH VINES",11,"#c6d0ab");
    }else if(pg("phase")=="pause"){
        draw_text(320,130,"A MOMENT IN THE SHADE",24,"#d7d79b");draw_text(320,168,"Start: resume",13,"#ccd4b0");
    }else{
        draw_text(320,122,pg("phase")=="victory"?"FORTUNE FOUND!":pg("reason")=="time"?"THE SUN HAS SET":"LOST IN THE JUNGLE",27,pg("phase")=="victory"?"#e4ce87":"#dfa282");
        draw_text(320,151,"SCORE "+total_score()+" / TREASURES "+pg("count")+" OF 18",12,"#c5d4ad");
        draw_text(320,180,"Start: new expedition   Mode: title",11,"#e1d4a5");
    }
}
function role(o){
    const n=o.name;if(n=="pitfall")return "game";if(n=="pf_scene")return "scene";if(n=="pf_menu")return "menu";if(n=="pf_explorer")return "explorer";
    if(n.indexOf("pf_room_")==0)return "room";if(n.indexOf("pf_vine_")==0)return "vine";
    if(n.indexOf("pf_tar_")==0||n.indexOf("pf_mouth_")==0)return "terrain";
    if(n.indexOf("pf_floor_")==0||n.indexOf("pf_wall_")==0)return "ground";
    return "creature";
}
function born(o){
    const r=role(o);if(r=="game")game_born(o);else if(r=="scene")scene_born(o);else if(r=="menu")menu_born(o);
    else if(r=="explorer")explorer_born(o);else if(r=="vine")vine_born(o);else if(r=="terrain")terrain_born(o);else if(r=="creature")creature_born(o);
}
function action(o){
    const r=role(o);if(r=="game")game_action(o);else if(r=="menu")menu_action(o);else if(r=="explorer")explorer_action(o);
    else if(r=="vine")vine_action(o);else if(r=="terrain")terrain_action(o);else if(r=="creature")creature_action(o);
}
function motion(o){if(role(o)=="explorer")explorer_motion(o);}
function collision(o,other,contacts){if(role(o)=="explorer")explorer_collision(o,other,contacts);else if(role(o)=="creature")creature_collision(o,other,contacts);}
function draw(o){
    const r=role(o);if(r=="game")game_draw(o);else if(r=="menu")menu_draw(o);else if(r=="explorer")explorer_draw(o);
    else if(r=="vine")vine_draw(o);else if(r=="room")room_draw(o);else if(r=="ground")ground_draw(o);
    else if(r=="terrain"&&o.name.indexOf("pf_tar_land_")==0)tar_draw(o);else if(r=="creature"){
        if(o.group=="pf_treasure")treasure_draw(o);else creature_draw(o);
    }
}
