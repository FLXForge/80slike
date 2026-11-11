const FIELDS=["Crossfire","Open field","Easy maze","Complex maze"];
function born(menu){write_local(menu,"lore",false);play_timer(menu,"display",8);play_music(menu,"theme");}
function action(menu){
    if(read_global("tank_phase")!="menu")return;
    if(input_pressed(system(),button(1))){write_global("tank_start",true);return;}
    if(input_pressed(system(),button(2))){write_global("tank_option",(read_global("tank_option")+1)%16);write_global("tank_refresh",true);}
    const used=input_down(system(),button(1))||input_down(system(),button(2))||input_down(player(1),button(0))||input_down(player(2),button(0))||
        input_direction(player(1),direction(0),HORIZONTAL)!=0||input_direction(player(1),direction(0),VERTICAL)!=0||
        input_direction(player(2),direction(0),HORIZONTAL)!=0||input_direction(player(2),direction(0),VERTICAL)!=0;
    if(used){write_local(menu,"lore",false);stop_timer(menu,"display");play_timer(menu,"display",8);}
    else if(timer_done(menu,"display")){write_local(menu,"lore",!read_local(menu,"lore"));stop_timer(menu,"display");play_timer(menu,"display",8);}
}
function line(y,text,size,color){draw_text(321,y+1,text,size,"#ecd29c");draw_text(320,y,text,size,color||"#34251f");}
function draw(menu){
    if(read_global("tank_phase")!="menu")return;
    draw_text(324,86,"TANK",76,"#432e24");draw_text(320,80,"TANK",76,"#ffedbc");
    draw_line(214,121,426,121,"#5b3929");draw_line(214,123,426,123,"#ead19c");
    if(read_local(menu,"lore")){
        line(150,"War never changes.",14);line(173,"Always two sides.",14);line(196,"Two colors.",14);line(219,"The reason? None.",14);line(242,"War never changes...",14);
    }else{
        const option=read_global("tank_option");
        line(162,Math.floor(option/8)==0?"P1 vs CPU":"P1 vs P2",21);
        line(211,Math.floor(option/4)%2==0?"CLASSIC TANK":"ADVANCED TANK",16);
        line(244,FIELDS[option%4],16);line(271,(option+1)+" / 16",11);
    }
    line(303,"Mode: change game   Start: battle",11);
}
