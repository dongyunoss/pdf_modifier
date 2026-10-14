// Deutsch: Abschnitt „… im Detail“ auf jeder Werkzeugseite. {tool:id} wird zum Link, {ui:…} zum Text der Oberfläche.
import type { ToolDetailSet } from '../types';

export const de: ToolDetailSet = {
  title: '{tool} im Detail',
  sections: {
    merge: [
      {
        title: 'Wann es hilft',
        blocks: [
          { list: [
            'Wenn eine Bewerbung, ein Stipendien- oder Kreditantrag „alle Unterlagen in einer PDF“ verlangt',
            'Um monatliche Kontoauszüge oder Rechnungen in einer Datei zu sammeln',
            'Um Kapitel eines Berichts zusammenzuführen, die verschiedene Personen geschrieben haben',
          ] },
        ],
      },
      {
        title: 'So funktioniert es',
        blocks: [
          'Die Seiten jeder PDF werden unverändert in die neue Datei kopiert, nicht neu gezeichnet. Deshalb bleibt der Text markier- und durchsuchbar, und Bilder behalten ihre Qualität. Die Liste zeigt eine Vorschau der ersten Seite und die Seitenzahl jeder Datei, damit Sie den Inhalt prüfen können, bevor Sie die Reihenfolge per Ziehen festlegen.',
        ],
      },
      {
        title: 'Gut zu wissen',
        blocks: [
          { list: [
            'Mit zweistelligen Nummern am Anfang der Dateinamen (01_, 02_ …) sind die Dateien schon beim Auswählen sortiert.',
            'Passwortgeschützte PDFs lassen sich hinzufügen, indem Sie beim Hinzufügen das Passwort eingeben; die zusammengefügte Datei hat kein Passwort.',
            'Um danach einzelne Seiten zu entfernen oder zu drehen, schicken Sie das Ergebnis mit „{ui:ui.continueWith}“ an {tool:organize}.',
            'Wenn Scans die Datei groß machen, geht es mit {tool:compress} weiter.',
          ] },
        ],
      },
    ],
    split: [
      {
        title: 'Wann es hilft',
        blocks: [
          { list: [
            'Um einen Stapelscan in eine Datei pro Person oder Vorgang aufzuteilen',
            'Um eine große PDF wegen einer Größenbeschränkung in mehreren Teilen zu senden',
            'Um ein Buch oder Skript in Kapitel aufzuteilen',
          ] },
        ],
      },
      {
        title: 'Drei Arten zu teilen',
        blocks: [
          { table: {
            head: ['Modus', 'Beispiel', 'Ergebnis'],
            rows: [
              ['{ui:tools.split.ui.modeRanges}', '1-3, 4-6, 7-', 'Eine PDF pro Bereich („7-“ bedeutet Seite 7 bis zum Ende)'],
              ['{ui:tools.split.ui.modeEvery}', '2', 'Alle zwei Seiten eine neue PDF'],
              ['{ui:tools.split.ui.modeEach}', '-', 'Eine PDF pro Seite'],
            ],
          } },
          'Vor dem Teilen zeigt das Werkzeug an, wie viele Dateien entstehen. Mehrere Ergebnisse können Sie gemeinsam als eine ZIP-Datei herunterladen.',
        ],
      },
      {
        title: 'Gut zu wissen',
        blocks: [
          'Wenn Sie nur einzelne Teile brauchen, ist {tool:extract-pages} schneller. Die Seiten werden unverändert kopiert, die geteilten Dateien haben also genau die Qualität des Originals.',
        ],
      },
    ],
    organize: [
      {
        title: 'Wann es hilft',
        blocks: [
          'Das Werkzeug für Dokumente, die mehrere Korrekturen auf einmal brauchen: Scans in falscher Reihenfolge, doppelseitige Scans mit leeren Rückseiten oder Druckvorlagen, in die eine Leerseite eingefügt werden muss.',
        ],
      },
      {
        title: 'Was Sie tun können',
        blocks: [
          { list: [
            'Seiten per Ziehen umsortieren',
            'Mehrere Seiten auswählen und gemeinsam drehen oder löschen (Umschalt + Klick wählt einen Bereich)',
            'Seiten duplizieren und Leerseiten einfügen',
            'Eine weitere PDF hinzufügen und ihre Seiten einmischen',
            'Jede Änderung rückgängig machen und wiederholen',
          ] },
          'Gespeichert wird erst, wenn Sie auf „{ui:tools.organize.ui.action}“ klicken – Sie können also gefahrlos ausprobieren.',
        ],
      },
      {
        title: 'Gut zu wissen',
        blocks: [
          'Wenn Sie nur drehen möchten, ist {tool:rotate} einfacher; nur zum Löschen {tool:delete-pages}. Dokumente mit Hunderten von Seiten brauchen eine Weile für die Vorschau – trennen Sie den benötigten Teil vorher mit {tool:split} ab, das spart Zeit.',
        ],
      },
    ],
    rotate: [
      {
        title: 'Wann es hilft',
        blocks: [
          'Bei Seiten, die verkehrt herum durch den Scanner liefen, Tabellen im Querformat in einem Hochformat-Dokument oder liegenden Seiten in einer PDF aus Handyfotos.',
        ],
      },
      {
        title: 'So funktioniert es',
        blocks: [
          'Jeder Klick dreht eine Seite um 90° im Uhrzeigersinn; „{ui:tools.rotate.ui.rotateAllLeft}“ und „{ui:tools.rotate.ui.rotateAllRight}“ drehen alle Seiten auf einmal. Dabei ändert sich nur die Ausrichtungsangabe der Seite; nichts wird neu gezeichnet, die Qualität bleibt also unverändert und der Text markierbar.',
        ],
      },
      {
        title: 'Gut zu wissen',
        blocks: [
          'Wenn Sie zusätzlich umsortieren oder löschen müssen, erledigt {tool:organize} alles in einem Schritt. Das „Ansicht drehen“ in PDF-Readern wird meist nicht in der Datei gespeichert – um die Ausrichtung dauerhaft zu korrigieren, speichern Sie das Ergebnis mit diesem Werkzeug.',
        ],
      },
    ],
    'delete-pages': [
      {
        title: 'Wann es hilft',
        blocks: [
          { list: [
            'Um leere Rückseiten aus einem doppelseitigen Scan zu entfernen',
            'Um vor dem Einreichen ein Deckblatt oder eine Hinweisseite herauszunehmen',
            'Um unnötige Fotoseiten zu streichen und die Datei zu verkleinern',
          ] },
        ],
      },
      {
        title: 'So funktioniert es',
        blocks: [
          'Klicken Sie die Seiten an, die entfernt werden sollen; der Button zeigt, wie viele es sind. Die übrigen Seiten werden unverändert in eine neue Datei kopiert, die Qualität bleibt also gleich. Versehentlich alle Seiten zu löschen, verhindert das Werkzeug.',
        ],
      },
      {
        title: 'Gut zu wissen',
        blocks: [
          'Wenn Sie deutlich weniger Seiten behalten als entfernen, wählen Sie die zu behaltenden lieber in {tool:extract-pages} aus – das spart Klicks.',
        ],
      },
    ],
    'extract-pages': [
      {
        title: 'Wann es hilft',
        blocks: [
          'Um ein paar Seiten aus einem langen Bericht weiterzugeben, nur die Unterschriftenseite eines Vertrags aufzubewahren oder die Hausaufgabenseiten aus einem PDF-Lehrbuch herauszuholen.',
        ],
      },
      {
        title: 'Zwei Arten zu speichern',
        blocks: [
          { list: [
            '{ui:tools.extract-pages.ui.outputSingle}: die gewählten Seiten in ihrer ursprünglichen Reihenfolge in einer neuen Datei.',
            '{ui:tools.extract-pages.ui.outputSeparate}: jede gewählte Seite als eigene PDF, gemeinsam als ZIP herunterladbar.',
          ] },
          'Die Seitendaten werden unverändert kopiert, sodass Textauswahl, Links und Bildqualität dem Original entsprechen.',
        ],
      },
      {
        title: 'Gut zu wissen',
        blocks: [
          'Sie brauchen Bilder statt PDF? Dann nehmen Sie {tool:pdf-to-jpg}. Wenn Sie aber nur einen Teil eines Dokuments weitergeben möchten, sind als PDF extrahierte Seiten schärfer und kleiner als Bilder.',
        ],
      },
    ],
    compress: [
      {
        title: 'Wann es hilft',
        blocks: [
          'Wenn eine E-Mail oder ein Upload-Formular eine Datei als zu groß ablehnt, oder bevor Sie Scans und fotoreiche PDFs archivieren. Reine Textdokumente sind ohnehin klein und schrumpfen kaum.',
        ],
      },
      {
        title: 'Die Komprimierungsstufen',
        blocks: [
          { table: {
            head: ['Stufe', 'Längste Bildseite', 'JPEG-Qualität', 'Geeignet für'],
            rows: [
              ['{ui:tools.compress.ui.levelLow}', '2.400 px', '82 %', 'Druck, Material mit wichtigen Fotos'],
              ['{ui:tools.compress.ui.levelMedium}', '1.700 px', '68 %', 'E-Mail-Anhänge und die meisten Einreichungen'],
              ['{ui:tools.compress.ui.levelHigh}', '1.200 px', '50 %', 'Sehr strenge Größenlimits'],
            ],
          } },
          'Nur die Bilder in der PDF werden neu kodiert; Text und Vektorgrafiken bleiben unberührt, der Text ist also weiterhin markier- und durchsuchbar. Bilder, die nicht um mindestens 10 % kleiner würden, bleiben zum Schutz ihrer Qualität unverändert.',
        ],
      },
      {
        title: 'Über „{ui:tools.compress.ui.rasterize}“',
        blocks: [
          'Reicht die Bildkomprimierung nicht aus, zeichnet diese Option jede Seite je nach Stufe als Bild mit 150, 120 oder 96 DPI neu. Bei Scans ist das sehr wirksam, danach lässt sich der Text aber nicht mehr markieren oder durchsuchen – nutzen Sie sie für Kopien, die nur gelesen werden müssen.',
        ],
      },
      {
        title: 'Gut zu wissen',
        blocks: [
          { list: [
            'Eine bereits komprimierte Datei erneut zu komprimieren kostet nur Qualität. Für eine höhere Stufe beginnen Sie wieder mit dem Original.',
            'Wenn Sie vorher unnötige Seiten mit {tool:delete-pages} entfernen, wirkt die Komprimierung stärker.',
          ] },
        ],
      },
    ],
    'jpg-to-pdf': [
      {
        title: 'Wann es hilft',
        blocks: [
          'Um Handyfotos von Belegen, Formularen oder handschriftlichen Notizen zu einem einzigen Dokument zum Einreichen oder Aufbewahren zu machen. JPG-, PNG-, WebP-, GIF- und BMP-Bilder werden unterstützt, und Fotos werden anhand ihrer EXIF-Ausrichtung aufgerichtet.',
        ],
      },
      {
        title: 'Die richtigen Einstellungen',
        blocks: [
          { table: {
            head: ['Einstellung', 'Optionen', 'Empfehlung'],
            rows: [
              ['{ui:tools.jpg-to-pdf.ui.pageSize}', '{ui:tools.jpg-to-pdf.ui.sizeFit} / A4 / Letter', 'A4 zum Drucken und Einreichen, {ui:tools.jpg-to-pdf.ui.sizeFit} für Fotoarchive'],
              ['{ui:tools.jpg-to-pdf.ui.orientation}', '{ui:tools.jpg-to-pdf.ui.orientAuto} / {ui:tools.jpg-to-pdf.ui.orientPortrait} / {ui:tools.jpg-to-pdf.ui.orientLandscape}', 'Meist {ui:tools.jpg-to-pdf.ui.orientAuto}'],
              ['{ui:tools.jpg-to-pdf.ui.margin}', '{ui:tools.jpg-to-pdf.ui.marginNone} / {ui:tools.jpg-to-pdf.ui.marginSmall} / {ui:tools.jpg-to-pdf.ui.marginLarge}', '{ui:tools.jpg-to-pdf.ui.marginSmall} für den Druck, {ui:tools.jpg-to-pdf.ui.marginNone} für den Bildschirm'],
            ],
          } },
          'Bei A4 oder Letter wird jedes Foto unter Beibehaltung seiner Proportionen auf die Seite eingepasst. So sind alle Seiten gleich groß, auch wenn die Fotos unterschiedlich sind.',
        ],
      },
      {
        title: 'Gut zu wissen',
        blocks: [
          { list: [
            'Helles Licht ohne Schatten und ein parallel zum Papier gehaltenes Handy machen einen großen Unterschied. Schalten Sie den Blitz aus – glänzendes Papier reflektiert ihn.',
            'Handyfotos haben oft mehrere MB, die PDF wächst also schnell. Vom Ergebnisbildschirm aus geht es direkt weiter zu {tool:compress}.',
          ] },
        ],
      },
    ],
    'pdf-to-jpg': [
      {
        title: 'Wann es hilft',
        blocks: [
          'Um eine PDF-Seite in einem Blog oder sozialen Netzwerk zu veröffentlichen, als Bild in eine Präsentation oder ein Dokument einzufügen oder per Messenger an jemanden zu schicken, der PDFs nur schwer öffnen kann.',
        ],
      },
      {
        title: 'Auflösung und Format wählen',
        blocks: [
          { table: {
            head: ['Auflösung', 'A4-Seite in Pixeln', 'Verwendung'],
            rows: [
              ['{ui:tools.pdf-to-jpg.ui.dpiLow}', 'etwa 595 × 842', 'Vorschau, schnelles Teilen'],
              ['{ui:tools.pdf-to-jpg.ui.dpiMedium}', 'etwa 1.240 × 1.754', 'Web, Lesen am Bildschirm'],
              ['{ui:tools.pdf-to-jpg.ui.dpiHigh}', 'etwa 2.480 × 3.508', 'Druck, Vergrößern kleiner Schrift'],
            ],
          } },
          'Doppelte DPI verdoppeln Breite und Höhe – das Bild hat viermal so viele Pixel und die Datei wird ungefähr entsprechend größer. Wählen Sie PNG für Text- und Tabellenseiten und JPG für fotoreiche Seiten. Sie können nur ausgewählte Seiten umwandeln und mehrere Bilder als ZIP herunterladen.',
        ],
      },
      {
        title: 'Gut zu wissen',
        blocks: [
          'In einem Bild lässt sich der Text nicht mehr markieren oder durchsuchen. Wenn Sie nur einen Teil eines Dokuments weitergeben möchten, extrahieren Sie die Seiten lieber als PDF mit {tool:extract-pages}.',
        ],
      },
    ],
    watermark: [
      {
        title: 'Wann es hilft',
        blocks: [
          { list: [
            'Um interne Unterlagen als „Vertraulich“ oder „Entwurf“ zu kennzeichnen',
            'Um auf einer Ausweiskopie den Verwendungszweck zu vermerken, damit sie nicht einfach anderswo verwendet werden kann',
            'Um Ihr Logo in ein Portfolio oder Handout einzufügen',
          ] },
        ],
      },
      {
        title: 'Was Sie einstellen können',
        blocks: [
          'Wählen Sie Text oder ein Logobild und stellen Sie Farbe, Größe, Deckkraft und Winkel ein. „{ui:tools.watermark.ui.layoutCenter}“ setzt ein einzelnes Zeichen in die Seitenmitte, „{ui:tools.watermark.ui.layoutTile}“ wiederholt es über die ganze Seite. Wenden Sie es auf alle oder nur auf angegebene Seiten an und prüfen Sie das Ergebnis in der Vorschau der ersten Seite.',
        ],
      },
      {
        title: 'Gut zu wissen',
        blocks: [
          'Gegen Weitergabe hilft eine Anordnung „{ui:tools.watermark.ui.layoutTile}“ mit etwa 20–30 % Deckkraft, die sich kaum wegschneiden lässt. Ein Wasserzeichen verbirgt den Inhalt nicht; soll niemand sonst die Datei lesen, setzen Sie zusätzlich mit {tool:protect} ein Öffnungspasswort.',
        ],
      },
    ],
    'page-numbers': [
      {
        title: 'Wann es hilft',
        blocks: [
          'Für zusammengefügte Bewerbungsunterlagen, Berichte, die gedruckt und gebunden werden, und Besprechungsunterlagen, bei denen man „siehe Seite 12“ sagen können muss.',
        ],
      },
      {
        title: 'Was Sie einstellen können',
        blocks: [
          'Position (links, mittig oder rechts, oben oder unten), Zahlenformat, Startnummer, Schriftgröße und Rand. Um das Deckblatt auszulassen und auf der ersten Inhaltsseite mit der Nummerierung zu beginnen, wählen Sie bei den Seiten „{ui:tools.page-numbers.ui.pagesCustom}“, geben ab Seite 2 an und lassen die Startnummer bei 1. Prüfen Sie die Vorschau, bevor Sie anwenden.',
        ],
      },
      {
        title: 'Gut zu wissen',
        blocks: [
          'Nummerieren Sie zuletzt. Wenn Sie danach Seiten umsortieren, geraten die Nummern durcheinander – legen Sie die Reihenfolge also vorher mit {tool:merge} oder {tool:organize} fest.',
        ],
      },
    ],
    sign: [
      {
        title: 'Wann es sich lohnt',
        blocks: [
          { list: [
            'Einen per E-Mail erhaltenen Vertrag oder eine Einwilligung unterschreiben und sofort zurückschicken – ohne Drucken, Unterschreiben und Einscannen',
            'Einen Antrag oder eine Spesenabrechnung einreichen, die neben Ihrem Namen eine Unterschrift oder einen Stempel braucht',
            'Jede Seite eines mehrseitigen Vertrags mit einer Unterschrift versehen',
          ] },
        ],
      },
      {
        title: 'Drei Wege zur Unterschrift',
        blocks: [
          { list: [
            '{ui:tools.sign.ui.modeDraw}: mit Maus oder Finger zeichnen. Auf dem Smartphone mit dem Finger unterschrieben wirkt sie am natürlichsten.',
            '{ui:tools.sign.ui.modeType}: Namen eintippen und den Stil {ui:tools.sign.ui.styleScript}, {ui:tools.sign.ui.styleSerif} oder {ui:tools.sign.ui.styleSans} wählen.',
            '{ui:tools.sign.ui.modeImage}: ein Foto einer Unterschrift oder eines Stempels auf Papier hochladen. Mit „{ui:tools.sign.ui.removeBackground}“ wird das Papier transparent, sodass die Unterschrift natürlich auf der Seite sitzt.',
          ] },
          'Ist die Unterschrift fertig, klicken Sie auf die Seite, um sie dort abzulegen. Ziehen Sie sie zum Verschieben, ziehen Sie die untere rechte Ecke zum Vergrößern oder Verkleinern und wechseln Sie die Seite, um sie an mehreren Stellen zu platzieren. Auf gedrehten Seiten landet sie genau so, wie Sie sie auf dem Bildschirm sehen.',
        ],
      },
      {
        title: 'Gut zu wissen',
        blocks: [
          { list: [
            'Dieses Werkzeug setzt ein Bild Ihrer Unterschrift auf die Seite. Das ist bei alltäglichen Verträgen und Formularen üblich; wird eine zertifikatsbasierte elektronische Signatur verlangt, folgen Sie dem Verfahren der jeweiligen Stelle.',
            'Damit niemand die unterschriebene Datei verändert, schränken Sie die Bearbeitung ein oder vergeben ein Öffnungspasswort mit {tool:protect}.',
            'Sind die Unterlagen auf mehrere Dateien verteilt, fügen Sie sie zuerst mit {tool:merge} zusammen und unterschreiben dann in einem Durchgang.',
            'Gezeichnete Unterschrift und hochgeladene Bilder werden nur in diesem Browser verwendet und verschwinden, wenn Sie die Seite schließen.',
          ] },
        ],
      },
    ],
    protect: [
      {
        title: 'Wann es hilft',
        blocks: [
          'Um Gehaltsabrechnungen, Verträge oder medizinische und finanzielle Unterlagen zu versenden, die nur der Empfänger lesen soll.',
        ],
      },
      {
        title: 'Passwort und Berechtigungen',
        blocks: [
          'Das gesamte Dokument wird mit AES-256 verschlüsselt und lässt sich ohne Passwort nicht öffnen. Die optionalen Berechtigungen steuern Drucken, Kopieren, Bearbeiten und Kommentieren – das sind jedoch Hinweise, die PDF-Reader beachten sollen, keine echte Verschlüsselung.',
          'Die Verschlüsselung erfolgt in Ihrem Browser, und das Passwort wird nirgends gespeichert. Das heißt aber auch: Wenn Sie es vergessen, kann es niemand wiederherstellen – auch wir nicht.',
        ],
      },
      {
        title: 'Gut zu wissen',
        blocks: [
          { list: [
            'Verwenden Sie ein langes Passwort mit mindestens 12 Zeichen und vermeiden Sie Geburtsdaten oder Telefonnummern.',
            'Schicken Sie die Datei per E-Mail und das Passwort per SMS oder Telefon.',
          ] },
        ],
      },
    ],
    unlock: [
      {
        title: 'Wann es hilft',
        blocks: [
          'Um eigene geschützte Dokumente wie monatliche Abrechnungen ohne ständiges Passworteingeben aufzubewahren oder Druck- und Kopiersperren eigener Dateien aufzuheben.',
        ],
      },
      {
        title: 'So funktioniert es',
        blocks: [
          'Nach der Auswahl zeigt das Werkzeug zuerst, welche Art von Schutz die Datei hat. Dateien mit Öffnungspasswort brauchen das Passwort, das Sie kennen; Dateien mit reinen Berechtigungssperren lassen sich ohne Passwort freigeben. Ist eine Datei nicht geschützt, erfahren Sie, dass Sie sie so verwenden können, wie sie ist.',
        ],
      },
      {
        title: 'Gut zu wissen',
        blocks: [
          'Dateien, deren Passwort Sie nicht kennen, lassen sich nicht entsperren – das Werkzeug errät keine Passwörter. Den Schutz fremder Dokumente ohne Erlaubnis zu entfernen, kann gegen Urheberrecht oder Vereinbarungen verstoßen. Nutzen Sie es daher nur für eigene Dateien oder solche, die Sie ändern dürfen.',
        ],
      },
    ],
  },
};
