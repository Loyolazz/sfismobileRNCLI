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

export type MensagemPush = ListarMensagensPushResult['MensagemPush'][number];

export async function listarMensagensPush(
  params: ListarMensagensPushParams,
  options?: SoapRequestOptions,
): Promise<MensagemPush[]> {
  console.log('[API] listarMensagensPush chamada', params);
  const result = await callSoapAction<ListarMensagensPushResult | { MensagemPush?: MensagemPush | MensagemPush[] }>(
    'ListarMensagensPush',
    params,
    options,
  );

  const mensagens = (result as any)?.MensagemPush ?? result;
  const list = Array.isArray(mensagens) ? mensagens : [mensagens].filter(Boolean);
  console.log('[API] listarMensagensPush retorno', list);
  return list;
}
