import { callSoapAction, type SoapRequestOptions } from '../api';

export type InserirListaDocumentoUploadParams = {
  listaDocumentos: {
    Documento: Array<{
      arquivoBinario: string;
      nomeArquivoExtensao: string;
      nomeSistema: string;
    }>;
  };
};

export type InserirListaDocumentoUploadResult = unknown;

export async function inserirListaDocumentoUpload(params: InserirListaDocumentoUploadParams, options?: SoapRequestOptions) {
  return callSoapAction<InserirListaDocumentoUploadResult>('InserirListaDocumentoUpload', params, options);
}
