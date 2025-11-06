import { callSoapAction, type SoapRequestOptions } from '../api';

export type ConsultarHistoricoFiscalizacoesPorEmpresaParams = {
  nrinscricao: string;
};

export type HistoricoProcessoEmpresa = {
  CodProcesso?: string;
  CodProcessoFormatado?: string;
  DSIrregularidadeIE?: string;
  DTCiencia?: string;
  NRAutoInfracao?: string;
  NRInscricao?: string;
  NRNotificacao?: string;
  SituacaoProcesso?: string;
  STCorrigida?: boolean | string;
  STProcesso?: number | string;
  TipoDecisao?: string;
  TipoFiscalizacao?: string;
  TipoInfracao?: string;
  TPDecisao?: number | string;
  TPFiscalizacao?: string;
  TPHistorico?: string;
  TPInfracao?: number | string;
  VLMulta?: string;
};

export type HistoricoAcaoFiscalizadora = {
  NRAnoFiscalizacao?: string;
  NRInscricao?: string;
  QTFiscalizacao?: number | string;
  TipoFiscalizacao?: string;
  TPFiscalizacao?: string;
};

type SoapHistoricoProcessosEmpresa = {
  HistoricoProcessosEmpresa?: HistoricoProcessoEmpresa | HistoricoProcessoEmpresa[] | null;
} | null;

type SoapHistoricoAcoesFiscalizadoras = {
  HistoricoAcoesFiscalizadoras?: HistoricoAcaoFiscalizadora | HistoricoAcaoFiscalizadora[] | null;
} | null;

type ConsultarHistoricoFiscalizacoesPorEmpresaSoapResult = {
  HistoricoProcessosEmpresa?: SoapHistoricoProcessosEmpresa;
  HistoricoAcoesFiscalizadoras?: SoapHistoricoAcoesFiscalizadoras;
};

export type ConsultarHistoricoFiscalizacoesPorEmpresaResult = {
  processos: HistoricoProcessoEmpresa[];
  acoes: HistoricoAcaoFiscalizadora[];
  raw?: ConsultarHistoricoFiscalizacoesPorEmpresaSoapResult;
};

const normalizarLista = <T,>(value: T | T[] | null | undefined): T[] => {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
};

export async function consultarHistoricoFiscalizacoesPorEmpresa(
  params: ConsultarHistoricoFiscalizacoesPorEmpresaParams,
  options?: SoapRequestOptions,
): Promise<ConsultarHistoricoFiscalizacoesPorEmpresaResult> {
  const raw = await callSoapAction<ConsultarHistoricoFiscalizacoesPorEmpresaSoapResult>(
    'ConsultarHistoricoFiscalizacoesPorEmpresa',
    params,
    options,
  );

  const processos = normalizarLista(raw?.HistoricoProcessosEmpresa?.HistoricoProcessosEmpresa);
  const acoes = normalizarLista(raw?.HistoricoAcoesFiscalizadoras?.HistoricoAcoesFiscalizadoras);

  return { processos, acoes, raw };
}
