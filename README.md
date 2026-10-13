# sito-game-template1

Modello per un gioco di classe a capitoli, ricavato da `sito-feudo` (caduta dell'Impero romano e nascita dei poteri locali). Funziona così com'è: si apre `index.html` nel browser, senza server e senza installare nulla.

## Struttura dei file

| File | Contenuto | Cosa cambia in una nuova unità |
|---|---|---|
| `index.html` | Intestazione, struttura della pagina, elenco degli script | Il titolo e i testi fissi della pagina |
| `stile.css` | Tutta la grafica | Niente, salvo l'aspetto |
| `config.js` | Chiavi di salvataggio, password docente, Foglio Google, indirizzi | Sempre, in ogni copia |
| `contenuti.js` | Nomi delle misure, capitoli con quiz, eventi del gioco | Tutto |
| `motore.js` | Regole: stato, ordini, crisi, punteggio, finali, codice del punteggio | In parte (vedi sotto) |
| `i18n.js` | Traduzione in arabo, frase per frase | Va rifatta o tolta |
| `comune.js` | Stato e funzioni condivise dell'interfaccia | Niente |
| `mappa.js` | Mappa animata su canvas (castello, campi, chiesa, razzie) | Va sostituita |
| `prologo.js` | Otto scene del prologo, disegnate in SVG | Vanno sostituite |
| `interfaccia.js` | Pannelli, azioni dei pulsanti, area docente, classifica, avvio | Solo i testi |

Gli script sono classici e condividono le stesse variabili, quindi l'ordine in `index.html` non va cambiato.

## Prima di usare la copia

1. `config.js`: la password iniziale dell'area docente è `cambiami`. Per sceglierne una nuova, apri la pagina, scrivi nella console del browser `fnv('latuapassword' + SALT)` e incolla il risultato in `PW_HASH`.
2. `config.js`: se ci sono altre copie del gioco sullo stesso account GitHub Pages, ognuna deve avere `KEY`, `LANG_KEY` e `DOC_KEY` diverse, altrimenti i salvataggi si sovrascrivono.
3. Classifica su Foglio Google (facoltativa): compila `SHEET_URL` e `SHEET_VIEW`. Se restano vuoti, a fine partita l'allievo copia un link e lo manda al docente, che lo incolla nell'area docente.
4. Contatore visite (facoltativo): in `index.html` c'è un blocco commentato per GoatCounter.

## Dove sta ancora il contenuto della storia

Il motore non è ancora del tutto indipendente dall'argomento. Questi pezzi parlano ancora di feudo e vanno riscritti per un'altra storia:

- `motore.js`: `ORDERS` (le azioni del turno), `TUT_EVENT` e `TUT_NEXT` (evento di prova), `tick` (raccolto e scorte di fine capitolo), `feudoScore` ed `ending` (punteggio e finali), `ENDINGS`.
- `interfaccia.js`: `RECAP` e `RECAP_CHAIN` (riepilogo finale), testi dei pannelli e del tutorial.
- `mappa.js` e `prologo.js`: grafica legata al feudo.
- `i18n.js`: dizionario arabo.

## Prova in locale

Basta aprire `index.html`. Per usare il codice di `motore.js` da Node, caricare prima `config.js` e `contenuti.js` nello stesso contesto: l'esportazione in fondo a `motore.js` usa `EVENTS`, che ora sta in `contenuti.js`.

## Passo successivo previsto

Trasformare eventi, ordini e finali da funzioni a dati semplici, così che una nuova unità richieda solo di compilare `contenuti.js` e sostituire la mappa.
