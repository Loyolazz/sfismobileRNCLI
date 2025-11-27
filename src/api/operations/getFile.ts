import { callSoapAction, type SoapRequestOptions } from '../api';

export type GetFileParams = {
  filename: string;
};

export type GetFileResult = string;

export async function getFile(params: GetFileParams, options?: SoapRequestOptions) {
  return callSoapAction<GetFileResult>('GetFile', params, options);
}
