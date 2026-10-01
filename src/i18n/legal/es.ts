import type { LegalText } from './types';

export const es: LegalText = {
  about: [
    {
      blocks: [
        '{site} es un conjunto de herramientas PDF gratuitas que cualquiera puede usar con tranquilidad. Solo necesitas un navegador web, sin instalar nada y sin crear una cuenta, para unir, dividir, reordenar, comprimir y convertir archivos PDF.',
      ],
    },
    {
      title: 'Herramientas PDF que nunca suben tus archivos',
      blocks: [
        'La mayoría de los servicios de PDF online suben tus archivos a sus servidores. {site} usa WebAssembly y tecnología moderna del navegador para hacer <strong>todo el procesamiento en tu propio dispositivo</strong>. Contratos, certificados y copias de documentos de identidad nunca salen de tu ordenador, y no hay que esperar subidas ni descargas.',
      ],
    },
    { title: 'Herramientas', blocks: ['{tools}'] },
    {
      title: 'Cómo se financia el sitio',
      blocks: [
        'Todas las herramientas son gratuitas. El sitio se financia con los anuncios que se muestran en sus páginas. Como los archivos no se procesan en servidores, los costes de funcionamiento son bajos, por lo que no hay límites de uso ni de tamaño de archivo.',
      ],
    },
    { title: 'Código abierto', blocks: ['Este servicio está construido con estos proyectos de código abierto:', '{opensource}'] },
    { title: 'Contacto', blocks: ['{contact}'] },
  ],
  privacy: [
    {
      blocks: ['{site} («el sitio») respeta tu privacidad. Esta política explica qué información trata el sitio y cómo lo hace.'],
    },
    {
      title: '1. Tus archivos',
      blocks: [
        'Los archivos PDF y de imagen <strong>se procesan íntegramente en tu dispositivo, dentro de tu navegador web. Nunca se suben a nuestros servidores ni se comparten con terceros.</strong> Los datos de trabajo solo existen en la memoria del navegador y desaparecen al cerrar la página. Si usas «Continuar con», el archivo resultante se guarda en el almacenamiento interno de tu navegador (IndexedDB) durante un máximo de 10 minutos para que la siguiente herramienta pueda abrirlo; tampoco se envía a ningún sitio.',
      ],
    },
    {
      title: '2. Información recopilada',
      blocks: [
        'El sitio no tiene cuentas de usuario y nunca te pide tu nombre ni tus datos de contacto. Sin embargo, la siguiente información puede generarse automáticamente y ser tratada por los proveedores de alojamiento, analítica y publicidad:',
        {
          list: [
            'Registros de acceso (dirección IP, hora de la visita, páginas visitadas) e información del navegador y del dispositivo',
            'Cookies e identificadores publicitarios (cuando se muestran anuncios)',
          ],
        },
      ],
    },
    {
      title: '3. Cookies y publicidad',
      blocks: [
        'El sitio puede mostrar anuncios de Google AdSense para cubrir sus costes de funcionamiento. Los proveedores externos, incluido Google, usan cookies para mostrar anuncios basados en tus visitas anteriores a este sitio o a otros sitios web. El uso de cookies publicitarias permite a Google y a sus socios mostrarte anuncios basados en tus visitas a este y otros sitios de Internet.',
        {
          list: [
            'Puedes desactivar la publicidad personalizada en la <a href="https://adssettings.google.com" rel="noopener" target="_blank">configuración de anuncios de Google</a>.',
            'Puedes desactivar las cookies de proveedores externos para publicidad personalizada en <a href="https://www.aboutads.info/choices/" rel="noopener" target="_blank">www.aboutads.info</a>.',
            'Más información en <a href="https://policies.google.com/technologies/partner-sites" rel="noopener" target="_blank">Cómo utiliza Google la información de sitios web o aplicaciones que utilizan sus servicios</a>.',
            'Puedes bloquear las cookies en la configuración de tu navegador; las herramientas PDF siguen funcionando sin ellas.',
          ],
        },
      ],
    },
    {
      title: '4. Analítica',
      blocks: [
        'Para mejorar el servicio, el sitio puede recopilar estadísticas de visitas con Cloudflare Web Analytics (sin cookies) o Google Analytics. Estas estadísticas solo se usan de forma agregada y no te identifican.',
      ],
    },
    {
      title: '5. Cesión de datos',
      blocks: [
        'No vendemos ni compartimos tu información personal. Nuestro proveedor de alojamiento (por ejemplo, Cloudflare) y los proveedores de publicidad o analítica pueden tratar la información de la sección 2 según sus propias políticas de privacidad para prestar sus servicios.',
      ],
    },
    {
      title: '6. Conservación',
      blocks: [
        'No almacenamos tu información personal. La información tratada por proveedores externos se conserva según sus propias políticas.',
      ],
    },
    {
      title: '7. Tus derechos',
      blocks: [
        'Puedes eliminar o bloquear las cookies en cualquier momento desde la configuración de tu navegador y contactarnos con cualquier pregunta o solicitud sobre privacidad.',
      ],
    },
    { title: '8. Menores', blocks: ['El sitio no recopila de forma consciente información personal de menores.'] },
    { title: '9. Contacto', blocks: ['{contact}'] },
    { title: '10. Cambios', blocks: ['Esta política está vigente desde el {date}. Cualquier cambio se publicará en esta página.'] },
  ],
  terms: [
    { title: '1. Ámbito', blocks: ['Estos términos regulan el uso de las herramientas PDF que ofrece {site} («el sitio»).'] },
    {
      title: '2. El servicio',
      blocks: [
        'El sitio ofrece herramientas gratuitas para unir, dividir, organizar, comprimir, convertir, añadir marcas de agua, proteger y desbloquear archivos PDF. Todo el procesamiento ocurre dentro de tu navegador y tus archivos nunca se suben.',
      ],
    },
    {
      title: '3. Tus responsabilidades',
      blocks: [
        {
          list: [
            'Procesa solo archivos que tengas derecho a usar.',
            'No uses el servicio para infringir los derechos de autor, la privacidad u otros derechos de terceros.',
            'Usa la herramienta de desbloqueo solo con documentos que te pertenezcan o que estés autorizado a modificar.',
            'No interfieras con el funcionamiento normal del servicio.',
          ],
        },
      ],
    },
    {
      title: '4. Exención de responsabilidad',
      blocks: [
        {
          list: [
            'El servicio se ofrece «tal cual», sin garantías de exactitud, integridad o idoneidad para un fin concreto.',
            'Conserva siempre una copia de tus archivos originales.',
            'En la medida en que lo permita la ley, el sitio no se hace responsable de la pérdida de datos ni de otros daños derivados del uso del servicio.',
          ],
        },
      ],
    },
    { title: '5. Publicidad', blocks: ['El sitio puede mostrar anuncios para financiar su funcionamiento.'] },
    {
      title: '6. Cambios en el servicio',
      blocks: ['El sitio puede modificar, suspender o interrumpir total o parcialmente el servicio en cualquier momento.'],
    },
    { title: '7. Ley aplicable', blocks: ['Estos términos se rigen por las leyes de la República de Corea.'] },
    { title: '8. Fecha de entrada en vigor', blocks: ['Estos términos están vigentes desde el {date}.'] },
  ],
  contact: {
    about: 'Sugerencias, informes de errores y propuestas de colaboración: {email}',
    privacy: 'Preguntas sobre privacidad: {email}',
    none: 'Si tienes alguna pregunta, ponte en contacto con el responsable del sitio.',
  },
  listSeparator: ', ',
};
