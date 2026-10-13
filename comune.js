/* ===================== INTERFACCIA E MAPPA ===================== */
try { if (localStorage.getItem(LANG_KEY) === 'ar') LANG = 'ar'; } catch (e) {}
const GW = 7, GH = 6;
const POS = { castle: [3, 3], village: [1, 3], piazza: [4, 2], chiesa: [5, 3], road: [6, 0] };
const FIELDS_BASE = [[2, 4], [3, 4]], FIELD_SLOTS = [[4, 4], [5, 4], [2, 5], [3, 5]];
const HILLS = [[5, 1], [1, 1], [6, 4]];
const CC = [3.5, 3.5];
const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let st = null, saved = null, ui = { unlocked: false, pwErr: false, sel: [], board: false, rows: null, db: null, isOwner: false, boardMsg: '', clearArm: false, sent: null };
const hist = [];
const chapterOf = t => Math.floor(Math.min(t, TURNS - 1) / 2);
const seasonOf = t => (t % 2 === 0 ? 'Primavera' : 'Autunno');

function save() { try { if (st && !st.tut) localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {} }
function load() { try { const s = localStorage.getItem(KEY); return s ? JSON.parse(s) : null; } catch (e) { return null; } }
function wipe() { try { localStorage.removeItem(KEY); } catch (e) {} }
