import { callSoapAction, type SoapRequestOptions } from '../api';

export type ListarPerguntasResult = {
  PerguntaNorma: Array<{
    DSNorma: string;
    DSPergunta: string;
    DSSecao: string;
    IDPergunta: number;
    IDSecao: number;
    Irregularidades: {
      Irregularidade: Record<string, unknown>[];
    };
    STAcaoVariavel: boolean;
    STAtivo: boolean;
  }>;
};

export async function listarPerguntas(options?: SoapRequestOptions) {
  return callSoapAction<ListarPerguntasResult>('ListarPerguntas', undefined, options);
}
