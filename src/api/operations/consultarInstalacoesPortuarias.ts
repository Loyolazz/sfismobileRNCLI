import { callSoapAction, type SoapRequestOptions } from '../api';

export type InstalacaoPortuaria = {
  id?: string;
  nome: string;
  localizacao?: string;
  latitude?: string;
  longitude?: string;
  modalidade?: string;
  situacao?: string;
  regiaoHidrografica?: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
  pais?: string;
  cep?: string;
  numero?: string;
  complemento?: string;
  gestao?: string;
  fonte?: string;
  tipo?: string;
  profundidade?: string;
  cnpj?: string;
  cdTerminal?: string;
  cdInstalacaoPortuaria?: string;
};

export type ConsultarInstalacoesPortuariasParams = {
  cnpj?: string;
  instalacao?: string;
  modalidade?: string;
};

type ConsultaPayload = {
  cnpj?: string;
  Nome?: string;
  DSEndereco?: string;
  TPInstalacaoPortuaria?: string;
  localizacao?: string;
  cdinstalacaoportuaria?: string;
  VLLatitude?: string;
  VLLongitude?: string;
};

const EMPTY_PAYLOAD: ConsultaPayload = {
  Nome: '',
  DSEndereco: '',
  TPInstalacaoPortuaria: '',
  localizacao: '',
  cdinstalacaoportuaria: '',
  VLLatitude: '',
  VLLongitude: '',
};

const digitsOnly = (value?: string) => (value ? value.replace(/\D/g, '') : undefined);

const str = (value: any): string => {
  if (value == null) return '';
  if (typeof value === 'object' && value['@_nil']) return '';
  return String(value);
};

export async function consultarInstalacoesPortuarias(
  { cnpj, instalacao, modalidade }: ConsultarInstalacoesPortuariasParams,
  options?: SoapRequestOptions,
): Promise<InstalacaoPortuaria[]> {
  console.log('[API] consultarInstalacoesPortuarias chamada', { cnpj, instalacao, modalidade });

  const payload: ConsultaPayload = {
    ...EMPTY_PAYLOAD,
    cnpj: digitsOnly(cnpj) ?? '',
  };

  if (instalacao?.trim()) {
    payload.Nome = instalacao.trim();
    payload.localizacao = instalacao.trim();
  }

  if (modalidade?.trim()) {
    payload.TPInstalacaoPortuaria = modalidade.trim();
  }

  const parsed = await callSoapAction<any>('ConsultarInstalacoesPortuarias', payload, options);
  const items = extractInstalacoesArray(parsed);

  const mapped = items.map(mapInstalacaoPortuaria);
  console.log('[API] consultarInstalacoesPortuarias retorno', mapped);
  return mapped;
}

function extractInstalacoesArray(parsed: any): any[] {
  const candidates = [
    parsed?.InstalacoesPortuariasSIGTAQ ?? parsed?.instalacoesPortuariasSIGTAQ,
    parsed?.d,
  ];

  for (const candidate of candidates) {
    if (!candidate) continue;
    if (Array.isArray(candidate)) return candidate;
    if (typeof candidate === 'object') {
      const nested =
        candidate.InstalacoesPortuariasSIGTAQ ?? candidate.instalacoesPortuariasSIGTAQ;
      if (Array.isArray(nested)) return nested;
      if (nested) return [nested];
    }
  }

  if (Array.isArray(parsed)) return parsed;
  if (parsed && typeof parsed === 'object') {
    const values = Object.values(parsed);
    if (values.length && values.every(value => typeof value !== 'object')) {
      return [parsed];
    }
  }

  return [];
}

function mapInstalacaoPortuaria(raw: any): InstalacaoPortuaria {
  return {
    id: str(raw?.id ?? raw?.ID),
    nome: str(raw?.nome ?? raw?.Nome),
    localizacao: str(raw?.localizacao ?? raw?.Localizacao),
    latitude: str(raw?.latitude ?? raw?.Latitude ?? raw?.VLLatitude),
    longitude: str(raw?.longitude ?? raw?.Longitude ?? raw?.VLLongitude),
    modalidade: str(raw?.modalidade ?? raw?.Modalidade ?? raw?.TPInstalacaoPortuaria),
    situacao: str(raw?.situacao ?? raw?.Situacao),
    regiaoHidrografica: str(raw?.regiaohidrografica ?? raw?.RegiaoHidrografica),
    endereco: str(raw?.endereco ?? raw?.Endereco),
    cidade: str(raw?.cidade ?? raw?.Cidade),
    estado: str(raw?.estado ?? raw?.Estado ?? raw?.UF),
    pais: str(raw?.pais ?? raw?.Pais),
    cep: str(raw?.cep ?? raw?.CEP),
    numero: str(raw?.numero ?? raw?.Numero),
    complemento: str(raw?.complemento ?? raw?.Complemento),
    gestao: str(raw?.gestao ?? raw?.Gestao),
    fonte: str(raw?.fonte ?? raw?.Fonte),
    tipo: str(raw?.tipo ?? raw?.Tipo),
    profundidade: str(raw?.profundidade ?? raw?.Profundidade),
    cnpj: str(raw?.cnpj ?? raw?.CNPJ),
    cdTerminal: str(raw?.cdterminal ?? raw?.CDTerminal),
    cdInstalacaoPortuaria: str(raw?.cdinstalacaoportuaria ?? raw?.CDInstalacaoPortuaria),
  };
}
