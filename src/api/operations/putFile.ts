import { callSoapAction, type SoapRequestOptions } from '../api';

export type PutFileParams = {
  buffer: string;
  filename: string;
};

export type PutFileResult = unknown;

export async function putFile(params: PutFileParams, options?: SoapRequestOptions) {
  return callSoapAction<PutFileResult>('PutFile', params, options);
}
