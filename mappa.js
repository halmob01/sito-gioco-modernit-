/* ---------- canvas ---------- */
const cv = $('map'), ctx = cv.getContext('2d');
let T = 50, dpr = 1, W = 0;
function resize() {
  const r = $('mapwrap').getBoundingClientRect(); W = Math.max(280, r.width - 6);
  T = W / GW; dpr = Math.min(2, window.devicePixelRatio || 1);
  cv.style.height = (T * GH) + 'px'; cv.width = Math.round(W * dpr); cv.height = Math.round(T * GH * dpr);
}
let roW = 0, roRaf = 0;
try { new ResizeObserver(es => { const w = Math.round(es[0].contentRect.width); if (w === roW) return; roW = w; cancelAnimationFrame(roRaf); roRaf = requestAnimationFrame(resize); }).observe($('mapwrap')); } catch (e) { window.addEventListener('resize', resize); }
resize();

const ents = [], fires = [], smoke = [], floats = [], timers = [], vill = [], sparks = [];
const appear = {};
function later(t, fn) { timers.push({ t, fn }); }
function rnd(a, b) { return a + Math.random() * (b - a); }
function say(text, x, y, color = '#c8102e', delay = 0) { floats.push({ text, x, y, t: -delay, color }); }

const ROAD1 = [[6.8, 0.2], [5.2, 1.2], [4.2, 1.9], [3.7, 2.6], [3.6, 3.2]];
const SPAWN = { tl: [0.3, 0.3], r: [7.4, 3.2] };
const GATE = { tl: [2.95, 3.35], r: [4.15, 3.45] };
const VCEN = [1.5, 3.55];
function fieldPoint() { const all = FIELDS_BASE.concat(FIELD_SLOTS.slice(0, st ? st.terre : 0)); const f = all[Math.floor(Math.random() * all.length)]; return [f[0] + 0.5, f[1] + 0.5]; }
function addFlames(zone, dur) {
  if (zone === 'village') for (let i = 0; i < 5; i++) fires.push({ x: rnd(1.1, 1.9), y: rnd(3.2, 3.8), t: -i * 0.15, dur });
  else { const all = FIELDS_BASE.concat(FIELD_SLOTS.slice(0, st ? st.terre : 0)); all.forEach(f => { for (let i = 0; i < 2; i++) fires.push({ x: f[0] + rnd(0.2, 0.8), y: f[1] + rnd(0.3, 0.8), t: -rnd(0, .6), dur }); }); }
}
function burst(x, y, n = 14) { for (let i = 0; i < n; i++) { const a = rnd(0, 6.283), v = rnd(.5, 1.6); sparks.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, t: 0, life: rnd(.4, .9) }); } }

function walker(kind, path, o = {}) {
  ents.push(Object.assign({ kind, x: path[0][0], y: path[0][1], path, i: 0, speed: 1.2, delay: 0, wait: 0, carry: false }, o));
}
function playAnim(a) {
  if (!a) return;
  const d = reduced ? 0.6 : 1;
  if (a.k === 'leave') { for (let i = 0; i < 3; i++) walker('guard', [[3.6, 3.2], [3.7, 2.6], [4.2, 1.9], [5.2, 1.2], [6.8, 0.2]], { speed: 0.9, delay: i * .5 }); }
  else if (a.k === 'arrive') { for (let i = 0; i < (a.n || 3); i++) walker('villager', [[0.05, 3.95], [0.9, 3.85], [1.4 + i * .1, 3.6]], { speed: 0.8, delay: i * .45, vanishAtEnd: 1.5 }); }
  else if (a.k === 'messenger') { walker('rider', ROAD1.concat([[3.6, 3.2, 2.2]]).map(p => p.slice()), { speed: 1.6, banner: true, onEnd: e => { e.onEnd = null; e.path = ROAD1.slice().reverse().map(p => p.slice()); e.i = 0; e.done = false; e.x = 3.6; e.y = 3.2; } }); }
  else if (a.k === 'cart') { walker('cart', a.dir === 'r' ? [[3.9, 3.5], [5, 3.4], [7.4, 3.4]] : [[3.6, 3.2], [3.7, 2.6], [4.2, 1.9], [5.2, 1.2], [6.8, 0.2]], { speed: 0.9 }); }
  else if (a.k === 'monks') { for (let i = 0; i < 3; i++) walker('monk', ROAD1.concat([[4.4, 3.5], [5.45, 3.7, 1.2]]).map(p => p.slice()), { speed: 1.0, delay: i * .5, vanishAtEnd: 1.2 }); }
  else if (a.k === 'raid') spawnRaid(a, d);
}
function spawnRaid(sp) {
  const from = SPAWN[sp.from], gate = GATE[sp.from], rider = sp.type === 'rider';
  const sp1 = rider ? 3.0 : 1.5, back = rider ? 3.4 : 2.0;
  const col = sp.type;
  const reach = Math.hypot(gate[0] - from[0], gate[1] - from[1]) / sp1;
  if (sp.out !== 'join') {
    const n = Math.max(3, st ? st.guardie : 3);
    if (sp.out === 'ok' || sp.out === 'part') for (let i = 0; i < n; i++) {
      const gx = gate[0] + (sp.from === 'r' ? .1 : -.05), gy = gate[1] + (i - n / 2) * .1;
      walker('guard', [[CC[0], CC[1]], [gx, gy, 2.4], [CC[0], CC[1]]], { speed: 1.4, delay: reach - 1.1, vanishAtEnd: 0 });
    }
  }
  for (let i = 0; i < sp.n; i++) {
    const off = [rnd(-.1, .1) + (i % 3) * .1, Math.floor(i / 3) * .12];
    const s = [from[0] + off[0], from[1] + off[1]], delay = i * .12;
    const g = [gate[0] + rnd(-.1, .1), gate[1] + rnd(-.15, .15)];
    let path, opts = { speed: sp1 * rnd(.9, 1.1), delay };
    if (sp.out === 'ok') { path = [s, [g[0], g[1], 1.3], s]; opts.speedBack = back; }
    else if (sp.out === 'loot') { path = [s, [g[0], g[1], .6], s]; opts.carryFrom = 1; opts.speedBack = back; }
    else if (sp.out === 'join') { path = [s, [g[0], g[1]]]; opts.vanishAtEnd = 0; opts.speed = 1.2; }
    else if (sp.out === 'part') { const f = fieldPoint(); path = [s, [g[0], g[1], 1.0], [f[0], f[1], 1.6], s]; opts.carryFrom = 2; opts.speedBack = back; }
    else { const f = fieldPoint(); path = [s, [g[0], g[1], .6], [VCEN[0] + rnd(-.3, .3), VCEN[1] + rnd(-.2, .2), 1.8]]; if (sp.burn.includes('fields')) path.push([f[0], f[1], 1.2]); path.push(s); opts.carryFrom = 2; opts.speedBack = back; }
    walker(col, path.map(p => p.slice()), opts);
  }
  if (sp.out === 'ok') later(reach + .1, () => { burst(gate[0], gate[1], 22); say('Respinti!', gate[0], gate[1] - .4, '#c8102e'); });
  if (sp.out === 'part') later(reach + .1, () => { burst(gate[0], gate[1], 16); say('Resistono a metà', gate[0], gate[1] - .4); });
  if (sp.out === 'part' && sp.burn && sp.burn.includes('fields')) later(reach + 2, () => addFlames('fields', 5));
  else if (sp.out === 'part') later(reach + 2.4, () => addFlames('fields', 4));
  if (sp.out === 'bad') {
    const tv = reach + Math.hypot(gate[0] - VCEN[0], gate[1] - VCEN[1]) / sp1 + .6;
    later(tv, () => { if (sp.burn.includes('village')) addFlames('village', 7); say('Saccheggio!', VCEN[0], VCEN[1] - .5); });
    if (sp.burn.includes('fields')) later(tv + 1.8, () => addFlames('fields', 5));
  }
  if (sp.out === 'loot') later(reach + .3, () => say('Portano via il grano', gate[0], gate[1] - .4));
}

function stepEnt(e, dt) {
  if (e.delay > 0) { e.delay -= dt; return; }
  if (e.wait > 0) { e.wait -= dt; if (e.wait <= 0 && e.vanishNow) e.dead = true; return; }
  if (e.done) { if (e.vanishAtEnd !== undefined) { e.vt = (e.vt || 0) + dt; if (e.vt >= e.vanishAtEnd) e.dead = true; } else e.dead = true; return; }
  const nx = e.path[e.i + 1]; if (!nx) { e.done = true; return; }
  let sp = e.speed; if (e.carryFrom !== undefined && e.i + 1 >= e.path.length - 1 && e.speedBack) sp = e.speedBack;
  const dx = nx[0] - e.x, dy = nx[1] - e.y, dist = Math.hypot(dx, dy), step = sp * dt;
  if (step >= dist) {
    e.x = nx[0]; e.y = nx[1]; e.i++;
    if (e.carryFrom !== undefined && e.i >= e.carryFrom) e.carry = true;
    if (nx[2]) e.wait = nx[2];
    if (e.i >= e.path.length - 1) { e.done = true; if (e.onEnd) e.onEnd(e); }
  } else { e.x += dx / dist * step; e.y += dy / dist * step; e.dir = dx >= 0 ? 1 : -1; }
}
function raidersActive() { return ents.some(e => (e.kind === 'bandit' || e.kind === 'rider') && !e.dead); }

function update(dt) {
  for (let i = timers.length - 1; i >= 0; i--) { timers[i].t -= dt; if (timers[i].t <= 0) { const f = timers[i].fn; timers.splice(i, 1); f(); } }
  ents.forEach(e => stepEnt(e, dt)); for (let i = ents.length - 1; i >= 0; i--) if (ents[i].dead) ents.splice(i, 1);
  for (let i = fires.length - 1; i >= 0; i--) { fires[i].t += dt; if (fires[i].t > fires[i].dur) fires.splice(i, 1); }
  for (let i = floats.length - 1; i >= 0; i--) { floats[i].t += dt; if (floats[i].t > 2.2) floats.splice(i, 1); }
  for (let i = sparks.length - 1; i >= 0; i--) { const p = sparks[i]; p.t += dt; p.x += p.vx * dt; p.y += p.vy * dt; if (p.t > p.life) sparks.splice(i, 1); }
  for (let i = smoke.length - 1; i >= 0; i--) { const p = smoke[i]; p.t += dt; p.x += p.vx * dt; p.y -= .22 * dt; if (p.t > 2.6) smoke.splice(i, 1); }
  if (!reduced && Math.random() < dt * 2.2) { const S = st || DEMO; const hs = housePos(S).slice(0, 3); const h = hs[Math.floor(Math.random() * hs.length)]; smoke.push({ x: h[0] + .04, y: h[1] - .16, vx: rnd(.02, .08), t: 0 }); }
  const S = st || DEMO, n = 2 + Math.floor(S.p / 14), alert = raidersActive();
  while (vill.length < n) vill.push({ x: rnd(1.2, 1.9), y: rnd(3.3, 3.9), tx: 1.5, ty: 3.6, wait: rnd(0, 2) });
  while (vill.length > n) vill.pop();
  vill.forEach(v => {
    if (alert) { v.tx = CC[0] - .5; v.ty = CC[1] + .1; v.wait = 0; }
    else if (v.wait > 0) { v.wait -= dt; return; }
    const dx = v.tx - v.x, dy = v.ty - v.y, d = Math.hypot(dx, dy), sp = alert ? 1.3 : .28;
    if (d < .03) { v.wait = rnd(.5, 3); const z = Math.random(); if (z < .5) { v.tx = rnd(1.2, 1.9); v.ty = rnd(3.3, 3.9); } else { const f = fieldPoint(); v.tx = f[0] + rnd(-.3, .3); v.ty = f[1] + rnd(-.25, .25); } }
    else { v.x += dx / d * sp * dt; v.y += dy / d * sp * dt; v.dir = dx >= 0 ? 1 : -1; }
  });
}

/* ---------- disegno ---------- */
const DEMO = { fort: 0, terre: 0, vass: 0, chiesa: 0, guardie: 0, p: 50, turn: 0 };
function housePos(S) {
  const all = [[1.2, 3.3], [1.62, 3.25], [1.4, 3.7], [1.78, 3.72], [1.1, 3.68], [1.55, 2.92]];
  return all.slice(0, 2 + Math.floor(S.p / 25));
}
function pt(x, y) { return [x * T, y * T]; }
function ptext(txt, x, y, size, color, o = {}) {
  txt = tr(txt);
  ctx.save(); ctx.direction = LANG === 'ar' && !/^[\u2066+−]/.test(txt) ? 'rtl' : 'ltr'; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.font = `${o.weight || 800} ${size}px ${LANG === 'ar' ? '"Cairo", "Noto Sans Arabic", "DejaVu Sans"' : '"Public Sans"'}, system-ui, sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  const [px, py] = pt(x, y);
  if (o.bg) { const w = ctx.measureText(txt).width + 10, h = size + 7; ctx.globalAlpha = o.alpha === undefined ? 1 : o.alpha; ctx.fillStyle = o.bg; ctx.fillRect(px - w / 2, py - h / 2, w, h); if (o.border) { ctx.strokeStyle = o.border; ctx.lineWidth = 2; ctx.strokeRect(px - w / 2, py - h / 2, w, h); } }
  ctx.globalAlpha = o.alpha === undefined ? 1 : o.alpha; ctx.fillStyle = color; ctx.fillText(txt, px, py); ctx.restore();
}
function person(x, y, body, s = 1.25, head = '#f2dcc8') {
  ctx.fillStyle = body; ctx.beginPath(); ctx.ellipse(x, y, .042 * s, .07 * s, 0, 0, 6.283); ctx.fill();
  ctx.fillStyle = head; ctx.beginPath(); ctx.arc(x, y - .09 * s, .034 * s, 0, 6.283); ctx.fill();
}
function rect(x, y, w, h, fill, stroke, lw = .018) { ctx.fillStyle = fill; ctx.fillRect(x, y, w, h); if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.strokeRect(x, y, w, h); } }
function poly(pts, fill, stroke, lw = .018) { ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.closePath(); ctx.fillStyle = fill; ctx.fill(); if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); } }
const INK = '#1c1416', RED = '#c8102e';
const TREES = (() => { let s = 7; const r = () => (s = (s * 9301 + 49297) % 233280) / 233280; const out = []; [[1, 0], [2, 0], [3, 0], [2, 1], [6, 2], [6, 5], [5, 5], [4, 5], [0, 5]].forEach(([tx, ty]) => { for (let i = 0; i < 4; i++) out.push({ x: tx + .15 + r() * .7, y: ty + .2 + r() * .65, s: .8 + r() * .5 }); }); return out; })();

function drawVilla(cx, cy) {
  rect(cx - .28, cy - .08, .56, .26, '#ffffff', INK);
  poly([[cx - .34, cy - .08], [cx, cy - .32], [cx + .34, cy - .08]], RED, INK);
  for (let i = 0; i < 5; i++) { ctx.strokeStyle = INK; ctx.lineWidth = .02; ctx.beginPath(); ctx.moveTo(cx - .22 + i * .11, cy - .06); ctx.lineTo(cx - .22 + i * .11, cy + .18); ctx.stroke(); }
}
function drawStakes(cx, cy, rx, ry, n) {
  ctx.strokeStyle = '#7a5a40'; ctx.lineWidth = .035; ctx.lineCap = 'round';
  for (let i = 0; i < n; i++) { const a = i / n * 6.283, x = cx + Math.cos(a) * rx, y = cy + Math.sin(a) * ry + .06; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y - .13); ctx.stroke(); }
  ctx.lineCap = 'butt';
}
function drawCastle(S, time) {
  const cx = CC[0], cy = CC[1], f = S.fort;
  if (f >= 2) { ctx.strokeStyle = '#a9c4d3'; ctx.lineWidth = f === 3 ? .1 : .08; ctx.beginPath(); ctx.ellipse(cx, cy + .06, f === 3 ? .66 : .56, f === 3 ? .52 : .44, 0, 0, 6.283); ctx.stroke(); }
  if (f === 0) drawVilla(cx, cy);
  if (f === 1) { drawVilla(cx, cy + .02); drawStakes(cx, cy + .02, .5, .38, 18); }
  if (f === 2) {
    drawStakes(cx, cy, .5, .38, 16);
    rect(cx - .15, cy - .4, .3, .6, '#efe9e3', INK);
    for (let i = 0; i < 3; i++) rect(cx - .15 + i * .11, cy - .47, .075, .08, '#efe9e3', INK, .014);
    rect(cx - .035, cy - .2, .07, .12, INK);
    flag(cx, cy - .47, time);
  }
  if (f === 3) {
    rect(cx - .52, cy - .28, 1.04, .56, '#efe9e3', INK, .025);
    for (let i = 0; i < 8; i++) rect(cx - .52 + i * .135, cy - .35, .07, .08, '#efe9e3', INK, .014);
    [[-.52, -.28], [.52, -.28], [-.52, .28], [.52, .28]].forEach(([dx, dy]) => { rect(cx + dx - .1, cy + dy - .22, .2, .3, '#e3dcd4', INK, .02); rect(cx + dx - .1, cy + dy - .28, .06, .07, '#e3dcd4', INK, .012); rect(cx + dx + .04, cy + dy - .28, .06, .07, '#e3dcd4', INK, .012); });
    rect(cx - .17, cy - .5, .34, .62, '#e8e1d9', INK, .025);
    for (let i = 0; i < 3; i++) rect(cx - .17 + i * .12, cy - .57, .08, .08, '#e8e1d9', INK, .014);
    ctx.fillStyle = INK; ctx.beginPath(); ctx.moveTo(cx - .08, cy + .28); ctx.lineTo(cx - .08, cy + .14); ctx.arc(cx, cy + .14, .08, Math.PI, 0); ctx.lineTo(cx + .08, cy + .28); ctx.closePath(); ctx.fill();
    flag(cx, cy - .57, time);
  }
}
function flag(x, y, time) {
  ctx.strokeStyle = INK; ctx.lineWidth = .025; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y - .24); ctx.stroke();
  const w = Math.sin(time * 4) * .03; ctx.fillStyle = RED; ctx.beginPath(); ctx.moveTo(x, y - .24); ctx.lineTo(x + .17, y - .2 + w); ctx.lineTo(x, y - .12); ctx.closePath(); ctx.fill();
}
function drawChurch(S) {
  const [tx, ty] = POS.chiesa, cx = tx + .5, cy = ty + .62;
  if (S.chiesa >= 1) {
    rect(cx - .2, cy - .12, .4, .26, '#ffffff', INK); poly([[cx - .25, cy - .12], [cx, cy - .32], [cx + .25, cy - .12]], RED, INK);
    ctx.strokeStyle = INK; ctx.lineWidth = .025; ctx.beginPath(); ctx.moveTo(cx, cy - .32); ctx.lineTo(cx, cy - .45); ctx.moveTo(cx - .045, cy - .4); ctx.lineTo(cx + .045, cy - .4); ctx.stroke();
    rect(cx - .03, cy + .02, .06, .12, INK);
  }
  if (S.chiesa >= 2) { rect(cx + .24, cy - .36, .12, .5, '#efe9e3', INK); poly([[cx + .22, cy - .36], [cx + .3, cy - .52], [cx + .38, cy - .36]], RED, INK); rect(cx + .28, cy - .28, .04, .08, INK); }
}
function drawField(x, y, S, k, time) {
  const a = appear[k] === undefined ? 1 : Math.min(1, appear[k]);
  const aut = (S.turn || 0) % 2 === 1;
  ctx.save(); ctx.translate(x + .5, y + .5); ctx.scale(a, a); ctx.translate(-x - .5, -y - .5);
  rect(x + .07, y + .1, .86, .8, aut ? '#f6e7b8' : '#eef1d8', 'rgba(28,20,22,.25)', .012);
  ctx.strokeStyle = aut ? '#d9a441' : '#a4b878'; ctx.lineWidth = .035;
  for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.moveTo(x + .16 + i * .17, y + .16); ctx.lineTo(x + .16 + i * .17, y + .84); ctx.stroke(); }
  ctx.restore();
}
function drawHouse(x, y) { rect(x - .09, y - .05, .18, .13, '#ffffff', INK, .015); poly([[x - .12, y - .05], [x, y - .17], [x + .12, y - .05]], RED, INK, .015); }
function drawTower(x, y, time, big) {
  rect(x - .07, y - .22, .14, .3, '#efe9e3', INK, .016); for (let i = 0; i < 2; i++) rect(x - .07 + i * .09, y - .27, .05, .06, '#efe9e3', INK, .012);
  flag(x, y - .27, time);
}
function drawTargets(time) {
  if (!st || st.phase !== 'map' || st.ap <= 0) return;
  const L = ORDERS(st);
  L.forEach(o => {
    const t = tileFor(o.id); if (!t) return;
    const sel = ui.sel.includes(o.id), p = reduced ? .7 : .55 + .45 * Math.sin(time * 4.5);
    ctx.save(); ctx.strokeStyle = RED; ctx.lineWidth = sel ? .07 : .045; ctx.globalAlpha = sel ? 1 : p;
    if (sel) { ctx.fillStyle = 'rgba(200,16,46,.14)'; ctx.fillRect(t[0] + .04, t[1] + .04, .92, .92); }
    ctx.setLineDash([.12, .07]); ctx.strokeRect(t[0] + .05, t[1] + .05, .9, .9); ctx.restore();
    ptext(o.label, t[0] + .5, t[1] + .93, Math.max(10, Math.min(13, T * .22)), '#fff', { bg: RED, weight: 800 });
  });
}
const FX_TILE = { ricostruisci: POS.village, razione: POS.castle, riscuoti: POS.castle, giustizia: POS.piazza, scuola: POS.chiesa, esplora: POS.road };
function tileFor(id) {
  switch (id) {
    case 'fort': return POS.castle; case 'help': return POS.village; case 'drill': return POS.piazza;
    case 'ally': case 'king': return POS.road; case 'chiesa': return POS.chiesa;
    case 'terre': return st ? FIELD_SLOTS[st.terre] : null; case 'vass': return st ? HILLS[st.vass] : null; default: return null;
  }
}
function drawEnt(e, time) {
  if (e.delay > 0) return;
  const b = Math.sin(time * 11 + e.x * 5) * .012;
  if (e.kind === 'bandit') { person(e.x, e.y + b, RED, 1.3); if (e.carry) rect(e.x + .03, e.y - .03, .06, .06, '#8b6b4a', INK, .01); }
  else if (e.kind === 'rider') {
    ctx.fillStyle = '#5a4034'; ctx.beginPath(); ctx.ellipse(e.x, e.y + .02 + b, .12, .06, 0, 0, 6.283); ctx.fill(); person(e.x, e.y - .04 + b, RED, 1.2);
    if (e.carry) rect(e.x - .1, e.y - .03, .06, .06, '#8b6b4a', INK, .01);
  }
  else if (e.kind === 'guard') { person(e.x, e.y + b, INK, 1.3, '#ffffff'); }
  else if (e.kind === 'villager') person(e.x, e.y + b, '#6c5f63', 1.2);
  else if (e.kind === 'monk') person(e.x, e.y + b, '#8a6f5a', 1.25, '#f2dcc8');
  else if (e.kind === 'cart') { rect(e.x - .1, e.y - .06, .2, .09, '#a7835c', INK, .012); ctx.fillStyle = INK; ctx.beginPath(); ctx.arc(e.x - .06, e.y + .04, .035, 0, 6.283); ctx.arc(e.x + .06, e.y + .04, .035, 0, 6.283); ctx.fill(); rect(e.x - .06, e.y - .11, .05, .05, '#e0c36a', INK, .008); rect(e.x + .01, e.y - .11, .05, .05, '#e0c36a', INK, .008); }
  if (e.banner) { ctx.fillStyle = RED; ctx.beginPath(); ctx.moveTo(e.x, e.y - .2); ctx.lineTo(e.x + .13 * (e.dir || 1), e.y - .17); ctx.lineTo(e.x, e.y - .13); ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = .014; ctx.beginPath(); ctx.moveTo(e.x, e.y - .1); ctx.lineTo(e.x, e.y - .21); ctx.stroke(); }
  if (e.kind === 'rider' && !e.banner) { ctx.strokeStyle = INK; ctx.lineWidth = .014; ctx.beginPath(); ctx.moveTo(e.x, e.y - .1); ctx.lineTo(e.x, e.y - .21); ctx.stroke(); }
}
function draw(time) {
  const S = st || DEMO;
  ctx.setTransform(dpr * T, 0, 0, dpr * T, 0, 0);
  ctx.fillStyle = '#fbf7f2'; ctx.fillRect(0, 0, GW, GH);
  ctx.strokeStyle = 'rgba(28,20,22,.07)'; ctx.lineWidth = .012;
  for (let i = 1; i < GW; i++) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, GH); ctx.stroke(); }
  for (let j = 1; j < GH; j++) { ctx.beginPath(); ctx.moveTo(0, j); ctx.lineTo(GW, j); ctx.stroke(); }
  // fiume
  ctx.strokeStyle = '#bcd3df'; ctx.lineWidth = .24; ctx.lineCap = 'round'; ctx.beginPath();
  for (let y = -.1; y <= GH + .1; y += .1) { const x = .42 + .07 * Math.sin(y * 1.7 + time * .5); y < 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); } ctx.stroke(); ctx.lineCap = 'butt';
  ctx.strokeStyle = 'rgba(255,255,255,.7)'; ctx.lineWidth = .02; for (let k = 0; k < 6; k++) { const y0 = (k * 1.1 + time * .25) % GH; ctx.beginPath(); ctx.moveTo(.36 + .07 * Math.sin(y0 * 1.7 + time * .5), y0); ctx.lineTo(.42 + .07 * Math.sin((y0 + .3) * 1.7 + time * .5), y0 + .3); ctx.stroke(); }
  // strade
  ctx.strokeStyle = '#e3d6c6'; ctx.lineWidth = .17; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  [[[6.9, .1], [5.2, 1.2], [4.0, 2.0], [3.55, 3.0]], [[3.55, 3.0], [2.3, 3.7], [1.2, 3.95], [0.0, 4.0]]].forEach(r => { ctx.beginPath(); r.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.stroke(); });
  ctx.strokeStyle = 'rgba(28,20,22,.25)'; ctx.lineWidth = .012; ctx.setLineDash([.1, .1]);
  [[[6.9, .1], [5.2, 1.2], [4.0, 2.0], [3.55, 3.0]], [[3.55, 3.0], [2.3, 3.7], [1.2, 3.95], [0.0, 4.0]]].forEach(r => { ctx.beginPath(); r.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.stroke(); }); ctx.setLineDash([]); ctx.lineCap = 'butt';
  rect(.28, 3.88, .3, .24, '#d8c3a5', INK, .014);
  // alberi
  TREES.forEach(t => { ctx.strokeStyle = '#6d5a48'; ctx.lineWidth = .02; ctx.beginPath(); ctx.moveTo(t.x, t.y + .06); ctx.lineTo(t.x, t.y + .14); ctx.stroke(); ctx.fillStyle = '#a9b59b'; ctx.beginPath(); ctx.arc(t.x, t.y, .11 * t.s, 0, 6.283); ctx.fill(); ctx.strokeStyle = 'rgba(28,20,22,.35)'; ctx.lineWidth = .012; ctx.stroke(); });
  // colline e torri dei vassalli
  HILLS.forEach((h, i) => { const x = h[0] + .5, y = h[1] + .78; ctx.fillStyle = '#efe7dc'; ctx.strokeStyle = 'rgba(28,20,22,.3)'; ctx.lineWidth = .014; ctx.beginPath(); ctx.ellipse(x, y, .42, .22, 0, Math.PI, 0); ctx.closePath(); ctx.fill(); ctx.stroke(); if (S.vass > i) drawTower(x, y - .06, time); });
  // campi
  FIELDS_BASE.forEach((f, i) => drawField(f[0], f[1], S, 'b' + i, time));
  FIELD_SLOTS.slice(0, S.terre).forEach((f, i) => drawField(f[0], f[1], S, 'f' + i, time));
  // piazza d'armi
  { const [px, py] = POS.piazza; ctx.strokeStyle = S.guardie ? INK : 'rgba(28,20,22,.35)'; ctx.lineWidth = .02; ctx.setLineDash([.06, .05]); ctx.strokeRect(px + .15, py + .2, .7, .6); ctx.setLineDash([]); ctx.strokeStyle = '#7a5a40'; ctx.lineWidth = .03; ctx.beginPath(); ctx.moveTo(px + .5, py + .35); ctx.lineTo(px + .5, py + .65); ctx.moveTo(px + .4, py + .45); ctx.lineTo(px + .6, py + .45); ctx.stroke(); }
  // villaggio
  housePos(S).forEach(h => drawHouse(h[0], h[1]));
  drawChurch(S);
  // fumo
  smoke.forEach(p => { ctx.fillStyle = `rgba(120,108,110,${.35 * (1 - p.t / 2.6)})`; ctx.beginPath(); ctx.arc(p.x, p.y, .04 + p.t * .03, 0, 6.283); ctx.fill(); });
  drawCastle(S, time);
  // guardie
  for (let i = 0; i < S.guardie; i++) { const a = time * .45 + i * 6.283 / Math.max(1, S.guardie); person(CC[0] + Math.cos(a) * .72, CC[1] + .08 + Math.sin(a) * .5, INK, 1.2, '#ffffff'); }
  // contadini
  vill.forEach(v => person(v.x, v.y, '#6c5f63', 1.15));
  ents.slice().sort((a, b) => a.y - b.y).forEach(e => drawEnt(e, time));
  // fiamme
  fires.forEach(f => { if (f.t < 0) return; const k = 1 - f.t / f.dur, fl = .7 + .3 * Math.sin(time * 18 + f.x * 9), h = .22 * fl * Math.min(1, k * 2 + .2); ctx.fillStyle = `rgba(200,16,46,${.9 * Math.min(1, k * 2)})`; poly([[f.x - .06, f.y], [f.x, f.y - h], [f.x + .06, f.y]], ctx.fillStyle); ctx.fillStyle = `rgba(255,170,60,${.9 * Math.min(1, k * 2)})`; poly([[f.x - .03, f.y], [f.x, f.y - h * .6], [f.x + .03, f.y]], ctx.fillStyle); });
  sparks.forEach(p => { ctx.fillStyle = `rgba(200,16,46,${1 - p.t / p.life})`; ctx.fillRect(p.x, p.y, .03, .03); });
  // etichette luoghi
  ptext('verso Pavia', 6.0, .2, Math.max(9, T * .17), 'rgba(28,20,22,.55)', { weight: 700 });
  ptext('verso Mediolanum', 1.3, 5.82, Math.max(9, T * .17), 'rgba(28,20,22,.55)', { weight: 700 });
  // stagione
  const aut = (S.turn || 0) % 2 === 1;
  ctx.fillStyle = aut ? 'rgba(230,140,40,.09)' : 'rgba(120,170,90,.07)'; ctx.fillRect(0, 0, GW, GH);
  if (st && st.tut && st.phase === 'tut' && st.tutStep === 0) [['La villa', 3.5, 2.75], ['Il villaggio', 1.5, 3.15], ['I campi', 3.0, 4.55], ['Strada per Pavia', 5.1, 1.55]].forEach(l => ptext(l[0], l[1], l[2], Math.max(11, Math.min(15, T * .24)), '#fff', { bg: RED, weight: 800 }));
  drawTargets(time);
  floats.forEach(f => { if (f.t < 0) return; const a = Math.max(0, 1 - f.t / 2.2); ptext(f.text, f.x, f.y - f.t * .22, Math.max(12, Math.min(16, T * .26)), f.color, { bg: '#fff', alpha: a, border: f.color }); });
}
let lastTs = 0;
function frame(ts) {
  const dt = Math.min(.05, (ts - lastTs) / 1000 || 0); lastTs = ts;
  Object.keys(appear).forEach(k => { if (appear[k] < 1) appear[k] += dt * 2.2; });
  update(dt); draw(ts / 1000); requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

cv.addEventListener('click', e => {
  if (!st || st.phase !== 'map' || st.ap <= 0) return;
  const r = cv.getBoundingClientRect(), x = Math.floor((e.clientX - r.left) / r.width * GW), y = Math.floor((e.clientY - r.top) / r.height * GH);
  const hit = ORDERS(st).find(o => { const t = tileFor(o.id); return t && t[0] === x && t[1] === y; });
  if (hit) { togglePick(hit.id); }
});
