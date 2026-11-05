/// <reference path="https://flxforge.github.io/FLXEngine/scripts/flx.d.ts" />

const UI = {
    background:'#0a1020', panel:'#111d31', edge:'#293d58', key:'#20314a',
    white:'#edf4f5', muted:'#a1b5cb', gold:'#f6cc66', cyan:'#6adcf3', red:'#ee728a'
};
const NAV = { exit:button(0), start:button(1), select:button(2) };
const MOVE=direction(0), ACTION=button(0);
const DIRECTIONS=[UP,LEFT,DOWN,RIGHT];

// Compact, code-drawn pixel labels avoid the known small-font raster issue in
// FLX 0.3.1. Each 5x7 glyph occupies 11 logical pixels vertically. The title
// still uses the engine font; there are no image/font files or dependencies.
const GLYPHS={
    'A':'01110 10001 10001 11111 10001 10001 10001',
    'B':'11110 10001 10001 11110 10001 10001 11110',
    'C':'01111 10000 10000 10000 10000 10000 01111',
    'D':'11110 10001 10001 10001 10001 10001 11110',
    'E':'11111 10000 10000 11110 10000 10000 11111',
    'F':'11111 10000 10000 11110 10000 10000 10000',
    'G':'01111 10000 10000 10111 10001 10001 01111',
    'H':'10001 10001 10001 11111 10001 10001 10001',
    'I':'11111 00100 00100 00100 00100 00100 11111',
    'J':'00111 00010 00010 00010 10010 10010 01100',
    'K':'10001 10010 10100 11000 10100 10010 10001',
    'L':'10000 10000 10000 10000 10000 10000 11111',
    'M':'10001 11011 10101 10101 10001 10001 10001',
    'N':'10001 11001 10101 10011 10001 10001 10001',
    'O':'01110 10001 10001 10001 10001 10001 01110',
    'P':'11110 10001 10001 11110 10000 10000 10000',
    'Q':'01110 10001 10001 10001 10101 10010 01101',
    'R':'11110 10001 10001 11110 10100 10010 10001',
    'S':'01111 10000 10000 01110 00001 00001 11110',
    'T':'11111 00100 00100 00100 00100 00100 00100',
    'U':'10001 10001 10001 10001 10001 10001 01110',
    'V':'10001 10001 10001 10001 10001 01010 00100',
    'W':'10001 10001 10001 10101 10101 10101 01010',
    'X':'10001 10001 01010 00100 01010 10001 10001',
    'Y':'10001 10001 01010 00100 00100 00100 00100',
    'Z':'11111 00001 00010 00100 01000 10000 11111',
    '1':'00100 01100 00100 00100 00100 00100 01110',
    '2':'01110 10001 00001 00010 00100 01000 11111',
    ':':'00000 00100 00100 00000 00100 00100 00000',
    '/':'00001 00001 00010 00100 01000 10000 10000',
    '+':'00000 00100 00100 11111 00100 00100 00000',
    '-':'00000 00000 00000 11111 00000 00000 00000'
};
Object.keys(GLYPHS).forEach(letter=>{GLYPHS[letter]=GLYPHS[letter].split(' ');});

function born(screen) {
    write_local(screen,'view',0);
    write_local(screen,'tab',0);
    write_local(screen,'age',0);
    write_local(screen,'press_1',-1);
    write_local(screen,'press_2',-1);
    write_local(screen,'action_1',false);
    write_local(screen,'action_2',false);
}
function action(screen) {
    // Both paths request session shutdown. The host owns its window/process.
    if(input_pressed(system(),NAV.exit) || input_pressed(system(),NAV.start)) {
        exit();
        return;
    }
    let view=read_local(screen,'view');
    if(input_pressed(system(),NAV.select)) {
        view=1-view;
        write_local(screen,'view',view);
    }
    const dt=delta();
    let tab=read_local(screen,'tab');
    tab+=Math.max(-dt*7,Math.min(dt*7,view-tab));
    write_local(screen,'tab',tab);
    write_local(screen,'age',Math.min(1,read_local(screen,'age')+dt));
    for(let index=1;index<=2;index++) {
        let pressed=-1;
        DIRECTIONS.forEach((dir,i)=>{ if(input_down(player(index),MOVE,dir)) pressed=i; });
        write_local(screen,'press_'+index,pressed);
        write_local(screen,'action_'+index,input_down(player(index),ACTION));
    }
}
function rect(x,y,w,h,color) {
    const left=Math.round(x),right=Math.round(x+w)-1;
    for(let row=Math.round(y);row<Math.round(y+h);row++) {
        if(left===right) draw_pixel(left,row,color);
        else draw_line(left,row,right+1,row,color);
    }
}
function frame(x,y,w,h,color) {
    draw_line(x,y,x+w-1,y,color); draw_line(x,y+h-1,x+w-1,y+h-1,color);
    draw_line(x,y,x,y+h-1,color); draw_line(x+w-1,y,x+w-1,y+h-1,color);
}
function text(x,y,label,color,size) {
    color=color||UI.white;
    if(size>=16) { draw_text(x,y,label,size,color); return; }
    const left=Math.round(x-(label.length*6-1)/2),top=Math.round(y-5.5);
    for(let letter=0;letter<label.length;letter++) {
        const glyph=GLYPHS[label[letter]];
        if(!glyph) continue;
        glyph.forEach((row,line)=>{
            let start=-1;
            for(let column=0;column<=5;column++) {
                if(column<5 && row[column]==='1') { if(start<0) start=column; }
                else if(start>=0) {
                    const y0=Math.round(line*11/7),y1=Math.round((line+1)*11/7);
                    for(let py=y0;py<y1;py++) for(let px=start;px<column;px++)
                        draw_pixel(left+letter*6+px,top+py,color);
                    start=-1;
                }
            }
        });
    }
}
function key(x,y,w,label,active,color) {
    rect(x-w/2,y-8,w,18,UI.edge);
    rect(x-w/2+1,y-8,w-2,15,active?color:UI.key);
    draw_line(x-w/2+2,y-7,x+w/2-3,y-7,active?UI.white:UI.muted);
    if(label) text(x,y-1,label,active?UI.background:UI.white);
}
function arrow(x,y,dir,color) {
    // A 7px filled arrow, drawn independently of the text font.
    for(let row=0;row<4;row++) {
        for(let col=-row;col<=row;col++) {
            let dx=col,dy=row-3;
            if(dir===LEFT) { dx=row-3;dy=col; }
            if(dir===DOWN) { dx=col;dy=3-row; }
            if(dir===RIGHT) { dx=3-row;dy=col; }
            draw_pixel(x+dx,y+dy,color);
        }
    }
}
function keyboard(screen,index,left) {
    const color=index===1?UI.gold:UI.cyan;
    const pressed=read_local(screen,'press_'+index);
    const letters=index===1?['','','','']:['W','A','S','D'];
    const positions=[[left+37,74],[left+17,94],[left+37,94],[left+57,94]];
    positions.forEach((p,i)=>{
        key(p[0],p[1],18,letters[i],pressed===i,color);
        if(index===1) arrow(p[0],p[1]-1,DIRECTIONS[i],pressed===i?UI.background:UI.white);
    });
    text(left+109,71,'ACTION',UI.muted);
    key(left+109,92,index===1?74:66,index===1?'RIGHT CTRL':'SPACE',read_local(screen,'action_'+index),color);
}
function pad_button(x,y,active,color) {
    rect(x-7,y-9,14,18,UI.background);
    rect(x-9,y-7,18,14,UI.background);
    rect(x-6,y-7,12,14,active?color:UI.red);
    rect(x-7,y-5,14,10,active?color:UI.red);
    draw_line(x-4,y-6,x+3,y-6,UI.white);
    text(x,y,'A',UI.background);
}
function gamepad(screen,index,left) {
    const color=index===1?UI.gold:UI.cyan;
    // Stepped shell, inset faceplate, cable, seams and indicator stripe.
    rect(left+10,65,132,35,UI.edge);
    rect(left+14,61,124,43,UI.edge);
    rect(left+15,64,122,36,'#afbdc9');
    rect(left+11,68,130,29,'#afbdc9');
    rect(left+19,68,114,26,'#4a5d70');
    rect(left+62,59,19,4,UI.edge);
    draw_line(left+72,56,left+72,60,UI.muted);
    rect(left+91,65,38,2,color);
    const x=left+36,y=82;
    rect(x-5,y-14,11,29,UI.background);
    rect(x-14,y-5,29,11,UI.background);
    const pressed=read_local(screen,'press_'+index);
    const places=[[x,y-9],[x-9,y],[x,y+9],[x+9,y]];
    places.forEach((p,i)=>{
        if(pressed===i) rect(p[0]-3,p[1]-3,7,7,color);
        arrow(p[0],p[1],DIRECTIONS[i],pressed===i?UI.background:UI.muted);
    });
    rect(x-2,y-2,5,5,UI.edge);
    pad_button(left+119,81,read_local(screen,'action_'+index),color);
    if(index===1) {
        rect(left+65,87,15,5,UI.background);
        rect(left+85,87,15,5,UI.background);
        text(left+83,107,'SELECT / START',UI.muted);
    } else text(left+83,107,'A: ACTION',UI.muted);
}
function draw(screen) {
    const view=read_local(screen,'view');
    const tab=read_local(screen,'tab');
    const age=read_local(screen,'age');
    // A restrained title entrance; interaction is available immediately.
    text(160,12-Math.round(3*Math.max(0,1-age*5)),'HOW TO PLAY',UI.white,16);
    draw_line(9,17,41,17,UI.gold); draw_line(279,17,310,17,UI.cyan);
    rect(60,24,90,16,view===0?UI.key:UI.background);
    rect(172,24,90,16,view===1?UI.key:UI.background);
    text(105,32,'KEYBOARD',view===0?UI.gold:UI.muted);
    text(217,32,'GAMEPAD',view===1?UI.cyan:UI.muted);
    const marker=Math.round(70+112*tab);
    rect(marker,40,70,1,view===0?UI.gold:UI.cyan);
    for(let index=1;index<=2;index++) {
        const left=index===1?5:165, color=index===1?UI.gold:UI.cyan;
        rect(left,44,150,70,UI.panel);
        frame(left,44,150,70,UI.edge);
        rect(left+1,45,2,12,color);
        text(left+75,52,'PLAYER '+index+(view===1?'  JOY'+index:''),color);
        if(view===0) keyboard(screen,index,left);
        else gamepad(screen,index,left);
    }
    text(80,122,'P1: HUB + GAMES',UI.gold);
    text(240,122,'P2: SUPPORTED GAMES',UI.cyan);
    draw_line(9,130,310,130,UI.edge);
    text(80,140,view===0?'ENTER: CONTINUE':'START: CONTINUE');
    text(240,140,view===0?'SHIFT L/R: VIEW':'SELECT: VIEW');
    text(160,155,'ESC / LEFT ALT+Q: BACK',UI.muted);
    text(160,173,'PRESS A CONTROL TO TRY IT',UI.muted);
}

