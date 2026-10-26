/// <reference path="https://flxforge.github.io/FLXEngine/scripts/flx.d.ts" />

// Coordinates traced from the official 1285 x 491 reference, not a font.
// Rectangles and the two diagonal polygons remain reusable in draw_brand().
const BRAND = [
    [[38,76],[189,76],[189,114],[38,114]],
    [[38,151],[151,151],[151,189],[76,189],[76,227],[189,227],[189,265],[38,265]],
    [[227,151],[302,151],[302,189],[227,189]],
    [[325,91],[348,61],[416,112],[484,61],[507,91],[416,159]],
    [[340,151],[378,151],[378,265],[340,265]],
    [[454,151],[492,151],[492,265],[454,265]],
    [[529,76],[680,76],[680,114],[529,114]],
    [[529,151],[643,151],[643,189],[567,189],[567,227],[680,227],[680,265],[529,265]],
    [[718,76],[869,76],[869,189],[806,189],[861,230],[839,261],[756,199],[756,265],[718,265],[718,151],[831,151],[831,114],[718,114]],
    [[907,76],[1020,76],[1020,114],[945,114],[945,227],[907,227]],
    [[982,151],[1058,151],[1058,265],[945,265],[945,227],[1020,227],[1020,189],[982,189]],
    [[1096,76],[1247,76],[1247,114],[1096,114]],
    [[1096,151],[1210,151],[1210,189],[1134,189],[1134,227],[1247,227],[1247,265],[1096,265]]
];
const DESCRIPTOR = [
    ['0011111','0110000','1100000','1100111','1100011','0110011','0011111'],
    ['0011100','0110110','1100011','1100011','1111111','1100011','1100011'],
    ['1100011','1110111','1111111','1101011','1101011','1100011','1100011'],
    ['1111111','1100000','1100000','1111110','1100000','1100000','1111111'],
    ['0111110','1100011','1100000','0111110','0000011','1100011','0111110']
];
// Four genuine Conway glider generations; no random state or simulation.
const CELLS = [
    [[1,0],[2,1],[0,2],[1,2],[2,2]],
    [[0,1],[2,1],[1,2],[2,2],[1,3]],
    [[2,1],[0,2],[2,2],[1,3],[2,3]],
    [[1,1],[2,2],[3,2],[1,3],[2,3]]
];
const VIEW = { width:640, height:480, scale:0.47, x:642.5, y:245.5 };
function clamp01(value) { return Math.max(0, Math.min(1, value)); }
function smooth(value) { value=clamp01(value); return value*value*(3-2*value); }
function grey(value) {
    const hex=Math.round(Math.max(0,Math.min(255,value))).toString(16).padStart(2,'0');
    return '#'+hex+hex+hex;
}
function camera(time) {
    const u=smooth((time-0.9)/2.45);
    return { scale:VIEW.scale*Math.pow(18,1-u), x:110+(VIEW.x-110)*u, y:170+(VIEW.y-170)*u };
}
function screen(point, view) {
    return [320+(point[0]-view.x)*view.scale,240+(point[1]-view.y)*view.scale];
}
// Public draw_line is an outline primitive. Horizontal spans fill our polygons
// without inventing a fill API or allocating an object for every brand cell.
function fill_polygon(points, color, view) {
    const polygon=points.map(point=>screen(point,view));
    const first=Math.max(0,Math.ceil(Math.min(...polygon.map(p=>p[1]))-0.5));
    const last=Math.min(479,Math.ceil(Math.max(...polygon.map(p=>p[1]))-0.5)-1);
    for (let y=first;y<=last;y++) {
        const hits=[];
        for (let i=0;i<polygon.length;i++) {
            const a=polygon[i], b=polygon[(i+1)%polygon.length], scan=y+0.5;
            if ((a[1]<=scan && b[1]>scan)||(b[1]<=scan && a[1]>scan))
                hits.push(a[0]+(scan-a[1])*(b[0]-a[0])/(b[1]-a[1]));
        }
        hits.sort((a,b)=>a-b);
        for(let i=0;i+1<hits.length;i+=2) {
            const left=Math.max(0,Math.ceil(hits[i]-0.5));
            const right=Math.min(639,Math.ceil(hits[i+1]-0.5)-1);
            if(right>=left) draw_line(left,y,right,y,color);
        }
    }
}
function rectangle(x,y,w,h,color,view) {
    fill_polygon([[x,y],[x+w,y],[x+w,y+h],[x,y+h]],color,view);
}
function draw_brand(view) { BRAND.forEach(polygon=>fill_polygon(polygon,'#000000',view)); }
function draw_descriptor(view,color) {
    DESCRIPTOR.forEach((rows,letter)=>rows.forEach((row,y)=>{
        // Merge adjacent pixels into one filled rectangle per run.
        let start=-1;
        for(let x=0;x<=7;x++) {
            if(x<7 && row[x]==='1') { if(start<0) start=x; }
            else if(start>=0) {
                rectangle(718+letter*108.5+start*13.5,340+y*16.2,(x-start)*13.5,16.2,color,view);
                start=-1;
            }
        }
    }));
}
function draw_grid(view,time) {
    const fade=smooth((time-2.9)/0.75);
    if(fade>=1) return;
    const fine=19*view.scale;
    // Every fourth line belongs to the next scale. Its position never changes
    // when the fine lines fade: all levels share one world-space origin.
    const origin=screen([38,76],view);
    for(let level=0;level<3;level++) {
        const spacing=fine*Math.pow(4,level);
        const opacity=(1-fade)*(level===0?clamp01((spacing-5)/7):0.65);
        if(opacity<=0 || spacing<5) continue;
        const color=grey(255-48*opacity);
        for(let i=Math.ceil(-origin[0]/spacing);origin[0]+i*spacing<640;i++) {
            if(level<2 && i%4===0) continue;
            const x=origin[0]+i*spacing;
            draw_line(x,0,x,479,color);
        }
        for(let i=Math.ceil(-origin[1]/spacing);origin[1]+i*spacing<480;i++) {
            if(level<2 && i%4===0) continue;
            const y=origin[1]+i*spacing;
            draw_line(0,y,639,y,color);
        }
    }
}
function draw(identity) {
    const time=read_local(identity,'elapsed') || 0;
    const view=camera(time);
    if(time>=0.9) draw_brand(view);
    if(time>=0.9 && time<3.65) {
        // Aligned white cells open the solid shapes, then complete them in a
        // deterministic sequence; there is no raster logo hidden underneath.
        const reveal=smooth((time-1.0)/2.25);
        const left=0, top=38, cell=19;
        for(let y=0;y<13;y++) for(let x=0;x<67;x++) {
            const rank=((x*37+y*17)%101)/101;
            if(rank>reveal) rectangle(left+x*cell,top+y*cell,cell,cell,'white',view);
        }
        // A handful of late vacancies visibly click into the final form.
        if(time>3.1) [[57,7],[7,10],[28,7]].forEach((p,i)=>{
            if(time<3.32+i*0.12) rectangle(p[0]*cell,38+p[1]*cell,cell,cell,'white',view);
        });
    }
    if(time<1.9) {
        const step=Math.min(3,Math.floor(time/0.23));
        CELLS[step].forEach(p=>rectangle(76+p[0]*19,133+p[1]*19,19,19,grey(255*smooth((time-1.2)/0.7)),view));
    }
    draw_grid(view,time);
    if(time>=3.75) {
        const phase=Math.floor((time-3.75)/0.12);
        draw_descriptor(view,time>=4.47?'#ff0000':['#ff0000','#00b43c','#005bff'][phase%3]);
    }
}
