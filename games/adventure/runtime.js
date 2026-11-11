/// <reference path="https://flxforge.github.io/FLXEngine/scripts/flx.d.ts" />
// All roles share this behavior context. FLX isolates separate script entries.
const AD_MODES=["QUEST","LOST KINGDOM","DRAGON HUNT","TWO HEROES"];
const AD_ACCENTS=["#e5c97f","#91d7bc","#eea08a","#8ecae9"];
// Exit order: north, east, south, west. The three courts gate their north exit.
const AD_ROOMS=[
 {name:"THE GOLDEN HALL",exits:[-1,-1,1,-1],theme:"gold"},
 {name:"GOLDEN COURT",exits:[0,2,4,3],theme:"gold",gate:"gold"},
 {name:"WINDWARD MEADOW",exits:[6,5,-1,1],theme:"grass"},
 {name:"THE WATCHWOOD",exits:[8,1,-1,7],theme:"forest"},
 {name:"THE CROSSROADS",exits:[1,10,9,11],theme:"grass"},
 {name:"SUNLIT RUINS",exits:[-1,-1,-1,2],theme:"ruin"},
 {name:"THE OLD WELL",exits:[-1,12,2,-1],theme:"grass"},
 {name:"FALLEN GROVE",exits:[-1,3,-1,-1],theme:"forest"},
 {name:"MIRROR MERE",exits:[14,-1,3,-1],theme:"water"},
 {name:"THE SOUTHERN FEN",exits:[4,15,-1,-1],theme:"water"},
 {name:"THE SILVER ROAD",exits:[12,-1,-1,4],theme:"stone"},
 {name:"THE HOLLOW OAK",exits:[-1,4,-1,16],theme:"forest"},
 {name:"WHITE COURT",exits:[13,-1,10,6],theme:"white",gate:"white"},
 {name:"THE WHITE VAULT",exits:[-1,-1,12,-1],theme:"white"},
 {name:"THE MOON MAZE",exits:[-1,-1,8,-1],theme:"stone"},
 {name:"BLACK COURT",exits:[17,-1,-1,9],theme:"black",gate:"black"},
 {name:"FORGOTTEN SHRINE",exits:[-1,11,-1,-1],theme:"ruin"},
 {name:"THE BLACK VAULT",exits:[-1,-1,15,-1],theme:"black"}
];
const AD_THEMES={
 gold:["#25382e","#796b42","#dbc181"],grass:["#263d36","#5c7862","#a6b582"],
 forest:["#1d3434","#41615a","#8fa680"],ruin:["#34382f","#777564","#c4b28d"],
 water:["#213b3d","#536c64","#a8b7a2"],stone:["#303e49","#697a85","#c2c6bb"],
 white:["#35434d","#9ba6a6","#e0e0ca"],black:["#262c3c","#595574","#b4a6c0"]
};
const AD_ITEMS=["gold","bridge","sword","magnet","white","black","chalice"];
const AD_LABELS={gold:"GOLD KEY",white:"WHITE KEY",black:"BLACK KEY",bridge:"BRIDGE",sword:"SWORD",magnet:"MAGNET",chalice:"CHALICE"};
const AD_ITEM_START=[5,6,7,11,14,13,17];
const AD_DRAGONS=[{name:"YORGLE",color:"#e4c466",room:5,speed:38},{name:"GRUNDLE",color:"#80b879",room:14,speed:45},{name:"RHINDLE",color:"#d27b72",room:17,speed:52}];
function ag(key){return read_global("ad_"+key);}
function aw(key,value){write_global("ad_"+key,value);}
function ai(key,field){return ag("item_"+key+"_"+field);}
function iw(key,field,value){aw("item_"+key+"_"+field,value);}
function hero(n){return find_name("ad_hero"+n)[0];}
function root(){return find_name("adventure")[0];}
function active(n){return ag("lives"+n)>0;}
function held(n){for(const key of AD_ITEMS)if(ai(key,"owner")==n)return key;return "";}
function say(text){aw("message",text);aw("message_until",ag("clock")+3.2);}
function fill(x,y,w,h,c){for(let j=0;j<h;j++)draw_line(x-w/2,y-h/2+j,x+w/2,y-h/2+j,c);}
function box(o,x,y,w,h,c){for(let j=0;j<h;j++)draw_line(o,x-w/2,y-h/2+j,x+w/2,y-h/2+j,c);}
function dist(x,y,a,b){return Math.sqrt((x-a)*(x-a)+(y-b)*(y-b));}
function exit_open(room,side){
    if(AD_ROOMS[room].exits[side]<0)return false;
    return side!=0||!AD_ROOMS[room].gate||ag("gate_"+AD_ROOMS[room].gate);
}
function initialize(){
    aw("room",1);aw("message","");aw("message_until",0);aw("visited",1<<1);aw("changes",0);
    aw("gate_gold",false);aw("gate_white",false);aw("gate_black",false);aw("secret",false);
    for(let n=1;n<=2;n++){
        aw("lives"+n,n==2&&ag("mode")!=3?0:3);aw("px"+n,n==1?296:344);aw("py"+n,238);
        aw("face"+n,0);aw("immune"+n,ag("clock")+2);aw("lost"+n,0);aw("entry_x"+n,n==1?296:344);aw("entry_y"+n,238);
    }
    const pool=[2,3,4,5,6,7,9,10,11,16];
    for(let i=0;i<AD_ITEMS.length;i++){
        const key=AD_ITEMS[i];let room=AD_ITEM_START[i];
        if(ag("mode")==1&&i<4){const pick=Math.floor(random(0,pool.length-0.001));room=pool.splice(pick,1)[0];}
        iw(key,"room",room);iw(key,"x",key=="white"?320:key=="black"?438:key=="chalice"?320:260+(i%3)*60);
        iw(key,"y",key=="white"||key=="chalice"?90:132);iw(key,"owner",0);iw(key,"cool",0);
    }
    for(let d=0;d<3;d++){
        aw("d"+d+"_room",AD_DRAGONS[d].room);aw("d"+d+"_x",d==0?420:d==1?410:442);aw("d"+d+"_y",d==1?108:190);
        aw("d"+d+"_dead",false);aw("d"+d+"_next",ag("clock")+14+d*3);
    }
    aw("bat_room",4);aw("bat_x",160);aw("bat_y",94);aw("bat_next",ag("clock")+9);aw("bat_drop",0);aw("bat_cool",0);
}
function rebuild(game){for(const scene of find_name("ad_scene"))kill(scene);spawn(game,"ad_scene");}
function begin(game){
    for(const menu of find_name("ad_menu"))kill(menu);stop_music();initialize();aw("phase","ready");
    rebuild(game);state_to(game,"ready");
}
function drop_item(n,where){
    const key=held(n);if(!key)return;
    const player=hero(n),x=player?player.x:ag("px"+n),y=player?player.y:ag("py"+n);
    const angle=player?player.angle:0;
    let dx=Math.max(24,Math.min(616,x+Math.sin(angle*Math.PI/180)*24));
    let dy=Math.max(62,Math.min(266,y-Math.cos(angle*Math.PI/180)*24));
    if(key=="bridge"&&ag("room")==8&&Math.abs(dx-320)<55&&Math.abs(dy-168)<70){dx=320;dy=168;}
    iw(key,"owner",0);iw(key,"room",ag("room"));iw(key,"x",dx);iw(key,"y",dy);iw(key,"cool",ag("clock")+0.65);
    const object=find_name("ad_item_"+key)[0];if(object){position(object,dx,dy);apply_angle(object,0);}
    if(player)play_sound(player,"drop");
}
function bridge_open(){
    const owner=ai("bridge","owner");
    if(owner>0){const p=hero(owner);return p&&Math.abs(p.x-320)<32;}
    return owner==0&&ai("bridge","room")==8&&Math.abs(ai("bridge","x")-320)<25&&Math.abs(ai("bridge","y")-168)<40;
}
function lose(player){
    const n=read_local(player,"team");if(!active(n)||ag("clock")<ag("immune"+n)||ag("lost"+n)>ag("clock"))return;
    drop_item(n);aw("lives"+n,ag("lives"+n)-1);aw("lost"+n,ag("clock")+1.2);collider_off(player,"body");
    play_sound(player,"hurt");say(active(n)?"A HERO FALLS. THE QUEST REMAINS.":"A HERO'S LAST STAND.");
}
function near_exit(p,side){return side==0?p.y<76&&Math.abs(p.x-320)<65:side==2?p.y>250&&Math.abs(p.x-320)<65:side==1?p.x>590&&Math.abs(p.y-164)<65:p.x<50&&Math.abs(p.y-164)<65;}
function travel(game,side){
    const old=ag("room"),next=AD_ROOMS[old].exits[side];
    if(!exit_open(old,side))return;
    for(let n=1;n<=(ag("mode")==3?2:1);n++)if(active(n)){
        const p=hero(n);if(!p||ag("lost"+n)>ag("clock")||!near_exit(p,side)){say("WAIT FOR YOUR COMPANION AT THE EXIT.");return;}
    }
    for(let n=1;n<=2;n++){
        aw("px"+n,side==1?24:side==3?616:ag("mode")==3?(n==1?304:336):320);
        aw("py"+n,side==0?272:side==2?58:ag("mode")==3?(n==1?150:178):164);
        aw("entry_x"+n,ag("px"+n));aw("entry_y"+n,ag("py"+n));
        aw("immune"+n,Math.max(ag("immune"+n),ag("clock")+0.5));
        const key=held(n);if(key)iw(key,"room",next);
    }
    aw("room",next);aw("visited",ag("visited")|(1<<next));aw("changes",ag("changes")+1);aw("message","");
    rebuild(game);play_sound(game,"travel");if(next==8)say("A BRIDGE CAN SPAN THE NARROW CROSSING.");
}
function bat_step(game){
    if(ag("clock")<ag("bat_next"))return;
    aw("bat_next",ag("clock")+9);const old=ag("bat_room");
    const options=[];
    for(let side=0;side<4;side++)if(exit_open(old,side)){
        const r=AD_ROOMS[old].exits[side];if(r!=8&&r!=14)options.push(r);
    }
    if(!options.length)return;
    const next=options[Math.floor(random(0,options.length-0.001))];
    // Deliver stolen items to an ordinary reachable room, never beyond the river.
    for(const key of AD_ITEMS)if(ai(key,"owner")==-1){
        iw(key,"owner",0);iw(key,"room",old);iw(key,"x",320);iw(key,"y",225);iw(key,"cool",ag("clock")+1);
        if(old==ag("room")&&!find_name("ad_item_"+key).length)spawn(find_name("ad_scene")[0],"ad_item_"+key);
    }
    aw("bat_room",next);aw("bat_x",96);aw("bat_y",90);aw("bat_cool",ag("clock")+3);
    for(const bat of find_name("ad_bat"))kill(bat);
    if(next==ag("room"))spawn(find_name("ad_scene")[0],"ad_bat");
}
function next_step(from,to){
    const queue=[from],seen={};seen[from]=-1;
    for(let i=0;i<queue.length;i++){
        const r=queue[i];if(r==to)break;
        for(let s=0;s<4;s++)if(exit_open(r,s)){
            const v=AD_ROOMS[r].exits[s];if(seen[v]===undefined){seen[v]=r;queue.push(v);}
        }
    }
    if(seen[to]===undefined)return from;
    let step=to;while(seen[step]!=from&&seen[step]!=-1)step=seen[step];return step;
}
function hunt_step(game){
    if(ag("mode")!=2)return;
    for(let d=0;d<3;d++){
        const key="d"+d;
        if(ag(key+"_dead")||ag(key+"_room")==ag("room")||ag("clock")<ag(key+"_next"))continue;
        aw(key+"_next",ag("clock")+12);const from=ag(key+"_room"),next=next_step(from,ag("room"));
        if(next==from)continue;
        aw(key+"_room",next);aw(key+"_x",420);aw(key+"_y",220);
        if(next==ag("room")){spawn(find_name("ad_scene")[0],"ad_dragon_"+d);say(AD_DRAGONS[d].name+" HAS FOUND YOUR TRAIL.");}
    }
}
function game_born(game){aw("mode",0);aw("phase","menu");aw("clock",0);initialize();}
function game_action(game){
    aw("clock",ag("clock")+delta());
    if(input_pressed(system(),button(0))){stop_music();exit();return;}
    if(state_entered(game)){
        if(state_active(game,"menu")){aw("phase","menu");initialize();rebuild(game);spawn(game,"ad_menu");}
        return;
    }
    if(state_active(game,"menu")){
        if(ag("refresh")){aw("refresh",false);initialize();rebuild(game);}
        if(ag("start")){aw("start",false);begin(game);}return;
    }
    if(state_active(game,"ready")){if(state_time(game)>1.2){aw("phase","play");state_to(game,"play");}return;}
    if(state_active(game,"over")||state_active(game,"victory")){
        if(input_pressed(system(),button(1)))begin(game);
        else if(input_pressed(system(),button(2))){aw("phase","menu");state_to(game,"menu");}return;
    }
    if(!state_active(game,"play"))return;
    if(!active(1)&&!active(2)){aw("phase","over");state_to(game,"over");play_sound(game,"over");return;}
    if(ag("room")==0){
        const owner=ai("chalice","owner"),p=owner>0?hero(owner):null;
        if(p&&p.y<145&&Math.abs(p.x-320)<65){
            let slain=true;for(let d=0;d<3;d++)if(!ag("d"+d+"_dead"))slain=false;
            if(ag("mode")!=2||slain){aw("phase","victory");state_to(game,"victory");save("80slike","adventure",true);play_sound(game,"victory");return;}
            say("THE THREE DRAGONS MUST FALL FIRST.");
        }
    }
    for(let n=1;n<=2;n++){
        const p=hero(n);if(!p||!active(n)||ag("lost"+n)>ag("clock"))continue;
        const side=p.y<=44?0:p.x>=628?1:p.y>=282?2:p.x<=12?3:-1;
        if(side>=0&&exit_open(ag("room"),side)){travel(game,side);return;}
    }
    bat_step(game);hunt_step(game);
}
function scene_born(scene){
    spawn(scene,"ad_room_"+ag("room"));
    for(const key of AD_ITEMS)if(ai(key,"owner")>0||ai(key,"room")==ag("room")&&ai(key,"owner")==0)spawn(scene,"ad_item_"+key);
    for(let d=0;d<3;d++)if(ag("d"+d+"_room")==ag("room")&&!ag("d"+d+"_dead"))spawn(scene,"ad_dragon_"+d);
    if(ag("bat_room")==ag("room"))spawn(scene,"ad_bat");
    spawn(scene,"ad_hero1");if(ag("mode")==3)spawn(scene,"ad_hero2");
}
function menu_born(menu){write_local(menu,"lore",false);play_timer(menu,"idle",8);play_music(menu,"theme");}
function menu_action(menu){
    if(input_pressed(system(),button(1))){aw("start",true);return;}
    if(input_pressed(system(),button(2))){aw("mode",(ag("mode")+1)%4);aw("refresh",true);play_sound(menu,"select");}
    let used=input_down(system(),button(1))||input_down(system(),button(2));
    for(let n=1;n<=2;n++)used=used||input_down(player(n),button(0))||input_direction(player(n),direction(0),HORIZONTAL)!=0||input_direction(player(n),direction(0),VERTICAL)!=0;
    if(used){write_local(menu,"lore",false);stop_timer(menu,"idle");play_timer(menu,"idle",8);}
    else if(timer_done(menu,"idle")){write_local(menu,"lore",!read_local(menu,"lore"));play_timer(menu,"idle",8);}
}
function hero_born(player){
    const n=player.name=="ad_hero1"?1:2;write_local(player,"team",n);write_local(player,"pickup",ag("clock")+0.3);
    position(player,ag("px"+n),ag("py"+n));apply_angle(player,ag("face"+n));
    if(!active(n)){collider_off(player,"body");hide(player);}
}
function hero_action(player){
    const n=read_local(player,"team");if(!active(n))return;
    if(ag("lost"+n)>ag("clock"))return;
    if(ag("lost"+n)>0){
        aw("lost"+n,0);aw("immune"+n,ag("clock")+2.5);position(player,ag("entry_x"+n)||ag("px"+n),ag("entry_y"+n)||238);
        collider_on(player,"body");write_local(player,"pickup",ag("clock")+0.8);
    }
    if(ag("phase")!="play")return;
    const x=input_direction(player,direction(0),HORIZONTAL),y=input_direction(player,direction(0),VERTICAL);
    if(x!=0)move_horizontal(player,x);if(y!=0)move_vertical(player,y);
    if(x!=0||y!=0)apply_angle(player,Math.abs(x)>Math.abs(y)?(x>0?90:270):(y>0?180:0));
    position(player,Math.max(10,Math.min(630,player.x)),Math.max(42,Math.min(284,player.y)));
    aw("px"+n,player.x);aw("py"+n,player.y);aw("face"+n,player.angle);
    if(input_pressed(player,button(0))){drop_item(n);write_local(player,"pickup",ag("clock")+0.7);}
    if(held(n)=="magnet"){
        for(const key of AD_ITEMS)if(ai(key,"owner")==0&&ai(key,"room")==ag("room")&&key!="bridge"){
            const item=find_name("ad_item_"+key)[0];if(!item)continue;
            const length=dist(item.x,item.y,player.x,player.y);
            if(length>26&&length<135){
                // Magical attraction is scripted displacement, not an alternative collision solver.
                position(item,item.x+(player.x-item.x)/length*42*delta(),item.y+(player.y-item.y)/length*42*delta());
                iw(key,"x",item.x);iw(key,"y",item.y);
            }
        }
    }
    if(ag("room")==16&&held(n)=="magnet"&&dist(player.x,player.y,320,110)<65&&!ag("secret")){
        aw("secret",true);say("SOME KINGDOMS ARE BUILT WITH FLX.");play_sound(player,"pickup");
    }
}
function hero_collision(player,other,contacts){
    if(ag("phase")!="play")return;const n=read_local(player,"team");
    if(!active(n)||ag("lost"+n)>ag("clock"))return;
    if(other.group=="ad_item"){
        const key=read_local(other,"key");
        if(!held(n)&&ai(key,"owner")==0&&ai(key,"cool")<=ag("clock")&&read_local(player,"pickup")<ag("clock")){
            iw(key,"owner",n);iw(key,"room",ag("room"));play_sound(player,"pickup");say(AD_LABELS[key]+" / ACTION TO DROP");
        }return;
    }
    if(other.group=="ad_dragon"){
        if(read_local(other,"biting"))lose(player);return;
    }
    if(other.group=="ad_gate"){
        const key=AD_ROOMS[ag("room")].gate;
        if(key&&held(n)==key){aw("gate_"+key,true);collider_off(other,"body");hide(other);play_sound(player,"gate");say(AD_LABELS[key]+" OPENS THE WAY.");return;}
    }
    if(other.group=="ad_gap"&&bridge_open())return;
    if(other.group=="ad_wall"||other.group=="ad_gate"||other.group=="ad_gap")for(const contact of contacts)position(player,contact);
}
function item_born(item){
    const key=item.name.substring(8);write_local(item,"key",key);
    const owner=ai(key,"owner");
    // New children can collide before their first action: carried objects must
    // already be at the incoming hero's position during construction.
    if(owner>0){
        const face=ag("face"+owner),a=face*Math.PI/180;
        position(item,ag("px"+owner)+Math.sin(a)*19,ag("py"+owner)-Math.cos(a)*19);
        apply_angle(item,key=="sword"?face:0);
    }else position(item,ai(key,"x"),ai(key,"y"));
}
function item_action(item){
    const key=read_local(item,"key"),owner=ai(key,"owner");
    if(owner==-1){hide(item);return;}
    show(item);
    if(owner>0){
        const p=hero(owner);if(!p)return;
        const angle=p.angle*Math.PI/180;position(item,p.x+Math.sin(angle)*19,p.y-Math.cos(angle)*19);
        apply_angle(item,key=="sword"?p.angle:0);
    }else{position(item,ai(key,"x"),ai(key,"y"));apply_angle(item,0);}
}
function slay(dragon){
    const d=read_local(dragon,"dragon");if(ag("d"+d+"_dead"))return;
    aw("d"+d+"_dead",true);play_sound(dragon,"slain");say(AD_DRAGONS[d].name+" HAS FALLEN.");kill(dragon);
}
function item_collision(item,other,contacts){
    const key=read_local(item,"key");
    if(ai(key,"owner")==0&&(other.group=="ad_wall"||other.group=="ad_gate")){
        for(const contact of contacts)position(item,contact);
        iw(key,"x",item.x);iw(key,"y",item.y);return;
    }
    if(ag("phase")!="play"||key!="sword"||ai("sword","owner")<=0)return;
    const owner=ai("sword","owner");if(!active(owner)||ag("lost"+owner)>ag("clock"))return;
    if(other.group=="ad_dragon")slay(other);
}
function dragon_born(dragon){
    const d=Number(dragon.name.substring(10));write_local(dragon,"dragon",d);write_local(dragon,"biting",false);
    position(dragon,ag("d"+d+"_x"),ag("d"+d+"_y"));apply_speed(dragon,AD_DRAGONS[d].speed+(ag("mode")==2?7:0));
    write_local(dragon,"bite_at",0);write_local(dragon,"cool",ag("clock")+1.5);write_local(dragon,"sidestep",0);
}
function dragon_action(dragon){
    if(ag("phase")!="play")return;
    const d=read_local(dragon,"dragon");let target=null,length=9999;
    for(let n=1;n<=2;n++){const p=hero(n);if(!p||!active(n)||ag("lost"+n)>ag("clock"))continue;const v=dist(p.x,p.y,dragon.x,dragon.y);if(v<length){length=v;target=p;}}
    if(!target)return;
    let dx=(target.x-dragon.x)/Math.max(length,1),dy=(target.y-dragon.y)/Math.max(length,1);
    const fear=held(read_local(target,"team"))=="sword"&&d<2&&length<(d==0?150:92);
    write_local(dragon,"face",dx<0?-1:1);write_local(dragon,"afraid",fear);
    if(length<43&&!fear&&ag("clock")>read_local(dragon,"cool")){
        if(read_local(dragon,"bite_at")==0){write_local(dragon,"bite_at",ag("clock")+0.6);play_sound(dragon,"growl");}
        const bite=ag("clock")>=read_local(dragon,"bite_at");write_local(dragon,"biting",bite);
        if(bite&&ag("clock")>read_local(dragon,"bite_at")+0.35){write_local(dragon,"biting",false);write_local(dragon,"bite_at",0);write_local(dragon,"cool",ag("clock")+1.2);}
    }else{
        write_local(dragon,"biting",false);write_local(dragon,"bite_at",0);
        if(length<230||ag("mode")==2){
            if(fear){dx=-dx;dy=-dy;}
            if(read_local(dragon,"sidestep")>ag("clock")){const swap=dx;dx=-dy;dy=swap;}
            move_horizontal(dragon,dx);move_vertical(dragon,dy);
        }
    }
    position(dragon,Math.max(30,Math.min(610,dragon.x)),Math.max(62,Math.min(268,dragon.y)));
    aw("d"+d+"_x",dragon.x);aw("d"+d+"_y",dragon.y);
}
function dragon_collision(dragon,other,contacts){
    if(other.group=="ad_wall"||other.group=="ad_gate"){
        for(const c of contacts)position(dragon,c);write_local(dragon,"sidestep",ag("clock")+0.8);
    }
}
function bat_born(bat){position(bat,ag("bat_x"),ag("bat_y"));write_local(bat,"direction",1);}
function bat_action(bat){
    if(ag("phase")!="play")return;
    let dx=read_local(bat,"direction");if(bat.x>580)dx=-1;if(bat.x<60)dx=1;write_local(bat,"direction",dx);
    move_horizontal(bat,dx);position_y(bat,104+Math.sin(ag("clock")*1.4)*48);aw("bat_x",bat.x);aw("bat_y",bat.y);
    let carrying="";for(const key of AD_ITEMS)if(ai(key,"owner")==-1)carrying=key;
    if(carrying||ag("clock")<ag("bat_cool"))return;
    for(const key of AD_ITEMS){
        if(key=="bridge"||ai(key,"room")!=ag("room"))continue;
        const owner=ai(key,"owner"),p=owner>0?hero(owner):find_name("ad_item_"+key)[0];
        if(!p||owner<0||dist(bat.x,bat.y,p.x,p.y)>28)continue;
        iw(key,"owner",-1);aw("bat_cool",ag("clock")+12);say("THE BAT TOOK THE "+AD_LABELS[key]+"!");play_sound(bat,"steal");return;
    }
}
function gate_born(gate){const key=AD_ROOMS[ag("room")].gate;if(key&&ag("gate_"+key)){hide(gate);collider_off(gate,"body");}}
function item_picture(o,key,color){
    const ink="#1b2931";
    if(key=="sword"){
        box(o,1,0,6,22,ink);box(o,0,-3,3,17,"#dce2d0");draw_line(o,-1,-9,-1,3,"#fbf1ce");
        box(o,0,5,13,3,"#d5b877");box(o,0,10,4,7,"#8f5f45");box(o,0,14,6,3,"#d5b877");
    }else if(key=="bridge"){
        box(o,-15,0,4,64,"#644b3c");box(o,15,0,4,64,"#644b3c");
        for(let y=-28;y<=28;y+=8){box(o,0,y,36,6,"#b79264");draw_line(o,-14,y-2,14,y-2,"#e1c18b");}
    }else if(key=="magnet"){
        box(o,-7,0,5,18,"#c7766f");box(o,7,0,5,18,"#c7766f");box(o,0,7,16,5,"#c7766f");
        box(o,-7,-7,5,5,"#d2d6c5");box(o,7,-7,5,5,"#d2d6c5");
    }else if(key=="chalice"){
        box(o,0,1,19,24,ink);box(o,0,-6,15,8,"#dfbf68");box(o,0,0,11,6,"#b28b45");
        box(o,0,6,4,9,"#edce7e");box(o,0,11,16,4,"#dfbf68");draw_line(o,-6,-9,6,-9,"#fff1be");
        draw_line(o,-10,-7,-10,-1,"#d3ae5d");draw_line(o,10,-7,10,-1,"#d3ae5d");
    }else{
        box(o,0,1,25,8,ink);draw_rectangle(o,-7,-1,9,9,color);draw_rectangle(o,-7,-1,7,7,color);
        box(o,5,0,17,3,color);box(o,10,4,3,7,color);box(o,5,3,3,5,color);
    }
}
function item_draw(item){
    if(ag("phase")=="menu")return;const key=read_local(item,"key");
    if(ai(key,"owner")==-1)return;
    const colors={gold:"#efd28a",white:"#ecead6",black:"#b8a6d1"};
    if(key=="bridge"&&ag("room")==8&&ai(key,"owner")==0&&bridge_open()){
        item_picture(item,key,colors[key]);return;
    }
    item_picture(item,key,colors[key]||"#dec584");
    if(ai(key,"owner")==0&&Math.floor(ag("clock")*3)%7==0){
        draw_line(item,17,-13,17,-7,"#e9ddb4");draw_line(item,14,-10,20,-10,"#e9ddb4");
    }
}
function hero_draw(player){
    if(ag("phase")=="menu")return;const n=read_local(player,"team");if(!active(n))return;
    if(ag("lost"+n)>ag("clock")){
        const t=1.2-(ag("lost"+n)-ag("clock"));
        for(let i=0;i<8;i++){const a=i*Math.PI/4,r=6+t*18;draw_line(player.x+Math.cos(a)*r,player.y+Math.sin(a)*r,player.x+Math.cos(a)*(r+3),player.y+Math.sin(a)*(r+3),"#e4bd83");}return;
    }
    if(ag("immune"+n)>ag("clock")&&Math.floor(ag("clock")*10)%2==0)return;
    const c=n==1?"#e2be76":"#80bedc";
    box(player,1,3,14,14,"#18272d");box(player,0,2,11,11,c);box(player,0,3,5,7,n==1?"#9e7750":"#50798c");
    box(player,0,-5,12,7,"#c1c8b9");box(player,0,-5,8,3,"#33454a");box(player,0,-6,3,2,"#ece7ca");
    box(player,-7,2,3,7,c);box(player,7,2,3,7,c);box(player,-3,9,4,3,"#796c5c");box(player,3,9,4,3,"#796c5c");
}
function dragon_draw(dragon){
    if(ag("phase")=="menu")return;
    const d=read_local(dragon,"dragon"),color=AD_DRAGONS[d].color,face=read_local(dragon,"face")||1;
    box(dragon,0,5,32,17,"#172b30");box(dragon,-4,2,29,18,color);box(dragon,face*9,-6,9,18,color);
    box(dragon,face*16,-12,19,10,color);box(dragon,face*22,-8,13,4,"#283237");
    box(dragon,face*13,-14,3,3,"#f5e4b2");draw_pixel(dragon,face*14,-14,"#282c33");
    for(let i=0;i<5;i++)draw_line(dragon,-face*(10+i*3),5+i,-face*(17+i*3),5+i,color);
    for(const x of [-8,7]){box(dragon,x,13,5,8,color);box(dragon,x+3,16,8,3,color);}
    for(let i=0;i<4;i++)draw_line(dragon,-15+i*6,-5,-12+i*6,-10,"#e1cf9c");
    const wing=Math.sin(ag("clock")*5)*3;draw_line(dragon,-8,-2,-15,-14-wing,color);draw_line(dragon,-15,-14-wing,3,-6,color);
    if(read_local(dragon,"bite_at")>0){
        draw_text(dragon.x,dragon.y-32,"!",18,read_local(dragon,"biting")?"#f49c83":"#edce82");
        if(read_local(dragon,"biting"))for(let i=0;i<3;i++)draw_line(dragon,face*18,-7+i*2,face*27,-7+i*2,"#f4d7ad");
    }
    if(read_local(dragon,"afraid"))draw_pixel(dragon.x+face*25,dragon.y-21,"#80c4d1");
}
function bat_draw(bat){
    if(ag("phase")=="menu")return;const flap=Math.sin(ag("clock")*14)*8;
    box(bat,0,0,8,9,"#b3a2c5");box(bat,0,-4,10,4,"#b3a2c5");
    for(const side of [-1,1]){
        draw_line(bat,side*3,-1,side*19,-8-flap,"#ad9ac3");draw_line(bat,side*19,-8-flap,side*14,6,"#ad9ac3");
        draw_line(bat,side*14,6,side*3,2,"#ad9ac3");draw_line(bat,side*5,0,side*14,1,"#7b7398");
        draw_pixel(bat,side*2,-4,"#e9c886");
    }
    for(const key of AD_ITEMS)if(ai(key,"owner")==-1){box(bat,0,15,10,7,key=="chalice"?"#e5c87b":"#a7bdaf");}
}
function room_draw(room){
    const r=ag("room"),theme=AD_THEMES[AD_ROOMS[r].theme],t=ag("clock");
    for(let y=64;y<280;y+=34)for(let x=30;x<630;x+=52){
        const offset=((x*7+y*3+r*13)%11);
        draw_line(x+offset,y,x+offset+3,y,theme[1]);
    }
    if(r==8){
        fill(320,168,624,44,"#1a394d");draw_line(8,145,632,145,"#849f94");draw_line(8,191,632,191,"#849f94");
        for(let x=12;x<640;x+=45){const dx=(t*9)%45;draw_line(x+dx,157,x+dx+16,157,"#3c6373");draw_line(x-dx,177,x-dx+12,177,"#315768");}
        draw_line(282,141,282,195,"#c5bf9c");draw_line(358,141,358,195,"#c5bf9c");
    }
    if(AD_ROOMS[r].gate){
        const stone=theme[1],shine=theme[2];
        fill(237,72,56,56,stone);fill(403,72,56,56,stone);
        for(const cx of [237,403]){
            for(let x=cx-28;x<cx+28;x+=16)fill(x+5,39,10,15,stone);
            draw_line(cx-24,54,cx+24,54,shine);draw_line(cx-22,81,cx+22,81,shine);
            draw_line(cx,56,cx,78,shine);fill(cx,65,5,12,"#273744");
        }
        draw_line(267,45,373,45,shine);
        for(const cx of [185,455]){
            draw_line(cx,69,cx,118,"#a28f70");fill(cx,84,18,25,r==15?"#75638d":r==12?"#cad0bb":"#d2af64");
            draw_line(cx-6,75,cx+6,75,"#ede0b0");
        }
    }
    if(r==0){
        fill(320,111,118,44,"#736344");draw_rectangle(320,111,118,44,"#cfb675");
        fill(320,108,38,26,"#b29a64");draw_line(300,94,340,94,"#f0db9b");
        for(const x of [220,420]){fill(x,108,12,32,"#6c6550");draw_line(x-3,89,x+3,89,"#f3c77b");}
    }
    for(const x of [90,550]){
        const y=r==0||AD_ROOMS[r].gate?86:55;
        if(r==0||AD_ROOMS[r].gate||r==13||r==17){
            fill(x,y+7,7,10,"#806a51");const flicker=Math.floor(t*9+x)%3;
            fill(x,y,5,7+flicker,"#edb77a");fill(x,y-2,2,4,"#f5dfaa");
        }
    }
    if(r==16){
        fill(320,109,100,42,"#5b6259");draw_rectangle(320,109,100,42,"#b6ab8e");
        if(ag("secret")){draw_text(320,102,"BUILT WITH",11,"#e3d8ae");draw_text(320,117,"FLX",14,"#e7c67e");}
        else for(let x=292;x<=348;x+=14)draw_line(x,101,x+4,114,"#a49b81");
    }
    // Tiny exit markers aid orientation without an inventory or menu overlay.
    for(let side=0;side<4;side++)if(AD_ROOMS[r].exits[side]>=0){
        const c=exit_open(r,side)?"#c6cfab":"#be8a71";
        if(side==0)draw_line(316,44,324,44,c);else if(side==2)draw_line(316,282,324,282,c);
        else if(side==1)draw_line(625,160,625,168,c);else draw_line(15,160,15,168,c);
    }
}
function wall_draw(wall){
    const theme=AD_THEMES[AD_ROOMS[ag("room")].theme],w=wall.width,h=wall.height;
    if((ag("room")==8&&wall.y==168)||(ag("room")==9&&w==96)){
        for(let x=-w/2+8;x<w/2-16;x+=34){
            const drift=(ag("clock")*8)%12;draw_line(wall,x+drift,-5,x+drift+13,-5,"#3c6373");
            draw_line(wall,x-drift+5,7,x-drift+16,7,"#315768");
        }
        draw_line(wall,-w/2,-h/2,w/2,-h/2,"#849f94");draw_line(wall,-w/2,h/2,w/2,h/2,"#849f94");return;
    }
    if(wall.name.indexOf("tree")>=0){
        box(wall,0,8,8,20,"#7b7153");box(wall,0,-4,w+8,h,"#3e6051");box(wall,-3,-8,w-6,h-6,"#658168");
        draw_line(wall,-w/2,-h/2,w/2-4,-h/2,"#8e9a71");return;
    }
    draw_rectangle(wall,0,0,w,h,theme[2]);
    if(w>h){
        draw_line(wall,-w/2+2,-h/2+2,w/2-2,-h/2+2,theme[2]);
        for(let x=-w/2+20;x<w/2;x+=30)draw_line(wall,x,-h/2+3,x,h/2-2,theme[0]);
    }else for(let y=-h/2+20;y<h/2;y+=28)draw_line(wall,-w/2+2,y,w/2-2,y,theme[0]);
}
function gate_draw(gate){
    const key=AD_ROOMS[ag("room")].gate;if(ag("gate_"+key))return;
    const color=key=="gold"?"#dabc78":key=="white"?"#d8daca":"#a99abb";
    for(let x=-32;x<=32;x+=8)box(gate,x,0,3,23,color);
    box(gate,0,-10,73,4,color);box(gate,0,9,73,4,color);box(gate,0,0,10,8,"#524d4c");draw_pixel(gate,0,0,color);
}
function menu_draw(menu){
    draw_rectangle(320,160,540,240,"#78795d");
    draw_text(323,77,"ADVENTURE",46,"#5d513c");draw_text(320,73,"ADVENTURE",46,"#ecd295");
    draw_text(320,108,"A SMALL HERO. A VERY LARGE RESPONSIBILITY.",11,"#b3c5ac");
    draw_line(98,124,542,124,"#616e58");
    if(read_local(menu,"lore")){
        draw_text(320,151,"The kingdom has lost its sacred chalice.",13,"#e3dfbf");
        draw_text(320,175,"Three dragons stand between you and glory.",13,"#c6d0b8");
        draw_text(320,202,"The bat has no idea what is happening.",13,"#c6d0b8");
        draw_text(320,229,"Unfortunately, it is in charge of logistics.",13,"#e4c68d");
    }else{
        const mode=ag("mode");draw_text(320,151,AD_MODES[mode],23,AD_ACCENTS[mode]);
        const descriptions=["Recover the chalice. Bring it home.","A familiar kingdom. Unfamiliar hiding places.","Three dragons. No unfinished business.","One quest. Two heroes. Stay together."];
        draw_text(320,184,descriptions[mode],13,"#d2dac0");
        draw_text(320,213,mode==3?"2 PLAYERS / SHARED EXPLORATION":"1 PLAYER / 18 CONNECTED SCREENS",11,"#a9b8a1");
        draw_text(320,240,"Touch: pick up   Action: drop   Carry one item",11,"#c3c9ac");
    }
    draw_text(320,269,"Mode: change quest   Start: adventure",11,"#e5dfba");
}
function heart(x,y,c){fill(x-3,y-2,5,5,c);fill(x+3,y-2,5,5,c);for(let i=0;i<5;i++)draw_line(x-5+i,y+i,x+5-i,y+i,c);}
function game_draw(game){
    if(ag("phase")=="menu")return;
    draw_text(320,13,AD_ROOMS[ag("room")].name,13,"#d8d9bd");
    for(let n=1;n<=(ag("mode")==3?2:1);n++){
        draw_text(n==1?22:527,13,"P"+n,11,n==1?"#dfc68c":"#91c7dc");
        for(let i=0;i<ag("lives"+n);i++)heart((n==1?45:550)+i*18,12,n==1?"#dfc68c":"#91c7dc");
        const key=held(n);draw_text(n==1?99:541,308,key?AD_LABELS[key]:"EMPTY HANDS",11,n==1?"#dfc68c":"#91c7dc");
    }
    const slain=Number(ag("d0_dead"))+Number(ag("d1_dead"))+Number(ag("d2_dead"));
    draw_text(320,308,ag("mode")==2?"DRAGONS "+slain+" / 3":"ACTION: DROP",11,"#9eada3");
    if(ag("message")&&ag("message_until")>ag("clock")&&ag("phase")=="play"){
        fill(320,275,562,19,"#172d31");draw_text(320,275,ag("message"),11,"#e0d8b4");
    }
    if(ag("phase")=="play")return;
    fill(320,163,444,100,"#172d31");draw_rectangle(320,163,444,100,"#919276");
    if(ag("phase")=="ready"){
        draw_text(320,145,"THE QUEST BEGINS",26,"#e8ce91");draw_text(320,182,"KEYS OPEN GATES. THE SWORD PROTECTS ITS BEARER.",11,"#bacbb6");
    }else if(ag("phase")=="victory"){
        draw_text(320,140,"THE CHALICE RETURNS",26,"#e8ce91");draw_text(320,166,"THE KINGDOM REMEMBERS ITS HEROES.",11,"#c5d4bd");
        draw_text(320,194,"Start: new quest   Mode: title",11,"#e1d5b1");
    }else{
        draw_text(320,145,"A LEGEND UNFINISHED",26,"#dba088");draw_text(320,187,"Start: new quest   Mode: title",11,"#c9d2b8");
    }
}
function role(object){
    const name=object.name;
    if(name=="adventure")return "game";if(name=="ad_scene")return "scene";if(name=="ad_menu")return "menu";
    if(name=="ad_hero1"||name=="ad_hero2")return "hero";
    if(name.indexOf("ad_item_")==0)return "item";if(name.indexOf("ad_dragon_")==0)return "dragon";
    if(name=="ad_bat")return "bat";if(name.indexOf("ad_gate_")==0)return "gate";
    if(name.indexOf("ad_room_")==0)return "room";return "wall";
}
function born(object){
    const r=role(object);
    if(r=="game")game_born(object);else if(r=="scene")scene_born(object);else if(r=="menu")menu_born(object);
    else if(r=="hero")hero_born(object);else if(r=="item")item_born(object);else if(r=="dragon")dragon_born(object);
    else if(r=="bat")bat_born(object);else if(r=="gate")gate_born(object);
}
function action(object){
    const r=role(object);
    if(r=="game")game_action(object);else if(r=="menu")menu_action(object);else if(r=="hero")hero_action(object);
    else if(r=="item")item_action(object);else if(r=="dragon")dragon_action(object);else if(r=="bat")bat_action(object);
}
function collision(object,other,contacts){
    const r=role(object);if(r=="hero")hero_collision(object,other,contacts);else if(r=="item")item_collision(object,other,contacts);else if(r=="dragon")dragon_collision(object,other,contacts);
}
function draw(object){
    const r=role(object);if(r=="game")game_draw(object);else if(r=="menu")menu_draw(object);else if(r=="hero")hero_draw(object);
    else if(r=="item")item_draw(object);else if(r=="dragon")dragon_draw(object);else if(r=="bat")bat_draw(object);
    else if(r=="room")room_draw(object);else if(r=="wall")wall_draw(object);else if(r=="gate")gate_draw(object);
}
