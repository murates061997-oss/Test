/* ============ 3. bölüm: eve dönüş, sezon sonu hesapları, son maç ============ */
function burstFX(cx, cy, q, col, r = 120) {
  if (q <= 0 || q >= 1) return; ctx.save(); ctx.globalAlpha = 1 - q * q;
  for (let j = 0; j < 18; j++) { const a = j / 18 * Math.PI * 2, d = r * eout(q); circ(cx + Math.cos(a) * d, cy + Math.sin(a) * d + q * q * 30, 6 * (1 - q) + 2, col, 0); }
  ctx.restore();
}
// 31 — gece eve dönüş: Ben uyuyor, Ellie havai fişekleri anlatıyor
scene(417.44, 430.74, T => {
  cam(T, 417.44, 430.74, 1.0, 1.06, 960, 560);
  ctx.fillStyle = '#141a33'; ctx.fillRect(0, 0, W, H);
  // pencereden akan sokak lambaları
  for (let i = 0; i < 6; i++) { const x = ((-T * 500 + i * 420) % 2520 + 2520) % 2520 - 300; ctx.save(); ctx.globalAlpha = .5; circ(x, 260, 30, '#ffe28a', 0); ctx.restore(); }
  // araba içi
  ctx.fillStyle = '#2b2f45'; ctx.fillRect(0, 560, W, 520);
  box(120, 140, 760, 380, 40, null, 10); box(1000, 140, 760, 380, 40, null, 10);
  line(940, 120, 940, 560, 30, '#2b2f45');
  // koltuklar
  box(1150, 520, 420, 520, 60, '#4a4f6a', 6); box(260, 520, 420, 520, 60, '#4a4f6a', 6);
  person({ who: 'dad', apron: false, shirt: '#e9e1d0', x: 1360, y: 1080, sit: true, seat: 330, dir: 1, f: .5, t: T, face: T > 424.68 && T < 425.8 ? 'talk' : 'calm', armR: { w: [1680, 700] } });
  ctx.lineWidth = 12; circ(1720, 700, 90, null, 14); // direksiyon
  person({ who: 'ben', x: 470, y: 1080, sit: true, seat: 300, dir: 1, f: .2, lean: -.2, t: T, face: 'sleep' });
  if (T < 427.6) text('z', 560 + Math.sin(T * 2) * 10, 560 - ((T * 30) % 60), 50, { font: ROUND, weight: 600, fill: '#9fb3ff' });
  person({ who: 'ellie', x: 700, y: 1080, sit: true, seat: 300, dir: 1, f: .5, t: T, face: T > 422.86 ? 'talk' : 'smile', armR: T > 427.6 ? { w: [860 + Math.sin(T * 5) * 30, 620] } : null });
  if (T > 419.88 && T < 422.6) label("Ellie watched with Grandma", 700, 120, 44, pop(T, 419.9), { fill: '#fff', strokeCol: INK });
  speech(780, 430, 'Dad, did you see the finale?', pop(T, 422.86) * (1 - pr(T, 424.5, 424.7)), { tail: -1 });
  if (T > 424.68 && T < 426) speech(1300, 430, 'I did.', pop(T, 424.68), { tail: -1 });
  if (T > 427.6) { thought(560, 380, 520, 300, pop(T, 427.6), () => { ctx.fillStyle = '#1c2340'; ctx.beginPath(); ctx.ellipse(0, 0, 230, 120, 0, 0, Math.PI * 2); ctx.fill(); const q = ((T - 427.6) % 1.4) / 1.4; burstFX(0, 0, q, '#ff5a4a', 110); burstFX(0, 0, clamp(q * 1.4 - .3), '#fff', 60); });
    speech(1100, 260, 'The red ones had these white ones\nthat burst out of the middle!', pop(T, 427.8), { tail: -1, size: 36 }); }
});
scene(430.74, 434.38, T => {
  // baba havai fişekleri yalnızca araba kapağındaki yansımada gördü
  ctx.fillStyle = '#141a33'; ctx.fillRect(0, 0, W, H);
  ctx.save(); ctx.translate(960, 600); ctx.scale(1.4, 1.4);
  ctx.beginPath(); ctx.ellipse(0, 0, 520, 240, 0, 0, Math.PI * 2); fs('#9aa4ae', 8);
  ctx.save(); ctx.beginPath(); ctx.ellipse(0, 0, 520, 240, 0, 0, Math.PI * 2); ctx.clip();
  const g = ctx.createLinearGradient(-520, -240, 520, 240); g.addColorStop(0, '#6c7682'); g.addColorStop(.5, '#cfd6db'); g.addColorStop(1, '#5c6670'); ctx.fillStyle = g; ctx.fillRect(-520, -240, 1040, 480);
  burstFX(-160, -40, pr(T, 431.0, 432.4), '#ffd23f', 130); burstFX(170, 30, pr(T, 432.0, 433.6), '#ff5a4a', 150);
  ctx.restore(); line(-60, -250, 60, -250, 18); ctx.restore();
  label('two flashes in the lid of the cart', 960, 140, 56, pop(T, 430.9), { fill: '#fff', strokeCol: INK });
});
// 32 — Ağustos sıcağı / Eylül maçı / deplasman
scene(434.38, 439.8, T => {
  cam(T, 434.38, 439.8, 1.0, 1.05);
  storeLot(T); ctx.save(); ctx.fillStyle = 'rgba(255,190,90,.25)'; ctx.fillRect(0, 0, W, H); ctx.restore();
  circ(1700, 140, 90, '#ffd23f', 6); for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2 + T * .3; line(1700 + Math.cos(a) * 110, 140 + Math.sin(a) * 110, 1700 + Math.cos(a) * 150, 140 + Math.sin(a) * 150, 7, '#f2a33a'); }
  ctx.save(); ctx.globalAlpha = .4; for (let i = 0; i < 5; i++) { ctx.beginPath(); for (let k = 0; k <= 20; k++) { const x = 200 + i * 350 + Math.sin(k * .8 + T * 4) * 12, y = 900 - k * 14; k ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.strokeStyle = '#fff'; ctx.lineWidth = 4; ctx.stroke(); } ctx.restore();
  person({ who: 'dad', x: 1040, y: 930, s: .9, f: -.2, t: T, face: 'sad' }); cart(960, 1000, .85);
  circ(1130, 500, 10, '#7cc6ff', 3);
  badge('August: 4 hot dogs / hour', 960, 240, pop(T, 434.6), { size: 56 });
});
function stadium(T, lit = 1, crowd = 1) {
  ctx.fillStyle = '#121a33'; ctx.fillRect(0, 0, W, H);
  for (const x of [220, 1700]) { limb([[x, 700], [x, 140]], 18, '#555', 4); box(x - 90, 80, 180, 80, 8, lit ? '#fff7cf' : '#444', 5); if (lit) { ctx.save(); const g = ctx.createRadialGradient(x, 120, 0, x, 120, 600); g.addColorStop(0, 'rgba(255,250,210,.35)'); g.addColorStop(1, 'rgba(255,250,210,0)'); ctx.fillStyle = g; ctx.fillRect(x - 600, 0, 1200, 900); ctx.restore(); } }
  for (let r = 0; r < 5; r++) { box(300, 300 + r * 70, 1320, 22, 4, '#7d8590', 4); if (crowd) for (let i = 0; i < 22; i++) if (hs(r * 30 + i) > .25) circ(330 + i * 58 + (r % 2) * 20, 286 + r * 70, 18, ['#d6493a', '#fff', '#f2c230'][(r + i) % 3], 3); }
  ground(700, lit ? '#3f7a3a' : '#2a4430'); for (let i = 0; i < 9; i++) line(i * 240, 700, i * 240 - 120, H, 4, 'rgba(255,255,255,.6)');
}
scene(439.8, 450.82, T => {
  const away = T > 445.82;
  stadium(T, away ? 0 : 1, away ? 0 : 1);
  person({ who: 'dad', x: 1040, y: 930, s: .9, f: -.2, t: T, face: away ? 'sad' : 'grin', armL: away ? null : { w: [880 + Math.sin(T * 10) * 40, 610] } }); cart(960, 1000, .85);
  if (!away) { const n = 9; for (let i = n - 1; i >= 0; i--) extra(i + 3, { x: 640 - i * 70, y: 1000 - (i % 2) * 12, s: .55, f: .6, t: T + i, seed: i, face: 'smile' });
    badge('Friday night football', 960, 120, pop(T, 439.9), { size: 50 });
    const n93 = Math.round(93 * eout(pr(T, 441.9, 444.4))); badge(n93 + ' in 40 minutes', 1500, 260, pop(T, 441.9), { size: 56, bg: '#e6f2d8' }); }
  else { for (let i = 0; i < 6; i++) box(160 + (i % 3) * 120, 900 - Math.floor(i / 3) * 100, 110, 96, 6, '#c9a46a', 5); label('2× buns', 340, 640, 50, pop(T, 445.9), { fill: '#fff', strokeCol: INK });
    if (T > 448.6) { ctx.save(); ctx.translate(1400, 380); ctx.rotate(-.06); box(-260, -70, 520, 140, 12, '#fff6e2', 6); text('HOME TEAM: AWAY', 0, 4, 54, { font: ROUND, weight: 600, fill: RED2 }); ctx.restore(); } }
});
scene(450.82, 453.02, T => {
  ctx.fillStyle = '#efe6d6'; ctx.fillRect(0, 0, W, H);
  box(560, 140, 800, 640, 24, '#fff', 8); box(560, 140, 800, 100, 24, '#4f7fb0', 8); text('SCHEDULE', 960, 192, 64, { font: ROUND, weight: 600, fill: '#fff' });
  ['Fri  · HOME  vs. Eagles', 'Fri  · AWAY  @ Hawks', 'Fri  · HOME  vs. Bears'].forEach((r, i) => text(r, 640, 320 + i * 110, 54, { align: 'left' }));
  ctx.save(); ctx.globalAlpha = pop(T, 451); ctx.strokeStyle = RED; ctx.lineWidth = 8; ctx.beginPath(); ctx.ellipse(880, 430, 270, 50, 0, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
  label('lesson: check the schedule', 960, 900, 60, pop(T, 451.2));
});
// 33 — kahvaltı: artık ekmekten tost
scene(453.02, 461.8, T => {
  cam(T, 453.02, 461.8, 1.0, 1.06, 900, 640);
  houseKitchen({});
  poly([[380, 760], [1540, 760], [1640, 860], [280, 860]], WOOD, 6); box(280, 860, 1360, 30, 6, WOOD2, 5);
  plate(820, 800, 1.2);
  const bites = T > 458.64 ? 3 : T > 457 ? 1 : 0;
  person({ who: 'ben', x: 820, y: 1010, s: 1.05, f: .2, t: T, face: (T > 456.66 && T < 458.4) || T > 460.12 ? 'talk' : 'smile',
    armR: { w: [940, 720] }, holdR: bites < 3 ? () => { rr(-60, -20, 120, 34, 16); fs('#c88a3c', 4); rr(-56, -24, 112, 14, 6); fs('#f2d39a', 3); if (bites) circ(56, -10, 20, '#f3e6c8', 0); } : null });
  person({ who: 'dad', apron: false, shirt: '#e9e1d0', x: 1300, y: 1010, f: -.4, t: T, face: 'smile' });
  label('toast, from leftover buns', 960, 140, 50, pop(T, 453.3));
  speech(820, 400, "That's my hot dog bun.", pop(T, 456.66) * (1 - pr(T, 458.4, 458.6)), { tail: -1 });
  if (T > 458.64 && T < 460) label('Yep. Finished it.', 1300, 340, 46, pop(T, 458.64));
  if (T > 460.12) speech(820, 400, 'Can you put a hot dog\nin the next one?', pop(T, 460.12), { tail: -1 });
});
// 34 — Emily'nin hesap kâğıdı
scene(461.8, 494.52, T => {
  cam(T, 461.8, 494.52, 1.0, 1.04, 900, 540);
  ctx.fillStyle = '#e8dcc6'; ctx.fillRect(0, 0, W, H); for (let i = 0; i < 9; i++) line(0, i * 130, W, i * 130 + 40, 40, 'rgba(160,110,60,.08)');
  paper(700, 540, 1160, 960, -.01);
  text('One $4 Classic', 700, 110, 64, { font: ROUND, weight: 600 });
  // maliyet kalemleri
  const parts = [['hot dog', 465.9], ['bun', 466.6], ['toppings', 467.3], ['wrapper', 468.4]];
  parts.forEach(([p, at], i) => { const k = back(pop(T, at)); if (!k) return; ctx.save(); ctx.translate(250 + i * 180, 250); ctx.scale(k, k);
    if (i === 0) { rr(-70, -14, 140, 28, 14); fs('#c4553a', 4); } if (i === 1) { rr(-64, -18, 128, 36, 18); fs('#e9b36a', 4); } if (i === 2) { box(-40, -30, 26, 60, 8, MUSTARD, 3); for (let j = 0; j < 3; j++) circ(10 + j * 14, 10, 8, '#7cb342', 2); } if (i === 3) { box(-50, -30, 100, 60, 4, '#fff', 3); line(-40, -20, 40, 20, 2, '#ccc'); }
    text(p, 0, 60, 36, {}); ctx.restore(); });
  if (T > 469.5) { text('= $1.32 cost', 1070, 250, 56, { font: ROUND, weight: 600, fill: RED2 }); }
  if (T > 472.2) { writeLines(['$4.00 − $1.32 − card fee', '≈ $2.50 left'], 210, 400, 50, pr(T, 472.2, 474.6) * 2, { colors: [INK, '#3f7f2a'] }); }
  if (T > 475.64) { const ic = [['spot', 476.1], ['propane', 477.3], ['towing', 478.4]]; ic.forEach(([n, at], i) => { const k = pop(T, at); if (!k) return; badge('− ' + n, 960 + i * 0 + 0, 400 + i * 70 - 30 + 0, k, { size: 34, bg: '#fbe1dc', col: RED2, sc: .9, rot: 0 }); }); }
  if (T > 480.44) { writeLines(['$85 spot ÷ $2.50 = 34 classics'], 210, 620, 54, pr(T, 480.6, 483.5), { fill: INK });
    if (T > 484.6) { ctx.save(); ctx.globalAlpha = pop(T, 484.6); ctx.strokeStyle = RED; ctx.lineWidth = 6; ctx.beginPath(); ctx.ellipse(705, 622, 130, 46, 0, 0, Math.PI * 2); ctx.stroke(); ctx.restore(); text('just to cover the fee', 705, 690, 36, { fill: RED2 }); } }
  if (T > 486.54) { // yağmurlu gün
    const k = pop(T, 486.54); ctx.save(); ctx.globalAlpha = k; ctx.translate(1530, 280); ctx.fillStyle = '#9aa6b5'; for (const [dx, dy, r] of [[0, 0, 60], [60, -20, 70], [120, 0, 55]]) { ctx.beginPath(); ctx.arc(dx, dy, r, 0, Math.PI * 2); ctx.fill(); }
    ctx.strokeStyle = '#6f86a6'; ctx.lineWidth = 5; for (let i = 0; i < 6; i++) { const y = 60 + ((T * 200 + i * 40) % 120); line(-20 + i * 30, y, -30 + i * 30, y + 26, 5, '#6f86a6'); } ctx.restore();
    label('rainy day: 34 = all day', 1580, 470, 46, k); }
  if (T > 489.92) { writeLines(['Company lunch: paid for 80', 'whether 80 show up or not ✓'], 210, 800, 52, pr(T, 490, 493.5) * 2, { colors: ['#2d3e66', '#3f7f2a'] }); }
  if (T > 461.9) { const ek = pop(T, 462, .6); person({ who: 'emily', x: 1650, y: 1120, s: 1.05, f: -.35, t: T, face: T > 489.9 ? 'smile' : 'focus', armL: { w: [lerp(1500, 1280, eio(ek)), 820] } }); }
});
// 35 — altı ay: $9,420 − $8,000 = +$1,420
scene(494.52, 517.86, T => {
  ctx.fillStyle = '#f3ead8'; ctx.fillRect(0, 0, W, H);
  label('May → October: six months', 960, 110, 60, pop(T, 494.6), { font: ROUND, weight: 600, stroke: 0 });
  const costs = ['food', 'event fees', 'card fees', 'shared kitchen', 'fuel', 'other costs'];
  costs.forEach((c, i) => { const k = pop(T, 500.3 + i * .6); if (k) badge('− ' + c, 260 + (i % 3) * 330, 250 + Math.floor(i / 3) * 90, k, { size: 36, bg: '#fbe1dc', col: RED2, rot: 0 }); });
  const base = 900, sc = 600 / 9420;
  const k1 = eout(pop(T, 505.6, .8)); ctx.save(); ctx.translate(0, base); ctx.scale(1, -1); box(1200, 0, 200, 9420 * sc * k1, 12, '#7cb342', 6); if (T > 510.24) box(1460, 0, 200, 8000 * sc * eout(pop(T, 510.3, .8)), 12, '#c9ced3', 6); ctx.restore();
  label('$9,420', 1300, base - 9420 * sc * k1 - 40, 60, pop(T, 505.6), { font: ROUND, weight: 600, stroke: 0 }); label('before taxes', 1300, base + 40, 38, pop(T, 505.6));
  if (T > 510.24) { label('$8,000', 1560, base - 8000 * sc - 40, 60, pop(T, 510.3), { font: ROUND, weight: 600, stroke: 0 }); label('put in up front', 1560, base + 40, 38, pop(T, 510.3)); }
  if (T > 512.6) badge('+$1,420', 520, 640, pop(T, 512.6), { size: 120, bg: '#e6f2d8', col: '#3f7f2a' });
  if (T > 515.2) { const k = back(pop(T, 515.2)); ctx.save(); ctx.translate(520, 860); ctx.scale(k, k); box(-90, -70, 180, 140, 30, '#bfe0f5', 6); box(-100, -90, 200, 30, 10, '#9aa3aa', 5); text('TAXES', 0, 6, 44, { font: ROUND, weight: 600 }); ctx.restore(); label('…still owed', 760, 870, 46, pop(T, 515.6)); }
});
// 36 — dizüstünde takvim: 19 cumartesi, 4 maç
scene(517.86, 521.24, T => {
  cam(T, 517.86, 521.24, 1.0, 1.05, 960, 600);
  tableNight(T, { dark: true }); metalChair(560, 1000, 1, 1); metalChair(1360, 1000, 1, -1);
  person({ who: 'dad', apron: false, shirt: '#e9e1d0', x: 560, y: 1000, sit: true, dir: 1, f: .35, t: T, face: 'focus', armL: { w: [760, 770] }, headDX: 0 });
  const turn = eio(pr(T, 518, 519.2));
  person({ who: 'emily', x: 1360, y: 1000, sit: true, dir: -1, f: -.35, t: T, face: 'calm', armL: { w: [lerp(1120, 1060, turn), 770] }, armR: { w: [1170, 790] } });
  woodTable(960, 800, 900);
  laptop(lerp(1100, 960, turn), 770, 1.2, lerp(-1, 1, turn) || .01, () => { box(-60, -112, 120, 70, 4, '#e6f2d8', 2); text('$9,420', 0, -78, 26, { font: ROUND, weight: 600 }); });
});
scene(521.24, 542.52, T => {
  ctx.fillStyle = '#2f3337'; ctx.fillRect(0, 0, W, H);
  box(110, 60, 1700, 960, 20, '#f7f9fb', 6);
  const nov = T > 528.02; const title = nov ? 'NOVEMBER' : 'MAY – OCTOBER';
  text(title, 960, 120, 60, { font: ROUND, weight: 600, fill: '#4f7fb0' });
  if (!nov) {
    // 26 cumartesi: 19 tanesinde araba, 4 tanesinde softbol
    for (let i = 0; i < 26; i++) { const x = 220 + (i % 9) * 190, y = 230 + Math.floor(i / 9) * 190; box(x - 80, y - 70, 160, 150, 12, '#eef1f4', 3);
      text('Sat', x, y - 44, 28, { font: ROUND, weight: 500, fill: '#8a9099' });
      const cartDay = i < 19 ? pop(T, 522.74 + i * .08, .3) : 0, gameDay = [3, 9, 14, 22].indexOf(i);
      if (i < 26 && [3, 9, 14, 22].includes(i)) { if (T > 525.32) { const k = pop(T, 525.32 + gameDay * .25, .3); if (k) { ctx.save(); ctx.globalAlpha = k; softball(x, y + 20, 34); ctx.restore(); } } }
      else if (cartDay) { ctx.save(); ctx.globalAlpha = cartDay; hotdog(x, y + 20, .8); ctx.restore(); } }
    badge('19 Saturdays with the cart', 620, 900, pop(T, 523), { size: 46 });
    if (T > 525.32) badge('4 games, start to finish', 1320, 900, pop(T, 525.32), { size: 46, bg: '#fff9c8' });
  } else {
    const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']; days.forEach((d, i) => text(d, 260 + i * 236, 220, 36, { font: ROUND, weight: 600, fill: '#8a9099' }));
    for (let w = 0; w < 3; w++) for (let d = 0; d < 7; d++) { const x = 260 + d * 236, y = 330 + w * 180; box(x - 105, y - 70, 210, 150, 12, '#eef1f4', 3); }
    [[1, 0], [3, 1]].forEach(([d, w], i) => { const k = pop(T, 528.2 + i * .5); if (!k) return; const x = 260 + d * 236, y = 330 + w * 180; ctx.save(); ctx.globalAlpha = k; box(x - 95, y - 50, 190, 110, 10, '#ffe1a8', 3); text('company', x, y - 18, 30, {}); text('lunch', x, y + 20, 30, {}); ctx.restore(); });
    if (T > 530.26) label('both on weekdays', 600, 900, 50, pop(T, 530.26), { stroke: 0 });
    // aynı cumartesi: market + son maç
    const x = 260 + 5 * 236, y = 330 + 2 * 180;
    if (T > 538.18) { ctx.save(); ctx.globalAlpha = pop(T, 538.2); box(x - 95, y - 60, 190, 130, 10, '#e7f2dc', 3); softball(x - 50, y, 26); text('last game', x + 24, y - 16, 26, {}); text('11:00', x + 24, y + 18, 26, { font: ROUND, weight: 600 }); ctx.restore(); }
    if (T > 531.62) { const k = back(pop(T, 531.62)); ctx.save(); ctx.translate(1330, 760); ctx.scale(k, k); box(-330, -110, 660, 220, 24, '#fff', 6); box(-330, -110, 660, 56, 24, '#6aa84f', 6); text('Farmers Market', 0, -82, 34, { font: ROUND, weight: 600, fill: '#fff' });
      text('Last outdoor market of the year!', 0, -10, 38, {}); text("We saved your usual spot.", 0, 46, 38, {}); ctx.restore();
      if (T > 538.18) { ctx.save(); ctx.globalAlpha = pop(T, 538.3); line(1330, 650, x, y + 80, 6, RED); ctx.restore(); } }
    if (T > 540.46) badge('This time, you knew.', 960, 960, pop(T, 540.46), { size: 52, bg: '#fff1a8' });
  }
});
// 37 — cumartesi 10:55: araba garajda, baba tribünde
scene(542.52, 546.3, T => {
  cam(T, 542.52, 546.3, 1.0, 1.08, 960, 560);
  ctx.fillStyle = '#d8ccb6'; ctx.fillRect(0, 0, W, H); for (let x = 0; x < W; x += 140) line(x, 0, x, 780, 2, 'rgba(90,70,50,.15)'); ground(780, '#a8a196');
  cart(860, 1000, .9, { umbrella: false });
  box(1300, 240, 520, 260, 10, '#bfe0f5', 6); clock(1560, 370, 100, 10, 55);
  badge('Saturday · 10:55', 1560, 560, pop(T, 542.7), { size: 50 });
  label('the cart stays in the garage', 860, 160, 54, pop(T, 543.2));
});
scene(546.3, 568.8, T => {
  // tribün: baba, Emily iki kahveyle, Ben foliye sarılı sosisli; Ellie vuruyor
  const wide = T > 556.8;
  ctx.save();
  if (!wide) { ctx.translate(320, 360); ctx.scale(1.9, 1.9); ctx.translate(-320, -360); }
  else { const z = lerp(1.0, 1.0, 0); ctx.translate(0, 0); }
  sky('#bfe0f2', '#eef6e6'); for (let i = 0; i < 8; i++) tree(-40 + i * 280, 470, .8, '#d49a4a'); // sonbahar
  ground(470, '#8fc06a');
  ctx.beginPath(); ctx.moveTo(960, 1000); ctx.lineTo(360, 640); ctx.quadraticCurveTo(960, 420, 1560, 640); ctx.closePath(); fs('#d9a876', 5); ell(960, 600, 260, 70, '#8fc06a', 4);
  const bases = [[1350, 680], [960, 540], [570, 680]];
  for (const [bx, by] of bases) { ctx.save(); ctx.translate(bx, by); ctx.rotate(Math.PI / 4); box(-16, -16, 32, 32, 3, '#fff', 4); ctx.restore(); }
  poly([[940, 905], [980, 905], [985, 920], [960, 932], [935, 920]], '#fff', 4);
  // tribün
  for (let r = 0; r < 3; r++) box(40 + r * 20, 430 - r * 60, 600 - r * 40, 18, 4, '#b8c0c6', 4);
  for (let i = 0; i < 5; i++) if (i !== 1 && i !== 2 && i !== 3) extra(i + 2, { x: 110 + i * 110, y: 430 - 60 + 140 * .36 + 4, s: .36, sit: true, seat: 140, noLegs: true, f: .2, face: 'smile', t: T, seed: i });
  const sy = 430 + 140 * .4 - 4, cheer = T > 564.66;
  person({ who: 'dad', apron: false, shirt: '#e9e1d0', x: 330, y: sy, s: .4, sit: true, seat: 140, noLegs: true, f: .3, t: T, face: cheer ? 'laugh' : 'smile', armR: cheer ? { w: [380, sy - 170] } : null });
  const ew = eio(pr(T, 547.64, 549.4));
  person({ who: 'emily', x: lerp(-60, 220, ew), y: ew < 1 ? sy + 40 : sy, s: .4, sit: ew >= 1, seat: 140, noLegs: ew >= 1, walk: ew < 1 ? T * 7 : undefined, f: .4, t: T, face: 'smile', armL: { w: [lerp(-60, 220, ew) - 40, sy - 40] }, holdL: () => coffee(0, 14, .6), armR: { w: [lerp(-60, 220, ew) + 40, sy - 40] }, holdR: () => coffee(0, 14, .6) });
  person({ who: 'ben', x: 440, y: sy, s: .42, sit: true, seat: 120, noLegs: true, f: -.2, t: T, face: T > 554.7 ? 'grin' : 'focus', armL: { w: [420, sy - 70] }, holdL: () => { if (T < 552.4) { rr(-50, -20, 100, 34, 14); fs('#cfd6db', 4); } else hotdog(0, -6, .6, 0, { ketchup: true }); } });
  // Ellie vuruş
  const hx = 900, sw1 = clamp((T - 557.4) * 4), sw2 = clamp((T - 559.5) * 4), sw = T < 559.4 ? sw1 * (1 - clamp((T - 558.3) * 2)) : sw2;
  const run = eio(pr(T, 560.2, 561.9));
  const ex = lerp(hx, 1350, run), ey = lerp(860, 680, run);
  if (wide) person({ who: 'ellie', x: ex, y: ey, s: .55, f: T > 561.8 ? -.6 : -.2, hat: 'helmet', t: T, walk: run > 0 && run < 1 ? T * 9 : undefined, face: T > 559.5 ? 'grin' : 'focus',
    armL: run > 0 ? null : { w: [lerp(860, 1010, sw), lerp(640, 690, sw)] }, armR: run > 0 ? (T > 561.9 ? { w: [ex + 60, ey - 330] } : null) : { w: [lerp(880, 1000, sw), lerp(650, 700, sw)] },
    holdR: run > 0 ? null : () => { ctx.save(); ctx.rotate(lerp(-2.2, .3, sw)); limb([[0, 0], [0, -130]], 12, '#c58b4a', 3); ctx.restore(); } });
  if (T > 557.26 && T < 558.6) { const q = pr(T, 557.26, 558.3); softball(lerp(960, 960, q), lerp(560, 900, q), 12); }
  if (T > 559.42) { const q = pr(T, 559.6, 561.4); if (q < 1) softball(lerp(960, 300, q), lerp(700, 560, q) - Math.sin(q * Math.PI) * 120, 12); }
  ctx.restore();
  if (T > 554.74 && T < 556.8) badge("ketchup — a $4 Ben's Plain", 960, 120, pop(T, 554.74), { size: 50 });
  if (T > 559.42 && T < 562) label('past third base!', 600, 200, 60, pop(T, 559.6), { fill: RED2 });
  if (T > 565.9) { // telefon kaydı
    const k = back(pop(T, 565.9)); ctx.save(); ctx.translate(1620, 330); ctx.scale(k, k); phone(0, 0, 1.6, .05, () => { ctx.fillStyle = '#8fc06a'; ctx.fillRect(-50, 0, 100, 100); circ(-30, -80, 7, RED, 0); text('REC', 0, -80, 18, { font: ROUND, weight: 600, fill: RED2 }); for (let i = 0; i < 9; i++) { const h = 8 + Math.abs(Math.sin(T * 9 + i)) * 40; box(-40 + i * 10, -20 - h / 2, 6, h, 3, '#2f3337', 0); } }); ctx.restore();
    label("this time, you can hear yourself cheering", 960, 110, 52, pop(T, 566.2)); }
});
// 38 — kapanış soruları
scene(568.8, 593, T => {
  ctx.fillStyle = '#f3ead8'; ctx.fillRect(0, 0, W, H);
  if (T < 576.1) {
    label('Where would you set up your cart?', 960, 110, 64, pop(T, 568.9), { font: ROUND, weight: 600, stroke: 0 });
    const k1 = back(pop(T, 570.9)), k2 = back(pop(T, 573.1));
    if (k1) { ctx.save(); ctx.translate(500, 560); ctx.scale(k1, k1); box(-380, -300, 760, 600, 30, '#fff', 6); ctx.save(); rr(-380, -300, 760, 600, 30); ctx.clip(); ctx.translate(-380, -300); ctx.scale(760 / W, 760 / W); marketBG(T); cart(1100, 1000, .9); ctx.restore(); rr(-380, -300, 760, 600, 30); fs(null, 6);
      box(-360, 150, 720, 130, 20, 'rgba(255,255,255,.92)', 4); text('Same market,', 0, 190, 46, {}); text('every Saturday?', 0, 240, 46, {}); ctx.restore(); }
    if (k2) { ctx.save(); ctx.translate(1420, 560); ctx.scale(k2, k2); box(-380, -300, 760, 600, 30, '#fff', 6); ctx.save(); rr(-380, -300, 760, 600, 30); ctx.clip(); ctx.translate(-380, -300); ctx.scale(760 / W, 760 / W); ctx.fillStyle = '#d8d4cc'; ctx.fillRect(0, 0, W, H); cart(960, 1000, .9); for (let i = 0; i < 8; i++) extra(i, { x: 200 + i * 80, y: 1000, s: .6, f: .6, face: 'smile' }); ctx.restore(); rr(-380, -300, 760, 600, 30); fs(null, 6);
      box(-360, 150, 720, 130, 20, 'rgba(255,255,255,.92)', 4); text('Events where you know how', 0, 190, 42, {}); text("many meals you're paid for?", 0, 240, 42, {}); ctx.restore(); }
    text('or', 960, 560, 70, { font: ROUND, weight: 600, fill: RED2 });
  } else if (T < 579.78) {
    person({ who: 'ben', x: 760, y: 1000, s: 1.35, f: .3, t: T, face: 'grin', armR: { w: [960, 700] }, holdR: () => hotdog(0, -20, 1, -.1, { ketchup: true }) });
    speech(1250, 400, 'Is Ben right\nabout ketchup?', pop(T, 576.1), { size: 70, tail: -1 });
    if (T > 578.64) { const k = back(pop(T, 578.64)); ctx.save(); ctx.translate(1300, 760); ctx.scale(k, k); box(-260, -60, 520, 120, 60, RED, 6); text('Tell me in the comments', 0, 4, 44, { font: ROUND, weight: 600, fill: '#fff' }); ctx.restore(); }
  } else {
    // iş fikri + abone ol
    const k = back(pop(T, 579.9)); ctx.save(); ctx.translate(560, 420); ctx.scale(k, k); circ(0, -40, 130, '#ffe28a', 8); box(-50, 80, 100, 70, 14, '#9aa3aa', 6); line(-40, 30, 0, -40, 8, '#e0a020'); line(40, 30, 0, -40, 8, '#e0a020'); ctx.restore();
    label('Got a business you want covered?', 560, 680, 56, pop(T, 580.2), { font: ROUND, weight: 600, stroke: 0 });
    if (T > 583) label('Your idea could get a shout-out.', 560, 760, 48, pop(T, 583));
    if (T > 585.98) { const b = back(pop(T, 586)); ctx.save(); ctx.translate(1400, 400); ctx.scale(b, b); box(-260, -70, 520, 140, 70, '#fff', 6); text('LIKE', 0, 4, 60, { font: ROUND, weight: 600 }); ctx.restore();
      const b2 = back(pop(T, 586.6)); ctx.save(); ctx.translate(1400, 600); ctx.scale(b2, b2); box(-300, -70, 600, 140, 70, RED, 6); text('SUBSCRIBE', 0, 4, 64, { font: ROUND, weight: 600, fill: '#fff' }); ctx.restore();
      person({ who: 'dad', x: 1400, y: 1110, s: .7, f: 0, t: T, face: 'grin', armR: { w: [1560, 820 + Math.sin(T * 8) * 20] } }); }
  }
});
