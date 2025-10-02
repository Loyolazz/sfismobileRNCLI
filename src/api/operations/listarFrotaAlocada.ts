import { callSoapAction, type SoapRequestOptions } from '../api';

export type ListarFrotaAlocadaResult = {
  EmbarcacaoNova: Array<{
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

export async function listarFrotaAlocada(options?: SoapRequestOptions) {
  return callSoapAction<ListarFrotaAlocadaResult>('ListarFrotaAlocada', undefined, options);
}
