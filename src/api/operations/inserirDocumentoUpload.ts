import { callSoapAction, type SoapRequestOptions } from '../api';

export type InserirDocumentoUploadParams = {
  arquivoBinario: string;
  nomeArquivoExtensao: string;
  nomeSistema: string;
};

export type InserirDocumentoUploadResult = unknown;

export async function inserirDocumentoUpload(params: InserirDocumentoUploadParams, options?: SoapRequestOptions) {
  return callSoapAction<InserirDocumentoUploadResult>('InserirDocumentoUpload', params, options);
}
