export type AreaEmpresa =
  | 'area-portuaria'
  | 'navegacao-maritima'
  | 'navegacao-interior-longo-misto'
  | 'navegacao-interior-carga'
  | 'navegacao-interior-travessia'
  | 'desconhecida';

export type EmpresaDTO = {
  id: string;
  area: AreaEmpresa;
  razaoSocial: string;
  cnpj: string;
  endereco?: string;
  modalidade?: string;
  instrumento?: string;
  dataUltimoAditamento?: string;
  termo?: string;
  instalacao?: string;
  linha?: string;
  regiao?: string;
  embarcacoes?: string[];
};

export type EmpresaPayloadOrigem = {
  NORazaoSocial?: string;
  NRInscricao?: string;
  DSEndereco?: string;
  Modalidade?: string;
  NRInstrumento?: string;
  DTAditamento?: string;
  NRAditamento?: string;
  Instalacao?: string;
  AreaPPF?: string;
};

export function classificarArea(modalidade?: string, areaPPF?: string): AreaEmpresa {
  const mod = (modalidade ?? '').toLowerCase();
  const area = (areaPPF ?? '').toLowerCase();

  if (mod.includes('porto') || area.includes('porto')) return 'area-portuaria';
  if (mod.includes('maritima')) return 'navegacao-maritima';
  if (mod.includes('travessia')) return 'navegacao-interior-travessia';
  if (mod.includes('passageiro') || mod.includes('misto')) return 'navegacao-interior-longo-misto';
  if (mod.includes('carga')) return 'navegacao-interior-carga';
  return 'desconhecida';
}

export function mapearEmpresaParaDTO(origem: EmpresaPayloadOrigem): EmpresaDTO {
  const area = classificarArea(origem.Modalidade, origem.AreaPPF);
  return {
    id: origem.NRInscricao ?? origem.NORazaoSocial ?? 'empresa',
    area,
    razaoSocial: origem.NORazaoSocial ?? '',
    cnpj: origem.NRInscricao ?? '',
    endereco: origem.DSEndereco,
    modalidade: origem.Modalidade,
    instrumento: origem.NRInstrumento,
    dataUltimoAditamento: origem.DTAditamento,
    termo: origem.NRAditamento,
    instalacao: origem.Instalacao,
    regiao: area === 'navegacao-interior-carga' ? origem.AreaPPF : undefined,
    linha:
      area === 'navegacao-interior-longo-misto' || area === 'navegacao-interior-travessia'
        ? origem.AreaPPF
        : undefined,
  };
}
