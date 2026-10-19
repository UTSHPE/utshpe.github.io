/*
 * The hero mural ("Greetings from UT SHPE" with a painted scene inside each letter,
 * the UT Tower, the ribbon banner and the drifting clouds), ported verbatim from
 * design/pages/desktop/Home.html by design/port-mural.mjs. Do not edit by hand.
 *
 * buildMural(svg, cloudLayer) fills <svg id="gs"> and <div class="cl">. Call it after
 * the Anton, Chango and Mr Dafoe fonts have loaded (it measures the letters).
 */
var NS='http://www.w3.org/2000/svg';
function mk(t,a,p){var e=document.createElementNS(NS,t);for(var k in a)e.setAttribute(k,a[k]);if(p)p.appendChild(e);return e}
function rnd(s){var x=Math.sin(s*127.1+311.7)*43758.5453;return x-Math.floor(x)}
var BAT='M-22 0Q-12 -11 0 -2Q12 -11 22 0Q12 -4 0 9Q-12 -4 -22 0Z';

/* ---------- postcard scenes ---------- */
var SCENES=[
  function(g,w,h){mk('rect',{width:w,height:h,fill:'#2F6FA0'},g);mk('rect',{y:h*.34,width:w,height:h*.3,fill:'#F2A56B'},g);mk('rect',{y:h*.5,width:w,height:h*.22,fill:'#EC7C50'},g);mk('circle',{cx:w*.5,cy:h*.52,r:w*.26,fill:'#FFD9A8'},g);mk('rect',{y:h*.74,width:w,height:h*.3,fill:'#1D5C8C'},g);
    for(var i=0;i<5;i++)mk('rect',{x:w*(.08+rnd(i)*.6),y:h*(.78+i*.036),width:w*.3,height:3,rx:2,fill:'#F2A56B',opacity:.7},g);
    mk('rect',{y:h*.6,width:w,height:h*.05,fill:'#1D2B4D'},g);
    for(var k=0;k<3;k++){var x=k*w/3;mk('path',{d:'M'+x+' '+h*.74+'Q'+(x+w/6)+' '+h*.58+' '+(x+w/3)+' '+h*.74,fill:'none',stroke:'#1D2B4D','stroke-width':10},g)}
    for(var p=0;p<=3;p++)mk('rect',{x:p*w/3-5,y:h*.6,width:10,height:h*.15,fill:'#1D2B4D'},g);
    [[.2,.2,1.1],[.42,.1,.9],[.66,.22,1.2],[.82,.1,.8],[.5,.34,.9],[.25,.4,.7]].forEach(function(b){mk('path',{d:BAT,transform:'translate('+w*b[0]+' '+h*b[1]+') scale('+b[2]*1.5+')',fill:'#0F1D3B'},g)});},
  function(g,w,h){mk('rect',{width:w,height:h,fill:'#BFE0EC'},g);mk('circle',{cx:w*.72,cy:h*.22,r:w*.12,fill:'#FFF3D9'},g);
    [[.04,.2,.26,'#F3F6FA'],[.22,.1,.36,'#F26838'],[.36,.2,.3,'#E3EAF2'],[.52,.16,.5,'#fff'],[.68,.2,.34,'#1272B8'],[.82,.16,.42,'#F3F6FA']].forEach(function(b){
      var bh=b[2]*h,by=h*.76-bh,bw=b[1]*w;mk('rect',{x:b[0]*w,y:by,width:bw,height:bh,fill:b[3]},g);
      for(var y=by+10;y<h*.74;y+=18)for(var x=b[0]*w+6;x<b[0]*w+bw-8;x+=14)mk('rect',{x:x,y:y,width:6,height:8,fill:'#16316B',opacity:.5},g)});
    mk('rect',{y:h*.76,width:w,height:h*.3,fill:'#1272B8'},g);
    for(var i=0;i<5;i++)mk('rect',{x:w*(.1+rnd(i+3)*.5),y:h*(.8+i*.035),width:w*.3,height:3,rx:2,fill:'#fff',opacity:.4},g);},
  function(g,w,h){mk('rect',{width:w,height:h,fill:'#CFE6EF'},g);mk('circle',{cx:w*.8,cy:h*.18,r:w*.1,fill:'#FFF3D9'},g);
    mk('polygon',{points:[w*.44,h*.52,w*.56,h*.52,w*.62,h*.9,w*.38,h*.9].join(' '),fill:'#0C2756'},g);
    mk('path',{d:'M'+w*.5+' '+h*.6+'L'+w*.2+' '+h*.42+'M'+w*.5+' '+h*.6+'L'+w*.8+' '+h*.4,stroke:'#0C2756','stroke-width':12,fill:'none','stroke-linecap':'round'},g);
    [[.5,.34,.26,'#16316B'],[.28,.42,.2,'#1B5C95'],[.72,.42,.21,'#1272B8'],[.4,.24,.17,'#2A78B0'],[.62,.26,.18,'#16316B'],[.5,.48,.2,'#1B5C95'],[.2,.52,.14,'#16316B'],[.82,.52,.14,'#1B5C95']].forEach(function(c){mk('circle',{cx:w*c[0],cy:h*c[1],r:w*c[2]*.9,fill:c[3]},g)});
    mk('rect',{y:h*.86,width:w,height:h*.2,fill:'#2A6FA8'},g);
    for(var i=0;i<60;i++)mk('circle',{cx:rnd(i)*w,cy:h*(.84+rnd(i+90)*.16),r:2.5+rnd(i+30)*4,fill:['#3B7FD8','#9CC3F0','#fff','#2D5FB5'][i%4]},g);},
  function(g,w,h){mk('rect',{width:w,height:h,fill:'#CFE6EF'},g);mk('rect',{x:w*.08,y:h*.1,width:6,height:h*.8,fill:'#0C2756'},g);
    var fx=w*.08+6,fw=w*.8,fy=h*.16,fh=h*.4;
    mk('rect',{x:fx,y:fy,width:fw*.34,height:fh,fill:'#1A3F8A'},g);mk('rect',{x:fx+fw*.34,y:fy,width:fw*.66,height:fh*.5,fill:'#fff'},g);mk('rect',{x:fx+fw*.34,y:fy+fh*.5,width:fw*.66,height:fh*.5,fill:'#D33E26'},g);
    var sx=fx+fw*.17,sy=fy+fh*.5,R=fw*.1,pts=[];for(var i=0;i<10;i++){var r=i%2?R*.42:R,a=-Math.PI/2+i*Math.PI/5;pts.push((sx+Math.cos(a)*r)+','+(sy+Math.sin(a)*r))}
    mk('polygon',{points:pts.join(' '),fill:'#fff'},g);mk('rect',{y:h*.86,width:w,height:h*.2,fill:'#2A6FA8'},g);mk('ellipse',{cx:w*.5,cy:h*.9,rx:w*.4,ry:h*.05,fill:'#1B5C95'},g);},
  function(g,w,h){mk('rect',{width:w,height:h,fill:'#16316B'},g);mk('path',{d:'M0 '+h*.14+'Q'+w*.5+' '+h*.28+' '+w+' '+h*.12,stroke:'#0A1A3C','stroke-width':3,fill:'none'},g);
    for(var l=0;l<9;l++){var t=l/8,x=t*w,y=h*(.14+Math.sin(t*Math.PI)*.12-t*.02);mk('circle',{cx:x,cy:y,r:w*.06,fill:'#FFC37A',opacity:.28},g);mk('circle',{cx:x,cy:y,r:5,fill:'#FFE4B0'},g)}
    for(var s=0;s<3;s++)mk('path',{d:'M'+w*(.34+s*.16)+' '+h*.55+'C'+w*(.2+s*.2)+' '+h*.44+' '+w*(.5+s*.1)+' '+h*.36+' '+w*(.34+s*.18)+' '+h*.22,stroke:'#fff','stroke-width':14,fill:'none',opacity:.2,'stroke-linecap':'round'},g);
    mk('rect',{x:w*.16,y:h*.64,width:w*.68,height:h*.2,fill:'#202637'},g);mk('rect',{x:w*.2,y:h*.84,width:w*.04,height:h*.14,fill:'#202637'},g);mk('rect',{x:w*.76,y:h*.84,width:w*.04,height:h*.14,fill:'#202637'},g);
    for(var f=0;f<6;f++){var fx=w*(.24+f*.1);mk('path',{d:'M'+fx+' '+h*.64+'C'+(fx-12)+' '+h*.58+' '+(fx+8)+' '+h*.54+' '+fx+' '+h*.46+'C'+(fx+14)+' '+h*.54+' '+(fx+16)+' '+h*.6+' '+fx+' '+h*.64+'Z',fill:f%2?'#FF7A2E':'#FFB347'},g)}
    for(var m=0;m<3;m++)mk('ellipse',{cx:w*(.3+m*.2),cy:h*.625,rx:w*.08,ry:h*.022,fill:'#7B2E1B'},g);},
  function(g,w,h){mk('rect',{width:w,height:h,fill:'#F6C79A'},g);
    for(var r=0;r<14;r++){var a=r*Math.PI/7;mk('polygon',{points:[w*.5,h*.46,w*.5+Math.cos(a)*w*2,h*.46+Math.sin(a)*w*2,w*.5+Math.cos(a+.2)*w*2,h*.46+Math.sin(a+.2)*w*2].join(' '),fill:'#FFE8CC',opacity:.45},g)}
    mk('circle',{cx:w*.2,cy:h*.5,r:w*.24,fill:'#fff'},g);mk('image',{href:'/assets/images/redesign/shpe-symbol.png',x:0,y:h*.5-w*.2,width:w*.4,height:w*.4},g);mk('rect',{y:h*.9,width:w,height:h*.2,fill:'#2A6FA8'},g);}
];
function cloud(g,x,y,s){mk('ellipse',{cx:x,cy:y,rx:150*s,ry:30*s,fill:'#fff',opacity:.92},g);mk('ellipse',{cx:x+50*s,cy:y-22*s,rx:90*s,ry:28*s,fill:'#fff',opacity:.95},g);mk('ellipse',{cx:x-60*s,cy:y-12*s,rx:70*s,ry:22*s,fill:'#fff',opacity:.95},g)}
function tower(svg){
  var T=mk('g',{transform:'translate(40 370) scale(.8)',filter:'url(#wob)'},svg),ST='#F2E6D0',SH='#DCCCAE',DK='#8E7E66',OR='#D8541F',OD='#B8431A',NV='#16316B';
  function R(x,y,w,hh,c,tr){var e=mk('rect',{x:x,y:y,width:w,height:hh,fill:c},T);if(tr)e.setAttribute('transform',tr);return e}
  [[0,420,80,30,NV],[214,424,84,34,NV],[90,430,60,24,'#1B5C95'],[168,430,64,26,'#1B5C95']].forEach(function(b){mk('ellipse',{cx:b[0],cy:b[1],rx:b[2],ry:b[3],fill:b[4]},T)});
  /* steps */
  R(24,424,172,10,SH);R(36,414,148,10,'#E3D5BA');
  /* the Main Building: wide base with a red tile roof */
  R(-18,336,256,80,ST);R(190,336,48,80,SH);
  R(-26,322,272,18,OD);R(-26,322,272,8,OR);
  for(var i=0;i<15;i++)R(-14+i*17,344,8,10,SH);
  for(var w=0;w<7;w++)R(-4+w*36,362,16,28,DK,'rotate('+((w%3)-1)*1.4+' '+(4+w*36)+' 376)');
  for(var a=0;a<5;a++){mk('path',{d:'M'+(8+a*48)+' 416V398a14 14 0 0 1 28 0V416Z',fill:DK},T)}
  /* podium under the shaft */
  R(40,262,140,64,ST);R(140,262,40,64,SH);R(34,256,152,10,SH);
  for(var c=0;c<4;c++)R(54+c*30,278,12,24,DK,'rotate('+((c%2)?1.4:-1.4)+' '+(60+c*30)+' 290)');
  /* the tall limestone shaft */
  R(76,56,68,208,ST);R(120,56,24,208,SH);
  for(var s=0;s<3;s++){var sx=92+s*14;R(sx,84,7,170,DK);mk('line',{x1:sx+3.5,y1:90,x2:sx+3.5,y2:250,stroke:OR,'stroke-width':4,'stroke-dasharray':'5 10'},T)}
  R(70,70,80,10,SH);R(72,60,76,8,ST);
  /* clock stage */
  R(84,12,52,48,ST);R(118,12,18,48,SH);R(80,6,60,8,SH);
  mk('circle',{cx:108,cy:36,r:15,fill:'#fff',stroke:NV,'stroke-width':4},T);mk('path',{d:'M108 36V26M108 36l7 4',stroke:NV,'stroke-width':3,fill:'none','stroke-linecap':'round'},T);
  /* open belfry with columns */
  R(88,-34,44,42,ST);R(118,-34,14,42,SH);R(84,-40,52,8,SH);
  for(var k=0;k<4;k++)R(93+k*10,-26,5,28,DK);
  /* lantern and spire */
  R(96,-66,28,28,ST);R(112,-66,12,28,SH);R(92,-70,36,6,SH);
  for(var l=0;l<3;l++)R(101+l*8,-60,4,16,DK);
  mk('polygon',{points:'92,-70 128,-70 110,-94',fill:OR},T);mk('polygon',{points:'110,-94 128,-70 118,-70',fill:OD},T);
  R(108.5,-124,3,32,'#7A4A2A');
}
function build(svg,cl){
  var defs=mk('defs',{},svg);
  
  /* clouds live in their own layer behind the lettering and drift to the right, two tiles so the loop is seamless */
  var cs=mk('svg',{viewBox:'0 0 2800 740',preserveAspectRatio:'none','aria-hidden':'true'},cl);
  [0,1400].forEach(function(dx){var g=mk('g',{transform:'translate('+dx+' 0)',filter:'url(#wob)'},cs);
    cloud(g,780,70,1);cloud(g,1180,120,.9);cloud(g,1240,280,.85);cloud(g,640,230,.7);cloud(g,420,700,.9);cloud(g,900,704,1.1)});
  mk('rect',{y:708,width:1400,height:40,fill:'#2A6FA8'},svg);
  var FS=430,LET=['U','T','S','H','P','E'],meas=mk('g',{visibility:'hidden'},svg),W=[];
  LET.forEach(function(l){var t=mk('text',{'font-family':'Anton, Impact, sans-serif','font-size':FS},meas);t.textContent=l;W.push(t.getBBox().width)});
  svg.removeChild(meas);
  var gap=16,spaceW=FS*.2,total=W.reduce(function(a,b){return a+b},0)+gap*5+spaceW,TW=1100,sc=TW/total,x0=232,base=604,ARCH=44,capTop=-FS*.735,capBot=FS*.012,x=x0;
  LET.forEach(function(l,i){
    var w=W[i],xs=x,xc=xs+w*sc/2,t=(xc-x0)/TW,u=2*t-1,dy=-ARCH*(1-u*u),ang=Math.atan(ARCH*4*u/TW)*180/Math.PI,sv=.95+.12*(1-Math.abs(u));
    x+=(w+gap)*sc;if(i===1)x+=spaceW*sc;
    var tid='L'+i,txt=mk('text',{id:tid,'font-family':'Anton, Impact, sans-serif','font-size':FS,x:0,y:0},defs);txt.textContent=l;
    var G=mk('g',{'class':'lt','data-i':i,transform:'translate('+xc+' '+(base+dy)+') rotate('+ang.toFixed(2)+') scale('+(sc*sv).toFixed(4)+') translate('+(-w/2)+' 0)'},svg);
    for(var k=30;k>=1;k--){var e=mk('use',{href:'#'+tid,x:k*.6,y:k*.92,fill:'#D33E26'},G);if(k===30){e.setAttribute('stroke','#0A2350');e.setAttribute('stroke-width','12');e.setAttribute('stroke-linejoin','round')}}
    mk('use',{href:'#'+tid,fill:'#fff',stroke:'#0A2350','stroke-width':7,'stroke-linejoin':'round'},G);
    var m=mk('mask',{id:'m'+i,maskUnits:'userSpaceOnUse',x:-40,y:capTop-40,width:w+80,height:FS+80},G);
    mk('use',{href:'#'+tid,fill:'#fff',stroke:'#000','stroke-width':16,'stroke-linejoin':'round'},m);
    var sg=mk('g',{mask:'url(#m'+i+')'},G),sc2=mk('g',{transform:'translate(-6 '+(capTop-4)+')',filter:'url(#wob)'},sg);
    SCENES[i](sc2,w+12,(capBot-capTop)+10);
    mk('use',{href:'#'+tid,fill:'none',stroke:'#0A2350','stroke-width':6,'stroke-linejoin':'round'},G);
  });
  tower(svg);
  /* the banner, lower and to the left, clear of the letters */
  var rb=mk('g',{transform:'translate(44 104) rotate(-3.5) scale(.92)'},svg);
  mk('polygon',{points:'0,26 60,26 60,96 0,96 26,61',fill:'#B8431A',stroke:'#0A2350','stroke-width':3,'stroke-linejoin':'round'},rb);
  mk('polygon',{points:'548,26 488,26 488,96 548,96 522,61',fill:'#B8431A',stroke:'#0A2350','stroke-width':3,'stroke-linejoin':'round'},rb);
  mk('rect',{x:52,y:10,width:444,height:88,rx:6,fill:'#F7A672',stroke:'#0A2350','stroke-width':3.5},rb);
  mk('polygon',{points:'52,98 78,112 78,98',fill:'#7A1E12'},rb);mk('polygon',{points:'496,98 470,112 470,98',fill:'#7A1E12'},rb);
  var rt=mk('text',{x:274,y:70,'text-anchor':'middle','font-family':'Chango, serif','font-size':38,fill:'#7A1E12',textLength:372,lengthAdjust:'spacingAndGlyphs'},rb);rt.textContent='GREETINGS FROM';
  var sc3=mk('text',{x:1352,y:700,'text-anchor':'end','font-family':'Mr Dafoe, cursive','font-size':58,fill:'#fff',stroke:'#0A2350','stroke-width':3,'paint-order':'stroke fill',transform:'rotate(-3 1352 700)'},svg);sc3.textContent='Austin, Texas';
}


export function buildMural(svg, cloudLayer) {
  build(svg, cloudLayer);
}
