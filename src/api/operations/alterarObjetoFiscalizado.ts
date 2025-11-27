import { callSoapAction, type SoapRequestOptions } from '../api';

export type AlterarObjetoFiscalizadoParams = {
  DSObservacoesGerais: string;
  IDObjetoFiscalizado: number;
  STIrregularidadeEncontrada: boolean;
  STMobile: boolean;
};

export type AlterarObjetoFiscalizadoResult = boolean;

export async function alterarObjetoFiscalizado(params: AlterarObjetoFiscalizadoParams, options?: SoapRequestOptions) {
  return callSoapAction<AlterarObjetoFiscalizadoResult>('AlterarObjetoFiscalizado', params, options);
}
