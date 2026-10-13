/* ===================== CONTENUTI DELLA STORIA ===================== */
/* Tutto quello che cambia quando cambia argomento: nomi delle misure, capitoli e quiz, eventi. Il resto del gioco (motore.js) non nomina il feudo. */
const TURNS = 16;
const LABEL = { c: 'Granaio', s: 'Sicurezza', p: 'Contadini', r: 'Favore del re', fort: 'Difese', terre: 'Campi', vass: 'Fedeli', chiesa: 'Pieve', guardie: 'Guardie' };

const CH = [
  { year: '476 d.C.', title: 'La fine del mondo',
    intro: `L'ultimo imperatore d'Occidente è stato deposto. Roma, che per mille anni ha dato leggi, soldati, tasse e strade, non c'è più. Hai una villa con i campi, a sud di Mediolanum, la città che oggi chiamiamo Milano.`,
    note: `Senza Stato non ci sono più esercito, polizia e tribunali. Il potere passa a chi ha terra, uomini e forza nel posto dove vive.`,
    quiz: { q: 'Cosa succede quando cade l\'Impero romano d\'Occidente nel 476?', opts: ['Nasce subito un impero nuovo e più forte', 'Spariscono esercito, polizia e tribunali, e il potere passa a chi ha la forza sul posto', 'I popoli barbari costruiscono scuole e strade per tutti'], ok: 1 } },
  { year: 'circa 500 d.C.', title: 'Nascono i castelli',
    intro: `Sono passati vent'anni. Le bande armate non spariscono e i villaggi bruciano. Chi può costruisce difese.`,
    note: `Senza esercito la sicurezza si cerca da soli, dietro le mura: nascono i castelli. E nasce un patto: i contadini lavorano e giurano fedeltà, il signore protegge.`,
    quiz: { q: 'Perché nascono i castelli?', opts: ['Perché l\'imperatore li ordina in tutta Europa', 'Per fare le feste dei nobili', 'Perché senza esercito la difesa diventa un problema locale e ci si chiude dentro le mura'], ok: 2 } },
  { year: 'circa 540 d.C.', title: 'Guerra, fame e malattie',
    intro: `Sono passati quasi settant'anni. Eserciti stranieri attraversano l'Italia: Goti e soldati dell'imperatore d'Oriente si combattono per il controllo della penisola. Dove passano, i campi bruciano e le scorte spariscono.`,
    note: `Guerre, carestie e malattie fanno calare la popolazione. Senza i servizi dello Stato vivere in città diventa difficile: le città si spopolano e la vita si sposta in campagna.`,
    quiz: { q: 'Perché le città si spopolano dopo la caduta dell\'Impero?', opts: ['Perché tutti vogliono vivere vicino al mare', 'Perché tra guerre, carestie e malattie, senza i servizi dello Stato, vivere in città diventa difficile e la vita si sposta in campagna', 'Perché i barbari vietano di abitare nelle città'], ok: 1 } },
  { year: 'circa 570 d.C.', title: 'Un re lontano',
    intro: `I Longobardi, un popolo venuto da nord, sono entrati in Italia nel 568. Il loro re governa da Pavia, lontano. Da ora conta anche il Favore del re.`,
    note: `Un re lontano non controlla tutto: affida pezzi di potere ai signori locali. Il potere è "appaltato". Tu giudichi, difendi e riscuoti in suo nome.`,
    quiz: { q: 'Cosa vuol dire che il potere viene "appaltato" ai signori locali?', opts: ['Il re vende le tasse ai mercanti', 'Il re, troppo lontano, affida a conti e marchesi il compito di giudicare e difendere in suo nome', 'I contadini scelgono il re con il voto'], ok: 1 } },
  { year: 'circa 700 d.C.', title: 'La Chiesa resta',
    intro: `Passa circa un secolo. La Chiesa ha vescovi, pievi e monasteri in ogni zona, anche dove non arriva il re.`,
    note: `La Chiesa ha una rete stabile: cura, insegna, copia i libri. Ha terre e potere politico. La società si immagina in tre parti: chi prega, chi combatte, chi lavora.`,
    quiz: { q: 'Perché la Chiesa ha tanto peso dopo il crollo dell\'Impero?', opts: ['Ha una rete stabile di vescovi, pievi e monasteri su tutto il territorio', 'Ha il più grande esercito d\'Europa', 'Governa tutta l\'Europa con un solo re'], ok: 0 } },
  { year: '800 d.C.', title: `L'imperatore`,
    intro: `Natale dell'800: il papa incorona Carlo Magno imperatore. Sembra tornato l'Impero, ma l'imperatore governa con conti e messi che controllano ogni tanto.`,
    note: `L'imperatore non ha polizia né esercito sempre pronto: governa con i fedeli. Si forma una catena di legami personali: imperatore, conte, vassallo, contadini. È il sistema feudale.`,
    quiz: { q: 'Che cos\'è il vassallaggio?', opts: ['Un\'imposta pagata ogni anno allo Stato', 'Un contratto scritto davanti a un notaio', 'Un legame personale: fedeltà e aiuto in cambio di protezione e terra'], ok: 2 } },
  { year: 'circa 840 d.C.', title: `L'impero si divide`,
    intro: `Carlo Magno è morto da quasi trent'anni. I suoi nipoti si dividono l'impero in tre parti (trattato di Verdun, 843) e litigano tra loro. L'Italia fa parte di una di queste parti.`,
    note: `Nessuno riesce a rimettere in piedi uno Stato come quello romano: le distanze sono enormi, le comunicazioni lente e l'amministrazione debole. Il re ha bisogno dei signori locali, e i signori diventano sempre più forti.`,
    quiz: { q: 'Perché neppure l\'impero carolingio riesce a governare tutto direttamente?', opts: ['Perché i re non volevano comandare', 'Perché distanze, comunicazioni lente e amministrazione debole costringono a lasciare il governo ai signori locali', 'Perché i Romani avevano distrutto tutte le strade apposta'], ok: 1 } },
  { year: 'circa 900 d.C.', title: 'Il feudo diventa eredità',
    intro: `L'impero si è spezzato. I re sono deboli, i signori forti. Nemici nuovi arrivano da lontano e ognuno si difende dal proprio castello.`,
    note: `I feudi diventano ereditari e il castello è il centro del potere locale. Per chi vive intorno lo Stato è lontano e il signore è vicino.`,
    quiz: { q: 'Chi sono gli oratores, i bellatores e i laboratores?', opts: ['Chi prega, chi combatte e chi lavora', 'Tre tipi di tasse medievali', 'Tre eserciti di Carlo Magno'], ok: 0 } }
];

/* ---------- EVENTI (uno per turno) ---------- */
/* kind: Minaccia, Richiesta, Visita, Decisione, Crisi. warn: cosa si sente dire la stagione prima. scout: cosa dicono gli esploratori. */
const EVENTS = [
// Capitolo 1 (476)
st => ({ title: 'I soldati se ne vanno', kind: 'Decisione', stakes: ['s', 'c'],
  text: [`Una mattina i pochi soldati romani di guardia alla strada raccolgono le loro cose. «Nessuno ci paga più», dice il capitano. «Torniamo a casa». Per la prima volta nessuno difende la zona.`],
  choices: [
    { tag: 'Denaro', label: 'Pagarli perché restino qualche mese', run: () => O(`Restano, ma il granaio si svuota. Senza tasse, come li pagherai la prossima volta?`, { c: -10, s: 15 }) },
    { tag: 'Lasciar fare', label: 'Lasciarli andare', run: () => O(`Se ne vanno con i loro cavalli. La strada resta vuota. I contadini hanno paura.`, { s: -8, p: -4 }, { k: 'leave' }) },
    { tag: 'Armi', label: 'Armare alcuni giovani contadini', run: () => O(`Imparano in fretta, ma i campi hanno meno braccia. Quando manca lo Stato, la difesa passa a chi vive lì.`, { s: 8, p: -3, c: -3, guardie: 1 }) } ] }),
st => ({ title: 'Banditi nella nebbia', kind: 'Minaccia', stakes: ['s'],
  warn: `Un pastore dice di aver visto fuochi nella nebbia, oltre il fiume. Forse una banda armata.`,
  scout: `Sono cinque uomini affamati, senza capo. Con Sicurezza 45 o più, non osano entrare.`,
  text: [`Una banda armata si avvicina alla villa. Non sono soldati: sono uomini affamati, rimasti senza padrone. Vogliono il grano.`],
  choices: [
    { tag: 'Forza', label: 'Resistere con i tuoi uomini', run: st => st.s >= 45
        ? O(`I tuoi uomini sono pronti e numerosi. I banditi rinunciano e scappano. La gente è fiera di te.`, { s: 5, p: 6 }, R('tl', 5, 'ok'), NEED(st, 's', 45))
        : O(`I tuoi uomini sono pochi e impreparati. I banditi portano via grano e bestiame.`, { c: -18, p: -8, s: -6 }, R('tl', 5, 'bad', ['village']), NEED(st, 's', 45)) },
    { tag: 'Denaro', label: 'Dare loro del grano', run: () => O(`Se ne vanno. Ma ora sanno che sei debole, e torneranno.`, { c: -12, s: -4 }, R('tl', 4, 'loot')) },
    { tag: 'Accordo', label: 'Offrire lavoro e un posto nella villa', run: () => O(`Alcuni restano e diventano tuoi uomini. Un patto nuovo: ti servono e ti proteggono. Un legame personale, come quelli dei rapporti feudali.`, { s: 6, c: -6, p: -2, guardie: 1 }, R('tl', 3, 'join')) } ] }),
// Capitolo 2 (500)
st => ({ title: 'Le famiglie chiedono rifugio', kind: 'Richiesta', stakes: ['c', 'p'],
  warn: `Alcune famiglie dei villaggi vicini si stanno mettendo in cammino: cercano un posto sicuro.`,
  text: [`Le bande sono sempre più frequenti. Alcune famiglie dei villaggi vicini bussano alla tua porta. Vogliono vivere vicino alla tua casa e, in cambio, lavoreranno le tue terre.`],
  choices: [
    { tag: 'Aiuto', label: 'Accoglierle e dare protezione', run: () => O(`Ecco un patto: protezione in cambio di lavoro e fedeltà. Hai più braccia e più bocche da sfamare.`, { p: 8, c: -4, terre: 1 }, { k: 'arrive', n: 4 }) },
    { tag: 'Patto', label: 'Accoglierle solo se giurano fedeltà', run: () => O(`Giurano davanti a tutti. Non è una legge dello Stato, è una promessa tra persone.`, { p: 4, s: 6, c: -2, terre: 1 }, { k: 'arrive', n: 3 }) },
    { tag: 'Rifiuto', label: 'Rifiutare: non hai cibo per tutti', run: () => O(`Se ne vanno. Il granaio è salvo, ma la gente del villaggio ti giudica duramente.`, { p: -6, c: 3 }) } ] }),
st => ({ title: 'La banda arriva', kind: 'Minaccia', stakes: ['s', 'fort'],
  warn: `Le sentinelle sentono un corno nella nebbia: una banda più grande si avvicina. Contano le Difese e la Sicurezza.`,
  scout: `Sono più di venti uomini. Con una palizzata (Difese 1) e Sicurezza 35 o più, reggi. Con meno, perdi parte del raccolto. Senza difese, ti saccheggiano.`,
  text: [`All'alba senti suonare un corno. La banda è qui: decine di uomini armati sulla strada della villa.`],
  choices: [
    { tag: 'Forza', label: 'Difenderti dietro le difese', run: st => st.fort >= 1 && st.s >= 35
        ? O(`Le difese reggono e i tuoi uomini sono pronti. La banda cerca un altro bersaglio. I contadini capiscono perché servono le mura.`, { p: 10, s: 6 }, R('tl', 6, 'ok'), `Difese ${st.fort} (ne serviva 1) e ${NEED(st, 's', 35)}`)
        : st.fort >= 1
          ? O(`Le difese reggono, ma i tuoi uomini sono pochi. Perdi parte del raccolto.`, { c: -8, p: -4 }, R('tl', 6, 'part'), `Difese sì, ma ${NEED(st, 's', 35)}`)
          : O(`Senza mura puoi fare poco. La banda entra e saccheggia.`, { c: -20, p: -10, s: -8 }, R('tl', 6, 'bad', ['village', 'fields']), `Difese ${st.fort}, ne serviva almeno 1.`) },
    { tag: 'Fuga', label: 'Scappare con la famiglia e tornare dopo', run: () => O(`Ti salvi, ma abbandoni i contadini. Non te lo perdoneranno facilmente.`, { c: -14, p: -12, s: -6 }, R('tl', 6, 'bad', ['village', 'fields'])) },
    { tag: 'Denaro', label: 'Trattare con il capo della banda', run: () => O(`Paghi un tributo per essere lasciato in pace. Non è molto diverso da una tassa, ma va a vantaggio di chi ti minaccia.`, { c: -10, s: -4 }, R('tl', 4, 'loot')) } ] }),
// Capitolo 3 (540): guerra, fame, malattie
st => ({ title: 'Soldati stranieri alla porta', kind: 'Richiesta', stakes: ['c', 'p', 's'],
  warn: `Si dice che una colonna di soldati stranieri stia attraversando la zona. Avranno fame.`,
  text: [`Da anni in Italia si combatte. Oggi una colonna di soldati stranieri si ferma alla tua villa: hanno fame e pretendono grano e cavalli. Per i tuoi contadini non conta chi vince la guerra. Conta cosa resta dopo il passaggio dei soldati.`],
  choices: [
    { tag: 'Denaro', label: 'Dare quello che chiedono', run: () => O(`I soldati prendono grano e cavalli e se ne vanno. Il granaio è mezzo vuoto, ma nessuno è stato ferito.`, { c: -16, p: -3, s: 2 }, { k: 'cart', dir: 'r' }) },
    { tag: 'Inganno', label: 'Nascondere parte delle scorte', run: st => st.p >= 45
        ? O(`I contadini tengono il segreto: nessuno ti tradisce. I soldati trovano poco e se ne vanno.`, { c: -6, p: 3 }, { k: 'cart', dir: 'r' }, NEED(st, 'p', 45))
        : O(`Qualcuno racconta ai soldati dove sono le scorte. Ti portano via tutto e puniscono il villaggio.`, { c: -20, p: -8, s: -4 }, R('r', 5, 'bad', ['village']), NEED(st, 'p', 45)) },
    { tag: 'Forza', label: 'Cacciarli con le armi', run: st => st.s >= 55
        ? O(`I tuoi uomini sono tanti e decisi. I soldati stranieri cercano un'altra villa meno difesa.`, { s: 6, p: 5, c: -3 }, R('r', 5, 'ok'), NEED(st, 's', 55))
        : O(`Sono più forti di te. Ti prendono quello che vogliono e bruciano parte del villaggio.`, { c: -18, p: -10, s: -10 }, R('r', 5, 'bad', ['village']), NEED(st, 's', 55)) } ] }),
st => ({ title: 'Inverno di fame', kind: 'Crisi', stakes: ['c', 'p'],
  warn: `La guerra ha lasciato molti campi senza semina. L'inverno sarà duro e il granaio è la cosa che conta.`,
  text: [`Per colpa della guerra molti campi non sono stati seminati. Dopo mesi di raccolti poveri le scorte si assottigliano e arrivano voci di malattie nei villaggi vicini. Le famiglie guardano il granaio.`],
  choices: [
    { tag: 'Prudenza', label: 'Dividere il grano in porzioni piccole per tutti', run: st => st.c >= 25
        ? O(`Il grano basta fino a primavera. Si mangia poco, ma nessuno muore di fame.`, { c: -6, p: -2 }, null, NEED(st, 'c', 25))
        : O(`Il grano non basta nemmeno così. Molti si ammalano e alcune famiglie se ne vanno.`, { c: -6, p: -12 }, null, NEED(st, 'c', 25)) },
    { tag: 'Aiuto', label: 'Dare grano ai malati e ai più poveri', run: () => O(`Salvi molte persone, ma il granaio si svuota in fretta. La gente non lo dimenticherà.`, { c: -12, p: 8 }) },
    { tag: 'Durezza', label: 'Mandare via le bocche inutili', run: () => O(`Il granaio regge, ma la gente non te lo perdona. Rimane la paura.`, { c: 6, p: -14 }) } ] }),
// Capitolo 4 (570)
st => ({ title: 'Arrivano i Longobardi', kind: 'Visita', stakes: ['r', 's'], enter: { k: 'messenger' },
  warn: `Un messo a cavallo sta arrivando da Pavia: parla a nome di un re.`,
  text: [`Un messo a cavallo arriva alla tua porta. Il re dei Longobardi, che governa da Pavia, vuole sapere da che parte stai. Per la prima volta dopo molto tempo qualcuno ti parla a nome di un potere più grande.`],
  choices: [
    { tag: 'Fedeltà', label: 'Giurare fedeltà al re', run: () => O(`Il re ti riconosce. Tu gli prometti aiuto, lui ti lascia la terra e il diritto di governarla.`, { r: 25, s: 8, c: -4 }) },
    { tag: 'Attesa', label: 'Prendere tempo', run: () => O(`Non dici né sì né no. Il messo riparte senza risposta.`, { r: 5 }) },
    { tag: 'Indipendenza', label: 'Rifiutare e restare indipendente', run: () => O(`Sei libero, per ora. Ma il re ricorda chi ha detto no.`, { r: -25, s: -6, p: 4 }) } ] }),
st => ({ title: 'Il tributo e il titolo', kind: 'Decisione', stakes: ['c', 'r'], enter: { k: 'messenger' },
  warn: `Il messo del re tornerà a chiedere un tributo in grano. Contano il granaio e il Favore del re.`,
  text: [`Il messo del re arriva a raccogliere un tributo in grano. Poi aggiunge: «Il re non può venire qui ogni mese. Per questo ti affida il governo di questa zona. Giudichi, difendi e riscuoti, in suo nome».`],
  choices: [
    { tag: 'Obbedienza', label: 'Accettare il titolo e pagare tutto il tributo', run: () => O(`Hai in mano poteri pubblici, ma sei un uomo del re. Il potere è appaltato: il re comanda per mezzo tuo.`, { c: -12, r: 15, s: 8 }, { k: 'cart' }) },
    { tag: 'Trattativa', label: 'Accettare il titolo e pagare meno', run: () => O(`Il messo si lamenta, ma accetta. Il re ha bisogno di te più di quanto tu ne abbia di lui.`, { c: -5, r: 5, s: 4 }, { k: 'cart' }) },
    { tag: 'Indipendenza', label: 'Rifiutare il titolo', run: () => O(`Resti libero, ma senza l'appoggio di nessuno.`, { r: -12, s: -6 }) } ] }),
// Capitolo 5 (700)
st => ({ title: 'Arrivano i monaci', kind: 'Richiesta', stakes: ['p', 'c'], enter: { k: 'monks' },
  warn: `Una piccola processione di monaci cammina verso le tue terre.`,
  text: [`Un gruppo di monaci chiede di fondare un monastero sulle tue terre. Copiano libri, pregano, curano i malati e insegnano a leggere.`],
  choices: [
    { tag: 'Dono', label: 'Donare loro un terreno', run: () => O(`I monaci ti benedicono. La Chiesa ha una rete stabile di monasteri: dove lo Stato è sparito, loro restano.`, { p: 8, c: -4, r: 4, chiesa: 1 }) },
    { tag: 'Affitto', label: 'Accettare solo in cambio di un affitto', run: () => O(`I monaci pagano un affitto in grano e si mettono al lavoro.`, { c: 6, p: 2, chiesa: 1 }) },
    { tag: 'Rifiuto', label: 'Rifiutare', run: () => O(`Vanno a chiedere ospitalità altrove. I contadini ne sono dispiaciuti.`, { p: -4 }) } ] }),
st => ({ title: 'Il vicino prepotente', kind: 'Minaccia', stakes: ['s', 'r'],
  warn: `Un signore vicino si è fatto un castello e manda messi minacciosi. Conta la Sicurezza, e il Favore del re se vuoi chiedere aiuto.`,
  scout: `Il suo castello è ancora mezzo finito. Con Sicurezza 50 o più lo respingi. Il re ti aiuta solo se hai Favore del re 50 o più.`,
  text: [`Un signore vicino si è fatto un castello e pretende un tributo dai tuoi contadini. Dice che altrimenti non li proteggerà.`],
  choices: [
    { tag: 'Denaro', label: 'Pagarlo', run: () => O(`Paghi, ma ora i tuoi contadini sanno che non sei tu a proteggerli.`, { c: -10, s: -4, p: -6 }, { k: 'cart', dir: 'r' }) },
    { tag: 'Forza', label: 'Combatterlo', run: st => st.s >= 50
        ? O(`I tuoi uomini sono pronti e il suo castello è mal difeso. Lo costringi a ritirarsi.`, { s: 8, p: 8, r: 4 }, R('r', 5, 'ok'), NEED(st, 's', 50))
        : O(`I tuoi uomini non sono abbastanza. Perdi la battaglia e parte del raccolto.`, { s: -15, c: -12 }, R('r', 5, 'part'), NEED(st, 's', 50)) },
    { tag: 'Fedeltà', label: 'Chiedere al re di intervenire', run: st => st.r >= 50
        ? O(`Il re ti ascolta e manda un messo che ti dà ragione. Ma ora gli devi un favore.`, { s: 10, r: -5 }, { k: 'messenger' }, NEED(st, 'r', 50))
        : O(`Il re non ti risponde: non gli sei abbastanza vicino. Sei solo.`, { s: -6, r: -3 }, null, NEED(st, 'r', 50)) } ] }),
// Capitolo 6 (800)
st => ({ title: 'Carlo Magno', kind: 'Visita', stakes: ['r', 'fort'], enter: { k: 'messenger' },
  warn: `Si dice che l'imperatore mandi un suo messo a controllare i territori. Fare bella figura conta: Difese e Favore del re.`,
  text: [`Nell'anno 800 il papa incorona Carlo Magno imperatore. Un messo dell'imperatore, il missus dominicus, viene a visitare il tuo territorio e ti fa domande.`],
  choices: [
    { tag: 'Fedeltà', label: 'Rinnovare il giuramento all\'imperatore', run: () => O(`Giuri di nuovo, con la mano sul Vangelo. Costa una cena per tutti, ma il messo riparte soddisfatto.`, { r: 15, c: -6 }) },
    { tag: 'Prestigio', label: 'Mostrargli le tue difese', run: st => st.fort >= 2
        ? O(`Il messo ammira il castello. «Un territorio ben difeso è un territorio fedele», dice.`, { r: 10, s: 5 }, null, `Difese ${st.fort}, ne servivano 2.`)
        : O(`Il messo non è molto colpito. Non hai molto da mostrare.`, { r: 2 }, null, `Difese ${st.fort}, ne servivano 2.`) },
    { tag: 'Inganno', label: 'Nascondere parte del raccolto', run: () => O(`Tieni più grano per te. Ma il messo è sospettoso.`, { c: 8, r: -10 }) } ] }),
st => st.vass >= 1
  ? ({ title: 'Il vassallo ambizioso', kind: 'Minaccia', stakes: ['r', 's'],
      warn: `Il tuo vassallo si è fatto costruire una torre e manda sempre meno grano. Conta il Favore del re.`,
      scout: `La torre del vassallo è quasi finita. Se hai Favore del re 50 o più, il re ti sostiene e lui si piega.`,
      text: [`Il tuo vassallo si è fatto costruire una torre e smette di mandarti il grano. Dice che è lui, ormai, a proteggere il villaggio.`],
      choices: [
        { tag: 'Autorità', label: 'Richiamarlo all\'ordine', run: st => st.r >= 50
            ? O(`Il re ti sostiene: il vassallo si piega. La tua autorità regge perché dietro di te c'è un potere più grande.`, { s: 6, r: -3, c: -3 }, null, NEED(st, 'r', 50))
            : O(`Senza l'appoggio del re il vassallo non ti ascolta. I tuoi uomini si dividono.`, { s: -10, p: -3 }, null, NEED(st, 'r', 50)) },
        { tag: 'Dono', label: 'Rinnovare il patto con un dono', run: () => O(`Un dono e una nuova promessa. Il vassallo resta con te, per ora.`, { c: -5, s: 4 }) },
        { tag: 'Lasciar fare', label: 'Lasciar correre', run: () => O(`Il vassallo diventa indipendente. Un fedele in meno, un rivale in più.`, { s: -6, vass: -1 }) } ] })
  : ({ title: 'Un vicino ti prende un villaggio', kind: 'Minaccia', stakes: ['s', 'r'],
      warn: `Un signore del posto sta spostando i confini. Nessun fedele presidia le tue terre lontane.`,
      scout: `Ha pochi uomini, ma buoni. Con Sicurezza 50 o più riprendi il villaggio. Il re ti aiuta se hai Favore del re 50 o più.`,
      text: [`Un signore del posto occupa un villaggio sul tuo confine. Nessun fedele lo presidiava per te.`],
      choices: [
        { tag: 'Forza', label: 'Riprenderlo con le armi', run: st => st.s >= 50
            ? O(`I tuoi uomini sono pronti. Riprendi il villaggio.`, { s: 6, p: 6, c: -6 }, R('r', 4, 'ok'), NEED(st, 's', 50))
            : O(`Non hai uomini a sufficienza. Perdi e il vicino si fa più forte.`, { s: -12, c: -10 }, R('r', 4, 'part'), NEED(st, 's', 50)) },
        { tag: 'Fedeltà', label: 'Chiedere aiuto al re', run: st => st.r >= 50
            ? O(`Il re manda un messo e il vicino cede. Ma ora gli devi un favore.`, { s: 6, r: -6 }, { k: 'messenger' }, NEED(st, 'r', 50))
            : O(`Il re non ti aiuta: non gli sei abbastanza vicino.`, { s: -6, r: -3 }, null, NEED(st, 'r', 50)) },
        { tag: 'Rinuncia', label: 'Lasciarglielo', run: () => O(`Perdi terra e prestigio. I contadini dei villaggi vicini si chiedono se sei ancora capace di proteggerli.`, { p: -8, s: -4 }) } ] }),
// Capitolo 7 (840): l'impero si divide
st => ({ title: 'I nipoti di Carlo Magno', kind: 'Decisione', stakes: ['r'], enter: { k: 'messenger' },
  warn: `Dal nord arrivano notizie: l'impero è stato diviso tra tre fratelli, e tutti e tre chiedono fedeltà.`,
  text: [`Un messo ti porta la notizia: i nipoti di Carlo Magno si sono divisi l'impero in tre parti. Uno di loro, Lotario, regna anche sull'Italia. Devi decidere a chi giurare fedeltà. Ognuno dei tre re è lontano, e ognuno ti chiederà qualcosa.`],
  choices: [
    { tag: 'Fedeltà', label: 'Giurare fedeltà a Lotario, il re dell\'Italia', run: () => O(`Lotario è il più vicino: ti riconosce e ti lascia governare in suo nome.`, { r: 18, c: -5, s: 4 }) },
    { tag: 'Prudenza', label: 'Mandare doni a tutti e tre', run: () => O(`Costa caro, ma nessuno dei tre ti considera un nemico.`, { r: 6, c: -12 }) },
    { tag: 'Indipendenza', label: 'Non giurare a nessuno', run: () => O(`Sei libero, ma nessun re ti difenderà. I re litigano tra loro, ma i loro messi ricordano chi ha giurato.`, { r: -18, s: -4, p: 3 }) } ] }),
st => ({ title: 'Il re chiede dei soldati', kind: 'Richiesta', stakes: ['s', 'r', 'c'],
  warn: `Il re prepara una campagna militare e chiederà uomini d'arme ai suoi fedeli. Le Guardie contano.`,
  text: [`Un messo del re arriva a chiedere uomini d'arme per una campagna. Chi ha ricevuto terre in cambio di fedeltà deve aiutare con le armi quando il re lo chiede. È un dovere del vassallo.`],
  choices: [
    { tag: 'Obbedienza', label: 'Mandare i tuoi uomini', run: st => st.guardie >= 2
        ? O(`Mandi i tuoi uomini migliori. Tornano con prestigio e qualche bottino.`, { r: 14, s: -6, c: 4, guardie: -1 }, null, NEED(st, 'guardie', 2))
        : O(`Hai pochi uomini: ne mandi quasi tutti e la tua zona resta scoperta.`, { r: 10, s: -14, guardie: -1 }, null, NEED(st, 'guardie', 2)) },
    { tag: 'Denaro', label: 'Pagare una somma al posto dei soldati', run: () => O(`Il re accetta, ma si aspettava uomini, non monete.`, { r: 4, c: -12 }) },
    { tag: 'Rifiuto', label: 'Rifiutare: devi difendere la tua terra', run: () => O(`Il re non è contento. Un fedele che non risponde alla chiamata non è un buon fedele.`, { r: -14, s: 3 }) } ] }),
// Capitolo 8 (900)
st => ({ title: 'Gli Ungari', kind: 'Minaccia', stakes: ['fort', 's', 'c'],
  warn: `Cavalieri velocissimi vengono dalle pianure dell'est e attaccano i villaggi del nord. Contano le Difese.`,
  scout: `Sono cavalieri veloci. Solo un castello di pietra (Difese 3) li ferma del tutto. Con una torre (Difese 2) salvi la gente ma non i campi.`,
  text: [`Cavalieri velocissimi, venuti dalle pianure dell'Ungheria, attaccano il nord dell'Italia. Il re è lontano e non può aiutarti. Non esiste un esercito che ti difenda. Solo tu.`],
  choices: [
    { tag: 'Forza', label: 'Chiudere tutti dentro il castello', run: st => st.fort >= 3
        ? O(`Mura, torri e fossato reggono. Gli Ungari bruciano qualche campo e se ne vanno. Il castello ti ha salvato la gente.`, { s: 8, p: 10 }, R('r', 6, 'ok', [], 'rider'), `Difese ${st.fort}, ne servivano 3.`)
        : st.fort === 2
          ? O(`La torre resiste, ma non c'è posto per tutti. Perdi parte del raccolto e qualche vita.`, { c: -12, p: -3 }, R('r', 6, 'part', ['fields'], 'rider'), `Difese ${st.fort}, ne servivano 3.`)
          : O(`Le difese sono troppo deboli. Gli Ungari entrano e portano via quasi tutto.`, { c: -22, p: -14, s: -10 }, R('r', 6, 'bad', ['village', 'fields'], 'rider'), `Difese ${st.fort}, ne servivano 3.`) },
    { tag: 'Fuga', label: 'Fuggire nei boschi con i contadini', run: () => O(`Vi salvate, ma i campi vengono bruciati.`, { c: -12, p: -4, s: -6 }, R('r', 6, 'bad', ['fields'], 'rider')) },
    { tag: 'Denaro', label: 'Pagare un tributo agli Ungari', run: () => O(`Pagando, gli Ungari passano oltre. Il grano che dai oggi è ciò che mancherà all'inverno.`, { c: -14, s: -4, r: -4 }, { k: 'cart', dir: 'r' }) } ] }),
st => ({ title: 'La terra per tuo figlio', kind: 'Decisione', stakes: ['r', 's'],
  warn: `Stai invecchiando e pensi a chi erediterà le tue terre. Contano il Favore del re e la tua forza.`,
  text: [`Stai invecchiando e vuoi che le terre passino a tuo figlio. Un tempo erano un beneficio dato dal re a una sola persona. Ora i signori vogliono che diventino ereditarie.`],
  choices: [
    { tag: 'Fedeltà', label: 'Chiedere al re di confermare l\'eredità', run: st => st.r >= 45
        ? O(`Il re conferma: il feudo è della tua famiglia. È uno dei passi che trasformano il feudo in una proprietà ereditaria.`, { r: -5, s: 6, p: 4 }, { k: 'messenger' }, NEED(st, 'r', 45))
        : O(`Il re non si fida di te. Rimanda la decisione e il tuo posto è incerto.`, { r: -8, s: -4 }, null, NEED(st, 'r', 45)) },
    { tag: 'Forza', label: 'Dichiarare che è vostro e basta', run: st => st.s >= 55
        ? O(`Nessuno ha la forza di contraddirti. Il re non è contento, ma accetta.`, { r: -15, s: 6, p: 6 }, null, NEED(st, 's', 55))
        : O(`Il re manda uomini per metterti in riga e tu non hai le forze per resistere.`, { r: -15, s: -12 }, null, NEED(st, 's', 55)) },
    { tag: 'Attesa', label: 'Lasciare le cose come stanno', run: () => O(`Tuo figlio erediterà il tuo posto, o forse no. Nessuno lo sa.`, { p: -2 }) } ] })
];
