import { extractSoapResult, soapRequest, type SoapRequestOptions } from './antaq';

export type SoapActionParams = Record<string, unknown> | undefined;

export async function callSoapAction<TResult = unknown>(
  action: string,
  params?: SoapActionParams,
  options?: SoapRequestOptions,
): Promise<TResult> {
  console.log(`[SOAP] Chamando ação ${action}`, params ?? {});
  const parsed = await soapRequest(action, params, options);
  const result = extractSoapResult(parsed, action) as TResult;
  console.log(`[SOAP] Retorno da ação ${action}`, result);
  return result;
}

export { extractSoapResult, soapRequest };
export type { SoapRequestOptions };
