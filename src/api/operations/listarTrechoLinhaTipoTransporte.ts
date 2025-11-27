import { callSoapAction, type SoapRequestOptions } from '../api';

export type ListarTrechoLinhaTipoTransporteResult = {
  TrechoLinhaTipoTransporteListar: Array<{
    IDTipoTransporte: number;
    IDTrechoLinha: number;
    Instalacao: string;
    Modalidade: string;
    NRInscricao: string;
    NRInstrumento: string;
  }>;
};

export async function listarTrechoLinhaTipoTransporte(options?: SoapRequestOptions) {
  return callSoapAction<ListarTrechoLinhaTipoTransporteResult>('ListarTrechoLinhaTipoTransporte', undefined, options);
}
