import NetInfo from '@react-native-community/netinfo';

import { callSoapAction, type SoapRequestOptions } from '../api';

import {
  listEmpresasAutorizadasAsync,
  listEmpresasPorEmbarcacaoAsync,
  type EmpresaAutorizada,
  type ListEmpresasParams,
} from '@/data/gestordb/empresasRepository';
import { ensureEmpresaPayload } from '@/utils/payload';
import { normalizeSearchText } from '@/utils/formatters';
import { aplicarPrefixoInstrumento, obterRegraModalidade, ICONES_AUTORIZACAO } from '@/utils/autorizacao';

export type TipoEmpresa = {
  IDTipoEmpresa: number;
  DSTipoEmpresa: string;
  NRinscricao?: string;
};

export type Empresa = {
  NORazaoSocial: string;
  TPInscricao?: number;
  NRInscricao: string;
  DSEndereco?: string;
  SGUF?: string;
  NOMunicipio?: string;
  DSBairro?: string;
  NRCEP?: string | number;
  QTDEmbarcacao?: number;
  AreaPPF?: string;

  Modalidade?: string;
  NRInstrumento?: string;
  DescricaoNRInstrumento?: string;
  DTAditamento?: string;
  NRAditamento?: string;
  Instalacao?: string;
  NRInscricaoInstalacao?: string;
  NORazaoSocialInstalacao?: string;
  IDTipoInstalacaoPortuaria?: string;

  icone?: string;
  norma?: string | number;

  isAutoridadePortuaria?: boolean;
  NomeContato?: string;
  Email?: string;
  AutoridadePortuaria?: string;
  NRResolucao?: string;
  NRDocumentoSEI?: string;
  NRTelefone?: string;
  NORepresentante?: string;
  EERepresentante?: string;
  STIntimacaoViaTelefone?: boolean;
  STIntimacaoViaEmail?: boolean;
  IDContratoArrendamento?: number;

  ListaTipoEmpresa?: TipoEmpresa[] | null;
};

export type ConsultarEmpresasParams = {
  cnpjRazaosocial: string;
};

export type ConsultarEmpresasResult = {
  Empresa: Array<{
    AreaPPF: string;
    AutoridadePortuaria: string;
    CDMunicipio: string;
    ContratoEmpresa: {
      ContratoEmpresa: Record<string, unknown>[];
    };
    DSBairro: string;
    DSEndereco: string;
    DTAditamento: string;
    DTOutorga: string;
    EDComplemento: string;
    EERepresentante: string;
    Email: string;
    IDContratoArrendamento: number;
    Instalacao: string;
    ListaTipoEmpresa: {
      TipoEmpresa: Record<string, unknown>[];
    };
    Modalidade: string;
    NomeContato: string;
    NOMunicipio: string;
    NORazaoSocial: string;
    NORazaoSocialInstalacao: string;
    NORepresentante: string;
    NRAditamento: string;
    NRCEP: string;
    NRDocumentoSEI: string;
    NREndereco: number;
    NRInscricao: string;
    NRInscricaoInstalacao: string;
    NRInstrumento: string;
    NRResolucao: string;
    NRTelefone: string;
    NRTLO: string;
    QTDEmbarcacao: number;
    SGUF: string;
    STIntimacaoViaEmail: boolean;
    STIntimacaoViaTelefone: boolean;
    TPInscricao: number;
    VLMontanteInvestimento: string;
  }>;
};

type FiltroAutorizadas = {
  cnpjRazaosocial?: string | null;
  modalidade?: string | null;
  embarcacao?: string | null;
  instalacao?: string | null;
};

type NormalizedFiltroAutorizadas = {
  cnpjRazaosocial: string;
  modalidade: string;
  embarcacao: string;
  instalacao: string;
};

export async function consultarEmpresas(
  params: ConsultarEmpresasParams,
  options?: SoapRequestOptions,
) {
  console.log('[API] consultarEmpresas chamada', params);
  const result = await callSoapAction<ConsultarEmpresasResult>('ConsultarEmpresas', params, options);
  console.log('[API] consultarEmpresas retorno', result);
  return result;
}

export async function buscarEmpresasCnpjRazao(termo: string): Promise<Empresa[]> {
  console.log('[API] buscarEmpresasCnpjRazao chamada', { termo });
  const parsed = await callSoapAction<ConsultarEmpresasResult | { Empresa?: unknown; d?: unknown }>(
    'ConsultarEmpresas',
    { cnpjRazaosocial: termo },
  );
  const empresa = (parsed as any)?.Empresa ?? (parsed as any)?.d ?? parsed;
  const list = Array.isArray(empresa) ? empresa : [empresa].filter(Boolean);
  const mapped = list.map(mapEmpresaResumo);
  console.log('[API] buscarEmpresasCnpjRazao retorno', mapped);
  return mapped;
}

export async function buscarEmpresasAutorizadas(
  termo: string,
  modalidade: string = '',
): Promise<Empresa[]> {
  const filtro = termo?.trim();
  const filtroModalidade = modalidade?.trim();
  console.log('[API] buscarEmpresasAutorizadas chamada', {
    termo: filtro,
    modalidade: filtroModalidade,
  });
  const result = await consultarEmpresasAutorizadas({
    cnpjRazaosocial: filtro,
    modalidade: filtroModalidade,
  });
  console.log('[API] buscarEmpresasAutorizadas retorno', result);
  return result;
}

export async function consultarPorModalidade(modalidade: string): Promise<Empresa[]> {
  const filtro = modalidade?.trim();
  console.log('[API] consultarPorModalidade chamada', { modalidade: filtro });
  const result = await consultarEmpresasAutorizadas({
    cnpjRazaosocial: '',
    modalidade: filtro,
  });
  console.log('[API] consultarPorModalidade retorno', result);
  return result;
}

export async function consultarPorEmbarcacao(embarcacao: string): Promise<Empresa[]> {
  console.log('[API] consultarPorEmbarcacao chamada', { embarcacao });
  const result = await consultarEmpresasAutorizadas({ embarcacao });
  console.log('[API] consultarPorEmbarcacao retorno', result);
  return result;
}

export async function consultarPorInstalacao(instalacao: string): Promise<Empresa[]> {
  console.log('[API] consultarPorInstalacao chamada', { instalacao });
  const result = await consultarEmpresasAutorizadas({ instalacao });
  console.log('[API] consultarPorInstalacao retorno', result);
  return result;
}

function normalizeFiltroAutorizadas(payload: FiltroAutorizadas): NormalizedFiltroAutorizadas {
  return {
    cnpjRazaosocial: payload.cnpjRazaosocial?.trim() ?? '',
    modalidade: payload.modalidade?.trim() ?? '',
    embarcacao: payload.embarcacao?.trim() ?? '',
    instalacao: payload.instalacao?.trim() ?? '',
  };
}

async function consultarEmpresasAutorizadas(payload: FiltroAutorizadas): Promise<Empresa[]> {
  const filtro = normalizeFiltroAutorizadas(payload);
  const normalizedInstalacao = normalizeSearchText(filtro.instalacao);

  const filtrarInstalacao = (empresas: Empresa[]) => {
    if (!normalizedInstalacao) return empresas;
    return empresas.filter((empresa) => {
      const campos = [empresa.Instalacao, empresa.NORazaoSocialInstalacao, empresa.AreaPPF];
      return campos.some((campo) => normalizeSearchText(campo).includes(normalizedInstalacao));
    });
  };

  if (await shouldUseOfflineData()) {
    return filtrarInstalacao(await consultarEmpresasAutorizadasOffline(filtro));
  }

  try {
    console.log('[API] consultarEmpresasAutorizadas SOAP', filtro);
    const parsed = await callSoapAction<any>('ConsultarEmpresasAutorizadas', {
      cnpjRazaosocial: filtro.cnpjRazaosocial || undefined,
      modalidade: filtro.modalidade || undefined,
      embarcacao: filtro.embarcacao || undefined,
      instalacao: filtro.instalacao || undefined,
    });
    const itens = Array.isArray(parsed?.d) ? parsed.d : parsed?.Empresa ?? parsed;
    const list: any[] = Array.isArray(itens) ? itens : [itens].filter(Boolean);

    const mapped = filtrarInstalacao(list.map(mapEmpresaAutorizadaLikeCordova));
    if (!mapped.length) {
      const offline = filtrarInstalacao(await consultarEmpresasAutorizadasOffline(filtro));
      console.log('[API] consultarEmpresasAutorizadas retorno offline (sem dados online)', offline);
      return offline;
    }

    console.log('[API] consultarEmpresasAutorizadas retorno SOAP', mapped);
    return mapped;
  } catch (error) {
    console.log('[API] consultarEmpresasAutorizadas erro SOAP', error);
    const fallback = filtrarInstalacao(await consultarEmpresasAutorizadasOffline(filtro));
    if (fallback.length > 0) {
      console.log('[API] consultarEmpresasAutorizadas retorno offline (fallback)', fallback);
      return fallback;
    }
    throw error;
  }
}

async function consultarEmpresasAutorizadasOffline(
  payload: NormalizedFiltroAutorizadas,
): Promise<Empresa[]> {
  const { cnpjRazaosocial, modalidade, instalacao, embarcacao } = payload;

  if (embarcacao) {
    const porEmbarcacao = await listEmpresasPorEmbarcacaoAsync(embarcacao);
    if (porEmbarcacao.length > 0) {
      return porEmbarcacao.map(mapEmpresaAutorizadaOffline);
    }
  }

  const params: ListEmpresasParams = {};

  if (cnpjRazaosocial) {
    params.busca = cnpjRazaosocial;
  } else if (instalacao) {
    params.instalacao = instalacao;
  } else if (embarcacao) {
    params.busca = embarcacao;
  }

  if (modalidade) {
    params.modalidade = modalidade;
  }

  const empresas = await listEmpresasAutorizadasAsync(params);
  return empresas.map(mapEmpresaAutorizadaOffline);
}

async function shouldUseOfflineData(): Promise<boolean> {
  try {
    const state = await NetInfo.fetch();
    if (!state) return false;
    if (!state.isConnected) return true;
    if (state.type === 'none' || state.type === 'unknown') return true;
    if (state.isInternetReachable === false) return true;
  } catch {
    return false;
  }

  return false;
}

function mapEmpresaAutorizadaOffline(row: EmpresaAutorizada): Empresa {
  const payload = ensureEmpresaPayload(row.payload, {
    NORazaoSocial: row.NORAZAOSOCIAL,
    TPInscricao: coerceNumber(row.TPINSCRICAO) ?? row.TPINSCRICAO,
    NRInscricao: row.NRINSCRICAO,
    DSEndereco: row.DSENDERECO,
    SGUF: row.SGUF,
    NOMunicipio: row.NOMUNICIPIO,
    DSBairro: row.DSBAIRRO,
    NRCEP: row.NRCEP,
    QTDEmbarcacao: coerceNumber(row.QTDEMBARCACAO),
    AreaPPF: row.AREAPPF,
    Instalacao: row.INSTALACAO,
    Modalidade: row.MODALIDADE,
    NRInstrumento: row.NRINSTRUMENTO,
    DTOutorga: row.DTOUTORGA,
    DTAditamento: row.DTADITAMENTO,
    NRAditamento: row.NRADITAMENTO,
    NomeContato: row.NOMECONTATO,
    Email: row.EMAIL,
    IDContratoArrendamento: coerceNumber(row.IDCONTRATOARRENDAMENTO) ?? row.IDCONTRATOARRENDAMENTO,
    VLMontanteInvestimento: row.VLMONTANTEINVESTIMENTO,
    NRTLO: row.NRTLO,
    NRResolucao: row.NRRESOLUCAO,
    AutoridadePortuaria: row.AUTORIDADEPORTUARIA,
    NRInscricaoInstalacao: row.NRINSCRICAOINSTALACAO,
    NORazaoSocialInstalacao: row.NORAZAOSOCIALINSTALACAO,
    NORepresentante: row.NOREPRESENTANTE,
    NRTelefone: row.NRTELEFONE,
    EERepresentante: row.EEREPRESENTANTE,
    NRDocumentoSEI: row.NRDOCUMENTOSEI,
  });

  if (payload.ListaTipoEmpresa == null && row.LISTATIPOEMPRESA) {
    payload.ListaTipoEmpresa = row.LISTATIPOEMPRESA;
  }

  if (payload.QTDEmbarcacao == null) {
    payload.QTDEmbarcacao = coerceNumber(row.QTDEMBARCACAO);
  }

  return mapEmpresaAutorizadaLikeCordova(payload);
}

function mapEmpresaResumo(x: any): Empresa {
  return {
    NORazaoSocial: str(x?.NORazaoSocial),
    TPInscricao: num(x?.TPInscricao),
    NRInscricao: str(x?.NRInscricao),
    DSEndereco: str(x?.DSEndereco),
    SGUF: str(x?.SGUF),
    NOMunicipio: str(x?.NOMunicipio),
    DSBairro: str(x?.DSBairro),
    NRCEP: str(x?.NRCEP),
    QTDEmbarcacao: num(x?.QTDEmbarcacao),
    ListaTipoEmpresa: normalizeListaTipoEmpresa(x?.ListaTipoEmpresa),
  };
}

function mapEmpresaAutorizadaLikeCordova(x: any): Empresa {
  const modalidade = pickStringField(x, ['Modalidade']);
  const regraModalidade = obterRegraModalidade(modalidade);
  const idInstPortOriginal = str(x?.IDTipoInstalacaoPortuaria);
  const idInstPort = regraModalidade.idTipoInstalacaoPortuaria ?? idInstPortOriginal;

  const numeroInstrumentoOriginal = pickStringField(x, ['NRInstrumento', 'NRInstrum', 'Instrumento']).trim();
  const numeroInstrumento = aplicarPrefixoInstrumento(numeroInstrumentoOriginal, regraModalidade.prefixoInstrumento).trim();
  const descInstrumento = numeroInstrumento
    ? modalidade?.match(/Cabotagem|Apoio Portuario|Apoio Maritimo/i)
      ? `Termo de Autorização: ${numeroInstrumento}`
      : `Instrumento: ${numeroInstrumento}`
    : '';

  const iconePadrao = idInstPort ? ICONES_AUTORIZACAO.TERMINAL : ICONES_AUTORIZACAO.EMBARCACAO;
  const icone = regraModalidade.icone ?? iconePadrao;
  const norma = regraModalidade.norma ?? str(x?.norma);
  const isAutoridadePortuaria = Boolean(idInstPort) || regraModalidade.forcarMapa === true;

  return {
    NORazaoSocial: pickStringField(x, ['NORazaoSocial', 'RazaoSocial']),
    TPInscricao: num(x?.TPInscricao),
    NRInscricao: pickStringField(x, ['NRInscricao', 'CNPJ']),
    DSEndereco: pickStringField(x, ['DSEndereco', 'Endereco', 'Logradouro']),
    SGUF: pickStringField(x, ['SGUF', 'UF']),
    NOMunicipio: pickStringField(x, ['NOMunicipio', 'Municipio']),
    DSBairro: pickStringField(x, ['DSBairro', 'Bairro']),
    NRCEP: pickStringField(x, ['NRCEP', 'CEP']),
    QTDEmbarcacao: num(x?.QTDEmbarcacao),
    AreaPPF: pickStringField(x, ['AreaPPF', 'Linha', 'Regiao']),

    Modalidade: modalidade,
    NRInstrumento: numeroInstrumento,
    DescricaoNRInstrumento: descInstrumento,
    DTAditamento: pickStringField(x, ['DTAditamento', 'DTUltimoAditamento']),
    NRAditamento: pickStringField(x, ['NRAditamento', 'Termo']),
    Instalacao: pickStringField(x, ['Instalacao', 'NMInstalacao', 'DSInstalacao', 'Porto']),
    NRInscricaoInstalacao: pickStringField(x, ['NRInscricaoInstalacao', 'CNPJInstalacao']),
    NORazaoSocialInstalacao: pickStringField(x, ['NORazaoSocialInstalacao', 'RazaoSocialInstalacao']),
    IDTipoInstalacaoPortuaria: idInstPort,

    icone,
    norma,
    isAutoridadePortuaria,
    NomeContato: str(x?.NomeContato),
    Email: str(x?.Email),
    AutoridadePortuaria: str(x?.AutoridadePortuaria),
    NRResolucao: str(x?.NRResolucao),
    NRDocumentoSEI: str(x?.NRDocumentoSEI),
    NRTelefone: str(x?.NRTelefone),
    NORepresentante: str(x?.NORepresentante),
    EERepresentante: str(x?.EERepresentante),
    STIntimacaoViaTelefone: bool(x?.STIntimacaoViaTelefone),
    STIntimacaoViaEmail: bool(x?.STIntimacaoViaEmail),
    IDContratoArrendamento: num(x?.IDContratoArrendamento),
  };
}

function normalizeListaTipoEmpresa(src: any): TipoEmpresa[] | null {
  if (!src) return null;

  if (typeof src === 'string') {
    try {
      const parsed = JSON.parse(src);
      return normalizeListaTipoEmpresa(parsed);
    } catch {
      return null;
    }
  }

  const itens = Array.isArray(src)
    ? src
    : Array.isArray(src?.TipoEmpresa)
      ? src.TipoEmpresa
      : [src?.TipoEmpresa].filter(Boolean);

  if (!itens.length) return null;

  return itens.map((t: any) => ({
    IDTipoEmpresa: num(t?.IDTipoEmpresa),
    DSTipoEmpresa: str(t?.DSTipoEmpresa),
    NRinscricao: str(t?.NRinscricao),
  }));
}

function coerceNumber(value: string | number | null | undefined): number | null {
  if (value == null) return null;
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : null;
}

function str(v: any): string {
  if (v == null) return '';
  if (typeof v === 'object' && v['@_nil']) return '';
  return String(v);
}

function pickStringField(obj: any, candidates: string[]): string {
  if (!obj) return '';
  for (const candidate of candidates) {
    const value = obj?.[candidate];
    if (value != null) return str(value);
  }

  const keys = Object.keys(obj ?? {});
  for (const candidate of candidates) {
    const match = keys.find((key) => key.toLowerCase() === candidate.toLowerCase());
    if (match && obj?.[match] != null) return str(obj[match]);
  }

  return '';
}

function num(v: any): number | undefined {
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

function bool(v: any): boolean | undefined {
  if (v == null) return undefined;
  if (typeof v === 'boolean') return v;
  if (typeof v === 'number') return v === 1;
  if (typeof v === 'string') return v.toLowerCase() === 'true' || v === '1';
  return undefined;
}
