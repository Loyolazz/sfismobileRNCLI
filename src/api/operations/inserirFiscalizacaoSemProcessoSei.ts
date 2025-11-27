import { callSoapAction, type SoapRequestOptions } from '../api';

export type InserirFiscalizacaoSemProcessoSeiParams = {
  cnpjEmpresa: string;
  codigoEstruturado: string;
  dsLatitude: string;
  dsLongitude: string;
  DSObservacoesGerais: string;
  dtFimRealizacao: string;
  dtInicioRealizacao: string;
  idPostoAvancado: string;
  idTipoInstalacaoPortuaria: string;
  idtipotransporte: string;
  idtrecholinha: string;
  listaEquipe: {
    Equipe: Array<{
      IDEquipe: number;
      IDFiscalizacao: number;
      ListaFiscalizacao: {
        Fiscalizacao: Record<string, unknown>[];
      };
      NOCargo: string;
      NOUnidadeOrganizacional: string;
      NOUsuario: string;
      NRMatricula: number;
      STCoordenador: boolean;
    }>;
  };
  nomeEmpresa: string;
  numeroMatricula: number;
  STIrregularidadeEncontrada: boolean;
  STMobile: boolean;
  superintendencia: {
    DescUnidadePai: string;
    Identificador: number;
    ListaIdentificadores: string;
    Municipio: string;
    Nome: string;
    Sigla: string;
    SiglaUF: string;
    TipoUnidade: number;
    UnidadePai: number;
  };
  tipoProcedimento: string;
  unidadeFiscal: {
    DescUnidadePai: string;
    Identificador: number;
    ListaIdentificadores: string;
    Municipio: string;
    Nome: string;
    Sigla: string;
    SiglaUF: string;
    TipoUnidade: number;
    UnidadePai: number;
  };
};

export type InserirFiscalizacaoSemProcessoSeiResult = {
  CDBiGrama: string;
  CDTriGrama: string;
  DSDenunciante: string;
  DSLatitude: string;
  DSLocalFiscalizacao: string;
  DSLongitude: string;
  DSMotivoFiscalizacao: string;
  DSNotaExplicativa: string;
  DSOrigem: string;
  DSSituacao: string;
  DSTipoInstalacaoPortuaria: string;
  DTProgramada: string;
  Equipe: {
    Equipe: Array<{
      IDEquipe: number;
      IDFiscalizacao: number;
      ListaFiscalizacao: Record<string, unknown>;
      NOCargo: string;
      NOUnidadeOrganizacional: string;
      NOUsuario: string;
      NRMatricula: number;
      STCoordenador: boolean;
    }>;
  };
  IDFiscalizacao: number;
  IDOrigemFiscalizacaoEventual: number;
  IDPAF: number;
  IDSituacao: number;
  IDSuperintendencia: number;
  IDTerminal: number;
  IDTipoInstalacaoPortuaria: number;
  IDTipoTransporte: number;
  IDTrechoLinha: number;
  IDUnidadeOrganizacional: number;
  IDUsuarioExclusao: number;
  NOLoginUsuario: string;
  NRAno: number;
  NRNumeroIdentidade: string;
  ObjetoFiscalizado: {
    DSObservacoesGerais: string;
    DTNotificacaoIrregularidade: string;
    Empresa: {
      AreaPPF: string;
      AutoridadePortuaria: string;
      CDMunicipio: string;
      ContratoEmpresa: Record<string, unknown>;
      DSBairro: string;
      DSEndereco: string;
      DTAditamento: string;
      DTOutorga: string;
      EDComplemento: string;
      EERepresentante: string;
      Email: string;
      IDContratoArrendamento: number;
      Instalacao: string;
      ListaTipoEmpresa: Record<string, unknown>;
      Modalidade: string;
      NomeContato: string;
      NOMunicipio: string;
      NORazaoSocial: string;
      NORazaoSocialInstalacao: string;
      NORepresentante: string;
      NRAditamento: string;
      NRCEP: string;
      NRDocumentoSEI: string;
      NREndereco: number;
      NRInscricao: string;
      NRInscricaoInstalacao: string;
      NRInstrumento: string;
      NRResolucao: string;
      NRTelefone: string;
      NRTLO: string;
      QTDEmbarcacao: number;
      SGUF: string;
      STIntimacaoViaEmail: boolean;
      STIntimacaoViaTelefone: boolean;
      TPInscricao: number;
      VLMontanteInvestimento: string;
    };
    IDFiscalizacao: number;
    IDObjetoFiscalizado: number;
    NRInscricao: string;
    NRPrazoCorrecao: number;
    Procedimento: {
      CodProcesso: string;
      DTFimRealizacao: string;
      DTIniRealizacao: string;
      IDFiscalizacao: number;
      IDListaVerificacao: number;
      IDOrdemServico: string;
      IDPostoAvancado: number;
      IDProcedimento: number;
      NRMatricula: number;
      NRProcedimento: string;
      STSituacao: string;
    };
    STAutorizada: boolean;
    STIrregularidadeEncontrada: boolean;
    STMobile: boolean;
    TPInscricao: number;
  };
  ProcedimentoFiscalizacao: {
    CodProcesso: string;
    DTFimRealizacao: string;
    DTIniRealizacao: string;
    IDFiscalizacao: number;
    IDListaVerificacao: number;
    IDOrdemServico: string;
    IDPostoAvancado: number;
    IDProcedimento: number;
    NRMatricula: number;
    NRProcedimento: string;
    STSituacao: string;
  };
  SGSuperintendencia: string;
  SGUFIdentidade: string;
  SGUnidade: string;
  SGUnidadePostoAvancado: string;
  STAprovado: boolean;
  TpExtraordinaria: string;
  TPFiscalizacao: string;
  TPNaturezaFiscalizacao: string;
};

export async function inserirFiscalizacaoSemProcessoSei(params: InserirFiscalizacaoSemProcessoSeiParams, options?: SoapRequestOptions) {
  return callSoapAction<InserirFiscalizacaoSemProcessoSeiResult>('InserirFiscalizacaoSemProcessoSei', params, options);
}
