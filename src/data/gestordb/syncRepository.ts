import { getAsync, runAsync } from './database';

export type SyncDatasetKey =
  | 'EMPRESASAUTORIZADAS'
  | 'FROTAALOCADA'
  | 'PRESTADORESSERVICOS'
  | 'ESQUEMASOPERACIONAIS'
  | 'EMBARCACOESINTERIOR';

const TABLE = 'LOGATUALIZACAO';
const ERROR_TABLE = 'LOGERRO';

type SyncRow = {
  CHAVE: string;
  CURSOR: string | null;
  ATUALIZADOEM: string;
};

type CountRow = {
  total: number;
};

function normalizeDate(value: string): string {
  if (!value) {
    return new Date().toISOString();
  }
  return value;
}

export async function getSyncCursorAsync(key: SyncDatasetKey): Promise<string | null> {
  const row = await getAsync<SyncRow>(`SELECT CURSOR, ATUALIZADOEM FROM ${TABLE} WHERE CHAVE = ? LIMIT 1`, [key]);
  if (!row) return null;
  return row.CURSOR ?? row.ATUALIZADOEM ?? null;
}

export async function setSyncCursorAsync(key: SyncDatasetKey, cursor: string): Promise<void> {
  const value = normalizeDate(cursor);
  await runAsync(
    `INSERT OR REPLACE INTO ${TABLE} (CHAVE, CURSOR, ATUALIZADOEM) VALUES (?, ?, ?)`,
    [key, value, value],
  );
}

export async function appendErrorLogAsync(
  context: string,
  message: string,
  payload?: unknown,
): Promise<void> {
  const now = new Date().toISOString();
  let serializedPayload: string | null = null;

  if (payload !== undefined) {
    try {
      serializedPayload = JSON.stringify(payload);
    } catch (error) {
      serializedPayload = String(payload);
    }
  }

  await runAsync(
    `INSERT INTO ${ERROR_TABLE} (CONTEXTO, MENSAGEM, PAYLOAD, CRIADOEM) VALUES (?, ?, ?, ?)`,
    [context, message, serializedPayload, now],
  );
}

export async function getErrorLogCountAsync(): Promise<number> {
  const row = await getAsync<CountRow>(`SELECT COUNT(*) AS total FROM ${ERROR_TABLE}`);
  if (!row) return 0;
  const value = (row as any)?.total ?? (row as any)?.TOTAL;
  return typeof value === 'number' ? value : Number(value) || 0;
}
