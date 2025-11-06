import type { Empresa } from '@/api/operations/consultarEmpresas';
import { removerAcentos } from './autorizacao';

const MODALIDADES_NAVEGACAO_MARITIMA = [
  'APOIO MARITIMO',
  'APOIO PORTUARIO',
  'CABOTAGEM',
  'LONGO CURSO',
  'EMBARCACAO EM CONSTRUCAO',
];

const normalizar = (valor?: string | null): string =>
  removerAcentos(valor ?? '').replace(/\s+/g, ' ').trim();

export function empresaEhNavegacaoMaritima(empresa: Empresa): boolean {
  const area = normalizar(empresa.AreaPPF);
  if (area.includes('NAVEGACAO MARITIMA')) {
    return true;
  }

  const modalidade = normalizar(empresa.Modalidade);
  if (!modalidade) {
    return false;
  }

  return MODALIDADES_NAVEGACAO_MARITIMA.some((termo) => modalidade.includes(termo));
}

export const mensagemBloqueioNavegacaoMaritima =
  'Não é possível cadastrar fiscalização de empresa de navegação marítima via SFIS Mobile.';
