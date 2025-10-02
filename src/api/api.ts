import { extractSoapResult, soapRequest, type SoapRequestOptions } from './antaq';

export type SoapActionParams = Record<string, unknown> | undefined;

export async function callSoapAction<TResult = unknown>(
  action: string,
  params?: SoapActionParams,
  options?: SoapRequestOptions,
): Promise<TResult> {
  const parsed = await soapRequest(action, params, options);
  return extractSoapResult(parsed, action) as TResult;
}

export { extractSoapResult, soapRequest };
export type { SoapRequestOptions };
