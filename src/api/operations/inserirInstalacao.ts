import { callSoapAction, type SoapRequestOptions } from '../api';

export type InserirInstalacaoParams = {
  codigoMunicipio: string;
  complementoEndereco: string;
  descricaoEndereco: string;
  dsLatitude: string;
  dsLongitude: string;
  nomeBairro: string;
  nomeInstalacao: string;
  noUsuario: string;
  numeroCEP: string;
  numeroEndereco: number;
  numeroInscricao: string;
};

export type InserirInstalacaoResult = {
  CDMunicipio: string;
  DSBairro: string;
  DSEndereco: string;
  EDComplemento: string;
  IDTerminal: number;
  IDTipoOutorga: number;
  IDTipoTerminal: number;
  NOTerminal: string;
  NOUsuario: string;
  NRCEP: string;
  NRCNPJ: string;
  NREndereco: number;
  NRInscricao: string;
  VLLatitude: number;
  VLLongitude: number;
};

export async function inserirInstalacao(params: InserirInstalacaoParams, options?: SoapRequestOptions) {
  return callSoapAction<InserirInstalacaoResult>('InserirInstalacao', params, options);
}
