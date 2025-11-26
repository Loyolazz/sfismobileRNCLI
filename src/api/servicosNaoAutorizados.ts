import { SERVICE_BASE_URL } from './config';
import {
  buscarEmpresasCnpjRazao,
  type Empresa,
} from './operations/consultarEmpresas';
import {
  consultarEmbarcacoesPorNomeOuCapitania,
  type ConsultarEmbarcacoesPorNomeOuCapitaniaParams,
  type ConsultarEmbarcacoesPorNomeOuCapitaniaResult,
} from './operations/consultarEmbarcacoesPorNomeOuCapitania';
import { consultarIrregularidades, type ConsultarIrregularidadesResult } from './operations/consultarIrregularidades';
import { inserirInstalacao, type InserirInstalacaoParams, type InserirInstalacaoResult } from './operations/inserirInstalacao';
import {
  inserirPrestadorServico,
  type InserirPrestadorServicoParams,
  type InserirPrestadorServicoResult,
} from './operations/inserirPrestadorServico';
import {
  vincularAreaAtuacaoPrestadorServico,
  type VincularAreaAtuacaoPrestadorServicoParams,
  type VincularAreaAtuacaoPrestadorServicoResult,
} from './operations/vincularAreaAtuacaoPrestadorServico';

export const SERVICOS_NAO_AUTORIZADOS_ENDPOINT = SERVICE_BASE_URL;

export async function buscarServicosNaoAutorizadosPorEmpresa(termo: string): Promise<Empresa[]> {
  return buscarEmpresasCnpjRazao(termo);
}

export async function buscarServicosNaoAutorizadosPorEmbarcacao(
  params: ConsultarEmbarcacoesPorNomeOuCapitaniaParams,
): Promise<ConsultarEmbarcacoesPorNomeOuCapitaniaResult | undefined> {
  return consultarEmbarcacoesPorNomeOuCapitania(params);
}

export async function carregarIrregularidadesServicosNaoAutorizados(): Promise<ConsultarIrregularidadesResult> {
  return consultarIrregularidades({ norma: '' });
}

export async function salvarInstalacaoServicoNaoAutorizado(
  params: InserirInstalacaoParams,
): Promise<InserirInstalacaoResult> {
  return inserirInstalacao(params);
}

export async function cadastrarPrestadorServicoNaoAutorizado(
  params: InserirPrestadorServicoParams,
): Promise<InserirPrestadorServicoResult> {
  return inserirPrestadorServico(params);
}

export async function vincularPrestadorServicoNaoAutorizado(
  params: VincularAreaAtuacaoPrestadorServicoParams,
): Promise<VincularAreaAtuacaoPrestadorServicoResult> {
  return vincularAreaAtuacaoPrestadorServico(params);
}

export type {
  ConsultarEmbarcacoesPorNomeOuCapitaniaParams,
  ConsultarEmbarcacoesPorNomeOuCapitaniaResult,
  ConsultarIrregularidadesResult,
  Empresa,
  InserirInstalacaoParams,
  InserirInstalacaoResult,
  InserirPrestadorServicoParams,
  InserirPrestadorServicoResult,
  VincularAreaAtuacaoPrestadorServicoParams,
  VincularAreaAtuacaoPrestadorServicoResult,
};
