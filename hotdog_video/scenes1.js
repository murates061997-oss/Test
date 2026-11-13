/* ============ ortak mekânlar ============ */
function marketBG(T, o = {}) {
  sky('#cde5f0', '#f6eedb');
  cloudShape(200 + (T * 6) % 2200 - 200, 140, 1.1); cloudShape(1300 + (T * 4) % 2200 - 600, 90, .8);
  for (let i = 0; i < 7; i++) tree(-60 + i * 330, 640, .9 + hs(i) * .3, i % 2 ? '#86b366' : '#78a85b');
  ground(640, '#cfc6b4');
  ctx.save(); ctx.globalAlpha = .25; for (let i = 0; i < 20; i++) line(i * 110 - 40, 820, i * 110 + 30, 820, 6, '#fff'); ctx.restore();
  const cols = [['#e8b84a', '#fff4d6'], ['#6aa6c9', '#eaf4fb'], ['#7fb35a', '#eef7e3'], ['#e07a5f', '#fbe9e3']];
  if (o.tents !== false) [[170, 'veg'], [660, 'tom'], [1680, 'veg']].forEach(([x, g], i) => {
    if (o.skipTent === i) return;
    tent(x, 760, 360, 300, cols[i][0], cols[i][1], { goods: g === 'tom' ? (cx, cy) => tomatoes(cx, cy) : (cx, cy) => veggies(cx, cy) }); });
}
function houseKitchen(o = {}) {
  ctx.fillStyle = o.night ? '#e8d8b8' : '#f3e6c8'; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = 'rgba(200,140,90,.13)'; for (let x = 0; x < W; x += 80) ctx.fillRect(x, 0, 30, 700);
  ground(760, '#d9c3a0'); ctx.strokeStyle = 'rgba(120,80,50,.2)'; ctx.lineWidth = 3; for (let x = -200; x < W; x += 160) line(x, 760, x - 120, H, 3, 'rgba(120,80,50,.2)');
  // pencere
  box(760, 150, 420, 300, 10, o.night ? '#2d3e66' : '#bfe0f5', 8); line(970, 150, 970, 450, 6); line(760, 300, 1180, 300, 6);
  if (o.night) { ctx.fillStyle = '#fff5c0'; circ(1100, 220, 26, '#fff5c0', 0); }
  // dolaplar
  for (let i = 0; i < 3; i++) box(80 + i * 200, 110, 190, 230, 10, WOOD, 5);
  for (let i = 0; i < 3; i++) box(1260 + i * 200, 110, 190, 230, 10, WOOD, 5);
  box(40, 520, 1840, 40, 6, '#e9e4da', 5);
  for (let i = 0; i < 9; i++) { if (o.dw && i === 6) continue; box(60 + i * 205, 560, 195, 200, 8, WOOD2, 5); circ(60 + i * 205 + 97, 600, 7, '#eee', 3); }
  // buzdolabı
  box(1640, 180, 240, 580, 18, '#e8ecef', 6); line(1640, 400, 1880, 400, 5); line(1670, 260, 1670, 360, 8); line(1670, 440, 1670, 560, 8);
}
function dishwasher(x, y, open) {
  box(x, y, 195, 200, 8, '#cfd6db', 5); line(x + 20, y + 26, x + 175, y + 26, 6);
  if (open > 0) { ctx.save(); ctx.translate(x, y + 200); ctx.scale(1, -Math.cos(open * Math.PI / 2)); box(0, 0, 195, 200, 8, '#dfe4e7', 5); ctx.restore(); }
}
function tableNight(T, o = {}) {
  // ekran görüntüsündeki kompozisyon: tuğla duvar, kırmızı şerit, sarkıt lambalar, ortada masa
  brickWall(0, 0, W, 760, o.wall || '#f4ecdf');
  box(-10, 300, W + 20, 26, 0, RED, 0); box(-10, 600, W + 20, 18, 0, RED, 0);
  ctx.fillStyle = '#efe4d2'; ctx.fillRect(0, 0, W, 70); line(0, 70, W, 70, 4);
  if (o.window !== false) { box(700, 170, 520, 300, 10, o.dark ? '#24304f' : '#bcd9ea', 8); line(960, 170, 960, 470, 6); if (o.dark) { circ(1120, 230, 22, '#fff4c4', 0); for (let i = 0; i < 12; i++) circ(720 + hs(i) * 480, 190 + hs(i + 9) * 150, 2.5, '#fff', 0); } }
  ground(760, '#e2d7c4'); for (let i = 0; i < 140; i++) circ(hs(i) * W, 770 + hs(i + 3) * 300, 3 + hs(i + 7) * 3, ['#c9b9a0', '#b6a48a', '#ddd0bb'][i % 3], 0);
  lamp(560, 140, 140, 1); lamp(1360, 140, 140, 1); lamp(960, 110, 110, .8);
}
function metalChair(x, gy, s, dir) {
  ctx.save(); ctx.translate(x, gy); ctx.scale(s * dir, s);
  limb([[-60, -230], [-80, -470]], 18, '#3a3a3c', 4); limb([[-80, -470], [-30, -480]], 18, '#3a3a3c', 4);
  for (let i = 0; i < 3; i++) line(-66 - i * 4, -420 + i * 60, -20, -420 + i * 60, 10, '#3a3a3c');
  limb([[-70, -230], [80, -230]], 22, '#3a3a3c', 4);
  limb([[-60, -225], [-80, 0]], 14, '#3a3a3c', 4); limb([[70, -225], [85, 0]], 14, '#3a3a3c', 4);
  ctx.restore();
}
function woodTable(x, y, w, d = 70) {
  ctx.save(); poly([[x - w / 2 + 30, y - d], [x + w / 2 - 30, y - d], [x + w / 2, y], [x - w / 2, y]], WOOD, 5);
  box(x - w / 2, y, w, 30, 6, WOOD2, 5); limb([[x, y + 30], [x, 1000]], 30, '#4a4442', 4); ell(x, 1004, 110, 18, '#4a4442', 4); ctx.restore();
}
function laptop(x, y, s, dir, screen) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s * dir, s);
  poly([[-90, 0], [90, 0], [110, 14], [-110, 14]], '#c9ced3', 4);
  ctx.save(); ctx.transform(1, 0, -.18, 1, 0, 0); box(-80, -130, 160, 128, 8, '#2f3337', 4);
  ctx.save(); rr(-72, -122, 144, 110, 4); ctx.clip(); ctx.fillStyle = '#eef6fb'; ctx.fillRect(-72, -122, 144, 110); if (screen) { ctx.scale(dir, 1); screen(); } ctx.restore(); ctx.restore();
  ctx.restore();
}
function cashBox(x, y, s = 1, open = 0) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); box(-70, -50, 140, 50, 6, '#5a7f5a', 4); if (open > 0) { ctx.save(); ctx.translate(-70, -50); ctx.rotate(-open * 1.1); box(0, -14, 140, 14, 4, '#4b6b4b', 4); ctx.restore(); } else box(-72, -60, 144, 14, 4, '#4b6b4b', 4); ctx.restore(); }

/* ============ SAHNELER ============ */
// 1 — $4'lık sosisli, "üstü kalsın"
scene(0, 5.18, T => {
  cam(T, 0, 5.18, 1.0, 1.06, 900, 600);
  marketBG(T);
  const cx = 1180, dad = person({ who: 'dad', x: cx + 80, y: 930, s: .95, f: -.45, t: T, face: T > 3.6 ? 'smile' : 'calm',
    armL: { w: T < 1.6 ? [lerp(1020, 860, eio(pr(T, .2, 1.4))), 640] : (T > 2.1 && T < 3.9 ? [lerp(1060, 900, eio(pr(T, 2.1, 2.8))), 610] : [1080, 700]) },
    holdL: T < 1.4 ? () => hotdog(0, -10, .7) : (T > 2.8 && T < 3.9 ? () => bill(0, 0, .6, -.2) : null) });
  cart(cx, 1000, .9, { menu: true });
  const cust = extra(0, { x: 640, y: 1000, f: .5, t: T, face: T > 3.4 ? 'smile' : 'calm',
    armR: { w: T > 1.2 && T < 2.0 ? [820, 650] : T >= 2.0 && T < 2.9 ? [lerp(740, 890, eio(pr(T, 2.0, 2.8))), 610] : [760, 700] },
    holdR: T > 1.3 && T < 2.85 ? (T < 2.0 ? () => hotdog(0, -12, .7) : () => bill(0, 0, .6, -.2)) : null,
    armL: T > 2.0 ? { w: [560, 760] } : null, holdL: T > 2.0 ? () => hotdog(0, -14, .7) : null });
  badge('$4', 960, 300, pop(T, .4), { size: 70 });
  speech(560, 330, 'Keep the change!', pop(T, 3.5), { tail: 1 });
});
// 2 — kasaya koy, telefona bak
scene(5.18, 12.34, T => {
  cam(T, 5.18, 12.34, 1.55, 1.7, 1250, 560);
  marketBG(T);
  const ph = T > 7.0;
  person({ who: 'dad', x: 1260, y: 930, s: .95, f: ph ? -.1 : -.45, t: T, face: T > 7.6 ? 'grin' : 'calm', look: ph ? [0, 1] : [0, 0],
    armL: ph ? { w: [1215, 610] } : { w: [lerp(1100, 1000, eio(pr(T, 5.3, 6.2))), lerp(600, 640, eio(pr(T, 5.3, 6.2)))] },
    armR: ph ? { w: [1290, 615] } : null,
    holdL: !ph && T < 6.2 ? () => bill(0, 0, .6, -.2) : null });
  cart(1180, 1000, .9);
  cashBox(1000, 704, .9, T < 6.6 ? 1 : 0);
  if (ph) { const k = pop(T, 7.0, .5); phone(1252, 600 + (1 - k) * 60, .55, 0, () => { ctx.fillStyle = '#9ccc6e'; ctx.fillRect(-50, 0, 100, 100); circ(-10, 30, 18, HEAD, 3); ctx.beginPath(); ctx.moveTo(-8, -14); ctx.lineTo(16, 0); ctx.lineTo(-8, 14); ctx.closePath(); ctx.fillStyle = '#fff'; ctx.fill(); }); }
  label("Ellie's first hit!", 1250, 330, 54, pop(T, 7.9), { fill: RED2 });
  if (T > 10.76) speech(1420, 470, 'Emily sent a video', pop(T, 10.76), { size: 34, tail: -1 });
});
// 3 — telefonda maç videosu; tribündeki boş yer
function fieldWorld(T, o = {}) {
  sky('#bfe0f2', '#eef6e6');
  for (let i = 0; i < 8; i++) tree(-40 + i * 280, 470, .8, '#7aaa5c');
  ground(470, '#8fc06a');
  // çit
  ctx.save(); ctx.strokeStyle = 'rgba(70,70,70,.35)'; ctx.lineWidth = 2; for (let x = 0; x < W; x += 26) { line(x, 330, x + 60, 470, 2, 'rgba(70,70,70,.35)'); line(x + 60, 330, x, 470, 2, 'rgba(70,70,70,.35)'); } ctx.restore();
  line(0, 330, W, 330, 6, '#777'); for (let x = 0; x < W; x += 240) line(x, 330, x, 470, 6, '#777');
  // iç saha toprağı
  ctx.beginPath(); ctx.moveTo(960, 1000); ctx.lineTo(360, 640); ctx.quadraticCurveTo(960, 420, 1560, 640); ctx.closePath(); fs('#d9a876', 5);
  ell(960, 600, 260, 70, '#8fc06a', 4);
  for (const [bx, by] of [[1350, 680], [960, 540], [570, 680]]) { ctx.save(); ctx.translate(bx, by); ctx.rotate(Math.PI / 4); box(-16, -16, 32, 32, 3, '#fff', 4); ctx.restore(); }
  poly([[940, 905], [980, 905], [985, 920], [960, 932], [935, 920]], '#fff', 4);
  // tribün (solda)
  if (o.bleachers !== false) bleachers(30, 470, 640, 4, o.crowd || 0, o.family ? [[1, 1], [1, 2], [1, 3]] : null);
  if (o.family) { const y = 470 - 40 - 60 + 140 * .36, x0 = 30 + 70 + 20, st = (640 - 140 - 40) / 5;
    person({ who: 'emily', x: x0 + st, y, s: .36, sit: true, seat: 140, noLegs: true, f: .2, face: 'smile' });
    box(x0 + 2 * st - 34, y - 70, 68, 30, 8, '#4f7fb0', 4); // ceketle tutulan yer
    person({ who: 'ben', x: x0 + 3 * st, y, s: .4, sit: true, seat: 120, noLegs: true, f: -.2, face: 'grin' }); }
}
function bleachers(x, y, w, rows, seed = 0, empty) {
  for (let r = 0; r < rows; r++) { const yy = y - 40 - r * 60; box(x + r * 20, yy, w - r * 40, 18, 4, '#b8c0c6', 4); }
  limb([[x + 20, y], [x + 80, y - 260]], 10, '#8f989e', 3); limb([[x + w - 20, y], [x + w - 80, y - 260]], 10, '#8f989e', 3);
  // seyirciler
  for (let r = 0; r < rows; r++) for (let i = 0; i < 6; i++) {
    const px = x + 70 + r * 20 + i * (w - 140 - r * 40) / 5, py = y - 40 - r * 60;
    if (empty && empty.some(e => e[0] === r && e[1] === i)) continue;
    if (hs(r * 7 + i + seed) < .3) continue;
    extra(r * 6 + i + seed, { x: px, y: py + 140 * .32, s: .32, sit: true, seat: 140, noLegs: true, f: .1, face: 'smile' });
  }
}
scene(12.34, 19.1, T => {
  // yatay telefon ekranı içinde video
  const z = 1 + .9 * eio(pr(T, 15.1, 16.6));
  const fx = 330, fy = 330;
  ctx.fillStyle = '#e9dfcf'; ctx.fillRect(0, 0, W, H);
  ctx.save(); ctx.translate(W / 2, H / 2 - 20);
  box(-860, -440, 1720, 880, 70, '#2f2c2b', 8);
  ctx.save(); rr(-800, -400, 1600, 800, 24); ctx.clip(); ctx.translate(-800, -400); ctx.scale(1600 / W, 1600 / W); ctx.translate(0, -60);
  ctx.translate(fx, fy); ctx.scale(z, z); ctx.translate(-fx, -fy);
  fieldWorld(T, { crowd: 3, family: true });
  // vuruş: her tekrar 2.6 sn
  const rp = ((T - 12.34) % 2.6) / 2.6, swing = clamp((rp - .25) * 5);
  person({ who: 'ellie', x: 900, y: 860, s: .55, f: -.2, hat: 'helmet', face: rp > .4 ? 'grin' : 'focus', armL: { w: [lerp(860, 1010, swing), lerp(640, 690, swing)] }, armR: { w: [lerp(880, 1000, swing), lerp(650, 700, swing)] },
    holdR: () => { ctx.save(); ctx.rotate(lerp(-2.2, .3, swing)); limb([[0, 0], [0, -130]], 12, '#c58b4a', 3); ctx.restore(); } });
  if (rp > .3) { const q = (rp - .3) / .7; softball(lerp(960, 1700, q), lerp(680, 380, q) - Math.sin(q * Math.PI) * 260, 12); }
  else softball(lerp(960, 960, 0), 560 + rp * 300, 10);
  if (T > 15.1) { const ex = 30 + 70 + 20 + 2 * (640 - 140 - 40) / 5, ey = 470 - 140; ctx.save(); ctx.globalAlpha = pop(T, 15.6, .6); ell(ex, ey + 10, 50, 46, null, 6); ctx.strokeStyle = RED; ctx.lineWidth = 7; ctx.beginPath(); ctx.ellipse(ex, ey + 10, 50, 46, 0, 0, Math.PI * 2); ctx.stroke(); ctx.restore(); }
  ctx.restore();
  // oynatma arayüzü
  ctx.save(); ctx.globalAlpha = .9; box(-760, 300, 1520, 12, 6, 'rgba(255,255,255,.5)', 0); box(-760, 300, 1520 * ((T - 12.34) % 2.6) / 2.6, 12, 6, '#fff', 0); ctx.restore();
  const rep = Math.min(3, 1 + Math.floor((T - 12.34) / 2.6));
  badge('replay ×' + rep, 600, -330, 1, { size: 40, bg: 'rgba(255,255,255,.92)' });
  ctx.restore();
  label('the spot they saved for you', 960, 52, 50, pop(T, 16.4), { fill: RED2 });
});
// 4 — ev: iki araçlık garaj, tek araba sığıyor
function house(T, o = {}) {
  sky('#cfe5f1', '#f4eedd'); cloudShape(300, 140); cloudShape(1500, 110, .8);
  tree(140, 760, 1.2); tree(1800, 760, 1.1, '#86b366');
  ground(760, '#a9c97f');
  poly([[420, 760], [1500, 760], [1700, H], [220, H]], '#cfc8bb', 5);
  // ev gövdesi
  box(300, 380, 1320, 380, 6, '#e9dcc4', 6);
  poly([[260, 390], [960, 150], [1660, 390]], '#8a5a4a', 6);
  for (let y = 420; y < 760; y += 38) line(300, y, 1620, y, 2, 'rgba(120,90,60,.18)');
  box(360, 450, 200, 160, 6, '#bfe0f5', 6); line(460, 450, 460, 610, 5);
  // garaj kapıları
  const gx = [700, 1130];
  box(640, 470, 860, 290, 6, '#d8ccb6', 6);
  gx.forEach((x, i) => { box(x - 200, 500, 380, 260, 6, i === 0 && o.open ? '#5c544c' : '#f2ede4', 5);
    if (!(i === 0 && o.open)) for (let k = 1; k < 4; k++) line(x - 200, 500 + k * 65, x + 180, 500 + k * 65, 3); });
  if (o.open) { // içeride araba ve diğer tarafta yığın
    const cxr = 690; box(cxr - 170, 600, 340, 120, 30, '#4f7fb0', 5); box(cxr - 120, 560, 240, 70, 24, '#4f7fb0', 5); box(cxr - 100, 572, 200, 46, 10, '#bfe0f5', 4);
    circ(cxr - 110, 720, 30, '#333', 4); circ(cxr + 110, 720, 30, '#333', 4); }
}
scene(19.1, 28.94, T => {
  cam(T, 19.1, 28.94, 1.0, 1.08, 960, 600);
  house(T, { open: true });
  person({ who: 'dad', x: 1500, y: 1020, s: .8, f: -.3, t: T, apron: false, shirt: '#5f7fa8', face: 'smile' });
  badge("You're 34", 1500, 330, pop(T, 23.06), { size: 52 });
  // harita iğnesi
  if (T > 23.98) { const k = back(pop(T, 23.98)); ctx.save(); ctx.translate(200, 260); ctx.scale(k, k); ctx.beginPath(); ctx.arc(0, -40, 34, Math.PI, 0); ctx.lineTo(0, 30); ctx.closePath(); fs(RED, 5); circ(0, -40, 12, '#fff', 4); ctx.restore();
    label('outside Columbus, Ohio', 430, 230, 50, pop(T, 24.2)); }
  label('2-car garage', 1070, 430, 44, pop(T, 26.3)); label('= 1 car', 1070, 480, 44, pop(T, 28.2), { fill: RED2 });
});
// 5 — garajın öbür yarısı: bisikletler, Noel ışıkları, 6 yıllık raf
scene(28.94, 34.84, T => {
  cam(T, 28.94, 34.84, 1.05, 1.12, 960, 560);
  ctx.fillStyle = '#d8ccb6'; ctx.fillRect(0, 0, W, H); for (let x = 0; x < W; x += 140) line(x, 0, x, 780, 2, 'rgba(90,70,50,.15)');
  ground(780, '#a8a196');
  // bisikletler
  const bike = (x, y, s, c) => { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); circ(-110, 0, 80, null, 8); circ(110, 0, 80, null, 8); poly([[-110, 0], [-20, -110], [70, -110], [110, 0], [0, 0]], null, 10); ctx.strokeStyle = c; ctx.lineWidth = 6; ctx.stroke(); line(70, -110, 60, -160, 8); line(40, -165, 90, -160, 8); line(-30, -120, -40, -150, 8); line(-70, -150, -10, -150, 10); ctx.restore(); };
  bike(380, 690, 1, '#d6493a'); bike(560, 720, .7, '#4f7fb0'); bike(270, 740, .55, '#7cb342');
  // noel ışıkları kutusu
  box(820, 610, 260, 170, 8, '#c9a46a', 5); text('XMAS', 950, 700, 50, { font: ROUND, weight: 600, fill: '#7a4a2c' });
  ctx.beginPath(); ctx.moveTo(840, 610); for (let i = 0; i < 14; i++) ctx.quadraticCurveTo(860 + i * 22, 560 + (i % 2) * 70, 870 + i * 22, 600 - (i % 3) * 20); ctx.lineWidth = 4; ctx.strokeStyle = '#2f5a2a'; ctx.stroke();
  for (let i = 0; i < 12; i++) circ(860 + i * 24, 580 + (i % 3) * 18, 9, ['#e94b4b', '#ffd23f', '#5fb0e6', '#7cc35f'][i % 4], 3);
  // duvara yaslı raf
  ctx.save(); ctx.translate(1450, 780); ctx.rotate(-.18); box(-40, -560, 380, 34, 6, WOOD, 5); box(-40, -380, 380, 34, 6, WOOD, 5); box(-40, -200, 380, 34, 6, WOOD, 5); limb([[-30, 0], [-30, -560]], 22, WOOD2, 4); limb([[330, 0], [330, -560]], 22, WOOD2, 4); ctx.restore();
  // örümcek ağı
  ctx.save(); ctx.globalAlpha = .5; for (let i = 0; i < 5; i++) line(1880, 0, 1880 - Math.cos(i * .35) * 200, Math.sin(i * .35) * 200, 2, '#666'); for (let r = 50; r < 200; r += 50) { ctx.beginPath(); ctx.arc(1880, 0, r, Math.PI / 2, Math.PI); ctx.strokeStyle = '#666'; ctx.lineWidth = 2; ctx.stroke(); } ctx.restore();
  label('bikes', 420, 470, 50, pop(T, 29.6)); label('Christmas lights', 950, 470, 50, pop(T, 31.2));
  label('"I\'ll put it up this weekend"', 1520, 160, 46, pop(T, 32.4)); badge('6 years', 1540, 260, pop(T, 33.66), { size: 50, col: RED2 });
});
// 6 — hafta içi: dağıtım merkezi
scene(34.84, 37.06, T => {
  cam(T, 34.84, 37.06, 1.0, 1.06);
  ctx.fillStyle = '#e7e2d8'; ctx.fillRect(0, 0, W, H); ground(820, '#bdb6aa');
  for (let r = 0; r < 3; r++) { const x0 = 60 + r * 640; for (let k = 0; k < 4; k++) { box(x0, 180 + k * 160, 560, 18, 3, '#e08a3c', 4); for (let b = 0; b < 4; b++) box(x0 + 20 + b * 135, 80 + k * 160, 110, 100, 4, '#c9a46a', 4); } limb([[x0 + 10, 820], [x0 + 10, 60]], 14, '#4f7fb0', 3); limb([[x0 + 550, 820], [x0 + 550, 60]], 14, '#4f7fb0', 3); }
  const wx = lerp(500, 1200, pr(T, 34.84, 37.06));
  person({ who: 'dad', apron: false, shirt: '#f2a33a', x: wx, y: 1000, s: .9, f: .5, walk: T * 7, t: T, face: 'calm', armL: [90, 40], armR: [-30, 40], holdR: () => box(-80, -110, 170, 120, 6, '#c9a46a', 5) });
  label('Weekdays: distribution center', 960, 960, 54, pop(T, 35.1));
});
// 7 — Emily: diş hekimi muayenehanesi
scene(37.06, 40.64, T => {
  cam(T, 37.06, 40.64, 1.0, 1.06, 900, 600);
  ctx.fillStyle = '#dff0ee'; ctx.fillRect(0, 0, W, H); ground(820, '#c9d6d2');
  box(1200, 200, 260, 320, 8, '#fff', 6); ctx.save(); ctx.translate(1330, 360); ctx.beginPath(); ctx.moveTo(-70, -80); ctx.quadraticCurveTo(0, -120, 70, -80); ctx.quadraticCurveTo(90, 40, 40, 110); ctx.lineTo(10, 30); ctx.lineTo(-10, 30); ctx.lineTo(-40, 110); ctx.quadraticCurveTo(-90, 40, -70, -80); fs('#fff', 6); ctx.restore();
  // takvim
  box(420, 180, 360, 300, 8, '#fff', 6); box(420, 180, 360, 60, 8, RED, 6); for (let i = 0; i < 4; i++) for (let j = 0; j < 5; j++) box(440 + j * 66, 260 + i * 52, 54, 40, 4, (i * 5 + j) % 3 ? '#f4f4f4' : '#ffe1a8', 2);
  person({ who: 'emily', x: 900, y: 1000, s: .95, f: .3, t: T, face: 'talk', armR: { w: [1000, 730] }, armL: { w: [960, 738] }, sit: true, seat: 230, dir: 1 });
  box(780, 720, 600, 300, 10, '#f6f2ea', 6); box(1080, 590, 200, 130, 8, '#2f3337', 5); box(1090, 600, 180, 110, 4, '#eef6fb', 2); for (let i = 0; i < 4; i++) box(1105, 612 + i * 24, 150, 16, 3, i === 1 ? '#ffe1a8' : '#dfe8ee', 0);
  label('Emily · dental office', 960, 930, 56, pop(T, 37.4));
});
// 8 — çocuklar: Ellie 9, Ben 6; ketçap dışındaki her şey israf
scene(40.64, 50.24, T => {
  cam(T, 40.64, 50.24, 1.0, 1.05);
  sky('#d8ebf3', '#f6efdc'); tree(160, 780); ground(780, '#a9c97f');
  person({ who: 'ellie', x: 520, y: 980, s: 1.05, f: .3, t: T, face: 'grin', armR: { w: [600, 770] }, holdR: () => { ctx.save(); ctx.rotate(.45); limb([[0, 20], [0, -250]], 16, '#c58b4a', 4); ctx.restore(); } });
  badge('Ellie · 9', 520, 230, pop(T, 40.8), { size: 52 });
  const bx = 1050;
  person({ who: 'ben', x: bx, y: 980, s: 1.05, f: .2, t: T, face: T > 44.4 ? 'flat' : 'smile', armR: { w: [bx + 110, 760] }, holdR: () => hotdog(0, -20, .7, -.2, { ketchup: true }) });
  badge('Ben · 6', bx, 330, pop(T, 42.46), { size: 52 });
  if (T > 44.38) { // diğer malzemeler -> çöp
    const k = pop(T, 44.4, .6); ctx.save(); ctx.globalAlpha = k;
    hotdog(1450, 470, 1.2, 0, { onion: true, relish: true }); hotdog(1450, 600, 1.2, 0, { chili: true });
    line(1340, 410, 1560, 660, 12, RED); line(1560, 410, 1340, 660, 12, RED); ctx.restore();
    if (T > 46.9) { const q = eio(pr(T, 46.9, 48.8)); ctx.save(); ctx.translate(1700, 900); box(-80, -170, 160, 170, 10, '#8f9aa6', 5); box(-95, -190, 190, 26, 8, '#7b8692', 5); for (let i = -1; i <= 1; i++) line(i * 40, -150, i * 40, -20, 5, '#5c6670'); ctx.restore();
      hotdog(lerp(1450, 1700, q), lerp(540, 720, q) - Math.sin(q * Math.PI) * 120, 1.2 * (1 - q * .4), q * 3, { onion: true, relish: true }); }
    label('just a slower way of throwing it away', 1450, 220, 44, pop(T, 46.9));
  }
});
// 9 — pazar akşamı garaj önünde mangal; Mike: "Bunları satmalısın"
scene(50.24, 59.1, T => {
  cam(T, 50.24, 59.1, 1.0, 1.1, 900, 640);
  sky('#f6c79a', '#fbe7c6'); circ(1600, 520, 90, '#ffd59a', 0);
  house(T, {}); ctx.save(); ctx.fillStyle = 'rgba(255,170,90,.18)'; ctx.fillRect(0, 0, W, H); ctx.restore();
  // mangal
  const gx = 860; limb([[gx - 70, 1000], [gx - 50, 840]], 10, '#333', 3); limb([[gx + 70, 1000], [gx + 50, 840]], 10, '#333', 3);
  ctx.beginPath(); ctx.ellipse(gx, 830, 130, 70, 0, 0, Math.PI); fs('#3a3634', 5); line(gx - 130, 830, gx + 130, 830, 6);
  for (let i = 0; i < 4; i++) { ctx.save(); ctx.translate(gx - 75 + i * 50, 818); ctx.rotate(.2); rr(-40, -10, 80, 20, 10); fs('#c4553a', 4); ctx.restore(); }
  for (let i = 0; i < 3; i++) { const q = ((T * .5 + i / 3) % 1); ctx.save(); ctx.globalAlpha = Math.sin(q * Math.PI) * .6; circ(gx - 40 + i * 40 + Math.sin(T * 2 + i) * 15, 780 - q * 240, 22 + q * 30, '#eee', 0); ctx.restore(); }
  person({ who: 'dad', apron: false, shirt: '#e9e1d0', x: 640, y: 1010, s: .95, f: .5, t: T, face: 'smile', armR: { w: [790, 790] }, holdR: () => { line(0, 0, 70, 20, 8, '#888'); } });
  const reach = pr(T, 54.8, 56.2);
  person({ who: 'mike', x: 1180, y: 1010, s: .95, f: -.5, t: T, face: T > 57.88 ? 'talk' : 'smile', armL: { w: [lerp(1120, 960, eio(reach) * (T < 57 ? 1 : 1 - pr(T, 57, 57.6))), lerp(780, 800, reach)] }, armR: { w: [1090, 700] }, holdR: () => { plate(0, 0, .8); hotdog(-14, -14, .45); hotdog(14, -20, .45); } });
  extra(4, { x: 1450, y: 1010, s: .85, f: -.4, t: T, face: 'smile', armL: { w: [1400, 700] }, holdL: () => hotdog(0, -12, .5) });
  extra(3, { x: 1650, y: 1010, s: .85, f: -.5, t: T, face: 'laugh' });
  label('Sunday evening', 300, 200, 56, pop(T, 50.4));
  badge('#3', 1000, 640, pop(T, 55.4), { size: 44 });
  speech(1200, 400, 'You ought to sell these.', pop(T, 57.88), { tail: -1 });
});
// 10 — mutfak: Emily bulaşık makinesini kapatır
scene(59.1, 63.48, T => {
  cam(T, 59.1, 63.48, 1.0, 1.05, 1300, 600);
  houseKitchen({ dw: true });
  const open = 1 - eio(pr(T, 60.6, 61.4)); dishwasher(1290, 560, open);
  person({ who: 'emily', x: 1180, y: 1000, s: 1, f: T > 61.6 ? -.45 : .5, t: T, face: T > 62.08 ? 'talk' : 'flat', armR: { w: [lerp(1330, 1300, 1 - open), lerp(800, 640, 1 - open)] } });
  person({ who: 'dad', apron: false, shirt: '#e9e1d0', x: 560, y: 1000, s: 1, f: .5, t: T, face: 'grin', walk: T < 60 ? T * 7 : undefined });
  speech(1160, 330, 'Is Mike going to pay for them?', pop(T, 62.08), { tail: -1 });
});
// 11 — gece mutfak masası: hesaplar
scene(63.48, 75.28, T => {
  cam(T, 63.48, 75.28, 1.0, 1.04, 960, 600);
  tableNight(T, { dark: true });
  metalChair(560, 1000, 1, 1); metalChair(1360, 1000, 1, -1);
  person({ who: 'dad', apron: false, shirt: '#e9e1d0', x: 560, y: 1000, sit: true, dir: 1, f: .35, t: T, face: T > 70.62 ? 'o' : 'focus', armL: { w: [780, 760] }, armR: { w: [820, 760] } });
  person({ who: 'emily', x: 1360, y: 1000, sit: true, dir: -1, f: -.35, t: T, face: 'focus', armL: { w: [1100, 760] }, armR: { w: [1140, 760] } });
  woodTable(960, 800, 900);
  laptop(810, 770, 1, 1, () => { box(-60, -112, 120, 60, 4, '#d7dde2', 2); text('$5,400', 0, -36, 26, { font: ROUND, weight: 600 }); });
  laptop(1110, 770, 1, -1, () => { for (let i = 0; i < 5; i++) line(-60, -108 + i * 18, 60, -108 + i * 18, 2, '#9bb'); });
  // açılır pencereler
  const hide = 1 - pr(T, 70.3, 70.7), pop1 = pop(T, 66.86) * hide, pop2 = pop(T, 68.8) * hide;
  if (pop1 > 0) { ctx.save(); ctx.translate(560, 260); ctx.scale(back(pop1), back(pop1)); box(-230, -120, 460, 240, 16, '#fff', 6); box(-230, -120, 460, 50, 16, '#4f7fb0', 6); text('Used hot dog cart', 0, -95, 34, { font: ROUND, weight: 500, fill: '#fff' });
    ctx.save(); ctx.scale(.35, .35); cart(-300, 300, 1, { umbrella: false, sign: false, bottles: false }); ctx.restore(); text('FOR SALE', 110, 30, 44, { font: ROUND, weight: 600, fill: RED2 }); ctx.restore(); }
  if (pop2 > 0) { ctx.save(); ctx.translate(1360, 260); ctx.scale(back(pop2), back(pop2)); box(-230, -120, 460, 240, 16, '#fff', 6); box(-230, -120, 460, 50, 16, '#6aa84f', 6); text('Household budget', 0, -95, 34, { font: ROUND, weight: 500, fill: '#fff' });
    for (let i = 0; i < 4; i++) { line(-200, -40 + i * 40, 60, -40 + i * 40, 3, '#bbb'); text(['mortgage', 'groceries', 'car', 'savings'][i], -200, -50 + i * 40, 26, { align: 'left' }); }
    if (T > 70.62) { ctx.save(); ctx.globalAlpha = pop(T, 70.62); rr(70, 55, 140, 36, 8); fs('#fff1a8', 3); ctx.restore(); text('$18,000', 140, 74, 28, { font: ROUND, weight: 600 }); } ctx.restore(); }
  // birikim çubuğu
  if (T > 70.62) { const k = pop(T, 70.62), sp = eio(pr(T, 73.42, 74.4)); ctx.save(); ctx.translate(960, 250); ctx.scale(back(k), back(k));
    box(-400 - sp * 20, -50, 400, 100, 18, '#7cb342', 6); box(sp * 20, -50, 400, 100, 18, sp > 0 ? '#c9ced3' : '#7cb342', 6);
    text(sp > 0 ? '$9,000 to spend' : '$18,000 savings', sp > 0 ? -200 : 0, 2, 44, { font: ROUND, weight: 600, fill: '#fff', stroke: 8, strokeCol: INK });
    if (sp > 0) { ctx.globalAlpha = sp; text("$9,000 — don't touch", 200 + sp * 20, 2, 40, { font: ROUND, weight: 600, fill: '#fff', stroke: 8, strokeCol: INK }); } ctx.restore(); }
});
// 12 — 18 yaşındaki klima; üstüne yazılmış tarih
scene(75.28, 82.62, T => {
  cam(T, 75.28, 82.62, 1.0, 1.12, 1000, 640);
  sky('#d4e7f0', '#f3ecda'); box(0, 120, W, 700, 0, '#e9dcc4', 0); for (let y = 140; y < 820; y += 38) line(0, y, W, y, 2, 'rgba(120,90,60,.18)'); ground(820, '#a9c97f');
  // klima ünitesi
  ctx.save(); ctx.translate(980, 820);
  box(-230, -380, 460, 380, 14, '#c9c2b0', 6);
  ctx.save(); rr(-230, -380, 460, 380, 14); ctx.clip(); for (let i = 0; i < 18; i++) line(-230, -360 + i * 21, 230, -360 + i * 21, 3, 'rgba(90,80,60,.35)'); ctx.fillStyle = 'rgba(150,90,40,.25)'; for (let i = 0; i < 9; i++) { ctx.beginPath(); ctx.ellipse(-200 + hs(i) * 400, -300 + hs(i + 5) * 260, 30, 18, 0, 0, Math.PI * 2); ctx.fill(); } ctx.restore();
  circ(0, -200, 140, '#b7af9c', 5); for (let i = 0; i < 4; i++) { ctx.save(); ctx.translate(0, -200); ctx.rotate(i * Math.PI / 2 + T * (T > 80 ? 0 : .3)); ell(0, -60, 30, 60, '#8f877a', 4); ctx.restore(); }
  // teknisyenin yazdığı tarih
  if (T > 77.46) { ctx.save(); ctx.globalAlpha = pop(T, 77.8); box(-150, -372, 300, 70, 6, '#f3efe2', 4); writeLines(['next: 06/2027 ?'], -134, -337, 44, pr(T, 77.8, 79.6) * 1, { fill: RED2 }); ctx.restore(); }
  ctx.restore();
  badge('18 years old', 520, 300, pop(T, 75.6), { size: 56 });
  person({ who: 'dad', apron: false, shirt: '#e9e1d0', x: 330, y: 1020, s: .85, f: .5, t: T, face: T > 81 ? 'worried' : 'flat' });
  person({ who: 'emily', x: 1600, y: 1020, s: .85, f: -.5, t: T, face: T > 81 ? 'worried' : 'flat' });
  label("Neither of you asked.", 980, 960, 52, pop(T, 81.12));
});
// 13 — Dayton yakınında ikinci el araba: $5,400
scene(82.62, 93.24, T => {
  cam(T, 82.62, 93.24, 1.0, 1.08, 900, 640);
  sky('#c9e1ee', '#f3ecda'); for (let i = 0; i < 6; i++) tree(-80 + i * 380, 700, .8); ground(700, '#b9b4ab'); line(0, 880, W, 880, 6, '#f5f1e6');
  // satıcının arabası (bagaj açık)
  ctx.save(); ctx.translate(1450, 900); box(-260, -220, 520, 170, 40, '#8f6f5a', 6); box(-170, -320, 300, 120, 30, '#8f6f5a', 6); box(-150, -305, 120, 80, 10, '#bfe0f5', 4); box(-10, -305, 120, 80, 10, '#bfe0f5', 4);
  ctx.save(); ctx.translate(250, -220); ctx.rotate(-.9); box(-10, -140, 30, 150, 6, '#7a5c4a', 5); ctx.restore(); circ(-160, -40, 50, '#333', 5); circ(160, -40, 50, '#333', 5); ctx.restore();
  const wind = Math.sin(T * 3) * .5 + .5;
  cart(620, 1000, .85, { sign: false, bottles: false });
  const hand = pr(T, 85.9, 88.5);
  extra(1, { x: 1180, y: 1000, s: .95, f: -.5, t: T, face: T > 90.14 && T < 93 ? 'talk' : 'smile', armL: { w: [lerp(1500, 1040, eio(hand)), lerp(680, 640, eio(hand))] }, holdL: T > 86.5 ? () => box(-50, -20, 96, 30, 8, '#dfe4e7', 4) : null });
  person({ who: 'dad', apron: false, shirt: '#e9e1d0', x: 920, y: 1000, s: .95, f: .5, t: T, face: 'smile', armR: hand > .9 ? { w: [1030, 650] } : null });
  badge('$5,400', 620, 230, pop(T, 83.4), { size: 70 }); label('near Dayton', 620, 330, 44, pop(T, 83.0));
  // rüzgâr çizgileri
  if (T > 90) { ctx.save(); ctx.globalAlpha = .6; for (let i = 0; i < 4; i++) { const x = ((T * 600 + i * 500) % 2400) - 300; ctx.beginPath(); ctx.moveTo(x, 300 + i * 90); ctx.quadraticCurveTo(x + 120, 280 + i * 90, x + 240, 300 + i * 90); ctx.arc(x + 240, 280 + i * 90, 20, Math.PI / 2, -Math.PI); ctx.lineWidth = 5; ctx.strokeStyle = '#fff'; ctx.stroke(); } ctx.restore(); }
  speech(1220, 420, "Don't leave this open\nwhen it's windy.", pop(T, 90.14), { tail: -1 });
  if (T > 91.92) speech(1500, 220, "That's my second one.", pop(T, 91.92), { tail: -1, size: 38 });
});
// 14 — masraf listesi: $8,000; 2,000 tane $4'lık banknot
function receiptIcon(kind, x, y, s = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  if (kind === 'tank') { box(-26, -50, 52, 90, 22, '#e9edf0', 4); box(-14, -64, 28, 16, 4, '#9aa3aa', 3); }
  if (kind === 'cooler') { box(-50, -30, 100, 66, 8, '#4f7fb0', 4); box(-50, -40, 100, 16, 6, '#fff', 4); }
  if (kind === 'doc') { box(-34, -44, 68, 88, 6, '#fff', 4); for (let i = 0; i < 4; i++) line(-22, -26 + i * 16, 22, -26 + i * 16, 3, '#9bb'); circ(18, 30, 10, RED, 3); }
  if (kind === 'card') { box(-44, -50, 88, 100, 10, '#2f3337', 4); box(-34, -40, 68, 36, 4, '#bfe0f5', 2); for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) circ(-22 + j * 22, 10 + i * 14, 4, '#ccc', 0); }
  if (kind === 'cart') { ctx.scale(.16, .16); cart(0, 300, 1, { umbrella: false, bottles: false, sign: false }); }
  ctx.restore();
}
scene(93.24, 122.48, T => {
  ctx.fillStyle = '#e8dcc6'; ctx.fillRect(0, 0, W, H); for (let i = 0; i < 9; i++) line(0, i * 130, W, i * 130 + 40, 40, 'rgba(160,110,60,.08)');
  const shift = eio(pr(T, 114.2, 115.4));
  ctx.save(); ctx.translate(-380 * shift, 0);
  paper(820, 540, 940, 960, -.015);
  text('Startup costs', 820, 120, 64, { font: ROUND, weight: 600 });
  const rows = [['cart', 'Used cart', 5400, 93.3], ['tank', 'Tank, cooler, thermometers,\nhand-wash station', 780, 97.72], ['doc', 'Insurance, permits,\nprep kitchen', 1140, 103.6], ['card', 'Sign, card reader,\nsupplies & packaging', 680, 110.6]];
  rows.forEach(([ic, name, amt, at], i) => { const k = pop(T, i ? at - 2.5 : 93.3); if (k <= 0) return; const y = 250 + i * 150; ctx.save(); ctx.globalAlpha = k;
    receiptIcon(ic, 440, y + 10, 1); name.split('\n').forEach((l, j) => text(l, 520, y - 10 + j * 46 - (name.includes('\n') ? 14 : -10), 44, { align: 'left' }));
    ctx.restore(); if (T > at) label(money(amt), 1180, y + 10, 56, pop(T, at), { font: ROUND, weight: 600, align: 'right', stroke: 0 }); });
  if (T > 112.4) { line(420, 860, 1220, 860, 6); label('TOTAL', 440, 930, 64, pop(T, 112.5), { align: 'left', font: ROUND, weight: 600, stroke: 0 }); badge('$8,000', 1060, 930, pop(T, 112.64), { size: 76, bg: '#fff1a8' }); }
  ctx.restore();
  if (T > 114.42) { // $4'lık banknot yığını
    const k = pop(T, 114.8, .6); ctx.save(); ctx.globalAlpha = k;
    for (let i = 0; i < 14; i++) bill(1520 + (hs(i) - .5) * 120, 720 - i * 18 + (1 - k) * 60, 1.9, (hs(i + 3) - .5) * .3, '4');
    ctx.restore();
    label('÷ $4 = ?', 1520, 260, 70, pop(T, 115.6), { font: ROUND, weight: 600 });
    if (T > 119.74) { badge('2,000', 1520, 380, pop(T, 119.74), { size: 90, bg: '#fff1a8' }); label('...if $4 bills existed', 1520, 960, 46, pop(T, 120.6)); }
  }
});
