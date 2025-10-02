import { callSoapAction, type SoapRequestOptions } from '../api';

export type ConsularTerminalParams = {
  cnpj: string;
};

export type ConsularTerminalResult = number;

export async function consularTerminal(params: ConsularTerminalParams, options?: SoapRequestOptions) {
  return callSoapAction<ConsularTerminalResult>('ConsularTerminal', params, options);
}
