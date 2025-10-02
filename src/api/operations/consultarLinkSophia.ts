import { callSoapAction, type SoapRequestOptions } from '../api';

export type ConsultarLinkSophiaParams = {
  NomeEmpresa: string;
  NRResolucao: string;
  Tipo: string;
};

export type ConsultarLinkSophiaResult = string;

export async function consultarLinkSophia(params: ConsultarLinkSophiaParams, options?: SoapRequestOptions) {
  return callSoapAction<ConsultarLinkSophiaResult>('ConsultarLinkSophia', params, options);
}
