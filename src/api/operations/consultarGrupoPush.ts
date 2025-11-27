import { callSoapAction, type SoapRequestOptions } from '../api';

export type ConsultarGrupoPushParams = {
  Tipo: number;
};

export type ConsultarGrupoPushResult = {
  MensagemPushGrupo: Array<{
    DSGrupo: string;
  }>;
};

export async function consultarGrupoPush(params: ConsultarGrupoPushParams, options?: SoapRequestOptions) {
  return callSoapAction<ConsultarGrupoPushResult>('ConsultarGrupoPush', params, options);
}
