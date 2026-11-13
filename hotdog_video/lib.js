/* ============ temel yardımcılar ============ */
const W = 1920, H = 1080;
const INK = '#2b2421', HEAD = '#fdfcf8', HEADSH = '#ebe8e1';
const RED = '#d6493a', RED2 = '#b83a2e', CREAM = '#f4ecdc', WOOD = '#d7a86e', WOOD2 = '#b9834b';
const STEEL = '#cfd6db', STEEL2 = '#a9b3ba', MUSTARD = '#f2c230', KETCHUP = '#d8352a', GREEN = '#6aa84f';
const HAND = '"PatrickHand","Patrick Hand",cursive', ROUND = '"Fredoka",sans-serif';
let ctx;
const hs = n => { const x = Math.sin(n * 12.9898 + 78.233) * 43758.5453; return x - Math.floor(x); };
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const pr = (t, a, b) => clamp((t - a) / (b - a));
const eio = t => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
const eout = t => 1 - Math.pow(1 - t, 3);
const back = t => { if (t <= 0) return 0; if (t >= 1) return 1; const c1 = 1.7, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };
const money = n => '$' + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

function rr(x, y, w, h, r) { r = Math.min(r, Math.abs(w) / 2, Math.abs(h) / 2); ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
function fs(fill, lw = 5, stroke = INK) { if (fill) { ctx.fillStyle = fill; ctx.fill(); } if (lw > 0) { ctx.lineWidth = lw; ctx.strokeStyle = stroke; ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.stroke(); } }
function box(x, y, w, h, r, fill, lw = 5) { rr(x, y, w, h, r); fs(fill, lw); }
function circ(x, y, r, fill, lw = 5) { ctx.beginPath(); ctx.arc(x, y, Math.max(.1, r), 0, Math.PI * 2); fs(fill, lw); }
function ell(x, y, rx, ry, fill, lw = 5, rot = 0) { ctx.beginPath(); ctx.ellipse(x, y, Math.max(.1, rx), Math.max(.1, ry), rot, 0, Math.PI * 2); fs(fill, lw); }
function line(x1, y1, x2, y2, lw = 5, col = INK) { ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.lineWidth = lw; ctx.strokeStyle = col; ctx.lineCap = 'round'; ctx.stroke(); }
function poly(pts, fill, lw = 5) { ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.closePath(); fs(fill, lw); }
// içi renkli, dışı mürekkep konturlu kalın çizgi (kol, bacak, boru…)
function limb(pts, w, col, lw = 5) {
  const path = () => { ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); };
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  path(); ctx.strokeStyle = INK; ctx.lineWidth = w + lw * 2; ctx.stroke();
  path(); ctx.strokeStyle = col; ctx.lineWidth = w; ctx.stroke();
}
function text(s, x, y, size, o = {}) {
  ctx.save(); ctx.translate(x, y); if (o.rot) ctx.rotate(o.rot); if (o.sc !== undefined) ctx.scale(o.sc, o.sc);
  ctx.font = `${o.weight || ''} ${size}px ${o.font || HAND}`.trim(); ctx.textAlign = o.align || 'center'; ctx.textBaseline = 'middle';
  if (o.maxW) { const w = ctx.measureText(s).width; if (w > o.maxW) { const k = o.maxW / w; ctx.scale(k, k); } }
  if (o.stroke) { ctx.lineWidth = o.stroke; ctx.strokeStyle = o.strokeCol || INK; ctx.lineJoin = 'round'; ctx.strokeText(s, 0, 0); }
  ctx.fillStyle = o.fill || INK; ctx.fillText(s, 0, 0); ctx.restore();
}
function shadow(x, y, w, a = .16) { ctx.save(); ctx.fillStyle = `rgba(60,40,30,${a})`; ctx.beginPath(); ctx.ellipse(x, y, w, w * .14, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore(); }
function ik(sx, sy, tx, ty, l1, l2, bend) {
  let dx = tx - sx, dy = ty - sy; let d = Math.hypot(dx, dy); d = clamp(d, Math.abs(l1 - l2) + .5, l1 + l2 - .5);
  const base = Math.atan2(dy, dx); const c = (l1 * l1 + d * d - l2 * l2) / (2 * l1 * d); const a1 = base + bend * Math.acos(clamp(c, -1, 1));
  const ex = sx + Math.cos(a1) * l1, ey = sy + Math.sin(a1) * l1;
  const a2 = Math.atan2(ty - ey, tx - ex); return [[ex, ey], [ex + Math.cos(a2) * l2, ey + Math.sin(a2) * l2]];
}

/* ============ karakter ============ */
// Kadro: baba (siyah kısa saç, kırmızı önlük), Emily (kahve saç), Ellie (at kuyruğu, kırmızı forma), Ben (dağınık saç), Mike (gözlük, gri tişört)
const CAST = {
  dad: { hair: 'short', hairCol: '#2a2524', shirt: '#f7f6f2', pants: '#2e2d33', apron: true },
  emily: { hair: 'bob', hairCol: '#7a4a2c', shirt: '#7fa7c9', pants: '#3d4a66' },
  ellie: { hair: 'pony', hairCol: '#5a3a24', shirt: '#c8473b', pants: '#f2efe8', kid: .78, jersey: '9' },
  ben: { hair: 'messy', hairCol: '#4a3426', shirt: '#7cb36a', pants: '#3b5c86', kid: .62 },
  mike: { hair: 'buzz', hairCol: '#2a2524', shirt: '#6e6b6a', pants: '#3a3836', glasses: true },
};
function person(o) {
  o = Object.assign({}, CAST[o.who] || {}, o);
  const s = o.s || 1, X = o.x, Y = o.y, f = o.f || 0, dir = o.dir || 1;
  const kid = o.kid || 1, hk = kid < 1 ? 1 + (1 - kid) * .55 : 1;   // çocuklarda kafa oransal olarak büyük
  const legL = 225 * kid, torso = 185 * kid, HR = 72 * hk, bw = 150 * (kid < 1 ? kid * 1.05 : 1);
  const lw = 5 / s;
  ctx.save(); ctx.translate(X, Y); ctx.scale(s, s);
  const W2 = (lx, ly) => [X + lx * s, Y + ly * s];
  let bob = 0; const ph = o.walk;
  if (ph !== undefined) bob = -Math.abs(Math.sin(ph)) * 10;
  let hipY = -legL + bob + (o.crouch || 0);
  if (o.sit) hipY = -(o.seat || 230);
  const lean = o.lean || 0;
  const shY = hipY - torso, shX = Math.sin(lean) * torso;
  const hx = shX + Math.sin(lean) * 70 * hk + (o.headDX || 0), hy = shY - 62 * hk + (o.headDY || 0);
  // arka saç (bob/pony)
  if (o.hair === 'pony') {
    const side = f >= 0 ? -1 : 1;
    ctx.save(); ctx.translate(hx + side * HR * .75, hy - HR * .35); ctx.rotate(side * .5 + Math.sin((o.t || 0) * 3) * .06);
    ell(0, HR * .55, HR * .28, HR * .7, o.hairCol, lw); ctx.restore();
  }
  if (o.hair === 'bob') { rr(hx - HR * 1.08, hy - HR * .3, HR * 2.16, HR * 1.25, HR * .5); fs(o.hairCol, lw); }
  if (o.hair === 'long') { rr(hx - HR * 1.1, hy - HR * .3, HR * 2.2, HR * 1.7, HR * .5); fs(o.hairCol, lw); }
  // bacaklar
  const legPts = (side) => {
    const hip = [side * 34 * (kid < 1 ? kid : 1), hipY];
    if (o.sit) { const k = [hip[0] + dir * 150 * kid, hipY + 8]; const ft = [k[0] + dir * 10, 0]; return [hip, k, ft]; }
    let a = 0; if (ph !== undefined) a = Math.sin(ph + (side > 0 ? 0 : Math.PI)) * .38;
    if (o.legs) a = o.legs[side > 0 ? 1 : 0];
    const k = [hip[0] + Math.sin(a) * legL * .5, hipY + Math.cos(a) * legL * .5];
    const kb = ph !== undefined ? Math.max(0, -Math.sin(ph + (side > 0 ? 0 : Math.PI))) * .5 : 0;
    const ft = [k[0] + Math.sin(a - kb) * legL * .5, k[1] + Math.cos(a - kb) * legL * .5];
    return [hip, k, ft];
  };
  if (!o.noLegs) for (const side of [-1, 1]) {
    const pts = legPts(side); limb(pts, 46 * Math.min(1, kid * 1.15), o.pants, lw);
    const ft = pts[2]; const fd = o.sit ? dir : (f >= 0 ? 1 : -1);
    ctx.beginPath(); ctx.ellipse(ft[0] + fd * 12, ft[1] - 8, 34 * kid + 4, 15, 0, 0, Math.PI * 2); fs('#2a2524', lw);
  }
  // gövde
  const tw = bw, bwid = bw * .92;
  ctx.beginPath();
  ctx.moveTo(shX - tw / 2 + 10, shY); ctx.quadraticCurveTo(shX - tw / 2 - 6, shY + 4, shX - tw / 2 - 4, shY + 40);
  ctx.lineTo(-bwid / 2, hipY + 30); ctx.quadraticCurveTo(0, hipY + 44, bwid / 2, hipY + 30);
  ctx.lineTo(shX + tw / 2 + 4, shY + 40); ctx.quadraticCurveTo(shX + tw / 2 + 6, shY + 4, shX + tw / 2 - 10, shY); ctx.closePath();
  fs(o.shirt, lw);
  if (o.jersey) text(o.jersey, shX + f * 20, (shY + hipY) / 2, 70 * kid, { font: ROUND, weight: 600, fill: '#fff' });
  if (o.apron) {
    ctx.beginPath(); ctx.moveTo(shX - 42, shY + 30); ctx.lineTo(shX + 42, shY + 30); ctx.lineTo(shX + 46, hipY - 40);
    ctx.lineTo(bwid / 2 + 14, hipY - 34); ctx.quadraticCurveTo(bwid / 2 + 22, hipY + 70, bwid / 2 + 6, hipY + 110);
    ctx.lineTo(-bwid / 2 - 6, hipY + 110); ctx.quadraticCurveTo(-bwid / 2 - 22, hipY + 70, -bwid / 2 - 14, hipY - 34); ctx.lineTo(shX - 46, hipY - 40); ctx.closePath();
    fs(o.apronCol || RED, lw);
    line(-bwid / 2 - 14, hipY - 36, bwid / 2 + 14, hipY - 36, 7, '#fff');
    line(shX - 40, shY + 32, shX - 22, shY - 2, 6, '#fff'); line(shX + 40, shY + 32, shX + 22, shY - 2, 6, '#fff');
    rr(shX - 30, hipY + 10, 60, 40, 8); fs(null, 3, 'rgba(0,0,0,.25)');
  }
  if (o.towel) { ctx.save(); ctx.translate(shX + tw * .38, shY + 6); ctx.rotate(.15); rr(-22, -10, 44, 120, 14); fs('#fff', lw); ctx.restore(); }
  // kollar
  const shL = [shX - tw / 2 + 8, shY + 22], shR = [shX + tw / 2 - 8, shY + 22];
  const ua = 112 * kid * 1.05, la = 104 * kid * 1.05;
  const defL = [shL[0] - 22, shL[1] + ua + la - 20], defR = [shR[0] + 22, shR[1] + ua + la - 20];
  const toLocal = p => [(p[0] - X) / s, (p[1] - Y) / s];
  const tgt = (spec, def, sh, side) => {
    if (!spec) { if (ph !== undefined) { const sw = Math.sin(ph + (side < 0 ? 0 : Math.PI)) * 50; return [def[0] + sw, def[1] - 6]; } return def; }
    if (spec.w) return toLocal(spec.w);
    return [sh[0] + spec[0], sh[1] + spec[1]];
  };
  const hands = {};
  const drawArm = (side) => {
    const sh = side < 0 ? shL : shR; const spec = side < 0 ? o.armL : o.armR;
    const t = tgt(spec, side < 0 ? defL : defR, sh, side);
    const [el, hd] = ik(sh[0], sh[1], t[0], t[1], ua, la, (side < 0 ? -1 : 1) * (o.elbowUp ? -1 : 1));
    limb([sh, el, hd], 32 * Math.min(1, kid * 1.2), HEAD, lw);
    const sl = [lerp(sh[0], el[0], .55), lerp(sh[1], el[1], .55)];
    limb([sh, sl], 46 * Math.min(1, kid * 1.2), o.sleeve || o.shirt, lw);
    const item = side < 0 ? o.holdL : o.holdR;
    if (item) { ctx.save(); ctx.translate(hd[0], hd[1]); ctx.scale(1 / s, 1 / s); item(); ctx.restore(); }
    circ(hd[0], hd[1], 22 * Math.min(1, kid * 1.25), HEAD, lw);
    hands[side < 0 ? 'L' : 'R'] = W2(hd[0], hd[1]);
  };
  if (o.armBehind === 'L' || o.armBehind === 'both') drawArm(-1);
  if (o.armBehind === 'R' || o.armBehind === 'both') drawArm(1);
  // kafa
  ell(hx, hy, HR, HR * 1.08, HEAD, lw);
  ctx.save(); ctx.beginPath(); ctx.ellipse(hx, hy, HR, HR * 1.08, 0, 0, Math.PI * 2); ctx.clip();
  ctx.beginPath(); ctx.ellipse(hx + HR * .62 - f * 22, hy + HR * .3, HR * .8, HR * 1.1, 0, 0, Math.PI * 2); ctx.fillStyle = HEADSH; ctx.globalAlpha = .55; ctx.fill(); ctx.restore();
  ell(hx, hy, HR, HR * 1.08, null, lw);
  if (Math.abs(f) > .15) ell(hx - (f >= 0 ? 1 : -1) * HR * .98, hy + 8, 12, 18, HEAD, lw);
  hair(o, hx, hy, HR, f, lw);
  face(o, hx, hy, HR, f, lw);
  const d = f >= 0 ? 1 : -1;
  if (o.hat === 'cap') { ctx.beginPath(); ctx.ellipse(hx, hy - HR * .45, HR * 1.03, HR * .72, 0, Math.PI, 2 * Math.PI); ctx.closePath(); fs(o.capCol || RED, lw);
    ctx.beginPath(); ctx.ellipse(hx + d * HR * .9, hy - HR * .45, HR * .7, HR * .16, d * .05, 0, Math.PI * 2); fs(o.capCol || RED, lw); }
  if (o.hat === 'helmet') { ctx.beginPath(); ctx.ellipse(hx, hy - HR * .25, HR * 1.12, HR * .95, 0, Math.PI, 2 * Math.PI); ctx.closePath(); fs('#1f3b6e', lw);
    ctx.beginPath(); ctx.ellipse(hx + d * HR * .95, hy - HR * .25, HR * .6, HR * .14, 0, 0, Math.PI * 2); fs('#1f3b6e', lw); circ(hx - d * HR * .7, hy + HR * .05, HR * .3, '#1f3b6e', lw); }
  if (o.armBehind !== 'L' && o.armBehind !== 'both') drawArm(-1);
  if (o.armBehind !== 'R' && o.armBehind !== 'both') drawArm(1);
  ctx.restore();
  return { hands, head: W2(hx, hy), headR: HR * s, sh: W2(shX, shY), hip: W2(0, hipY) };
}
function hair(o, hx, hy, R, f, lw) {
  const c = o.hairCol, d = f >= 0 ? 1 : -1;
  if (o.hair === 'short' || o.hair === 'buzz') {
    const h = o.hair === 'short' ? 1 : .93;
    ctx.beginPath();
    ctx.moveTo(hx - R * 1.0, hy - R * .05);
    ctx.bezierCurveTo(hx - R * 1.15, hy - R * 1.4 * h, hx + R * .3, hy - R * 1.62 * h, hx + R * 1.02, hy - R * .55);
    ctx.lineTo(hx + R * 1.01, hy - R * .1);
    ctx.quadraticCurveTo(hx + R * .9, hy - R * .42, hx + R * .55, hy - R * .52);
    if (o.hair === 'short') { ctx.quadraticCurveTo(hx + f * R * .3, hy - R * .3, hx - R * .25 + f * R * .2, hy - R * .62); ctx.quadraticCurveTo(hx - R * .6, hy - R * .5, hx - R * .82, hy - R * .1); }
    else { ctx.quadraticCurveTo(hx, hy - R * .7, hx - R * .82, hy - R * .25); }
    ctx.closePath(); fs(c, lw);
  } else if (o.hair === 'bob') {
    ctx.beginPath(); ctx.moveTo(hx - R * 1.08, hy + R * .55);
    ctx.bezierCurveTo(hx - R * 1.32, hy - R * 1.52, hx + R * 1.32, hy - R * 1.52, hx + R * 1.08, hy + R * .55);
    ctx.lineTo(hx + R * .82, hy + R * .5); ctx.quadraticCurveTo(hx + R * .95, hy - R * .3, hx + R * .4 * d, hy - R * .55);
    ctx.quadraticCurveTo(hx - R * .2 * d, hy - R * .25, hx - R * .78, hy - R * .1); ctx.lineTo(hx - R * .82, hy + R * .5); ctx.closePath(); fs(c, lw);
  } else if (o.hair === 'pony' || o.hair === 'long') {
    ctx.beginPath(); ctx.moveTo(hx - R * 1.02, hy - R * .05);
    ctx.bezierCurveTo(hx - R * 1.22, hy - R * 1.52, hx + R * 1.22, hy - R * 1.52, hx + R * 1.02, hy - R * .05);
    ctx.quadraticCurveTo(hx + R * .8, hy - R * .55, hx + R * .2 * d, hy - R * .6); ctx.quadraticCurveTo(hx - R * .5, hy - R * .55, hx - R * 1.02, hy - R * .05); ctx.closePath(); fs(c, lw);
  } else if (o.hair === 'messy') {
    for (const [a, l] of [[-2.5, 1.32], [-2.0, 1.42], [-1.5, 1.45], [-1.0, 1.4], [-.55, 1.3]]) {
      ctx.beginPath(); ctx.moveTo(hx + Math.cos(a - .28) * R * .9, hy + Math.sin(a - .28) * R * .9); ctx.quadraticCurveTo(hx + Math.cos(a) * R * l * 1.05, hy + Math.sin(a) * R * l, hx + Math.cos(a + .32) * R * .95, hy + Math.sin(a + .32) * R * .95); ctx.closePath(); fs(c, lw); }
    ctx.beginPath(); ctx.moveTo(hx - R * 1.0, hy - R * .05);
    ctx.bezierCurveTo(hx - R * 1.14, hy - R * 1.48, hx + R * 1.14, hy - R * 1.48, hx + R * 1.0, hy - R * .05);
    ctx.quadraticCurveTo(hx + R * .7, hy - R * .5, hx + R * .3, hy - R * .45); ctx.lineTo(hx + R * .1, hy - R * .3); ctx.lineTo(hx - R * .15, hy - R * .52); ctx.quadraticCurveTo(hx - R * .7, hy - R * .5, hx - R * 1.0, hy - R * .05); ctx.closePath(); fs(c, lw);
  } else if (o.hair === 'curly') {
    for (let i = 0; i < 9; i++) { const a = Math.PI * (1.0 + i / 8); circ(hx + Math.cos(a) * R * .92, hy - R * .15 + Math.sin(a) * R * .95, R * .32, c, lw); }
  } else if (o.hair === 'bald') {
    ctx.beginPath(); ctx.arc(hx - R * .95, hy, R * .25, Math.PI * .5, Math.PI * 1.5); fs(c, 0); ctx.beginPath(); ctx.arc(hx + R * .95, hy, R * .25, -Math.PI * .5, Math.PI * .5); fs(c, 0);
  }
}
function face(o, hx, hy, R, f, lw) {
  const ex = hx + f * R * .32, ey = hy + R * .02, sp = R * .36 * (1 - Math.abs(f) * .15);
  const e = o.face || 'calm', blink = o.t !== undefined && ((o.t + (o.seed || 0)) % 3.7) < .12;
  ctx.save(); ctx.fillStyle = INK; ctx.strokeStyle = INK; ctx.lineCap = 'round'; ctx.lineWidth = lw * 1.1;
  const look = o.look || [0, 0];
  for (const sd of [-1, 1]) {
    const x = ex + sd * sp + look[0] * R * .1, y = ey + look[1] * R * .1;
    if (e === 'happy' || e === 'laugh' || blink || e === 'sleep') { ctx.beginPath(); if (e === 'sleep' || blink) ctx.arc(x, y - 2, R * .1, .15 * Math.PI, .85 * Math.PI); else ctx.arc(x, y + 4, R * .1, 1.15 * Math.PI, 1.85 * Math.PI); ctx.stroke(); }
    else { ctx.beginPath(); ctx.ellipse(x, y, R * .085, R * (e === 'wide' ? .15 : .125), 0, 0, Math.PI * 2); ctx.fill(); }
    const by = ey - R * .3; let tilt = 0;
    if (e === 'worried' || e === 'sad') tilt = sd * .35; if (e === 'angry' || e === 'focus') tilt = -sd * .3;
    ctx.save(); ctx.translate(ex + sd * sp, by - (e === 'wide' ? R * .1 : 0)); ctx.rotate(tilt); ctx.beginPath(); ctx.moveTo(-R * .12, 0); ctx.lineTo(R * .12, 0); ctx.stroke(); ctx.restore();
  }
  const mx = hx + f * R * .34, my = hy + R * .45;
  if (e === 'smile' || e === 'happy') { ctx.beginPath(); ctx.arc(mx, my - R * .14, R * .18, .2 * Math.PI, .8 * Math.PI); ctx.stroke(); }
  else if (e === 'laugh' || e === 'grin') { ctx.beginPath(); ctx.arc(mx, my - R * .08, R * .2, 0, Math.PI); ctx.closePath(); ctx.fill(); ctx.fillStyle = '#e07a7a'; ctx.beginPath(); ctx.arc(mx, my + R * .07, R * .09, Math.PI, 0); ctx.fill(); }
  else if (e === 'wide' || e === 'o') { ctx.beginPath(); ctx.ellipse(mx, my, R * .07, R * .1, 0, 0, Math.PI * 2); ctx.fill(); }
  else if (e === 'sad' || e === 'worried') { ctx.beginPath(); ctx.arc(mx, my + R * .1, R * .14, 1.2 * Math.PI, 1.8 * Math.PI); ctx.stroke(); }
  else if (e === 'talk') { const k = .5 + .5 * Math.abs(Math.sin((o.t || 0) * 13)); ctx.beginPath(); ctx.ellipse(mx, my, R * .12, R * .1 * k + 1, 0, 0, Math.PI * 2); ctx.fill(); }
  else if (e === 'flat' || e === 'focus') { ctx.beginPath(); ctx.moveTo(mx - R * .1, my); ctx.lineTo(mx + R * .1, my); ctx.stroke(); }
  else if (e === 'sleep') { ctx.beginPath(); ctx.arc(mx, my, R * .06, 0, Math.PI * 2); ctx.fill(); }
  if (o.blush) { ctx.fillStyle = 'rgba(230,120,110,.35)'; for (const sd of [-1, 1]) { ctx.beginPath(); ctx.ellipse(ex + sd * sp * 1.25, ey + R * .3, R * .14, R * .08, 0, 0, Math.PI * 2); ctx.fill(); } }
  if (o.glasses) { ctx.lineWidth = lw * 1.3; for (const sd of [-1, 1]) { rr(ex + sd * sp - R * .23, ey - R * .17, R * .46, R * .34, R * .08); ctx.stroke(); } ctx.beginPath(); ctx.moveTo(ex - sp + R * .23, ey - R * .05); ctx.lineTo(ex + sp - R * .23, ey - R * .05); ctx.stroke(); }
  if (o.beard) { ctx.fillStyle = o.hairCol; ctx.beginPath(); ctx.arc(hx + f * R * .2, hy + R * .3, R * .75, .1 * Math.PI, .9 * Math.PI); ctx.quadraticCurveTo(hx, hy + R * .55, hx + R * .7, hy + R * .52); ctx.fill(); }
  ctx.restore();
}
// genel figüran
const EXTRA = [
  { hair: 'curly', hairCol: '#3a2a22', shirt: '#e3b23c', pants: '#4a5a7a' },
  { hair: 'bald', hairCol: '#6b5a50', shirt: '#5f8fbf', pants: '#3a3a3a', beard: true },
  { hair: 'long', hairCol: '#c99a5b', shirt: '#9b6fb0', pants: '#33415e' },
  { hair: 'short', hairCol: '#8a5a32', shirt: '#6aa36a', pants: '#5a4a3a' },
  { hair: 'bob', hairCol: '#2e2a28', shirt: '#e57f5e', pants: '#2f3d55' },
  { hair: 'buzz', hairCol: '#9b8b7b', shirt: '#4b7f8c', pants: '#46423f', hat: 'cap', capCol: '#3c6aa8' },
  { hair: 'long', hairCol: '#2a2220', shirt: '#f0a6a0', pants: '#4b5a78' },
  { hair: 'messy', hairCol: '#a0612e', shirt: '#7a8fd0', pants: '#3a3a40' },
];
function extra(i, o) { return person(Object.assign({}, EXTRA[((i % EXTRA.length) + EXTRA.length) % EXTRA.length], o)); }

/* ============ objeler ============ */
function hotdog(x, y, s = 1, rot = 0, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  rr(-58, -20, 116, 34, 16); fs('#dfa45c', 4);
  rr(-76, -24, 152, 28, 14); fs('#c4553a', 4);
  ctx.fillStyle = 'rgba(255,255,255,.35)'; rr(-62, -20, 90, 6, 3); ctx.fill();
  if (o.chili) { for (let i = 0; i < 10; i++) circ(-50 + i * 11, -24 + (i % 3) * 3, 8, '#8d3a22', 2); for (let i = 0; i < 7; i++) line(-44 + i * 14, -32, -34 + i * 14, -27, 5, '#f5b82e'); }
  else if (!o.plain) { ctx.beginPath(); for (let i = 0; i <= 16; i++) { const xx = -56 + i * 112 / 16, yy = -14 + Math.sin(i * 1.3) * 5; i ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); } ctx.lineWidth = 6; ctx.strokeStyle = o.ketchup ? KETCHUP : MUSTARD; ctx.stroke(); }
  if (o.onion) { for (let i = 0; i < 9; i++) circ(-46 + i * 11.5, -24 + (i % 2) * 5, 4.5, '#fff7e0', 2); }
  if (o.relish) { for (let i = 0; i < 8; i++) ell(-42 + i * 12, -22 + (i % 2) * 4, 5, 3, '#7cb342', 1.5); }
  ctx.beginPath(); ctx.moveTo(-64, -6); ctx.quadraticCurveTo(-68, 24, -40, 26); ctx.lineTo(40, 26); ctx.quadraticCurveTo(68, 24, 64, -6); ctx.quadraticCurveTo(0, 6, -64, -6); ctx.closePath(); fs('#efbd76', 4);
  ctx.restore();
}
function phone(x, y, s, rot, screen) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot || 0); ctx.scale(s, s);
  box(-60, -115, 120, 230, 18, '#2f2c2b', 5);
  ctx.save(); rr(-50, -100, 100, 200, 10); ctx.clip(); ctx.fillStyle = '#bfe0f5'; ctx.fillRect(-50, -100, 100, 200); if (screen) screen(); ctx.restore();
  rr(-50, -100, 100, 200, 10); fs(null, 3);
  ctx.restore();
}
function bill(x, y, s = 1, rot = 0, lab = '5') {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  box(-70, -32, 140, 64, 6, '#a9cf95', 4); rr(-60, -24, 120, 48, 4); fs(null, 2, 'rgba(40,80,40,.5)');
  ell(0, 0, 16, 20, '#c8e3b8', 2); text(lab, -44, -10, 22, { font: ROUND, weight: 600, fill: '#2f5a2a' }); text(lab, 44, 12, 22, { font: ROUND, weight: 600, fill: '#2f5a2a' });
  ctx.restore();
}
function coffee(x, y, s = 1) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); poly([[-24, -60], [24, -60], [18, 0], [-18, 0]], '#fff', 4); box(-28, -70, 56, 14, 5, '#5a3e2b', 4); rr(-22, -42, 44, 20, 4); fs('#c98b5a', 3); ctx.restore(); }
function softball(x, y, r = 14) { circ(x, y, r, '#f5e94a', 3); ctx.lineWidth = 2; ctx.strokeStyle = '#d0453a'; ctx.beginPath(); ctx.arc(x - r * 1.3, y, r, -.6, .6); ctx.stroke(); ctx.beginPath(); ctx.arc(x + r * 1.3, y, r, Math.PI - .6, Math.PI + .6); ctx.stroke(); }
function plate(x, y, s = 1) { ell(x, y, 70 * s, 18 * s, '#fff', 4); ell(x, y - 2, 46 * s, 10 * s, null, 2); }
function lamp(x, y, cord = 120, on = 1) {
  line(x, y - cord, x, y, 3);
  if (on) { ctx.save(); const g = ctx.createRadialGradient(x, y + 30, 0, x, y + 30, 300); g.addColorStop(0, `rgba(255,214,140,${.35 * on})`); g.addColorStop(1, 'rgba(255,214,140,0)'); ctx.fillStyle = g; ctx.fillRect(x - 300, y - 270, 600, 600); ctx.restore(); }
  ctx.beginPath(); ctx.moveTo(x - 10, y); ctx.lineTo(x + 10, y); ctx.lineTo(x + 46, y + 38); ctx.lineTo(x - 46, y + 38); ctx.closePath(); fs('#e2a24a', 4);
  ell(x, y + 40, 22, 6, '#fff3c4', 3);
}
function speech(x, y, txt, k = 1, o = {}) {
  if (k <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(back(k), back(k));
  const size = o.size || 42; ctx.font = `${size}px ${HAND}`;
  const lines = txt.split('\n'); const w = Math.max(...lines.map(l => ctx.measureText(l).width)) + 56, h = lines.length * size * 1.15 + 34;
  const tx = o.tail === undefined ? -1 : o.tail;
  rr(-w / 2, -h, w, h, 26); fs('#fff', 5);
  ctx.beginPath(); ctx.moveTo(tx * w * .15 - 16, -3); ctx.lineTo(tx * w * .3, 34); ctx.lineTo(tx * w * .15 + 22, -3); fs('#fff', 5);
  ctx.fillStyle = '#fff'; ctx.fillRect(tx * w * .15 - 12, -12, 30, 10);
  lines.forEach((l, i) => text(l, 0, -h + 17 + size * .62 + i * size * 1.15, size, o));
  ctx.restore();
}
function thought(x, y, w, h, k, draw) {
  if (k <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(back(k), back(k));
  for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; circ(Math.cos(a) * w * .45, -h / 2 + Math.sin(a) * h * .42, h * .2, '#fff', 5); }
  ell(0, -h / 2, w * .5, h * .45, '#fff', 0);
  circ(-w * .25, 30, 14, '#fff', 4); circ(-w * .33, 62, 8, '#fff', 4);
  ctx.save(); ctx.translate(0, -h / 2); draw && draw(); ctx.restore(); ctx.restore();
}
function badge(s, x, y, k, o = {}) {
  if (k <= 0) return; ctx.save(); ctx.translate(x, y); const sc = back(k) * (o.sc || 1); ctx.scale(sc, sc); ctx.rotate(o.rot === undefined ? -.03 : o.rot);
  const size = o.size || 64; ctx.font = `600 ${size}px ${ROUND}`; const w = ctx.measureText(s).width + size * .9, h = size * 1.45;
  box(-w / 2 + 6, -h / 2 + 8, w, h, h / 2.4, 'rgba(43,36,33,.9)', 0);
  box(-w / 2, -h / 2, w, h, h / 2.4, o.bg || '#fff6e0', 5);
  text(s, 0, 2, size, { font: ROUND, weight: 600, fill: o.col || INK });
  if (o.strike) line(-w / 2 + 20, 4, w / 2 - 20, -4, 9, RED);
  ctx.restore();
}
function label(s, x, y, size = 46, k = 1, o = {}) { if (k <= 0) return; ctx.save(); ctx.globalAlpha *= clamp(k * 2); text(s, x, y + (1 - eout(clamp(k))) * 20, size, Object.assign({ stroke: 10, strokeCol: '#fffaf0' }, o)); ctx.restore(); }
function clock(x, y, r, h, m) {
  circ(x, y, r, '#fffaf0', 5); for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; line(x + Math.cos(a) * r * .82, y + Math.sin(a) * r * .82, x + Math.cos(a) * r * .92, y + Math.sin(a) * r * .92, 3); }
  const ha = ((h % 12) + m / 60) / 12 * Math.PI * 2 - Math.PI / 2, ma = m / 60 * Math.PI * 2 - Math.PI / 2;
  line(x, y, x + Math.cos(ha) * r * .5, y + Math.sin(ha) * r * .5, 7); line(x, y, x + Math.cos(ma) * r * .75, y + Math.sin(ma) * r * .75, 5); circ(x, y, 6, INK, 0);
}
function paper(x, y, w, h, rot = 0, fill = '#fffdf6', lines = true) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); box(-w / 2 + 8, -h / 2 + 10, w, h, 6, 'rgba(60,40,30,.15)', 0); box(-w / 2, -h / 2, w, h, 6, fill, 5);
  if (lines) { ctx.strokeStyle = 'rgba(90,140,200,.25)'; ctx.lineWidth = 2; for (let yy = -h / 2 + 60; yy < h / 2 - 10; yy += 44) { ctx.beginPath(); ctx.moveTo(-w / 2 + 14, yy); ctx.lineTo(w / 2 - 14, yy); ctx.stroke(); } } ctx.restore(); }
function writeLines(lines, x, y, size, k, o = {}) {
  lines.forEach((l, i) => { const q = clamp(k - i); if (q <= 0) return; const n = Math.ceil(l.length * q);
    text(l.slice(0, n), x, y + i * size * (o.lh || 1.25), size, Object.assign({ align: 'left' }, o, (o.colors && o.colors[i]) ? { fill: o.colors[i] } : {})); });
}

/* ---------- sosisli arabası ---------- */
function cart(x, y, s = 1, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  shadow(0, 0, 330, .18);
  if (o.umbrella !== false) {
    limb([[-180, -300], [-180, -700]], 8, '#c9d0d4', 4);
    ctx.save(); ctx.translate(-180, -700);
    const dome = () => { ctx.beginPath(); ctx.moveTo(-300, 20); ctx.bezierCurveTo(-260, -110, 260, -110, 300, 20);
      for (let i = 8; i > 0; i--) { const xa = -300 + i * 75, xb = xa - 75; ctx.quadraticCurveTo((xa + xb) / 2, 44, xb, 20); } ctx.closePath(); };
    dome(); fs('#fff', 0); ctx.save(); dome(); ctx.clip();
    for (let i = 0; i < 8; i += 2) { ctx.beginPath(); ctx.moveTo(0, -84); ctx.lineTo(-300 + i * 75, 30); ctx.lineTo(-300 + (i + 1) * 75, 30); ctx.closePath(); ctx.fillStyle = RED; ctx.fill(); }
    ctx.fillStyle = 'rgba(0,0,0,.08)'; ctx.fillRect(0, -100, 320, 150); ctx.restore();
    for (let i = 1; i < 8; i++) line(0, -84, -300 + i * 75, 22, 3);
    dome(); fs(null, 5); circ(0, -86, 10, RED, 4); ctx.restore();
  }
  box(-320, -300, 640, 230, 26, STEEL, 6);
  ctx.save(); rr(-320, -300, 640, 230, 26); ctx.clip(); ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.fillRect(-300, -290, 40, 210); ctx.fillStyle = STEEL2; ctx.fillRect(-320, -110, 640, 40); ctx.restore();
  rr(-320, -300, 640, 230, 26); fs(null, 6);
  box(-300, -150, 600, 30, 8, RED, 4);
  box(-345, -330, 690, 40, 12, '#e6eaec', 6);
  for (let i = 0; i < 3; i++) { const bx = -40 + i * 110; if (i === 0 && o.lidOpen) continue; box(bx, -362, 96, 34, 10, '#dfe4e7', 5); line(bx + 30, -374, bx + 66, -374, 6); }
  if (o.lidOpen) { box(-40, -356, 96, 26, 6, '#7cb342', 5); ctx.save(); ctx.translate(-40, -362); ctx.rotate(-1.3); box(0, -34, 96, 34, 10, '#dfe4e7', 5); ctx.restore(); }
  const bottles = o.bottles === false ? [] : [[-280, MUSTARD], [-235, KETCHUP], [-190, MUSTARD]];
  bottles.forEach(([bx, c]) => { box(bx, -420, 38, 92, 12, c, 5); poly([[bx + 8, -420], [bx + 30, -420], [bx + 22, -446], [bx + 16, -446]], c, 4); });
  if (o.extraBottles) for (let i = 0; i < o.extraBottles; i++) { const bx = 50 + i * 46; box(bx, -420, 38, 92, 12, i % 2 ? KETCHUP : MUSTARD, 5); }
  if (o.sign !== false) sign(-95, -235, .95, o);
  line(320, -110, 420, -60, 12, '#555'); circ(425, -58, 10, '#555', 4);
  for (const wx of [-230, 230]) { circ(wx, -50, 52, '#3a3634', 6); circ(wx, -50, 22, '#b6bec4', 5); }
  if (o.menu) menuBoard(560, -360, .5, o.menuK === undefined ? 4 : o.menuK);
  ctx.restore();
}
function sign(x, y, s = 1, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  box(-190, -62, 520, 128, 16, '#fff6e2', 6);
  text(o.title || 'DAD DOGS AGAIN', 140, -18, 54, { font: ROUND, weight: 600, fill: RED2, maxW: 330 });
  dogDoodle(-118, 14, .9, o);
  text('hot dogs · chili · drinks', 140, 36, 30, { fill: '#6d5a4a' });
  ctx.restore();
}
function dogDoodle(x, y, s = 1, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const tail = o.tailK === undefined ? 1 : o.tailK;
  if (tail > 0) { ctx.beginPath(); ctx.moveTo(-42, -6); ctx.quadraticCurveTo(-62, -14, -64, -36); ctx.lineWidth = 6; ctx.strokeStyle = INK; ctx.stroke(); }
  for (const lx of [-28, -10, 14, 30]) limb([[lx, 10], [lx, 34]], 6, '#c98a4b', 3);
  ell(0, 0, 46, 24, '#c98a4b', 4); circ(40, -24, 21, '#c98a4b', 4); ell(54, -38, 8, 15, '#8a5a32', 3, .4);
  circ(46, -28, 3.5, INK, 0); circ(60, -20, 4.5, INK, 0);
  if (o.screw) { circ(-58, -22, 8, o.screwBlack ? INK : '#b6bec4', 3); line(-63, -22, -53, -22, 2, o.screwBlack ? '#555' : INK); }
  ctx.restore();
}
function menuBoard(x, y, s = 1, k = 4) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  box(-240, -40, 480, 520, 18, '#3b3f3c', 8); rr(-224, -24, 448, 488, 10); fs(null, 3, '#6b5a4a');
  text('MENU', 0, 22, 60, { font: ROUND, weight: 600, fill: '#fff6e2' });
  const items = [['Classic', '$4', 'mustard · onions · relish'], ['Chili Cheese', '$6', ''], ['Classic + chips + drink', '$7', ''], ["Ben's Plain", '$4', "ketchup. that's it."]];
  items.forEach(([n, p, d], i) => { const q = clamp(k - i); if (q <= 0) return; ctx.save(); ctx.globalAlpha *= q; const yy = 105 + i * 96 + (1 - eout(q)) * 20;
    text(n, -200, yy, 46, { align: 'left', fill: i === 3 ? '#ffd27a' : '#fff6e2', maxW: 300 }); text(p, 200, yy, 48, { align: 'right', fill: '#ffd27a', font: ROUND, weight: 600 });
    if (d) text(d, -200, yy + 38, 28, { align: 'left', fill: '#c9c2b2' }); ctx.restore(); });
  ctx.restore();
}

/* ---------- arka plan parçaları ---------- */
function sky(c1 = '#cfe6f2', c2 = '#f7efdc') { const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, c1); g.addColorStop(1, c2); ctx.fillStyle = g; ctx.fillRect(-200, -200, W + 400, H + 400); }
function cloudShape(x, y, s = 1) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = 'rgba(255,255,255,.9)'; for (const [dx, dy, r] of [[0, 0, 50], [55, -20, 60], [115, 0, 48], [60, 18, 50]]) { ctx.beginPath(); ctx.arc(dx, dy, r, 0, Math.PI * 2); ctx.fill(); } ctx.restore(); }
function tree(x, y, s = 1, col = '#7fae5f') { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); limb([[0, 0], [0, -180]], 30, '#8a6040', 5); for (const [dx, dy, r] of [[-60, -220, 80], [60, -230, 85], [0, -300, 95], [-20, -200, 70]]) circ(dx, dy, r, col, 5); ctx.save(); ctx.globalAlpha = .15; for (const [dx, dy, r] of [[-60, -220, 80], [60, -230, 85], [0, -300, 95]]) circ(dx + r * .25, dy + r * .25, r * .7, '#2d5a2a', 0); ctx.restore(); ctx.restore(); }
function ground(y, col) { ctx.fillStyle = col; ctx.fillRect(-200, y, W + 400, H - y + 200); line(-200, y, W + 200, y, 5); }
function brickWall(x0, y0, x1, y1, base = '#f6efe3') {
  ctx.fillStyle = base; ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
  ctx.strokeStyle = 'rgba(150,120,100,.28)'; ctx.lineWidth = 2;
  for (let y = y0, r = 0; y < y1; y += 44, r++) { ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke(); for (let x = x0 + (r % 2) * 60; x < x1; x += 120) { ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, Math.min(y1, y + 44)); ctx.stroke(); } }
}
function tent(x, y, w, h, c1, c2, o = {}) {
  line(x - w / 2 + 10, y, x - w / 2 + 10, y - h, 8, '#8f989e'); line(x + w / 2 - 10, y, x + w / 2 - 10, y - h, 8, '#8f989e');
  poly([[x - w / 2 - 20, y - h], [x + w / 2 + 20, y - h], [x + w / 2 - 30, y - h - 90], [x - w / 2 + 30, y - h - 90]], c1, 5);
  const n = 6; for (let i = 0; i < n; i++) { const xa = x - w / 2 - 20 + i * (w + 40) / n; ctx.beginPath(); ctx.moveTo(xa, y - h); ctx.lineTo(xa + (w + 40) / n, y - h); ctx.quadraticCurveTo(xa + (w + 40) / n / 2, y - h + 40, xa, y - h); fs(i % 2 ? c2 : c1, 4); }
  if (o.table !== false) { box(x - w / 2 + 20, y - 140, w - 40, 30, 6, WOOD, 5); rr(x - w / 2 + 24, y - 110, w - 48, 110, 4); fs(o.cloth || '#f3f0e8', 4);
    if (o.goods) o.goods(x, y - 140); }
}
function tomatoes(x, y) { box(x - 110, y - 10, 220, 14, 4, WOOD2, 3); for (let i = 0; i < 9; i++) circ(x - 80 + (i % 5) * 38 + (i > 4 ? 19 : 0), y - 26 - (i > 4 ? 28 : 0), 20, '#d9473a', 4); }
function veggies(x, y) { for (let i = 0; i < 7; i++) ell(x - 90 + i * 30, y - 22, 15, 24, i % 2 ? '#7fb35a' : '#f0a23c', 4, .3); }
function grain(alpha = .07) {
  if (!grain.c) { const c = document.createElement('canvas'); c.width = 640; c.height = 360; const g = c.getContext('2d'); const id = g.createImageData(640, 360);
    let sd = 7; const r = () => { sd = (sd * 16807) % 2147483647; return sd / 2147483647; };
    for (let i = 0; i < id.data.length; i += 4) { const v = 128 + (r() - .5) * 120; id.data[i] = id.data[i + 1] = id.data[i + 2] = v; id.data[i + 3] = 255; } g.putImageData(id, 0, 0); grain.c = c; }
  ctx.save(); ctx.globalAlpha = alpha; ctx.globalCompositeOperation = 'overlay'; ctx.drawImage(grain.c, 0, 0, W, H); ctx.restore();
}
function vignette(a = .22) { const g = ctx.createRadialGradient(W / 2, H / 2, H * .35, W / 2, H / 2, H * 1.05); g.addColorStop(0, 'rgba(60,35,20,0)'); g.addColorStop(1, `rgba(60,35,20,${a})`); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); }
