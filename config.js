/* ===================== CONFIGURAZIONE ===================== */
/* I valori che cambiano da una copia all'altra del gioco. Si caricano per primi: motore e interfaccia li leggono soltanto. */

/* Firma dei link di punteggio e della password docente. Cambiarla rende non validi i link generati in precedenza. */
const SALT = 'game-template-1';

/* Chiavi con cui il browser ricorda partita, lingua e accesso docente. Su GitHub Pages tutte le repo dello stesso account
   condividono lo stesso dominio: ogni copia del gioco deve avere chiavi proprie, altrimenti si sovrascrivono i salvataggi. */
const KEY = 'game-template-v1';
const LANG_KEY = 'game-template-lang';
const DOC_KEY = 'game-template-doc';

/* Password dell'area docente, salvata come impronta. Password iniziale: "cambiami".
   Per sceglierne una nuova: apri la pagina, console del browser, scrivi  fnv('latuapassword' + SALT)  e incolla qui il risultato. */
const PW_HASH = '184r98r';

/* Classifica su Foglio Google (facoltativa). Con SHEET_URL vuoto i punteggi non partono da soli:
   l'allievo copia un link e lo manda al docente. SHEET_URL è l'indirizzo dell'app web dello script, SHEET_VIEW quello del foglio. */
const SHEET_URL = '';
const SHEET_VIEW = '';

/* Indirizzo da cui l'allievo manda il link a fine partita. Su github.io usa quello della pagina; altrove usa questo (può restare vuoto). */
const ARTIFACT_URL = '';
const SELF_URL = /github\.io$/.test(location.hostname) ? location.origin + location.pathname : ARTIFACT_URL;
