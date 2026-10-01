import type { LegalText } from './types';

export const it: LegalText = {
  about: [
    {
      blocks: [
        '{site} è un insieme di strumenti PDF gratuiti che chiunque può usare in tutta tranquillità. Basta un browser, senza installare nulla e senza creare un account, per unire, dividere, riordinare, comprimere e convertire file PDF.',
      ],
    },
    {
      title: 'Strumenti PDF che non caricano mai i tuoi file',
      blocks: [
        'La maggior parte dei servizi PDF online carica i file sui propri server. {site} usa WebAssembly e le tecnologie moderne del browser per eseguire <strong>tutta l’elaborazione sul tuo dispositivo</strong>. Contratti, certificati e copie di documenti d’identità non lasciano mai il tuo computer, e non c’è da aspettare caricamenti o download.',
      ],
    },
    { title: 'Strumenti', blocks: ['{tools}'] },
    {
      title: 'Come si sostiene il sito',
      blocks: [
        'Tutti gli strumenti sono gratuiti. Il sito si sostiene con gli annunci mostrati nelle sue pagine. Poiché i file non vengono elaborati sui server, i costi di gestione restano bassi, quindi non ci sono limiti di utilizzo né di dimensione dei file.',
      ],
    },
    { title: 'Open source', blocks: ['Questo servizio è realizzato con i seguenti progetti open source:', '{opensource}'] },
    { title: 'Contatti', blocks: ['{contact}'] },
  ],
  privacy: [
    {
      blocks: ['{site} («il sito») rispetta la tua privacy. Questa informativa spiega quali informazioni tratta il sito e in che modo.'],
    },
    {
      title: '1. I tuoi file',
      blocks: [
        'I file PDF e le immagini vengono <strong>elaborati interamente sul tuo dispositivo, all’interno del browser. Non vengono mai caricati sui nostri server né condivisi con terzi.</strong> I dati di lavoro esistono solo nella memoria del browser e spariscono quando chiudi la pagina. Se usi «Continua con», il file risultante viene conservato nell’archivio interno del browser (IndexedDB) per un massimo di 10 minuti, così lo strumento successivo può aprirlo; anche questo non viene inviato da nessuna parte.',
      ],
    },
    {
      title: '2. Informazioni raccolte',
      blocks: [
        'Il sito non prevede account e non ti chiede mai nome o recapiti. Tuttavia, le seguenti informazioni possono essere generate automaticamente e trattate dai fornitori di hosting, analisi e pubblicità:',
        {
          list: [
            'Log di accesso (indirizzo IP, orario della visita, pagine visitate), informazioni sul browser e sul dispositivo',
            'Cookie e identificatori pubblicitari (quando vengono mostrati annunci)',
          ],
        },
      ],
    },
    {
      title: '3. Cookie e pubblicità',
      blocks: [
        'Il sito può mostrare annunci di Google AdSense per coprire i costi di gestione. I fornitori terzi, tra cui Google, usano cookie per pubblicare annunci in base alle tue visite precedenti a questo o ad altri siti web. L’uso dei cookie pubblicitari consente a Google e ai suoi partner di mostrare annunci in base alle tue visite a questo e ad altri siti su Internet.',
        {
          list: [
            'Puoi disattivare la pubblicità personalizzata nelle <a href="https://adssettings.google.com" rel="noopener" target="_blank">Impostazioni annunci di Google</a>.',
            'Puoi disattivare i cookie dei fornitori terzi per la pubblicità personalizzata su <a href="https://www.aboutads.info/choices/" rel="noopener" target="_blank">www.aboutads.info</a>.',
            'Per saperne di più consulta <a href="https://policies.google.com/technologies/partner-sites" rel="noopener" target="_blank">In che modo Google utilizza le informazioni dei siti o delle app che utilizzano i suoi servizi</a>.',
            'Puoi bloccare i cookie nelle impostazioni del browser; gli strumenti PDF continuano a funzionare anche senza.',
          ],
        },
      ],
    },
    {
      title: '4. Statistiche',
      blocks: [
        'Per migliorare il servizio, il sito può raccogliere statistiche sulle visite con Cloudflare Web Analytics (senza cookie) o Google Analytics. Queste statistiche sono usate solo in forma aggregata e non ti identificano.',
      ],
    },
    {
      title: '5. Condivisione',
      blocks: [
        'Non vendiamo né condividiamo i tuoi dati personali. Il nostro fornitore di hosting (ad esempio Cloudflare) e i fornitori di pubblicità o analisi possono trattare le informazioni della sezione 2 secondo le proprie informative sulla privacy per fornire i loro servizi.',
      ],
    },
    {
      title: '6. Conservazione',
      blocks: [
        'Non conserviamo direttamente i tuoi dati personali. Le informazioni trattate da fornitori terzi vengono conservate secondo le loro politiche.',
      ],
    },
    {
      title: '7. I tuoi diritti',
      blocks: [
        'Puoi eliminare o bloccare i cookie in qualsiasi momento dalle impostazioni del browser e contattarci per qualsiasi domanda o richiesta sulla privacy.',
      ],
    },
    { title: '8. Minori', blocks: ['Il sito non raccoglie consapevolmente dati personali di minori.'] },
    { title: '9. Contatti', blocks: ['{contact}'] },
    { title: '10. Modifiche', blocks: ['Questa informativa è in vigore dal {date}. Eventuali modifiche saranno pubblicate in questa pagina.'] },
  ],
  terms: [
    { title: '1. Ambito', blocks: ['I presenti termini regolano l’uso degli strumenti PDF offerti da {site} («il sito»).'] },
    {
      title: '2. Il servizio',
      blocks: [
        'Il sito offre strumenti gratuiti per unire, dividere, organizzare, comprimere, convertire, aggiungere filigrane, proteggere e sbloccare file PDF. Tutta l’elaborazione avviene nel browser e i tuoi file non vengono mai caricati.',
      ],
    },
    {
      title: '3. Le tue responsabilità',
      blocks: [
        {
          list: [
            'Elabora solo file che hai il diritto di usare.',
            'Non usare il servizio per violare il diritto d’autore, la privacy o altri diritti di terzi.',
            'Usa lo strumento di sblocco solo su documenti che ti appartengono o che sei autorizzato a modificare.',
            'Non interferire con il normale funzionamento del servizio.',
          ],
        },
      ],
    },
    {
      title: '4. Esclusione di responsabilità',
      blocks: [
        {
          list: [
            'Il servizio è fornito «così com’è», senza garanzie di accuratezza, completezza o idoneità a uno scopo specifico.',
            'Conserva sempre una copia dei tuoi file originali.',
            'Nei limiti consentiti dalla legge, il sito non è responsabile di perdite di dati o altri danni derivanti dall’uso del servizio.',
          ],
        },
      ],
    },
    { title: '5. Pubblicità', blocks: ['Il sito può mostrare annunci pubblicitari per sostenere il proprio funzionamento.'] },
    {
      title: '6. Modifiche al servizio',
      blocks: ['Il sito può modificare, sospendere o interrompere in tutto o in parte il servizio in qualsiasi momento.'],
    },
    { title: '7. Legge applicabile', blocks: ['I presenti termini sono regolati dalla legge della Repubblica di Corea.'] },
    { title: '8. Data di entrata in vigore', blocks: ['I presenti termini sono in vigore dal {date}.'] },
  ],
  contact: {
    about: 'Suggerimenti, segnalazioni di errori e proposte di collaborazione: {email}',
    privacy: 'Domande sulla privacy: {email}',
    none: 'Per qualsiasi domanda, contatta il gestore del sito.',
  },
  listSeparator: ', ',
};
