import { soapRequest, extractSoapResult } from "./api";

export type MensagemPush = {
  IDMensagemPush: number;
  DSTituloMensagemPush: string;
  DSMensagemPush: string;
  DTEnvio: string;
  STAtivo: string;
  TPDestinatario: string;
};

export async function listarMensagensPush(idPerfil: number): Promise<MensagemPush[]> {
  const parsed = await soapRequest("ListarMensagensPush", {
    IDPerfilFiscalizacao: idPerfil,
  });
  const result = extractSoapResult(parsed, "ListarMensagensPush");
  const mensagens = result?.MensagemPush;
  if (!mensagens) return [];
  return Array.isArray(mensagens) ? mensagens : [mensagens];
}
