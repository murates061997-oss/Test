/* ---------- ortak objeler (soba videosundan) ---------- */
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

