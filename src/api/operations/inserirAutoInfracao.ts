import { callSoapAction, type SoapRequestOptions } from '../api';

export type InserirAutoInfracaoParams = {
  IDUnidadeOrganizacional: number;
  NRMatricula: number;
};

export type InserirAutoInfracaoResult = string;

export async function inserirAutoInfracao(params: InserirAutoInfracaoParams, options?: SoapRequestOptions) {
  return callSoapAction<InserirAutoInfracaoResult>('InserirAutoInfracao', params, options);
}
