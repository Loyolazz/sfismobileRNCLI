import {
  listarEmpresasAutorizadas,
  listarFrotaAlocada,
  type EmpresaAutorizadaRecord,
  type FrotaAlocadaRecord,
} from '@/api/gestorbd';
import {
  countEmpresasAutorizadasAsync,
  countFrotaAsync,
  listEmpresasAutorizadasAsync as listEmpresasFromDbAsync,
  getEmpresaByIdAsync as getEmpresaByIdFromDbAsync,
  getEmpresaByNrInscricaoAsync as getEmpresaByNrInscricaoFromDbAsync,
  countFrotaByEmpresaAsync as countFrotaByEmpresaFromDbAsync,
  upsertEmpresasAutorizadasBulkAsync,
  upsertFrotaAlocadaBulkAsync,
  type EmpresaAutorizada,
  type ListEmpresasParams,
  type CountFrotaParams,
} from '@/data/gestordb/empresasRepository';
import { migrateAsync } from '@/data/gestordb/database';
import {
  appendErrorLogAsync,
  getSyncCursorAsync,
  setSyncCursorAsync,
  type SyncDatasetKey,
} from '@/data/gestordb/syncRepository';

export type GestorSyncCounts = {
  empresas: number;
  frota: number;
};

export type GestorSyncStatus = {
  updatedAt: number | null;
  cursors: Partial<Record<SyncDatasetKey, string | null>>;
  counts: GestorSyncCounts;
  lastRun?: GestorSyncCounts;
};

export async function syncEmpresasAutorizadasAsync({
  sinceCursor,
}: { sinceCursor?: string } = {}): Promise<{ count: number; cursor: string }> {
  await migrateAsync();
  const cursor = sinceCursor ?? (await getSyncCursorAsync('EMPRESASAUTORIZADAS')) ?? undefined;

  try {
    const items: EmpresaAutorizadaRecord[] = await listarEmpresasAutorizadas();
    const count = await upsertEmpresasAutorizadasBulkAsync(items);
    const newCursor = new Date().toISOString();
    await setSyncCursorAsync('EMPRESASAUTORIZADAS', newCursor);
    return { count, cursor: newCursor };
  } catch (error) {
    await appendErrorLogAsync('syncEmpresasAutorizadasAsync', (error as Error)?.message ?? 'Erro desconhecido', {
      sinceCursor: cursor,
    });
    throw error;
  }
}

export async function syncFrotaAlocadaAsync({
  sinceCursor,
}: { sinceCursor?: string } = {}): Promise<{ count: number; cursor: string }> {
  await migrateAsync();
  const cursor = sinceCursor ?? (await getSyncCursorAsync('FROTAALOCADA')) ?? undefined;

  try {
    const items: FrotaAlocadaRecord[] = await listarFrotaAlocada();
    const count = await upsertFrotaAlocadaBulkAsync(items);
    const newCursor = new Date().toISOString();
    await setSyncCursorAsync('FROTAALOCADA', newCursor);
    return { count, cursor: newCursor };
  } catch (error) {
    await appendErrorLogAsync('syncFrotaAlocadaAsync', (error as Error)?.message ?? 'Erro desconhecido', {
      sinceCursor: cursor,
    });
    throw error;
  }
}

export async function syncGestorDatabase(): Promise<GestorSyncStatus> {
  await migrateAsync();

  const [empresasResult, frotaResult] = await Promise.all([
    syncEmpresasAutorizadasAsync(),
    syncFrotaAlocadaAsync(),
  ]);

  const status = await loadGestorSyncStatus();

  return {
    ...status,
    lastRun: {
      empresas: empresasResult.count,
      frota: frotaResult.count,
    },
  };
}

export async function loadGestorSyncStatus(): Promise<GestorSyncStatus> {
  await migrateAsync();
  const [empresasCursor, frotaCursor] = await Promise.all([
    getSyncCursorAsync('EMPRESASAUTORIZADAS'),
    getSyncCursorAsync('FROTAALOCADA'),
  ]);

  const [empresasCount, frotaCount] = await Promise.all([
    countEmpresasAutorizadasAsync(),
    countFrotaAsync(),
  ]);

  const timestamps = [empresasCursor, frotaCursor]
    .map(value => (value ? Date.parse(value) : NaN))
    .filter(value => Number.isFinite(value)) as number[];

  const updatedAt = timestamps.length ? Math.max(...timestamps) : null;

  return {
    updatedAt,
    cursors: {
      EMPRESASAUTORIZADAS: empresasCursor ?? null,
      FROTAALOCADA: frotaCursor ?? null,
    },
    counts: {
      empresas: empresasCount,
      frota: frotaCount,
    },
  };
}

export async function listEmpresasAutorizadasAsync(params?: ListEmpresasParams): Promise<EmpresaAutorizada[]> {
  await migrateAsync();
  return listEmpresasFromDbAsync(params);
}

export async function getEmpresaByIdAsync(params: { id: number }): Promise<EmpresaAutorizada | null> {
  await migrateAsync();
  return getEmpresaByIdFromDbAsync(params.id);
}

export async function getEmpresaByNrInscricaoAsync(
  params: { nrInscricao: string },
): Promise<EmpresaAutorizada | null> {
  await migrateAsync();
  return getEmpresaByNrInscricaoFromDbAsync(params.nrInscricao);
}

export async function countFrotaByEmpresaAsync(params: CountFrotaParams): Promise<number> {
  await migrateAsync();
  return countFrotaByEmpresaFromDbAsync(params);
}

export async function logGestorDatabaseSnapshot(): Promise<void> {
  const status = await loadGestorSyncStatus();
  const sample = await listEmpresasFromDbAsync({ limit: 5, offset: 0 });
  console.log('[gestorbd] snapshot', {
    updatedAt: status.updatedAt ? new Date(status.updatedAt).toISOString() : null,
    cursors: status.cursors,
    counts: status.counts,
    empresas: sample.map(item => ({
      id: item.ID,
      razaoSocial: item.NORAZAOSOCIAL,
      nrInscricao: item.NRINSCRICAO,
      uf: item.SGUF,
      municipio: item.NOMUNICIPIO,
    })),
  });
}

export type { EmpresaAutorizada, ListEmpresasParams, CountFrotaParams };
