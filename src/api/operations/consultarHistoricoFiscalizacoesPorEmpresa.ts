import { callSoapAction, type SoapRequestOptions } from '../api';

export type ConsultarHistoricoFiscalizacoesPorEmpresaParams = {
  nrinscricao: string;
};

export type ConsultarHistoricoFiscalizacoesPorEmpresaResult = {
  HistoricoAcoesFiscalizadoras: {
    HistoricoAcoesFiscalizadoras: Array<{
      NRAnoFiscalizacao: string;
      NRInscricao: string;
      QTFiscalizacao: number;
      TipoFiscalizacao: string;
      TPFiscalizacao: string;
    }>;
  };
  HistoricoProcessosEmpresa: {
    HistoricoProcessosEmpresa: Array<{
      CodProcesso: string;
      CodProcessoFormatado: string;
      DSIrregularidadeIE: string;
      DTCiencia: string;
      NRAutoInfracao: string;
      NRInscricao: string;
      NRNotificacao: string;
      SituacaoProcesso: string;
      STCorrigida: boolean;
      STProcesso: number;
      TipoDecisao: string;
      TipoFiscalizacao: string;
      TipoInfracao: string;
      TPDecisao: number;
      TPFiscalizacao: string;
      TPHistorico: string;
      TPInfracao: number;
      VLMulta: string;
    }>;
  };
};

export async function consultarHistoricoFiscalizacoesPorEmpresa(params: ConsultarHistoricoFiscalizacoesPorEmpresaParams, options?: SoapRequestOptions) {
  return callSoapAction<ConsultarHistoricoFiscalizacoesPorEmpresaResult>('ConsultarHistoricoFiscalizacoesPorEmpresa', params, options);
}
