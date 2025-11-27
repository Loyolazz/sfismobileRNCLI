import { callSoapAction, type SoapRequestOptions } from '../api';

export type ListarFrotaAlocadaMaritimaResult = {
  EmbarcacaoMaritima: Array<{
    DSTipoEmbarcacao: string;
    DTInicio: string;
    DTTermino: string;
    IDEmbarcacao: number;
    IDFrota: number;
    IDFrotaPai: number;
    NoEmbarcacao: string;
    NRCapitania: string;
    NRInscricao: string;
    NRInstrumento: string;
    Situacao: string;
    STEmbarcacao: boolean;
    STHomologacao: string;
    STRegistro: boolean;
    TipoEmbarcacao: number;
    TPAfretamento: number;
    TPInscricao: number;
  }>;
};

export async function listarFrotaAlocadaMaritima(options?: SoapRequestOptions) {
  return callSoapAction<ListarFrotaAlocadaMaritimaResult>('ListarFrotaAlocadaMaritima', undefined, options);
}
