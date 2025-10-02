import { extractSoapResult, soapRequest } from './api';

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

export async function consultarInstalacoesPortuarias({
  cnpj,
  instalacao,
  modalidade,
}: {
  cnpj?: string;
  instalacao?: string;
  modalidade?: string;
}): Promise<InstalacaoPortuaria[]> {
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

  const parsed = await soapRequest('ConsultarInstalacoesPortuarias', payload);
  const result = extractSoapResult(parsed, 'ConsultarInstalacoesPortuarias');

  const items = Array.isArray(result?.d)
    ? result?.d
    : Array.isArray(result)
      ? result
      : [result?.d ?? result].filter(Boolean);

  return items.map(mapInstalacaoPortuaria);
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
