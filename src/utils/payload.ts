export type EmpresaPayload = {
  __type: string;
  NORazaoSocial: string | null;
  TPInscricao: number | string | null;
  NRInscricao: string | null;
  DSEndereco: string | null;
  NREndereco: string | null;
  EDComplemento: string | null;
  SGUF: string | null;
  CDMunicipio: string | number | null;
  NOMunicipio: string | null;
  DSBairro: string | null;
  NRCEP: string | number | null;
  QTDEmbarcacao: number | null;
  ListaTipoEmpresa: unknown;
  AreaPPF: string | null;
  Instalacao: string | null;
  Modalidade: string | null;
  NRInstrumento: string | null;
  DTOutorga: string | null;
  NRAditamento: string | null;
  DTAditamento: string | null;
  NomeContato: string | null;
  Email: string | null;
  IDContratoArrendamento: number | string | null;
  VLMontanteInvestimento: string | number | null;
  NRTLO: string | null;
  NRResolucao: string | null;
  AutoridadePortuaria: string | null;
  NORazaoSocialInstalacao: string | null;
  NRInscricaoInstalacao: string | null;
  NORepresentante: string | null;
  STIntimacaoViaTelefone: boolean | null;
  NRTelefone: string | null;
  STIntimacaoViaEmail: boolean | null;
  EERepresentante: string | null;
  NRDocumentoSEI: string | null;
  ContratoEmpresa: unknown;
} & Record<string, unknown>;

export const DEFAULT_EMPRESA_PAYLOAD: EmpresaPayload = {
  __type: 'AntaqService.Models.Empresa',
  NORazaoSocial: null,
  TPInscricao: null,
  NRInscricao: null,
  DSEndereco: null,
  NREndereco: null,
  EDComplemento: null,
  SGUF: null,
  CDMunicipio: null,
  NOMunicipio: null,
  DSBairro: null,
  NRCEP: null,
  QTDEmbarcacao: null,
  ListaTipoEmpresa: null,
  AreaPPF: null,
  Instalacao: null,
  Modalidade: null,
  NRInstrumento: null,
  DTOutorga: null,
  NRAditamento: null,
  DTAditamento: null,
  NomeContato: null,
  Email: null,
  IDContratoArrendamento: null,
  VLMontanteInvestimento: null,
  NRTLO: null,
  NRResolucao: null,
  AutoridadePortuaria: null,
  NORazaoSocialInstalacao: null,
  NRInscricaoInstalacao: null,
  NORepresentante: null,
  STIntimacaoViaTelefone: false,
  NRTelefone: null,
  STIntimacaoViaEmail: false,
  EERepresentante: null,
  NRDocumentoSEI: null,
  ContratoEmpresa: null,
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function tryParseJson(value: string): unknown {
  try {
    return JSON.parse(value);
  } catch {
    return undefined;
  }
}

function parsePayloadSource(source: unknown): Record<string, unknown> | undefined {
  if (source == null) return undefined;

  if (typeof source === 'string') {
    const trimmed = source.trim();
    if (!trimmed) return undefined;

    const parsed = tryParseJson(trimmed);
    if (parsed !== undefined) {
      return parsePayloadSource(parsed);
    }
    return undefined;
  }

  if (isRecord(source)) {
    return source;
  }

  return undefined;
}

function mergeEmpresaPayload(
  payload: Partial<EmpresaPayload>,
  fallback: Partial<EmpresaPayload> = {},
): EmpresaPayload {
  const result: Record<string, unknown> = { ...DEFAULT_EMPRESA_PAYLOAD };

  for (const [key, value] of Object.entries(fallback)) {
    result[key] = value;
  }

  for (const [key, value] of Object.entries(payload)) {
    result[key] = value;
  }

  if (typeof result.__type !== 'string' || !result.__type) {
    result.__type = DEFAULT_EMPRESA_PAYLOAD.__type;
  }

  return result as EmpresaPayload;
}

export function ensureEmpresaPayload(
  source: unknown,
  fallback: Partial<EmpresaPayload> = {},
): EmpresaPayload {
  const parsed = parsePayloadSource(source);
  const payload = parsed ?? {};
  return mergeEmpresaPayload(payload as Partial<EmpresaPayload>, fallback);
}

export function serializeEmpresaPayload(
  source: unknown,
  fallback: Partial<EmpresaPayload> = {},
): string {
  try {
    const normalized = ensureEmpresaPayload(source, fallback);
    return JSON.stringify(normalized);
  } catch {
    return JSON.stringify(ensureEmpresaPayload({}, fallback));
  }
}
