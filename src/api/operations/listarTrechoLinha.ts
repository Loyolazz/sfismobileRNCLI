import { callSoapAction, type SoapRequestOptions } from '../api';

export type ListarTrechoLinhaResult = {
  TrechoLinha: Array<{
    DSTrechoLinha: string;
    IDTipoTransporte_1: boolean;
    IDTipoTransporte_2: boolean;
    IDTipoTransporte_3: boolean;
    IDTipoTransporte_4: boolean;
    IDTipoTransporte_5: boolean;
    IDTipoTransporte_6: boolean;
    IDTipoTransporte_7: boolean;
    IDTrechoLinha: number;
  }>;
};

export async function listarTrechoLinha(options?: SoapRequestOptions) {
  return callSoapAction<ListarTrechoLinhaResult>('ListarTrechoLinha', undefined, options);
}
