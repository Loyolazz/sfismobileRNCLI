import { callSoapAction, type SoapRequestOptions } from '../api';

export type ConsultarHistoricoFiscalizacoesPorEmpresaParams = {
  nrinscricao: string;
};

type SoapRecord = Record<string, unknown>;
type SoapValor = string | number | boolean | null | SoapRecord;

type SoapHistoricoProcessoEmpresa = {
  CodProcesso?: SoapValor;
  CodProcessoFormatado?: SoapValor;
  DSIrregularidadeIE?: SoapValor;
  DTCiencia?: SoapValor;
  NRAutoInfracao?: SoapValor;
  NRInscricao?: SoapValor;
  NRNotificacao?: SoapValor;
  SituacaoProcesso?: SoapValor;
  STCorrigida?: SoapValor;
  STProcesso?: SoapValor;
  TipoDecisao?: SoapValor;
  TipoFiscalizacao?: SoapValor;
  TipoInfracao?: SoapValor;
  TPDecisao?: SoapValor;
  TPFiscalizacao?: SoapValor;
  TPHistorico?: SoapValor;
  TPInfracao?: SoapValor;
  VLMulta?: SoapValor;
};

type SoapHistoricoAcaoFiscalizadora = {
  NRAnoFiscalizacao?: SoapValor;
  NRInscricao?: SoapValor;
  QTFiscalizacao?: SoapValor;
  TipoFiscalizacao?: SoapValor;
  TPFiscalizacao?: SoapValor;
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
  STProcesso?: string;
  TipoDecisao?: string;
  TipoFiscalizacao?: string;
  TipoInfracao?: string;
  TPDecisao?: string;
  TPFiscalizacao?: string;
  TPHistorico?: string;
  TPInfracao?: string;
  VLMulta?: string;
};

export type HistoricoAcaoFiscalizadora = {
  NRAnoFiscalizacao?: string | number;
  NRInscricao?: string;
  QTFiscalizacao?: string | number;
  TipoFiscalizacao?: string;
  TPFiscalizacao?: string;
};

type SoapHistoricoProcessosEmpresa = {
  HistoricoProcessosEmpresa?: SoapHistoricoProcessoEmpresa | SoapHistoricoProcessoEmpresa[] | null;
} | null;

type SoapHistoricoAcoesFiscalizadoras = {
  HistoricoAcoesFiscalizadoras?: SoapHistoricoAcaoFiscalizadora | SoapHistoricoAcaoFiscalizadora[] | null;
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

const safeTrim = (texto: string): string => texto.replace(/^\s+|\s+$/g, '');

const extrairValor = (valor: SoapValor | undefined): unknown => {
  if (valor && typeof valor === 'object') {
    const registro = valor as SoapRecord;
    if ('#text' in registro && registro['#text'] !== undefined) return extrairValor(registro['#text']);
    if ('_text' in registro && registro._text !== undefined) return extrairValor(registro._text);
    if ('@_text' in registro && registro['@_text'] !== undefined) return extrairValor(registro['@_text']);
    if ('value' in registro && registro.value !== undefined) return extrairValor(registro.value);
    if ('@_nil' in registro) return undefined;
  }
  return valor;
};

const normalizarTipoHistorico = (
  valor: SoapHistoricoProcessoEmpresa['TPHistorico'],
): string | undefined => {
  const resolvido = extrairValor(valor);
  if (resolvido === null || resolvido === undefined) return undefined;
  const texto = safeTrim(String(resolvido));
  if (!texto || texto === '[object Object]') return undefined;
  const numerico = Number(texto);
  return Number.isNaN(numerico) ? texto : String(numerico);
};

const normalizarCampoTexto = (valor: SoapValor | undefined): string | undefined => {
  const resolvido = extrairValor(valor);
  if (resolvido === null || resolvido === undefined) return undefined;
  const texto = safeTrim(String(resolvido));
  if (!texto || texto === '[object Object]') return undefined;
  return texto;
};

const normalizarCampoNumero = (valor: SoapValor | undefined): number | undefined => {
  const resolvido = extrairValor(valor);
  if (resolvido === null || resolvido === undefined || resolvido === '') return undefined;
  const numero = Number(resolvido);
  return Number.isNaN(numero) ? undefined : numero;
};

const normalizarCampoBoolean = (
  valor: SoapHistoricoProcessoEmpresa['STCorrigida'],
): boolean | string | undefined => {
  const resolvido = extrairValor(valor);
  if (resolvido === null || resolvido === undefined) return undefined;
  if (typeof resolvido === 'boolean') return resolvido;
  if (typeof resolvido === 'number') return resolvido !== 0;
  if (typeof resolvido === 'string') {
    const texto = safeTrim(resolvido);
    if (!texto || texto === '[object Object]') return undefined;
    const lower = texto.toLowerCase();
    if (lower === 'true') return true;
    if (lower === 'false') return false;
    return texto;
  }
  return undefined;
};

const normalizarCampoTextoOuNumero = (
  valor: SoapValor | undefined,
): string | number | undefined => {
  const numero = normalizarCampoNumero(valor);
  if (numero !== undefined) return numero;
  return normalizarCampoTexto(valor);
};

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

  const processos = normalizarLista<SoapHistoricoProcessoEmpresa>(
    raw?.HistoricoProcessosEmpresa?.HistoricoProcessosEmpresa,
  ).map((item) => {
    const processo: HistoricoProcessoEmpresa = {
      CodProcesso: normalizarCampoTexto(item?.CodProcesso),
      CodProcessoFormatado: normalizarCampoTexto(item?.CodProcessoFormatado),
      DSIrregularidadeIE: normalizarCampoTexto(item?.DSIrregularidadeIE),
      DTCiencia: normalizarCampoTexto(item?.DTCiencia),
      NRAutoInfracao: normalizarCampoTexto(item?.NRAutoInfracao),
      NRInscricao: normalizarCampoTexto(item?.NRInscricao),
      NRNotificacao: normalizarCampoTexto(item?.NRNotificacao),
      SituacaoProcesso: normalizarCampoTexto(item?.SituacaoProcesso),
      STCorrigida: normalizarCampoBoolean(item?.STCorrigida),
      STProcesso: normalizarCampoTexto(item?.STProcesso),
      TipoDecisao: normalizarCampoTexto(item?.TipoDecisao),
      TipoFiscalizacao: normalizarCampoTexto(item?.TipoFiscalizacao),
      TipoInfracao: normalizarCampoTexto(item?.TipoInfracao),
      TPDecisao: normalizarCampoTexto(item?.TPDecisao),
      TPFiscalizacao: normalizarCampoTexto(item?.TPFiscalizacao),
      TPHistorico: normalizarTipoHistorico(item?.TPHistorico),
      TPInfracao: normalizarCampoTexto(item?.TPInfracao),
      VLMulta: normalizarCampoTexto(item?.VLMulta),
    };
    return processo;
  });

  const acoes = normalizarLista<SoapHistoricoAcaoFiscalizadora>(
    raw?.HistoricoAcoesFiscalizadoras?.HistoricoAcoesFiscalizadoras,
  ).map((item) => {
    const acao: HistoricoAcaoFiscalizadora = {
      QTFiscalizacao: normalizarCampoTextoOuNumero(item?.QTFiscalizacao),
      TPFiscalizacao: normalizarCampoTexto(item?.TPFiscalizacao),
      TipoFiscalizacao: normalizarCampoTexto(item?.TipoFiscalizacao),
      NRInscricao: normalizarCampoTexto(item?.NRInscricao),
      NRAnoFiscalizacao: normalizarCampoTextoOuNumero(item?.NRAnoFiscalizacao),
    };
    return acao;
  });

  console.log('[consultarHistoricoFiscalizacoesPorEmpresa] listas normalizadas', {
    processos,
    acoes,
  });

  return { processos, acoes, raw };
}
