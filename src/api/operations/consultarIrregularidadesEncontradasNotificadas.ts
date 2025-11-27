import { callSoapAction, type SoapRequestOptions } from '../api';

export type ConsultarIrregularidadesEncontradasNotificadasParams = {
  irregularidades: {
    ItemIrregularidadeEncontrada: Array<{
      IDIrregularidade: number;
    }>;
  };
  numeroInscricao: string;
  tipoInscricao: string;
};

export type ConsultarIrregularidadesEncontradasNotificadasResult = {
  IrregularidadeNotificada: Array<{
    IDIrregularidade: number;
    IrregularidadesEncontradaNotificada: {
      IrregularidadeEncontradaNotificada: Record<string, unknown>[];
    };
  }>;
};

export async function consultarIrregularidadesEncontradasNotificadas(params: ConsultarIrregularidadesEncontradasNotificadasParams, options?: SoapRequestOptions) {
  return callSoapAction<ConsultarIrregularidadesEncontradasNotificadasResult>('ConsultarIrregularidadesEncontradasNotificadas', params, options);
}
