export type EmbarcacaoDTO = {
  id: string;
  nome?: string;
  tipo?: string;
  imo?: string;
  numeroCapitania?: string;
  homologacao?: string;
  emOperacao?: boolean;
};

export function mapearEmbarcacaoParaDTO(src: Record<string, unknown>): EmbarcacaoDTO {
  const imo = src?.['IMO'] ?? src?.['NRIMO'] ?? src?.['NrImo'];
  const capitania = src?.['NRCapitania'] ?? src?.['NumeroCapitania'] ?? src?.['NrCapitania'];
  const nome = src?.['NoEmbarcacao'] ?? src?.['NomeEmbarcacao'] ?? src?.['NMEmbarcacao'];

  const id =
    (src?.['IDFrota'] as string) ??
    (src?.['IDEmbarcacao'] as string) ??
    (capitania as string) ??
    (imo as string) ??
    (nome as string) ??
    'embarcacao';

  return {
    id: String(id),
    nome: nome as string | undefined,
    tipo: (src?.['TipoEmbarcacao'] ?? src?.['TPEmbarcacao']) as string | undefined,
    imo: imo as string | undefined,
    numeroCapitania: capitania as string | undefined,
    homologacao: (src?.['STHomologacao'] ?? src?.['Homologacao']) as string | undefined,
    emOperacao: typeof src?.['STEmbarcacao'] === 'boolean' ? (src['STEmbarcacao'] as boolean) : undefined,
  };
}
