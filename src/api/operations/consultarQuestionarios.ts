import { callSoapAction, type SoapRequestOptions } from '../api';

export type ConsultarQuestionariosParams = {
  norma: string;
};

export type ConsultarQuestionariosResult = {
  Questionario: Array<{
    DSNorma: string;
    DSSecao: string;
    DTCriacao: string;
    IDQuestionario: number;
    IDSecao: number;
    IDSuperintendencia: number;
    NOQuestionario: string;
  }>;
};

export async function consultarQuestionarios(params: ConsultarQuestionariosParams, options?: SoapRequestOptions) {
  return callSoapAction<ConsultarQuestionariosResult>('ConsultarQuestionarios', params, options);
}
