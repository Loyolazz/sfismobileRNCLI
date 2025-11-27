import { callSoapAction, type SoapRequestOptions } from '../api';

export type InserirLogErroParams = {
  dsLogErro: string;
  dsParametros: string;
  dtRegistro: string;
  nomeAcao: string;
  nomeTelaReferencia: string;
  nomeUsuario: string;
  numeroMatricula: number;
};

export type InserirLogErroResult = {
  DSLogErro: string;
  DSParametros: string;
  DTRegistro: string;
  IDLogErro: number;
  NOAcao: string;
  NOTelaReferencia: string;
  NOUsuario: string;
  NRMatricula: number;
};

export async function inserirLogErro(params: InserirLogErroParams, options?: SoapRequestOptions) {
  return callSoapAction<InserirLogErroResult>('InserirLogErro', params, options);
}
