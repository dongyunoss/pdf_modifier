// Português: seção "Mais sobre…" de cada ferramenta. {tool:id} vira um link e {ui:…} vira o texto da interface.
import type { ToolDetailSet } from '../types';

export const pt: ToolDetailSet = {
  title: 'Mais sobre {tool}',
  sections: {
    merge: [
      {
        title: 'Quando usar',
        blocks: [
          { list: [
            'Quando uma inscrição de emprego, bolsa ou financiamento pede "todos os documentos em um único PDF"',
            'Para juntar em um arquivo os extratos ou notas fiscais que chegam todo mês',
            'Para reunir capítulos de um relatório escritos por pessoas diferentes',
          ] },
        ],
      },
      {
        title: 'Como funciona',
        blocks: [
          'As páginas de cada PDF são copiadas para o novo arquivo sem serem redesenhadas. Por isso o texto continua selecionável e pesquisável, e as imagens mantêm a qualidade original. A lista mostra a prévia da primeira página e o número de páginas de cada arquivo, para você conferir o conteúdo antes de arrastar para ordenar.',
        ],
      },
      {
        title: 'Bom saber',
        blocks: [
          { list: [
            'Colocar números de dois dígitos no início do nome (01_, 02_…) faz os arquivos já chegarem em ordem.',
            'PDFs com senha podem ser incluídos digitando a senha ao adicioná-los; o arquivo final fica sem senha.',
            'Para tirar ou girar páginas soltas depois, envie o resultado para {tool:organize} com "{ui:ui.continueWith}".',
            'Se os escaneamentos deixarem o arquivo pesado, continue em {tool:compress}.',
          ] },
        ],
      },
    ],
    split: [
      {
        title: 'Quando usar',
        blocks: [
          { list: [
            'Para separar um lote escaneado em um arquivo por pessoa ou por processo',
            'Para enviar um PDF grande em partes por causa de um limite de tamanho',
            'Para dividir um livro ou apostila em capítulos',
          ] },
        ],
      },
      {
        title: 'Três formas de dividir',
        blocks: [
          { table: {
            head: ['Modo', 'Exemplo', 'Resultado'],
            rows: [
              ['{ui:tools.split.ui.modeRanges}', '1-3, 4-6, 7-', 'Um PDF por intervalo ("7-" vai da página 7 até o fim)'],
              ['{ui:tools.split.ui.modeEvery}', '2', 'Um novo PDF a cada duas páginas'],
              ['{ui:tools.split.ui.modeEach}', '-', 'Um PDF por página'],
            ],
          } },
          'Antes de dividir, a ferramenta mostra quantos arquivos serão criados. Se forem vários, você pode baixar todos juntos em um único ZIP.',
        ],
      },
      {
        title: 'Bom saber',
        blocks: [
          'Se você precisa só de algumas partes, {tool:extract-pages} é mais rápido. As páginas são copiadas sem alteração, então os arquivos divididos têm exatamente a qualidade do original.',
        ],
      },
    ],
    organize: [
      {
        title: 'Quando usar',
        blocks: [
          'É a ferramenta para documentos que precisam de vários ajustes ao mesmo tempo: escaneamentos fora de ordem, digitalizações frente e verso com versos em branco ou documentos para impressão que precisam de uma página em branco no meio.',
        ],
      },
      {
        title: 'O que dá para fazer',
        blocks: [
          { list: [
            'Arrastar páginas para mudar a ordem',
            'Selecionar várias páginas e girar ou excluir todas de uma vez (Shift + clique seleciona um intervalo)',
            'Duplicar páginas e inserir páginas em branco',
            'Adicionar outro PDF e misturar as páginas',
            'Desfazer e refazer qualquer alteração',
          ] },
          'Nada é gravado até você clicar em "{ui:tools.organize.ui.action}", então fique à vontade para testar.',
        ],
      },
      {
        title: 'Bom saber',
        blocks: [
          'Se você só precisa girar, {tool:rotate} é mais simples; para apenas excluir, {tool:delete-pages}. Documentos com centenas de páginas demoram para gerar as prévias, então separar antes a parte que interessa com {tool:split} pode economizar tempo.',
        ],
      },
    ],
    rotate: [
      {
        title: 'Quando usar',
        blocks: [
          'Para páginas que entraram de cabeça para baixo no scanner, tabelas na horizontal dentro de um documento vertical ou páginas deitadas em um PDF feito com fotos do celular.',
        ],
      },
      {
        title: 'Como funciona',
        blocks: [
          'Cada clique gira a página 90° no sentido horário, e "{ui:tools.rotate.ui.rotateAllLeft}" ou "{ui:tools.rotate.ui.rotateAllRight}" giram todas de uma vez. Só a orientação da página muda; nada é redesenhado, então a qualidade não é afetada e o texto continua selecionável.',
        ],
      },
      {
        title: 'Bom saber',
        blocks: [
          'Se também for preciso reordenar ou excluir páginas, {tool:organize} faz tudo de uma vez. O "girar visualização" dos leitores de PDF geralmente não é salvo no arquivo; para deixar a orientação corrigida de vez, salve o resultado com esta ferramenta.',
        ],
      },
    ],
    'delete-pages': [
      {
        title: 'Quando usar',
        blocks: [
          { list: [
            'Para remover os versos em branco de uma digitalização frente e verso',
            'Para tirar a capa ou uma página de instruções antes de enviar um documento',
            'Para cortar páginas de fotos desnecessárias e reduzir o tamanho',
          ] },
        ],
      },
      {
        title: 'Como funciona',
        blocks: [
          'Clique nas páginas que deseja remover; o botão mostra quantas serão excluídas. As páginas restantes são copiadas sem alteração para um novo arquivo, então a qualidade é a mesma. A ferramenta não deixa você apagar todas as páginas por engano.',
        ],
      },
      {
        title: 'Bom saber',
        blocks: [
          'Se você vai manter bem menos páginas do que vai remover, selecione as que ficam em {tool:extract-pages}: são menos cliques.',
        ],
      },
    ],
    'extract-pages': [
      {
        title: 'Quando usar',
        blocks: [
          'Para enviar algumas páginas de um relatório longo, guardar só a página de assinaturas de um contrato ou tirar de uma apostila em PDF apenas as páginas da lição de casa.',
        ],
      },
      {
        title: 'Duas formas de salvar',
        blocks: [
          { list: [
            '{ui:tools.extract-pages.ui.outputSingle}: as páginas escolhidas, na ordem original, em um único arquivo novo.',
            '{ui:tools.extract-pages.ui.outputSeparate}: cada página escolhida como um PDF separado, que podem ser baixados juntos em um ZIP.',
          ] },
          'Os dados da página são copiados sem alteração, então a seleção de texto, os links e a qualidade das imagens ficam iguais aos do original.',
        ],
      },
      {
        title: 'Bom saber',
        blocks: [
          'Precisa de imagens em vez de PDF? Use {tool:pdf-to-jpg}. Mas, se a ideia é só repassar parte de um documento, as páginas extraídas em PDF ficam mais nítidas e menores do que imagens.',
        ],
      },
    ],
    compress: [
      {
        title: 'Quando usar',
        blocks: [
          'Quando um e-mail ou formulário de envio recusa o arquivo por ser grande demais, ou antes de arquivar digitalizações e PDFs cheios de fotos. Documentos só de texto já são pequenos e quase não diminuem.',
        ],
      },
      {
        title: 'Níveis de compressão',
        blocks: [
          { table: {
            head: ['Nível', 'Maior lado da imagem', 'Qualidade JPEG', 'Indicado para'],
            rows: [
              ['{ui:tools.compress.ui.levelLow}', '2.400 px', '82%', 'Impressão, material em que a foto importa'],
              ['{ui:tools.compress.ui.levelMedium}', '1.700 px', '68%', 'Anexos de e-mail e a maioria dos envios'],
              ['{ui:tools.compress.ui.levelHigh}', '1.200 px', '50%', 'Limites de tamanho muito rígidos'],
            ],
          } },
          'Só as imagens dentro do PDF são recodificadas; o texto e os gráficos vetoriais ficam intactos, então o texto continua selecionável e pesquisável. Imagens que não diminuiriam pelo menos 10% são mantidas como estavam, para preservar a qualidade.',
        ],
      },
      {
        title: 'Sobre "{ui:tools.compress.ui.rasterize}"',
        blocks: [
          'Quando comprimir as imagens não basta, esta opção redesenha cada página como imagem a 150, 120 ou 96 DPI, conforme o nível. Funciona muito bem com documentos escaneados, mas o texto deixa de ser selecionável e pesquisável, então use para cópias que só precisam ser lidas.',
        ],
      },
      {
        title: 'Bom saber',
        blocks: [
          { list: [
            'Não comprima de novo um arquivo já comprimido: ele só perde qualidade. Para subir o nível, comece outra vez pelo original.',
            'Remover antes as páginas desnecessárias com {tool:delete-pages} deixa a compressão mais eficaz.',
          ] },
        ],
      },
    ],
    'jpg-to-pdf': [
      {
        title: 'Quando usar',
        blocks: [
          'Para transformar fotos de recibos, formulários e anotações à mão tiradas com o celular em um único documento para enviar ou guardar. Aceita imagens JPG, PNG, WebP, GIF e BMP e endireita as fotos de acordo com a orientação EXIF.',
        ],
      },
      {
        title: 'Como escolher as configurações',
        blocks: [
          { table: {
            head: ['Configuração', 'Opções', 'Recomendado'],
            rows: [
              ['{ui:tools.jpg-to-pdf.ui.pageSize}', '{ui:tools.jpg-to-pdf.ui.sizeFit} / A4 / Letter', 'A4 para imprimir e enviar; {ui:tools.jpg-to-pdf.ui.sizeFit} para arquivar fotos'],
              ['{ui:tools.jpg-to-pdf.ui.orientation}', '{ui:tools.jpg-to-pdf.ui.orientAuto} / {ui:tools.jpg-to-pdf.ui.orientPortrait} / {ui:tools.jpg-to-pdf.ui.orientLandscape}', '{ui:tools.jpg-to-pdf.ui.orientAuto} na maioria dos casos'],
              ['{ui:tools.jpg-to-pdf.ui.margin}', '{ui:tools.jpg-to-pdf.ui.marginNone} / {ui:tools.jpg-to-pdf.ui.marginSmall} / {ui:tools.jpg-to-pdf.ui.marginLarge}', '{ui:tools.jpg-to-pdf.ui.marginSmall} para imprimir; {ui:tools.jpg-to-pdf.ui.marginNone} para ver na tela'],
            ],
          } },
          'Com A4 ou Letter, cada foto é ajustada à página mantendo as proporções, então todas as páginas ficam do mesmo tamanho mesmo que as fotos sejam diferentes.',
        ],
      },
      {
        title: 'Bom saber',
        blocks: [
          { list: [
            'Fotografar com boa luz, sem sombras e com o celular paralelo ao papel faz muita diferença. Desligue o flash: papel brilhante reflete a luz.',
            'Cada foto do celular tem vários megabytes, então o PDF cresce rápido. Na tela de resultado você pode mandá-lo direto para {tool:compress}.',
          ] },
        ],
      },
    ],
    'pdf-to-jpg': [
      {
        title: 'Quando usar',
        blocks: [
          'Para publicar uma página de PDF em um blog ou rede social, inseri-la como imagem em uma apresentação ou documento, ou enviá-la pelo chat para alguém que não consegue abrir PDF com facilidade.',
        ],
      },
      {
        title: 'Escolhendo resolução e formato',
        blocks: [
          { table: {
            head: ['Resolução', 'Página A4 em pixels', 'Uso'],
            rows: [
              ['{ui:tools.pdf-to-jpg.ui.dpiLow}', 'cerca de 595 × 842', 'Prévias, compartilhamento rápido'],
              ['{ui:tools.pdf-to-jpg.ui.dpiMedium}', 'cerca de 1.240 × 1.754', 'Publicar na web, ler na tela'],
              ['{ui:tools.pdf-to-jpg.ui.dpiHigh}', 'cerca de 2.480 × 3.508', 'Imprimir, ampliar letras pequenas'],
            ],
          } },
          'Dobrar o DPI dobra a largura e a altura, então a imagem fica com quatro vezes mais pixels e o arquivo cresce na mesma proporção. Escolha PNG para páginas com texto e tabelas e JPG para páginas com muitas fotos. Você pode converter só as páginas selecionadas e baixar várias imagens em um ZIP.',
        ],
      },
      {
        title: 'Bom saber',
        blocks: [
          'Em uma imagem, o texto não pode mais ser selecionado nem pesquisado. Se você só quer repassar parte de um documento, extraia as páginas em PDF com {tool:extract-pages}.',
        ],
      },
    ],
    watermark: [
      {
        title: 'Quando usar',
        blocks: [
          { list: [
            'Para marcar documentos internos como "Confidencial" ou "Rascunho"',
            'Para indicar na cópia de um documento de identidade para que ela foi entregue, dificultando o uso em outro lugar',
            'Para colocar seu logotipo em um portfólio ou material de apoio',
          ] },
        ],
      },
      {
        title: 'O que dá para ajustar',
        blocks: [
          'Escolha um texto ou uma imagem de logotipo e ajuste cor, tamanho, opacidade e ângulo. "{ui:tools.watermark.ui.layoutCenter}" coloca uma única marca no meio da página, e "{ui:tools.watermark.ui.layoutTile}" a repete pela página inteira. Aplique em todas as páginas ou só nas que você indicar, conferindo o resultado na prévia da primeira página.',
        ],
      },
      {
        title: 'Bom saber',
        blocks: [
          'Para desestimular vazamentos, o layout "{ui:tools.watermark.ui.layoutTile}" com 20–30% de opacidade é difícil de recortar. Uma marca d’água não esconde o conteúdo; se ninguém mais deve ler o arquivo, adicione também uma senha de abertura com {tool:protect}.',
        ],
      },
    ],
    'page-numbers': [
      {
        title: 'Quando usar',
        blocks: [
          'Para pacotes de documentos de inscrição, relatórios que serão impressos e encadernados e materiais de reunião em que alguém precisa dizer "vejam a página 12".',
        ],
      },
      {
        title: 'O que dá para ajustar',
        blocks: [
          'Posição (esquerda, centro ou direita, em cima ou embaixo), formato do número, número inicial, tamanho da fonte e margem. Para pular a capa e começar a numeração na primeira página de conteúdo, escolha "{ui:tools.page-numbers.ui.pagesCustom}" nas páginas, informe da página 2 em diante e mantenha o número inicial em 1. Confira a prévia antes de aplicar.',
        ],
      },
      {
        title: 'Bom saber',
        blocks: [
          'Numere por último. Se você reordenar as páginas depois, os números ficam fora de ordem, então defina a ordem antes com {tool:merge} ou {tool:organize}.',
        ],
      },
    ],
    sign: [
      {
        title: 'Quando usar',
        blocks: [
          { list: [
            'Assinar um contrato ou termo recebido por e-mail e devolver na hora, sem imprimir, assinar e escanear',
            'Entregar um formulário ou pedido de reembolso que precisa de assinatura ou carimbo ao lado do nome',
            'Adicionar a assinatura em todas as páginas de um contrato com várias páginas',
          ] },
        ],
      },
      {
        title: 'Três jeitos de criar a assinatura',
        blocks: [
          { list: [
            '{ui:tools.sign.ui.modeDraw}: desenhe com o mouse ou com o dedo. No celular, assinar com o dedo dá o resultado mais natural.',
            '{ui:tools.sign.ui.modeType}: digite seu nome e escolha o estilo {ui:tools.sign.ui.styleScript}, {ui:tools.sign.ui.styleSerif} ou {ui:tools.sign.ui.styleSans}.',
            '{ui:tools.sign.ui.modeImage}: envie uma foto de uma assinatura ou carimbo no papel. Ative "{ui:tools.sign.ui.removeBackground}" para deixar o papel transparente e a assinatura natural na página.',
          ] },
          'Com a assinatura pronta, clique na página para colocá-la ali. Arraste para mover, puxe o canto inferior direito para mudar o tamanho e troque de página para colocá-la em vários lugares. Em páginas giradas, ela entra exatamente como aparece na tela.',
        ],
      },
      {
        title: 'Bom saber',
        blocks: [
          { list: [
            'Esta ferramenta coloca uma imagem da sua assinatura na página. Isso é muito usado em contratos e formulários do dia a dia; quando for exigida assinatura digital com certificado, siga o método indicado pela instituição.',
            'Para impedir que outras pessoas alterem o arquivo assinado, restrinja a edição ou defina uma senha de abertura com {tool:protect}.',
            'Se os documentos estão divididos em vários arquivos, junte tudo antes com {tool:merge} para assinar de uma vez.',
            'A assinatura desenhada e as imagens enviadas são usadas só neste navegador e somem quando você fecha a página.',
          ] },
        ],
      },
    ],
    protect: [
      {
        title: 'Quando usar',
        blocks: [
          'Para enviar holerites, contratos ou documentos médicos e financeiros que só o destinatário deve ler.',
        ],
      },
      {
        title: 'Senha e permissões',
        blocks: [
          'O documento inteiro é criptografado com AES-256 e não pode ser aberto sem a senha. As permissões opcionais controlam impressão, cópia, edição e anotações, mas são sinais que os leitores de PDF são solicitados a respeitar, não criptografia de verdade.',
          'A criptografia acontece no seu navegador e a senha não é guardada em lugar nenhum. Isso também significa que, se você esquecer a senha, ninguém, nem nós, consegue recuperá-la.',
        ],
      },
      {
        title: 'Bom saber',
        blocks: [
          { list: [
            'Use uma senha longa, com 12 caracteres ou mais, e evite datas de nascimento ou números de telefone.',
            'Envie o arquivo por e-mail e a senha por SMS ou telefone.',
          ] },
        ],
      },
    ],
    unlock: [
      {
        title: 'Quando usar',
        blocks: [
          'Para guardar seus próprios documentos protegidos, como extratos mensais, sem digitar a senha toda vez, ou para tirar restrições de impressão e cópia dos seus arquivos.',
        ],
      },
      {
        title: 'Como funciona',
        blocks: [
          'Ao escolher um arquivo, a ferramenta primeiro informa que tipo de proteção ele tem. Arquivos com senha de abertura precisam da senha que você conhece; os que só têm restrições de permissão são liberados sem senha. Se o arquivo não tiver proteção, ela avisa que você pode usá-lo como está.',
        ],
      },
      {
        title: 'Bom saber',
        blocks: [
          'Arquivos cuja senha você não sabe não podem ser desbloqueados: a ferramenta não tenta adivinhar senhas. Remover a proteção do documento de outra pessoa sem permissão pode violar direitos autorais ou um contrato, então use apenas em arquivos seus ou que você esteja autorizado a alterar.',
        ],
      },
    ],
  },
};
