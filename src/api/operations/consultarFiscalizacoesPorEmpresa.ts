import { callSoapAction, type SoapRequestOptions } from '../api';

export type ConsultarFiscalizacoesPorEmpresaParams = {
  cnpj: string;
};

export type ConsultarFiscalizacoesPorEmpresaResult = {
  Fiscalizacao: Array<{
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
      Equipe: Record<string, unknown>[];
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
      Empresa: Record<string, unknown>;
      IDFiscalizacao: number;
      IDObjetoFiscalizado: number;
      NRInscricao: string;
      NRPrazoCorrecao: number;
      Procedimento: Record<string, unknown>;
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
  }>;
};

export async function consultarFiscalizacoesPorEmpresa(params: ConsultarFiscalizacoesPorEmpresaParams, options?: SoapRequestOptions) {
  return callSoapAction<ConsultarFiscalizacoesPorEmpresaResult>('ConsultarFiscalizacoesPorEmpresa', params, options);
}
