import { callSoapAction, type SoapRequestOptions } from '../api';

export type GetVersionResult = string;

export async function getVersion(options?: SoapRequestOptions): Promise<string> {
  console.log('[API] getVersion chamada');
  const result = await callSoapAction<GetVersionResult | number | null>('GetVersion', undefined, options);
  const version = typeof result === 'string' ? result : result != null ? String(result) : undefined;
  console.log('[API] getVersion retorno', version);

  if (version) {
    return version;
  }

  throw new Error('GetVersionResult não encontrado na resposta SOAP.');
}
