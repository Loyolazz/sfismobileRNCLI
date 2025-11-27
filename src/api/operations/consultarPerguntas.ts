import { callSoapAction, type SoapRequestOptions } from '../api';

export type ConsultarPerguntasParams = {
  norma: string;
  secao: {
    string: string[];
  };
};

export type ConsultarPerguntasResult = {
  Pergunta: Array<{
    DSPergunta: string;
    DSSecao: string;
    IDPergunta: number;
    IDSecao: number;
    Irregularidades: {
      Irregularidade: Record<string, unknown>[];
    };
    STAtivo: boolean;
  }>;
};

export async function consultarPerguntas(params: ConsultarPerguntasParams, options?: SoapRequestOptions) {
  return callSoapAction<ConsultarPerguntasResult>('ConsultarPerguntas', params, options);
}
