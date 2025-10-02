import { callSoapAction, type SoapRequestOptions } from '../api';

export type ConsultarIrregularidadesParams = {
  norma: string;
};

export type ConsultarIrregularidadesResult = {
  Irregularidade: Array<{
    DSAlinea: string;
    DSInciso: string;
    DSNorma: string;
    DSNormaCompleta: string;
    DSNormativa: string;
    DSRequisito: string;
    IDFiscalizacao: number;
    IDIrregularidade: number;
    IDRequisito: number;
    IDSuperintendencia: number;
    NORequisito: string;
    NRArtigo: number;
    NRParagrafo: number;
    NRPrazo: number;
    STAcaoVariavel: boolean;
    STNotificavel: boolean;
    STQuinzenal: boolean;
    TPInfracao: number;
    TPNavegacao: number;
    VLMultaMaxima: number;
  }>;
};

export async function consultarIrregularidades(params: ConsultarIrregularidadesParams, options?: SoapRequestOptions) {
  return callSoapAction<ConsultarIrregularidadesResult>('ConsultarIrregularidades', params, options);
}
