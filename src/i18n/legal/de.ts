import type { LegalText } from './types';

export const de: LegalText = {
  about: [
    {
      blocks: [
        '{site} ist eine Sammlung kostenloser PDF-Tools, die jeder bedenkenlos nutzen kann. Nur mit einem Webbrowser – ohne Installation und ohne Konto – können Sie PDF-Dateien zusammenfügen, teilen, neu anordnen, komprimieren und umwandeln.',
      ],
    },
    {
      title: 'PDF-Tools, die Ihre Dateien nie hochladen',
      blocks: [
        'Die meisten Online-PDF-Dienste laden Ihre Dateien auf ihre Server hoch. {site} nutzt WebAssembly und moderne Browsertechnik, um <strong>die gesamte Verarbeitung auf Ihrem eigenen Gerät</strong> durchzuführen. Verträge, Bescheinigungen und Ausweiskopien verlassen nie Ihren Computer, und Sie müssen nicht auf Uploads oder Downloads warten.',
      ],
    },
    { title: 'Tools', blocks: ['{tools}'] },
    {
      title: 'Finanzierung',
      blocks: [
        'Alle Tools sind kostenlos. Die Seite finanziert sich durch die Werbung auf ihren Seiten. Da Dateien nicht auf Servern verarbeitet werden, bleiben die Betriebskosten niedrig – deshalb gibt es keine Grenzen bei Nutzung oder Dateigröße.',
      ],
    },
    { title: 'Open Source', blocks: ['Dieser Dienst basiert auf folgenden Open-Source-Projekten:', '{opensource}'] },
    { title: 'Kontakt', blocks: ['{contact}'] },
  ],
  privacy: [
    {
      blocks: ['{site} („die Website“) respektiert Ihre Privatsphäre. Diese Erklärung beschreibt, welche Informationen die Website verarbeitet und wie.'],
    },
    {
      title: '1. Ihre Dateien',
      blocks: [
        'PDF- und Bilddateien werden <strong>vollständig auf Ihrem Gerät in Ihrem Webbrowser verarbeitet. Sie werden nie auf unsere Server hochgeladen oder an Dritte weitergegeben.</strong> Arbeitsdaten existieren nur im Arbeitsspeicher des Browsers und verschwinden, wenn Sie die Seite schließen. Wenn Sie „Weiter mit“ verwenden, wird die Ergebnisdatei bis zu 10 Minuten im internen Speicher Ihres Browsers (IndexedDB) abgelegt, damit das nächste Tool sie öffnen kann; auch sie wird nirgendwohin gesendet.',
      ],
    },
    {
      title: '2. Erhobene Informationen',
      blocks: [
        'Die Website hat keine Benutzerkonten und fragt nie nach Ihrem Namen oder Ihren Kontaktdaten. Folgende Informationen können jedoch automatisch entstehen und von Hosting-, Analyse- und Werbeanbietern verarbeitet werden:',
        {
          list: [
            'Zugriffsprotokolle (IP-Adresse, Zeitpunkt des Besuchs, besuchte Seiten), Browser- und Geräteinformationen',
            'Cookies und Werbe-IDs (wenn Werbung angezeigt wird)',
          ],
        },
      ],
    },
    {
      title: '3. Cookies und Werbung',
      blocks: [
        'Die Website kann Google-AdSense-Anzeigen schalten, um ihre Betriebskosten zu decken. Drittanbieter, darunter Google, verwenden Cookies, um Anzeigen auf Grundlage Ihrer früheren Besuche auf dieser oder anderen Websites zu schalten. Mithilfe von Werbe-Cookies können Google und seine Partner Anzeigen auf Grundlage Ihrer Besuche auf dieser und anderen Websites im Internet schalten.',
        {
          list: [
            'Personalisierte Werbung können Sie in den <a href="https://adssettings.google.com" rel="noopener" target="_blank">Google-Anzeigeneinstellungen</a> deaktivieren.',
            'Cookies von Drittanbietern für personalisierte Werbung können Sie unter <a href="https://www.aboutads.info/choices/" rel="noopener" target="_blank">www.aboutads.info</a> deaktivieren.',
            'Weitere Informationen finden Sie unter <a href="https://policies.google.com/technologies/partner-sites" rel="noopener" target="_blank">Wie Google Daten von Websites oder Apps verwendet, die Google-Dienste nutzen</a>.',
            'Sie können Cookies in den Browsereinstellungen blockieren; die PDF-Tools funktionieren auch ohne sie.',
          ],
        },
      ],
    },
    {
      title: '4. Webanalyse',
      blocks: [
        'Zur Verbesserung des Dienstes kann die Website Besuchsstatistiken mit Cloudflare Web Analytics (ohne Cookies) oder Google Analytics erfassen. Diese Statistiken werden nur zusammengefasst verwendet und identifizieren Sie nicht.',
      ],
    },
    {
      title: '5. Weitergabe',
      blocks: [
        'Wir verkaufen Ihre personenbezogenen Daten nicht und geben sie nicht weiter. Unser Hosting-Anbieter (z. B. Cloudflare) sowie Werbe- und Analyseanbieter können die in Abschnitt 2 genannten Informationen gemäß ihren eigenen Datenschutzerklärungen verarbeiten, um ihre Dienste zu erbringen.',
      ],
    },
    {
      title: '6. Speicherdauer',
      blocks: [
        'Wir selbst speichern keine personenbezogenen Daten. Von Drittanbietern verarbeitete Informationen werden gemäß deren Richtlinien aufbewahrt.',
      ],
    },
    {
      title: '7. Ihre Rechte',
      blocks: [
        'Sie können Cookies jederzeit in Ihren Browsereinstellungen löschen oder blockieren und uns bei Fragen oder Anliegen zum Datenschutz kontaktieren.',
      ],
    },
    { title: '8. Kinder', blocks: ['Die Website erhebt wissentlich keine personenbezogenen Daten von Kindern.'] },
    { title: '9. Kontakt', blocks: ['{contact}'] },
    { title: '10. Änderungen', blocks: ['Diese Erklärung gilt seit dem {date}. Änderungen werden auf dieser Seite veröffentlicht.'] },
  ],
  terms: [
    { title: '1. Geltungsbereich', blocks: ['Diese Bedingungen regeln die Nutzung der PDF-Tools von {site} („die Website“).'] },
    {
      title: '2. Der Dienst',
      blocks: [
        'Die Website bietet kostenlose Tools zum Zusammenfügen, Teilen, Organisieren, Komprimieren, Umwandeln, Versehen mit Wasserzeichen, Schützen und Entsperren von PDF-Dateien. Die gesamte Verarbeitung erfolgt in Ihrem Browser, und Ihre Dateien werden nie hochgeladen.',
      ],
    },
    {
      title: '3. Ihre Pflichten',
      blocks: [
        {
          list: [
            'Verarbeiten Sie nur Dateien, zu deren Nutzung Sie berechtigt sind.',
            'Nutzen Sie den Dienst nicht, um Urheberrechte, Persönlichkeitsrechte oder andere Rechte Dritter zu verletzen.',
            'Verwenden Sie das Entsperr-Tool nur für Dokumente, die Ihnen gehören oder die Sie ändern dürfen.',
            'Beeinträchtigen Sie nicht den normalen Betrieb des Dienstes.',
          ],
        },
      ],
    },
    {
      title: '4. Haftungsausschluss',
      blocks: [
        {
          list: [
            'Der Dienst wird „wie besehen“ bereitgestellt, ohne Gewähr für Richtigkeit, Vollständigkeit oder Eignung für einen bestimmten Zweck.',
            'Bewahren Sie immer eine Kopie Ihrer Originaldateien auf.',
            'Soweit gesetzlich zulässig, haftet die Website nicht für Datenverluste oder sonstige Schäden, die durch die Nutzung des Dienstes entstehen.',
          ],
        },
      ],
    },
    { title: '5. Werbung', blocks: ['Die Website kann zur Finanzierung ihres Betriebs Werbung anzeigen.'] },
    {
      title: '6. Änderungen des Dienstes',
      blocks: ['Die Website kann den Dienst jederzeit ganz oder teilweise ändern, aussetzen oder einstellen.'],
    },
    { title: '7. Anwendbares Recht', blocks: ['Für diese Bedingungen gilt das Recht der Republik Korea.'] },
    { title: '8. Inkrafttreten', blocks: ['Diese Bedingungen gelten seit dem {date}.'] },
  ],
  contact: {
    about: 'Vorschläge, Fehlermeldungen und Kooperationsanfragen: {email}',
    privacy: 'Fragen zum Datenschutz: {email}',
    none: 'Bei Fragen wenden Sie sich bitte an den Betreiber der Website.',
  },
  listSeparator: ', ',
};
