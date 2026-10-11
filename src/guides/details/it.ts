// Italiano: sezione «Approfondimento» di ogni strumento. {tool:id} diventa un link e {ui:…} il testo dell'interfaccia.
import type { ToolDetailSet } from '../types';

export const it: ToolDetailSet = {
  title: 'Approfondimento: {tool}',
  sections: {
    merge: [
      {
        title: 'Quando usarlo',
        blocks: [
          { list: [
            'Quando una candidatura, una domanda di borsa di studio o di mutuo chiede «tutti i documenti in un unico PDF»',
            'Per raccogliere in un solo file gli estratti conto o le fatture che arrivano ogni mese',
            'Per unire i capitoli di una relazione scritti da persone diverse',
          ] },
        ],
      },
      {
        title: 'Come funziona',
        blocks: [
          'Le pagine di ogni PDF vengono copiate così come sono nel nuovo file, senza essere ridisegnate. Per questo il testo resta selezionabile e ricercabile e le immagini mantengono la loro qualità. L’elenco mostra l’anteprima della prima pagina e il numero di pagine di ogni file, così puoi controllarne il contenuto prima di ordinarli trascinandoli.',
        ],
      },
      {
        title: 'Da sapere',
        blocks: [
          { list: [
            'Aggiungendo un numero a due cifre all’inizio dei nomi (01_, 02_…) i file arrivano già in ordine.',
            'I PDF protetti da password si possono aggiungere digitando la loro password; il file unito non avrà password.',
            'Per togliere o ruotare singole pagine dopo, invia il risultato a {tool:organize} con «{ui:ui.continueWith}».',
            'Se le scansioni rendono il file pesante, prosegui con {tool:compress}.',
          ] },
        ],
      },
    ],
    split: [
      {
        title: 'Quando usarlo',
        blocks: [
          { list: [
            'Per separare una scansione in blocco in un file per persona o per pratica',
            'Per inviare un PDF grande in più parti a causa di un limite di dimensione',
            'Per dividere un libro o delle dispense in capitoli',
          ] },
        ],
      },
      {
        title: 'Tre modi per dividere',
        blocks: [
          { table: {
            head: ['Modalità', 'Esempio', 'Risultato'],
            rows: [
              ['{ui:tools.split.ui.modeRanges}', '1-3, 4-6, 7-', 'Un PDF per intervallo («7-» va dalla pagina 7 alla fine)'],
              ['{ui:tools.split.ui.modeEvery}', '2', 'Un nuovo PDF ogni due pagine'],
              ['{ui:tools.split.ui.modeEach}', '-', 'Un PDF per pagina'],
            ],
          } },
          'Prima di dividere, lo strumento indica quanti file verranno creati. Se sono più di uno, puoi scaricarli insieme in un unico ZIP.',
        ],
      },
      {
        title: 'Da sapere',
        blocks: [
          'Se ti servono solo alcune parti, {tool:extract-pages} è più veloce. Le pagine vengono copiate senza modifiche, quindi i file divisi hanno esattamente la qualità dell’originale.',
        ],
      },
    ],
    organize: [
      {
        title: 'Quando usarlo',
        blocks: [
          'È lo strumento per i documenti che richiedono più correzioni insieme: scansioni in disordine, scansioni fronte-retro con retro bianchi o documenti da stampare in cui va inserita una pagina vuota.',
        ],
      },
      {
        title: 'Cosa puoi fare',
        blocks: [
          { list: [
            'Trascinare le pagine per cambiarne l’ordine',
            'Selezionare più pagine e ruotarle o eliminarle insieme (Maiusc + clic seleziona un intervallo)',
            'Duplicare pagine e inserire pagine vuote',
            'Aggiungere un altro PDF e mescolarne le pagine',
            'Annullare e ripetere ogni modifica',
          ] },
          'Non viene salvato nulla finché non premi «{ui:tools.organize.ui.action}», quindi puoi provare in tranquillità.',
        ],
      },
      {
        title: 'Da sapere',
        blocks: [
          'Se devi solo ruotare, {tool:rotate} è più semplice; per eliminare soltanto, {tool:delete-pages}. I documenti di centinaia di pagine impiegano un po’ a mostrare le anteprime: separare prima la parte che ti serve con {tool:split} fa risparmiare tempo.',
        ],
      },
    ],
    rotate: [
      {
        title: 'Quando usarlo',
        blocks: [
          'Per pagine finite capovolte nello scanner, tabelle orizzontali in un documento verticale o pagine coricate in un PDF creato con foto del telefono.',
        ],
      },
      {
        title: 'Come funziona',
        blocks: [
          'Ogni clic ruota la pagina di 90° in senso orario, mentre «{ui:tools.rotate.ui.rotateAllLeft}» e «{ui:tools.rotate.ui.rotateAllRight}» ruotano tutte le pagine insieme. Cambia solo l’orientamento della pagina; nulla viene ridisegnato, quindi la qualità resta intatta e il testo selezionabile.',
        ],
      },
      {
        title: 'Da sapere',
        blocks: [
          'Se devi anche riordinare o eliminare pagine, {tool:organize} fa tutto in un solo passaggio. La «rotazione della vista» dei lettori PDF di solito non viene salvata nel file: per correggere l’orientamento in modo permanente, salva il risultato con questo strumento.',
        ],
      },
    ],
    'delete-pages': [
      {
        title: 'Quando usarlo',
        blocks: [
          { list: [
            'Per togliere i retro bianchi di una scansione fronte-retro',
            'Per eliminare la copertina o una pagina di istruzioni prima di consegnare un documento',
            'Per togliere pagine di foto inutili e alleggerire il file',
          ] },
        ],
      },
      {
        title: 'Come funziona',
        blocks: [
          'Fai clic sulle pagine da eliminare; il pulsante mostra quante verranno tolte. Le pagine rimanenti vengono copiate senza modifiche in un nuovo file, quindi la qualità non cambia. Lo strumento impedisce di eliminare per errore tutte le pagine.',
        ],
      },
      {
        title: 'Da sapere',
        blocks: [
          'Se tieni molte meno pagine di quante ne togli, seleziona piuttosto quelle da conservare in {tool:extract-pages}: servono meno clic.',
        ],
      },
    ],
    'extract-pages': [
      {
        title: 'Quando usarlo',
        blocks: [
          'Per inviare poche pagine di una lunga relazione, conservare solo la pagina delle firme di un contratto o estrarre da un libro in PDF le pagine dei compiti.',
        ],
      },
      {
        title: 'Due modi per salvare',
        blocks: [
          { list: [
            '{ui:tools.extract-pages.ui.outputSingle}: le pagine scelte, nel loro ordine originale, in un unico nuovo file.',
            '{ui:tools.extract-pages.ui.outputSeparate}: ogni pagina scelta come PDF a sé, scaricabili insieme in uno ZIP.',
          ] },
          'I dati delle pagine vengono copiati senza modifiche, quindi selezione del testo, link e qualità delle immagini sono identici all’originale.',
        ],
      },
      {
        title: 'Da sapere',
        blocks: [
          'Ti servono immagini invece di PDF? Usa {tool:pdf-to-jpg}. Ma se vuoi solo passare una parte di un documento, le pagine estratte in PDF sono più nitide e leggere delle immagini.',
        ],
      },
    ],
    compress: [
      {
        title: 'Quando usarlo',
        blocks: [
          'Quando un’e-mail o un modulo di caricamento rifiuta un file perché troppo grande, oppure prima di archiviare scansioni e PDF pieni di foto. I documenti di solo testo sono già leggeri e si riducono pochissimo.',
        ],
      },
      {
        title: 'Livelli di compressione',
        blocks: [
          { table: {
            head: ['Livello', 'Lato maggiore dell’immagine', 'Qualità JPEG', 'Ideale per'],
            rows: [
              ['{ui:tools.compress.ui.levelLow}', '2.400 px', '82%', 'Stampa, materiale in cui contano le foto'],
              ['{ui:tools.compress.ui.levelMedium}', '1.700 px', '68%', 'Allegati e-mail e la maggior parte degli invii'],
              ['{ui:tools.compress.ui.levelHigh}', '1.200 px', '50%', 'Limiti di dimensione molto severi'],
            ],
          } },
          'Vengono ricodificate solo le immagini del PDF; testo e grafica vettoriale restano intatti, quindi il testo rimane selezionabile e ricercabile. Le immagini che non si ridurrebbero almeno del 10% vengono lasciate com’erano per proteggerne la qualità.',
        ],
      },
      {
        title: 'Informazioni su «{ui:tools.compress.ui.rasterize}»',
        blocks: [
          'Quando la compressione delle immagini non basta, questa opzione ridisegna ogni pagina come immagine a 150, 120 o 96 DPI a seconda del livello. Con le scansioni è molto efficace, ma il testo non si potrà più selezionare né cercare: usala per copie che devono solo essere lette.',
        ],
      },
      {
        title: 'Da sapere',
        blocks: [
          { list: [
            'Non ricomprimere un file già compresso: perde solo qualità. Per salire di livello, riparti dall’originale.',
            'Togliere prima le pagine inutili con {tool:delete-pages} rende la compressione più efficace.',
          ] },
        ],
      },
    ],
    'jpg-to-pdf': [
      {
        title: 'Quando usarlo',
        blocks: [
          'Per trasformare foto di scontrini, moduli o appunti scritti a mano fatte con il telefono in un unico documento da consegnare o conservare. Supporta immagini JPG, PNG, WebP, GIF e BMP e raddrizza le foto in base all’orientamento EXIF.',
        ],
      },
      {
        title: 'Come scegliere le impostazioni',
        blocks: [
          { table: {
            head: ['Impostazione', 'Opzioni', 'Consigliato'],
            rows: [
              ['{ui:tools.jpg-to-pdf.ui.pageSize}', '{ui:tools.jpg-to-pdf.ui.sizeFit} / A4 / Letter', 'A4 per stampare e consegnare; {ui:tools.jpg-to-pdf.ui.sizeFit} per archiviare foto'],
              ['{ui:tools.jpg-to-pdf.ui.orientation}', '{ui:tools.jpg-to-pdf.ui.orientAuto} / {ui:tools.jpg-to-pdf.ui.orientPortrait} / {ui:tools.jpg-to-pdf.ui.orientLandscape}', '{ui:tools.jpg-to-pdf.ui.orientAuto} nella maggior parte dei casi'],
              ['{ui:tools.jpg-to-pdf.ui.margin}', '{ui:tools.jpg-to-pdf.ui.marginNone} / {ui:tools.jpg-to-pdf.ui.marginSmall} / {ui:tools.jpg-to-pdf.ui.marginLarge}', '{ui:tools.jpg-to-pdf.ui.marginSmall} per la stampa; {ui:tools.jpg-to-pdf.ui.marginNone} per lo schermo'],
            ],
          } },
          'Con A4 o Letter ogni foto viene adattata alla pagina mantenendo le proporzioni, così tutte le pagine hanno la stessa dimensione anche se le foto sono diverse.',
        ],
      },
      {
        title: 'Da sapere',
        blocks: [
          { list: [
            'Luce intensa senza ombre e telefono parallelo al foglio fanno una grande differenza. Spegni il flash: la carta lucida lo riflette.',
            'Ogni foto del telefono pesa diversi MB, quindi il PDF cresce in fretta. Dalla schermata del risultato puoi passarlo subito a {tool:compress}.',
          ] },
        ],
      },
    ],
    'pdf-to-jpg': [
      {
        title: 'Quando usarlo',
        blocks: [
          'Per pubblicare una pagina di un PDF su un blog o sui social, inserirla come immagine in una presentazione o in un documento, oppure inviarla in chat a chi fatica ad aprire i PDF.',
        ],
      },
      {
        title: 'Scegliere risoluzione e formato',
        blocks: [
          { table: {
            head: ['Risoluzione', 'Pagina A4 in pixel', 'Uso'],
            rows: [
              ['{ui:tools.pdf-to-jpg.ui.dpiLow}', 'circa 595 × 842', 'Anteprime, condivisione rapida'],
              ['{ui:tools.pdf-to-jpg.ui.dpiMedium}', 'circa 1.240 × 1.754', 'Pubblicazione sul web, lettura a schermo'],
              ['{ui:tools.pdf-to-jpg.ui.dpiHigh}', 'circa 2.480 × 3.508', 'Stampa, ingrandire caratteri piccoli'],
            ],
          } },
          'Raddoppiare i DPI raddoppia larghezza e altezza: l’immagine ha quattro volte i pixel e il file cresce più o meno di altrettanto. Scegli PNG per pagine di testo e tabelle e JPG per pagine ricche di foto. Puoi convertire solo le pagine selezionate e scaricare più immagini in uno ZIP.',
        ],
      },
      {
        title: 'Da sapere',
        blocks: [
          'In un’immagine il testo non si può più selezionare né cercare. Se vuoi solo passare una parte di un documento, estrai piuttosto le pagine in PDF con {tool:extract-pages}.',
        ],
      },
    ],
    watermark: [
      {
        title: 'Quando usarlo',
        blocks: [
          { list: [
            'Per contrassegnare documenti interni come «Riservato» o «Bozza»',
            'Per indicare sulla copia di un documento d’identità lo scopo per cui viene consegnata, così che non possa essere riutilizzata facilmente',
            'Per aggiungere il tuo logo a un portfolio o a delle dispense',
          ] },
        ],
      },
      {
        title: 'Cosa puoi impostare',
        blocks: [
          'Scegli un testo o un’immagine del logo e regola colore, dimensione, opacità e angolo. «{ui:tools.watermark.ui.layoutCenter}» posiziona un solo marchio al centro della pagina, mentre «{ui:tools.watermark.ui.layoutTile}» lo ripete su tutta la pagina. Applicalo a tutte le pagine o solo a quelle indicate e controlla il risultato nell’anteprima della prima pagina.',
        ],
      },
      {
        title: 'Da sapere',
        blocks: [
          'Per scoraggiare le fughe di documenti, una disposizione «{ui:tools.watermark.ui.layoutTile}» con il 20–30% di opacità è difficile da ritagliare. Una filigrana non nasconde il contenuto: se nessun altro deve leggere il file, aggiungi anche una password di apertura con {tool:protect}.',
        ],
      },
    ],
    'page-numbers': [
      {
        title: 'Quando usarlo',
        blocks: [
          'Per fascicoli di candidatura uniti, relazioni da stampare e rilegare e materiali di riunione in cui bisogna poter dire «andate a pagina 12».',
        ],
      },
      {
        title: 'Cosa puoi impostare',
        blocks: [
          'Posizione (sinistra, centro o destra, in alto o in basso), formato del numero, numero iniziale, dimensione del testo e margine. Per saltare la copertina e iniziare la numerazione dalla prima pagina di contenuto, scegli «{ui:tools.page-numbers.ui.pagesCustom}» per le pagine, indica dalla pagina 2 in poi e lascia il numero iniziale a 1. Controlla l’anteprima prima di applicare.',
        ],
      },
      {
        title: 'Da sapere',
        blocks: [
          'Numera per ultimo. Se riordini le pagine dopo, i numeri si mescolano: stabilisci prima l’ordine con {tool:merge} o {tool:organize}.',
        ],
      },
    ],
    protect: [
      {
        title: 'Quando usarlo',
        blocks: [
          'Per inviare buste paga, contratti o documenti medici e finanziari che deve leggere solo il destinatario.',
        ],
      },
      {
        title: 'Password e autorizzazioni',
        blocks: [
          'L’intero documento viene cifrato con AES-256 e non si può aprire senza la password. Le autorizzazioni facoltative controllano stampa, copia, modifica e annotazioni, ma sono indicazioni che i lettori PDF sono invitati a rispettare, non una vera cifratura.',
          'La cifratura avviene nel tuo browser e la password non viene salvata da nessuna parte. Questo significa anche che, se la dimentichi, nessuno, nemmeno noi, può recuperarla.',
        ],
      },
      {
        title: 'Da sapere',
        blocks: [
          { list: [
            'Usa una password lunga, di almeno 12 caratteri, ed evita date di nascita o numeri di telefono.',
            'Invia il file via e-mail e la password via SMS o per telefono.',
          ] },
        ],
      },
    ],
    unlock: [
      {
        title: 'Quando usarlo',
        blocks: [
          'Per conservare i tuoi documenti protetti, come gli estratti conto mensili, senza digitare ogni volta la password, oppure per togliere i blocchi di stampa e copia dai tuoi file.',
        ],
      },
      {
        title: 'Come funziona',
        blocks: [
          'Quando scegli un file, lo strumento indica prima di tutto che tipo di protezione ha. I file con password di apertura richiedono la password che conosci; quelli con sole restrizioni delle autorizzazioni si sbloccano senza password. Se un file non è protetto, ti avvisa che puoi usarlo così com’è.',
        ],
      },
      {
        title: 'Da sapere',
        blocks: [
          'I file di cui non conosci la password non si possono sbloccare: lo strumento non indovina le password. Rimuovere la protezione dal documento di qualcun altro senza permesso può violare il diritto d’autore o un accordo, quindi usalo solo sui tuoi file o su quelli che sei autorizzato a modificare.',
        ],
      },
    ],
  },
};
