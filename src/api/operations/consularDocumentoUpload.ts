import { callSoapAction, type SoapRequestOptions } from '../api';

export type ConsularDocumentoUploadParams = {
  nomeArquivoExtensao: string;
  nomeSistema: string;
};

export type ConsularDocumentoUploadResult = string;

export async function consularDocumentoUpload(params: ConsularDocumentoUploadParams, options?: SoapRequestOptions) {
  return callSoapAction<ConsularDocumentoUploadResult>('ConsularDocumentoUpload', params, options);
}
