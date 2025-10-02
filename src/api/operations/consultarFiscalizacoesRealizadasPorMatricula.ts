import { callSoapAction, type SoapRequestOptions } from '../api';

export type ConsultarFiscalizacoesRealizadasPorMatriculaParams = {
  anoInicial: string;
  matricula: string;
};

export type ConsultarFiscalizacoesRealizadasPorMatriculaResult = {
  FiscalizacoesRealizadasServidor: Array<{
    Ano: number;
    Mes: number;
    QTFiscalizacao: number;
    QTFiscalizacaoAutoInfracao: number;
    QTFiscalizacaoInterior: number;
    QTFiscalizacaoMaritima: number;
    QTFiscalizacaoNotificacao: number;
    QTFiscalizacaoPorto: number;
    QTNRInscricao: number;
    QTNRInscricaoInterior: number;
    QTNRInscricaoMaritima: number;
    QTNRInscricaoPorto: number;
    QTProcedimentoApartado: number;
    QTProcedimentoAutoInfracao: number;
    QTProcedimentoExtraordinaria: number;
    QTProcedimentoNoci: number;
    QTProcedimentoProgramada: number;
    QTProcedimentoRotina: number;
  }>;
};

export async function consultarFiscalizacoesRealizadasPorMatricula(params: ConsultarFiscalizacoesRealizadasPorMatriculaParams, options?: SoapRequestOptions) {
  return callSoapAction<ConsultarFiscalizacoesRealizadasPorMatriculaResult>('ConsultarFiscalizacoesRealizadasPorMatricula', params, options);
}
