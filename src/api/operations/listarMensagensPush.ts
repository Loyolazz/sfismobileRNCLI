import { callSoapAction, type SoapRequestOptions } from '../api';

export type ListarMensagensPushParams = {
  IDPerfilFiscalizacao: string;
};

export type ListarMensagensPushResult = {
  MensagemPush: Array<{
    DSMensagemPush: string;
    DSTituloMensagemPush: string;
    DTEnvio: string;
    IDMensagemPush: string;
    STAtivo: string;
    TPDestinatario: string;
  }>;
};

export async function listarMensagensPush(params: ListarMensagensPushParams, options?: SoapRequestOptions) {
  return callSoapAction<ListarMensagensPushResult>('ListarMensagensPush', params, options);
}
