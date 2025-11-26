import type { AxiosResponse } from 'axios';

import { antaqJsonClient } from './config';

interface ServiceResponse<T> {
  d: T;
}

type MaybeArray<T> = T | T[] | null | undefined;

const ensureArray = <T>(value: MaybeArray<T>): T[] => {
  if (Array.isArray(value)) return value;
  if (value == null) return [];
  return [value];
};

export type EmpresaAutorizadaRecord = Record<string, unknown>;
export type IrregularidadeRecord = Record<string, unknown>;
export type ServidorRecord = Record<string, unknown>;
export type FrotaAlocadaRecord = Record<string, unknown>;
export type PrestadorServicoRecord = Record<string, unknown>;

async function postJson<T>(
  action: string,
  payload: Record<string, unknown> = {},
): Promise<AxiosResponse<ServiceResponse<T>>> {
  return antaqJsonClient.post<ServiceResponse<T>>(action, payload);
}

export async function listarEmpresasAutorizadas(): Promise<EmpresaAutorizadaRecord[]> {
  try {
    const response = await postJson<MaybeArray<EmpresaAutorizadaRecord>>('ListarEmpresasAutorizadas', {
      modalidade: '',
      cnpjRazaosocial: '',
    });
    return ensureArray(response.data?.d);
  } catch (error) {
    console.warn('[gestorbd] Falha ao listar empresas autorizadas', error);
    return [];
  }
}

export async function consultarIrregularidades(): Promise<IrregularidadeRecord[]> {
  try {
    const response = await postJson<MaybeArray<IrregularidadeRecord>>('ConsultarIrregularidades', {
      norma: '',
    });
    return ensureArray(response.data?.d);
  } catch (error) {
    console.warn('[gestorbd] Falha ao consultar irregularidades', error);
    return [];
  }
}

export async function listarServidores(): Promise<ServidorRecord[]> {
  try {
    const response = await postJson<MaybeArray<ServidorRecord>>('ListarServidores');
    return ensureArray(response.data?.d);
  } catch (error) {
    console.warn('[gestorbd] Falha ao listar servidores', error);
    return [];
  }
}

export async function listarFrotaAlocada(): Promise<FrotaAlocadaRecord[]> {
  try {
    const response = await postJson<MaybeArray<FrotaAlocadaRecord>>('ListarFrotaAlocada');
    return ensureArray(response.data?.d);
  } catch (error) {
    console.warn('[gestorbd] Falha ao listar frota alocada', error);
    return [];
  }
}

export async function listarPrestadoresServicos(): Promise<PrestadorServicoRecord[]> {
  try {
    const response = await postJson<MaybeArray<PrestadorServicoRecord>>('ListarPrestadoresServicos', {
      textoPesquisa: '',
      tipoPesquisa: '',
    });
    return ensureArray(response.data?.d);
  } catch (error) {
    console.warn('[gestorbd] Falha ao listar prestadores de serviço', error);
    return [];
  }
}
