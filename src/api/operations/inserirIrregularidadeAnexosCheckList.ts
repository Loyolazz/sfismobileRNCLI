import { callSoapAction, type SoapRequestOptions } from '../api';

export type InserirIrregularidadeAnexosCheckListParams = {
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
};

export type InserirIrregularidadeAnexosCheckListResult = boolean;

export async function inserirIrregularidadeAnexosCheckList(params: InserirIrregularidadeAnexosCheckListParams, options?: SoapRequestOptions) {
  return callSoapAction<InserirIrregularidadeAnexosCheckListResult>('InserirIrregularidadeAnexosCheckList', params, options);
}
