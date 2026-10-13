/* ===================== MOTORE (senza DOM) ===================== */
/* Richiede config.js e contenuti.js caricati prima (in index.html l'ordine è già giusto). Le regole di questa storia (ordini, crisi, finali) sono ancora qui dentro: vedi README. */


const clamp = v => Math.max(0, Math.min(100, v));
const O = (text, d = {}, anim = null, why = null) => ({ text, d, anim, why });
const R = (from, n, out, burn = [], type = 'bandit') => ({ k: 'raid', from, n, out, burn, type });
const rid = () => Math.random().toString(36).slice(2, 8);
const NEED = (st, k, n) => `${LABEL[k]} ${st[k]}, ne servivano ${n}.`;

function newState(name) {
  return { name: name || 'Aurelio', turn: 0, phase: 'chapter', view: null, c: 55, s: 30, p: 50, r: null,
    fort: 0, terre: 0, vass: 0, chiesa: 0, guardie: 0, crisi: 0, ap: 2, quizPts: 0, quizDone: [], log: [], orders: [], run: rid(), last: null,
    dmg: 0, scout: false, hint: false, undos: 0, tut: false, tutStep: 0, recap: null };
}
function snap(st) { return { c: st.c, s: st.s, p: st.p, r: st.r, fort: st.fort, terre: st.terre, vass: st.vass, chiesa: st.chiesa, guardie: st.guardie }; }
function diffChips(a, b) {
  const out = [];
  for (const k of ['c', 's', 'p', 'r']) { if (a[k] === null || b[k] === null) continue; const v = b[k] - a[k]; if (v) out.push({ k, v }); }
  for (const k of ['fort', 'terre', 'vass', 'chiesa', 'guardie']) { const v = b[k] - a[k]; if (v) out.push({ k, v }); }
  return out;
}
function applyD(st, d) {
  for (const k of ['c', 's', 'p']) if (d[k]) st[k] = clamp(st[k] + d[k]);
  if (d.r && st.r !== null) st.r = clamp(st.r + d.r);
  if (d.fort) st.fort = Math.min(3, st.fort + d.fort);
  if (d.fortMin) st.fort = Math.max(st.fort, d.fortMin);
  if (d.terre) st.terre = Math.min(4, st.terre + d.terre);
  if (d.vass) st.vass = Math.max(0, Math.min(3, st.vass + d.vass));
  if (d.chiesa) st.chiesa = Math.min(2, st.chiesa + d.chiesa);
  if (d.guardie) st.guardie = Math.max(0, Math.min(6, st.guardie + d.guardie));
  if (d.scout) st.scout = true;
  if (d.hint) st.hint = true;
  if (d.fixDmg) st.dmg = 0;
}
function checkCrisis(st) {
  const out = [];
  if (st.c <= 0) { st.crisi++; st.c = 28; st.p = clamp(st.p - 12); out.push(`Carestia! Il granaio è vuoto. Alcune famiglie fuggono e le altre soffrono la fame.`); }
  if (st.s <= 0) { st.crisi++; st.s = 32; st.c = clamp(st.c - 15); st.p = clamp(st.p - 8); out.push(`Il tuo feudo viene saccheggiato. Chi aveva le armi ha preso quello che voleva.`); }
  if (st.p <= 0) { st.crisi++; st.p = 32; st.c = clamp(st.c - 10); st.s = clamp(st.s - 5); out.push(`I contadini abbandonano i campi. Senza di loro non c'è raccolto né difesa.`); }
  if (st.r !== null && st.r <= 0) { st.crisi++; st.r = 32; st.s = clamp(st.s - 10); out.push(`Il re ti toglie la sua fiducia e ti manda un avvertimento armato.`); }
  return out;
}
function beginTurn(st) { if (st.turn === 6 && st.r === null) st.r = 40; st.ap = 2; st.orders = []; }

/* ---------- evento di prova (tutorial) ---------- */
const TUT_NEXT = { kind: 'Richiesta', stakes: ['c'], warn: `Si dice che un mercante stia arrivando al villaggio con merci da vendere.` };
const TUT_EVENT = { title: 'Un viandante', kind: 'Richiesta', stakes: ['c', 'p'],
  text: [`Un viandante stanco bussa alla tua porta. Chiede da mangiare e un posto dove dormire. È solo una prova: qualunque cosa tu scelga, poi si ricomincia da capo.`],
  choices: [
    { tag: 'Aiuto', label: 'Dargli da mangiare e un letto', run: () => O(`Il viandante ti ringrazia. Al villaggio si sparge la voce che sei generoso.`, { c: -4, p: 5 }, { k: 'arrive', n: 1 }) },
    { tag: 'Scambio', label: 'Dargli cibo se aiuta nei campi', run: () => O(`Lavora un giorno e riparte con una pagnotta. Un patto semplice: aiuto in cambio di lavoro.`, { c: -2, p: 2 }, { k: 'arrive', n: 1 }) },
    { tag: 'Rifiuto', label: 'Mandarlo via', run: () => O(`Il viandante se ne va. Il granaio è salvo, ma il villaggio mormora.`, { c: 2, p: -3 }) } ] };

/* ---------- ordini (cambiano in base a quello che succede) ---------- */
function nextEv(st) { if (st.tut) return TUT_NEXT; return st.turn + 1 < TURNS ? EVENTS[st.turn + 1](st) : null; }
function ORDERS(st) {
  const T = st.turn, nx = nextEv(st), L = [];
  const threat = !!(nx && nx.kind === 'Minaccia'), hits = k => !!(nx && nx.stakes && nx.stakes.includes(k));
  const fN = ['Palizzata di legno', 'Torre e fossato', 'Castello di pietra'];
  const fD = [`Pali di legno intorno alla villa. Tiene lontane le bande.`, `Una torre alta e un fossato pieno d'acqua.`, `Mura, torri e un mastio. Il castello vero e proprio.`];
  const fC = [8, 11, 14], fS = [10, 12, 14], fi = Math.min(st.fort, 2);
  L.push({ id: 'fort', cat: 'Costruire', label: 'Fortifica', title: fN[fi], desc: fD[fi], d: { c: -fC[fi], p: -3, s: fS[fi], fort: 1 }, ok: st.fort < 3,
    why: threat && hits('fort') && st.fort < 3 ? `La prossima minaccia mette alla prova le Difese.` : null });
  L.push({ id: 'terre', cat: 'Costruire', label: 'Nuovo campo', title: 'Dissodare un campo', desc: `Più campi, più grano a ogni raccolto.`, d: { p: -3, c: -3, terre: 1 }, ok: st.terre < 4, why: null });
  L.push({ id: 'vass', cat: 'Costruire', label: 'Vassallo', title: 'Affidare un villaggio a un fedele', desc: `Gli dai terra e poteri, lui ti giura fedeltà e ti difende. Governi meno da vicino.`, d: { vass: 1, s: 8, c: -5 }, ok: st.r !== null && T >= 7 && st.vass < 3, why: null });
  L.push({ id: 'chiesa', cat: 'Costruire', label: st.chiesa ? 'Campanile' : 'Pieve', title: st.chiesa === 0 ? 'Fondare una pieve' : 'Ingrandire il monastero', desc: `Preti e monaci curano, insegnano e copiano libri.`, d: { chiesa: 1, p: 6, c: -6 }, ok: T >= 8 && st.chiesa < 2, why: null });
  L.push({ id: 'drill', cat: 'Difendere', label: 'Addestra', title: `Addestrare uomini d'arme`, desc: `Giovani armati rendono più sicura la zona.`, d: { s: 10, c: -5, guardie: 1 }, ok: true,
    why: threat && hits('s') && st.s < 60 ? `La prossima minaccia mette alla prova la Sicurezza.` : null });
  L.push({ id: 'esplora', cat: 'Difendere', label: null, title: 'Mandare degli esploratori', desc: `Due uomini controllano strade e boschi. Scopri quanto è forte la minaccia in arrivo.`, d: { s: 2, c: -2, scout: 1 }, extra: 'Scopri la minaccia',
    ok: !st.tut && threat && !!nx.scout && !st.scout, why: `Sta per arrivare una minaccia: puoi scoprire cosa ti aspetta.` });
  L.push({ id: 'help', cat: 'Governare', label: 'Aiuta', title: 'Aiutare i contadini', desc: `Grano ai poveri, giustizia, una festa. La gente ti è più fedele.`, d: { p: 10, c: -6 }, ok: true,
    why: st.tut ? `Solo un esempio: qui compaiono gli ordini che rispondono a ciò che sta succedendo.` : (st.p < 35 ? `I contadini sono scontenti.` : null) });
  L.push({ id: 'giustizia', cat: 'Governare', label: null, title: 'Tenere il tribunale', desc: `Giudichi una lite tra famiglie in nome del re. Si vede che c'è ancora una legge.`, d: { p: 5, r: 3, c: -3 }, ok: st.r !== null,
    why: st.p < 40 ? `La gente chiede giustizia.` : null });
  L.push({ id: 'scuola', cat: 'Governare', label: null, title: 'Studiare con i monaci', desc: `I monaci copiano e leggono libri. Ti aiutano a ripassare la lezione.`, d: { p: 2, c: -3, hint: 1 }, extra: 'Aiuto per la domanda', ok: st.chiesa >= 1 && !st.hint,
    why: T % 2 === 1 ? `Tra poco c'è la domanda del capitolo.` : null });
  L.push({ id: 'ricostruisci', cat: 'Governare', label: null, title: 'Ricostruire il villaggio', desc: `Case, stalle e recinti danneggiati tornano in piedi.`, d: { p: 8, c: -5, s: 3, fixDmg: 1 }, extra: 'Cancella i danni', ok: st.dmg > 0,
    why: `Il saccheggio ha lasciato rovine.` });
  if (st.r === null) L.push({ id: 'ally', cat: 'Rapporti', label: 'Alleanza', title: 'Accordo con un vicino', desc: `Vi scambiate promesse di aiuto.`, d: { s: 6, c: -3 }, ok: true, why: null });
  else L.push({ id: 'king', cat: 'Rapporti', label: 'Doni al re', title: 'Mandare doni al re', desc: `Un messo porta grano e regali. Il re si ricorda di te.`, d: { r: 12, c: -5 }, ok: true,
    why: st.r < 35 ? `Il re si sta dimenticando di te.` : (hits('r') && st.r < 55 ? `Il prossimo evento conta il Favore del re.` : null) });
  L.push({ id: 'razione', cat: 'Scorte', label: null, title: 'Razionare il grano', desc: `Porzioni più piccole per tutti: il granaio dura di più.`, d: { c: 9, p: -5 }, ok: st.c < 50,
    why: st.c < 35 ? `Il granaio è quasi vuoto.` : null });
  L.push({ id: 'riscuoti', cat: 'Scorte', label: null, title: 'Riscuotere dai fedeli', desc: `Chiedi ai tuoi fedeli la loro parte di grano.`, d: { c: 8, p: -4 }, ok: st.vass >= 1,
    why: st.c < 40 ? `Il granaio è basso e i tuoi fedeli hanno grano.` : null });
  L.push({ id: 'rest', cat: 'Scorte', label: null, title: 'Risparmiare', desc: `Non costruisci niente e controlli le scorte.`, d: { c: 3 }, ok: true, why: null });
  return L.filter(o => o.ok);
}
function advice(st) {
  if (st.c < 25) return `Il tuo fattore avvisa: il granaio è quasi vuoto.`;
  if (st.s < 25) return `Il capo delle guardie dice che la difesa è debolissima.`;
  if (st.p < 25) return `I contadini mormorano. Se continua, se ne vanno.`;
  if (st.r !== null && st.r < 25) return `Il re non ha tue notizie da troppo tempo.`;
  return null;
}
function tick(st) {
  const lines = [], aut = st.turn % 2 === 1;
  let dc = aut ? 16 + 5 * st.terre - 10 : -5;
  lines.push(aut ? `Raccolto: +${16 + 5 * st.terre} al granaio${st.terre ? ' (i campi nuovi aiutano)' : ''}, poi l'inverno ne consuma 10.` : `Si semina e le scorte calano (−5 al granaio).`);
  if (st.vass) { dc -= 2 * st.vass; lines.push(`I tuoi fedeli trattengono una parte del raccolto (−${2 * st.vass}).`); }
  st.c = clamp(st.c + dc);
  const decay = 4 - st.fort;
  lines.push(st.fort === 0 ? `Senza difese la sicurezza cala da sola (−${decay}).` : `Le difese reggono, ma la sicurezza cala un po' col tempo (−${decay}).`);
  if (st.vass) lines.push(`I tuoi fedeli fanno la guardia (+${2 * st.vass}).`);
  st.s = clamp(st.s - decay + 2 * st.vass);
  let dp = 0;
  if (st.c < 25) { dp -= 4; lines.push(`Fame: i contadini sono preoccupati (−4).`); }
  if (st.s < 30) { dp -= 4; lines.push(`Paura: nessuno si sente al sicuro (−4).`); }
  if (st.c >= 55 && st.s >= 50) { dp += 2; lines.push(`Si sta bene: la gente è più serena (+2).`); }
  st.p = clamp(st.p + dp);
  if (st.r !== null) { st.r = clamp(st.r - 3); lines.push(`Il re è lontano e si dimentica di te (−3).`); }
  return lines;
}

const eventFor = st => st.tut ? TUT_EVENT : EVENTS[st.turn](st);

/* risolve la scelta di un evento: aggiorna lo stato e prepara la schermata del risultato */
function doChoice(st, i) {
  const ev = eventFor(st), ch = ev.choices[i], before = snap(st), res = ch.run(st);
  applyD(st, res.d); const crisis = checkCrisis(st);
  if ((res.anim && res.anim.k === 'raid' && (res.anim.out === 'bad' || res.anim.out === 'part')) || crisis.length) st.dmg = 1;
  st.scout = false;
  st.pending = { ev: ev.title, choice: ch.label };
  const chips = diffChips(before, snap(st));
  st.view = { label: ch.label, tag: ch.tag || '', text: res.text, why: res.why || null, chips, crisis, ev: ev.title };
  st.recap = { ev: ev.title, choice: ch.label, chips };
  st.phase = 'result';
  return res;
}

/* ---------- PUNTEGGIO ---------- */
function feudoScore(st) {
  const r = st.r === null ? (st.c + st.s + st.p) / 3 : st.r;
  const stats = st.c + st.s + st.p + r;
  const struct = st.fort * 50 + st.terre * 10 + st.vass * 20 + st.chiesa * 25;
  return Math.max(0, Math.min(700, Math.round(stats + struct - 50 * st.crisi - 10 * (st.undos || 0))));
}
const totalScore = st => feudoScore(st) + st.quizPts;
function ending(st) {
  if (st.crisi >= 3) return { i: 0, title: 'Un feudo in rovina', text: `Troppe volte hai perso il controllo: carestie, saccheggi o rivolte. Senza un potere che tenga insieme le cose, ognuno pensa solo a sé. È ciò che temevano gli uomini del 476.` };
  const castle = st.fort === 3 && st.s >= 70 ? st.s : 0;
  const vassal = st.vass >= 2 && st.r >= 60 ? st.r + 20 * st.vass : 0;
  const loved = st.p >= 65 && st.chiesa >= 1 ? st.p + 10 * st.chiesa : 0;
  const best = Math.max(castle, vassal, loved);
  if (best === 0) return { i: 1, title: 'Il signore che sopravvive', text: `Hai tenuto in vita il feudo in un'epoca difficile, senza eccellere in niente. Per molte famiglie, allora, bastava già questo.` };
  if (best === castle) return { i: 2, title: 'Il signore del castello', text: `Il tuo castello è il centro del mondo di chi vive intorno. Sei forte e rispettato, ma la tua forza viene dalla paura e dalle armi. Il tuo potere è legato a un luogo e a una famiglia, non a uno Stato.` };
  if (best === vassal) return { i: 3, title: 'Il vassallo di rango', text: `Hai costruito una rete di fedeltà: al re da una parte, ai tuoi vassalli dall'altra. Il tuo potere dipende da legami personali, non da una legge scritta. Se un legame si spezza, la catena si indebolisce.` };
  return { i: 4, title: 'Il signore amato', text: `La gente di qui si fida di te. Hai usato il potere per tenere insieme una comunità, aiutando i contadini e sostenendo la Chiesa. Nel mondo feudale era un modo di governare, ma non l'unico.` };
}
const ENDINGS = ['Un feudo in rovina', 'Il signore che sopravvive', 'Il signore del castello', 'Il vassallo di rango', 'Il signore amato'];

/* ---------- CODICE DEL PUNTEGGIO (link per il docente) ---------- */
function fnv(s) { let h = 0x811c9dc5; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; } return h.toString(36); }
function b64u(str) { const b = new TextEncoder().encode(str); let s = ''; b.forEach(x => s += String.fromCharCode(x)); return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); }
function unb64u(t) { t = t.replace(/-/g, '+').replace(/_/g, '/'); while (t.length % 4) t += '='; const s = atob(t), a = new Uint8Array(s.length); for (let i = 0; i < s.length; i++) a[i] = s.charCodeAt(i); return new TextDecoder().decode(a); }
function makeToken(st) {
  const name = st.name.slice(0, 20), f = feudoScore(st), q = st.quizPts, c = st.crisi, e = ending(st).i;
  const chk = fnv([name, f, q, c, e, st.run, SALT].join('|'));
  return ['p1', b64u(name), f, q, c, e, st.run, chk].join('.');
}
const TOKEN_RE = /p1\.[A-Za-z0-9_-]+\.\d+\.\d+\.\d+\.\d+\.[a-z0-9]+\.[a-z0-9]+/g;
function parseToken(tok) {
  const p = tok.split('.'); if (p.length !== 8 || p[0] !== 'p1') return null;
  let name; try { name = unb64u(p[1]); } catch (e) { return null; }
  const f = +p[2], q = +p[3], c = +p[4], e = +p[5], run = p[6];
  if (!(f >= 0 && f <= 700 && q >= 0 && q <= 400 && q % 50 === 0 && c >= 0 && c < 30 && e >= 0 && e <= 4)) return null;
  if (fnv([name, f, q, c, e, run, SALT].join('|')) !== p[7]) return null;
  return { id: run + p[7], name, feudo: f, quiz: q, crisi: c, e, total: f + q };
}
const rankRows = rows => rows.slice().sort((a, b) => b.total - a.total || a.crisi - b.crisi || b.quiz - a.quiz || (a.at || 0) - (b.at || 0));
if (typeof module !== 'undefined') module.exports = { newState, EVENTS, ORDERS, tick, applyD, checkCrisis, beginTurn, eventFor, doChoice, nextEv, feudoScore, totalScore, ending, makeToken, parseToken, TOKEN_RE, CH, rankRows, TURNS, TUT_EVENT };
