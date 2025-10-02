import { callSoapAction, type SoapRequestOptions } from '../api';

export type ReenviarDocumentosSeiParams = {
  Anexos: {
    string: string[];
  };
  idFiscalizacao: number;
  idObjetoFiscalizado: number;
};

export type ReenviarDocumentosSeiResult = string;

export async function reenviarDocumentosSei(params: ReenviarDocumentosSeiParams, options?: SoapRequestOptions) {
  return callSoapAction<ReenviarDocumentosSeiResult>('ReenviarDocumentosSei', params, options);
}
