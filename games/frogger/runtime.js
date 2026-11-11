/// <reference path="https://flxforge.github.io/FLXEngine/scripts/flx.d.ts" />
const FG_MODES=["CLASSIC","RUSH HOUR","WILD RIVER","TWO FROGS"];
const FG_COLORS=["#b4f46c","#ffca70","#71dcdd","#f2a2d0"];
const FG_HOMES=[80,200,320,440,560];
// Lane rules drive movement, drawing and difficulty; board.json declares the instances.
const FG_LANES=[
    {y:260,speed:48,dir:1,width:46,count:4,kind:"car",color:"#e99852"},
    {y:236,speed:66,dir:-1,width:34,count:4,kind:"car",color:"#e16e8a"},
    {y:212,speed:38,dir:1,width:90,count:3,kind:"truck",color:"#82adcf"},
    {y:188,speed:80,dir:-1,width:36,count:3,kind:"car",color:"#e3ca70"},
    {y:140,speed:30,dir:1,width:118,count:4,kind:"log",color:"#986443"},
    {y:116,speed:35,dir:-1,width:94,count:4,kind:"turtle",color:"#4eaa92"},
    {y:92,speed:42,dir:1,width:112,count:4,kind:"log",color:"#986443"},
    {y:68,speed:28,dir:-1,width:104,count:4,kind:"log",color:"#986443"}
];
function fg_phase(){return read_global("fg_phase");}
function fg_mode(){return read_global("fg_mode");}
function fg_wild(){return fg_mode()>=2;}
function fg_limit(){return fg_mode()==1?35:55;}
function fg_factor(){return (1+0.12*(read_global("fg_round")-1))*(fg_mode()==1?1.32:1);}
function fg_player(n){return find_name("fg_player"+n)[0];}
function fg_life(n){return read_global("fg_lives"+n);}
function fg_score(n,points){write_global("fg_score"+n,read_global("fg_score"+n)+points);}
function fg_reset(frog){
    const team=read_local(frog,"team");
    position(frog,fg_mode()==3?(team==1?296:344):320,284);apply_angle(frog,0);
    write_local(frog,"row",0);write_local(frog,"best",0);write_local(frog,"status","alive");
    write_local(frog,"left",fg_limit());write_local(frog,"support_tick",-10);
    stop_timer(frog,"rest");stop_timer(frog,"hop");play_timer(frog,"hop",0.18);collider_on(frog,"body");
}
function fg_fail(frog,reason){
    if(read_local(frog,"status")!="alive"||fg_phase()!="play")return;
    const team=read_local(frog,"team");write_global("fg_lives"+team,Math.max(0,fg_life(team)-1));
    write_local(frog,"status","lost");write_local(frog,"reason",reason);collider_off(frog,"body");
    stop_timer(frog,"rest");play_timer(frog,"rest",0.95);play_sound(frog,reason=="water"?"splash":"crash");
}
function fg_home(frog){
    let slot=-1;for(let i=0;i<5;i++)if(Math.abs(frog.x-FG_HOMES[i])<=19)slot=i;
    const mask=read_global("fg_homes");
    if(slot<0||(mask&(1<<slot))!=0){fg_fail(frog,"bank");return;}
    const team=read_local(frog,"team");
    write_global("fg_homes",mask|(1<<slot));write_global("fg_owner"+slot,team);
    fg_score(team,100+Math.floor(read_local(frog,"left"))*2);
    write_local(frog,"status","home");collider_off(frog,"body");
    stop_timer(frog,"rest");play_timer(frog,"rest",0.7);play_sound(frog,"home");
}
// Filled details are scan lines; draw_rectangle in FLX is an outline only.
function fg_fill(x,y,w,h,color){for(let j=0;j<h;j++)draw_line(x-w/2,y-h/2+j,x+w/2,y-h/2+j,color);}
function fg_box(o,x,y,w,h,color){for(let j=0;j<h;j++)draw_line(o,x-w/2,y-h/2+j,x+w/2,y-h/2+j,color);}
function fg_icon(x,y,color,scale){
    const s=scale||1;
    fg_fill(x,y,10*s,8*s,color);fg_fill(x-6*s,y-5*s,4*s,4*s,color);fg_fill(x+6*s,y-5*s,4*s,4*s,color);
    fg_fill(x-7*s,y+4*s,4*s,4*s,color);fg_fill(x+7*s,y+4*s,4*s,4*s,color);
    fg_fill(x-5*s,y-5*s,2*s,2*s,"#122b29");fg_fill(x+5*s,y-5*s,2*s,2*s,"#122b29");
}

function game_born(game){
    write_global("fg_mode",0);write_global("fg_phase","menu");write_global("fg_round",1);
    write_global("fg_clock",0);write_global("fg_tick",0);write_global("fg_homes",0);
    write_global("fg_start",false);write_global("fg_rebuild",false);
    for(let n=1;n<=2;n++){write_global("fg_lives"+n,3);write_global("fg_score"+n,0);}
}
function fg_board(game){
    for(const old of find_name("fg_board"))kill(old);
    spawn(game,"fg_board");
}
function fg_begin(game){
    stop_music();for(const menu of find_name("fg_menu"))kill(menu);
    write_global("fg_round",1);write_global("fg_homes",0);
    for(let n=1;n<=2;n++){write_global("fg_lives"+n,n==2&&fg_mode()!=3?0:3);write_global("fg_score"+n,0);}
    write_global("fg_phase","ready");fg_board(game);state_to(game,"ready");
}
function game_action(game){
    write_global("fg_clock",read_global("fg_clock")+delta());write_global("fg_tick",read_global("fg_tick")+1);
    if(input_pressed(system(),button(0))){stop_music();exit();return;}
    if(state_entered(game)){
        if(state_active(game,"menu")){
            write_global("fg_phase","menu");write_global("fg_round",1);write_global("fg_homes",0);
            fg_board(game);spawn(game,"fg_menu");
        }
        return;
    }
    if(state_active(game,"menu")){
        if(read_global("fg_rebuild")){write_global("fg_rebuild",false);fg_board(game);}
        if(read_global("fg_start")){write_global("fg_start",false);fg_begin(game);}return;
    }
    if(state_active(game,"ready")){
        if(state_time(game)>=1.1){write_global("fg_phase","play");state_to(game,"play");}return;
    }
    if(state_active(game,"round")){
        if(state_time(game)<1.8)return;
        write_global("fg_round",read_global("fg_round")+1);write_global("fg_homes",0);
        write_global("fg_phase","ready");fg_board(game);state_to(game,"ready");return;
    }
    if(state_active(game,"over")||state_active(game,"victory")){
        if(input_pressed(system(),button(1)))fg_begin(game);
        else if(input_pressed(system(),button(2))){write_global("fg_phase","menu");state_to(game,"menu");}return;
    }
    if(!state_active(game,"play"))return;
    if(read_global("fg_homes")==31){
        const round=read_global("fg_round");play_sound(game,"round");
        if(round>=3)save("80slike","frogger",true);
        const next=round>=5?"victory":"round";write_global("fg_phase",next);state_to(game,next);return;
    }
    if(fg_life(1)==0&&fg_life(2)==0){write_global("fg_phase","over");state_to(game,"over");play_sound(game,"over");}
}
function game_draw(game){
    if(fg_phase()=="menu")return;
    draw_text(89,12,"P1 "+read_global("fg_score1"),13,"#b4f46c");
    draw_text(320,12,"ROUND "+read_global("fg_round")+" / 5",13,"#e4ebcb");
    if(fg_mode()==3)draw_text(551,12,"P2 "+read_global("fg_score2"),13,"#83d7ef");
    else draw_text(550,12,FG_MODES[fg_mode()],11,FG_COLORS[fg_mode()]);
    for(let n=1;n<=(fg_mode()==3?2:1);n++){
        for(let i=0;i<fg_life(n);i++)fg_icon((n==1?28:546)+i*22,308,n==1?"#b4f46c":"#83d7ef",0.75);
        const frog=fg_player(n);if(!frog)continue;
        const left=Math.max(0,read_local(frog,"left"));
        const x=n==1?154:438;
        draw_text(x,308,"TIME "+Math.ceil(left),11,left<10?"#ff9a83":"#c4d7ca");
    }
    if(fg_mode()!=3)draw_text(440,308,"ARROWS: HOP",11,"#8ca8a8");
    if(fg_phase()=="play")return;
    fg_fill(320,164,342,82,"#102b30");draw_rectangle(320,164,342,82,"#75ad99");
    if(fg_phase()=="ready"){
        draw_text(320,148,"ROUND "+read_global("fg_round"),26,"#d7f29c");
        draw_text(320,181,fg_mode()==3?"FIVE HOMES. TWO FROGS. ONE TEAM.":"FIVE HOMES. ONE VERY BRAVE FROG.",11,"#b8d0c6");
    }else if(fg_phase()=="round"){
        draw_text(320,150,"SAFE AND SOUND!",24,"#d7f29c");draw_text(320,181,"NEXT CROSSING AHEAD",11,"#b8d0c6");
    }else{
        draw_text(320,148,fg_phase()=="victory"?"EVERY FROG HAS ITS DAY":"GAME OVER",26,fg_phase()=="victory"?"#d7f29c":"#f4a489");
        draw_text(320,180,"Start: retry   Mode: title",11,"#d4e2cc");
    }
}

function menu_born(menu){write_local(menu,"lore",false);play_timer(menu,"idle",8);play_music(menu,"theme");}
function menu_action(menu){
    if(input_pressed(system(),button(1))){write_global("fg_start",true);return;}
    if(input_pressed(system(),button(2))){write_global("fg_mode",(fg_mode()+1)%4);write_global("fg_rebuild",true);play_sound(menu,"mode");}
    const used=input_down(system(),button(1))||input_down(system(),button(2))||input_down(player(1),button(0))||input_down(player(2),button(0))||
        input_direction(player(1),direction(0),HORIZONTAL)!=0||input_direction(player(1),direction(0),VERTICAL)!=0||
        input_direction(player(2),direction(0),HORIZONTAL)!=0||input_direction(player(2),direction(0),VERTICAL)!=0;
    if(used){write_local(menu,"lore",false);stop_timer(menu,"idle");play_timer(menu,"idle",8);}
    else if(timer_done(menu,"idle")){write_local(menu,"lore",!read_local(menu,"lore"));stop_timer(menu,"idle");play_timer(menu,"idle",8);}
}
function menu_draw(menu){
    const mode=fg_mode(),clock=read_global("fg_clock");
    draw_rectangle(320,158,518,238,"#345a56");draw_line(86,115,554,115,"#456956");
    draw_text(323,78,"FROGGER",54,"#193f38");draw_text(320,73,"FROGGER",54,"#b4f46c");
    draw_text(320,103,"THE OTHER SIDE IS ALWAYS GREENER",11,"#c8d9ad");
    fg_icon(103,132+Math.sin(clock*3)*3,"#b4f46c",1);fg_icon(537,132+Math.sin(clock*3+1)*3,"#83d7ef",1);
    if(read_local(menu,"lore")){
        draw_text(320,147,"The other side has better flies.",14,"#d8e6c3");
        draw_text(320,174,"Between here and there: traffic, a river...",13,"#bdcdb8");
        draw_text(320,199,"and a worrying number of crocodiles.",13,"#bdcdb8");
        draw_text(320,227,"Nobody mentioned that frogs cannot swim.",13,"#ffcc82");
    }else{
        draw_text(320,145,FG_MODES[mode],24,FG_COLORS[mode]);
        const lines=[
            ["The road. The river. The five little homes.","1 PLAYER / THE ORIGINAL CROSSING"],
            ["Busy lanes. Faster wheels. Less time.","1 PLAYER / HEAVY TRAFFIC"],
            ["Diving turtles, crocodiles and riverbank snakes.","1 PLAYER / EXPECT THE UNEXPECTED"],
            ["Share five homes. Keep each other company.","2 PLAYERS / SIMULTANEOUS CO-OP"]
        ];
        draw_text(320,182,lines[mode][0],13,"#d0dfc5");draw_text(320,211,lines[mode][1],11,"#90b7aa");
        draw_text(320,240,"Directions: hop   Hold to keep hopping",11,"#c5d4ba");
    }
    draw_text(320,267,"Mode: change game   Start: play",11,"#e3edcc");
}

function frog_born(frog){
    const team=frog.name=="fg_player2"?2:1;write_local(frog,"team",team);fg_reset(frog);
    if(team==2&&fg_mode()!=3){kill(frog);return;}
    if(fg_life(team)==0){write_local(frog,"status","out");collider_off(frog,"body");}
}
function frog_action(frog){
    if(fg_phase()!="play")return;
    const team=read_local(frog,"team"),status=read_local(frog,"status");
    if(status!="alive"){
        if(status=="out")return;
        if(timer_done(frog,"rest")){
            if(fg_life(team)>0)fg_reset(frog);else write_local(frog,"status","out");
        }return;
    }
    const row=read_local(frog,"row");
    // Collision from the previous frame tells us whether the river supported us.
    if(row>=6&&row<=9&&read_local(frog,"support_tick")<read_global("fg_tick")-1){fg_fail(frog,"water");return;}
    if(frog.x<9||frog.x>631){fg_fail(frog,"water");return;}
    if(row==10){fg_home(frog);return;}
    write_local(frog,"left",read_local(frog,"left")-delta());
    if(read_local(frog,"left")<=0){fg_fail(frog,"time");return;}
    if(timer_active(frog,"hop"))return;
    const p=player(team),d=direction(0);
    let dx=0,dy=0;
    if(input_down(p,d,UP))dy=-1;
    else if(input_down(p,d,DOWN))dy=1;
    else if(input_down(p,d,LEFT))dx=-1;
    else if(input_down(p,d,RIGHT))dx=1;
    if(dx==0&&dy==0)return;
    if(frog.x+dx*24<9||frog.x+dx*24>631||row-dy<0||row-dy>10)return;
    // FLX's discrete motion quantizes each operation to exactly one 24px hop.
    apply_speed(frog,24/Math.max(delta(),0.0001));
    if(dx!=0)move_horizontal(frog,dx);else move_vertical(frog,dy);
    apply_angle(frog,dy<0?0:dy>0?180:dx>0?90:270);
    write_local(frog,"row",row-dy);
    if(row-dy>read_local(frog,"best")){write_local(frog,"best",row-dy);fg_score(team,10);}
    stop_timer(frog,"hop");play_timer(frog,"hop",0.17);play_sound(frog,"hop");
}
function frog_collision(frog,other,contacts){
    if(fg_phase()!="play"||read_local(frog,"status")!="alive")return;
    if(other.group=="fg_hazard"){fg_fail(frog,"road");return;}
    if(other.group!="fg_platform")return;
    const row=read_local(frog,"row");if(row<6||row>9||Math.abs(frog.y-other.y)>6)return;
    if(read_local(other,"wrapped")==read_global("fg_tick"))return;
    // A grazing foot is not enough: the frog's body must fit on the raft.
    if(frog.x<other.x-other.width/2+6||frog.x>other.x+other.width/2-6)return;
    if(read_local(other,"kind")=="croc"){
        const dir=FG_LANES[read_local(other,"lane")].dir;
        if((frog.x-other.x)*dir>other.width/2-28){fg_fail(frog,"croc");return;}
    }
    const tick=read_global("fg_tick");
    if(read_local(frog,"support_tick")!=tick){carry(frog,other);write_local(frog,"support_tick",tick);}
}
function frog_draw(frog){
    if(fg_phase()=="menu")return;
    const status=read_local(frog,"status"),team=read_local(frog,"team");
    const color=team==1?"#b4f46c":"#83d7ef";
    if(status=="out"||status=="home")return;
    if(status=="lost"){
        const t=1-timer_left(frog,"rest")/0.95;
        if(t>0.65)return;
        const radius=4+t*22;
        for(let i=0;i<8;i++){
            const a=i*Math.PI/4;draw_line(frog.x+Math.cos(a)*radius,frog.y+Math.sin(a)*radius,frog.x+Math.cos(a)*(radius+3),frog.y+Math.sin(a)*(radius+3),"#d4e7ac");
        }return;
    }
    const jump=timer_active(frog,"hop")?Math.sin((1-timer_left(frog,"hop")/0.17)*Math.PI):0;
    fg_box(frog,0,2,14,10,"#142d30");
    fg_box(frog,0,-jump*2,10,10,color);fg_box(frog,0,1-jump*2,6,6,team==1?"#74bb58":"#4397bc");
    for(const side of [-1,1]){
        fg_box(frog,side*6,-5-jump*2,4,5,color);fg_box(frog,side*7,5+jump*2,4,5,color);
        fg_box(frog,side*5,-5-jump*2,2,2,"#102a2c");
    }
}

function mover_born(object){
    const parts=object.name.split("_"),lane=Number(parts[2]),index=Number(parts[3]),data=FG_LANES[lane];
    write_local(object,"lane",lane);write_local(object,"index",index);write_local(object,"wrapped",-1);
    let kind=data.kind;
    if(fg_wild()&&lane==7&&index%2==0)kind="croc";
    write_local(object,"kind",kind);write_local(object,"diving",false);
    apply_speed(object,data.speed*fg_factor());
}
function mover_action(object){
    const lane=read_local(object,"lane"),index=read_local(object,"index"),data=FG_LANES[lane],phase=fg_phase();
    if(phase!="play"&&phase!="menu")return;
    if(object.x>640+object.width/2+8){position(object,-object.width/2-8,object.y);write_local(object,"wrapped",read_global("fg_tick"));}
    else if(object.x<-object.width/2-8){position(object,640+object.width/2+8,object.y);write_local(object,"wrapped",read_global("fg_tick"));}
    if(data.kind=="turtle"&&fg_wild()){
        const cycle=(read_global("fg_clock")+index*1.7)%10;
        const diving=cycle>=8.1;write_local(object,"diving",diving);write_local(object,"warning",cycle>6.7&&!diving);
        if(diving)collider_off(object,"body");else collider_on(object,"body");
    }
    move_horizontal(object,data.dir);
}
function mover_draw(object){
    const lane=read_local(object,"lane"),data=FG_LANES[lane],kind=read_local(object,"kind"),w=object.width;
    if(kind=="car"||kind=="truck"){
        fg_box(object,0,0,w,16,"#1a202e");fg_box(object,0,-1,w-4,14,data.color);
        for(const y of [-8,7])for(const x of [-w/2+7,w/2-7])fg_box(object,x,y,8,3,"#0e1721");
        if(kind=="truck"){
            fg_box(object,-8,0,w-25,10,"#aac5d2");fg_box(object,w/2-11,0,14,12,"#507887");
            fg_box(object,w/2-10,-2,6,8,"#193a4e");
            for(let x=-w/2+10;x<w/2-25;x+=9)draw_line(object,x,-4,x,4,"#7997a8");
        }else{
            fg_box(object,-data.dir*3,0,13,10,"#244659");draw_line(object,-6,-5,4,-5,"#f7d8ae");
        }
        for(const y of [-5,4])fg_box(object,data.dir*(w/2-3),y,2,3,"#ffe3a5");return;
    }
    if(kind=="turtle"){
        const diving=read_local(object,"diving"),warning=read_local(object,"warning");
        for(let x=-w/2+13;x<w/2;x+=24){
            if(diving){draw_line(object,x-5,0,x+5,0,"#4c91a1");draw_pixel(object,x,3,"#4c91a1");continue;}
            const color=warning&&Math.floor(read_global("fg_clock")*7)%2==0?"#ddba72":"#4eaa92";
            fg_box(object,x,0,17,12,"#25595c");fg_box(object,x,-1,13,10,color);
            draw_rectangle(object,x,-1,7,6,"#286a62");
            for(const side of [-1,1]){fg_box(object,x+side*7,6,4,3,color);fg_box(object,x+side*7,-6,4,3,color);}
            fg_box(object,x+data.dir*10,0,4,5,color);
        }return;
    }
    if(kind=="croc"){
        fg_box(object,0,0,w-8,14,"#3f7955");fg_box(object,0,-2,w-16,9,"#85ab65");
        const head=data.dir*(w/2-17);
        fg_box(object,head,0,28,12,"#678d54");fg_box(object,head+data.dir*5,1,17,4,"#152e2d");
        for(let x=-6;x<=6;x+=4)fg_box(object,head+x,0,2,2,"#efdf9b");
        fg_box(object,head-data.dir*7,-4,3,3,"#f1cf70");
        for(let x=-w/2+12;x<w/2-28;x+=12)draw_line(object,x,-5,x+4,-8,"#bed486");return;
    }
    fg_box(object,0,1,w,16,"#513e35");fg_box(object,0,-1,w-2,13,"#986443");
    draw_line(object,-w/2+7,-5,w/2-7,-5,"#c19560");draw_line(object,-w/2+10,3,w/2-14,3,"#714c39");
    draw_rectangle(object,-w/2+5,0,4,9,"#d3a16a");draw_rectangle(object,w/2-5,0,4,9,"#d3a16a");
    for(let x=-w/2+25;x<w/2-10;x+=29)draw_line(object,x,0,x+10,0,"#b68150");
}

function board_draw(board){
    const t=read_global("fg_clock");
    for(let row=0;row<4;row++){
        const y=68+row*24;
        for(let x=-30;x<670;x+=52){
            const drift=((t*(row%2?12:-10))%52);draw_line(x+drift,y+7,x+drift+17,y+7,"#204d66");
            draw_line(x+drift+18,y-7,x+drift+26,y-7,"#285a71");
        }
    }
    for(let y=200;y<=248;y+=24)for(let x=0;x<640;x+=40)draw_line(x+4,y,x+21,y,"#667070");
    draw_line(0,175,640,175,"#bebc82");draw_line(0,273,640,273,"#bebc82");
    for(let x=12;x<640;x+=24){
        draw_line(x,169,x+2,166,"#659264");draw_line(x,290,x+2,287,"#659264");
    }
    for(let i=0;i<5;i++){
        const x=FG_HOMES[i];fg_fill(x,43,44,22,"#214c49");draw_rectangle(x,43,44,22,"#799a64");
        if((read_global("fg_homes")&(1<<i))!=0)fg_icon(x,44,read_global("fg_owner"+i)==2?"#83d7ef":"#b4f46c",1);
        else{
            fg_fill(x,48,24,3,"#568666");draw_pixel(x-8,39,"#b9c67d");draw_pixel(x+10,41,"#b9c67d");
        }
    }
    // Reeds and verge lamps provide landmarks without introducing hidden hazards.
    for(let x=20;x<640;x+=120){
        draw_line(x,52,x-3,39,"#80a063");draw_line(x+4,52,x+7,42,"#63895b");
    }
}

function snake_born(snake){if(!fg_wild()){kill(snake);return;}apply_speed(snake,fg_mode()==3?24:32);}
function snake_action(snake){
    if(fg_phase()!="play"&&fg_phase()!="menu")return;
    move_horizontal(snake,1);if(snake.x>665)position(snake,-25,snake.y);
}
function snake_draw(snake){
    const clock=read_global("fg_clock");
    for(let i=0;i<8;i++){
        const x=10-i*3,y=Math.sin(clock*6-i*0.7)*2;
        fg_box(snake,x,y,4,4,i%2?"#d0aa65":"#8f734c");
    }
    fg_box(snake,12,0,7,6,"#d4b674");draw_pixel(snake,14,-2,"#152c2d");draw_line(snake,17,0,20,0,"#e58a80");
}

// Every role shares one script context. FLX behavior entries have isolated JS scopes.
function fg_role(object){
 if(object.name=="frogger")return "game";
 if(object.name=="fg_menu")return "menu";
 if(object.name=="fg_board")return "board";
 if(object.name=="fg_snake")return "snake";
 if(object.name=="fg_player1"||object.name=="fg_player2")return "frog";
 return "mover";
}
function born(object){
 const role=fg_role(object);
 if(role=="game")game_born(object);else if(role=="menu")menu_born(object);
 else if(role=="frog")frog_born(object);else if(role=="mover")mover_born(object);else if(role=="snake")snake_born(object);
}
function action(object){
 const role=fg_role(object);
 if(role=="game")game_action(object);else if(role=="menu")menu_action(object);
 else if(role=="frog")frog_action(object);else if(role=="mover")mover_action(object);else if(role=="snake")snake_action(object);
}
function collision(object,other,contacts){if(fg_role(object)=="frog")frog_collision(object,other,contacts);}
function draw(object){
 const role=fg_role(object);
 if(role=="game")game_draw(object);else if(role=="menu")menu_draw(object);
 else if(role=="frog")frog_draw(object);else if(role=="mover")mover_draw(object);
 else if(role=="board")board_draw(object);else if(role=="snake")snake_draw(object);
}