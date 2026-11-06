/* ---------- SOBA VİDEOSU: ek objeler ---------- */
const SNOW='#9cc9f5';
function snow(lt,n=40,col=SNOW,wind=0){ctx.save();ctx.fillStyle=col;for(let i=0;i<n;i++){const sp=60+hs(i)*90;const y=((lt*sp+hs(i+3)*2000)%2000)-60;
  const x=((hs(i+7)*W+Math.sin(lt*1.3+i)*30+wind*lt*300)%W+W)%W;ctx.beginPath();ctx.arc(x,y,4+hs(i+1)*6,0,Math.PI*2);ctx.fill();}ctx.restore();}
function glow(x,y,r,a=.45){if(a<=0)return;const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,`rgba(255,160,50,${a})`);g.addColorStop(1,'rgba(255,160,50,0)');ctx.fillStyle=g;ctx.fillRect(x-r,y-r,2*r,2*r);}
function flame(x,y,h,t,seed=0,c1='#ff7a1a',c2='#ffd23f'){if(h<=1)return;
  const fl=(hh,w,col,ph)=>{const k=1+Math.sin(t*14+ph+seed)*.12;ctx.beginPath();ctx.moveTo(x-w,y);ctx.quadraticCurveTo(x-w*1.1,y-hh*.5*k,x+Math.sin(t*9+ph+seed)*w*.3,y-hh*k);
    ctx.quadraticCurveTo(x+w*1.1,y-hh*.5*k,x+w,y);ctx.closePath();ctx.fillStyle=col;ctx.fill();};
  ctx.save();fl(h,h*.42,c1,0);fl(h*.62,h*.27,c2,1.3);ctx.restore();}
function smoke(x,y,r,a=1){if(r<=1||a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.fillStyle='#b9b4ad';
  for(const [dx,dy,k] of [[0,0,1],[-.7,.2,.75],[.7,.15,.8],[-.25,-.5,.7],[.35,-.45,.65]]){ctx.beginPath();ctx.arc(x+dx*r,y+dy*r,r*k*.7,0,Math.PI*2);ctx.fill();}ctx.restore();}
function coal(x,y,r,rot=0,seed=0){ctx.save();ctx.translate(x,y);ctx.rotate(rot);ctx.beginPath();
  for(let i=0;i<7;i++){const a=i/7*Math.PI*2,q=r*(.7+hs(seed*7+i)*.4);i?ctx.lineTo(Math.cos(a)*q,Math.sin(a)*q):ctx.moveTo(Math.cos(a)*q,Math.sin(a)*q);}
  ctx.closePath();ctx.fillStyle='#2b2b2e';ctx.fill();ctx.strokeStyle=INK;ctx.lineWidth=Math.max(3,r*.15);ctx.stroke();
  ctx.fillStyle='rgba(255,255,255,.35)';ctx.beginPath();ctx.arc(-r*.25,-r*.25,r*.18,0,Math.PI*2);ctx.fill();ctx.restore();}
function coalPile(x,y,w,h,n=30,k=1){const m=Math.floor(n*k);const idx=[...Array(m).keys()].sort((a,b)=>hs(a+300)-hs(b+300));
  for(const i of idx){const u=hs(i+200),v=hs(i+300);coal(x+(u-.5)*w*(1-v*.8),y-10-v*h*k,16+hs(i+400)*10,hs(i)*6,i);}}
function stove(x,gy,s,fire,t,o={}){
  ctx.save();ctx.strokeStyle=INK;ctx.lineJoin='round';ctx.lineCap='round';ctx.lineWidth=10*s;
  const bw=210*s,bh=300*s,by=gy-50*s-bh;
  glow(x,by+bh*.5,460*s,.5*fire);
  ctx.lineWidth=12*s;L(x-bw*.36,gy-50*s,x-bw*.46,gy);L(x+bw*.36,gy-50*s,x+bw*.46,gy);ctx.lineWidth=10*s;
  if(!o.noPipe){const pw=54*s,px=x+(o.pipeDX||0)*s,ptop=o.pipeTo?o.pipeTo[1]:by-(o.pipeH||380)*s;
    ctx.fillStyle='#707077';
    if(o.pipeTo){const ex=o.pipeTo[0];rr(Math.min(px,ex),ptop,Math.abs(ex-px)+pw/2,pw,6);ctx.fill();ctx.stroke();}
    rr(px-pw/2,ptop,pw,by-ptop,6);ctx.fill();ctx.stroke();
    ctx.lineWidth=5*s;for(let yy=by-90*s;yy>ptop+40*s;yy-=110*s)L(px-pw/2,yy,px+pw/2,yy);ctx.lineWidth=10*s;}
  rr(x-bw/2,by,bw,bh,34*s);ctx.fillStyle='#3c3c42';ctx.fill();ctx.stroke();
  ctx.save();rr(x-bw/2,by,bw,bh,34*s);ctx.clip();ctx.fillStyle=`rgba(255,110,40,${.35*fire})`;ctx.fillRect(x-bw/2,by,bw,bh);ctx.restore();
  ctx.strokeStyle='rgba(255,255,255,.25)';ctx.lineWidth=8*s;L(x-bw*.33,by+40*s,x-bw*.33,by+bh-60*s);ctx.strokeStyle=INK;ctx.lineWidth=10*s;
  rr(x-bw/2-18*s,by-24*s,bw+36*s,30*s,8*s);ctx.fillStyle='#2a2a2e';ctx.fill();ctx.stroke();
  rr(x-bw/2-10*s,by+bh-14*s,bw+20*s,26*s,8*s);ctx.fill();ctx.stroke();
  const dx=x-58*s,dy=by+bh*.36,dw=116*s,dh=96*s;
  rr(dx,dy,dw,dh,16*s);ctx.fillStyle=fire>0?'#ff9a3c':'#1b1b1e';ctx.fill();
  if(fire>0){ctx.save();rr(dx,dy,dw,dh,16*s);ctx.clip();flame(x-24*s,dy+dh,78*s*fire,t,0);flame(x+26*s,dy+dh,60*s*fire,t,2);flame(x,dy+dh,92*s*fire,t,4);ctx.restore();}
  rr(dx,dy,dw,dh,16*s);ctx.stroke();
  ctx.lineWidth=6*s;rr(x-62*s,by+bh-70*s,124*s,34*s,6*s);ctx.stroke();ctx.fillStyle=INK;ctx.beginPath();ctx.arc(x,by+bh-53*s,6*s,0,Math.PI*2);ctx.fill();
  ctx.restore();
  return {top:by-24*s,by,bw,bh,door:[x,dy+dh/2]};
}
function caydanlik(x,y,s){ctx.save();ctx.strokeStyle=INK;ctx.lineWidth=9*s;ctx.lineJoin='round';ctx.lineCap='round';
  ctx.lineWidth=16*s;ctx.beginPath();ctx.moveTo(x+80*s,y-45*s);ctx.quadraticCurveTo(x+140*s,y-55*s,x+155*s,y-115*s);ctx.stroke();ctx.lineWidth=9*s;
  ctx.fillStyle='#d9dde3';ctx.beginPath();ctx.moveTo(x-95*s,y);ctx.lineTo(x+95*s,y);ctx.quadraticCurveTo(x+108*s,y-118*s,x+60*s,y-130*s);ctx.lineTo(x-60*s,y-130*s);
  ctx.quadraticCurveTo(x-108*s,y-118*s,x-95*s,y);ctx.closePath();ctx.fill();ctx.stroke();
  ctx.strokeStyle='rgba(255,255,255,.7)';ctx.lineWidth=7*s;ctx.beginPath();ctx.moveTo(x-60*s,y-25*s);ctx.lineTo(x-68*s,y-95*s);ctx.stroke();ctx.strokeStyle=INK;
  ctx.lineWidth=12*s;ctx.beginPath();ctx.moveTo(x-50*s,y-190*s);ctx.lineTo(x-95*s,y-228*s);ctx.stroke();
  ctx.lineWidth=9*s;ctx.beginPath();ctx.arc(x+58*s,y-185*s,28*s,-1.2,1.2);ctx.stroke();
  ctx.fillStyle='#e94b4b';ctx.beginPath();ctx.ellipse(x,y-182*s,64*s,54*s,0,0,Math.PI*2);ctx.fill();ctx.stroke();
  ctx.fillStyle='#fff';for(let i=0;i<5;i++){ctx.beginPath();ctx.arc(x-36*s+i*18*s,y-170*s+(i%2)*14*s,5*s,0,Math.PI*2);ctx.fill();}
  ctx.fillStyle='#e94b4b';rr(x-30*s,y-245*s,60*s,16*s,6*s);ctx.fill();ctx.stroke();ctx.beginPath();ctx.arc(x,y-252*s,10*s,0,Math.PI*2);ctx.fill();ctx.stroke();
  ctx.restore();}
function steam(x,y,t,h=260,n=3,sp=40,col='rgba(255,255,255,.95)'){ctx.save();ctx.lineCap='round';
  for(let i=0;i<n;i++){const q=((t*.7+i/n)%1);ctx.globalAlpha=Math.sin(q*Math.PI);ctx.strokeStyle='rgba(60,60,70,.55)';ctx.lineWidth=16;
    const path=()=>{ctx.beginPath();const x0=x+(i-(n-1)/2)*sp,y0=y-q*h*.5;for(let k=0;k<=12;k++){const yy=y0-k*h/24,xx=x0+Math.sin(k*.9+t*5+i)*14;k?ctx.lineTo(xx,yy):ctx.moveTo(xx,yy);}};
    path();ctx.stroke();ctx.strokeStyle=col;ctx.lineWidth=9;path();ctx.stroke();}ctx.restore();}
function kestane(x,y,r,rot=0){ctx.save();ctx.translate(x,y);ctx.rotate(rot);ctx.strokeStyle=INK;ctx.lineWidth=Math.max(4,r*.14);
  ctx.beginPath();ctx.moveTo(0,-r*1.1);ctx.bezierCurveTo(r*1.2,-r*.6,r*1.1,r*.9,0,r*.9);ctx.bezierCurveTo(-r*1.1,r*.9,-r*1.2,-r*.6,0,-r*1.1);ctx.closePath();
  ctx.fillStyle='#7b3f1e';ctx.fill();ctx.stroke();ctx.save();ctx.clip();ctx.fillStyle='#e8c69b';ctx.fillRect(-r*1.2,r*.35,r*2.4,r);ctx.restore();ctx.stroke();
  ctx.strokeStyle='#f3d9b0';ctx.lineWidth=Math.max(3,r*.1);ctx.beginPath();ctx.moveTo(-r*.3,-r*.5);ctx.lineTo(r*.3,-r*.1);ctx.moveTo(r*.3,-r*.5);ctx.lineTo(-r*.3,-r*.1);ctx.stroke();
  ctx.fillStyle='rgba(255,255,255,.35)';ctx.beginPath();ctx.arc(-r*.4,-r*.35,r*.15,0,Math.PI*2);ctx.fill();ctx.restore();}
function peel(x,y,r,rot=0){ctx.save();ctx.translate(x,y);ctx.rotate(rot);ctx.lineCap='round';
  const path=()=>{ctx.beginPath();for(let k=0;k<=30;k++){const a=k/30*Math.PI*3.2,q=r*(.25+k/30*.75);k?ctx.lineTo(Math.cos(a)*q,Math.sin(a)*q*.7):ctx.moveTo(Math.cos(a)*q,Math.sin(a)*q*.7);}};
  ctx.strokeStyle=INK;ctx.lineWidth=r*.42;path();ctx.stroke();ctx.strokeStyle='#ff9a1f';ctx.lineWidth=r*.28;path();ctx.stroke();
  ctx.strokeStyle='rgba(255,255,255,.45)';ctx.lineWidth=r*.07;path();ctx.stroke();ctx.restore();}
function smell(x,y,t,col='#ff9a1f'){ctx.save();ctx.strokeStyle=col;ctx.lineWidth=8;ctx.lineCap='round';
  for(let i=0;i<3;i++){const q=(t*.6+i/3)%1;ctx.globalAlpha=Math.sin(q*Math.PI);ctx.beginPath();
    for(let k=0;k<=10;k++){const yy=y-q*120-k*14,xx=x+(i-1)*45+Math.sin(k*.9+t*4)*12;k?ctx.lineTo(xx,yy):ctx.moveTo(xx,yy);}ctx.stroke();}ctx.restore();}
function sock(x,y,s,col,rot=0){ctx.save();ctx.translate(x,y);ctx.rotate(rot);ctx.strokeStyle=INK;ctx.lineWidth=8*s;ctx.lineJoin='round';
  ctx.beginPath();ctx.moveTo(-28*s,0);ctx.lineTo(28*s,0);ctx.lineTo(28*s,120*s);ctx.quadraticCurveTo(30*s,150*s,75*s,155*s);ctx.quadraticCurveTo(100*s,165*s,92*s,190*s);
  ctx.lineTo(10*s,192*s);ctx.quadraticCurveTo(-30*s,190*s,-28*s,150*s);ctx.closePath();ctx.fillStyle=col;ctx.fill();ctx.stroke();
  ctx.fillStyle='rgba(255,255,255,.8)';ctx.fillRect(-24*s,30*s,48*s,14*s);ctx.fillRect(-24*s,62*s,48*s,14*s);ctx.restore();}
function chair(x,gy,s){ctx.save();ctx.strokeStyle='#8b5e3c';ctx.lineCap='round';
  const seat=gy-160*s;const draw=(w,c)=>{ctx.strokeStyle=c;ctx.lineWidth=w;
    L(x-80*s,seat,x+80*s,seat);L(x-70*s,seat,x-75*s,gy);L(x+70*s,seat,x+75*s,gy);L(x+70*s,seat,x+78*s,seat-230*s);L(x+76*s,seat-200*s,x+76*s,seat-200*s);};
  draw(30*s,INK);draw(16*s,'#a8703f');ctx.restore();return {top:[x+78*s,seat-230*s],seat};}
function bucket(x,y,s,fill='coal'){ctx.save();ctx.strokeStyle=INK;ctx.lineWidth=7*s;ctx.lineJoin='round';
  ctx.beginPath();ctx.arc(x,y,40*s,Math.PI,0);ctx.stroke();
  if(fill==='coal'){for(let i=0;i<4;i++)coal(x-30*s+i*20*s,y+14*s-(i%2)*8*s,13*s,i,i+50);}
  else if(fill==='ash'){ctx.fillStyle='#a7a7a7';ctx.beginPath();ctx.ellipse(x,y+14*s,44*s,16*s,0,0,Math.PI*2);ctx.fill();}
  ctx.beginPath();ctx.moveTo(x-48*s,y+12*s);ctx.lineTo(x+48*s,y+12*s);ctx.lineTo(x+36*s,y+90*s);ctx.lineTo(x-36*s,y+90*s);ctx.closePath();ctx.fillStyle='#8f9aa6';ctx.fill();ctx.stroke();
  ctx.restore();}
function truck(x,gy,s,tilt,t,load=1){ctx.save();ctx.strokeStyle=INK;ctx.lineJoin='round';ctx.lineWidth=10*s;
  ctx.fillStyle='#555';rr(x-320*s,gy-95*s,560*s,34*s,8*s);ctx.fill();ctx.stroke();
  ctx.save();ctx.translate(x+230*s,gy-95*s);ctx.rotate(tilt);ctx.translate(-(x+230*s),-(gy-95*s));
  if(load>0)coalPile(x+40*s,gy-215*s,320*s,110*s*load,22,1);
  rr(x-150*s,gy-225*s,380*s,130*s,10*s);ctx.fillStyle='#f2a33a';ctx.fill();ctx.stroke();
  ctx.lineWidth=6*s;for(let i=1;i<4;i++)L(x-150*s+i*95*s,gy-215*s,x-150*s+i*95*s,gy-105*s);ctx.restore();
  ctx.lineWidth=10*s;rr(x-330*s,gy-245*s,160*s,165*s,22*s);ctx.fillStyle='#e94b4b';ctx.fill();ctx.stroke();
  rr(x-310*s,gy-225*s,80*s,65*s,10*s);ctx.fillStyle='#bfe6ff';ctx.fill();ctx.stroke();
  for(const wx of[x-235*s,x+140*s]){ctx.fillStyle='#2b2b2e';ctx.beginPath();ctx.arc(wx,gy-48*s,46*s,0,Math.PI*2);ctx.fill();ctx.stroke();
    ctx.fillStyle='#ccc';ctx.beginPath();ctx.arc(wx,gy-48*s,18*s,0,Math.PI*2);ctx.fill();ctx.stroke();
    ctx.lineWidth=5*s;L(wx,gy-48*s,wx+Math.cos(t*8)*18*s,gy-48*s+Math.sin(t*8)*18*s);ctx.lineWidth=10*s;}
  ctx.restore();}
function teaGlass(x,y,s){ctx.save();ctx.strokeStyle=INK;ctx.lineWidth=5*s;ctx.beginPath();ctx.moveTo(x-14*s,y-46*s);ctx.quadraticCurveTo(x-4*s,y-24*s,x-12*s,y);ctx.lineTo(x+12*s,y);
  ctx.quadraticCurveTo(x+4*s,y-24*s,x+14*s,y-46*s);ctx.closePath();ctx.fillStyle='#c4361d';ctx.fill();ctx.stroke();ctx.restore();}
function newspaper(x,y,s,rot=0){ctx.save();ctx.translate(x,y);ctx.rotate(rot);ctx.strokeStyle=INK;ctx.lineWidth=8*s;rr(-90*s,-110*s,180*s,220*s,8*s);ctx.fillStyle='#f4f1ea';ctx.fill();ctx.stroke();
  ctx.fillStyle=INK;ctx.fillRect(-70*s,-90*s,140*s,26*s);ctx.lineWidth=6*s;ctx.strokeStyle='#9a978f';for(let i=0;i<6;i++){L(-70*s,-45*s+i*24*s,(i%3===2?20:70)*s,-45*s+i*24*s);}
  ctx.restore();}
function kindling(x,y,s,rot=0){ctx.save();ctx.translate(x,y);ctx.rotate(rot);ctx.lineCap='round';
  for(let i=0;i<5;i++){const a=(i-2)*.14;ctx.save();ctx.rotate(a);ctx.strokeStyle=INK;ctx.lineWidth=30*s;L(0,-110*s,0,110*s);ctx.strokeStyle='#d9a066';ctx.lineWidth=18*s;L(0,-110*s,0,110*s);ctx.restore();}
  ctx.strokeStyle='#e94b4b';ctx.lineWidth=10*s;L(-45*s,0,45*s,0);ctx.restore();}
function windowBox(x,y,w,h,o={}){ctx.save();ctx.strokeStyle=INK;ctx.lineWidth=12;rr(x,y,w,h,12);ctx.fillStyle=o.sky||'#a9dcff';ctx.fill();
  ctx.save();rr(x,y,w,h,12);ctx.clip();if(o.inner)o.inner();ctx.restore();
  const op=o.open||0;
  if(op<1){ctx.fillStyle='rgba(255,255,255,.15)';const pw=w/2*(1-op);rr(x,y,pw,h,10);ctx.fill();ctx.lineWidth=10;ctx.stroke();}
  else{ctx.lineWidth=10;}
  rr(x,y,w,h,12);ctx.lineWidth=12;ctx.stroke();ctx.lineWidth=9;if(op<=0){L(x+w/2,y,x+w/2,y+h);}L(x+(op>0?w/2:0),y+h/2,x+w,y+h/2);ctx.restore();}
function family(i,x,gy,s,extra={}){const base=[{mustache:true},{bun:true,skirt:true},{hair:true},{cap:true,mustache:true}][i];
  return fig(Object.assign({x,y:gy,s},base,extra));}
function sitFig(x,seatY,s,dir,o={}){const d=dir;return fig(Object.assign({x,y:0,hipY:seatY,s,legL:[d*1.45,d*.05],legR:[d*1.6,-d*.05],look:d*.6},o));}
function stool(x,y,s){ctx.save();ctx.strokeStyle=INK;ctx.lineWidth=9*s;rr(x-55*s,y,110*s,22*s,8*s);ctx.fillStyle='#a8703f';ctx.fill();ctx.stroke();
  ctx.lineWidth=12*s;L(x-40*s,y+20*s,x-48*s,GY);L(x+40*s,y+20*s,x+48*s,GY);ctx.restore();}
function arrowR(x,y,k=1){ctx.save();ctx.translate(x,y);ctx.scale(k,k);ctx.strokeStyle=INK;ctx.lineWidth=10;ctx.lineJoin='round';ctx.fillStyle=YEL;
  ctx.beginPath();ctx.moveTo(-90,-30);ctx.lineTo(0,-30);ctx.lineTo(0,-70);ctx.lineTo(90,0);ctx.lineTo(0,70);ctx.lineTo(0,30);ctx.lineTo(-90,30);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();}
function commentBtn(x,y,k){if(k<=0)return;ctx.save();ctx.translate(x,y);ctx.scale(k,k);ctx.strokeStyle=INK;ctx.lineWidth=10;rr(-360,-58,720,116,58);ctx.fillStyle='#ff4d4d';ctx.fill();ctx.stroke();
  ctx.fillStyle='#fff';ctx.lineWidth=7;rr(-300,-30,80,54,14);ctx.fill();ctx.stroke();ctx.beginPath();ctx.moveTo(-285,22);ctx.lineTo(-295,42);ctx.lineTo(-265,24);ctx.fill();
  ctx.fillStyle=INK;for(let i=0;i<3;i++){ctx.beginPath();ctx.arc(-278+i*18,-3,5,0,Math.PI*2);ctx.fill();}
  ctx.fillStyle='#fff';ctx.font=`bold 52px ${FONT}`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('YORUMLARA YAZ',60,4);ctx.restore();}
function vignette(a){const g=ctx.createRadialGradient(540,1000,300,540,1000,1250);g.addColorStop(0,'rgba(20,25,50,0)');g.addColorStop(1,`rgba(20,25,50,${a})`);ctx.fillStyle=g;ctx.fillRect(0,0,W,H);}

/* ---------- SAHNELER ---------- */
// 1) Kışın düğmeye basmazdık  (0 - 3.24)
function k1(lt){
  bg('#eef4f8');snow(lt,45);ground();
  txt('KIŞIN',540,400,124,{fill:'#fff',sc:back(p(lt,.05,.35))});
  txt('EVİ ISITMAK İÇİN',540,545,92,{fill:YEL,maxW:960,sc:back(p(lt,1.0,1.3))});
  const bp=back(p(lt,1.8,2.1));
  if(bp>0){ctx.save();ctx.translate(770,1080);ctx.scale(bp,bp);ctx.strokeStyle=INK;ctx.lineWidth=11;rr(-150,-170,300,340,30);ctx.fillStyle='#e8e8ea';ctx.fill();ctx.stroke();
    rr(-110,-135,220,95,14);ctx.fillStyle='#cfe8ff';ctx.fill();ctx.stroke();ctx.fillStyle=INK;ctx.font=`bold 64px ${FONT}`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('24°',0,-86);
    const press=lt>2.2&&lt<2.4?.9:1;ctx.save();ctx.translate(0,70);ctx.scale(press,press);ctx.beginPath();ctx.arc(0,0,72,0,Math.PI*2);ctx.fillStyle='#e94b4b';ctx.fill();ctx.stroke();
    ctx.fillStyle='rgba(255,255,255,.5)';ctx.beginPath();ctx.arc(-24,-24,16,0,Math.PI*2);ctx.fill();ctx.restore();
    const xp=back(p(lt,2.5,2.75));if(xp>0){ctx.save();ctx.scale(xp,xp);ctx.strokeStyle=RED;ctx.lineWidth=30;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(-170,-190);ctx.lineTo(170,190);ctx.moveTo(170,-190);ctx.lineTo(-170,190);ctx.stroke();ctx.restore();}
    ctx.restore();}
  txt('DÜĞME YOK!',770,1340,84,{fill:RED,sc:back(p(lt,2.55,2.85)),rot:-.05});
  const sh=Math.sin(lt*55)*4;shadow(300,GY,75);
  fig({x:300+sh,y:GY,face:'cold',scarf:true,look:.6,reachL:P=>[P.sh[0]+45*P.s,P.sh[1]+60*P.s],reachR:P=>[P.sh[0]-45*P.s,P.sh[1]+70*P.s]});
}
// 2) Saatlerce uğraşırdık (3.24 - 4.48)
function k2(lt){
  bg();ground();
  txt('SAATLERCE!',540,370,124,{fill:YEL,sc:back(p(lt,.05,.35)),rot:-.04});
  const cx=540,cy=640,r=150;ctx.save();ctx.strokeStyle=INK;ctx.lineWidth=12;ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.fillStyle='#fff';ctx.fill();ctx.stroke();
  ctx.lineWidth=8;for(let i=0;i<12;i++){const a=i/12*Math.PI*2;L(cx+Math.cos(a)*r*.82,cy+Math.sin(a)*r*.82,cx+Math.cos(a)*r*.92,cy+Math.sin(a)*r*.92);}
  ctx.lineCap='round';ctx.lineWidth=12;const a1=lt*14,a2=lt*1.4;L(cx,cy,cx+Math.sin(a1)*r*.75,cy-Math.cos(a1)*r*.75);ctx.lineWidth=16;L(cx,cy,cx+Math.sin(a2)*r*.5,cy-Math.cos(a2)*r*.5);ctx.restore();
  const s=stove(760,GY,.85,.25,lt,{pipeDX:60,pipeH:260});smoke(760,s.door[1]-30,40+Math.sin(lt*6)*6,.8);
  shadow(420,GY,75);const fan=Math.sin(lt*30)*.5;
  const f=fig({x:420,y:GY,face:'sweat',look:1,lean:.25,armR:[1.4+fan,1.9+fan],armL:[.5,.8],legL:[-.35,-.2],legR:[.2,.1]});
  newspaper(f.hR[0]+20,f.hR[1],.35,fan);
}
// 3) Doğalgaz ancak 2000'lerde (4.48 - 7.07)
function k3(lt){
  bg();ground();
  txt('DOĞALGAZ',540,390,130,{fill:'#7cc6ff',sc:back(p(lt,.02,.35))});
  const g=eout(p(lt,.2,1.0)),px=lerp(-40,600,g);
  ctx.save();ctx.strokeStyle=INK;ctx.lineWidth=46;ctx.lineCap='round';L(-40,1000,px,1000);ctx.strokeStyle='#ffd23f';ctx.lineWidth=30;L(-40,1000,px,1000);
  if(g>=1){ctx.strokeStyle=INK;ctx.lineWidth=46;L(600,1000,600,1170);ctx.strokeStyle='#ffd23f';ctx.lineWidth=30;L(600,1000,600,1170);
    ctx.strokeStyle=INK;ctx.lineWidth=10;rr(470,1170,260,44,14);ctx.fillStyle='#888';ctx.fill();ctx.stroke();
    for(let i=0;i<5;i++)flame(500+i*50,1170,70+Math.sin(lt*10+i)*10,lt,i,'#3d7dff','#bfe3ff');}
  ctx.strokeStyle=INK;ctx.lineWidth=8;for(const xx of[150,350])if(px>xx){rr(xx-18,975,36,50,6);ctx.fillStyle='#e0b42b';ctx.fill();ctx.stroke();}ctx.restore();
  const bp=back(p(lt,1.4,1.7));if(bp>0){ctx.save();ctx.translate(780,690);ctx.rotate(.06);ctx.scale(bp,bp);ctx.strokeStyle=INK;ctx.lineWidth=11;rr(-205,-110,410,220,26);ctx.fillStyle='#fffdf7';ctx.fill();ctx.stroke();
    ctx.save();rr(-205,-110,410,220,26);ctx.clip();ctx.fillStyle='#e94b4b';ctx.fillRect(-205,-110,410,60);ctx.restore();rr(-205,-110,410,220,26);ctx.stroke();
    ctx.fillStyle=INK;ctx.font=`bold 66px ${FONT}`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText("2000'LER",0,38);ctx.restore();}
  txt('ANCAK',790,520,64,{fill:'#fff',sc:back(p(lt,1.15,1.4))});
  shadow(880,GY,65);fig({x:880,y:GY,s:.9,face:'shock',look:-1,armL:[-1.9,-2.3],armR:[.3,.1]});
}
// 4) Her evin bir sobası vardı (7.07 - 9.37)
function k4(lt){
  bg();ctx.save();ctx.strokeStyle=INK;ctx.lineWidth=8;L(110,260,110,GY);ctx.restore();ground();
  const sp=back(p(lt,.1,.45));
  txt('ONDAN ÖNCE',540,380,96,{fill:'#fff',sc:back(p(lt,0,.3))});
  txt('HER EVDE SOBA!',540,520,110,{fill:YEL,maxW:960,sc:back(p(lt,1.0,1.3))});
  ctx.save();ctx.translate(620,GY);ctx.scale(sp,sp);ctx.translate(-620,-GY);
  stove(620,GY,1.1,1,lt,{pipeTo:[110,700]});ctx.restore();
  shadow(300,GY,75);fig({x:300,y:GY,face:'happy',look:1,reachR:[480,1180+Math.sin(lt*5)*8],reachL:[470,1230+Math.sin(lt*5+1)*8]});
}
// 5) Her binanın kömürlüğü (9.37 - 11.13)
function k5(lt){
  bg();const G=1230;
  ctx.fillStyle='#d3b48a';ctx.fillRect(0,G,W,H-G);ctx.strokeStyle=INK;ctx.lineWidth=8;L(-20,G,W+20,G);
  const bx=230,bw=620,top=480;ctx.lineWidth=11;rr(bx,top,bw,G-top,10);ctx.fillStyle='#f3d6a4';ctx.fill();ctx.stroke();
  ctx.fillStyle='#b5523b';ctx.beginPath();ctx.moveTo(bx-30,top);ctx.lineTo(bx+bw/2,top-110);ctx.lineTo(bx+bw+30,top);ctx.closePath();ctx.fill();ctx.stroke();
  for(let fl=0;fl<3;fl++)for(let c=0;c<3;c++){const wx=bx+60+c*190,wy=top+50+fl*235;rr(wx,wy,120,140,8);ctx.fillStyle='#ffe08a';ctx.fill();ctx.lineWidth=9;ctx.stroke();
    L(wx+60,wy,wx+60,wy+140);if(c===2){ctx.fillStyle='#707077';ctx.lineWidth=8;rr(wx+120,wy+20,70,24,4);ctx.fill();ctx.stroke();rr(wx+170,wy-20,24,64,4);ctx.fill();ctx.stroke();
      smoke(wx+182,wy-50-((lt*.8+fl*.3)%1)*60,22+((lt*.8+fl*.3)%1)*16,1-((lt*.8+fl*.3)%1));}}
  ctx.lineWidth=11;rr(290,G+30,500,250,12);ctx.fillStyle='#5a4a3c';ctx.fill();ctx.stroke();
  ctx.save();rr(290,G+30,500,250,12);ctx.clip();coalPile(540,G+280,440,170,46,eout(p(lt,.2,.9)));ctx.restore();
  txt('KÖMÜRLÜK',540,G+370,96,{fill:YEL,sc:back(p(lt,.8,1.1))});
  ctx.save();ctx.translate(540,G+300);ctx.scale(1,1);ctx.restore();
  txt('HER BİNADA',540,330,96,{fill:'#fff',sc:back(p(lt,0,.3))});
}
// 6) Sonbahar: kamyon + kovalar (11.13 - 14.59)
function k6(lt){
  bg();
  ctx.save();for(let i=0;i<12;i++){const q=((lt*.35+hs(i+60))%1);const x=hs(i+70)*W+Math.sin(lt*2+i)*50,y=-50+q*1600;ctx.translate(x,y);ctx.rotate(lt*2+i);
    ctx.fillStyle=i%2?'#e98a2b':'#d4542b';ctx.strokeStyle=INK;ctx.lineWidth=5;ctx.beginPath();ctx.ellipse(0,0,24,12,0,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.setTransform(1,0,0,1,0,0);}ctx.restore();
  ground();
  txt('SONBAHAR',540,380,116,{fill:'#ff9a3c',sc:back(p(lt,0,.3))});
  ctx.save();ctx.strokeStyle=INK;ctx.lineWidth=11;rr(-30,1050,250,GY-1050,10);ctx.fillStyle='#f3d6a4';ctx.fill();ctx.stroke();rr(70,1360,120,GY-1360,8);ctx.fillStyle='#2f2a26';ctx.fill();ctx.stroke();ctx.restore();
  const tilt=.45*eio(p(lt,1.0,1.4))*(1-eio(p(lt,1.75,2.0)));const tx=lt<1.9?lerp(1550,600,eout(p(lt,.1,.95))):lerp(600,-700,eio(p(lt,1.9,2.6)));
  const pile=eout(p(lt,1.1,1.6));
  if(pile>0)coalPile(860,GY,300,140,34,pile*(1-.5*p(lt,2.0,3.4)));
  truck(tx,GY,.95,tilt,lt,1-pile);
  if(lt>1.85){txt('KOVA KOVA!',540,530,100,{fill:YEL,sc:back(p(lt,1.85,2.15)),rot:.04});
    for(let i=0;i<2;i++){const q=((lt-1.85)*.55+i*.5)%1;const x=lerp(820,230,q),ph=lt*12+i;shadow(x,GY,55);
      const f=fig({x,y:GY,s:.8,face:'sweat',look:-1,hair:i===1,lean:-.08,armR:[.15,.1],armL:[-.6,-.9],legL:[-.35*Math.sin(ph),-.35*Math.sin(ph)-.1],legR:[.35*Math.sin(ph),.35*Math.sin(ph)+.1]});
      bucket(f.hR[0],f.hR[1]-6,.8);}}
}
// 7) Sabah ilk kalkan sobayı yakardı (14.59 - 16.68)
function k7(lt){
  bg('#fbf3e2');
  windowBox(80,640,260,300,{inner:()=>{ctx.fillStyle='#ffd23f';ctx.beginPath();ctx.arc(210,lerp(1000,760,eout(p(lt,0,1.4))),60,0,Math.PI*2);ctx.fill();ctx.strokeStyle=INK;ctx.lineWidth=8;ctx.stroke();}});
  ground();
  txt('İLK KALKAN',540,380,104,{fill:'#fff',sc:back(p(lt,.55,.85))});
  txt('SOBAYI YAKAR!',540,520,110,{fill:YEL,maxW:940,sc:back(p(lt,1.1,1.4))});
  const fire=eout(p(lt,1.35,2.0));stove(720,GY,1.0,fire,lt,{pipeDX:65,pipeH:280});
  const walk=lt<.9,x=walk?lerp(250,470,lt/.9):470,ph=lt*11;shadow(x,GY,70);
  const f=fig({x,y:GY,nightcap:true,face:lt<.8?'yawn':(fire>.3?'happy':'think'),look:1,lean:walk?0:.18,
    legL:walk?[-.3*Math.sin(ph),-.3*Math.sin(ph)-.1]:[-.3,-.1],legR:walk?[.3*Math.sin(ph),.3*Math.sin(ph)+.1]:[.15,.05],
    armL:lt<.8?[-2.6,-2.9]:[.2,.1],reachR:lt<.8?null:[650,1190]});
  if(lt>=.8&&lt<1.6){ctx.save();ctx.strokeStyle='#c98a3d';ctx.lineWidth=8;ctx.lineCap='round';L(f.hR[0],f.hR[1],f.hR[0]+30,f.hR[1]-24);ctx.restore();flame(f.hR[0]+32,f.hR[1]-22,40,lt,3);}
}
// 8) Önce gazete, sonra çıra, en son kömür (16.68 - 19.30)
function k8(lt){
  bg();ground();
  const T=[.24,1.18,2.06],X=[200,540,880],lb=['GAZETE','ÇIRA','KÖMÜR'];
  const fire=.35*p(lt,T[0]+.5,T[0]+.8)+.3*p(lt,T[1]+.5,T[1]+.8)+.35*p(lt,T[2]+.4,T[2]+.6);
  const st=stove(540,GY,1.0,fire,lt,{pipeDX:65,pipeH:220});
  for(let i=0;i<3;i++){const pp=back(p(lt,T[i],T[i]+.3));if(pp<=0)continue;
    ctx.save();ctx.translate(X[i],720);ctx.scale(pp,pp);
    if(i===0)newspaper(0,0,.9,-.08);else if(i===1)kindling(0,0,.8,.1);else{coal(-40,20,40,0,1);coal(40,25,36,1,2);coal(0,-25,42,2,3);}
    ctx.restore();
    const bd=back(p(lt,T[i]+.05,T[i]+.3));if(bd>0){ctx.save();ctx.translate(X[i]-95,560);ctx.scale(bd,bd);ctx.strokeStyle=INK;ctx.lineWidth=9;ctx.beginPath();ctx.arc(0,0,44,0,Math.PI*2);ctx.fillStyle=YEL;ctx.fill();ctx.stroke();
      ctx.fillStyle=INK;ctx.font=`bold 56px ${FONT}`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(String(i+1),0,3);ctx.restore();}
    txt(lb[i],X[i],890,64,{fill:'#fff',sc:pp});
    const q=p(lt,T[i]+.3,T[i]+.75);if(q>0&&q<1){const xx=lerp(X[i],540,eio(q)),yy=lerp(780,st.door[1],eio(q)),k=lerp(.45,.18,q);
      ctx.save();ctx.translate(xx,yy);ctx.scale(k,k);if(i===0)newspaper(0,0,1,q*4);else if(i===1)kindling(0,0,1,q*4);else coal(0,0,60,q*4,1);ctx.restore();}}
  if(fire>.6)smoke(540+65,st.top-260-((lt*.9)%1)*80,30,1-((lt*.9)%1));
}
// 9) Duman olmasın diye pencere açılırdı (19.30 - 22.01)
function k9(lt){
  bg();
  const op=eio(p(lt,1.5,1.9));
  windowBox(660,540,320,400,{sky:'#cfe2f0',open:op,inner:()=>snow(lt,30,'#fff',op)});
  ground();
  const st=stove(300,GY,1.0,.7,lt,{pipeDX:-65,pipeH:300});
  const fill=eout(p(lt,0,1.2))*(1-.85*eio(p(lt,1.8,2.7)));
  for(let i=0;i<9;i++){const bx=150+hs(i+30)*700,by=650+hs(i+31)*650;const drift=op*(lt-1.5)*260*(.6+hs(i))*(bx<640?1:1);
    smoke(bx+drift,by-drift*.4,fill*(70+hs(i)*40),fill*.9);}
  txt('DUMAN!',540,400,130,{fill:'#c8c3bc',sc:back(p(lt,.25,.55)),rot:-.05});
  const cough=lt<1.4?Math.sin(lt*25)*.08:0;shadow(560,GY,70);
  fig({x:560,y:GY,face:lt<1.8?'sweat':'cold',look:1,lean:cough,reachR:lt>1.2?[690,780]:null,armR:[1.2,1.5],armL:lt<1.4?[-.3,-2.2]:[-.3,-.2]});
  if(op>0)for(let i=0;i<4;i++){const q=(lt*1.2+i/4)%1;ctx.save();ctx.globalAlpha=op*Math.sin(q*Math.PI);ctx.strokeStyle='#8cc3f0';ctx.lineWidth=8;ctx.lineCap='round';
    L(940-q*300,640+i*60,880-q*300,640+i*60);ctx.restore();}
}
// 10) Çaydanlık kaynardı (22.01 - 24.13)
function k10(lt){
  bg();ground();
  const st=stove(540,GY,1.55,1,lt,{noPipe:true});
  const bp=back(p(lt,.05,.4));ctx.save();ctx.translate(540,st.top);ctx.scale(bp,bp);caydanlik(-10,0,1.15);ctx.restore();
  if(bp>.9){steam(540-10+178,st.top-150,lt,240,2,30);steam(530-110,st.top-260,lt,200,1,30);}
  txt('FOKUR',300,400,110,{fill:'#fff',sc:back(p(lt,1.15,1.4)),rot:-.1+Math.sin(lt*12)*.03});
  txt('FOKUR!',740,470,110,{fill:YEL,sc:back(p(lt,1.4,1.65)),rot:.1+Math.sin(lt*12+1)*.03});
}
// 11) Kestane + portakal kabuğu (24.13 - 26.51)
function k11(lt){
  bg();ground();
  const st=stove(540,GY,1.55,1,lt,{noPipe:true});const top=st.top;
  for(let i=0;i<5;i++){const pp=back(p(lt,.05+i*.06,.35+i*.06));if(pp<=0)continue;const jump=Math.max(0,Math.sin(lt*7+i*1.9))*14;
    ctx.save();ctx.translate(330+i*55,top-34-jump);ctx.scale(pp,pp);kestane(0,0,34,(i-2)*.25);ctx.restore();}
  txt('KESTANE',290,420,84,{fill:'#c8763a',sc:back(p(lt,.1,.4)),rot:-.05});
  const op=back(p(lt,1.18,1.45));if(op>0){for(let i=0;i<3;i++){ctx.save();ctx.translate(640+i*70,top-28);ctx.scale(op,op);peel(0,0,40,i*1.3);ctx.restore();}
    smell(710,top-90,lt);}
  txt('PORTAKAL',790,380,76,{fill:'#ff9a1f',sc:back(p(lt,1.25,1.5)),rot:.05});
  txt('KABUĞU',790,480,76,{fill:'#ff9a1f',sc:back(p(lt,1.4,1.65)),rot:.05});
  for(let i=0;i<2;i++)steam(380+i*120,top-80,lt+i*.3,140,1,0,'rgba(255,255,255,.8)');
}
// 12) Islak çoraplar sandalyede kururdu (26.51 - 29.16)
function k12(lt){
  bg();ground();
  stove(320,GY,1.0,1,lt,{pipeDX:-65,pipeH:320});
  const ch=chair(760,GY,1.1);
  const sp=back(p(lt,.15,.45));
  if(sp>0){ctx.save();ctx.translate(ch.top[0],ch.top[1]+10);ctx.scale(sp,sp);ctx.strokeStyle=INK;ctx.lineWidth=8;L(-120,0,60,0);
    sock(-80,0,.85,'#e94b4b',.05+Math.sin(lt*2)*.03);sock(10,0,.85,'#4d7cfe',-.04+Math.sin(lt*2+1)*.03);ctx.restore();
    for(let i=0;i<4;i++){const q=(lt*1.3+i/4)%1;ctx.save();ctx.globalAlpha=1-q;ctx.fillStyle='#7cc6ff';ctx.strokeStyle=INK;ctx.lineWidth=4;
      const dx=ch.top[0]-60+(i%2)*90,dy=ch.top[1]+190+q*260;ctx.beginPath();ctx.moveTo(dx,dy-16);ctx.quadraticCurveTo(dx+11,dy,dx,dy+8);ctx.quadraticCurveTo(dx-11,dy,dx,dy-16);ctx.fill();ctx.stroke();ctx.restore();}
    steam(ch.top[0]-30,ch.top[1]-10,lt,200,3,45);}
  txt('ISLAK ÇORAPLAR',540,400,100,{fill:'#7cc6ff',maxW:960,sc:back(p(lt,.05,.35))});
}
// 13) Akşamları herkes sobalı odada (29.16 - 31.85)
function k13(lt){
  bg('#f1e3c8');
  windowBox(740,540,250,270,{sky:'#24325a',inner:()=>{ctx.fillStyle='#f6e7a6';ctx.beginPath();ctx.arc(900,620,46,0,Math.PI*2);ctx.fill();ctx.fillStyle='#24325a';ctx.beginPath();ctx.arc(920,608,40,0,Math.PI*2);ctx.fill();snow(lt,14,'#fff');}});
  ground();vignette(.55);
  stove(540,GY,1.0,1,lt,{pipeDX:65,pipeH:330});
  const seat=GY-110,people=[[170,1,0],[330,1,2],[760,-1,1],[915,-1,3]];
  people.forEach(([x,d,i],j)=>{const pp=back(p(lt,.1+j*.1,.4+j*.1));if(pp<=0)return;ctx.save();ctx.translate(x,GY);ctx.scale(pp,pp);ctx.translate(-x,-GY);
    stool(x,seat,.9);const s=i===2?.75:.9;const base=[{mustache:true},{bun:true,skirt:true},{hair:true},{cap:true,mustache:true}][i];
    const f=sitFig(x,seat,s,d,Object.assign({face:'happy',armL:d>0?[.9,1.6]:[-1.2,-1.0],armR:d>0?[1.2,1.0]:[-.9,-1.6]},base));
    teaGlass((d>0?f.hR:f.hL)[0],(d>0?f.hR:f.hL)[1]+6,1);ctx.restore();});
  txt('HERKES BURADA!',540,420,100,{fill:YEL,maxW:960,sc:back(p(lt,.3,.6))});
}
// 14) Evin geri kalanı buz gibi (31.85 - 33.88)
function k14(lt){
  bg('#e3f2fb');snow(lt,30,'#fff');
  ctx.save();ctx.fillStyle='#bfe3fa';ctx.strokeStyle=INK;ctx.lineWidth=6;for(let i=0;i<11;i++){const x=40+i*95,h=60+hs(i+90)*110;ctx.beginPath();ctx.moveTo(x-28,250);ctx.lineTo(x,250+h);ctx.lineTo(x+28,250);ctx.closePath();ctx.fill();ctx.stroke();}ctx.restore();
  ground();
  txt('BUZ GİBİ!',540,520,140,{fill:'#bfe3ff',sc:back(p(lt,1.0,1.3)),rot:-.04});
  const tx=830,ty=760,lvl=lerp(.6,.08,eout(p(lt,.2,1.6)));
  ctx.save();ctx.strokeStyle=INK;ctx.lineWidth=10;rr(tx-34,ty,68,440,34);ctx.fillStyle='#fff';ctx.fill();ctx.stroke();ctx.beginPath();ctx.arc(tx,ty+470,56,0,Math.PI*2);ctx.fillStyle='#4d7cfe';ctx.fill();ctx.stroke();
  ctx.fillStyle='#4d7cfe';ctx.fillRect(tx-14,ty+420-380*lvl,28,380*lvl+40);ctx.lineWidth=5;for(let i=0;i<6;i++)L(tx+34,ty+40+i*70,tx+56,ty+40+i*70);ctx.restore();
  const sh=Math.sin(lt*60)*5;shadow(400,GY,75);
  const f=fig({x:400+sh,y:GY,face:'cold',scarf:true,look:.4,reachL:P=>[P.sh[0]+45*P.s,P.sh[1]+60*P.s],reachR:P=>[P.sh[0]-45*P.s,P.sh[1]+70*P.s]});
  for(let i=0;i<3;i++){const q=(lt*1.4+i/3)%1;smoke(f.hd[0]+70+q*90,f.hd[1]+20-q*50,10+q*26,.6*(1-q));}
}
// 15) Külü dökmek, sobayı çatmak (33.88 - 35.59)
function k15(lt){
  bg();ground();
  if(lt<.86){txt('KÜLÜ DÖKMEK',540,400,104,{fill:'#d0d0d0',maxW:960,sc:back(p(lt,0,.3))});
    const x=lerp(820,360,lt/.86),ph=lt*12;shadow(x,GY,65);
    const f=fig({x,y:GY,face:'sweat',look:-1,lean:-.06,armR:[.15,.05],armL:[-.6,-.9],legL:[-.35*Math.sin(ph),-.35*Math.sin(ph)-.1],legR:[.35*Math.sin(ph),.35*Math.sin(ph)+.1]});
    bucket(f.hR[0],f.hR[1]-6,1,'ash');
    for(let i=0;i<6;i++){const q=(lt*2+i/6)%1;ctx.save();ctx.globalAlpha=.7*(1-q);ctx.fillStyle='#9d9d9d';ctx.beginPath();ctx.arc(f.hR[0]+q*160+(hs(i)-.5)*60,f.hR[1]-10-q*120,10+q*30,0,Math.PI*2);ctx.fill();ctx.restore();}}
  else{const q=lt-.86;txt('SOBAYI ÇATMAK',540,400,100,{fill:YEL,maxW:960,sc:back(p(q,0,.3))});
    const st=stove(640,GY,1.0,0,lt,{pipeDX:65,pipeH:150});const seg=eout(p(q,.15,.6));
    const px=640+65,pyTop=st.by-150-260+(1-seg)*-120;
    ctx.save();ctx.strokeStyle=INK;ctx.lineWidth=10;ctx.fillStyle='#707077';rr(px-27+(1-seg)*-150,pyTop,54,260,6);ctx.fill();ctx.stroke();ctx.restore();
    ctx.save();ctx.strokeStyle=INK;ctx.lineWidth=9;rr(330,GY-200,150,24,8);ctx.fillStyle='#a8703f';ctx.fill();ctx.stroke();ctx.lineWidth=12;L(345,GY-178,335,GY);L(465,GY-178,475,GY);ctx.restore();
    fig({x:405,y:GY-200,s:1,face:'big',look:1,reachR:[px-20+(1-seg)*-150,pyTop+80],reachL:[px-30+(1-seg)*-150,pyTop+190]});}
}
// 16) Sizin evde kimin göreviydi? + yorum (35.59 - 38.16)
function k16(lt){
  bg();ground();
  txt('SİZİN EVDE',540,330,90,{fill:'#fff',sc:back(p(lt,0,.3))});
  txt('KİMİN GÖREVİYDİ?',540,460,100,{fill:YEL,maxW:960,sc:back(p(lt,.2,.5))});
  const X=[150,330,510,690],sel=Math.floor(lt*3.5)%4;
  for(let i=0;i<4;i++){const pp=back(p(lt,.1+i*.08,.4+i*.08));if(pp<=0)continue;
    ctx.save();ctx.translate(X[i],GY);ctx.scale(pp,pp);ctx.translate(-X[i],-GY);
    if(i===sel&&lt>.5){ctx.fillStyle='rgba(255,210,63,.45)';ctx.beginPath();ctx.ellipse(X[i],GY,95,26,0,0,Math.PI*2);ctx.fill();}
    shadow(X[i],GY,55);const s=i===2?.68:.85;const f=family(i,X[i],GY-(i===sel&&lt>.5?Math.abs(Math.sin(lt*14))*20:0),s,{face:i===sel&&lt>.5?'big':'think',look:0,lookUp:1});
    txt('?',X[i],f.hd[1]-f.r-70,84,{fill:i===sel?YEL:'#fff',sc:back(p(lt,.5+i*.1,.8+i*.1))});ctx.restore();}
  commentBtn(540,620,back(p(lt,1.66,1.96))*(1+.04*Math.sin(lt*6)));
  const ap=eout(p(lt,1.8,2.1));if(ap>0)arrowR(lerp(1300,900,ap)+Math.sin(lt*8)*14,1380,1);
}
// 17) Eskiden böyleydi – takip et (38.16 - 42.74)
function k17(lt){
  bg();ground();
  txt('ESKİDEN',540,380,124,{fill:'#fff',sc:back(p(lt,0,.3))});
  txt('BÖYLEYDİ',540,520,130,{fill:YEL,sc:back(p(lt,.35,.65))});
  const clicked=lt>1.95,bp=back(p(lt,1.0,1.3))*(lt>1.86&&lt<2.05?.9:1);
  if(bp>0){ctx.save();ctx.translate(540,720);ctx.scale(bp,bp);ctx.strokeStyle=INK;ctx.lineWidth=11;rr(-300,-70,600,140,70);ctx.fillStyle=clicked?'#8a8f98':'#e94b4b';ctx.fill();ctx.stroke();
    ctx.fillStyle='#fff';ctx.font=`bold ${clicked?50:62}px ${FONT}`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(clicked?'TAKİPTESİN ✓':'TAKİP ET',45,4);
    ctx.save();ctx.translate(-215,0);ctx.rotate(clicked?Math.sin(lt*30)*.35*Math.max(0,1-(lt-1.95)):0);ctx.fillStyle=YEL;ctx.lineWidth=7;
    ctx.beginPath();ctx.moveTo(-26,22);ctx.quadraticCurveTo(-26,-30,0,-32);ctx.quadraticCurveTo(26,-30,26,22);ctx.closePath();ctx.fill();ctx.stroke();ctx.beginPath();ctx.arc(0,30,8,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.restore();ctx.restore();}
  if(lt>1.3&&lt<2.6){const q=eout(p(lt,1.3,1.86));const cx=lerp(900,600,q),cy=lerp(1050,750,q);ctx.save();ctx.translate(cx,cy);ctx.rotate(-.35);ctx.strokeStyle=INK;ctx.lineWidth=7;ctx.fillStyle='#fff';
    ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(0,80);ctx.lineTo(20,62);ctx.lineTo(36,96);ctx.lineTo(50,90);ctx.lineTo(34,56);ctx.lineTo(60,56);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();}
  if(clicked)for(let i=0;i<16;i++){const q=p(lt,1.95,3.0);if(q>=1)break;const a=i/16*Math.PI*2;ctx.save();ctx.globalAlpha=1-q;ctx.fillStyle=[YEL,RED,'#7cc6ff','#62b061'][i%4];
    ctx.translate(540+Math.cos(a)*q*420,720+Math.sin(a)*q*300+q*q*200);ctx.rotate(q*8+i);ctx.fillRect(-10,-6,20,12);ctx.restore();}
  stove(780,GY,.85,1,lt,{pipeDX:55,pipeH:250});
  shadow(330,GY,75);const wv=Math.sin(lt*9)*.35;
  fig({x:330,y:GY,face:'big',look:.5,armL:[-2.5+wv,-2.9+wv],armR:[.3,.15]});
}

const SC=[{a:0,b:3.24,f:k1},{a:3.24,b:4.48,f:k2},{a:4.48,b:7.07,f:k3},{a:7.07,b:9.37,f:k4},{a:9.37,b:11.13,f:k5},{a:11.13,b:14.59,f:k6},
  {a:14.59,b:16.68,f:k7},{a:16.68,b:19.30,f:k8},{a:19.30,b:22.01,f:k9},{a:22.01,b:24.13,f:k10},{a:24.13,b:26.51,f:k11},{a:26.51,b:29.16,f:k12},
  {a:29.16,b:31.85,f:k13},{a:31.85,b:33.88,f:k14},{a:33.88,b:35.59,f:k15},{a:35.59,b:38.16,f:k16},{a:38.16,b:42.74,f:k17}];
