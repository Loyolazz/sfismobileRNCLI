import {
  consultarIrregularidades as consultarIrregularidadesSoap,
} from '@/api/operations/consultarIrregularidades';
import { listarPrestadoresServicos as listarPrestadoresServicosSoap } from '@/api/operations/listarPrestadoresServicos';
import { listarServidores as listarServidoresSoap } from '@/api/operations/listarServidores';
import {
  consultarIrregularidades as consultarIrregularidadesBD,
  listarServidores as listarServidoresBD,
  type IrregularidadeRecord,
  type PrestadorServicoRecord,
  type ServidorRecord,
} from '@/api/gestorbd';
import { searchPrestadoresServicoOffline } from '@/data/gestordb/prestadoresRepository';
import type { DocumentoTipo, Irregularidade, Prestador, Servidor } from './types';

function ensureArray<T>(value: T | T[] | null | undefined): T[] {
  if (Array.isArray(value)) return value;
  if (value == null) return [];
  return [value];
}

function normalizeString(value: unknown): string {
  if (typeof value === 'string') return value;
  if (value == null) return '';
  return String(value);
}

function detectarDocumentoTipo(documento: string): DocumentoTipo {
  const digits = documento.replace(/\D/g, '');
  if (digits.length > 11) return 'cnpj';
  if (digits.length > 0 && digits.length <= 11) return 'cpf';
  return 'razao';
}

function mapPrestadorServico(item: PrestadorServicoRecord, index: number): Prestador {
  const documento = normalizeString(
    (item as any).NRInscricao ?? (item as any).nrInscricao ?? (item as any).NRINSCRICAO ?? '',
  );

  const enderecoParts = [
    (item as any).DSEndereco ?? (item as any).dsEndereco ?? (item as any).DSENDERECO,
    (item as any).DSBairro ?? (item as any).dsBairro ?? (item as any).DSBAIRRO,
    (item as any).EDComplemento ?? (item as any).edComplemento ?? (item as any).EDCOMPLEMENTO,
  ]
    .map(normalizeString)
    .filter(Boolean);

  return {
    id: normalizeString(
      (item as any).IDContratoArrendamento ?? documento || (item as any).id ?? index,
    ),
    razaoSocial: normalizeString(
      (item as any).NORazaoSocial ?? (item as any).noRazaoSocial ?? (item as any).NORAZAOSOCIAL ?? 'Prestador',
    ),
    documento: documento || '-',
    documentoTipo: detectarDocumentoTipo(documento),
    endereco: enderecoParts.join(' - ') || 'Endereço não informado',
    municipio: normalizeString((item as any).NOMunicipio ?? (item as any).noMunicipio ?? '' ) || undefined,
    uf: normalizeString((item as any).SGUF ?? (item as any).sguf ?? '' ) || undefined,
  };
}

function prestadorMatchesFiltro(prestador: Prestador, filtro: DocumentoTipo, termo: string) {
  const normalizado = termo.trim().toLowerCase();
  if (!normalizado) return true;

  if (filtro === 'razao') {
    return prestador.razaoSocial.toLowerCase().includes(normalizado);
  }

  const digits = normalizado.replace(/\D/g, '');
  return prestador.documento.replace(/\D/g, '').includes(digits);
}

export async function buscarPrestadoresServico(
  filtro: DocumentoTipo,
  termo: string,
): Promise<Prestador[]> {
  const consulta = termo.trim();
  if (!consulta) return [];

  const tipoPesquisa = filtro === 'razao' ? 'razao' : filtro;

  try {
    const result = await listarPrestadoresServicosSoap({ textoPesquisa: consulta, tipoPesquisa });
    const itens = (result as any)?.Empresa ?? (result as any)?.d ?? result;
    const mapped = ensureArray<PrestadorServicoRecord>(itens)
      .map(mapPrestadorServico)
      .filter(prestador => prestadorMatchesFiltro(prestador, filtro, consulta));

    if (mapped.length) return mapped;
  } catch (error) {
    console.warn('[ServicosNaoAutorizados] Falha ao consultar prestadores (SOAP)', error);
  }

  try {
    const offline = await searchPrestadoresServicoOffline(consulta, filtro === 'razao' ? 'razao' : 'cnpj');
    const mapped = ensureArray<PrestadorServicoRecord>(offline)
      .map(mapPrestadorServico)
      .filter(prestador => prestadorMatchesFiltro(prestador, filtro, consulta));

    if (mapped.length) return mapped;
  } catch (error) {
    console.warn('[ServicosNaoAutorizados] Falha ao consultar prestadores (BD)', error);
  }

  return [];
}

function mapIrregularidade(item: IrregularidadeRecord, index: number): Irregularidade {
  const descricao =
    normalizeString(
      (item as any).DSRequisito ??
        (item as any).DSNormaCompleta ??
        (item as any).DSNormativa ??
        (item as any).DSAlinea ??
        (item as any).NORequisito ??
        (item as any).descricao ??
        (item as any).DSRequisitoDescricao,
    ) || 'Irregularidade';

  const id = normalizeString(
    (item as any).IDIrregularidade ??
      (item as any).IDRequisito ??
      (item as any).IDFiscalizacao ??
      (item as any).IDRequisitoNormativo ??
      index,
  );

  return { id, descricao };
}

export async function buscarIrregularidades(): Promise<Irregularidade[]> {
  try {
    const listaBD = await consultarIrregularidadesBD();
    const mapped = ensureArray<IrregularidadeRecord>(listaBD).map(mapIrregularidade);
    if (mapped.length) return mapped;
  } catch (error) {
    console.warn('[ServicosNaoAutorizados] Falha ao consultar irregularidades (BD)', error);
  }

  try {
    const result = await consultarIrregularidadesSoap({ norma: '' });
    const itens = (result as any)?.Irregularidade ?? (result as any)?.d ?? result;
    const mapped = ensureArray<IrregularidadeRecord>(itens).map(mapIrregularidade);
    if (mapped.length) return mapped;
  } catch (error) {
    console.warn('[ServicosNaoAutorizados] Falha ao consultar irregularidades (SOAP)', error);
  }

  return [];
}

function mapServidor(item: ServidorRecord, index: number): Servidor {
  const nome = normalizeString(
    (item as any).NOUsuario ?? (item as any).NOUSUARIO ?? (item as any).nome ?? 'Servidor',
  );
  const funcao = normalizeString(
    (item as any).NOCargo ?? (item as any).NOUnidadeOrganizacional ?? (item as any).NOUNIDADEORGANIZACIONAL ?? '',
  );

  return {
    id: normalizeString(
      (item as any).NRMatriculaServidor ?? (item as any).NRCPF ?? (item as any).id ?? index,
    ),
    nome,
    funcao: funcao || 'Servidor',
  };
}

export async function buscarServidoresFiscalizacao(): Promise<Servidor[]> {
  try {
    const listaBD = await listarServidoresBD();
    const mapped = ensureArray<ServidorRecord>(listaBD).map(mapServidor);
    if (mapped.length) return mapped;
  } catch (error) {
    console.warn('[ServicosNaoAutorizados] Falha ao consultar servidores (BD)', error);
  }

  try {
    const result = await listarServidoresSoap();
    const itens = (result as any)?.Servidor ?? (result as any)?.d ?? result;
    const mapped = ensureArray<ServidorRecord>(itens).map(mapServidor);
    if (mapped.length) return mapped;
  } catch (error) {
    console.warn('[ServicosNaoAutorizados] Falha ao consultar servidores (SOAP)', error);
  }

  return [];
}
