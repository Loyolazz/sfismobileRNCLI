import { callSoapAction, type SoapRequestOptions } from '../api';

export type VincularAreaAtuacaoPrestadorServicoParams = {
  numeroInscricao: string;
  tipoAreaAtuacao: string;
  tipoInscricao: string;
};

export type VincularAreaAtuacaoPrestadorServicoResult = boolean;

export async function vincularAreaAtuacaoPrestadorServico(params: VincularAreaAtuacaoPrestadorServicoParams, options?: SoapRequestOptions) {
  return callSoapAction<VincularAreaAtuacaoPrestadorServicoResult>('VincularAreaAtuacaoPrestadorServico', params, options);
}
