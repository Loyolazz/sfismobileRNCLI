import { callSoapAction, type SoapRequestOptions } from '../api';

export type GetVersionResult = string;

export async function getVersion(options?: SoapRequestOptions) {
  return callSoapAction<GetVersionResult>('GetVersion', undefined, options);
}
