import { callSoapAction, type SoapRequestOptions } from '../api';

export type InserirNotificacaoGeradaParams = {
  IDUnidadeOrganizacional: number;
  NRMatricula: number;
};

export type InserirNotificacaoGeradaResult = number;

export async function inserirNotificacaoGerada(params: InserirNotificacaoGeradaParams, options?: SoapRequestOptions) {
  return callSoapAction<InserirNotificacaoGeradaResult>('InserirNotificacaoGerada', params, options);
}
