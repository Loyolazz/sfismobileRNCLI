export type Release = {
  versao: string;
  novidades: string[];
};

export const releases: Release[] = [
  {
    versao: 'Versão 1.2.11',
    novidades: [
      'Possibilidade de cadastro de fiscalização de rotina a partir do menu Serviços Não Autorizados;',
      'Habilitação da seleção do coordenador da equipe de fiscalização;',
      'Vinculação do processo no SEI à unidade do coordenador da equipe.'
    ],
  },
  {
    versao: 'Versão 1.2.10',
    novidades: [
      'Inclusão da ação variável de autuação ou notificação para as infrações que somente em face da análise do caso concreto poderá ser avaliada a possibilidade de emissão de NOCI ou a lavratura imediata de Auto de Infração.'
    ],
  },
  {
    versao: 'Versão 1.2.9.2',
    novidades: ['Ajuste de procedimentos internos.'],
  },
  {
    versao: 'Versão 1.2.9.1',
    novidades: ['Ajuste de procedimentos internos.'],
  },
  {
    versao: 'Versão 1.2.9',
    novidades: ['Ajuste de procedimentos internos.'],
  },
  {
    versao: 'Versão 1.2.8',
    novidades: [
      'Adição do botão "Não se aplica" na tela de seleção da embarcação a ser fiscalizada.'
    ],
  },
  {
    versao: 'Versão 1.2.7.1',
    novidades: ['Ajuste de procedimentos internos.'],
  },
  {
    versao: 'Versão 1.2.7',
    novidades: [
      'Diferenciação dos alertas em caso de falha de autenticação;',
      'Correção na funcionalidade de voz para texto;',
      'Criação de alerta na ausência de conexão com a Internet;'
    ],
  },
  {
    versao: 'Versão 1.2.6.1',
    novidades: ['Ajuste de procedimentos internos.'],
  },
  {
    versao: 'Versão 1.2.6',
    novidades: [
      'Criação do menu Relatório do Usuário;',
      'Consulta ao histórico de fiscalizações da empresa;',
      'Compartilhamento dos documentos da fiscalização com aplicativo compatível instalado no celular;',
      'Envio dos documentos da fiscalização por e-mail ao Representante para Intimação previamente indicado pela empresa fiscalizada;',
      'Seleção da equipe de fiscalização com servidores de outras unidades.'
    ],
  },
  {
    versao: 'Versão 1.2.5',
    novidades: [
      'Inclusão da informação sobre a embarcação fiscalizada nos documentos gerados em fiscalizações da navegação interior;',
      'Exibição do CNPJ da Instalação na consulta de empresas arrendatárias;',
      'Exibição de todos os CNPJs vinculados ao mesmo contrato de arrendamento;',
      'Exibição somente das fiscalizações que o próprio usuário cadastrou nas telas Fiscalizações em Andamento e Mostrar Enviadas;',
      'Criação no SEI de Auto de Infração / NOCI como documento editável em processos de fiscalização do tipo Programada, Extraordinária e Apartado.'
    ],
  },
  {
    versao: 'Versão 1.2.4',
    novidades: [
      'Geração dos documentos no SEI para o Posto Avançado vinculado ao usuário;',
      'Reenvio ao SEI dos documentos gerados em fiscalização já enviada.'
    ],
  },
  {
    versao: 'Versão 1.2.3',
    novidades: [
      'Registro na base de dados dos eventos de erros da aplicação;',
      'Disponibilização do serviço em protocolo seguro (HTTPS).'
    ],
  },
  {
    versao: 'Versão 1.2.2.1',
    novidades: ['Correção na pesquisa de empresas autorizadas por embarcação.'],
  },
  {
    versao: 'Versão 1.2.2',
    novidades: [
      'Validação das notificações lavradas no último ano;',
      'Correção na exibição das coordenadas geográficas de empresas com mais de uma instalação;',
      'Permitir a exclusão do dispositivo de fiscalizações em andamento (enviadas ou não enviadas).'
    ],
  },
  {
    versao: 'Versão 1.2.1',
    novidades: [
      'Inclusão de consulta por embarcação e por instalação portuária;',
      'Possibilidade de anexar imagens da galeria do dispositivo;',
      'Aumento da quantidade de fotos, de 5 para 10, no módulo "Descreva sua Fiscalização";',
      'Possibilidade de aplicação de mais de um checklist no mesmo procedimento.'
    ],
  },
  {
    versao: 'Versão 1.2.0',
    novidades: [
      'Inclusão de funcionalidade para cadastro de fiscalizações de serviços não autorizados;',
      'Possibilidade de anexar fotos salvas na galeria do aparelho;',
      'Armazenamento na galeria do aparelho das fotos registradas via SFISMobile;',
      'Atualização do modelo de Auto de Infração.'
    ],
  },
  {
    versao: 'Versão 1.1.16.1',
    novidades: ['Ajuste de procedimentos internos.'],
  },
  {
    versao: 'Versão 1.1.16',
    novidades: [
      'Inclusão de confirmação para atualização automática de dados.',
      'Inclusão de filtros por Instalações e UF nas consultas de serviços portuários do Painel de Empresas.'
    ],
  },
  {
    versao: 'Versão 1.1.15',
    novidades: ['Agora é possível baixar os dados no painel de empresas!'],
  },
  {
    versao: 'Versão 1.1.14',
    novidades: [
      'Correção do módulo Aplicar Checklist para que, caso encontrada infração não notificável, seja possível gerar Auto de Infração.',
      'Inclusão de mensagem de erro ao finalizar fiscalização, caso não tenha conexão com internet.'
    ],
  },
  {
    versao: 'Versão 1.1.13',
    novidades: [
      'Inclusão automática de Notificação / Auto de Infração no SEI como documento editável;',
      'Implementação de possibilidade de registro fotográfico para cada infração na opção "Selecionar Irregularidade";',
      'Consulta ao Instrumento de Delegação e Aditivos de Portos Organizados no Painel de Empresas;',
      'Implementação de trava de segurança ao concluir a fiscalização para impedir o salvamento de registros múltiplos no SFIS Web;',
      'Implementação de limite de 4.000 caracteres no campo "Descrição da Fiscalização";',
      'Possibilidade de cadastro de rotina somente com aplicação de checklist;',
      'Melhoria no Campo 19 (Prazo para atendimento) do documento "Notificação" de maneira a facilitar sua leitura pelo regulado quando são inseridas duas ou mais tipificações;',
      'Atualização das informações do Auto de Infração quanto à apresentação de defesa por meio do peticionamento eletrônico do sistema SEI.'
    ],
  },
  {
    versao: 'Versão 1.1.12',
    novidades: [
      'Atualização dos links para o Sophia;',
      'Criação dos links para acesso aos documentos dos contratos de arrendamento (original e termos aditivos).'
    ],
  },
  {
    versao: 'Versão 1.1.11',
    novidades: [
      'Alteração de regra para inclusão ou atualização do perfil de usuário via WebService de acordo com a unidade organizacional.'
    ],
  },
  {
    versao: 'Versão 1.1.10',
    novidades: [
      'Visualização da frota das empresas de navegação marítima;',
      'Consulta aos contratos operacionais de passagem na área de portos organizados;',
      'Consulta à dados adicionais de contratos de arrendamento, transição e de uso temporário;',
      'Disponibilização do Anexo Fotográfico para download (PDF), após a finalização do procedimento de fiscalização.'
    ],
  },
  {
    versao: 'Versão 1.1.9',
    novidades: [
      'Ajuste no Painel de Empresas Fiscalizadas para agrupar os dados das autorizadas de navegação interior por modalidade.'
    ],
  },
  {
    versao: 'Versão 1.1.8',
    novidades: ['Ajuste de procedimentos internos.'],
  },
  {
    versao: 'Versão 1.1.7',
    novidades: [
      'Criação da tela de consulta do cadastro de autorizadas para as gerências;',
      'Ajuste no precedimento de envio da equipe de fiscalização (Rotina, Notificação, Auto de Infração);',
      'Salvar na base do SFIS os dados da embarcação selecionada, vinculada a empresa de navegação interior a ser fiscalizada;',
      'Mostrar frota vinculada à Navegação Marítima (longo curso e cabotagem) e apoios (portuário e marítimo);',
      'Criação da tela para visualização dos dados da fiscalização enviada e reenvio das fotos da fiscalização;',
      'Alterado relatório de fiscalização e removido o grupo fotos da fiscalização;',
      'Criado relatório anexo fotográfico com o grupo fotos da fiscalização;'
    ],
  },
  {
    versao: 'Versão 1.1.6',
    novidades: ['Correção de bug do campo quantidade de embarcações da lista de autorizadas;'],
  },
  {
    versao: 'Versão 1.1.5',
    novidades: [
      'Criação da tela (Fiscalizações em Andamento) para acompanhar e resgatar os dados das fiscalizações não enviadas;',
      'Criação de procedimento para salvar a fiscalização no Dispositivo;',
      'Criação de procedimento para salvar a conexão do usuário no Dispositivo;',
      'Criação de procedimento para encerrar a sessão do Dispositivo no Botão sair;',
      'Criação de procedimento para Consultar Status do serviços (SFIS e SEI) para envio da fiscalização;',
      'Criação de procedimento sincronização automático dos dados relativos ao processo de fiscalização off-line;'
    ],
  },
  {
    versao: 'Versão 1.1.4',
    novidades: ['Ajuste de procedimento internos;'],
  },
  {
    versao: 'Versão 1.1.3',
    novidades: [
      'Ajuste no layout da tela Inicial;',
      'Ajuste no layout da tela Minhas Fiscalizações, com reenquadramento e inclusão do botão de voltar;',
      'Ajuste no layout da tela Fiscalizações de Rotina, com reenquadramento e inclusão do botão de voltar;',
      'Ajuste no layout da tela Consultar Autorizadas, com reenquadramento e inclusão do botão de voltar;',
      'Inclusão do menu de consulta Por Modalidade, dentro da tela de Consultar Autorizadas;',
      'Ajuste no layout de todas as telas do aplicativo, tornando o mesmo responsivo para a maioria dos dispositivos;',
      'Ajuste no procedimento que mostra os dados da empresa com fiscalização programada;',
      'Inclusão da Notificação/Auto de Infração e Relatório de Fiscalização automaticamente no SEI;',
      'Atualização de Minhas Fiscalizações, pelo botão recarregar da barra de menu;',
      'Inclusão do menu A ANTAQ;',
      'Inclusão do menu Novidades da Versão.'
    ],
  },
];

export function getUltimaVersao() {
  return releases[0];
}
