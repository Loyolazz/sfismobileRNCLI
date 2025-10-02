import { callSoapAction, type SoapRequestOptions } from '../api';

export type ConsultarFrotaAlocadaParams = {
  cnpj: string;
  NRInstrumento: string;
};

export type ConsultarFrotaAlocadaResult = {
  Embarcacao: Array<{
    DTInicio: string;
    DTTermino: string;
    IDEmbarcacao: number;
    IDFrota: number;
    IDFrotaPai: number;
    NoEmbarcacao: string;
    NRCapitania: string;
    STEmbarcacao: boolean;
    STHomologacao: string;
    STRegistro: boolean;
    TipoEmbarcacao: string;
    TPAfretamento: number;
    TPInscricao: number;
  }>;
};

export async function consultarFrotaAlocada(params: ConsultarFrotaAlocadaParams, options?: SoapRequestOptions) {
  return callSoapAction<ConsultarFrotaAlocadaResult>('ConsultarFrotaAlocada', params, options);
}
