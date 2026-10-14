// Español: sección «Más sobre…» de cada herramienta. {tool:id} se convierte en un enlace y {ui:…} en el texto de la interfaz.
import type { ToolDetailSet } from '../types';

export const es: ToolDetailSet = {
  title: 'Más sobre {tool}',
  sections: {
    merge: [
      {
        title: 'Cuándo usarla',
        blocks: [
          { list: [
            'Cuando una solicitud de empleo, beca o préstamo pide «todos los documentos en un solo PDF»',
            'Para reunir en un archivo los extractos o facturas que recibes cada mes',
            'Para unir los capítulos de un informe escritos por distintas personas',
          ] },
        ],
      },
      {
        title: 'Cómo funciona',
        blocks: [
          'Las páginas de cada PDF se copian tal cual al archivo nuevo, sin volver a dibujarlas. Por eso el texto sigue pudiéndose seleccionar y buscar, y las imágenes conservan su calidad. La lista muestra una vista previa de la primera página y el número de páginas de cada archivo, para que compruebes el contenido antes de ordenarlo arrastrando.',
        ],
      },
      {
        title: 'Conviene saber',
        blocks: [
          { list: [
            'Si pones números de dos cifras al principio del nombre (01_, 02_…), los archivos llegan ya ordenados.',
            'Los PDF con contraseña se pueden añadir escribiendo su contraseña; el archivo combinado no tendrá contraseña.',
            'Para quitar o girar páginas sueltas después, envía el resultado a {tool:organize} con «{ui:ui.continueWith}».',
            'Si los escaneos hacen que el archivo pese mucho, continúa con {tool:compress}.',
          ] },
        ],
      },
    ],
    split: [
      {
        title: 'Cuándo usarla',
        blocks: [
          { list: [
            'Para separar un lote escaneado en un archivo por persona o por trámite',
            'Para enviar un PDF grande en varias partes por un límite de tamaño',
            'Para dividir un libro o unos apuntes en capítulos',
          ] },
        ],
      },
      {
        title: 'Tres formas de dividir',
        blocks: [
          { table: {
            head: ['Modo', 'Ejemplo', 'Resultado'],
            rows: [
              ['{ui:tools.split.ui.modeRanges}', '1-3, 4-6, 7-', 'Un PDF por rango («7-» significa de la página 7 al final)'],
              ['{ui:tools.split.ui.modeEvery}', '2', 'Un PDF nuevo cada dos páginas'],
              ['{ui:tools.split.ui.modeEach}', '-', 'Un PDF por página'],
            ],
          } },
          'Antes de dividir, la herramienta indica cuántos archivos se van a crear. Si son varios, puedes descargarlos juntos en un único ZIP.',
        ],
      },
      {
        title: 'Conviene saber',
        blocks: [
          'Si solo necesitas algunas partes, {tool:extract-pages} es más rápido. Las páginas se copian sin cambios, así que los archivos resultantes tienen exactamente la calidad del original.',
        ],
      },
    ],
    organize: [
      {
        title: 'Cuándo usarla',
        blocks: [
          'Es la herramienta para documentos que necesitan varios arreglos a la vez: escaneos desordenados, escaneos a doble cara con reversos en blanco o documentos para imprimir en los que hay que intercalar una página en blanco.',
        ],
      },
      {
        title: 'Qué puedes hacer',
        blocks: [
          { list: [
            'Arrastrar páginas para cambiar su orden',
            'Seleccionar varias páginas y girarlas o eliminarlas juntas (Mayús + clic selecciona un intervalo)',
            'Duplicar páginas e insertar páginas en blanco',
            'Añadir otro PDF y mezclar sus páginas',
            'Deshacer y rehacer cualquier cambio',
          ] },
          'No se guarda nada hasta que pulsas «{ui:tools.organize.ui.action}», así que puedes probar con tranquilidad.',
        ],
      },
      {
        title: 'Conviene saber',
        blocks: [
          'Si solo necesitas girar, {tool:rotate} es más sencillo; para eliminar, {tool:delete-pages}. Los documentos de cientos de páginas tardan en mostrar las vistas previas, así que separar antes la parte que necesitas con {tool:split} puede ahorrarte tiempo.',
        ],
      },
    ],
    rotate: [
      {
        title: 'Cuándo usarla',
        blocks: [
          'Para páginas que entraron al escáner del revés, tablas apaisadas dentro de un documento vertical o páginas tumbadas en un PDF hecho con fotos del móvil.',
        ],
      },
      {
        title: 'Cómo funciona',
        blocks: [
          'Cada clic gira la página 90° en el sentido de las agujas del reloj, y «{ui:tools.rotate.ui.rotateAllLeft}» o «{ui:tools.rotate.ui.rotateAllRight}» giran todas a la vez. Solo cambia la orientación de la página; no se vuelve a dibujar nada, así que la calidad no se toca y el texto sigue siendo seleccionable.',
        ],
      },
      {
        title: 'Conviene saber',
        blocks: [
          'Si además tienes que reordenar o eliminar páginas, {tool:organize} lo hace todo de una vez. El «girar vista» de los lectores de PDF normalmente no se guarda en el archivo; para dejar la orientación corregida de forma permanente, guarda el resultado con esta herramienta.',
        ],
      },
    ],
    'delete-pages': [
      {
        title: 'Cuándo usarla',
        blocks: [
          { list: [
            'Para quitar los reversos en blanco de un escaneo a doble cara',
            'Para eliminar la portada o una página de instrucciones antes de entregar un documento',
            'Para quitar páginas de fotos innecesarias y reducir el tamaño',
          ] },
        ],
      },
      {
        title: 'Cómo funciona',
        blocks: [
          'Haz clic en las páginas que quieres eliminar; el botón muestra cuántas se quitarán. Las páginas restantes se copian sin cambios a un archivo nuevo, de modo que la calidad es la misma. La herramienta no te deja borrar todas las páginas por error.',
        ],
      },
      {
        title: 'Conviene saber',
        blocks: [
          'Si vas a conservar muchas menos páginas de las que quitas, selecciona las que quieres en {tool:extract-pages}: necesitarás menos clics.',
        ],
      },
    ],
    'extract-pages': [
      {
        title: 'Cuándo usarla',
        blocks: [
          'Para enviar unas pocas páginas de un informe largo, guardar solo la página de firmas de un contrato o sacar de un PDF de apuntes las páginas de los deberes.',
        ],
      },
      {
        title: 'Dos formas de guardar',
        blocks: [
          { list: [
            '{ui:tools.extract-pages.ui.outputSingle}: las páginas elegidas, en su orden original, en un único archivo nuevo.',
            '{ui:tools.extract-pages.ui.outputSeparate}: cada página elegida como un PDF independiente, descargables juntos en un ZIP.',
          ] },
          'Los datos de la página se copian sin cambios, así que la selección de texto, los enlaces y la calidad de imagen son iguales que en el original.',
        ],
      },
      {
        title: 'Conviene saber',
        blocks: [
          '¿Necesitas imágenes en lugar de PDF? Usa {tool:pdf-to-jpg}. Pero si solo quieres pasar parte de un documento, las páginas extraídas en PDF se ven más nítidas y pesan menos que las imágenes.',
        ],
      },
    ],
    compress: [
      {
        title: 'Cuándo usarla',
        blocks: [
          'Cuando un correo o un formulario de envío rechaza un archivo por ser demasiado grande, o antes de archivar escaneos y PDF con muchas fotos. Los documentos de texto ya son pequeños y apenas se reducen.',
        ],
      },
      {
        title: 'Niveles de compresión',
        blocks: [
          { table: {
            head: ['Nivel', 'Lado mayor de la imagen', 'Calidad JPEG', 'Ideal para'],
            rows: [
              ['{ui:tools.compress.ui.levelLow}', '2.400 px', '82 %', 'Imprimir, material donde importa la foto'],
              ['{ui:tools.compress.ui.levelMedium}', '1.700 px', '68 %', 'Adjuntos de correo y la mayoría de trámites'],
              ['{ui:tools.compress.ui.levelHigh}', '1.200 px', '50 %', 'Límites de tamaño muy estrictos'],
            ],
          } },
          'Solo se vuelven a codificar las imágenes del PDF; el texto y los gráficos vectoriales no se tocan, así que el texto sigue siendo seleccionable y se puede buscar. Las imágenes que no se reducirían al menos un 10 % se dejan como estaban para proteger su calidad.',
        ],
      },
      {
        title: 'Sobre «{ui:tools.compress.ui.rasterize}»',
        blocks: [
          'Cuando la compresión de imágenes no basta, esta opción vuelve a dibujar cada página como una imagen a 150, 120 o 96 DPI según el nivel. Es muy eficaz con documentos escaneados, pero el texto deja de poder seleccionarse o buscarse, así que úsala para copias que solo hay que leer.',
        ],
      },
      {
        title: 'Conviene saber',
        blocks: [
          { list: [
            'No vuelvas a comprimir un archivo ya comprimido: solo pierde calidad. Para subir de nivel, empieza otra vez desde el original.',
            'Quitar antes las páginas innecesarias con {tool:delete-pages} hace que la compresión sea más eficaz.',
          ] },
        ],
      },
    ],
    'jpg-to-pdf': [
      {
        title: 'Cuándo usarla',
        blocks: [
          'Para convertir fotos del móvil de recibos, formularios o apuntes a mano en un único documento para entregar o guardar. Admite imágenes JPG, PNG, WebP, GIF y BMP, y endereza las fotos según su orientación EXIF.',
        ],
      },
      {
        title: 'Cómo elegir los ajustes',
        blocks: [
          { table: {
            head: ['Ajuste', 'Opciones', 'Recomendado'],
            rows: [
              ['{ui:tools.jpg-to-pdf.ui.pageSize}', '{ui:tools.jpg-to-pdf.ui.sizeFit} / A4 / Letter', 'A4 para imprimir y entregar; {ui:tools.jpg-to-pdf.ui.sizeFit} para archivar fotos'],
              ['{ui:tools.jpg-to-pdf.ui.orientation}', '{ui:tools.jpg-to-pdf.ui.orientAuto} / {ui:tools.jpg-to-pdf.ui.orientPortrait} / {ui:tools.jpg-to-pdf.ui.orientLandscape}', '{ui:tools.jpg-to-pdf.ui.orientAuto} en casi todos los casos'],
              ['{ui:tools.jpg-to-pdf.ui.margin}', '{ui:tools.jpg-to-pdf.ui.marginNone} / {ui:tools.jpg-to-pdf.ui.marginSmall} / {ui:tools.jpg-to-pdf.ui.marginLarge}', '{ui:tools.jpg-to-pdf.ui.marginSmall} para imprimir; {ui:tools.jpg-to-pdf.ui.marginNone} para ver en pantalla'],
            ],
          } },
          'Con A4 o Letter, cada foto se ajusta a la página manteniendo sus proporciones, así que todas las páginas salen del mismo tamaño aunque las fotos sean distintas.',
        ],
      },
      {
        title: 'Conviene saber',
        blocks: [
          { list: [
            'Hacer la foto con buena luz, sin sombras y con el móvil paralelo al papel marca una gran diferencia. Apaga el flash: el papel brillante lo refleja.',
            'Cada foto del móvil pesa varios megas, así que el PDF crece rápido. Desde la pantalla de resultado puedes enviarlo directamente a {tool:compress}.',
          ] },
        ],
      },
    ],
    'word-to-pdf': [
      {
        title: 'Cuándo usarlo',
        blocks: [
          { list: [
            'Entregar un currículum o una carta de presentación en PDF, para que se vea igual en cualquier ordenador',
            'Enviar un contrato o un informe en PDF para que no se modifique fácilmente',
            'Convertir a PDF un DOCX recibido desde un ordenador o móvil sin Word',
          ] },
        ],
      },
      {
        title: 'Cómo funciona',
        blocks: [
          'Esta herramienta ejecuta en tu navegador un conversor creado a partir de LibreOffice, la suite ofimática, compilado a WebAssembly. Por eso convierte documentos de Word a PDF sin subirlos a un servidor, como hacen otras webs de conversión.',
          'El conversor (unos 50 MB) se descarga una vez y el navegador lo guarda, así que las siguientes conversiones empiezan en segundos. Si el documento contiene coreano, japonés o chino, solo se descargan además las fuentes necesarias.',
        ],
      },
      {
        title: 'Conviene saber',
        blocks: [
          { list: [
            'Fuentes como Calibri o Cambria no están incluidas, así que se usan fuentes libres del mismo ancho (Carlito, Caladea). Aun así, los saltos de línea pueden variar un poco: revisa el resultado antes de entregarlo.',
            'Si el documento conserva control de cambios, pueden aparecer las marcas de revisión. Para una versión final limpia, acepta todos los cambios en Word antes de convertir. Los comentarios no se incluyen en el PDF.',
            'Para juntar varios documentos en un PDF, conviértelos y usa {tool:merge}; si el archivo pesa mucho, redúcelo con {tool:compress}.',
          ] },
        ],
      },
    ],
    'ppt-to-pdf': [
      {
        title: 'Cuándo usarlo',
        blocks: [
          { list: [
            'Enviar diapositivas a un profesor o cliente que quizá no tenga PowerPoint ni tus fuentes',
            'Imprimir apuntes de clase o anotarlos en una tableta',
            'Convertir un PPT pesado en un PDF más fácil de enviar por correo',
          ] },
        ],
      },
      {
        title: 'Cómo funciona',
        blocks: [
          'Un conversor creado a partir de LibreOffice y compilado a WebAssembly dibuja tus diapositivas en un PDF dentro del navegador. No se sube nada, así que las presentaciones internas o inéditas se quedan en tu dispositivo.',
          'Cada diapositiva es una página del PDF y el tamaño de la diapositiva (16:9, 4:3, etc.) pasa a ser el tamaño de página. El conversor (unos 50 MB) se descarga una vez y después empieza al instante.',
        ],
      },
      {
        title: 'Conviene saber',
        blocks: [
          { list: [
            'Las animaciones aparecen en su estado final, y el vídeo y el audio no se reproducen.',
            'Las notas del orador y las diapositivas ocultas no se incluyen.',
            'Fuentes como Calibri se sustituyen por fuentes libres parecidas, así que el ancho del texto puede cambiar un poco. Revisa los cuadros de texto llenos hasta el borde.',
            'Para repartir varias diapositivas por hoja, elige «varias páginas por hoja» al imprimir. Para reducir el tamaño usa {tool:compress}; para pasar diapositivas a imágenes, {tool:pdf-to-jpg}.',
          ] },
        ],
      },
    ],
    'hwp-to-pdf': [
      {
        title: 'Cuándo usarlo',
        blocks: [
          { list: [
            'Abrir un documento HWP de una escuela, empresa u organismo coreano en un ordenador o móvil sin Hancom Office',
            'Entregar una solicitud, tarea o formulario que debe enviarse en PDF',
            'Imprimir un HWP en un Mac o Chromebook donde es difícil instalar Hancom Office',
          ] },
        ],
      },
      {
        title: 'Cómo funciona',
        blocks: [
          'rhwp, un motor de código abierto para HWP y HWPX (licencia MIT), dibuja cada página del documento en tu navegador y ese dibujo se convierte en el PDF. No se sube nada, así que los formularios con datos personales se quedan en tu dispositivo.',
          'El motor y las fuentes (unos 6 MB) se descargan una vez. Si el documento usa hanja o símbolos como ① y ㉠ que no tienen las fuentes Nanum, también se descarga una vez una fuente de apoyo (Noto Sans KR).',
        ],
      },
      {
        title: 'Conviene saber',
        blocks: [
          { list: [
            'Las fuentes de Hancom y Windows como Hamchorom Batang, Malgun Gothic o las HY no se pueden incluir, así que se usan Nanum Myeongjo y Nanum Gothic. Cada carácter queda donde lo pone el original, por lo que los saltos de línea coinciden, aunque la forma de las letras puede variar un poco.',
            'El texto del PDF es texto real: se puede buscar y copiar y se ve nítido al ampliarlo.',
            'Los documentos con contraseña o de solo distribución no se pueden convertir. Quita la contraseña en Hancom Office y vuelve a intentarlo.',
            'Para juntar varios documentos, conviértelos y usa {tool:merge}; si el archivo pesa demasiado para entregarlo, redúcelo con {tool:compress}.',
          ] },
        ],
      },
    ],
    'pdf-to-jpg': [
      {
        title: 'Cuándo usarla',
        blocks: [
          'Para publicar una página de un PDF en un blog o en redes sociales, insertarla como imagen en una presentación o documento, o enviarla por chat a alguien que no puede abrir PDF con facilidad.',
        ],
      },
      {
        title: 'Elegir resolución y formato',
        blocks: [
          { table: {
            head: ['Resolución', 'Página A4 en píxeles', 'Uso'],
            rows: [
              ['{ui:tools.pdf-to-jpg.ui.dpiLow}', 'unos 595 × 842', 'Vistas previas, compartir rápido'],
              ['{ui:tools.pdf-to-jpg.ui.dpiMedium}', 'unos 1.240 × 1.754', 'Publicar en la web, leer en pantalla'],
              ['{ui:tools.pdf-to-jpg.ui.dpiHigh}', 'unos 2.480 × 3.508', 'Imprimir, ampliar letra pequeña'],
            ],
          } },
          'Duplicar los DPI duplica el ancho y el alto, así que la imagen tiene cuatro veces más píxeles y el archivo crece más o menos lo mismo. Elige PNG para páginas de texto y tablas, y JPG para páginas con muchas fotos. Puedes convertir solo las páginas que selecciones y descargar varias imágenes en un ZIP.',
        ],
      },
      {
        title: 'Conviene saber',
        blocks: [
          'En una imagen el texto ya no se puede seleccionar ni buscar. Si solo quieres pasar parte de un documento, extrae las páginas en PDF con {tool:extract-pages}.',
        ],
      },
    ],
    watermark: [
      {
        title: 'Cuándo usarla',
        blocks: [
          { list: [
            'Para marcar documentos internos como «Confidencial» o «Borrador»',
            'Para indicar en la copia de un documento de identidad para qué se entrega, de modo que no pueda reutilizarse fácilmente',
            'Para añadir tu logotipo a un portafolio o a unos apuntes',
          ] },
        ],
      },
      {
        title: 'Qué puedes ajustar',
        blocks: [
          'Elige un texto o una imagen de logotipo y ajusta color, tamaño, opacidad y ángulo. «{ui:tools.watermark.ui.layoutCenter}» coloca una sola marca en el centro de la página, mientras que «{ui:tools.watermark.ui.layoutTile}» la repite por toda la página. Puedes aplicarla a todas las páginas o solo a las que indiques, y comprobar el resultado en la vista previa de la primera página.',
        ],
      },
      {
        title: 'Conviene saber',
        blocks: [
          'Para desalentar filtraciones, una disposición «{ui:tools.watermark.ui.layoutTile}» con un 20–30 % de opacidad es difícil de recortar. Una marca de agua no oculta el contenido; si nadie más debe leer el archivo, añade también una contraseña de apertura con {tool:protect}.',
        ],
      },
    ],
    'page-numbers': [
      {
        title: 'Cuándo usarla',
        blocks: [
          'Para expedientes de solicitud combinados, informes que se van a imprimir y encuadernar, o documentos de reunión en los que hay que decir «vayan a la página 12».',
        ],
      },
      {
        title: 'Qué puedes ajustar',
        blocks: [
          'Posición (izquierda, centro o derecha, arriba o abajo), formato del número, número inicial, tamaño de letra y margen. Para saltarte la portada y empezar a numerar en la primera página de contenido, elige «{ui:tools.page-numbers.ui.pagesCustom}» en las páginas, escribe desde la página 2 en adelante y deja el número inicial en 1. Comprueba la vista previa antes de aplicar.',
        ],
      },
      {
        title: 'Conviene saber',
        blocks: [
          'Numera al final. Si reordenas páginas después, los números quedarán desordenados, así que fija antes el orden con {tool:merge} o {tool:organize}.',
        ],
      },
    ],
    sign: [
      {
        title: 'Cuándo usarlo',
        blocks: [
          { list: [
            'Firmar un contrato o un consentimiento recibido por correo y devolverlo enseguida, sin imprimir, firmar y escanear',
            'Entregar una solicitud o una hoja de gastos que necesita firma o sello junto a tu nombre',
            'Añadir una firma en cada página de un contrato de varias páginas',
          ] },
        ],
      },
      {
        title: 'Tres formas de crear la firma',
        blocks: [
          { list: [
            '{ui:tools.sign.ui.modeDraw}: dibújala con el ratón o con el dedo. En el móvil, firmar con el dedo da el resultado más natural.',
            '{ui:tools.sign.ui.modeType}: escribe tu nombre y elige el estilo {ui:tools.sign.ui.styleScript}, {ui:tools.sign.ui.styleSerif} o {ui:tools.sign.ui.styleSans}.',
            '{ui:tools.sign.ui.modeImage}: sube una foto de una firma o un sello en papel. Activa «{ui:tools.sign.ui.removeBackground}» para que el papel se vuelva transparente y quede natural sobre la página.',
          ] },
          'Cuando la firma esté lista, haz clic en la página para colocarla ahí. Arrástrala para moverla, tira de la esquina inferior derecha para cambiar el tamaño y cambia de página para colocarla en varios sitios. En las páginas giradas se coloca tal como la ves en pantalla.',
        ],
      },
      {
        title: 'Conviene saber',
        blocks: [
          { list: [
            'Esta herramienta coloca una imagen de tu firma en la página. Es lo habitual en contratos y formularios cotidianos; si se exige una firma digital con certificado, sigue el método que indique la entidad.',
            'Para que nadie modifique el archivo firmado, limita la edición o añade una contraseña de apertura con {tool:protect}.',
            'Si los documentos que debes firmar están en varios archivos, únelos antes con {tool:merge} para firmarlos de una vez.',
            'La firma que dibujas y las imágenes que subes solo se usan en este navegador y desaparecen al cerrar la página.',
          ] },
        ],
      },
    ],
    protect: [
      {
        title: 'Cuándo usarla',
        blocks: [
          'Para enviar nóminas, contratos o documentos médicos y financieros que solo debe leer el destinatario.',
        ],
      },
      {
        title: 'Contraseña y permisos',
        blocks: [
          'Todo el documento se cifra con AES-256, de modo que no puede abrirse sin la contraseña. Los permisos opcionales controlan la impresión, la copia, la edición y los comentarios, pero son indicaciones que se pide respetar a los lectores de PDF, no un cifrado real.',
          'El cifrado se hace en tu navegador y la contraseña no se guarda en ningún sitio. Eso también significa que, si la olvidas, nadie —tampoco nosotros— puede recuperarla.',
        ],
      },
      {
        title: 'Conviene saber',
        blocks: [
          { list: [
            'Usa una contraseña larga, de 12 caracteres o más, y evita fechas de nacimiento o números de teléfono.',
            'Envía el archivo por correo y la contraseña por SMS o por teléfono.',
          ] },
        ],
      },
    ],
    unlock: [
      {
        title: 'Cuándo usarla',
        blocks: [
          'Para guardar tus propios documentos protegidos, como los extractos mensuales, sin tener que escribir la contraseña cada vez, o para quitar las restricciones de impresión y copia de tus archivos.',
        ],
      },
      {
        title: 'Cómo funciona',
        blocks: [
          'Al elegir un archivo, la herramienta te dice primero qué tipo de protección tiene. Los archivos con contraseña de apertura necesitan la contraseña que conoces; los que solo tienen restricciones de permisos se liberan sin contraseña. Si un archivo no tiene protección, te avisa de que puedes usarlo tal cual.',
        ],
      },
      {
        title: 'Conviene saber',
        blocks: [
          'Los archivos cuya contraseña no conoces no se pueden desbloquear: la herramienta no adivina contraseñas. Quitar la protección del documento de otra persona sin permiso puede infringir derechos de autor o un acuerdo, así que úsala solo con archivos tuyos o que estés autorizado a modificar.',
        ],
      },
    ],
  },
};
