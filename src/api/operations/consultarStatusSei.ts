import { callSoapAction, type SoapRequestOptions } from '../api';

export type ConsultarStatusSeiResult = {
  DSPath: string;
  Status: string;
};

export async function consultarStatusSei(options?: SoapRequestOptions) {
  return callSoapAction<ConsultarStatusSeiResult>('ConsultarStatusSei', undefined, options);
}
