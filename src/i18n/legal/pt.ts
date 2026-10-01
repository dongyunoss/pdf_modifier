import type { LegalText } from './types';

export const pt: LegalText = {
  about: [
    {
      blocks: [
        '{site} é um conjunto de ferramentas de PDF gratuitas que qualquer pessoa pode usar com segurança. Só com um navegador — sem instalar nada e sem criar conta — você pode juntar, dividir, reordenar, comprimir e converter arquivos PDF.',
      ],
    },
    {
      title: 'Ferramentas de PDF que nunca enviam seus arquivos',
      blocks: [
        'A maioria dos serviços de PDF online envia seus arquivos para os servidores deles. {site} usa WebAssembly e tecnologia moderna de navegador para fazer <strong>todo o processamento no seu próprio dispositivo</strong>. Contratos, certidões e cópias de documentos de identidade nunca saem do seu computador, e não há espera por upload ou download.',
      ],
    },
    { title: 'Ferramentas', blocks: ['{tools}'] },
    {
      title: 'Como o site é mantido',
      blocks: [
        'Todas as ferramentas são gratuitas. O site é mantido pelos anúncios exibidos em suas páginas. Como os arquivos não são processados em servidores, os custos de operação são baixos e, por isso, não há limites de uso nem de tamanho de arquivo.',
      ],
    },
    { title: 'Código aberto', blocks: ['Este serviço foi construído com estes projetos de código aberto:', '{opensource}'] },
    { title: 'Contato', blocks: ['{contact}'] },
  ],
  privacy: [
    {
      blocks: ['{site} (“o site”) respeita a sua privacidade. Esta política explica quais informações o site trata e como.'],
    },
    {
      title: '1. Seus arquivos',
      blocks: [
        'Arquivos PDF e de imagem são <strong>processados inteiramente no seu dispositivo, dentro do navegador. Eles nunca são enviados aos nossos servidores nem compartilhados com terceiros.</strong> Os dados de trabalho existem apenas na memória do navegador e desaparecem quando você fecha a página. Se você usar “Continuar com”, o arquivo de resultado fica no armazenamento interno do navegador (IndexedDB) por até 10 minutos para que a próxima ferramenta possa abri-lo; ele também não é enviado a lugar nenhum.',
      ],
    },
    {
      title: '2. Informações coletadas',
      blocks: [
        'O site não tem contas de usuário e nunca pede seu nome ou dados de contato. No entanto, as seguintes informações podem ser geradas automaticamente e tratadas por provedores de hospedagem, análise e publicidade:',
        {
          list: [
            'Registros de acesso (endereço IP, horário da visita, páginas visitadas), informações do navegador e do dispositivo',
            'Cookies e identificadores de publicidade (quando anúncios são exibidos)',
          ],
        },
      ],
    },
    {
      title: '3. Cookies e publicidade',
      blocks: [
        'O site pode exibir anúncios do Google AdSense para cobrir seus custos. Fornecedores terceiros, incluindo o Google, usam cookies para exibir anúncios com base em suas visitas anteriores a este site ou a outros sites. O uso de cookies de publicidade permite que o Google e seus parceiros exibam anúncios com base em suas visitas a este e a outros sites na Internet.',
        {
          list: [
            'Você pode desativar a publicidade personalizada nas <a href="https://adssettings.google.com" rel="noopener" target="_blank">Configurações de anúncios do Google</a>.',
            'Você pode desativar os cookies de fornecedores terceiros para publicidade personalizada em <a href="https://www.aboutads.info/choices/" rel="noopener" target="_blank">www.aboutads.info</a>.',
            'Saiba mais em <a href="https://policies.google.com/technologies/partner-sites" rel="noopener" target="_blank">Como o Google usa as informações de sites ou apps que utilizam nossos serviços</a>.',
            'Você pode bloquear cookies nas configurações do navegador; as ferramentas de PDF continuam funcionando sem eles.',
          ],
        },
      ],
    },
    {
      title: '4. Análise de uso',
      blocks: [
        'Para melhorar o serviço, o site pode coletar estatísticas de visitas com o Cloudflare Web Analytics (sem cookies) ou o Google Analytics. Essas estatísticas são usadas apenas de forma agregada e não identificam você.',
      ],
    },
    {
      title: '5. Compartilhamento',
      blocks: [
        'Não vendemos nem compartilhamos suas informações pessoais. Nosso provedor de hospedagem (por exemplo, a Cloudflare) e os provedores de publicidade ou análise podem tratar as informações da seção 2 de acordo com as próprias políticas de privacidade para prestar seus serviços.',
      ],
    },
    {
      title: '6. Retenção',
      blocks: [
        'Não armazenamos suas informações pessoais. As informações tratadas por provedores terceiros são mantidas de acordo com as políticas deles.',
      ],
    },
    {
      title: '7. Seus direitos',
      blocks: [
        'Você pode excluir ou bloquear cookies a qualquer momento nas configurações do navegador e entrar em contato conosco com qualquer dúvida ou solicitação sobre privacidade.',
      ],
    },
    { title: '8. Crianças', blocks: ['O site não coleta intencionalmente informações pessoais de crianças.'] },
    { title: '9. Contato', blocks: ['{contact}'] },
    { title: '10. Alterações', blocks: ['Esta política está em vigor desde {date}. Qualquer alteração será publicada nesta página.'] },
  ],
  terms: [
    { title: '1. Abrangência', blocks: ['Estes termos regem o uso das ferramentas de PDF oferecidas por {site} (“o site”).'] },
    {
      title: '2. O serviço',
      blocks: [
        'O site oferece ferramentas gratuitas para juntar, dividir, organizar, comprimir, converter, adicionar marca d’água, proteger e desbloquear arquivos PDF. Todo o processamento acontece no seu navegador e seus arquivos nunca são enviados.',
      ],
    },
    {
      title: '3. Suas responsabilidades',
      blocks: [
        {
          list: [
            'Processe apenas arquivos que você tem o direito de usar.',
            'Não use o serviço para violar direitos autorais, a privacidade ou outros direitos de terceiros.',
            'Use a ferramenta de desbloqueio apenas em documentos que sejam seus ou que você esteja autorizado a modificar.',
            'Não interfira no funcionamento normal do serviço.',
          ],
        },
      ],
    },
    {
      title: '4. Isenção de responsabilidade',
      blocks: [
        {
          list: [
            'O serviço é oferecido “no estado em que se encontra”, sem garantias de exatidão, completude ou adequação a uma finalidade específica.',
            'Guarde sempre uma cópia dos seus arquivos originais.',
            'Na medida permitida por lei, o site não se responsabiliza por perda de dados ou outros danos decorrentes do uso do serviço.',
          ],
        },
      ],
    },
    { title: '5. Publicidade', blocks: ['O site pode exibir anúncios para manter seu funcionamento.'] },
    {
      title: '6. Alterações no serviço',
      blocks: ['O site pode alterar, suspender ou encerrar total ou parcialmente o serviço a qualquer momento.'],
    },
    { title: '7. Lei aplicável', blocks: ['Estes termos são regidos pelas leis da República da Coreia.'] },
    { title: '8. Data de vigência', blocks: ['Estes termos estão em vigor desde {date}.'] },
  ],
  contact: {
    about: 'Sugestões, relatos de erros e propostas de parceria: {email}',
    privacy: 'Dúvidas sobre privacidade: {email}',
    none: 'Em caso de dúvidas, entre em contato com o responsável pelo site.',
  },
  listSeparator: ', ',
};
