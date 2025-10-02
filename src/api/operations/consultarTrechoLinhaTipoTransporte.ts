import { callSoapAction, type SoapRequestOptions } from '../api';

export type ConsultarTrechoLinhaTipoTransporteParams = {
  cnpj: string;
  NRInstrumento: string;
};

export type ConsultarTrechoLinhaTipoTransporteResult = {
  TrechoLinhaTipoTransporte: Array<{
    IDTipoTransporte: number;
    IDTrechoLinha: number;
    Instalacao: string;
    Modalidade: string;
  }>;
};

export async function consultarTrechoLinhaTipoTransporte(params: ConsultarTrechoLinhaTipoTransporteParams, options?: SoapRequestOptions) {
  return callSoapAction<ConsultarTrechoLinhaTipoTransporteResult>('ConsultarTrechoLinhaTipoTransporte', params, options);
}
