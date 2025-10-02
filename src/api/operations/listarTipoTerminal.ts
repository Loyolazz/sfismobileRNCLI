import { callSoapAction, type SoapRequestOptions } from '../api';

export type ListarTipoTerminalResult = {
  TipoTerminal: Array<{
    IDTipoInstalacaoPortuaria: string;
    IDTipoTerminal: number;
    NOTipoTerminal: string;
    TPInstalacaoPortuaria: string;
  }>;
};

export async function listarTipoTerminal(options?: SoapRequestOptions) {
  return callSoapAction<ListarTipoTerminalResult>('ListarTipoTerminal', undefined, options);
}
