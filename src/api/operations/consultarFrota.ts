import { callSoapAction, type SoapRequestOptions } from '../api';

export type ConsultarFrotaParams = {
  cnpj: string;
};

export type ConsultarFrotaResult = {
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

export async function consultarFrota(params: ConsultarFrotaParams, options?: SoapRequestOptions) {
  return callSoapAction<ConsultarFrotaResult>('ConsultarFrota', params, options);
}
