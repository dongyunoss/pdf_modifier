// Français : section « En savoir plus » de chaque outil. {tool:id} devient un lien et {ui:…} le texte de l’interface.
import type { ToolDetailSet } from '../types';

export const fr: ToolDetailSet = {
  title: 'En savoir plus : {tool}',
  sections: {
    merge: [
      {
        title: 'Quand l’utiliser',
        blocks: [
          { list: [
            'Quand une candidature, une demande de bourse ou de prêt exige « tous les documents en un seul PDF »',
            'Pour regrouper dans un seul fichier les relevés ou factures reçus chaque mois',
            'Pour assembler les chapitres d’un rapport rédigés par plusieurs personnes',
          ] },
        ],
      },
      {
        title: 'Comment ça marche',
        blocks: [
          'Les pages de chaque PDF sont copiées telles quelles dans le nouveau fichier, sans être redessinées. Le texte reste donc sélectionnable et consultable par recherche, et les images gardent leur qualité. La liste affiche l’aperçu de la première page et le nombre de pages de chaque fichier, pour vérifier le contenu avant de le remettre dans l’ordre par glisser-déposer.',
        ],
      },
      {
        title: 'Bon à savoir',
        blocks: [
          { list: [
            'En ajoutant un numéro à deux chiffres au début des noms (01_, 02_…), les fichiers arrivent déjà dans l’ordre.',
            'Les PDF protégés par mot de passe peuvent être ajoutés en saisissant leur mot de passe ; le fichier fusionné n’en a pas.',
            'Pour retirer ou faire pivoter quelques pages ensuite, envoyez le résultat vers {tool:organize} avec « {ui:ui.continueWith} ».',
            'Si des numérisations alourdissent le fichier, poursuivez avec {tool:compress}.',
          ] },
        ],
      },
    ],
    split: [
      {
        title: 'Quand l’utiliser',
        blocks: [
          { list: [
            'Pour séparer un lot numérisé en un fichier par personne ou par dossier',
            'Pour envoyer un gros PDF en plusieurs parties à cause d’une limite de taille',
            'Pour découper un livre ou un polycopié par chapitre',
          ] },
        ],
      },
      {
        title: 'Trois façons de diviser',
        blocks: [
          { table: {
            head: ['Mode', 'Exemple', 'Résultat'],
            rows: [
              ['{ui:tools.split.ui.modeRanges}', '1-3, 4-6, 7-', 'Un PDF par plage (« 7- » va de la page 7 à la fin)'],
              ['{ui:tools.split.ui.modeEvery}', '2', 'Un nouveau PDF toutes les deux pages'],
              ['{ui:tools.split.ui.modeEach}', '-', 'Un PDF par page'],
            ],
          } },
          'Avant de diviser, l’outil indique combien de fichiers seront créés. S’il y en a plusieurs, vous pouvez les télécharger ensemble dans un seul ZIP.',
        ],
      },
      {
        title: 'Bon à savoir',
        blocks: [
          'Si vous n’avez besoin que de quelques parties, {tool:extract-pages} est plus rapide. Les pages sont copiées sans modification : les fichiers obtenus ont exactement la qualité de l’original.',
        ],
      },
    ],
    organize: [
      {
        title: 'Quand l’utiliser',
        blocks: [
          'C’est l’outil des documents qui demandent plusieurs corrections à la fois : numérisations dans le désordre, numérisations recto verso avec des versos blancs, ou documents à imprimer dans lesquels il faut intercaler une page blanche.',
        ],
      },
      {
        title: 'Ce que vous pouvez faire',
        blocks: [
          { list: [
            'Faire glisser les pages pour changer leur ordre',
            'Sélectionner plusieurs pages et les faire pivoter ou les supprimer ensemble (Maj + clic sélectionne une plage)',
            'Dupliquer des pages et insérer des pages blanches',
            'Ajouter un autre PDF et mélanger ses pages',
            'Annuler et rétablir chaque modification',
          ] },
          'Rien n’est enregistré avant que vous ne cliquiez sur « {ui:tools.organize.ui.action} » : vous pouvez essayer sans crainte.',
        ],
      },
      {
        title: 'Bon à savoir',
        blocks: [
          'Pour une simple rotation, {tool:rotate} est plus direct ; pour une simple suppression, {tool:delete-pages}. Les documents de plusieurs centaines de pages mettent du temps à afficher les aperçus : isoler d’abord la partie utile avec {tool:split} peut faire gagner du temps.',
        ],
      },
    ],
    rotate: [
      {
        title: 'Quand l’utiliser',
        blocks: [
          'Pour des pages passées à l’envers dans le scanner, des tableaux au format paysage dans un document portrait ou des pages couchées dans un PDF créé à partir de photos prises au téléphone.',
        ],
      },
      {
        title: 'Comment ça marche',
        blocks: [
          'Chaque clic fait pivoter la page de 90° dans le sens horaire, et « {ui:tools.rotate.ui.rotateAllLeft} » ou « {ui:tools.rotate.ui.rotateAllRight} » font pivoter toutes les pages d’un coup. Seule l’orientation de la page change ; rien n’est redessiné, la qualité est donc intacte et le texte reste sélectionnable.',
        ],
      },
      {
        title: 'Bon à savoir',
        blocks: [
          'S’il faut aussi réordonner ou supprimer des pages, {tool:organize} fait tout en une fois. La « rotation de l’affichage » des lecteurs PDF n’est généralement pas enregistrée dans le fichier : pour corriger l’orientation durablement, enregistrez le résultat avec cet outil.',
        ],
      },
    ],
    'delete-pages': [
      {
        title: 'Quand l’utiliser',
        blocks: [
          { list: [
            'Pour retirer les versos blancs d’une numérisation recto verso',
            'Pour enlever la page de garde ou une page d’instructions avant d’envoyer un document',
            'Pour supprimer des pages de photos inutiles et alléger le fichier',
          ] },
        ],
      },
      {
        title: 'Comment ça marche',
        blocks: [
          'Cliquez sur les pages à supprimer ; le bouton indique combien seront retirées. Les pages restantes sont copiées sans modification dans un nouveau fichier, la qualité est donc la même. L’outil vous empêche de supprimer toutes les pages par erreur.',
        ],
      },
      {
        title: 'Bon à savoir',
        blocks: [
          'Si vous gardez beaucoup moins de pages que vous n’en retirez, sélectionnez plutôt celles à conserver dans {tool:extract-pages} : il faut moins de clics.',
        ],
      },
    ],
    'extract-pages': [
      {
        title: 'Quand l’utiliser',
        blocks: [
          'Pour envoyer quelques pages d’un long rapport, ne garder que la page des signatures d’un contrat ou extraire d’un manuel en PDF les pages d’un devoir.',
        ],
      },
      {
        title: 'Deux façons d’enregistrer',
        blocks: [
          { list: [
            '{ui:tools.extract-pages.ui.outputSingle} : les pages choisies, dans leur ordre d’origine, dans un seul nouveau fichier.',
            '{ui:tools.extract-pages.ui.outputSeparate} : chaque page choisie dans son propre PDF, téléchargeables ensemble dans un ZIP.',
          ] },
          'Les données des pages sont copiées sans modification : la sélection du texte, les liens et la qualité des images sont identiques à l’original.',
        ],
      },
      {
        title: 'Bon à savoir',
        blocks: [
          'Besoin d’images plutôt que de PDF ? Utilisez {tool:pdf-to-jpg}. Mais pour simplement transmettre une partie d’un document, des pages extraites en PDF sont plus nettes et plus légères que des images.',
        ],
      },
    ],
    compress: [
      {
        title: 'Quand l’utiliser',
        blocks: [
          'Quand un e-mail ou un formulaire de dépôt refuse un fichier trop volumineux, ou avant d’archiver des numérisations et des PDF riches en photos. Les documents composés de texte sont déjà légers et ne diminuent presque pas.',
        ],
      },
      {
        title: 'Niveaux de compression',
        blocks: [
          { table: {
            head: ['Niveau', 'Plus grand côté de l’image', 'Qualité JPEG', 'Idéal pour'],
            rows: [
              ['{ui:tools.compress.ui.levelLow}', '2 400 px', '82 %', 'L’impression, les documents où la photo compte'],
              ['{ui:tools.compress.ui.levelMedium}', '1 700 px', '68 %', 'Les pièces jointes et la plupart des dépôts'],
              ['{ui:tools.compress.ui.levelHigh}', '1 200 px', '50 %', 'Les limites de taille très strictes'],
            ],
          } },
          'Seules les images du PDF sont réencodées ; le texte et les graphismes vectoriels ne sont pas touchés, si bien que le texte reste sélectionnable et consultable par recherche. Les images qui ne gagneraient pas au moins 10 % sont laissées telles quelles pour préserver leur qualité.',
        ],
      },
      {
        title: 'À propos de « {ui:tools.compress.ui.rasterize} »',
        blocks: [
          'Quand la compression des images ne suffit pas, cette option redessine chaque page sous forme d’image à 150, 120 ou 96 DPI selon le niveau. C’est très efficace sur les documents numérisés, mais le texte ne peut plus être sélectionné ni recherché : réservez-la aux copies destinées à être seulement lues.',
        ],
      },
      {
        title: 'Bon à savoir',
        blocks: [
          { list: [
            'Ne recompressez pas un fichier déjà compressé : il ne fait que perdre en qualité. Pour monter d’un niveau, repartez de l’original.',
            'Supprimer d’abord les pages inutiles avec {tool:delete-pages} rend la compression plus efficace.',
          ] },
        ],
      },
    ],
    'jpg-to-pdf': [
      {
        title: 'Quand l’utiliser',
        blocks: [
          'Pour transformer des photos de reçus, de formulaires ou de notes manuscrites prises au téléphone en un seul document à envoyer ou à conserver. Les images JPG, PNG, WebP, GIF et BMP sont acceptées, et les photos sont redressées selon leur orientation EXIF.',
        ],
      },
      {
        title: 'Choisir les réglages',
        blocks: [
          { table: {
            head: ['Réglage', 'Options', 'Conseil'],
            rows: [
              ['{ui:tools.jpg-to-pdf.ui.pageSize}', '{ui:tools.jpg-to-pdf.ui.sizeFit} / A4 / Letter', 'A4 pour imprimer et envoyer ; {ui:tools.jpg-to-pdf.ui.sizeFit} pour archiver des photos'],
              ['{ui:tools.jpg-to-pdf.ui.orientation}', '{ui:tools.jpg-to-pdf.ui.orientAuto} / {ui:tools.jpg-to-pdf.ui.orientPortrait} / {ui:tools.jpg-to-pdf.ui.orientLandscape}', '{ui:tools.jpg-to-pdf.ui.orientAuto} dans la plupart des cas'],
              ['{ui:tools.jpg-to-pdf.ui.margin}', '{ui:tools.jpg-to-pdf.ui.marginNone} / {ui:tools.jpg-to-pdf.ui.marginSmall} / {ui:tools.jpg-to-pdf.ui.marginLarge}', '{ui:tools.jpg-to-pdf.ui.marginSmall} pour imprimer ; {ui:tools.jpg-to-pdf.ui.marginNone} pour l’écran'],
            ],
          } },
          'En A4 ou Letter, chaque photo est ajustée à la page en gardant ses proportions : toutes les pages ont la même taille, même si les photos sont différentes.',
        ],
      },
      {
        title: 'Bon à savoir',
        blocks: [
          { list: [
            'Une bonne lumière sans ombre et un téléphone tenu parallèlement à la feuille changent tout. Coupez le flash : le papier brillant le reflète.',
            'Chaque photo de téléphone pèse plusieurs Mo, le PDF grossit donc vite. Depuis l’écran de résultat, envoyez-le directement vers {tool:compress}.',
          ] },
        ],
      },
    ],
    'word-to-pdf': [
      {
        title: 'Quand l’utiliser',
        blocks: [
          { list: [
            'Envoyer un CV ou une lettre de motivation en PDF, pour qu’il s’affiche pareil sur tous les ordinateurs',
            'Transmettre un contrat ou un rapport en PDF pour limiter les modifications',
            'Transformer en PDF un DOCX reçu, sur un ordinateur ou un téléphone sans Word',
          ] },
        ],
      },
      {
        title: 'Comment ça marche',
        blocks: [
          'Cet outil exécute dans votre navigateur un convertisseur issu de LibreOffice, la suite bureautique, compilé en WebAssembly. C’est ainsi qu’il convertit vos documents Word en PDF sans les envoyer sur un serveur, contrairement aux autres sites de conversion.',
          'Le convertisseur (environ 50 Mo) est téléchargé une fois et conservé par le navigateur : les conversions suivantes démarrent en quelques secondes. Si le document contient du coréen, du japonais ou du chinois, seules les polices nécessaires sont téléchargées en plus.',
        ],
      },
      {
        title: 'Bon à savoir',
        blocks: [
          { list: [
            'Les polices comme Calibri ou Cambria ne sont pas incluses : des polices libres de même largeur (Carlito, Caladea) les remplacent. Les retours à la ligne peuvent tout de même bouger un peu, vérifiez le résultat avant de l’envoyer.',
            'Si le suivi des modifications est encore présent, les marques de révision peuvent apparaître. Pour une version finale propre, acceptez toutes les modifications dans Word avant de convertir. Les commentaires ne sont pas inclus dans le PDF.',
            'Pour réunir plusieurs documents dans un seul PDF, convertissez-les puis utilisez {tool:merge} ; si le fichier est lourd, réduisez-le avec {tool:compress}.',
          ] },
        ],
      },
    ],
    'ppt-to-pdf': [
      {
        title: 'Quand l’utiliser',
        blocks: [
          { list: [
            'Envoyer des diapositives à un enseignant ou un client qui n’a peut-être ni PowerPoint ni vos polices',
            'Imprimer un support de cours ou l’annoter sur une tablette',
            'Transformer un PPT volumineux en PDF plus facile à envoyer par e-mail',
          ] },
        ],
      },
      {
        title: 'Comment ça marche',
        blocks: [
          'Un convertisseur issu de LibreOffice et compilé en WebAssembly dessine vos diapositives dans un PDF, directement dans le navigateur. Rien n’est envoyé : vos présentations internes ou confidentielles restent sur votre appareil.',
          'Chaque diapositive devient une page du PDF, et le format de la diapositive (16:9, 4:3…) devient le format de page. Le convertisseur (environ 50 Mo) est téléchargé une fois, puis démarre tout de suite.',
        ],
      },
      {
        title: 'Bon à savoir',
        blocks: [
          { list: [
            'Les animations apparaissent dans leur état final, et la vidéo et le son ne sont pas lus.',
            'Les notes du présentateur et les diapositives masquées ne sont pas incluses.',
            'Les polices comme Calibri sont remplacées par des polices libres proches : la largeur du texte peut un peu changer. Vérifiez les zones de texte remplies jusqu’au bord.',
            'Pour des polycopiés avec plusieurs diapositives par feuille, choisissez « plusieurs pages par feuille » à l’impression. Pour réduire la taille, utilisez {tool:compress} ; pour transformer les diapositives en images, {tool:pdf-to-jpg}.',
          ] },
        ],
      },
    ],
    'hwp-to-pdf': [
      {
        title: 'Quand l’utiliser',
        blocks: [
          { list: [
            'Ouvrir un document HWP envoyé par une école, une entreprise ou une administration coréenne sur un ordinateur ou un téléphone sans Hancom Office',
            'Remettre une candidature, un devoir ou un formulaire qui doit être envoyé en PDF',
            'Imprimer un HWP sur un Mac ou un Chromebook où Hancom Office est difficile à installer',
          ] },
        ],
      },
      {
        title: 'Comment ça marche',
        blocks: [
          'rhwp, un moteur open source pour HWP et HWPX (licence MIT), dessine chaque page du document dans votre navigateur, puis ce rendu est transformé en PDF. Rien n’est envoyé : les formulaires contenant des données personnelles restent sur votre appareil.',
          'Le moteur et les polices (environ 6 Mo) sont téléchargés une seule fois. Si le document contient des hanja ou des symboles comme ① et ㉠ absents des polices Nanum, une police d’appoint (Noto Sans KR) est aussi téléchargée une fois.',
        ],
      },
      {
        title: 'Bon à savoir',
        blocks: [
          { list: [
            'Les polices Hancom et Windows comme Hamchorom Batang, Malgun Gothic ou les HY ne peuvent pas être intégrées : Nanum Myeongjo et Nanum Gothic les remplacent. Chaque caractère reste à la place prévue par l’original, donc les retours à la ligne sont identiques, mais la forme des lettres peut un peu différer.',
            'Le texte du PDF est un vrai texte : on peut le rechercher, le copier, et il reste net au zoom.',
            'Les documents protégés par mot de passe ou réservés à la diffusion ne peuvent pas être convertis. Retirez le mot de passe dans Hancom Office puis réessayez.',
            'Pour réunir plusieurs documents, convertissez-les puis utilisez {tool:merge} ; si le fichier est trop lourd pour l’envoi, réduisez-le avec {tool:compress}.',
          ] },
        ],
      },
    ],
    'pdf-to-jpg': [
      {
        title: 'Quand l’utiliser',
        blocks: [
          'Pour publier une page de PDF sur un blog ou un réseau social, l’insérer comme image dans une présentation ou un document, ou l’envoyer par messagerie à quelqu’un qui ouvre difficilement les PDF.',
        ],
      },
      {
        title: 'Choisir la résolution et le format',
        blocks: [
          { table: {
            head: ['Résolution', 'Page A4 en pixels', 'Usage'],
            rows: [
              ['{ui:tools.pdf-to-jpg.ui.dpiLow}', 'environ 595 × 842', 'Aperçus, partage rapide'],
              ['{ui:tools.pdf-to-jpg.ui.dpiMedium}', 'environ 1 240 × 1 754', 'Publication web, lecture à l’écran'],
              ['{ui:tools.pdf-to-jpg.ui.dpiHigh}', 'environ 2 480 × 3 508', 'Impression, agrandissement des petits caractères'],
            ],
          } },
          'Doubler les DPI double la largeur et la hauteur : l’image compte quatre fois plus de pixels et le fichier grossit à peu près d’autant. Choisissez PNG pour les pages de texte et de tableaux, JPG pour les pages riches en photos. Vous pouvez ne convertir que les pages sélectionnées et télécharger plusieurs images dans un ZIP.',
        ],
      },
      {
        title: 'Bon à savoir',
        blocks: [
          'Dans une image, le texte ne peut plus être sélectionné ni recherché. Pour simplement transmettre une partie d’un document, extrayez plutôt les pages en PDF avec {tool:extract-pages}.',
        ],
      },
    ],
    watermark: [
      {
        title: 'Quand l’utiliser',
        blocks: [
          { list: [
            'Pour marquer des documents internes « Confidentiel » ou « Brouillon »',
            'Pour inscrire sur la copie d’une pièce d’identité l’usage auquel elle est destinée, afin qu’elle ne puisse pas être facilement réutilisée',
            'Pour ajouter votre logo à un portfolio ou à un support de cours',
          ] },
        ],
      },
      {
        title: 'Ce que vous pouvez régler',
        blocks: [
          'Choisissez un texte ou une image de logo, puis réglez la couleur, la taille, l’opacité et l’angle. « {ui:tools.watermark.ui.layoutCenter} » place une seule marque au centre de la page, tandis que « {ui:tools.watermark.ui.layoutTile} » la répète sur toute la page. Appliquez-la à toutes les pages ou seulement à celles que vous indiquez, et vérifiez le rendu dans l’aperçu de la première page.',
        ],
      },
      {
        title: 'Bon à savoir',
        blocks: [
          'Pour décourager les fuites, une disposition « {ui:tools.watermark.ui.layoutTile} » avec 20 à 30 % d’opacité est difficile à recadrer. Un filigrane ne masque pas le contenu ; si personne d’autre ne doit lire le fichier, ajoutez aussi un mot de passe d’ouverture avec {tool:protect}.',
        ],
      },
    ],
    'page-numbers': [
      {
        title: 'Quand l’utiliser',
        blocks: [
          'Pour des dossiers de candidature fusionnés, des rapports à imprimer et relier, ou des documents de réunion où l’on doit pouvoir dire « voyez la page 12 ».',
        ],
      },
      {
        title: 'Ce que vous pouvez régler',
        blocks: [
          'La position (à gauche, au centre ou à droite, en haut ou en bas), le format du numéro, le numéro de départ, la taille du texte et la marge. Pour ignorer la page de garde et commencer la numérotation à la première page de contenu, choisissez « {ui:tools.page-numbers.ui.pagesCustom} » pour les pages, indiquez à partir de la page 2 et laissez le numéro de départ à 1. Vérifiez l’aperçu avant d’appliquer.',
        ],
      },
      {
        title: 'Bon à savoir',
        blocks: [
          'Numérotez en dernier. Si vous réordonnez les pages ensuite, les numéros seront mélangés : fixez d’abord l’ordre avec {tool:merge} ou {tool:organize}.',
        ],
      },
    ],
    sign: [
      {
        title: 'Quand l’utiliser',
        blocks: [
          { list: [
            'Signer un contrat ou un formulaire de consentement reçu par e-mail et le renvoyer aussitôt, sans imprimer, signer puis scanner',
            'Remettre une demande ou une note de frais qui exige une signature ou un tampon à côté de votre nom',
            'Ajouter une signature sur chaque page d’un contrat de plusieurs pages',
          ] },
        ],
      },
      {
        title: 'Trois façons de créer la signature',
        blocks: [
          { list: [
            '{ui:tools.sign.ui.modeDraw} : tracez-la à la souris ou au doigt. Sur téléphone, signer au doigt donne le rendu le plus naturel.',
            '{ui:tools.sign.ui.modeType} : tapez votre nom et choisissez le style {ui:tools.sign.ui.styleScript}, {ui:tools.sign.ui.styleSerif} ou {ui:tools.sign.ui.styleSans}.',
            '{ui:tools.sign.ui.modeImage} : importez la photo d’une signature ou d’un tampon sur papier. Activez « {ui:tools.sign.ui.removeBackground} » pour rendre le papier transparent et intégrer la signature naturellement à la page.',
          ] },
          'Une fois la signature prête, cliquez sur la page pour la placer à cet endroit. Faites-la glisser pour la déplacer, tirez le coin inférieur droit pour la redimensionner et changez de page pour la placer à plusieurs endroits. Sur une page pivotée, elle est placée exactement comme vous la voyez à l’écran.',
        ],
      },
      {
        title: 'Bon à savoir',
        blocks: [
          { list: [
            'Cet outil place une image de votre signature sur la page. C’est courant pour les contrats et formulaires du quotidien ; si une signature électronique avec certificat est exigée, suivez la méthode indiquée par l’organisme.',
            'Pour empêcher d’autres personnes de modifier le fichier signé, limitez la modification ou ajoutez un mot de passe d’ouverture avec {tool:protect}.',
            'Si les documents à signer sont répartis dans plusieurs fichiers, regroupez-les d’abord avec {tool:merge} pour tout signer en une fois.',
            'La signature dessinée et les images importées ne servent que dans ce navigateur et disparaissent à la fermeture de la page.',
          ] },
        ],
      },
    ],
    protect: [
      {
        title: 'Quand l’utiliser',
        blocks: [
          'Pour envoyer des bulletins de paie, des contrats ou des documents médicaux et financiers que seul le destinataire doit lire.',
        ],
      },
      {
        title: 'Mot de passe et autorisations',
        blocks: [
          'L’ensemble du document est chiffré en AES-256 et ne peut pas être ouvert sans le mot de passe. Les autorisations facultatives contrôlent l’impression, la copie, la modification et les annotations, mais ce sont des indications que les lecteurs PDF sont priés de respecter, pas un véritable chiffrement.',
          'Le chiffrement a lieu dans votre navigateur et le mot de passe n’est enregistré nulle part. Cela signifie aussi que si vous l’oubliez, personne — nous non plus — ne peut le récupérer.',
        ],
      },
      {
        title: 'Bon à savoir',
        blocks: [
          { list: [
            'Utilisez un mot de passe long, de 12 caractères ou plus, et évitez les dates de naissance ou les numéros de téléphone.',
            'Envoyez le fichier par e-mail et le mot de passe par SMS ou par téléphone.',
          ] },
        ],
      },
    ],
    unlock: [
      {
        title: 'Quand l’utiliser',
        blocks: [
          'Pour conserver vos propres documents protégés, comme des relevés mensuels, sans retaper le mot de passe à chaque fois, ou pour lever les restrictions d’impression et de copie de vos fichiers.',
        ],
      },
      {
        title: 'Comment ça marche',
        blocks: [
          'Lorsque vous choisissez un fichier, l’outil indique d’abord le type de protection appliqué. Les fichiers avec mot de passe d’ouverture nécessitent le mot de passe que vous connaissez ; ceux qui n’ont que des restrictions d’autorisations sont libérés sans mot de passe. Si un fichier n’est pas protégé, l’outil vous indique que vous pouvez l’utiliser tel quel.',
        ],
      },
      {
        title: 'Bon à savoir',
        blocks: [
          'Un fichier dont vous ne connaissez pas le mot de passe ne peut pas être déverrouillé : l’outil ne devine pas les mots de passe. Retirer la protection du document de quelqu’un d’autre sans autorisation peut enfreindre le droit d’auteur ou un contrat ; utilisez-le uniquement sur vos fichiers ou sur ceux que vous êtes autorisé à modifier.',
        ],
      },
    ],
  },
};
