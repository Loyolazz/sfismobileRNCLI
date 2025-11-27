import { callSoapAction, type SoapRequestOptions } from '../api';

export type EnviarMensagemPushParams = {
  DataEnvio: string;
  IDPerfilFiscalizacao: number;
  Mensagem: string;
  Titulo: string;
  Token: string;
};

export type EnviarMensagemPushResult = string;

export async function enviarMensagemPush(params: EnviarMensagemPushParams, options?: SoapRequestOptions) {
  return callSoapAction<EnviarMensagemPushResult>('EnviarMensagemPush', params, options);
}
