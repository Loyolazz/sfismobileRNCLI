import { callSoapAction, type SoapRequestOptions } from '../api';

export type InserirFiscalizacaoEmbarcacaoParams = {
  DTRegistro: string;
  IDEmbarcacao: string;
  IDFiscalizacao: string;
};

export type InserirFiscalizacaoEmbarcacaoResult = boolean;

export async function inserirFiscalizacaoEmbarcacao(params: InserirFiscalizacaoEmbarcacaoParams, options?: SoapRequestOptions) {
  return callSoapAction<InserirFiscalizacaoEmbarcacaoResult>('InserirFiscalizacaoEmbarcacao', params, options);
}
