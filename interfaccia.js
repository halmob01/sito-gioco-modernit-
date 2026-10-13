/* ---------- HUD ---------- */
let lastHud = null;
function renderHud() {
  const S = st || { c: 55, s: 30, p: 50, r: null };
  const defs = [['c', 'Granaio'], ['s', 'Sicurezza'], ['p', 'Contadini'], ['r', 'Favore del re']];
  $('hud').innerHTML = defs.map(([k, n]) => {
    const v = S[k], off = v === null, prev = lastHud ? lastHud[k] : v;
    const cls = ['st', off ? 'off' : '', !off && v < 30 ? 'low' : '', !off && prev !== null && v > prev ? 'up' : '', !off && prev !== null && v < prev ? 'down' : ''].join(' ');
    return `<div class="${cls}"><div class="st-h"><span>${n}</span><b>${off ? '' : v}</b></div><div class="bar2"><i style="width:${off ? 0 : v}%"></i></div></div>`;
  }).join('');
  lastHud = { c: S.c, s: S.s, p: S.p, r: S.r };
  $('score').textContent = st && !st.tut ? totalScore(st) : 0;
}
function renderProgress() {
  let h = ''; const t = st ? st.turn : 0;
  for (let c = 0; c < 8; c++) { h += '<div>'; for (let i = 0; i < 2; i++) { const n = c * 2 + i; h += `<i class="${st && (n < t || (st.phase === 'end' && true)) ? 'done' : st && n === t ? 'now' : ''}"></i>`; } h += '</div>'; }
  $('progress').innerHTML = h;
}

/* ---------- pannelli ---------- */
const chipHTML = c => `<span class="chip ${c.v < 0 ? 'neg' : ''}">${c.v > 0 ? '+' : '−'}${Math.abs(c.v)} ${esc(LABEL[c.k])}</span>`;
const chipsHTML = l => l.length ? `<div class="chips">${l.map(chipHTML).join('')}</div>` : '';
const previewChips = d => ['c', 's', 'p', 'r', 'fort', 'terre', 'vass', 'chiesa', 'guardie'].filter(k => d[k]).map(k => ({ k, v: d[k] }));
const eyebrow = () => st.tut ? `Tutorial · prova` : `${CH[chapterOf(st.turn)].year} · Capitolo ${chapterOf(st.turn) + 1} · Turno ${st.turn + 1} di ${TURNS}`;
const coachHTML = (label, text) => `<div class="coach"><small>${esc(label)}</small><span>${esc(text)}</span></div>`;
const lowStat = (k, v) => (k === 'c' || k === 's' || k === 'p' || k === 'r') && v < 30;
function stakesHTML(label, stakes) {
  const keys = (stakes || []).filter(k => st[k] !== null && st[k] !== undefined);
  if (!keys.length) return '';
  return `<div class="stakes"><span class="lbl">${esc(label)}</span>${keys.map(k => `<span class="stake ${lowStat(k, st[k]) ? 'low' : ''}">${esc(LABEL[k])}<b>${st[k]}</b></span>`).join('')}</div>`;
}

function vIntro() {
  const cont = saved && saved.phase && saved.phase !== 'end' ? `<button class="btn ghost" data-act="continue">Continua (turno ${saved.turn + 1} di ${TURNS})</button>` : '';
  return `<div class="eyebrow">Gioco di classe · circa 45 minuti</div><h1>Governa il tuo feudo</h1>
    <div class="prose"><p>${esc(CH[0].intro)}</p></div>
    <div class="rules">
      <div><b>Un evento</b>Ogni capitolo succede qualcosa e scegli come rispondere.</div>
      <div><b>Due ordini</b>Poi tocchi la mappa per costruire e comandare.</div>
      <div><b>Punti</b>Conta com'è il tuo feudo e quante domande indovini.</div>
    </div>
    <div class="field"><label for="nome">Il tuo nome</label><input id="nome" maxlength="20" placeholder="Come ti chiami?" value="${esc((saved && saved.name) || '')}" autocomplete="off"></div>
    <div class="row"><button class="btn" data-act="start">Inizia</button>${cont}</div>
    <p class="muted">Prima c'è un prologo e poi un piccolo tutorial. Puoi saltarli.</p>`;
}
function vTut() {
  const s = st.tutStep, skip = `<button class="btn ghost" data-act="tut-skip">Salta il tutorial</button>`;
  if (s === 0) return `<div class="eyebrow">Tutorial · 1 di 3</div><h2>Questa è la tua mappa</h2>
    <div class="prose"><p>Al centro c'è la tua villa. A sinistra il villaggio, in basso i campi. In alto a destra la strada che porta a Pavia.</p>
    <p>Le persone si muovono davvero: guardale. Ogni cosa che decidi cambia la mappa.</p></div>
    <div class="row"><button class="btn" data-act="tut-next">Avanti</button>${skip}</div>`;
  if (s === 1) return `<div class="eyebrow">Tutorial · 2 di 3</div><h2>Le quattro misure</h2>
    <div class="prose"><p>Sotto la mappa vedi come sta il tuo feudo.</p></div>
    <div class="rules">
      <div><b>Granaio</b>Il cibo. Senza grano la gente ha fame.</div>
      <div><b>Sicurezza</b>Quanto sei protetto da bande e nemici.</div>
      <div><b>Contadini</b>Quanto la gente è contenta e resta con te.</div>
      <div><b>Favore del re</b>Compare più avanti, quando un re si accorge di te.</div>
    </div>
    <div class="prose"><p>Se una misura scende a zero scatta una crisi: perdi punti e la partita si complica.</p></div>
    <div class="row"><button class="btn" data-act="tut-next">Avanti</button>${skip}</div>`;
  if (s === 2) return `<div class="eyebrow">Tutorial · 3 di 3</div><h2>Come funziona un capitolo</h2>
    <ol class="steps">
      <li><b>Evento.</b> Succede qualcosa. Leggi cosa è in gioco e scegli come rispondere.</li>
      <li><b>Ordini.</b> Hai due ordini per costruire, difendere o governare. Alcuni ordini compaiono solo quando servono.</li>
      <li><b>Fine capitolo.</b> Raccolto e scorte cambiano le misure.</li>
    </ol>
    <div class="prose"><p>Alla fine di ogni capitolo c'è una domanda: vale 50 punti.</p>
    <p>Hai sbagliato? In alto c'è il pulsante «← Indietro». Annulla l'ultima mossa. Cambiare la risposta a un evento già deciso costa 10 punti.</p></div>
    <div class="row"><button class="btn" data-act="tut-next">Prova un capitolo</button>${skip}</div>`;
  return `<div class="eyebrow">Tutorial finito</div><h2>Sei pronto, ${esc(st.name)}</h2>
    <div class="prose"><p>Il capitolo di prova è stato cancellato: non conta.</p><p>Ora comincia la partita vera. Sono 8 capitoli, dal 476 d.C. al 900 circa. Leggi bene gli eventi: gli ordini che servono cambiano in base a quello che succede.</p></div>
    <button class="btn" data-act="tut-done">Inizia nel 476</button>`;
}
function vChapter() {
  const c = chapterOf(st.turn), ch = CH[c];
  return `<div class="eyebrow">Capitolo ${c + 1} di ${CH.length} · ${ch.year}</div><h2>${esc(ch.title)}</h2>
    <div class="prose"><p>${esc(ch.intro)}</p>${c === 0 ? `<p>Ti chiami ${esc(st.name)}. Ricorda: un evento, due ordini.</p>` : ''}</div>
    <button class="btn" data-act="go-event">Avanti</button>`;
}
function vEvent() {
  const ev = eventFor(st);
  const coach = st.tut ? coachHTML('Prova · l\'evento', `Questo è un evento di tipo «${ev.kind}». Sotto il testo vedi cosa è in gioco. Ogni risposta ha un'etichetta che dice che genere di scelta è. Sceglierne una: è solo una prova.`) : '';
  const scout = st.scout && ev.scout ? `<div class="note"><h3>Gli esploratori riferiscono</h3><p>${esc(ev.scout)}</p></div>` : '';
  return `${coach}<div class="eyebrow">${eyebrow()}</div><div class="badge ${esc(ev.kind)}">${esc(ev.kind)}</div><h2>${esc(ev.title)}</h2>
    <div class="prose">${ev.text.map(t => `<p>${esc(t)}</p>`).join('')}</div>${stakesHTML('In gioco', ev.stakes)}${scout}
    <h3 class="ask">Come rispondi?</h3>
    <div class="opts">${ev.choices.map((c, i) => `<button class="opt" data-act="choose" data-i="${i}"><span class="k">${i + 1}</span><span><small class="tag">${esc(c.tag || '')}</small>${esc(c.label)}</span></button>`).join('')}</div>`;
}
function vResult() {
  const v = st.view;
  const coach = st.tut ? coachHTML('Prova · la conseguenza', `Leggi cosa è successo e perché. In alto le misure sono cambiate. Poi vai agli ordini.`) : '';
  return `${coach}<div class="eyebrow">${eyebrow()} · ${esc(v.ev)}</div>
    <div class="you"><small>Hai scelto${v.tag ? ' · ' + esc(v.tag) : ''}</small><p class="quote">${esc(v.label)}</p></div>
    <div class="prose"><p>${esc(v.text)}</p></div>
    ${v.why ? `<div class="why"><b>Perché è andata così.</b> ${esc(v.why)}</div>` : ''}${chipsHTML(v.chips)}
    ${v.crisis.map(t => `<div class="crisis"><b>Crisi.</b> ${esc(t)}</div>`).join('')}<button class="btn" data-act="go-map">Dai i tuoi ordini</button>`;
}
const CAT_ORDER = ['Costruire', 'Difendere', 'Governare', 'Rapporti', 'Scorte'];
const ORDER_MSG = {
  esplora: `Gli esploratori sono partiti. Quando arriverà la minaccia, ti diranno com'è fatta.`,
  scuola: `I monaci ti hanno ripassato la lezione: alla prossima domanda ti tolgono una risposta sbagliata.`,
  ricostruisci: `Case e recinti sono di nuovo in piedi.`
};
function orderRow(o) {
  const chips = previewChips(o.d), extra = o.extra ? `<span class="chip">${esc(o.extra)}</span>` : '', on = ui.sel.includes(o.id);
  return `<button class="order ${on ? 'sel' : ''}" aria-pressed="${on}" data-act="select" data-id="${o.id}"><span class="o-t">${esc(o.title)}</span><span class="chips">${chips.map(chipHTML).join('')}${extra}</span></button>`;
}
function vMap() {
  const nx = nextEv(st), L = ORDERS(st);
  ui.sel = ui.sel.filter(id => L.some(o => o.id === id)).slice(0, st.ap);
  const picked = ui.sel.map(id => L.find(o => o.id === id));
  const pips = `<div class="ap">Ordini<i class="${st.ap < 1 ? 'used' : ''}"></i><i class="${st.ap < 2 ? 'used' : ''}"></i>${st.ap > 0 ? `<span class="muted">scelti ${picked.length} di ${st.ap}</span>` : ''}</div>`;
  let h = '';
  if (st.tut) h += coachHTML('Prova · gli ordini', `Scegli due ordini: tocca un punto lampeggiante sulla mappa o una voce della lista. Di ognuno vedi cosa costa e cosa ottieni. Poi conferma. Nella partita vera dovrai capire da solo quali ordini servono.`);
  h += `<div class="eyebrow">${eyebrow()}</div><h2>${st.ap > 0 ? 'Che ordini dai al tuo feudo?' : 'Ordini dati'}</h2>${pips}`;
  if (st.recap) h += `<div class="note"><h3>Cosa è successo</h3><p><b>${esc(st.recap.ev)}</b></p><p><span class="muted">Hai scelto:</span> <span>${esc(st.recap.choice)}</span></p>${chipsHTML(st.recap.chips)}</div>`;
  if (Array.isArray(st.last)) h += `<div class="note"><h3>Ordini dati</h3>${st.last.map(l => `<p><b>${esc(l.title)}</b></p>${chipsHTML(l.chips)}${l.msg ? `<p>${esc(l.msg)}</p>` : ''}`).join('')}</div>`;
  if (nx && nx.warn) h += `<div class="note red"><div class="badge ${esc(nx.kind)}">${esc(nx.kind)} in arrivo</div><h3>Voci dal villaggio</h3><p>${esc(nx.warn)}</p>${stakesHTML('Conterà', nx.stakes)}</div>`;
  const adv = advice(st); if (adv) h += `<div class="note red"><p><b>Attenzione.</b> ${esc(adv)}</p></div>`;
  if (st.ap > 0) {
    h += CAT_ORDER.map(c => [c, L.filter(o => o.cat === c)]).filter(g => g[1].length).map(([t, list]) => `<div class="grp"><h3 class="gh">${t}</h3><div class="orders">${list.map(orderRow).join('')}</div></div>`).join('');
    if (picked.length) {
      const tot = {}; picked.forEach(o => previewChips(o.d).forEach(c => { tot[c.k] = (tot[c.k] || 0) + c.v; }));
      const ch = Object.entries(tot).filter(([k, v]) => v).map(([k, v]) => ({ k, v })), cost = ch.filter(c => c.v < 0), gain = ch.filter(c => c.v > 0);
      const risk = st.c + (tot.c || 0) < 10;
      h += `<div class="sel-card"><h3>${picked.length === 1 ? 'Ordine scelto' : 'Ordini scelti'}</h3>${picked.map(o => `<p><b>${esc(o.title)}</b> <span>${esc(o.desc)}</span></p>`).join('')}
        <div class="cg"><div><small>Costa in tutto</small>${cost.length ? chipsHTML(cost) : '<span class="muted">niente</span>'}</div><div><small>Ottieni in tutto</small><div class="chips">${gain.map(chipHTML).join('')}${picked.filter(o => o.extra).map(o => `<span class="chip">${esc(o.extra)}</span>`).join('')}</div></div></div>
        ${risk ? `<p><b>Attenzione:</b> il granaio resterebbe quasi vuoto.</p>` : ''}
        <div class="row"><button class="btn" data-act="confirm">${picked.length === 1 ? 'Conferma ordine' : 'Conferma ordini'}</button><button class="btn ghost" data-act="cancel">Scegli di nuovo</button></div></div>`;
    }
  }
  const blocked = st.tut && st.orders.length === 0;
  h += `<button class="btn ${st.ap > 0 ? 'ghost' : ''}" data-act="end-turn" ${blocked ? 'disabled' : ''}>${st.ap > 0 ? 'Chiudi il capitolo senza altri ordini' : 'Chiudi il capitolo'}</button>`;
  return h;
}
function vTick() {
  const v = st.view;
  const coach = st.tut ? coachHTML('Prova · fine capitolo', `A fine capitolo arrivano raccolto, scorte e conseguenze. Qui sotto vedi perché le misure cambiano.`) : '';
  return `${coach}<div class="eyebrow">Fine capitolo · turno ${st.turn + 1}</div><h2>Com'è andata</h2>
    <ul class="lines">${v.lines.map(l => `<li>${esc(l)}</li>`).join('')}</ul>${chipsHTML(v.chips)}
    ${v.crisis.map(t => `<div class="crisis"><b>Crisi.</b> ${esc(t)}</div>`).join('')}<button class="btn" data-act="next">${st.tut ? 'Finisci il tutorial' : st.turn % 2 === 1 ? 'Domanda del capitolo' : 'Prossimo turno'}</button>`;
}
function vQuiz() {
  const q = CH[chapterOf(st.turn)].quiz;
  const hide = st.hint ? q.opts.findIndex((o, i) => i !== q.ok) : -1;
  return `<div class="eyebrow">Domanda · 50 punti</div><h2>${esc(q.q)}</h2>
    ${hide >= 0 ? `<div class="note"><p>I monaci ti hanno aiutato: ho tolto una risposta sbagliata.</p></div>` : ''}
    <div class="opts">${q.opts.map((o, i) => i === hide ? '' : `<button class="opt" data-act="answer" data-i="${i}"><span class="k">${'ABC'[i]}</span><span>${esc(o)}</span></button>`).join('')}</div>`;
}
function vQuizFb() {
  const c = chapterOf(st.turn), q = CH[c].quiz, v = st.view;
  return `<div class="eyebrow">${v.right ? 'Giusto! +50 punti' : 'Non proprio, 0 punti'}</div><h2>${esc(q.q)}</h2>
    <div class="opts">${q.opts.map((o, i) => `<div class="opt ${i === q.ok ? 'right' : i === v.pick ? 'wrong' : ''}"><span class="k">${'ABC'[i]}</span><span>${esc(o)}</span></div>`).join('')}</div>
    <div class="note"><h3>Dai tuoi appunti</h3><p>${esc(CH[c].note)}</p></div>
    <button class="btn" data-act="after-quiz">${st.turn >= TURNS - 1 ? 'Vedi il risultato' : 'Prossimo capitolo'}</button>`;
}
function boardHTML(limit) {
  const rows = ui.rows ? rankRows(ui.rows) : [];
  if (!rows.length) return `<p class="muted">Ancora nessun punteggio. Arrivano qui quando gli studenti finiscono la partita.</p>`;
  return `<div class="board">${rows.slice(0, limit || 200).map((r, i) => `<div class="brow ${i === 0 ? 'first' : ''}"><span class="pos">${i + 1}</span><div><b>${esc(r.name)}</b><small>Feudo ${r.feudo} · domande ${r.quiz} · crisi ${r.crisi} · ${esc(ENDINGS[r.e] || '')}</small></div><span class="pts">${r.total}</span></div>`).join('')}</div>`;
}
const RECAP_CHAIN = ['Non c\'è più lo Stato', 'Nessuno ti protegge', 'Nascono i castelli', 'Protezione in cambio di fedeltà e lavoro', 'Il potere passa ai signori locali'];
const RECAP = [
  ['Che cosa faceva lo Stato romano', 'Garantiva leggi, esercito, strade sicure, tasse, scuole e commercio. Tutta la vita girava intorno a lui.'],
  ['Quando lo Stato crolla', 'Spariscono polizia, esercito, scuole e manutenzione delle strade. Per chi vive allora è davvero «la fine del mondo».'],
  ['Perché nascono i castelli', 'La sicurezza diventa un problema immediato: senza pattuglie, ci si difende chiudendosi dentro le mura.'],
  ['La protezione in cambio di fedeltà', 'Il signore del castello protegge. Gli abitanti, in cambio, danno lavoro, tributi e fedeltà. È un legame personale, non una legge dello Stato: questo è il rapporto feudale.'],
  ['Il mondo cambia forma', 'Le città si spopolano e la gente va nelle campagne. Da un mondo di città, mare e commercio si passa a un mondo di campi, villaggi e castelli.'],
  ['Il potere passa ai signori locali', 'Il re è lontano e non può controllare tutto, quindi «appalta» il potere: conti, abati e vescovi governano in suo nome. Il potere non sparisce: si spezzetta.'],
  ['La Chiesa resta', 'Dopo il crollo è l\'unica struttura stabile: vescovi, parrocchie, monasteri. Aiuta la gente e conserva i testi antichi.']
];
function recapHTML() {
  return `<div class="recap"><h3>Cosa ti devi ricordare per la verifica?</h3>
    <p class="recap-lead">In una frase: quando crolla lo Stato la protezione non sparisce, ma passa a chi vive sul territorio, e il mondo si riordina in tanti piccoli poteri locali legati da fedeltà personali.</p>
    <div class="recap-chain"><h4>Il filo da ricordare</h4>${RECAP_CHAIN.map((t, i) => `<p>${i ? '↓ ' : ''}<b>${t}</b></p>`).join('')}</div>
    <ul>${RECAP.map(([a, b]) => `<li><b>${a}</b><span>${b}</span></li>`).join('')}</ul></div>`;
}
function vEnd() {
  const e = ending(st), f = feudoScore(st), tok = makeToken(st), link = (SELF_URL ? SELF_URL + '#' : '') + tok;
  const sent = ui.sent === true ? `<div class="note"><h3>Punteggio inviato</h3><p>Il tuo punteggio è già nella classifica del docente.</p></div>`
    : ui.sent === 'wait' ? `<div class="note"><h3>Sto inviando il tuo punteggio…</h3><p>Resta su questa pagina ancora un attimo.</p></div>`
    : `<div class="note red"><h3>Manda questo link al docente</h3><p>Dentro ci sono il tuo nome e il tuo punteggio. Copialo e invialo.</p><div class="linkbox" id="linkbox">${esc(link)}</div><div class="row"><button class="btn" data-act="copy" data-t="linkbox">Copia il link</button></div><p class="muted" id="copied" aria-live="polite"></p></div>`;
  const chain = [['Re o imperatore', 'lontano'], [`Tu, ${st.name}`, ['villa aperta', 'palizzata', 'torre e fossato', 'castello di pietra'][st.fort]], ['I tuoi fedeli', st.vass || 'nessuno'], ['Contadini', st.p]];
  return `<div class="eyebrow">Fine della partita · circa 900 d.C.</div><h2>${esc(e.title)}</h2>
    <div class="big">${totalScore(st)}</div>
    <div class="split"><div><small>Il tuo feudo</small><b>${f}</b></div><div><small>Domande</small><b>${st.quizPts}</b></div></div>
    <div class="prose"><p>${esc(e.text)}</p></div>
    ${sent}${st.undos ? `<p class="muted">Hai usato «Cambia scelta» ${st.undos} ${st.undos === 1 ? 'volta' : 'volte'}: −${st.undos * 10} punti.</p>` : ''}
    <div class="note"><h3>La catena del potere nel tuo feudo</h3>${chain.map(([a, b], i) => `<p>${i ? '↓ ' : ''}<b>${esc(a)}</b>: <span>${esc(b)}</span></p>`).join('')}</div>
    ${ui.db && ui.rows && ui.rows.length ? `<h3>Classifica della classe</h3>${boardHTML(5)}` : ''}
    ${recapHTML()}
    <div class="row"><button class="btn ghost" data-act="restart">Gioca di nuovo</button></div>`;
}
function vBoard() {
  if (!ui.unlocked) return `<div class="eyebrow">Pannello docente</div><h2>Area riservata</h2><p class="muted">Inserisci la password per aprire la classifica e i comandi del docente.</p>
    <div class="field"><label for="pw">Password</label><input id="pw" type="password" autocomplete="off"></div>${ui.pwErr ? '<p><b>Password errata.</b></p>' : ''}
    <div class="row"><button class="btn" data-act="unlock">Apri</button><button class="btn ghost" data-act="close-board">Torna al gioco</button></div>`;
  const rows = ui.rows || [];
  let h = `<div class="eyebrow">Pannello docente</div><h2>Classifica della classe</h2>`;
  if (!ui.db) h += `<p class="muted">La classifica condivisa non è disponibile in questa vista.</p>`;
  else h += `<p class="muted">${rows.length} ${rows.length === 1 ? 'punteggio' : 'punteggi'} · si aggiorna da solo.</p>${boardHTML()}`;
  if (SHEET_URL) h += `<p><a class="btn ghost" href="${SHEET_VIEW}" target="_blank" rel="noopener">Apri il Foglio Google</a></p>`;
  if (ui.db) {
    h += `<h3>Aggiungi punteggi</h3><p class="muted">Incolla qui i link o i codici ricevuti dagli studenti, anche più di uno insieme.</p>
      <textarea id="paste" placeholder="Incolla qui"></textarea>${ui.boardMsg ? `<p><b>${esc(ui.boardMsg)}</b></p>` : ''}
      <div class="row"><button class="btn" data-act="add-tokens">Aggiungi</button><button class="btn ghost" data-act="winner" ${rows.length ? '' : 'disabled'}>Proclama il vincitore</button><button class="btn ghost" data-act="clear">${ui.clearArm ? 'Conferma: azzera tutto' : 'Azzera la classifica'}</button></div>`;
  }
  h += `<button class="btn ghost" data-act="close-board">Torna al gioco</button>`;
  return h;
}

/* ---------- lingua: applica la traduzione ai testi della pagina ---------- */
function translateDOM(root) {
  const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), nodes = [];
  while (w.nextNode()) nodes.push(w.currentNode);
  nodes.forEach(n => {
    if (n.parentNode && n.parentNode.closest && n.parentNode.closest('[data-notr]')) return;
    if (n.__it === undefined) n.__it = n.nodeValue;
    const src = n.__it, m = src.match(/^(\s*)([\s\S]*?)(\s*)$/);
    if (!m[2]) return;
    n.nodeValue = LANG === 'ar' ? m[1] + tr(m[2]) + m[3] : src;
  });
  root.querySelectorAll('[placeholder]').forEach(e => { if (e.__ph === undefined) e.__ph = e.getAttribute('placeholder'); e.setAttribute('placeholder', LANG === 'ar' ? tr(e.__ph) : e.__ph); });
}
function applyLang() {
  const app = $('app'); app.lang = LANG; app.dir = LANG === 'ar' ? 'rtl' : 'ltr';
  $('btnLang').textContent = LANG === 'ar' ? 'Italiano' : 'العربية';
  translateDOM(app);
}
function toggleLang() { LANG = LANG === 'ar' ? 'it' : 'ar'; try { localStorage.setItem(LANG_KEY, LANG); } catch (e) {} render(); if (typeof proOpen !== 'undefined' && proOpen) proRender(); }
let lastPhase = null;
function render() {
  if (st && st.phase !== lastPhase && window.innerWidth <= 832 && !ui.board) window.scrollTo(0, 0);
  lastPhase = st ? st.phase : null;
  $('btnBoard').hidden = false;
  $('btnBoard').textContent = 'Docente';
  const c = chapterOf(st ? st.turn : 0);
  $('chTag').textContent = st ? (st.tut ? 'Tutorial' : `Capitolo ${c + 1}/${CH.length}`) : 'Un feudo dopo Roma';
  $('turnTag').textContent = st ? (st.tut ? 'Prova' : st.phase === 'end' ? 'Fine' : `Turno ${st.turn + 1}/${TURNS}`) : '476 d.C.';
  $('subtitle').textContent = st ? (st.tut ? 'Tutorial · come si gioca' : `${CH[c].year} · ${CH[c].title}`) : '476 d.C. · La fine del mondo';
  const hl = st && st.tut && st.phase === 'tut' ? ['map', 'hud', 'back'][st.tutStep] : null;
  $('mapwrap').classList.toggle('hl', hl === 'map'); $('hud').classList.toggle('hl', hl === 'hud'); $('btnBack').classList.toggle('hl', hl === 'back');
  $('btnBack').disabled = !canBack();
  $('btnBack').textContent = st && st.phase === 'result' && !st.tut ? '← Cambia scelta (−10)' : '← Indietro';
  renderHud(); renderProgress();
  const V = { tut: vTut, chapter: vChapter, event: vEvent, result: vResult, map: vMap, tick: vTick, quiz: vQuiz, quizfb: vQuizFb, end: vEnd };
  const p = $('panel'); const html = ui.board ? vBoard() : (st ? V[st.phase]() : vIntro());
  const keep = !st && !ui.board && $('nome') ? $('nome').value : null;
  p.style.animation = 'none'; p.offsetHeight; p.style.animation = '';
  p.innerHTML = html;
  if (keep !== null && $('nome')) $('nome').value = keep;
  applyLang();
  save();
}

/* ---------- azioni ---------- */
function clearFx() { ents.length = 0; fires.length = 0; floats.length = 0; timers.length = 0; sparks.length = 0; smoke.length = 0; }
function pushHist() { if (!st) return; hist.push(JSON.stringify(st)); if (hist.length > 40) hist.shift(); }
const canBack = () => !!(st && hist.length && !ui.board && st.phase !== 'end' && st.phase !== 'quizfb');
function back() {
  if (!canBack()) return;
  const cur = st, prev = JSON.parse(hist.pop());
  prev.undos = (cur.undos || 0) + (cur.phase === 'result' && !cur.tut ? 1 : 0);
  st = prev; ui.sel = []; clearFx(); render();
  if (st.phase === 'event') enterAnim();
}
function start() {
  const name = ($('nome') && $('nome').value.trim()) || 'Studente';
  st = newState(name); st.tut = true; st.phase = 'tut'; st.tutStep = 0;
  ui.sel = []; ui.sent = null; hist.length = 0; clearFx(); wipe(); render();
  openPrologue();
}
function beginGame() {
  const name = st.name; st = newState(name); ui.sel = []; ui.sent = null; hist.length = 0; clearFx(); wipe(); render();
}
function tutNext() {
  pushHist(); st.tutStep++;
  if (st.tutStep >= 3) { st.phase = 'event'; beginTurn(st); }
  render();
}
function choose(i) {
  pushHist();
  const res = doChoice(st, i);
  render(); playAnim(res.anim);
}
function confirmOrder() {
  const L = ORDERS(st), list = ui.sel.map(id => L.find(x => x.id === id)).filter(Boolean).slice(0, st.ap);
  if (!list.length) return;
  pushHist();
  const logs = [];
  list.forEach((o, n) => {
    const before = snap(st); applyD(st, o.d);
    const chips = diffChips(before, snap(st)), t = tileFor(o.id) || FX_TILE[o.id] || [3, 3];
    const px = t[0] + .5, py = t[1] + .35, dl = n * .8;
    if (o.id === 'terre') appear['f' + (st.terre - 1)] = 0;
    if (o.id === 'esplora') playAnim({ k: 'messenger' });
    if (o.id === 'ricostruisci') fires.length = 0;
    chips.forEach((c, i) => say(`${c.v > 0 ? '+' : '−'}${Math.abs(c.v)} ${LABEL[c.k]}`, px, py, c.v > 0 ? '#1c1416' : '#c8102e', dl + i * .35));
    later(dl, () => burst(px, py + .2, 12));
    if (o.id === 'king' || o.id === 'ally') playAnim({ k: 'messenger' });
    st.orders.push(o.title); st.ap--; logs.push({ title: o.title, chips, msg: ORDER_MSG[o.id] || '' });
  });
  st.last = logs; ui.sel = []; render();
}
function endTurn() {
  pushHist();
  const before = snap(st), lines = tick(st), crisis = checkCrisis(st);
  st.log.push({ t: st.turn, ev: st.pending ? st.pending.ev : '', choice: st.pending ? st.pending.choice : '', orders: st.orders.slice() });
  const aut = st.turn % 2 === 1;
  if (aut) { FIELDS_BASE.concat(FIELD_SLOTS.slice(0, st.terre)).forEach(f => say('+', f[0] + .5, f[1] + .4, '#1c1416', Math.random() * .6)); }
  st.view = { lines, chips: diffChips(before, snap(st)), crisis }; st.phase = 'tick'; st.last = null; st.recap = null; ui.sel = []; render();
}
function nextStep() {
  pushHist();
  if (st.tut) { st.phase = 'tut'; st.tutStep = 3; render(); return; }
  if (st.turn % 2 === 1) { st.phase = 'quiz'; render(); return; }
  st.turn++; beginTurn(st); st.phase = 'event'; render(); enterAnim();
}
function enterAnim() { const ev = eventFor(st); if (ev.enter) playAnim(ev.enter); }
function answer(i) {
  const q = CH[chapterOf(st.turn)].quiz, right = i === q.ok;
  if (right) st.quizPts += 50;
  st.hint = false; hist.length = 0;
  st.view = { pick: i, right }; st.phase = 'quizfb'; render();
}
function afterQuiz() {
  hist.length = 0;
  if (st.turn >= TURNS - 1) { st.phase = 'end'; wipe(); finish(); render(); return; }
  st.turn++; beginTurn(st); st.phase = 'chapter'; render();
}
async function finish() {
  ui.sent = ui.db ? 'wait' : null;
  if (!ui.db) return;
  const tok = parseToken(makeToken(st)); if (!tok) { ui.sent = null; return; }
  try { await ui.db.collection('scores').doc(tok.id).set({ name: tok.name, feudo: tok.feudo, quiz: tok.quiz, total: tok.total, crisi: tok.crisi, e: tok.e, at: Date.now() }); ui.sent = true; if (st && st.phase === 'end') render(); } catch (e) { ui.sent = null; if (st && st.phase === 'end') render(); }
}
async function copyText(id) {
  const el = $(id); const t = el.value !== undefined && el.tagName === 'TEXTAREA' ? el.value : el.textContent;
  try { await navigator.clipboard.writeText(t); $('copied').textContent = tr('Copiato.'); }
  catch (e) { const r = document.createRange(); r.selectNodeContents(el); const s = getSelection(); s.removeAllRanges(); s.addRange(r); $('copied').textContent = tr('Seleziona e copia il link.'); }
}
async function addTokens(text) {
  const found = (text.match(TOKEN_RE) || []), seen = new Set(); let ok = 0, bad = 0;
  for (const t of found) {
    const r = parseToken(t); if (!r) { bad++; continue; } if (seen.has(r.id)) continue; seen.add(r.id);
    try { await ui.db.collection('scores').doc(r.id).set({ name: r.name, feudo: r.feudo, quiz: r.quiz, total: r.total, crisi: r.crisi, e: r.e, at: Date.now() }); ok++; } catch (e) { bad++; }
  }
  ui.boardMsg = found.length ? `${ok} aggiunti${bad ? `, ${bad} non validi` : ''}.` : 'Non ho trovato nessun codice valido.';
  render();
}
function showWinner() {
  const rows = rankRows(ui.rows || []); if (!rows.length) return;
  const w = $('winner'); let conf = '';
  for (let i = 0; i < 70; i++) conf += `<span class="conf" style="left:${Math.random() * 100}%;background:${['#ffffff', '#1c1416', '#ffd1d8'][i % 3]};animation-duration:${2.5 + Math.random() * 3}s;animation-delay:${-Math.random() * 5}s"></span>`;
  w.innerHTML = `${conf}<div class="w1">Vincitore della classe</div><div class="w2">${esc(rows[0].name)}</div><div class="w3">${rows[0].total} punti</div>
    <div>${rows.slice(1, 3).map((r, i) => `${i + 2}° ${esc(r.name)} · ${r.total}`).join('<br>')}</div><button class="btn" data-act="close-winner">Chiudi</button>`;
  w.hidden = false;
}

document.addEventListener('click', async e => {
  const b = e.target.closest('[data-act]'); if (!b) return; const a = b.dataset.act;
  if (a === 'start') start();
  else if (a === 'continue') { st = saved; saved = null; render(); }
  else if (a === 'go-event') { pushHist(); st.phase = 'event'; render(); enterAnim(); }
  else if (a === 'tut-next') tutNext();
  else if (a === 'tut-skip' || a === 'tut-done') beginGame();
  else if (a === 'choose') choose(+b.dataset.i);
  else if (a === 'go-map') { pushHist(); st.phase = 'map'; ui.sel = []; render(); }
  else if (a === 'select') { togglePick(b.dataset.id); }
  else if (a === 'cancel') { ui.sel = []; render(); }
  else if (a === 'confirm') confirmOrder();
  else if (a === 'end-turn') endTurn();
  else if (a === 'next') nextStep();
  else if (a === 'answer') answer(+b.dataset.i);
  else if (a === 'after-quiz') afterQuiz();
  else if (a === 'copy') copyText(b.dataset.t);
  else if (a === 'restart') { st = null; ui.sent = null; ui.board = false; hist.length = 0; render(); }
  else if (a === 'close-board') { ui.board = false; ui.pwErr = false; render(); }
  else if (a === 'unlock') unlock();
  else if (a === 'add-tokens') addTokens($('paste').value);
  else if (a === 'winner') showWinner();
  else if (a === 'close-winner') $('winner').hidden = true;
  else if (a === 'clear') {
    if (SHEET_URL) { ui.boardMsg = 'Per azzerare la classifica cancella le righe nel Foglio Google «Classifica Feudo».'; render(); }
    else if (!ui.clearArm) { ui.clearArm = true; render(); setTimeout(() => { ui.clearArm = false; if (ui.board) render(); }, 4000); }
    else { ui.clearArm = false; for (const r of (ui.rows || [])) { try { await ui.db.collection('scores').doc(r.id).delete(); } catch (e) {} } ui.boardMsg = 'Classifica azzerata.'; render(); }
  }
});
function unlock() {
  const v = $('pw') ? $('pw').value : '';
  if (fnv(v + SALT) === PW_HASH) { ui.unlocked = true; ui.pwErr = false; try { sessionStorage.setItem(DOC_KEY, '1'); } catch (e) {} }
  else ui.pwErr = true;
  render();
}
document.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target && e.target.id === 'pw') unlock(); });
function togglePick(id) {
  const i = ui.sel.indexOf(id);
  if (i >= 0) ui.sel.splice(i, 1); else { ui.sel.push(id); if (ui.sel.length > st.ap) ui.sel.shift(); }
  render();
  if (ui.sel.length) { const sc = document.querySelector('.sel-card'); if (sc && sc.scrollIntoView) sc.scrollIntoView({ block: 'nearest', behavior: 'auto' }); }
}
$('btnBoard').addEventListener('click', () => { ui.board = true; render(); });
$('btnBack').addEventListener('click', back);
$('btnLang').addEventListener('click', toggleLang);
document.addEventListener('keydown', e => {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.ctrlKey || e.metaKey) return;
  const n = parseInt(e.key, 10);
  if (n >= 1 && n <= 3) { const b = document.querySelectorAll('.opt[data-act]')[n - 1]; if (b) b.click(); }
});

/* ---------- classifica su Foglio Google (stessa interfaccia del db condiviso) ---------- */
function makeSheetDb(url) {
  const subs = []; let timer = null, last = [];
  const emit = rows => subs.forEach(f => f({ docs: rows.map(r => ({ id: r.id, data: () => r })) }));
  async function poll() {
    try {
      const r = await fetch(url + (url.indexOf('?') >= 0 ? '&' : '?') + 't=' + Date.now()), j = await r.json();
      if (!Array.isArray(j)) return;
      last = j.map(x => ({ id: String(x.id), name: String(x.name), feudo: +x.feudo, quiz: +x.quiz, total: +x.total, crisi: +x.crisi, e: Math.max(0, ENDINGS.indexOf(x.finale)), at: 0 }));
      emit(last);
    } catch (e) {}
  }
  return {
    poll,
    collection: () => ({
      doc: id => ({
        set: async d => {
          await fetch(url, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ id, name: d.name, feudo: d.feudo, quiz: d.quiz, total: d.total, crisi: d.crisi, finale: ENDINGS[d.e] || '' }) });
          last = last.filter(x => x.id !== id).concat([Object.assign({ id }, d)]); emit(last);
        },
        delete: async () => {}
      }),
      onSnapshot: f => {
        subs.push(f); poll();
        if (!timer) timer = setInterval(() => { if (!document.hidden && (ui.board || (st && st.phase === 'end'))) poll(); }, 10000);
        return () => {};
      }
    })
  };
}

/* ---------- capacità: classifica condivisa (db) e docente (user) ---------- */
async function initCaps() {
  if (SHEET_URL) {
    ui.db = makeSheetDb(SHEET_URL);
    ui.db.collection('scores').onSnapshot(snap => { ui.rows = snap.docs.map(d => Object.assign({ id: d.id }, d.data())); if (ui.board || (st && st.phase === 'end')) { const pa = document.activeElement; if (!(pa && (pa.tagName === 'TEXTAREA' || pa.tagName === 'INPUT'))) render(); } });
    render(); return;
  }
  try {
    if (!window.claude || !window.claude.use) return;
    const [db, user] = await Promise.all([window.claude.use('db'), window.claude.use('user')]);
    ui.isOwner = user ? await user.isOwner() : false;
    if (db) {
      ui.db = db;
      db.collection('scores').onSnapshot(snap => { ui.rows = snap.docs.map(d => Object.assign({ id: d.id }, d.data())); if (ui.board || (st && st.phase === 'end')) { const pa = document.activeElement; if (!(pa && (pa.tagName === 'TEXTAREA' || pa.tagName === 'INPUT'))) render(); } }, () => {});
    }
    await handleHash();
    window.addEventListener('hashchange', handleHash);
    render();
  } catch (e) {}
}
async function handleHash() {
  if (!ui.isOwner || !ui.db) return;
  const m = (location.hash || '').match(TOKEN_RE); if (!m) return;
  ui.board = true; await addTokens(m.join(' '));
}

try { ui.unlocked = sessionStorage.getItem(DOC_KEY) === '1'; } catch (e) {}
saved = load();
st = null;
render();
initCaps();
window.__game = { get st() { return st; }, get ui() { return ui; }, hist, back, ents, fires, playAnim };
