import type { LegalText } from './types';

export const fr: LegalText = {
  about: [
    {
      blocks: [
        '{site} est un ensemble d’outils PDF gratuits que chacun peut utiliser en toute confiance. Avec un simple navigateur — sans installation ni compte — vous pouvez fusionner, diviser, réorganiser, compresser et convertir vos fichiers PDF.',
      ],
    },
    {
      title: 'Des outils PDF qui ne téléversent jamais vos fichiers',
      blocks: [
        'La plupart des services PDF en ligne envoient vos fichiers sur leurs serveurs. {site} s’appuie sur WebAssembly et les technologies modernes du navigateur pour effectuer <strong>tout le traitement sur votre propre appareil</strong>. Contrats, attestations et copies de pièces d’identité ne quittent jamais votre ordinateur, et il n’y a aucune attente de téléversement ou de téléchargement.',
      ],
    },
    { title: 'Outils', blocks: ['{tools}'] },
    {
      title: 'Financement du site',
      blocks: [
        'Tous les outils sont gratuits. Le site est financé par les publicités affichées sur ses pages. Comme les fichiers ne sont pas traités sur des serveurs, les coûts de fonctionnement restent faibles, ce qui permet de ne fixer aucune limite d’utilisation ni de taille de fichier.',
      ],
    },
    { title: 'Logiciels libres', blocks: ['Ce service repose sur les projets open source suivants :', '{opensource}'] },
    { title: 'Contact', blocks: ['{contact}'] },
  ],
  privacy: [
    {
      blocks: ['{site} (« le site ») respecte votre vie privée. Cette politique explique quelles informations le site traite et de quelle manière.'],
    },
    {
      title: '1. Vos fichiers',
      blocks: [
        'Les fichiers PDF et images sont <strong>entièrement traités sur votre appareil, dans votre navigateur. Ils ne sont jamais envoyés sur nos serveurs ni communiqués à des tiers.</strong> Les données de travail n’existent que dans la mémoire du navigateur et disparaissent à la fermeture de la page. Si vous utilisez « Continuer avec », le fichier obtenu est conservé dans le stockage interne de votre navigateur (IndexedDB) pendant 10 minutes au maximum afin que l’outil suivant puisse l’ouvrir ; il n’est envoyé nulle part non plus.',
      ],
    },
    {
      title: '2. Informations collectées',
      blocks: [
        'Le site ne propose pas de comptes et ne vous demande jamais votre nom ni vos coordonnées. Toutefois, les informations suivantes peuvent être générées automatiquement et traitées par les prestataires d’hébergement, de mesure d’audience et de publicité :',
        {
          list: [
            'Journaux d’accès (adresse IP, heure de la visite, pages consultées), informations sur le navigateur et l’appareil',
            'Cookies et identifiants publicitaires (lorsque des publicités sont affichées)',
          ],
        },
      ],
    },
    {
      title: '3. Cookies et publicité',
      blocks: [
        'Le site peut afficher des annonces Google AdSense pour couvrir ses frais de fonctionnement. Des fournisseurs tiers, dont Google, utilisent des cookies pour diffuser des annonces en fonction de vos visites antérieures sur ce site ou sur d’autres sites. Les cookies publicitaires permettent à Google et à ses partenaires de diffuser des annonces en fonction de vos visites sur ce site et sur d’autres sites Internet.',
        {
          list: [
            'Vous pouvez désactiver la publicité personnalisée dans les <a href="https://adssettings.google.com" rel="noopener" target="_blank">paramètres des annonces Google</a>.',
            'Vous pouvez désactiver les cookies de fournisseurs tiers utilisés pour la publicité personnalisée sur <a href="https://www.aboutads.info/choices/" rel="noopener" target="_blank">www.aboutads.info</a>.',
            'Pour en savoir plus, consultez <a href="https://policies.google.com/technologies/partner-sites" rel="noopener" target="_blank">Comment Google utilise les informations des sites ou applications qui utilisent ses services</a>.',
            'Vous pouvez bloquer les cookies dans les paramètres de votre navigateur ; les outils PDF continuent de fonctionner sans eux.',
          ],
        },
      ],
    },
    {
      title: '4. Mesure d’audience',
      blocks: [
        'Pour améliorer le service, le site peut collecter des statistiques de visite avec Cloudflare Web Analytics (sans cookies) ou Google Analytics. Ces statistiques ne sont utilisées que sous forme agrégée et ne permettent pas de vous identifier.',
      ],
    },
    {
      title: '5. Partage',
      blocks: [
        'Nous ne vendons ni ne partageons vos données personnelles. Notre hébergeur (par exemple Cloudflare) et les prestataires de publicité ou de mesure d’audience peuvent traiter les informations de la section 2 conformément à leurs propres politiques de confidentialité afin de fournir leurs services.',
      ],
    },
    {
      title: '6. Conservation',
      blocks: [
        'Nous ne conservons pas nous-mêmes vos données personnelles. Les informations traitées par des prestataires tiers sont conservées selon leurs propres politiques.',
      ],
    },
    {
      title: '7. Vos droits',
      blocks: [
        'Vous pouvez à tout moment supprimer ou bloquer les cookies dans les paramètres de votre navigateur et nous contacter pour toute question ou demande relative à la confidentialité.',
      ],
    },
    { title: '8. Enfants', blocks: ['Le site ne collecte pas sciemment de données personnelles concernant des enfants.'] },
    { title: '9. Contact', blocks: ['{contact}'] },
    { title: '10. Modifications', blocks: ['Cette politique est en vigueur depuis le {date}. Toute modification sera publiée sur cette page.'] },
  ],
  terms: [
    { title: '1. Objet', blocks: ['Les présentes conditions régissent l’utilisation des outils PDF proposés par {site} (« le site »).'] },
    {
      title: '2. Le service',
      blocks: [
        'Le site propose des outils gratuits pour fusionner, diviser, organiser, compresser, convertir, filigraner, protéger et déverrouiller des fichiers PDF. Tout le traitement a lieu dans votre navigateur et vos fichiers ne sont jamais téléversés.',
      ],
    },
    {
      title: '3. Vos responsabilités',
      blocks: [
        {
          list: [
            'Ne traitez que des fichiers que vous avez le droit d’utiliser.',
            'N’utilisez pas le service pour porter atteinte aux droits d’auteur, à la vie privée ou à d’autres droits de tiers.',
            'N’utilisez l’outil de déverrouillage que sur des documents qui vous appartiennent ou que vous êtes autorisé à modifier.',
            'N’entravez pas le fonctionnement normal du service.',
          ],
        },
      ],
    },
    {
      title: '4. Limitation de responsabilité',
      blocks: [
        {
          list: [
            'Le service est fourni « en l’état », sans garantie d’exactitude, d’exhaustivité ou d’adéquation à un usage particulier.',
            'Conservez toujours une copie de vos fichiers d’origine.',
            'Dans les limites autorisées par la loi, le site n’est pas responsable des pertes de données ou autres dommages résultant de l’utilisation du service.',
          ],
        },
      ],
    },
    { title: '5. Publicité', blocks: ['Le site peut afficher des publicités pour financer son fonctionnement.'] },
    {
      title: '6. Modification du service',
      blocks: ['Le site peut modifier, suspendre ou interrompre tout ou partie du service à tout moment.'],
    },
    { title: '7. Droit applicable', blocks: ['Les présentes conditions sont régies par le droit de la République de Corée.'] },
    { title: '8. Date d’entrée en vigueur', blocks: ['Les présentes conditions sont en vigueur depuis le {date}.'] },
  ],
  contact: {
    about: 'Suggestions, signalements de bugs et propositions de partenariat : {email}',
    privacy: 'Questions relatives à la confidentialité : {email}',
    none: 'Pour toute question, veuillez contacter l’éditeur du site.',
  },
  listSeparator: ', ',
};
