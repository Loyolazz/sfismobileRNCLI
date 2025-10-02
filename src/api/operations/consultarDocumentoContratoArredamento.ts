import { callSoapAction, type SoapRequestOptions } from '../api';

export type ConsultarDocumentoContratoArredamentoParams = {
  nomeArquivoExtensao: string;
  nomeSistema: string;
};

export type ConsultarDocumentoContratoArredamentoResult = string;

export async function consultarDocumentoContratoArredamento(params: ConsultarDocumentoContratoArredamentoParams, options?: SoapRequestOptions) {
  return callSoapAction<ConsultarDocumentoContratoArredamentoResult>('ConsultarDocumentoContratoArredamento', params, options);
}
