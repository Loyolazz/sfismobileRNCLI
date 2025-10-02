import { callSoapAction, type SoapRequestOptions } from '../api';

export type ListarInstrumentosDelegacaoParams = {
  NomeArquivo: string;
  NRInscricao: string;
  Porto: string;
};

export type ListarInstrumentosDelegacaoResult = {
  InstrumentosDelegacao: Array<{
    ArquivoByte: string;
    CaminhoArquivo: string;
    ExtensaoArquivo: string;
    NomeArquivo: string;
  }>;
};

export async function listarInstrumentosDelegacao(params: ListarInstrumentosDelegacaoParams, options?: SoapRequestOptions) {
  return callSoapAction<ListarInstrumentosDelegacaoResult>('ListarInstrumentosDelegacao', params, options);
}
