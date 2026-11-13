/* ============ 2. bölüm: isim, menü, ilk günler, festival, 4 Temmuz ============ */
function drawing(x, y, s, title, dog, rot = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  paper(0, 0, 360, 260, 0, '#fffef8', false);
  text(title, 0, dog ? -70 : -10, 52, { fill: ['#d6493a', '#4f7fb0', '#6aa84f'][title.length % 3], maxW: 320 });
  if (dog) dogDoodle(0, 40, 1.3);
  ctx.restore();
}
// 15 — isim: Ellie'nin üç seçeneği, tabela ve vida
scene(122.48, 136.72, T => {
  cam(T, 122.48, 136.72, 1.0, 1.04, 960, 600);
  tableNight(T, { dark: false });
  metalChair(560, 1000, 1, 1);
  person({ who: 'ellie', x: 560, y: 1000, sit: true, seat: 210, dir: 1, f: .3, t: T, face: T > 124.4 ? 'grin' : 'focus', armR: { w: [780, 790] }, holdR: () => { line(0, 0, 20, -50, 10, RED); } });
  person({ who: 'dad', apron: false, shirt: '#e9e1d0', x: 1360, y: 1000, sit: true, dir: -1, f: -.35, t: T, face: T > 133 ? 'grin' : 'smile', armL: { w: [1120, 790] }, armR: { w: [1200, 790] } });
  woodTable(960, 800, 900);
  const items = [['DAD DOGS', false, 126.26], ['DAD DOGS TOO', false, 127.82], ['DAD DOGS AGAIN', true, 129.96]];
  items.forEach(([t, d, at], i) => { const k = back(pop(T, at, .5)); if (k <= 0) return; drawing(480 + i * 480, 330, .95 * k, t, d, (i - 1) * .04); });
  if (T > 133.18) { const k = pop(T, 133.18); ctx.save(); ctx.globalAlpha = k; circ(1440, 170, 46, '#7cb342', 6); ctx.beginPath(); ctx.moveTo(1418, 170); ctx.lineTo(1436, 190); ctx.lineTo(1466, 150); ctx.lineWidth = 9; ctx.strokeStyle = '#fff'; ctx.stroke(); ctx.restore(); }
});
scene(136.72, 146.02, T => {
  // tabela yakın plan: vida köpeğin kuyruğundan geçer, Ellie siyaha boyar
  marketBG(T, { tents: false });
  ctx.save(); ctx.translate(960, 560); ctx.scale(2.2, 2.2); ctx.translate(-960, -560);
  cart(1060, 900, .9, { umbrella: false, screw: T > 138.2, screwBlack: T > 141.8, tailK: 1 });
  ctx.restore();
  // matkap
  if (T < 140.2) { const k = pop(T, 137, .6), q = pr(T, 137.6, 138.3); ctx.save(); ctx.globalAlpha = k; ctx.translate(lerp(640, 560, q), 370); box(-20, -40, 260, 80, 30, '#f2a33a', 6); box(160, 30, 70, 160, 20, '#f2a33a', 6); line(-20, 0, -100, 0, 10, '#888'); ctx.restore(); }
  if (T > 138.4 && T < 141) label('oops — right through the tail', 960, 160, 56, pop(T, 138.6), { fill: RED2 });
  if (T > 140.78) { const q = pr(T, 140.9, 141.8); person({ who: 'ellie', x: 300, y: 1260, s: 1.3, f: .5, t: T, face: T > 144 ? 'grin' : 'focus', armR: { w: [lerp(480, 662, q), lerp(900, 842, q)] }, holdR: () => { ctx.save(); ctx.rotate(.6); box(-12, -70, 24, 90, 6, '#2b2421', 3); ctx.restore(); } }); }
  if (false) { person({ holdL: () => { ctx.save(); ctx.rotate(-.6); box(-12, -70, 24, 90, 6, '#2b2421', 3); ctx.restore(); } }); }
  if (T > 144.14) { label('The dog had its tail back.', 960, 160, 56, pop(T, 144.14)); for (let i = 0; i < 3; i++) { const q = ((T - 144.14) * .7 + i / 3) % 1; ctx.save(); ctx.globalAlpha = Math.sin(q * Math.PI); ctx.translate(620 + i * 60, 740 - q * 100); ctx.scale(1.4, 1.4); ctx.beginPath(); ctx.moveTo(0, 8); ctx.bezierCurveTo(-18, -6, -8, -20, 0, -10); ctx.bezierCurveTo(8, -20, 18, -6, 0, 8); fs(RED, 3); ctx.restore(); } }
});
// 16 — menü panosu; Ben'in "düz"ü
scene(146.02, 166.04, T => {
  cam(T, 146.02, 166.04, 1.0, 1.05, 900, 560);
  brickWall(0, 0, W, 820, '#efe6d6'); box(-10, 640, W + 20, 20, 0, RED, 0); ground(820, '#d6cbb7');
  const k = T < 147.42 ? 0 : T < 151.76 ? .2 + pr(T, 147.42, 148.2) * .8 : T < 153.46 ? 1 + pr(T, 151.76, 152.4) : T < 156.2 ? 2 + pr(T, 153.46, 154.1) : 3 + pr(T, 156.2, 156.9);
  menuBoard(820, 120, 1.55, k);
  if (T > 149.3) for (let i = 0; i < 3; i++) { const q = pop(T, 149.3 + i * .7); if (q > 0) { ctx.save(); ctx.globalAlpha = q; ctx.translate(1450 + i * 130, 330); if (i === 0) { box(-28, -90, 56, 110, 14, MUSTARD, 5); } if (i === 1) { for (let j = 0; j < 6; j++) circ(-20 + (j % 3) * 20, -30 + Math.floor(j / 3) * 22, 14, '#fff7e0', 4); } if (i === 2) { box(-40, -50, 80, 70, 10, '#7cb342', 5); } ctx.restore(); text(['mustard', 'onions', 'relish'][i], 1450 + i * 130, 400, 36, {}); } }
  if (T > 151.76) hotdog(1700, 560, 1.5 * back(pop(T, 151.76)), 0, { chili: true });
  if (T > 158) { const bx = 1380; person({ who: 'ben', x: bx, y: 1010, s: 1.25, f: -.4, t: T, face: T > 163.6 ? 'flat' : T > 159.64 ? 'talk' : 'grin', armL: T > 159.64 && T < 163.4 ? { w: [bx - 140, 600] } : null });
    speech(bx + 40, 540, 'Family should\neat for FREE!', pop(T, 159.64) * (1 - pr(T, 163.3, 163.5)), { tail: -1 });
    if (T > 163.6) speech(bx + 40, 540, '...okay, just me.', pop(T, 163.6), { tail: -1 }); }
});
// 17 — ilk cumartesi: pazar yeri
scene(166.04, 169.12, T => {
  cam(T, 166.04, 169.12, 1.0, 1.06, 960, 600);
  marketBG(T);
  const q = eout(pr(T, 166.1, 168.2));
  cart(lerp(2300, 1180, q), 1000, .9);
  label('First Saturday · neighborhood farmers market', 960, 150, 58, pop(T, 166.3));
});
scene(169.12, 173.98, T => {
  // 05:30 alarm
  ctx.fillStyle = '#2a3150'; ctx.fillRect(0, 0, W, H); box(1200, 160, 400, 300, 10, '#18203a', 8); circ(1500, 230, 26, '#fff4c4', 0);
  ground(800, '#3a3550');
  box(200, 640, 1000, 180, 30, '#5a5f8a', 6); box(160, 560, 120, 300, 20, '#6b5040', 6);
  const up = eio(pr(T, 169.8, 170.6));
  person({ who: 'dad', apron: false, shirt: '#8aa0c8', x: 560, y: 1000, sit: true, seat: lerp(330, 360, up), dir: 1, f: .3, lean: lerp(-1.2, 0, up), t: T, face: up < .5 ? 'sleep' : 'flat' });
  box(240, 610, 700, 120, 40, '#e9e1d0', 6);
  box(1300, 640, 240, 160, 14, '#3a3634', 6); box(1320, 660, 200, 100, 8, '#1a1a1a', 0);
  const blink = Math.floor(T * 2) % 2 === 0;
  text('5:30', 1420, 712, 80, { font: ROUND, weight: 600, fill: blink ? '#ff5a4a' : '#7a2a24' });
  if (blink) for (let i = 0; i < 3; i++) line(1560 + i * 10, 640 - i * 30, 1600 + i * 20, 600 - i * 40, 6, '#ffd23f');
  label('5:30 AM', 960, 160, 64, pop(T, 169.2), { fill: '#fff', strokeCol: INK, stroke: 10 });
  if (T > 170.38) label('→ shared kitchen → market', 960, 260, 46, pop(T, 170.6), { fill: '#fff', strokeCol: INK, stroke: 10 });
});
scene(173.98, 178.8, T => {
  cam(T, 173.98, 178.8, 1.25, 1.35, 1180, 640);
  marketBG(T);
  person({ who: 'dad', x: 1260, y: 930, s: .95, f: T > 176 ? -.1 : -.5, t: T, face: T > 176 ? 'flat' : 'focus', armL: { w: [1080 + Math.sin(T * 5) * 40, 600] } });
  cart(1180, 1000, .9, { extraBottles: Math.min(6, Math.floor(pr(T, 174, 175.6) * 7)) });
  clock(760, 360, 80, T < 175.98 ? 9 : 9, T < 175.98 ? 0 : Math.round(lerp(0, 45, pr(T, 175.98, 176.6))));
  badge(T < 175.98 ? '9:00' : '9:45', 760, 500, 1, { size: 50 });
  if (T > 176.5) label('…nothing sold yet', 1180, 300, 54, pop(T, 176.6));
});
scene(178.8, 187.2, T => {
  cam(T, 178.8, 187.2, 1.0, 1.04, 960, 600);
  marketBG(T, { skipTent: 1 });
  // kahve arabası + kuyruk
  ctx.save(); ctx.translate(330, 960); box(-170, -320, 340, 230, 20, '#6b4a3a', 6); box(-190, -360, 380, 50, 14, '#e9e1d0', 6); text('COFFEE', 0, -235, 54, { font: ROUND, weight: 600, fill: '#fff' }); for (const wx of [-110, 110]) circ(wx, -70, 46, '#333', 5); ctx.restore();
  const n = Math.min(14, Math.floor(pr(T, 178.9, 180.6) * 14) + 1);
  for (let i = n - 1; i >= 0; i--) extra(i, { x: 560 + i * 62, y: 1000 - (i % 2) * 14, s: .55, f: -.6, t: T + i, seed: i, face: i % 3 ? 'calm' : 'smile' });
  badge('14 in line', 520, 330, pop(T, 179.4), { size: 52 });
  // bizim araba boş
  person({ who: 'dad', x: 1640, y: 930, s: .7, f: -.3, t: T, face: 'flat' });
  cart(1580, 1000, .65, { umbrella: true });
  if (T > 182.04) { const w = eio(pr(T, 182.1, 183.2)); const turn = T > 184.42; extra(5, { x: lerp(1200, 1400, w), y: 1010, s: .75, f: turn ? -.6 : .6, t: T, walk: w < 1 ? T * 7 : undefined, face: 'calm' });
    if (turn) { speech(1300, 360, 'How much are the tomatoes?', pop(T, 184.42), { tail: -1 }); } }
});
// 18 — ilk müşteri 11:03
scene(187.2, 197.82, T => {
  cam(T, 187.2, 197.82, 1.15, 1.25, 1080, 600);
  marketBG(T);
  const dadFace = T > 192.6 && T < 194.4 ? 'wide' : T > 195.9 ? 'grin' : 'smile';
  person({ who: 'dad', x: 1260, y: 930, s: .95, f: -.45, t: T, face: dadFace, armL: T > 195.9 ? { w: [1230, 520] } : { w: [1060, 610] }, holdL: T > 195.9 ? () => hotdog(0, -10, .55, -.3, { onion: true, relish: true }) : null });
  cart(1180, 1000, .9, { menu: true });
  extra(3, { x: 700, y: 1000, f: .5, t: T, face: T > 192.6 ? 'flat' : 'talk' });
  badge('11:03 — first customer!', 960, 180, pop(T, 187.3), { size: 50 });
  speech(700, 380, 'Two classics.', pop(T, 189.64) * (1 - pr(T, 191.2, 191.3)), { tail: 1 });
  if (T > 191.32 && T < 194.4) speech(700, 380, 'Hold the onions\non the second one.', pop(T, 191.32), { tail: 1 });
  if (T > 192.54) { const fix = T > 194.48; hotdog(980, 560, .9, 0, { onion: true, relish: true }); hotdog(1130, 560, .9, 0, { onion: !fix, relish: true });
    if (!fix) { ctx.save(); ctx.globalAlpha = pop(T, 192.7); circ(1130, 530, 70, null, 0); ctx.strokeStyle = RED; ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(1130, 540, 85, 0, Math.PI * 2); ctx.stroke(); ctx.restore(); }
    else label('remade ✓', 1130, 480, 40, pop(T, 194.5), { fill: '#3f7f2a' }); }
  if (T > 195.94) label('lunch', 1230, 380, 46, pop(T, 196));
});
// 19 — $312 → $121, 9 saat
scene(197.82, 208.28, T => {
  ctx.fillStyle = '#f3ead8'; ctx.fillRect(0, 0, W, H);
  badge('$312 taken in', 560, 230, pop(T, 197.9), { size: 76, bg: '#e6f2d8' });
  const costs = [['food', 200.44], ['spot fee', 201.6], ['card fees', 202.6], ['gas', 203.6]];
  costs.forEach(([c, at], i) => { const k = pop(T, at); if (k <= 0) return; badge('− ' + c, 360 + i * 230, 420, k, { size: 40, bg: '#fbe1dc', col: RED2 }); });
  if (T > 204.4) { line(240, 520, 1100, 520, 6); badge('$121 left', 660, 640, pop(T, 204.5), { size: 96, bg: '#fff1a8' }); }
  if (T > 206.48) { const k = pop(T, 206.48); ctx.save(); ctx.globalAlpha = k; const sp = pr(T, 206.5, 208); clock(1450, 480, 190, 9 + sp * 9, (sp * 9 * 60) % 60); ctx.restore(); label('9 hours', 1450, 760, 70, k, { font: ROUND, weight: 600 }); label('≈ $13 an hour', 1450, 850, 48, pop(T, 207.2), { fill: '#6d5a4a' }); }
});
// 20 — mutfak: "121." / "Güzel." / forma / ilk atış saat 11
scene(208.28, 220.72, T => {
  cam(T, 208.28, 220.72, 1.0, 1.05, 1000, 600);
  houseKitchen({ night: true });
  // çamaşır makinesi
  box(1290, 560, 195, 200, 8, '#eef1f3', 5); circ(1387, 670, 62, '#cfe3ee', 6);
  const pull = pr(T, 213.9, 214.8);
  person({ who: 'dad', x: 600, y: 1000, f: .45, t: T, face: T > 218.8 ? 'worried' : T > 211 && T < 212.2 ? 'talk' : 'calm' });
  person({ who: 'emily', x: 1150, y: 1000, f: T > 212 ? -.4 : .4, t: T, face: (T > 212.28 && T < 213.4) || (T > 216.44 && T < 218.6) ? 'talk' : 'smile', crouch: T > 213.6 && T < 215.2 ? 20 : 0,
    armR: T > 213.6 ? { w: [lerp(1340, 1260, pull), lerp(670, 600, pull)] } : null, holdR: T > 214.2 ? () => { ctx.save(); ctx.rotate(.15); box(-60, -10, 120, 120, 20, '#c8473b', 4); text('9', 0, 50, 60, { font: ROUND, weight: 600, fill: '#fff' }); ctx.restore(); } : null });
  speech(640, 360, '121.', pop(T, 211.04) * (1 - pr(T, 213.5, 213.7)), { tail: 1 });
  speech(1170, 360, "That's good.", pop(T, 212.28) * (1 - pr(T, 215.8, 216)), { tail: -1 });
  if (T > 216.44) speech(1120, 360, 'Do you know what time first\npitch is next Saturday?', pop(T, 216.44), { tail: -1, size: 38 });
  if (T > 218.82) thought(560, 300, 220, 150, pop(T, 218.9), () => text('?', 0, 0, 90, { font: ROUND, weight: 600 }));
});
scene(220.72, 224.42, T => {
  ctx.fillStyle = '#f3ead8'; ctx.fillRect(0, 0, W, H);
  // sol: softbol ilk atış, sağ: pazarın en yoğun saati
  box(120, 140, 760, 640, 30, '#e7f2dc', 6); box(1040, 140, 760, 640, 30, '#fbeedd', 6);
  clock(500, 430, 150, 11, 0); softball(640, 300, 40); label('First pitch', 500, 680, 64, 1, { font: ROUND, weight: 600, stroke: 0 });
  const vals = [.25, .35, .55, 1, .8, .6, .4]; vals.forEach((v, i) => { const h = 420 * v * eout(pop(T, 220.96 + i * .08, .5)); box(1120 + i * 90, 700 - h, 64, h, 8, i === 3 ? RED : '#e8b84a', 4); text(['8', '9', '10', '11', '12', '1', '2'][i], 1152 + i * 90, 740, 34, { font: ROUND, weight: 500 }); });
  label("Market's best hour", 1420, 230, 56, pop(T, 220.96), { font: ROUND, weight: 600, stroke: 0 });
  badge('11:00', 960, 880, pop(T, 220.72), { size: 72, bg: '#fff1a8' });
  line(960, 140, 960, 780, 8, RED);
});
// 21 — Mayıs: pazar + hırdavat otoparkı; "Karım öğle yemeği yaptı"
scene(224.42, 230.16, T => {
  ctx.fillStyle = '#efe6d6'; ctx.fillRect(0, 0, W, H);
  box(360, 120, 1200, 840, 24, '#fff', 8); box(360, 120, 1200, 110, 24, RED, 8); text('MAY', 960, 178, 76, { font: ROUND, weight: 600, fill: '#fff' });
  ['S', 'M', 'T', 'W', 'T', 'F', 'S'].forEach((d, i) => text(d, 450 + i * 170, 270, 40, { font: ROUND, weight: 600 }));
  for (let w = 0; w < 5; w++) for (let d = 0; d < 7; d++) { const x = 380 + d * 170, y = 300 + w * 128; box(x, y, 156, 116, 10, '#f7f3ea', 3);
    if (d === 6) { const k = pop(T, 224.6 + w * .25); if (k) { ctx.save(); ctx.globalAlpha = k; box(x + 8, y + 30, 140, 70, 10, '#e8b84a', 3); text('market', x + 78, y + 66, 32, {}); ctx.restore(); } }
    if (d === 0) { const k = pop(T, 227.1 + w * .25); if (k) { ctx.save(); ctx.globalAlpha = k; box(x + 8, y + 30, 140, 70, 10, '#6aa6c9', 3); text('store lot', x + 78, y + 66, 32, {}); ctx.restore(); } } }
});
function storeLot(T) {
  sky('#cfe5f1', '#f4eedd');
  box(140, 140, 1640, 560, 6, '#e6d6b8', 6); box(140, 140, 1640, 120, 6, '#e0782f', 6); text('HOME & YARD', 960, 200, 90, { font: ROUND, weight: 600, fill: '#fff' });
  box(820, 380, 280, 320, 6, '#bfe0f5', 6); line(960, 380, 960, 700, 5);
  for (let i = 0; i < 2; i++) box(260 + i * 1200, 380, 300, 200, 6, '#bfe0f5', 5);
  ground(700, '#b9b4ab'); for (let i = 0; i < 8; i++) line(i * 260, 880, i * 260 + 120, 880, 8, '#f5f1e6');
}
scene(230.16, 245.68, T => {
  cam(T, 230.16, 245.68, 1.0, 1.08, 1100, 640);
  storeLot(T);
  person({ who: 'dad', x: 1500, y: 930, s: .9, f: -.45, t: T, face: 'smile' });
  cart(1440, 1000, .85, { menu: false });
  // boya kovasıyla çıkıp sosisliyle ayrılanlar
  if (T < 235.4) for (let i = 0; i < 3; i++) { const q = ((T - 230.16) * .18 + i / 3) % 1; const x = lerp(960, 300, q); extra(i + 2, { x, y: 1000 + i * 8, s: .7, f: -.6, walk: T * 7 + i, t: T, face: 'smile', armR: { w: [x + 70, 860] }, holdR: () => { box(-30, 0, 60, 60, 8, ['#4f7fb0', '#7cb342', '#e8b84a'][i], 4); line(-26, 0, 0, -26, 4); line(26, 0, 0, -26, 4); }, armL: q > .25 ? { w: [x - 60, 760] } : null, holdL: q > .25 ? () => hotdog(0, -10, .5) : null }); }
  if (T < 235.4) label('People came in for paint…', 600, 320, 50, pop(T, 230.5)); if (T < 235.4) label('…and left with hot dogs.', 600, 390, 50, pop(T, 233.4));
  if (T > 235.36) {
    const wife = T > 241.74, wk = eio(pr(T, 241.8, 243));
    extra(5, { x: 1060, y: 1000, s: .9, f: wife && T > 242.4 ? -.5 : .5, t: T, face: wife ? 'wide' : (T > 239.36 && T < 241.6 ? 'talk' : 'happy'), armR: { w: [1150, 760] }, holdR: () => hotdog(0, -10, .55, 0, { relish: true, onion: true }) });
    badge(T < 237.46 ? 'Sunday #1' : 'Sunday #2', 1060, 330, pop(T, 235.4), { size: 46 });
    speech(1000, 450, 'My wife made lunch.', pop(T, 239.36) * (1 - pr(T, 240.4, 240.5)), { tail: 1 });
    if (T > 240.52 && T < 241.8) speech(1000, 450, "Don't let her see this.", pop(T, 240.52), { tail: 1 });
    if (wife) { extra(2, { x: lerp(200, 800, wk), y: 1000, s: .9, f: .5, t: T, walk: wk < 1 ? T * 7 : undefined, face: T > 243.92 ? 'talk' : 'flat' });
      if (T > 243.92) speech(820, 430, 'Chili cheese dog, please.', pop(T, 243.92), { tail: -1 }); }
  }
});
// 22 — Mayıs sonuçları
scene(245.68, 255.36, T => {
  ctx.fillStyle = '#f3ead8'; ctx.fillRect(0, 0, W, H);
  const k = pop(T, 245.8, .6);
  box(240, 240, 260, 600 * eout(k), 0, '#6aa84f', 0); ctx.save(); ctx.translate(0, 840); ctx.scale(1, -1); box(240, 0, 260, 600 * eout(k), 14, '#7cb342', 6); ctx.restore();
  label('$3,840', 370, 190, 72, k, { font: ROUND, weight: 600, stroke: 0 }); label('May sales', 370, 900, 50, k);
  const k2 = pop(T, 248.6, .6); ctx.save(); ctx.translate(0, 840); ctx.scale(1, -1); box(700, 0, 260, 190 * eout(k2), 14, '#e8b84a', 6); ctx.restore();
  label('$1,210', 830, 600, 72, k2, { font: ROUND, weight: 600, stroke: 0 }); label('left before taxes', 830, 900, 50, k2);
  if (T > 253.74) { person({ who: 'dad', x: 1450, y: 1010, s: 1.05, f: -.3, t: T, face: 'grin', armR: { w: [1600, 560] } }); speech(1400, 380, 'Pretty good for\na first month.', pop(T, 253.74), { tail: 1 }); }
  else if (T > 249) person({ who: 'dad', x: 1450, y: 1010, s: 1.05, f: -.3, t: T, face: 'smile' });
});
// 23 — dört tabak; Ben babasının tabağını kase ile örter
scene(255.36, 267.9, T => {
  cam(T, 255.36, 267.9, 1.0, 1.06, 960, 640);
  houseKitchen({ night: true });
  // pencereden: baba gece arabanın kaplarını yıkıyor
  ctx.save(); rr(760, 150, 420, 300, 10); ctx.clip(); ctx.fillStyle = '#2d3e66'; ctx.fillRect(760, 150, 420, 300);
  ctx.save(); ctx.translate(970, 330); ctx.scale(.32, .32); ctx.translate(-970, -330); person({ who: 'dad', x: 900, y: 700, f: .4, t: T, face: 'flat', armR: { w: [1060, 470] } }); box(1000, 420, 220, 90, 10, STEEL, 6); for (let i = 0; i < 4; i++) circ(1060 + Math.sin(T * 6 + i) * 30, 400 - i * 20, 12, '#cfe8ff', 3); ctx.restore(); ctx.restore();
  box(760, 150, 420, 300, 10, null, 8); line(970, 150, 970, 450, 6); line(760, 300, 1180, 300, 6);
  // masa
  poly([[380, 760], [1540, 760], [1640, 860], [280, 860]], WOOD, 6); box(280, 860, 1360, 30, 6, WOOD2, 5);
  const plates = [[520, 800], [820, 800], [1120, 800], [1420, 800]];
  plates.forEach(([x, y], i) => { const k = pop(T, 255.5 + i * .5); if (k > 0) { ctx.save(); ctx.globalAlpha = k; plate(x, y, 1); ctx.restore(); } });
  person({ who: 'emily', x: lerp(1700, 1580, pr(T, 255.4, 257)), y: 1000, f: -.4, t: T, face: T > 264.46 && T < 265.9 ? 'talk' : 'smile', armL: T < 258 ? { w: [1420, 770] } : null });
  if (T > 261.46) { const q = eio(pr(T, 261.5, 262.5)); person({ who: 'ben', x: 1080, y: 1010, s: 1, f: .3, t: T, face: 'focus', armR: { w: [lerp(1150, 1400, q), lerp(700, 760, q)] }, holdR: q < 1 ? () => { ctx.beginPath(); ctx.arc(0, 0, 60, Math.PI, 0); ctx.closePath(); fs('#f2a33a', 5); } : null });
    if (q >= 1) { ctx.beginPath(); ctx.arc(1420, 800, 62, Math.PI, 0); ctx.closePath(); fs('#f2a33a', 5); } }
  label("Dad's plate", 1420, 650, 40, pop(T, 258.8) * (1 - pr(T, 261, 261.4)));
  if (T > 264.46) speech(1560, 400, 'What are you doing?', pop(T, 264.46) * (1 - pr(T, 265.9, 266)), { tail: 1 });
  if (T > 266) speech(1080, 470, 'Keeping it warm for Dad.', pop(T, 266), { tail: -1 });
});
// 24 — Haziran: mahalle yaz festivali
function festivalBG(T, rain = 0) {
  sky(rain ? '#9aa6b5' : '#cde5f0', rain ? '#d8d8d4' : '#f6eedb');
  for (let i = 0; i < 6; i++) tree(-60 + i * 400, 640, 1, rain ? '#6f9356' : '#7fae5f');
  ground(640, rain ? '#88a06a' : '#a9c97f');
  // sahne
  ctx.save(); ctx.translate(1450, 640); box(-300, -60, 600, 60, 6, WOOD2, 5); box(-300, -380, 600, 30, 6, '#3a3634', 5); limb([[-290, -60], [-290, -380]], 14, '#3a3634', 3); limb([[290, -60], [290, -380]], 14, '#3a3634', 3); box(-200, -330, 400, 70, 10, '#fff6e2', 5); text('SUMMER FEST', 0, -295, 50, { font: ROUND, weight: 600, fill: RED2 }); ctx.restore();
  // bayrak dizisi
  ctx.beginPath(); ctx.moveTo(0, 120); ctx.quadraticCurveTo(960, 230, W, 120); ctx.lineWidth = 3; ctx.strokeStyle = INK; ctx.stroke();
  for (let i = 0; i < 18; i++) { const x = 50 + i * 105, t = x / W, y = (1 - t) * (1 - t) * 120 + 2 * (1 - t) * t * 230 + t * t * 120; poly([[x - 26, y], [x + 26, y], [x, y + 50]], ['#d6493a', '#f2c230', '#6aa6c9', '#7cb342'][i % 4], 3); }
}
scene(267.9, 286.78, T => {
  cam(T, 267.9, 286.78, 1.0, 1.05, 960, 600);
  festivalBG(T);
  const phone2 = T > 276.84;
  extra(1, { x: 1100, y: 1000, s: .9, f: -.5, t: T, face: T > 272.08 && T < 275 ? 'talk' : 'smile', armL: { w: [1000, 640] }, holdL: () => box(-40, -60, 80, 110, 6, '#fff', 4) });
  if (T > 272.08) speech(1150, 400, '700 people came last year!', pop(T, 272.08) * (1 - pr(T, 276.6, 276.8)), { tail: -1 });
  person({ who: 'dad', x: 700, y: 1000, s: .95, f: .5, t: T, face: T > 282.92 ? 'flat' : 'grin' });
  // 240 sosis kutusu
  if (T > 275.18) { for (let i = 0; i < 6; i++) { const k = pop(T, 275.2 + i * .12); if (k > 0) box(260 + (i % 3) * 110, 990 - Math.floor(i / 3) * 90 - 90 - (1 - k) * 40, 100, 86, 6, '#c9a46a', 5); } badge('240 hot dogs', 420, 640, pop(T, 275.4), { size: 46 }); }
  if (phone2) { const k = pop(T, 276.84); ctx.save(); ctx.globalAlpha = k; box(1180, 120, 640, 520, 30, '#fffaf0', 6); ctx.restore();
    person({ who: 'emily', x: 1330, y: 800, s: .6, f: .3, t: T, face: T < 281 ? 'talk' : 'flat' });
    if (k > .5) { speech(1580, 300, 'How many of those 700\npeople bought food?', pop(T, 277), { size: 34, tail: -1 }); }
    if (T > 281.14) { phone(1640, 500, .9, .1, () => { box(-44, -70, 80, 36, 10, '#4f7fb0', 0); text('how many ate?', -4, -52, 13, { fill: '#fff', font: ROUND }); if (T > 282.92) { box(-36, -20, 80, 36, 10, '#e5e5ea', 0); text('no idea', 4, -2, 13, { font: ROUND }); } }); } }
  if (T > 284) { label('They counted wristbands at the gate.', 700, 260, 46, pop(T, 284)); for (let i = 0; i < 5; i++) { ctx.save(); ctx.globalAlpha = pop(T, 284.3 + i * .15); ctx.beginPath(); ctx.ellipse(420 + i * 90, 360, 34, 14, .3, 0, Math.PI * 2); ctx.lineWidth = 12; ctx.strokeStyle = ['#d6493a', '#f2c230', '#6aa6c9', '#7cb342', '#9b6fb0'][i]; ctx.stroke(); ctx.restore(); } }
});
// 25 — yağmur 2'de, durdu 4'te; grup iptal; 68 sosisli, $190 zarar
scene(286.78, 301.4, T => {
  const rain = T < 288.32 ? 1 : T < 289.6 ? 1 - pr(T, 288.32, 289) : 0;
  cam(T, 286.78, 301.4, 1.0, 1.06, 960, 600);
  festivalBG(T, rain > .3 ? 1 : 0);
  if (T > 289.64) { ctx.save(); ctx.translate(1450, 450); ctx.rotate(-.12 * pop(T, 289.7)); box(-170, -50, 340, 100, 10, RED, 6); text('CANCELED', 0, 4, 60, { font: ROUND, weight: 600, fill: '#fff' }); ctx.restore(); }
  person({ who: 'dad', x: 820, y: 930, s: .95, f: .2, t: T, face: T > 295 ? 'sad' : 'flat' });
  cart(740, 1000, .9);
  if (rain > 0) { ctx.save(); ctx.globalAlpha = rain * .8; ctx.strokeStyle = '#6f86a6'; ctx.lineWidth = 3; for (let i = 0; i < 160; i++) { const x = (hs(i) * 2200 + T * 300) % 2200 - 100, y = (hs(i + 50) * 1200 + T * 1400) % 1200 - 100; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 10, y + 40); ctx.stroke(); } ctx.restore(); }
  clock(240, 200, 90, T < 288.32 ? 2 : 4, 0); badge(T < 288.32 ? '2:00 rain' : '4:00 stops', 240, 340, 1, { size: 40 });
  if (T > 292.38) badge('68 sold', 1450, 760, pop(T, 292.38), { size: 66 });
  if (T > 295.78) badge('spot: $250', 1450, 880, pop(T, 295.78), { size: 50, bg: '#fbe1dc', col: RED2 });
  if (T > 298.6) badge('−$190', 960, 230, pop(T, 298.6), { size: 110, bg: '#fbe1dc', col: RED2 });
});
// 26 — benzinlik, iki kahve, sabah not
scene(301.4, 307.74, T => {
  cam(T, 301.4, 307.74, 1.0, 1.06, 960, 600);
  ctx.fillStyle = '#1f2742'; ctx.fillRect(0, 0, W, H); ground(760, '#3a3a44');
  box(300, 260, 1300, 70, 8, '#e9e1d0', 6); text('GAS · COFFEE', 950, 296, 50, { font: ROUND, weight: 600, fill: RED2 }); limb([[400, 330], [400, 760]], 30, '#c9c2b0', 4); limb([[1500, 330], [1500, 760]], 30, '#c9c2b0', 4);
  ctx.save(); ctx.fillStyle = 'rgba(255,240,180,.15)'; ctx.beginPath(); ctx.moveTo(300, 330); ctx.lineTo(1600, 330); ctx.lineTo(1800, 900); ctx.lineTo(100, 900); ctx.fill(); ctx.restore();
  box(820, 480, 180, 280, 14, '#d6493a', 6); box(850, 520, 120, 80, 8, '#1b1b1e', 3);
  if (T < 305.46) person({ who: 'dad', x: 1150, y: 1000, f: -.3, t: T, face: 'flat', armL: { w: [1050, 760] }, armR: { w: [1240, 760] }, holdL: () => coffee(0, 30, 1), holdR: () => coffee(0, 30, 1) });
  else { ctx.fillStyle = 'rgba(10,14,30,' + pop(T, 305.46, .4) * .85 + ')'; ctx.fillRect(0, 0, W, H); ctx.save(); ctx.globalAlpha = pop(T, 305.6); box(400, 600, 1100, 260, 30, '#4a5a8a', 6); box(440, 560, 260, 110, 40, '#f4f1ea', 6); ell(590, 600, 62, 66, HEAD, 5); hair({ hair: 'bob', hairCol: '#7a4a2c' }, 590, 600, 62, .2, 5); face({ face: 'sleep' }, 590, 600, 62, .2, 5); box(560, 640, 920, 190, 50, '#e9e1d0', 6); ctx.restore(); label('already asleep', 960, 300, 56, pop(T, 305.8), { fill: '#fff', strokeCol: INK }); }
  label('One for Emily.', 960, 160, 56, pop(T, 304.94) * (T < 305.4 ? 1 : 0));
});
scene(307.74, 313.76, T => {
  cam(T, 307.74, 313.76, 1.0, 1.08, 960, 560);
  ctx.fillStyle = '#e9d7b4'; ctx.fillRect(0, 0, W, H); for (let i = 0; i < 9; i++) line(0, i * 130, W, i * 130 + 30, 40, 'rgba(150,100,50,.08)');
  coffee(500, 760, 3.2);
  paper(1120, 560, 900, 560, .03, '#fff9d6', false);
  writeLines(['Next time, let\'s know', 'how many we\'re getting', 'paid for before we go.', '                    — E ♥'], 730, 380, 66, pr(T, 308.2, 312.6) * 4, { fill: '#2d3e66' });
});
// 27 — Mike'ın oto tamirhanesi: 80 kişilik öğle yemeği
scene(313.76, 343.9, T => {
  cam(T, 313.76, 343.9, 1.0, 1.06, 960, 560);
  sky('#cfe5f1', '#f4eedd'); box(100, 160, 1720, 560, 6, '#d8d4cc', 6); box(100, 160, 1720, 100, 6, '#4f7fb0', 6); text("MIKE'S AUTO", 960, 210, 70, { font: ROUND, weight: 600, fill: '#fff' });
  for (let i = 0; i < 3; i++) { box(220 + i * 540, 320, 420, 400, 6, '#5c544c', 5); for (let k = 1; k < 3; k++) line(220 + i * 540, 320 + k * 60, 640 + i * 540, 320 + k * 60, 3, '#7a7268'); }
  ground(720, '#b9b4ab');
  box(240, 330, 1440, 70, 8, '#fff6e2', 5); text('SUMMER EMPLOYEE LUNCH', 960, 366, 50, { font: ROUND, weight: 600, fill: RED2 });
  cart(1450, 1000, .8);
  person({ who: 'dad', x: 1520, y: 940, s: .85, f: -.4, t: T, face: 'smile' });
  if (T < 329) person({ who: 'mike', x: 520, y: 1000, f: .5, t: T, face: T < 319.7 ? 'talk' : 'smile', shirt: '#5f7fa8', towel: true });
  if (T > 319.76 && T < 329.2) { badge('80 meals × $9', 960, 480, pop(T, 319.76), { size: 66, bg: '#fff1a8' });
    const icons = [323.38, 323.9, 324.6, 325.4]; icons.forEach((at, i) => { const k = back(pop(T, at)); if (!k) return; ctx.save(); ctx.translate(700 + i * 170, 640); ctx.scale(k, k);
      if (i === 0) hotdog(0, 0, .8); if (i === 1) { box(-36, -50, 72, 90, 10, '#f2c230', 4); text('chips', 0, 0, 22, {}); } if (i === 2) { box(-26, -56, 52, 100, 12, '#d6493a', 4); } if (i === 3) { clock(0, -4, 48, 2, 0); } ctx.restore(); });
    if (T > 327.14) { paper(1050, 640, 300, 360, -.05); writeLines(['AGREEMENT', '80 meals', '$9 each', '✓ signed'], 930, 520, 40, pr(T, 327.2, 328.8) * 4); } }
  if (T > 329.28 && T < 333.6) { // 67 kişi geldi
    const n = Math.min(14, Math.floor(pr(T, 329.3, 330.6) * 14) + 1);
    for (let i = n - 1; i >= 0; i--) extra(i + 1, { x: 1160 - i * 70, y: 1000 - (i % 2) * 14, s: .55, f: .6, t: T + i, seed: i, face: 'smile', shirt: '#5f7fa8' });
    badge('67 showed up', 520, 560, pop(T, 329.4), { size: 56 });
    if (T > 330.94) { box(180, 640, 300, 120, 10, '#c9c2b0', 5); for (let i = 0; i < 4; i++) hotdog(240 + (i % 2) * 120, 680 + Math.floor(i / 2) * 50, .55); label('for the evening shift', 330, 800, 38, pop(T, 331)); }
  }
  if (T > 333.24) { ctx.save(); ctx.globalAlpha = pop(T, 333.24) * .92; box(560, 420, 800, 300, 30, '#fffaf0', 6); ctx.restore();
    label('Known before shopping:', 960, 480, 50, pop(T, 333.4), { stroke: 0 });
    if (T > 337.78) badge('$720', 800, 610, pop(T, 337.78), { size: 80 });
    if (T > 339.32) badge('$390 kept', 1130, 610, pop(T, 339.32), { size: 66, bg: '#e6f2d8' }); }
  if (T > 342.42) { clock(1750, 160, 80, 3, 0); label('home by 3', 1750, 290, 44, pop(T, 342.42)); }
});
// 28 — garaj yolunda softbol: "Sen orada değildin."
scene(343.9, 356.26, T => {
  cam(T, 343.9, 356.26, 1.0, 1.06, 960, 600);
  house(T, {});
  // Ellie topa vuruyor (tee), baba eldivenle tutmaya çalışıyor
  const cyc = T < 350.5 ? ((T - 344.1) % 2.4) / 2.4 : 0, sw = clamp((cyc - .1) * 5);
  box(590, 900, 14, 100, 4, '#333', 3);
  person({ who: 'ellie', x: 480, y: 1010, s: 1, f: .4, hat: 'helmet', t: T, face: T > 353.5 ? 'talk' : 'focus', armR: { w: [lerp(520, 600, sw), lerp(830, 850, sw)] }, armL: { w: [lerp(500, 590, sw), lerp(840, 860, sw)] }, holdR: () => { ctx.save(); ctx.rotate(lerp(2.6, 1.6, sw)); limb([[0, 0], [0, 190]], 14, '#c58b4a', 4); ctx.restore(); } });
  const dadCatch = T > 348.2 && T < 350.6;
  person({ who: 'dad', apron: false, shirt: '#e9e1d0', x: 1450, y: 1010, f: -.4, t: T, face: T > 350.78 && T < 353 ? 'talk' : T > 353.5 ? 'sad' : 'wide', armL: { w: [1330, dadCatch ? 690 : 760] }, holdL: () => ell(0, 0, 40, 46, '#a0612e', 5) });
  if (T > 346 && T < 350.6 && cyc > .15) { const q = (cyc - .15) / .5; if (q < 1.3) softball(lerp(600, 1900, q / 1.3), lerp(800, 700, q), 14); }
  if (T > 348.28 && T < 350.6) label(T < 349.4 ? 'miss' : 'miss again', 1450, 360, 54, pop(T, 348.3), { fill: RED2 });
  if (T > 350.78) speech(1420, 380, "They don't come at you\nthat fast in a game.", pop(T, 350.78) * (1 - pr(T, 353.3, 353.5)), { tail: 1 });
  if (T > 353.5) speech(560, 380, T < 355.3 ? 'Yeah, they do.' : "You weren't there.", pop(T, 353.5), { tail: -1 });
});
// 29 — 4 Temmuz hazırlığı: üç soru, $350, harita
scene(356.26, 369.78, T => {
  ctx.fillStyle = '#1f2a4a'; ctx.fillRect(0, 0, W, H);
  for (let i = 0; i < 5; i++) { const q = ((T - 356.26) * .4 + i / 5) % 1; ctx.save(); ctx.globalAlpha = Math.sin(q * Math.PI); for (let j = 0; j < 14; j++) { const a = j / 14 * Math.PI * 2; line(200 + i * 380 + Math.cos(a) * 30, 200 + (i % 2) * 80 + Math.sin(a) * 30, 200 + i * 380 + Math.cos(a) * (60 + q * 80), 200 + (i % 2) * 80 + Math.sin(a) * (60 + q * 80), 5, ['#ff6b5a', '#ffd23f', '#9fd3ff', '#fff'][i % 4]); } ctx.restore(); }
  label('4th of July · town fireworks show', 960, 120, 60, pop(T, 356.4), { fill: '#fff', strokeCol: INK });
  const qs = [['How many meals sold last year?', 361.92], ['How many food vendors?', 364.32], ['Where do the carts go?', 365.9]];
  if (T > 359.74) label('This time: 3 questions', 960, 380, 54, pop(T, 359.74), { fill: '#ffd23f', strokeCol: INK });
  qs.forEach(([q, at], i) => { const k = pop(T, at); if (k <= 0) return; ctx.save(); ctx.globalAlpha = k; box(460, 450 + i * 130 + (1 - k) * 20, 1000, 100, 24, '#fffaf0', 6); text((i + 1) + '. ' + q, 960, 500 + i * 130 + (1 - k) * 20, 50, {}); ctx.restore(); });
  if (T > 367.38) badge('spot: $350', 960, 930, pop(T, 367.38), { size: 66 });
});
scene(369.78, 379.24, T => {
  ctx.fillStyle = '#e9dfcf'; ctx.fillRect(0, 0, W, H);
  // Emily'nin telefonundaki harita (yakınlaşan)
  const z = 1 + .5 * eio(pr(T, 370, 372.5));
  ctx.save(); ctx.translate(960, 540); box(-760, -480, 1520, 960, 60, '#2f2c2b', 8); rr(-700, -430, 1400, 860, 24); ctx.clip(); ctx.scale(z, z);
  ctx.fillStyle = '#cfe8b8'; ctx.fillRect(-900, -600, 1800, 1200);
  box(-700, -430, 560, 860, 0, '#c9c4bb', 4); for (let i = 0; i < 6; i++) for (let j = 0; j < 3; j++) box(-660 + j * 170, -380 + i * 140, 120, 70, 10, ['#d6493a', '#4f7fb0', '#7cb342', '#e8b84a'][(i + j) % 4], 3);
  text('PARKING', -420, 380, 54, { font: ROUND, weight: 600, fill: '#6d6a64' });
  text('LAWN', 380, -330, 70, { font: ROUND, weight: 600, fill: '#5d8a46' });
  for (let i = 0; i < 4; i++) { ctx.save(); ctx.translate(-60, -260 + i * 170); ctx.scale(.18, .18); cart(0, 300, 1, { umbrella: false, sign: false, bottles: false }); ctx.restore(); }
  // bizim yer
  const pin = back(pop(T, 372.66)); ctx.save(); ctx.translate(-60, 100); ctx.scale(pin, pin); ctx.beginPath(); ctx.arc(0, -70, 50, Math.PI, 0); ctx.lineTo(0, 10); ctx.closePath(); fs(RED, 6); circ(0, -70, 18, '#fff', 5); ctx.restore();
  // katlanır sandalyeli insanlar yanından geçer
  if (T > 375.22) for (let i = 0; i < 8; i++) { const q = ((T - 375.22) * .25 + i / 8) % 1; const x = lerp(-400, 600, q); const y = 160 + Math.sin(i) * 30; circ(x, y, 18, '#fff', 4); line(x + 14, y + 6, x + 34, y - 20, 5, '#4f7fb0'); }
  ctx.restore();
  if (T > 372.66) label('between the parking lot and the lawn', 960, 1000, 50, pop(T, 372.9));
  if (T > 375.22) label('everyone with a folding chair walks past you', 960, 70, 48, pop(T, 375.4));
});
// 30 — gece: kuyruk, kart okuyucu çöküyor, Emily nakit fiyat listesi; 286 sosisli
scene(379.24, 404.24, T => {
  cam(T, 379.24, 404.24, 1.0, 1.06, 960, 600);
  ctx.fillStyle = '#1c2340'; ctx.fillRect(0, 0, W, H);
  for (let i = 0; i < 4; i++) { const q = ((T - 379) * .35 + i / 4) % 1; ctx.save(); ctx.globalAlpha = Math.sin(q * Math.PI) * .9; for (let j = 0; j < 16; j++) { const a = j / 16 * Math.PI * 2, cx = 300 + i * 450, cy = 160 + (i % 2) * 90; line(cx + Math.cos(a) * 20, cy + Math.sin(a) * 20, cx + Math.cos(a) * (40 + q * 90), cy + Math.sin(a) * (40 + q * 90), 5, ['#ff6b5a', '#ffd23f', '#9fd3ff', '#fff'][i]); } ctx.restore(); }
  ground(700, '#2f4a35');
  // string lights
  ctx.beginPath(); ctx.moveTo(0, 330); ctx.quadraticCurveTo(960, 430, W, 330); ctx.lineWidth = 3; ctx.strokeStyle = '#111'; ctx.stroke(); for (let i = 0; i < 24; i++) { const x = 40 + i * 80, t = x / W, y = (1 - t) * (1 - t) * 330 + 2 * (1 - t) * t * 430 + t * t * 330; circ(x, y + 8, 8, '#ffe28a', 0); }
  person({ who: 'dad', x: 1390, y: 930, s: .9, f: -.4, t: T, face: T > 383.4 && T < 400.3 ? 'worried' : 'focus', armL: { w: [1250 + Math.sin(T * 9) * 30, 640] }, holdL: T > 402.82 ? () => hotdog(0, 0, .5, 0, { plain: true }) : null });
  cart(1330, 1000, .85);
  // kuyruk
  const n = T > 393.88 ? 19 : 20;
  for (let i = n - 1; i >= 0; i--) { const out = T > 393.88 && i === 3; extra(i, { x: 1000 - i * 70 + (out ? -pr(T, 393.9, 395) * 400 : 0), y: 1000 + (out ? 40 : 0) - (i % 2) * 14, s: .58, f: out ? -.6 : .6, t: T + i, seed: i, face: out ? 'flat' : 'calm',
      armR: T > 384.88 && T < 388 && i > 2 ? { w: [1000 - i * 70 + 40, 830] } : null, holdR: T > 384.88 && T < 388 && i > 2 ? () => phone(0, 0, .22, 0) : null }); }
  if (T > 379.24 && T < 383.4) badge('20 in line by 7:00', 600, 330, pop(T, 379.4), { size: 50 });
  // kart okuyucu
  if (T > 383.42) { ctx.save(); const k = back(pop(T, 383.42)); ctx.translate(1600, 470); ctx.scale(k * 1.6, k * 1.6); receiptIcon('card', 0, 0, 1); if (T < 400.34) { line(-30, -40, 30, -10, 6, RED); line(30, -40, -30, -10, 6, RED); } else { ctx.beginPath(); ctx.moveTo(-18, -25); ctx.lineTo(-4, -12); ctx.lineTo(20, -36); ctx.lineWidth = 6; ctx.strokeStyle = '#3f9f3a'; ctx.stroke(); } ctx.restore();
    label(T < 400.34 ? 'no connection' : 'back online', 1600, 600, 40, 1, { fill: T < 400.34 ? RED2 : '#3f7f2a' }); }
  if (T > 388.1 && T < 395.8) { if (T < 390.48) { bill(880, 560, 1.2, -.2, '5'); bill(940, 600, 1.2, .1, '10'); label('cash!', 900, 480, 50, pop(T, 388.1)); }
    else if (T < 393.88) { for (let i = 0; i < 18; i++) { const k = pop(T, 390.5 + i * .05); circ(1080 + (hs(i) - .5) * 160, 660 - k * 40 + hs(i + 2) * 30, 14, ['#c9a46a', '#cfd6db', '#e8c06a'][i % 3], 3); } label('a pocket full of change', 1080, 520, 46, pop(T, 390.6)); }
    else label('…one gives up', 500, 520, 50, pop(T, 393.9)); }
  if (T > 395.84) { person({ who: 'emily', x: 1720, y: 1000, s: .85, f: -.4, t: T, face: 'talk', armR: { w: [1830 + Math.sin(T * 6) * 30, 640 + Math.cos(T * 6) * 20] }, armL: { w: [1600, 720] }, holdL: () => { ctx.save(); ctx.rotate(-.1); paper(0, -60, 170, 210, 0, '#fffef8', false); text('CASH', 0, -130, 32, { font: ROUND, weight: 600 }); text('Classic $4', 0, -90, 24, {}); text('Chili $6', 0, -60, 24, {}); text('Combo $7', 0, -30, 24, {}); ctx.restore(); } }); }
});
scene(404.24, 417.44, T => {
  ctx.fillStyle = '#1c2340'; ctx.fillRect(0, 0, W, H);
  for (let i = 0; i < 6; i++) { const q = ((T - 404) * .3 + i / 6) % 1; ctx.save(); ctx.globalAlpha = Math.sin(q * Math.PI) * .7; for (let j = 0; j < 16; j++) { const a = j / 16 * Math.PI * 2, cx = 160 + i * 320, cy = 140 + (i % 2) * 120; line(cx + Math.cos(a) * 20, cy + Math.sin(a) * 20, cx + Math.cos(a) * (40 + q * 90), cy + Math.sin(a) * (40 + q * 90), 5, ['#ff6b5a', '#ffd23f', '#9fd3ff', '#fff'][i % 4]); } ctx.restore(); }
  const cnt = Math.round(286 * eout(pr(T, 404.3, 406.6)));
  badge(cnt + ' hot dogs', 960, 380, pop(T, 404.3), { size: 96 });
  if (T > 407.1) badge('$1,790 taken in', 620, 600, pop(T, 407.1), { size: 60, bg: '#e6f2d8' });
  if (T > 409.4) badge('$805 kept', 1320, 600, pop(T, 409.4), { size: 70, bg: '#fff1a8' });
  if (T > 415.2) label('Best day in six months.', 960, 800, 66, pop(T, 415.2), { fill: '#fff', strokeCol: INK });
});
