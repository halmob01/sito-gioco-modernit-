/* ---------- PROLOGO: il mondo romano funziona (prima del tutorial) ---------- */
const PI_INK = '#1c1416', PI_RED = '#c8102e', PI_SKY = '#f8efe3', PI_SKIN = '#f2d3b3', PI_GOLD = '#f3dfa2', PI_GRAIN = '#d9a93a',
  PI_STONE = '#d8d0c6', PI_ROAD = '#e0cfae', PI_WATER = '#bdd0d4', PI_GROUND = '#e9dfca', PI_WOOD = '#7a5b45';
const pSvg = inner => `<svg viewBox="0 0 480 270" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">${inner}</svg>`;
const pAnim = (attr, from, to, dur, extra = '') => `<animate attributeName="${attr}" from="${from}" to="${to}" dur="${dur}" ${extra}/>`;
const pMove = (vals, dur, extra = '') => `<animateTransform attributeName="transform" type="translate" values="${vals}" dur="${dur}" ${extra}/>`;
function pFig(x, y, col, s = 1, anim = '') {
  return `<g transform="translate(${x} ${y}) scale(${s})"><g>${anim}
    <line x1="-2" y1="0" x2="-3" y2="9" stroke="${PI_INK}" stroke-width="2.2" stroke-linecap="round"/><line x1="2" y1="0" x2="3" y2="9" stroke="${PI_INK}" stroke-width="2.2" stroke-linecap="round"/>
    <rect x="-4.5" y="-14" width="9" height="14" fill="${col}" stroke="${PI_INK}" stroke-width="1.6"/><circle cx="0" cy="-19" r="4.6" fill="${PI_SKIN}" stroke="${PI_INK}" stroke-width="1.6"/></g></g>`;
}
function pTree(x, y) { return `<rect x="${x - 3}" y="${y}" width="6" height="20" fill="${PI_WOOD}" stroke="${PI_INK}" stroke-width="2"/><circle cx="${x}" cy="${y - 6}" r="19" fill="#a9b48a" stroke="${PI_INK}" stroke-width="2.5"/>`; }
function pStripes(x, y, w, h, n) { let s = ''; for (let i = 0; i < n; i++) s += `<line x1="${x + 4}" y1="${y + 8 + i * (h - 12) / (n - 1)}" x2="${x + w - 4}" y2="${y + 8 + i * (h - 12) / (n - 1)}" stroke="${PI_GRAIN}" stroke-width="2"/>`; return s; }
function pWheel(cx, cy, r, dur) { return `<g transform="translate(${cx} ${cy})"><g><animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="${dur}" repeatCount="indefinite"/>
  <circle r="${r}" fill="#fff" stroke="${PI_INK}" stroke-width="3"/><line x1="${-r}" y1="0" x2="${r}" y2="0" stroke="${PI_INK}" stroke-width="2"/><line x1="0" y1="${-r}" x2="0" y2="${r}" stroke="${PI_INK}" stroke-width="2"/></g></g>`; }
const pBob = (amp, dur, begin = 0) => pMove(`0 0;0 ${-amp};0 0`, dur, `repeatCount="indefinite" begin="${begin}s"`);

/* 1 · la villa all'alba */
function pS1() {
  let smoke = ''; for (let i = 0; i < 3; i++) smoke += `<circle cx="292" cy="104" r="5" fill="#fff" stroke="${PI_INK}" stroke-width="1.5" opacity="0">${pAnim('cy', 104, 62, '3.6s', `repeatCount="indefinite" begin="${-i * 1.2}s"`)}<animate attributeName="opacity" values="0;.9;0" dur="3.6s" repeatCount="indefinite" begin="${-i * 1.2}s"/></circle>`;
  return pSvg(`<rect width="480" height="270" fill="${PI_SKY}"/>
    <circle cx="385" cy="210" r="24" fill="${PI_RED}">${pAnim('cy', 212, 64, '3.6s', 'fill="freeze"')}</circle>
    <path d="M0 190 Q90 165 170 186 T330 182 T480 178 V270 H0Z" fill="${PI_GROUND}" stroke="${PI_INK}" stroke-width="3"/>
    ${pTree(38, 168)}${pTree(446, 170)}
    <g stroke="${PI_INK}" stroke-width="3" stroke-linejoin="round"><rect x="286" y="96" width="12" height="30" fill="#fff"/><rect x="165" y="132" width="150" height="56" fill="#fff"/><polygon points="155,132 240,92 325,132" fill="${PI_RED}"/>
      <rect x="228" y="152" width="24" height="36" fill="${PI_INK}"/><rect x="182" y="146" width="22" height="20" fill="${PI_WATER}" stroke-width="2"/><rect x="276" y="146" width="22" height="20" fill="${PI_WATER}" stroke-width="2"/>
      <rect x="212" y="150" width="6" height="38" fill="#fff" stroke-width="2"/><rect x="262" y="150" width="6" height="38" fill="#fff" stroke-width="2"/></g>${smoke}
    <rect x="10" y="206" width="170" height="54" fill="${PI_GOLD}" stroke="${PI_INK}" stroke-width="3"/>${pStripes(10, 206, 170, 54, 6)}
    <rect x="300" y="206" width="170" height="54" fill="${PI_GOLD}" stroke="${PI_INK}" stroke-width="3"/>${pStripes(300, 206, 170, 54, 6)}
    <g>${pMove('0 0;120 0;0 0', '10s', 'repeatCount="indefinite"')}${pFig(30, 226, PI_RED, 1.2, pBob(1.6, '.5s'))}</g>
    <g>${pMove('0 0;-110 0;0 0', '12s', 'repeatCount="indefinite"')}${pFig(450, 230, PI_INK, 1.2, pBob(1.6, '.55s'))}</g>`);
}
/* 2 · la strada sicura */
function pS2() {
  let stones = ''; [0, -1.7, -3.4].forEach(b => stones += `<g>${pMove('490 0;-30 0', '5.1s', `repeatCount="indefinite" begin="${b}s"`)}<rect x="0" y="162" width="10" height="17" rx="2" fill="${PI_STONE}" stroke="${PI_INK}" stroke-width="2"/><rect x="2" y="166" width="6" height="2.5" fill="${PI_RED}"/></g>`);
  return pSvg(`<rect width="480" height="270" fill="${PI_SKY}"/>
    <path d="M0 150 Q100 120 200 146 T400 140 T480 138 V270 H0Z" fill="#ebe3d0" stroke="${PI_INK}" stroke-width="3"/>
    <g stroke="${PI_INK}" stroke-width="2.5"><rect x="404" y="116" width="62" height="34" fill="#fff"/><rect x="398" y="104" width="14" height="46" fill="#fff"/><rect x="458" y="104" width="14" height="46" fill="#fff"/>
      <polygon points="396,104 405,92 414,104" fill="${PI_RED}"/><polygon points="456,104 465,92 474,104" fill="${PI_RED}"/><rect x="428" y="128" width="14" height="22" fill="${PI_INK}"/></g>
    <rect x="0" y="170" width="480" height="56" fill="${PI_ROAD}"/><line x1="0" y1="170" x2="480" y2="170" stroke="${PI_INK}" stroke-width="3"/><line x1="0" y1="226" x2="480" y2="226" stroke="${PI_INK}" stroke-width="3"/>
    <line x1="0" y1="198" x2="480" y2="198" stroke="#b79a68" stroke-width="3" stroke-dasharray="14 12">${pAnim('stroke-dashoffset', 0, 26, '.5s', 'repeatCount="indefinite"')}</line>
    ${stones}
    <g transform="translate(135 138)"><g>${pBob(1.5, '.45s')}
      <line x1="94" y1="34" x2="70" y2="36" stroke="${PI_INK}" stroke-width="3.5"/>
      <rect x="0" y="12" width="72" height="26" fill="#d9b77a" stroke="${PI_INK}" stroke-width="3"/>
      <ellipse cx="14" cy="10" rx="12" ry="10" fill="${PI_GOLD}" stroke="${PI_INK}" stroke-width="2.5"/><ellipse cx="38" cy="8" rx="12" ry="11" fill="${PI_GOLD}" stroke="${PI_INK}" stroke-width="2.5"/><ellipse cx="60" cy="10" rx="11" ry="10" fill="${PI_GOLD}" stroke="${PI_INK}" stroke-width="2.5"/>
      ${pFig(40, -12, PI_INK, 1)}
      <ellipse cx="116" cy="34" rx="24" ry="13" fill="#7a6a62" stroke="${PI_INK}" stroke-width="3"/><circle cx="140" cy="28" r="8.5" fill="#7a6a62" stroke="${PI_INK}" stroke-width="3"/>
      <line x1="138" y1="21" x2="142" y2="14" stroke="${PI_INK}" stroke-width="3" stroke-linecap="round"/>
      <line x1="102" y1="44" x2="102" y2="56" stroke="${PI_INK}" stroke-width="4"/><line x1="130" y1="44" x2="130" y2="56" stroke="${PI_INK}" stroke-width="4"/></g>
      ${pWheel(16, 42, 13, '.8s')}${pWheel(58, 42, 13, '.8s')}</g>`);
}
/* 3 · una sola moneta */
function pS3() {
  const paths = ['M75,140 Q150,36 240,118', 'M240,118 Q335,26 410,150', 'M410,150 Q250,6 75,134'];
  let coins = '', routes = '';
  paths.forEach((d, k) => {
    routes += `<path d="${d}" fill="none" stroke="${PI_INK}" stroke-opacity=".25" stroke-width="2" stroke-dasharray="3 6"/>`;
    [0, -1.1, -2.2].forEach(b => coins += `<g><circle r="7.5" fill="#e5b84a" stroke="${PI_INK}" stroke-width="2"/><circle r="3.2" fill="none" stroke="${PI_INK}" stroke-width="1.2"/><animateMotion dur="3.3s" repeatCount="indefinite" begin="${b - k * .5}s" path="${d}"/></g>`);
  });
  let waves = ''; for (let i = 0; i < 14; i++) waves += `q10 -7 20 0 `;
  return pSvg(`<rect width="480" height="270" fill="${PI_SKY}"/>
    <rect x="0" y="190" width="480" height="30" fill="${PI_GROUND}"/><line x1="0" y1="190" x2="480" y2="190" stroke="${PI_INK}" stroke-width="3"/>
    <rect x="0" y="214" width="480" height="56" fill="${PI_WATER}" stroke="${PI_INK}" stroke-width="3"/>
    <g fill="none" stroke="#fff" stroke-width="2.5"><g>${pMove('0 0;-40 0', '3s', 'repeatCount="indefinite"')}<path d="M-20 236 ${waves}"/><path d="M-30 254 ${waves}"/></g></g>
    ${routes}
    <g stroke="${PI_INK}" stroke-width="3" stroke-linejoin="round"><rect x="40" y="152" width="72" height="38" fill="#fff"/><polygon points="33,152 76,126 119,152" fill="${PI_RED}"/><rect x="68" y="166" width="16" height="24" fill="${PI_INK}"/></g>
    <g stroke="${PI_INK}" stroke-width="3" stroke-linejoin="round"><rect x="206" y="138" width="68" height="52" fill="#fff"/><rect x="198" y="122" width="16" height="68" fill="#fff"/><rect x="266" y="122" width="16" height="68" fill="#fff"/>
      <polygon points="196,122 206,106 216,122" fill="${PI_RED}"/><polygon points="264,122 274,106 284,122" fill="${PI_RED}"/><rect x="232" y="160" width="16" height="30" fill="${PI_INK}"/></g>
    <g>${pBob(2.5, '2.2s')}<g stroke="${PI_INK}" stroke-width="3" stroke-linejoin="round"><path d="M368 206 h86 l-14 22 h-58z" fill="${PI_WOOD}"/><line x1="410" y1="206" x2="410" y2="148"/><polygon points="414,152 414,202 452,202" fill="#fff"/><polygon points="414,176 414,190 440,190 433,176" fill="${PI_RED}" stroke="none"/></g></g>
    ${coins}`);
}
/* 4 · il giudice */
function pS4() {
  return pSvg(`<rect width="480" height="270" fill="${PI_SKY}"/>
    <rect x="0" y="176" width="480" height="94" fill="${PI_GROUND}"/><line x1="0" y1="176" x2="480" y2="176" stroke="${PI_INK}" stroke-width="3"/>
    <rect x="16" y="190" width="174" height="62" fill="${PI_GOLD}" stroke="${PI_INK}" stroke-width="3"/>${pStripes(16, 190, 174, 62, 6)}
    <rect x="190" y="190" width="100" height="62" fill="#d4dcb0" stroke="${PI_INK}" stroke-width="3"/>
    <rect x="150" y="190" width="40" height="62" fill="${PI_RED}" fill-opacity=".28" stroke="${PI_RED}" stroke-width="2" stroke-dasharray="5 4">${pAnim('opacity', 1, 0, '.8s', 'begin="3.4s" fill="freeze"')}</rect>
    <g><rect x="-6" y="-16" width="12" height="20" rx="2" fill="${PI_STONE}" stroke="${PI_INK}" stroke-width="2.5" transform="translate(150 206)"><animateTransform attributeName="transform" type="translate" from="150 206" to="190 206" begin="2.6s" dur="1.1s" fill="freeze"/></rect></g>
    <g>${pMove('0 0;36 0', '1.2s', 'begin="3.4s" fill="freeze"')}${pFig(215, 224, PI_INK, 1.1, pBob(1, '.9s'))}</g>
    ${pFig(120, 214, PI_RED, 1.1, pBob(1.2, '.7s'))}
    <g stroke="${PI_INK}" stroke-width="3" stroke-linejoin="round"><rect x="326" y="86" width="136" height="90" fill="#fff"/><rect x="326" y="86" width="136" height="16" fill="${PI_RED}"/>
      <rect x="326" y="168" width="136" height="14" fill="${PI_STONE}"/></g>
    ${pFig(394, 148, PI_RED, 1.7, pBob(1, '1.6s'))}<rect x="388" y="136" width="20" height="14" fill="${PI_GOLD}" stroke="${PI_INK}" stroke-width="2.5"/>
    <g opacity="0"><animate attributeName="opacity" from="0" to="1" begin="3.5s" dur=".3s" fill="freeze"/><circle cx="394" cy="50" r="22" fill="#fff" stroke="${PI_INK}" stroke-width="3"/>
      <path d="M383 50 L391 59 L406 40" fill="none" stroke="${PI_RED}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="40" stroke-dashoffset="40"><animate attributeName="stroke-dashoffset" from="40" to="0" begin="3.7s" dur=".5s" fill="freeze"/></path></g>`);
}
/* 5 · tasse in cambio di strade, acquedotti, soldati */
function pS5() {
  let drops = '', coins = '', arches = '';
  [0, -.7, -1.4].forEach(b => drops += `<circle cy="129" r="3.5" fill="#fff" stroke="${PI_INK}" stroke-width="1.5">${pAnim('cx', 176, 316, '2.1s', `repeatCount="indefinite" begin="${b}s"`)}</circle>`);
  [0, -.45, -.9].forEach(b => coins += `<circle cx="75" r="6.5" fill="#e5b84a" stroke="${PI_INK}" stroke-width="2">${pAnim('cy', 96, 176, '1.35s', `repeatCount="indefinite" begin="${b}s"`)}<animate attributeName="opacity" values="1;1;0" keyTimes="0;.85;1" dur="1.35s" repeatCount="indefinite" begin="${b}s"/></circle>`);
  for (let i = 0; i < 4; i++) arches += `<path d="M${178 + i * 36} 190 v-24 a14 14 0 0 1 28 0 v24" fill="${PI_SKY}" stroke="${PI_INK}" stroke-width="3"/>`;
  let cren = ''; for (let i = 0; i < 4; i++) cren += `<rect x="${354 + i * 32}" y="140" width="16" height="12" fill="${PI_STONE}" stroke="${PI_INK}" stroke-width="3"/>`;
  return pSvg(`<rect width="480" height="270" fill="${PI_SKY}"/>
    <rect x="0" y="190" width="480" height="80" fill="${PI_GROUND}"/><line x1="0" y1="190" x2="480" y2="190" stroke="${PI_INK}" stroke-width="3"/>
    <rect x="40" y="178" width="70" height="38" fill="${PI_WOOD}" stroke="${PI_INK}" stroke-width="3"/><rect x="68" y="178" width="12" height="38" fill="${PI_RED}" stroke="${PI_INK}" stroke-width="2"/>${coins}
    <rect x="40" y="168" width="70" height="12" rx="3" fill="#8a6a52" stroke="${PI_INK}" stroke-width="3"/>
    ${pFig(130, 205, PI_INK, 1.2, pBob(1, '.8s'))}
    <rect x="170" y="134" width="150" height="56" fill="${PI_ROAD}" stroke="${PI_INK}" stroke-width="3"/>${arches}
    <rect x="170" y="122" width="150" height="12" fill="${PI_WATER}" stroke="${PI_INK}" stroke-width="3"/>${drops}
    ${cren}<rect x="350" y="150" width="120" height="44" fill="${PI_STONE}" stroke="${PI_INK}" stroke-width="3"/>
    <line x1="388" y1="86" x2="388" y2="150" stroke="${PI_INK}" stroke-width="3.5"/><polygon points="388,80 383,94 393,94" fill="${PI_INK}"/>
    ${pFig(412, 142, PI_RED, 1.5, pBob(1.4, '1.1s'))}<rect x="424" y="112" width="15" height="26" rx="3" fill="${PI_RED}" stroke="${PI_INK}" stroke-width="2.5"/><rect x="429" y="112" width="5" height="26" fill="#fff" stroke="none"/>`);
}
/* 6 · la città piena */
function pS6() {
  let cols = '', stalls = '', crowd = '';
  for (let i = 0; i < 8; i++) cols += `<rect x="${58 + i * 48}" y="64" width="12" height="96" fill="#fff" stroke="${PI_INK}" stroke-width="2.5"/>`;
  [24, 136, 248, 360].forEach((x, k) => {
    let aw = ''; for (let i = 0; i < 6; i++) aw += `<rect x="${x + i * 16}" y="150" width="16" height="22" fill="${i % 2 ? '#fff' : PI_RED}" stroke="${PI_INK}" stroke-width="2"/>`;
    const goods = [0, 1, 2, 3, 4].map(g => `<circle cx="${x + 14 + g * 17}" cy="178" r="5.5" fill="${(g + k) % 2 ? PI_RED : '#e5b84a'}" stroke="${PI_INK}" stroke-width="2"/>`).join('');
    stalls += `<rect x="${x + 4}" y="172" width="88" height="26" fill="#d9b77a" stroke="${PI_INK}" stroke-width="3"/>${goods}${aw}`;
  });
  const xs = [34, 74, 112, 150, 192, 228, 268, 306, 342, 378, 416, 448], cs = [PI_RED, PI_INK, '#e5b84a', '#7a6a62'];
  xs.forEach((x, i) => {
    const y = 222 + (i * 7) % 26, bob = pBob(2.4 + (i % 3), `${(.5 + (i % 4) * .13).toFixed(2)}s`, -i * .17);
    const walk = i % 3 === 0 ? `<g>${pMove(`0 0;${i % 2 ? -26 : 26} 0;0 0`, `${6 + i % 4}s`, 'repeatCount="indefinite"')}` : '<g>';
    crowd += walk + pFig(x, y, cs[i % 4], 1.15 + (y - 222) / 100, bob) + '</g>';
  });
  return pSvg(`<rect width="480" height="270" fill="${PI_SKY}"/>
    <rect x="40" y="62" width="400" height="100" fill="#f3ece0" stroke="${PI_INK}" stroke-width="3"/><polygon points="28,62 240,18 452,62" fill="${PI_RED}" stroke="${PI_INK}" stroke-width="3" stroke-linejoin="round"/>${cols}
    <rect x="0" y="198" width="480" height="72" fill="${PI_GROUND}"/><line x1="0" y1="198" x2="480" y2="198" stroke="${PI_INK}" stroke-width="3"/>${stalls}${crowd}`);
}
/* 7 · il carro non arriva */
function pS7() {
  let birds = ''; [[60, 0], [88, -2.6], [44, -5]].forEach(([y, b]) => birds += `<g><path d="M0 0 q6 -7 12 0 q6 -7 12 0" fill="none" stroke="${PI_INK}" stroke-width="2.5" stroke-linecap="round"/>${pMove(`-30 ${y};510 ${y - 14}`, '9s', `repeatCount="indefinite" begin="${b}s"`)}</g>`);
  return pSvg(`<rect width="480" height="270" fill="${PI_SKY}"/>
    <path d="M0 150 Q100 120 200 146 T400 140 T480 138 V270 H0Z" fill="#ebe3d0" stroke="${PI_INK}" stroke-width="3"/>
    <rect x="0" y="170" width="480" height="56" fill="${PI_ROAD}"/><line x1="0" y1="170" x2="480" y2="170" stroke="${PI_INK}" stroke-width="3"/><line x1="0" y1="226" x2="480" y2="226" stroke="${PI_INK}" stroke-width="3"/>
    <line x1="0" y1="198" x2="480" y2="198" stroke="#b79a68" stroke-width="3" stroke-dasharray="14 12"/>
    <rect x="70" y="162" width="10" height="17" rx="2" fill="${PI_STONE}" stroke="${PI_INK}" stroke-width="2"/><rect x="72" y="166" width="6" height="2.5" fill="${PI_RED}"/>
    <g transform="translate(200 206)"><circle r="14" fill="#fff" stroke="${PI_INK}" stroke-width="3" transform="rotate(20)"/><line x1="-14" y1="0" x2="14" y2="0" stroke="${PI_INK}" stroke-width="2" transform="rotate(20)"/><line x1="0" y1="-14" x2="0" y2="14" stroke="${PI_INK}" stroke-width="2" transform="rotate(20)"/></g>
    <ellipse cx="238" cy="212" rx="12" ry="9" fill="${PI_GOLD}" stroke="${PI_INK}" stroke-width="2.5"/><circle cx="256" cy="219" r="2.5" fill="${PI_GRAIN}" stroke="${PI_INK}" stroke-width="1"/><circle cx="262" cy="214" r="2.5" fill="${PI_GRAIN}" stroke="${PI_INK}" stroke-width="1"/>
    <rect width="480" height="270" fill="${PI_INK}" opacity="0">${pAnim('opacity', 0, .42, '4s', 'fill="freeze"')}</rect>
    ${birds}
    <g>${pMove('530 190;330 190', '3s', 'begin=".4s" fill="freeze"')}${pFig(0, 0, PI_RED, 1.4, pBob(2.2, '.28s'))}</g>
    <g opacity="0"><animate attributeName="opacity" from="0" to="1" begin="3.5s" dur=".3s" fill="freeze"/><circle cx="352" cy="132" r="17" fill="${PI_RED}" stroke="#fff" stroke-width="2.5"/><text x="352" y="140" text-anchor="middle" font-size="24" fill="#fff" font-family="'Alfa Slab One', Georgia, serif">!</text></g>`);
}
/* 8 · 476 d.C. */
function pS8() {
  let em = ''; for (let i = 0; i < 16; i++) em += `<rect x="${12 + i * 29}" width="${3 + i % 3}" height="${3 + i % 3}" fill="${i % 3 ? PI_RED : '#fff'}" opacity=".85">${pAnim('y', 285, -10, `${4 + i % 5}s`, `repeatCount="indefinite" begin="${-i * .7}s"`)}</rect>`;
  const yr = LANG === 'ar' ? tr('476 d.C.') : '476 d.C.';
  return pSvg(`<rect width="480" height="270" fill="${PI_INK}"/>${em}
    <text x="240" y="152" text-anchor="middle" font-size="${LANG === 'ar' ? 84 : 76}" fill="#fff" font-family="${LANG === 'ar' ? "'Cairo', 'Noto Sans Arabic', sans-serif" : "'Alfa Slab One', Georgia, serif"}" font-weight="800" opacity="0">${pAnim('opacity', 0, 1, '1.4s', 'begin=".3s" fill="freeze"')}${yr}</text>
    <polyline points="246,0 232,52 252,96 230,150 250,200 236,270" fill="none" stroke="${PI_RED}" stroke-width="4" stroke-linejoin="round" stroke-dasharray="330" stroke-dashoffset="330"><animate attributeName="stroke-dashoffset" from="330" to="0" begin="1.9s" dur="1.1s" fill="freeze"/></polyline>`);
}
const PRO = [
  { t: '400 d.C.', x: ['Una villa in Italia. Il mondo funziona.'], a: pS1 },
  { x: ['Le strade romane sono sicure: un carro di grano parte all\'alba e arriva in città senza scorta.'], a: pS2 },
  { x: ['Una sola moneta vale da un capo all\'altro dell\'Impero.'], a: pS3 },
  { x: ['Se un vicino ti ruba un campo, c\'è un giudice che ti ascolta.'], a: pS4 },
  { x: ['Paghi le tasse. In cambio hai strade, acquedotti e soldati ai confini.'], a: pS5 },
  { x: ['Le città sono piene di gente, di mercati, di cose da comprare.'], a: pS6 },
  { x: ['Ma un giorno il carro non arriva.', '«Le strade non sono più sicure», dice il messo.'], a: pS7 },
  { x: ['Cade l\'Impero romano d\'Occidente.'], a: pS8 }
];
let proI = 0, proOpen = false;
function proRender() {
  const el = $('prologue'), sc = PRO[proI], last = proI === PRO.length - 1, ar = LANG === 'ar', L = s => ar ? tr(s) : s;
  const num = ar ? `⁦${proI + 1}/${PRO.length}⁩` : `${proI + 1}/${PRO.length}`;
  el.lang = LANG;
  el.innerHTML = `<div class="pro-card" dir="${ar ? 'rtl' : 'ltr'}">
    <div class="pro-art pro-in">${sc.a()}</div>
    <div class="pro-body">
      <div class="pro-top"><div class="eyebrow">${L('Prologo')} · ${num}</div><button class="pill" data-notr data-pro="lang">${ar ? 'Italiano' : 'العربية'}</button></div>
      ${sc.t ? `<h2 class="pro-title">${L(sc.t)}</h2>` : ''}
      ${sc.x.map((s, i) => `<p class="pro-text" style="animation-delay:${(.5 + i * 2.4).toFixed(1)}s">${L(s)}</p>`).join('')}
      <div class="pro-dots">${PRO.map((_, i) => `<i class="${i < proI ? 'done' : i === proI ? 'now' : ''}"></i>`).join('')}</div>
      <div class="row"><button class="btn" data-pro="next">${L(last ? 'Vai al tutorial' : 'Avanti')}</button>${last ? '' : `<button class="btn ghost" data-pro="skip">${L('Salta il prologo')}</button>`}</div>
    </div></div>`;
  const svg = el.querySelector('svg');
  if (svg && svg.unpauseAnimations) { try { svg.unpauseAnimations(); } catch (e) {} }
  const nb = el.querySelector('[data-pro=next]'); if (nb && nb.focus) nb.focus({ preventScroll: true });
  el.scrollTop = 0;
}
function openPrologue() { proI = 0; proOpen = true; $('prologue').hidden = false; document.body.style.overflow = 'hidden'; proRender(); }
function closePrologue() { proOpen = false; $('prologue').hidden = true; document.body.style.overflow = ''; window.scrollTo(0, 0); render(); }
function proNext() { if (proI >= PRO.length - 1) closePrologue(); else { proI++; proRender(); } }
document.addEventListener('click', e => {
  const b = e.target.closest && e.target.closest('[data-pro]'); if (!b || !proOpen) return; const a = b.dataset.pro;
  if (a === 'next') proNext(); else if (a === 'skip') closePrologue(); else if (a === 'lang') toggleLang();
});
document.addEventListener('keydown', e => {
  if (!proOpen || e.ctrlKey || e.metaKey) return;
  if (e.key === 'Escape') closePrologue(); else if (e.key === 'ArrowRight') proNext();
});
