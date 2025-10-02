import { callSoapAction, type SoapRequestOptions } from '../api';

export type ListarTipoTransporteResult = {
  TipoTransporte: Array<{
    DSTipoTransporte: string;
    IDTipoTransporte: number;
  }>;
};

export async function listarTipoTransporte(options?: SoapRequestOptions) {
  return callSoapAction<ListarTipoTransporteResult>('ListarTipoTransporte', undefined, options);
}
