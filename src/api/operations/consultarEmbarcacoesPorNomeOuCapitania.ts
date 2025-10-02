import { callSoapAction, type SoapRequestOptions } from '../api';

export type ConsultarEmbarcacoesPorNomeOuCapitaniaParams = {
  NOEmbarcacao: string;
  NRCapitania: string;
};

export type ConsultarEmbarcacoesPorNomeOuCapitaniaResult = {
  EmbarcacaoAutorizada: Array<{
    DTInicio: string;
    DTTermino: string;
    IDEmbarcacao: number;
    IDFrota: number;
    IDFrotaPai: number;
    NoEmbarcacao: string;
    NRCapitania: string;
    NRInscricao: string;
    NRInstrumento: string;
    STEmbarcacao: boolean;
    STHomologacao: string;
    STRegistro: boolean;
    TipoEmbarcacao: string;
    TPAfretamento: number;
    TPInscricao: number;
  }>;
};

export async function consultarEmbarcacoesPorNomeOuCapitania(params: ConsultarEmbarcacoesPorNomeOuCapitaniaParams, options?: SoapRequestOptions) {
  return callSoapAction<ConsultarEmbarcacoesPorNomeOuCapitaniaResult>('ConsultarEmbarcacoesPorNomeOuCapitania', params, options);
}
