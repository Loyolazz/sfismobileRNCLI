import { callSoapAction, type SoapRequestOptions } from '../api';

/** --------- Utilitários de SOAP --------- **/

type SoapNil = { '@_nil': string };
type SoapMaybe<T> = T | SoapNil | null | undefined;

const isSoapNil = (value: unknown): value is SoapNil =>
  typeof value === 'object' && value !== null && '@_nil' in (value as Record<string, unknown>);

const fromSoap = <T,>(value: SoapMaybe<T>): T | undefined => {
  if (value === null || value === undefined) return undefined;
  if (isSoapNil(value)) return undefined;
  return value;
};

const soapToString = (value: SoapMaybe<string | number>): string | undefined => {
  const cleaned = fromSoap(value);
  if (cleaned === undefined) return undefined;
  return String(cleaned).trim();
};

const soapToNumberOrString = (value: SoapMaybe<number | string>): number | string | undefined => {
  const cleaned = fromSoap(value);
  if (cleaned === undefined) return undefined;
  if (typeof cleaned === 'number') return cleaned;
  const trimmed = cleaned.trim();
  const parsed = Number(trimmed);
  return Number.isNaN(parsed) ? trimmed : parsed;
};

const soapToBooleanOrString = (
  value: SoapMaybe<boolean | string>,
): boolean | string | undefined => {
  const cleaned = fromSoap(value);
  if (cleaned === undefined) return undefined;
  if (typeof cleaned === 'boolean') return cleaned;
  const trimmed = cleaned.trim().toLowerCase();
  if (trimmed === 'true') return true;
  if (trimmed === 'false') return false;
  return cleaned.trim();
};

const normalizarLista = <T,>(value: T | T[] | null | undefined): T[] => {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
};

/** --------- Tipos SOAP (como chegam do serviço) --------- **/

type HistoricoProcessoEmpresaSoap = {
  CodProcesso?: SoapMaybe<string | number>;
  CodProcessoFormatado?: SoapMaybe<string | number>;
  DSIrregularidadeIE?: SoapMaybe<string>;
  DTCiencia?: SoapMaybe<string>;
  NRAutoInfracao?: SoapMaybe<string | number>;
  NRInscricao?: SoapMaybe<string | number>;
  NRNotificacao?: SoapMaybe<string | number>;
  SituacaoProcesso?: SoapMaybe<string>;
  STCorrigida?: SoapMaybe<boolean | string>;
  STProcesso?: SoapMaybe<number | string>;
  TipoDecisao?: SoapMaybe<string>;
  TipoFiscalizacao?: SoapMaybe<string>;
  TipoInfracao?: SoapMaybe<string>;
  TPDecisao?: SoapMaybe<number | string>;
  TPFiscalizacao?: SoapMaybe<string>;
  TPHistorico?: SoapMaybe<string | number>;
  TPInfracao?: SoapMaybe<number | string>;
  VLMulta?: SoapMaybe<string | number>;
};

type HistoricoAcaoFiscalizadoraSoap = {
  NRAnoFiscalizacao?: SoapMaybe<string | number>;
  NRInscricao?: SoapMaybe<string | number>;
  QTFiscalizacao?: SoapMaybe<number | string>;
  TipoFiscalizacao?: SoapMaybe<string>;
  TPFiscalizacao?: SoapMaybe<string>;
};

type SoapHistoricoProcessosEmpresa = {
  HistoricoProcessosEmpresa?:
    | HistoricoProcessoEmpresaSoap
    | HistoricoProcessoEmpresaSoap[]
    | null;
} | null;

type SoapHistoricoAcoesFiscalizadoras = {
  HistoricoAcoesFiscalizadoras?:
    | HistoricoAcaoFiscalizadoraSoap
    | HistoricoAcaoFiscalizadoraSoap[]
    | null;
} | null;

type ConsultarHistoricoFiscalizacoesPorEmpresaSoapResult = {
  HistoricoProcessosEmpresa?: SoapHistoricoProcessosEmpresa;
  HistoricoAcoesFiscalizadoras?: SoapHistoricoAcoesFiscalizadoras;
};

/** --------- Tipos normalizados (para a aplicação) --------- **/

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
  /** Objeto SOAP original referente a este item */
  raw: HistoricoProcessoEmpresaSoap;
};

export type HistoricoAcaoFiscalizadora = {
  NRAnoFiscalizacao?: string;
  NRInscricao?: string;
  QTFiscalizacao?: number | string;
  TipoFiscalizacao?: string;
  TPFiscalizacao?: string;
  /** Objeto SOAP original referente a este item */
  raw: HistoricoAcaoFiscalizadoraSoap;
};

export type ConsultarHistoricoFiscalizacoesPorEmpresaParams = {
  nrinscricao: string;
};

export type ConsultarHistoricoFiscalizacoesPorEmpresaResult = {
  processos: HistoricoProcessoEmpresa[];
  acoes: HistoricoAcaoFiscalizadora[];
  /** Resposta SOAP bruta, para auditoria/depuração */
  raw?: ConsultarHistoricoFiscalizacoesPorEmpresaSoapResult;
};

/** --------- Normalização --------- **/

const normalizarProcesso = (processo: HistoricoProcessoEmpresaSoap): HistoricoProcessoEmpresa => ({
  CodProcesso: soapToString(processo.CodProcesso),
  CodProcessoFormatado: soapToString(processo.CodProcessoFormatado),
  DSIrregularidadeIE: soapToString(processo.DSIrregularidadeIE),
  DTCiencia: soapToString(processo.DTCiencia),
  NRAutoInfracao: soapToString(processo.NRAutoInfracao),
  NRInscricao: soapToString(processo.NRInscricao),
  NRNotificacao: soapToString(processo.NRNotificacao),
  SituacaoProcesso: soapToString(processo.SituacaoProcesso),
  STCorrigida: soapToBooleanOrString(processo.STCorrigida),
  STProcesso: soapToNumberOrString(processo.STProcesso),
  TipoDecisao: soapToString(processo.TipoDecisao),
  TipoFiscalizacao: soapToString(processo.TipoFiscalizacao),
  TipoInfracao: soapToString(processo.TipoInfracao),
  TPDecisao: soapToNumberOrString(processo.TPDecisao),
  TPFiscalizacao: soapToString(processo.TPFiscalizacao),
  TPHistorico: soapToString(processo.TPHistorico),
  TPInfracao: soapToNumberOrString(processo.TPInfracao),
  VLMulta: soapToString(processo.VLMulta),
  raw: processo,
});

const normalizarAcao = (acao: HistoricoAcaoFiscalizadoraSoap): HistoricoAcaoFiscalizadora => ({
  NRAnoFiscalizacao: soapToString(acao.NRAnoFiscalizacao),
  NRInscricao: soapToString(acao.NRInscricao),
  QTFiscalizacao: soapToNumberOrString(acao.QTFiscalizacao),
  TipoFiscalizacao: soapToString(acao.TipoFiscalizacao),
  TPFiscalizacao: soapToString(acao.TPFiscalizacao),
  raw: acao,
});

/** --------- Função principal --------- **/

export async function consultarHistoricoFiscalizacoesPorEmpresa(
  params: ConsultarHistoricoFiscalizacoesPorEmpresaParams,
  options?: SoapRequestOptions,
): Promise<ConsultarHistoricoFiscalizacoesPorEmpresaResult> {
  console.log(
    '[consultarHistoricoFiscalizacoesPorEmpresa] iniciando chamada com parâmetros',
    params,
  );

  const raw = await callSoapAction<ConsultarHistoricoFiscalizacoesPorEmpresaSoapResult>(
    'ConsultarHistoricoFiscalizacoesPorEmpresa',
    params,
    options,
  );

  console.log('[consultarHistoricoFiscalizacoesPorEmpresa] resposta bruta recebida', raw);

  const processos = normalizarLista(
    raw?.HistoricoProcessosEmpresa?.HistoricoProcessosEmpresa ?? null,
  ).map(normalizarProcesso);

  const acoes = normalizarLista(
    raw?.HistoricoAcoesFiscalizadoras?.HistoricoAcoesFiscalizadoras ?? null,
  ).map(normalizarAcao);

  console.log('[consultarHistoricoFiscalizacoesPorEmpresa] listas normalizadas', {
    processos,
    acoes,
  });

  return { processos, acoes, raw };
}
