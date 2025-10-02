import { callSoapAction, type SoapRequestOptions } from '../api';

export type GerarPDFParams = {
  Anexos: {
    Anexo: Array<{
      ArquivoDados: string;
      DSNomeArquivo: string;
      DSPath: string;
      DTRegistro: string;
      IDAnexo: number;
      IDIrregularidade: number;
      IDObjetoFiscalizado: number;
      TPAnexo: string;
    }>;
  };
  CheckList: {
    CheckList: Array<{
      ArquivoDados: string;
      CDLatitude: string;
      CDLongitude: string;
      DSNomeArquivo: string;
      DSPath: string;
      DSPergunta: string;
      DSSecao: string;
      DTCadastro: string;
      IDCheckList: number;
      IDFiscalizacao: number;
      IDIrregularidade: number;
      IDPergunta: number;
      IDQuestionario: number;
      IDSecao: number;
      NRMatricula: number;
      STResposta: string;
    }>;
  };
  DSNomeArquivo: string;
  DSNomeArquivoAnexoFotografico: string;
  DSNomeArquivoNotificacao: string;
  fiscalizacao: {
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
  IrregularidadeEncontrada: {
    IrregularidadeEncontrada: Array<{
      DSJustificativaNOCI: string;
      DSNormaCompleta: string;
      DSNormativa: string;
      DSObservacoes: string;
      DTNotificacao: string;
      IDEmbarcacao: number;
      IDIrregularidade: number;
      IDIrregularidadeEncontrada: number;
      IDObjetoFiscalizado: number;
      IDProvidencia: number;
      NRAutoInfracao: string;
      NRNotificacao: string;
      NRPrazo: number;
      NRQuinzenas: number;
      STCorrigida: boolean;
      STProposicaoTAC: boolean;
      VLMultaMaxima: string;
    }>;
  };
  isNaoAutorizado: boolean;
};

export type GerarPDFResult = unknown;

export async function gerarPDF(params: GerarPDFParams, options?: SoapRequestOptions) {
  return callSoapAction<GerarPDFResult>('GerarPDF', params, options);
}
