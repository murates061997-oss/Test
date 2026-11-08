/* ---------- VERESİYE VİDEOSU: ek objeler ---------- */
const WOOD='#b9824f',WOOD2='#8b5e3c',BLUE='#4d7cfe',PAGE='#fffaf0';
function xMark(x,y,sz,k){if(k<=0)return;ctx.save();ctx.translate(x,y);ctx.scale(k,k);ctx.lineCap='round';
  for(const [w,c] of [[sz*.22,INK],[sz*.14,RED]]){ctx.strokeStyle=c;ctx.lineWidth=w;ctx.beginPath();ctx.moveTo(-sz/2,-sz/2);ctx.lineTo(sz/2,sz/2);ctx.moveTo(sz/2,-sz/2);ctx.lineTo(-sz/2,sz/2);ctx.stroke();}ctx.restore();}
function check(x,y,sz,k){if(k<=0)return;ctx.save();ctx.translate(x,y);ctx.scale(k,k);ctx.lineCap='round';ctx.lineJoin='round';
  for(const [w,c] of [[sz*.24,INK],[sz*.15,GREEN]]){ctx.strokeStyle=c;ctx.lineWidth=w;ctx.beginPath();ctx.moveTo(-sz*.45,0);ctx.lineTo(-sz*.1,sz*.35);ctx.lineTo(sz*.5,-sz*.4);ctx.stroke();}ctx.restore();}
function heart(x,y,r,k=1,col=RED){if(k<=0)return;ctx.save();ctx.translate(x,y);ctx.scale(k,k);ctx.beginPath();ctx.moveTo(0,r*.9);
  ctx.bezierCurveTo(-r*1.6,-r*.1,-r*.8,-r*1.3,0,-r*.45);ctx.bezierCurveTo(r*.8,-r*1.3,r*1.6,-r*.1,0,r*.9);ctx.closePath();
  ctx.fillStyle=col;ctx.fill();ctx.strokeStyle=INK;ctx.lineWidth=Math.max(5,r*.16);ctx.stroke();
  ctx.fillStyle='rgba(255,255,255,.55)';ctx.beginPath();ctx.arc(-r*.45,-r*.45,r*.18,0,Math.PI*2);ctx.fill();ctx.restore();}
function creditCard(x,y,s,rot=0){ctx.save();ctx.translate(x,y);ctx.rotate(rot);ctx.strokeStyle=INK;ctx.lineWidth=11*s;
  rr(-240*s,-150*s,480*s,300*s,30*s);const g=ctx.createLinearGradient(-240*s,-150*s,240*s,150*s);g.addColorStop(0,'#5b8def');g.addColorStop(1,'#2c4fae');ctx.fillStyle=g;ctx.fill();ctx.stroke();
  ctx.fillStyle='#f2c14e';ctx.lineWidth=6*s;rr(-180*s,-70*s,90*s,68*s,10*s);ctx.fill();ctx.stroke();ctx.beginPath();ctx.moveTo(-180*s,-36*s);ctx.lineTo(-90*s,-36*s);ctx.moveTo(-135*s,-70*s);ctx.lineTo(-135*s,-2*s);ctx.stroke();
  ctx.fillStyle='#fff';for(let g2=0;g2<4;g2++)for(let i=0;i<4;i++){ctx.beginPath();ctx.arc(-180*s+g2*105*s+i*20*s,55*s,6*s,0,Math.PI*2);ctx.fill();}
  ctx.fillStyle='rgba(255,255,255,.8)';ctx.beginPath();ctx.arc(150*s,-90*s,30*s,0,Math.PI*2);ctx.fill();ctx.fillStyle='rgba(255,210,63,.9)';ctx.beginPath();ctx.arc(185*s,-90*s,30*s,0,Math.PI*2);ctx.fill();ctx.restore();}
function bank(x,gy,s){ctx.save();ctx.strokeStyle=INK;ctx.lineWidth=10*s;ctx.lineJoin='round';const w=520*s,h=420*s,top=gy-h;
  ctx.fillStyle='#e9e4da';ctx.beginPath();ctx.moveTo(x-w/2-30*s,top);ctx.lineTo(x,top-150*s);ctx.lineTo(x+w/2+30*s,top);ctx.closePath();ctx.fill();ctx.stroke();
  rr(x-w/2-30*s,top,w+60*s,36*s,4*s);ctx.fill();ctx.stroke();
  for(let i=0;i<5;i++){const cx=x-w/2+30*s+i*(w-60*s)/4;rr(cx-22*s,top+36*s,44*s,h-80*s,4*s);ctx.fillStyle='#f6f2ea';ctx.fill();ctx.stroke();}
  rr(x-w/2-40*s,gy-44*s,w+80*s,44*s,4*s);ctx.fillStyle='#d8d1c3';ctx.fill();ctx.stroke();
  ctx.fillStyle=INK;ctx.font=`bold ${52*s}px ${FONT}`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('BANKA',x,top-48*s);ctx.restore();}
function shelves(lt){ctx.save();ctx.strokeStyle=INK;ctx.lineWidth=9;
  for(let r=0;r<3;r++){const y=900+r*125;
    for(let i=0;i<9;i++){const x=150+i*92+hs(r*9+i)*10,h=45+hs(r*9+i+50)*40,w=54+hs(r*9+i+90)*18,c=['#e94b4b','#ffd23f','#62b061','#4d7cfe','#ff9a1f','#f4f1ea'][Math.floor(hs(r*9+i+20)*6)];
      if(hs(r*9+i+70)<.4){ctx.fillStyle=c;rr(x-w/2,y-h,w,h,10);ctx.fill();ctx.stroke();ctx.fillStyle='#ccc';rr(x-w/2+6,y-h-14,w-12,16,4);ctx.fill();ctx.stroke();}
      else{ctx.fillStyle=c;rr(x-w/2,y-h,w,h,4);ctx.fill();ctx.stroke();ctx.fillStyle='rgba(255,255,255,.6)';ctx.fillRect(x-w/2+8,y-h*.65,w-16,h*.3);}}
    ctx.fillStyle=WOOD2;rr(120,y,840,20,4);ctx.fill();ctx.stroke();}
  ctx.restore();}
function awning(y,label){ctx.save();ctx.strokeStyle=INK;ctx.lineWidth=10;ctx.fillStyle='#2f5aa8';rr(150,y-140,780,110,14);ctx.fill();ctx.stroke();
  ctx.fillStyle='#fff';ctx.font=`bold 76px ${FONT}`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(label,540,y-82);
  for(let i=0;i<10;i++){ctx.fillStyle=i%2?'#fff':'#e94b4b';ctx.beginPath();const x=60+i*96;ctx.moveTo(x,y);ctx.lineTo(x+96,y);ctx.lineTo(x+96,y+60);ctx.arc(x+48,y+60,48,0,Math.PI);ctx.closePath();ctx.fill();ctx.stroke();}
  ctx.restore();}
function counter(y=1250){ctx.save();ctx.strokeStyle=INK;ctx.lineWidth=11;rr(70,y,940,GY-y+6,10);ctx.fillStyle=WOOD;ctx.fill();ctx.stroke();
  rr(50,y-30,980,40,10);ctx.fillStyle=WOOD2;ctx.fill();ctx.stroke();ctx.lineWidth=7;ctx.strokeStyle='rgba(0,0,0,.35)';
  for(let i=1;i<4;i++)L(70+i*235,y+30,70+i*235,GY-20);ctx.restore();}
function notebook(x,y,s,o={}){ // o: rot, lines:[[metin,tutar]], reveal(0..n), strike(0..1), title, cover
  ctx.save();ctx.translate(x,y);ctx.rotate(o.rot||0);ctx.scale(s,s);ctx.strokeStyle=INK;ctx.lineJoin='round';
  const w=520,h=640;
  if(o.cover){ctx.lineWidth=12;rr(-w/2,-h/2,w,h,22);ctx.fillStyle='#3a6ea5';ctx.fill();ctx.stroke();
    ctx.lineWidth=7;for(let i=0;i<8;i++){ctx.strokeStyle='rgba(255,255,255,.25)';L(-w/2+20,-h/2+60+i*75,w/2-20,-h/2+60+i*75);}ctx.strokeStyle=INK;
    rr(-200,-110,400,170,16);ctx.fillStyle=PAGE;ctx.lineWidth=9;ctx.fill();ctx.stroke();
    ctx.fillStyle=INK;ctx.font=`bold 64px ${FONT}`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('VERESİYE',0,-52);ctx.font=`bold 44px ${FONT}`;ctx.fillText('DEFTERİ',0,12);
    ctx.restore();return;}
  ctx.lineWidth=12;rr(-w/2,-h/2,w,h,16);ctx.fillStyle=PAGE;ctx.fill();ctx.stroke();
  ctx.save();rr(-w/2,-h/2,w,h,16);ctx.clip();ctx.strokeStyle='rgba(77,124,254,.45)';ctx.lineWidth=4;
  for(let i=0;i<10;i++)L(-w/2,-h/2+120+i*52,w/2,-h/2+120+i*52);ctx.strokeStyle='rgba(233,75,75,.6)';L(-w/2+80,-h/2,-w/2+80,h/2);ctx.restore();
  ctx.fillStyle='#ccc';ctx.lineWidth=6;for(let i=0;i<7;i++){ctx.beginPath();ctx.arc(-w/2+60+i*67,-h/2,16,0,Math.PI*2);ctx.fill();ctx.stroke();}
  if(o.title){ctx.fillStyle='#3d3d44';ctx.font=`bold 50px ${FONT}`;ctx.textAlign='left';ctx.textBaseline='alphabetic';ctx.fillText(o.title,-w/2+100,-h/2+100);}
  const lines=o.lines||[],rv=o.reveal===undefined?lines.length:o.reveal;
  ctx.font=`bold 42px ${FONT}`;ctx.textBaseline='alphabetic';
  for(let i=0;i<lines.length;i++){const q=clamp(rv-i);if(q<=0)break;const yy=-h/2+164+i*52;ctx.save();ctx.beginPath();ctx.rect(-w/2+90,yy-50,(w-110)*q,60);ctx.clip();
    ctx.fillStyle='#55555c';ctx.textAlign='left';ctx.fillText(lines[i][0],-w/2+100,yy);ctx.textAlign='right';ctx.fillText(lines[i][1],w/2-30,yy);ctx.restore();}
  if(o.pen!==undefined&&rv<lines.length){const i=Math.floor(rv),q=rv-i,yy=-h/2+164+i*52;pencil(-w/2+100+(w-130)*q,yy-10+Math.sin(q*60)*6,1,-.7);}
  const st=o.strike||0;if(st>0){ctx.strokeStyle=RED;ctx.lineWidth=16;ctx.lineCap='round';ctx.beginPath();const x0=-w/2+60,y0=-h/2+110,x1=w/2-40,y1=-h/2+170+lines.length*52;
    ctx.moveTo(x0,y0);ctx.lineTo(lerp(x0,x1,clamp(st*2)),lerp(y0,y1,clamp(st*2)));if(st>.5){ctx.moveTo(x1,y0);ctx.lineTo(lerp(x1,x0,clamp(st*2-1)),lerp(y0,y1,clamp(st*2-1)));}ctx.stroke();}
  ctx.restore();}
function pencil(x,y,s,rot){ctx.save();ctx.translate(x,y);ctx.rotate(rot);ctx.scale(s,s);ctx.strokeStyle=INK;ctx.lineWidth=7;ctx.lineJoin='round';
  ctx.fillStyle='#ffd23f';rr(0,-14,170,28,4);ctx.fill();ctx.stroke();ctx.fillStyle='#ff9bb0';rr(160,-14,34,28,6);ctx.fill();ctx.stroke();
  ctx.fillStyle='#f3d9b0';ctx.beginPath();ctx.moveTo(0,-14);ctx.lineTo(-40,0);ctx.lineTo(0,14);ctx.closePath();ctx.fill();ctx.stroke();
  ctx.fillStyle=INK;ctx.beginPath();ctx.moveTo(-26,-5);ctx.lineTo(-40,0);ctx.lineTo(-26,5);ctx.closePath();ctx.fill();ctx.restore();}
function milk(x,y,s){ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.strokeStyle=INK;ctx.lineWidth=9;ctx.lineJoin='round';
  ctx.beginPath();ctx.moveTo(-28,-150);ctx.lineTo(28,-150);ctx.lineTo(28,-110);ctx.quadraticCurveTo(62,-80,62,-30);ctx.lineTo(62,60);ctx.lineTo(-62,60);ctx.lineTo(-62,-30);ctx.quadraticCurveTo(-62,-80,-28,-110);ctx.closePath();
  ctx.fillStyle='#fff';ctx.fill();ctx.stroke();ctx.fillStyle='#4d7cfe';rr(-30,-170,60,24,6);ctx.fill();ctx.stroke();
  ctx.fillStyle=BLUE;rr(-50,-20,100,50,8);ctx.fill();ctx.fillStyle='#fff';ctx.font=`bold 34px ${FONT}`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('SÜT',0,6);ctx.restore();}
function gum(x,y,s,rot=0){ctx.save();ctx.translate(x,y);ctx.rotate(rot);ctx.scale(s,s);ctx.strokeStyle=INK;ctx.lineWidth=8;
  rr(-80,-34,160,68,12);ctx.fillStyle='#ff8fb8';ctx.fill();ctx.stroke();ctx.fillStyle='#fff';rr(-60,-18,120,36,8);ctx.fill();
  ctx.fillStyle='#e0457f';ctx.font=`bold 30px ${FONT}`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('SAKIZ',0,2);ctx.restore();}
function bubble(x,y,w,h,tailX,tailY,k){if(k<=0)return;ctx.save();ctx.translate(x,y);ctx.scale(k,k);ctx.strokeStyle=INK;ctx.lineWidth=10;ctx.fillStyle='#fff';ctx.lineJoin='round';
  ctx.beginPath();ctx.moveTo(-w*.1,h/2-5);ctx.lineTo(tailX,tailY);ctx.lineTo(w*.1,h/2-5);ctx.closePath();ctx.fill();ctx.stroke();
  rr(-w/2,-h/2,w,h,h*.4);ctx.fill();ctx.stroke();ctx.beginPath();ctx.moveTo(-w*.1+8,h/2-5);ctx.lineTo(w*.1-8,h/2-5);ctx.strokeStyle='#fff';ctx.lineWidth=12;ctx.stroke();ctx.restore();}
function stamp(x,y,label,k,rot=-.12){if(k<=0)return;ctx.save();ctx.translate(x,y);ctx.rotate(rot);ctx.scale(k,k);ctx.strokeStyle=RED;ctx.lineWidth=12;
  ctx.font=`bold 70px ${FONT}`;const w=ctx.measureText(label).width+70;rr(-w/2,-62,w,124,16);ctx.stroke();ctx.lineWidth=5;rr(-w/2+14,-48,w-28,96,10);ctx.stroke();
  ctx.fillStyle=RED;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(label,0,4);ctx.restore();}
function house(x,gy,w,h,col,roof){ctx.save();ctx.strokeStyle=INK;ctx.lineWidth=9;ctx.lineJoin='round';rr(x-w/2,gy-h,w,h,6);ctx.fillStyle=col;ctx.fill();ctx.stroke();
  ctx.fillStyle=roof;ctx.beginPath();ctx.moveTo(x-w/2-20,gy-h);ctx.lineTo(x,gy-h-w*.45);ctx.lineTo(x+w/2+20,gy-h);ctx.closePath();ctx.fill();ctx.stroke();
  for(let r=0;r<Math.floor(h/120);r++)for(let c=0;c<2;c++){rr(x-w/2+20+c*(w/2-10),gy-h+25+r*120,w/2-50,70,6);ctx.fillStyle='#ffe08a';ctx.fill();ctx.stroke();}ctx.restore();}
function bakkalAmca(x,y,s,o={}){return fig(Object.assign({x,y,s,cap:true,mustache:true,apron:true,face:'happy'},o));}

/* ---------- SAHNELER ---------- */
// 1) Kredi kartı yoktu (0 - 1.85)
function v1(lt){
  bg();ground();
  txt('ESKİDEN',540,380,110,{fill:'#fff',sc:back(p(lt,0,.3))});
  const cp=back(p(lt,.15,.45));if(cp>0){ctx.save();ctx.translate(540,820);ctx.scale(cp,cp);creditCard(0,0,1.15,-.08+Math.sin(lt*3)*.03);ctx.restore();}
  xMark(540,820,420,back(p(lt,1.0,1.25)));
  txt('KREDİ KARTI YOK!',540,520,96,{fill:RED,maxW:940,sc:back(p(lt,1.05,1.35)),rot:-.03});
  shadow(540,GY,70);fig({x:540,y:GY,face:'happy',look:0,armL:[-1.0,-2.2],armR:[1.0,2.2]});
}
// 2) Ama herkesin bir limiti vardı (1.85 - 3.56)
function v2(lt){
  bg();ground();
  txt('AMA HERKESİN',540,380,96,{fill:'#fff',sc:back(p(lt,0,.3))});
  txt('LİMİTİ VARDI!',540,520,120,{fill:YEL,maxW:960,sc:back(p(lt,.55,.85))});
  const X=[230,540,850];
  for(let i=0;i<3;i++){const pp=back(p(lt,.1+i*.1,.4+i*.1));if(pp<=0)continue;ctx.save();ctx.translate(X[i],GY);ctx.scale(pp,pp);
    shadow(0,0,60);const f=fig({x:0,y:-Math.abs(Math.sin(lt*6+i))*25,s:.85,face:'big',hair:i===0,bun:i===1,skirt:i===1,mustache:i===2,armL:[-2.5,-2.9],armR:[.3,.15]});
    const bx=0,by=f.hd[1]-150,fl=eout(p(lt,.6+i*.12,1.3+i*.12));
    ctx.strokeStyle=INK;ctx.lineWidth=8;rr(bx-90,by-24,180,48,24);ctx.fillStyle='#fff';ctx.fill();ctx.stroke();
    ctx.save();rr(bx-90,by-24,180,48,24);ctx.clip();ctx.fillStyle=GREEN;ctx.fillRect(bx-90,by-24,180*fl,48);ctx.restore();rr(bx-90,by-24,180,48,24);ctx.stroke();
    check(bx+125,by,60,back(p(lt,1.2+i*.1,1.45+i*.1)));ctx.restore();}
}
// 3) Hem de bankada değil (3.56 - 4.76)
function v3(lt){
  bg();ground();
  bank(540,GY,1.2);
  xMark(540,1150,520,back(p(lt,.45,.7)));
  txt('BANKADA DEĞİL!',540,420,100,{fill:'#fff',maxW:960,sc:back(p(lt,.05,.35))});
}
// 4) Köşedeki bakkalın tezgâhının altındaki çizgili defter (4.76 - 7.99)
function v4(lt){
  bg('#fbf3e2');shelves(lt);awning(640,'BAKKAL');
  const out=eio(p(lt,1.3,2.0));
  shadow(540,GY,0);bakkalAmca(540,GY-110,1.2,{look:out>0?0:-.4,face:out>.5?'big':'happy',armL:out>0?[-.6,-1.6+out*.4]:[-.3,-.1],armR:out>0?[.6,1.6-out*.4]:[.3,.1]});
  counter();
  if(lt<1.4)txt('KÖŞEDEKİ BAKKAL',540,380,92,{fill:'#fff',maxW:960,sc:back(p(lt,0,.3))});
  if(out>0){const y=lerp(1420,1000,out),s=lerp(.25,1.05,out);ctx.save();ctx.globalAlpha=1;
    for(let i=0;i<10;i++){const a=i/10*Math.PI*2+lt;const r1=330*s+Math.sin(lt*9+i)*14;ctx.strokeStyle=YEL;ctx.lineWidth=12;ctx.lineCap='round';
      if(out>.8){ctx.beginPath();ctx.moveTo(540+Math.cos(a)*r1,y+Math.sin(a)*r1*1.1);ctx.lineTo(540+Math.cos(a)*(r1+50),y+Math.sin(a)*(r1+50)*1.1);ctx.stroke();}}
    ctx.restore();notebook(540,y,s,{cover:true,rot:Math.sin(lt*3)*.03});}
  txt('ÇİZGİLİ DEFTER',540,380,104,{fill:YEL,maxW:960,sc:back(p(lt,2.15,2.45))});
}
// 5) "Babam yazdırır" (7.99 - 9.78)
function v5(lt){
  bg('#fbf3e2');shelves(lt);
  bakkalAmca(760,GY-110,1.2,{look:-1,face:lt>1.1?'big':'happy',armL:lt>1.1?[-2.4,-2.9]:[-.3,-.1],armR:[.4,.2]});
  counter(1250);
  notebook(800,1225,.32,{cover:true,rot:-1.45});
  shadow(320,GY,55);const kf=fig({x:320,y:GY,s:.7,hair:true,face:'big',look:1,armR:[2.2,2.6],armL:[-.3,-.1]});
  bubble(380,560,700,180,-120,140,back(p(lt,.05,.35)));
  txt('BABAM YAZDIRIR!',380,560,74,{plain:true,maxW:620,sc:back(p(lt,.15,.45))});
  check(760,830,110,back(p(lt,1.2,1.5)));
}
// 6) Ne şifre ne kimlik (9.78 - 11.40)
function v6(lt){
  bg();ground();
  const p1=back(p(lt,.05,.35)),p2=back(p(lt,.75,1.05));
  if(p1>0){ctx.save();ctx.translate(540,620);ctx.scale(p1,p1);ctx.strokeStyle=INK;ctx.lineWidth=11;rr(-330,-80,660,160,24);ctx.fillStyle='#fff';ctx.fill();ctx.stroke();
    ctx.fillStyle=INK;for(let i=0;i<6;i++){ctx.beginPath();ctx.arc(-230+i*92,0,22,0,Math.PI*2);ctx.fill();}ctx.restore();
    txt('ŞİFRE',540,430,80,{fill:'#fff',sc:p1});xMark(540,620,240,back(p(lt,.35,.6)));}
  if(p2>0){ctx.save();ctx.translate(540,1060);ctx.rotate(.04);ctx.scale(p2,p2);ctx.strokeStyle=INK;ctx.lineWidth=11;rr(-300,-170,600,340,26);ctx.fillStyle='#e9f1ff';ctx.fill();ctx.stroke();
    ctx.fillStyle='#e94b4b';ctx.save();rr(-300,-170,600,340,26);ctx.clip();ctx.fillRect(-300,-170,600,70);ctx.restore();rr(-300,-170,600,340,26);ctx.stroke();
    ctx.lineWidth=8;rr(-260,-70,170,200,12);ctx.fillStyle='#fff';ctx.fill();ctx.stroke();ctx.beginPath();ctx.arc(-175,-5,42,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.arc(-175,110,70,Math.PI,0);ctx.stroke();
    ctx.strokeStyle='#9a978f';ctx.lineWidth=12;ctx.lineCap='round';for(let i=0;i<4;i++)L(-50,-40+i*50,(i%2?150:240),-40+i*50);ctx.restore();
    txt('KİMLİK',540,830,80,{fill:'#fff',sc:p2});xMark(540,1060,300,back(p(lt,1.05,1.3)));}
}
// 7) Ekmek, süt, gizlice sakız (11.40 - 14.08)
function v7(lt){
  bg('#fbf3e2');shelves(lt);
  const sneak=lt>1.07;const lk=sneak?Math.sin(lt*7)*1.0:1;
  bakkalAmca(800,GY-110,1.2,{look:-1,face:'happy'});
  counter(1250);
  const T=[0,.56,1.07];
  const b1=back(p(lt,T[0],T[0]+.3));if(b1>0){ctx.save();ctx.translate(380,1185);ctx.scale(b1,b1);bread(0,0,240,-.05);ctx.restore();txt('EKMEK',380,1040,64,{fill:'#fff',sc:b1});}
  const b2=back(p(lt,T[1],T[1]+.3));if(b2>0){ctx.save();ctx.translate(620,1160);ctx.scale(b2,b2);milk(0,0,.62);ctx.restore();txt('SÜT',620,990,64,{fill:'#fff',sc:b2});}
  shadow(200,GY,55);const kf=fig({x:200,y:GY,s:.72,hair:true,face:sneak?'think':'happy',look:lk,armR:sneak?[1.7,1.2]:[.4,.2],armL:[-.3,-.1]});
  if(sneak){const g=eout(p(lt,1.3,1.9));gum(lerp(480,kf.hR[0]+20,g),lerp(1215,kf.hR[1]-10,g),.7*back(p(lt,T[2],T[2]+.3)),g*.6);
    txt('ŞŞŞT!',200,880,84,{fill:'#ff8fb8',sc:back(p(lt,1.25,1.5)),rot:-.08});
    txt('GİZLİCE SAKIZ',540,420,96,{fill:YEL,maxW:960,sc:back(p(lt,1.1,1.4))});}
}
// 8) Hepsi kurşun kalemle yazılırdı (14.08 - 15.81)
function v8(lt){
  bg();
  const L8=[['Ekmek','5'],['Süt','8'],['Sakız','1']];
  notebook(540,960,1.45,{title:'Ali Bey',lines:L8,reveal:lerp(.2,3,eout(p(lt,.1,1.5))),pen:true,rot:-.02});
  txt('KURŞUN KALEMLE',540,330,92,{fill:'#fff',maxW:960,sc:back(p(lt,0,.3))});
}
// 9) Ay sonu baba gelir, borç kapanır, sayfa çizilir (15.81 - 19.48)
function v9(lt){
  bg('#fbf3e2');
  const st=eout(p(lt,2.2,2.8));
  notebook(540,640,.78,{title:'Ali Bey',lines:[['Ekmek','5'],['Süt','8'],['Sakız','1']],strike:st,rot:-.03});
  const cp=back(p(lt,0,.3));if(cp>0){ctx.save();ctx.translate(880,330);ctx.rotate(.08);ctx.scale(cp,cp);ctx.strokeStyle=INK;ctx.lineWidth=9;rr(-120,-70,240,140,16);ctx.fillStyle=PAGE;ctx.fill();ctx.stroke();
    ctx.save();rr(-120,-70,240,140,16);ctx.clip();ctx.fillStyle=RED;ctx.fillRect(-120,-70,240,46);ctx.restore();rr(-120,-70,240,140,16);ctx.stroke();
    ctx.fillStyle=INK;ctx.font=`bold 50px ${FONT}`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('AY SONU',0,26);ctx.restore();}
  bakkalAmca(800,GY-110,1.2,{look:-1,face:lt>1.3?'big':'happy',reachL:lt>.8&&lt<1.6?[600,1235]:null,armL:[-.3,-.1]});
  counter(1250);
  const wx=lt<1.0?lerp(-150,260,eout(p(lt,0,.9))):260,ph=lt*11,walk=lt<.9;shadow(wx,GY,70);
  const b=fig({x:wx,y:GY,mustache:true,face:'happy',look:1,legL:walk?[-.3*Math.sin(ph),-.3*Math.sin(ph)-.1]:undefined,legR:walk?[.3*Math.sin(ph),.3*Math.sin(ph)+.1]:undefined,
    reachR:lt>.8&&lt<1.6?[560,1235]:null,armR:[.3,.15]});
  if(lt>.8&&lt<1.6){const q=eio(p(lt,.85,1.4));bill(lerp(b.hR[0]+20,600,q),1225,170,74,-.1,null);}
  txt('BORÇ KAPANDI',540,975,80,{fill:GREEN,sc:back(p(lt,1.3,1.6))*(lt<2.15?1:0)});
  if(lt>=2.15)txt('ÇİZİLDİ!',540,975,96,{fill:RED,sc:back(p(lt,2.3,2.6)),rot:-.05});
}
// 10) Faiz yoktu, gecikme cezası yoktu (19.48 - 21.81)
function v10(lt){
  bg();ground();
  txt('FAİZ',540,450,140,{fill:'#fff',sc:back(p(lt,0,.3))});
  stamp(540,620,'YOK',back(p(lt,.3,.45)),-.1);
  txt('GECİKME CEZASI',540,900,96,{fill:'#fff',maxW:960,sc:back(p(lt,.9,1.2))});
  stamp(540,1070,'YOK',back(p(lt,1.25,1.4)),.08);
  shadow(540,GY,60);fig({x:540,y:GY-Math.abs(Math.sin(lt*6))*20,s:.8,face:'big',mustache:true,armL:[-2.5,-2.9],armR:[2.5,2.9]});
}
// 11) Bir tek güven vardı (21.81 - 23.29)
function v11(lt){
  bg();ground();
  const g=eout(p(lt,0,.5));
  shadow(330,GY,70);fig({x:lerp(180,330,g),y:GY,mustache:true,face:'happy',look:1,reachR:[540,1180+Math.sin(lt*14)*12]});
  shadow(750,GY,70);bakkalAmca(lerp(900,750,g),GY,1.0,{look:-1,reachL:[540,1180+Math.sin(lt*14)*12]});
  heart(540,820,120*(1+.06*Math.sin(lt*10)),back(p(lt,.5,.8)));
  txt('GÜVEN',540,450,170,{fill:YEL,sc:back(p(lt,.65,.95))});
}
// 12) Hesap defteri değildi (23.29 - 25.96)
function v12(lt){
  bg();ground();
  notebook(540,1020,1.0,{cover:true,rot:Math.sin(lt*2)*.03});
  txt('HESAP DEFTERİ?',540,420,104,{fill:'#fff',maxW:960,sc:back(p(lt,.4,.7))});
  const sp=eout(p(lt,1.6,2.0));if(sp>0){ctx.save();ctx.strokeStyle=RED;ctx.lineWidth=18;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(110,430);ctx.lineTo(lerp(110,970,sp),410);ctx.stroke();ctx.restore();}
  txt('DEĞİL!',540,570,110,{fill:RED,sc:back(p(lt,1.8,2.1)),rot:-.04});
}
// 13) Mahallenin güveni (25.96 - 29.09)
function v13(lt){
  bg();const G=1450;ground(G);
  const H=[[150,200,520,'#f3d6a4','#b5523b'],[370,190,380,'#cfe2f0','#4d7cfe'],[710,190,420,'#e9d5f5','#8a5bc4'],[930,200,540,'#d9f0d0','#62b061']];
  H.forEach(([x,w,h,c,r],i)=>{const pp=back(p(lt,.05+i*.08,.35+i*.08));if(pp<=0)return;ctx.save();ctx.translate(x,G);ctx.scale(pp,pp);ctx.translate(-x,-G);house(x,G,w,h,c,r);ctx.restore();});
  ctx.save();ctx.translate(540,G);ctx.scale(back(p(lt,.2,.5)),back(p(lt,.2,.5)));ctx.translate(-540,-G);ctx.strokeStyle=INK;ctx.lineWidth=10;rr(460,G-260,160,260,8);ctx.fillStyle='#2f5aa8';ctx.fill();ctx.stroke();
  ctx.fillStyle='#fff';ctx.font=`bold 34px ${FONT}`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('BAKKAL',540,G-225);rr(490,G-190,100,190,6);ctx.fillStyle='#ffe08a';ctx.fill();ctx.stroke();ctx.restore();
  const nb=back(p(lt,.6,.9));if(nb>0){notebook(540,860,.5*nb,{cover:true});}
  const P=[[120,G+150],[330,G+170],[750,G+170],[960,G+150]];
  const lk=eout(p(lt,1.0,1.8));
  if(lk>0){ctx.save();ctx.setLineDash([18,16]);ctx.lineDashOffset=-lt*60;ctx.strokeStyle=RED;ctx.lineWidth=8;ctx.lineCap='round';
    for(const [x,y] of P){ctx.beginPath();ctx.moveTo(540,960);ctx.lineTo(lerp(540,x,lk),lerp(960,y-260,lk));ctx.stroke();}ctx.restore();
    for(let i=0;i<4;i++)heart(P[i][0],P[i][1]-300,34,back(p(lt,1.6+i*.1,1.85+i*.1)));}
  P.forEach(([x],i)=>{const pp=back(p(lt,.3+i*.08,.6+i*.08));if(pp<=0)return;ctx.save();ctx.translate(x,G+260);ctx.scale(pp,pp);
    family(i,0,0,.55,{face:'happy',armL:[-2.4+Math.sin(lt*8+i)*.3,-2.8],armR:[.3,.15]});ctx.restore();});
  txt('MAHALLENİN',540,330,96,{fill:'#fff',sc:back(p(lt,.1,.4))});
  txt('GÜVENİ',540,460,120,{fill:YEL,sc:back(p(lt,2.2,2.5))});
}
// 14) Senin bakkalın kimdi? + yorum (29.09 - 33.85)
function v14(lt){
  bg('#fbf3e2');shelves(lt);awning(640,'??? BAKKALI');
  bakkalAmca(540,GY-110,1.2,{face:'big',look:0,armL:[-2.4+Math.sin(lt*8)*.35,-2.8+Math.sin(lt*8)*.35],armR:[.3,.15]});
  counter();
  txt('SENİN BAKKALIN',540,330,92,{fill:'#fff',maxW:960,sc:back(p(lt,0,.3))});
  txt('KİMDİ?',540,450,120,{fill:YEL,sc:back(p(lt,.3,.6))});
  commentBtn(540,1360,back(p(lt,1.34,1.64))*(1+.04*Math.sin(lt*6)));
  const ap=eout(p(lt,1.6,1.9));if(ap>0)arrowR(lerp(1300,920,ap)+Math.sin(lt*8)*14,1170,.8);
}

const SC=[{a:0,b:1.85,f:v1},{a:1.85,b:3.56,f:v2},{a:3.56,b:4.76,f:v3},{a:4.76,b:7.99,f:v4},{a:7.99,b:9.78,f:v5},{a:9.78,b:11.40,f:v6},
  {a:11.40,b:14.08,f:v7},{a:14.08,b:15.81,f:v8},{a:15.81,b:19.48,f:v9},{a:19.48,b:21.81,f:v10},{a:21.81,b:23.29,f:v11},{a:23.29,b:25.96,f:v12},
  {a:25.96,b:29.09,f:v13},{a:29.09,b:33.85,f:v14}];
