import { callSoapAction, type SoapRequestOptions } from '../api';

export type InserirFiscalizacaoFotoIrregularidadeAvulsaParams = {
  AnexoIrregularidade: {
    AnexoIrregularidade: Array<{
      ArquivoDados: string;
      DSPath: string;
      DTRegistro: string;
      IDAnexoIrregularidade: number;
      IDIrregularidade: number;
      IDObjetoFiscalizado: number;
      NRDocumento: string;
      TPAnexo: number;
    }>;
  };
};

export type InserirFiscalizacaoFotoIrregularidadeAvulsaResult = boolean;

export async function inserirFiscalizacaoFotoIrregularidadeAvulsa(params: InserirFiscalizacaoFotoIrregularidadeAvulsaParams, options?: SoapRequestOptions) {
  return callSoapAction<InserirFiscalizacaoFotoIrregularidadeAvulsaResult>('InserirFiscalizacaoFotoIrregularidadeAvulsa', params, options);
}
