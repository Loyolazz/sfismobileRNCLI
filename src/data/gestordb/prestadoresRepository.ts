import { allAsync, getAsync, txAsync } from './database';

export type DocumentoFiltro = 'razao' | 'cpf' | 'cnpj';

export type PrestadorServicoRow = {
  ID: number;
  CDMUNICIPIO: string | null;
  DSBAIRRO: string | null;
  DSENDERECO: string | null;
  EDCOMPLEMENTO: string | null;
  NOMUNICIPIO: string | null;
  NORAZAOSOCIAL: string | null;
  NRCEP: string | null;
  NRENDERECO: number | null;
  NRINSCRICAO: string | null;
  QTDEMBARCACAO: number | null;
  SGUF: string | null;
  TPINSCRICAO: number | string | null;
  NOREPRESENTANTE: string | null;
  NRTELEFONE: string | null;
  EEREPRESENTANTE: string | null;
  NRDOCUMENTOSEI: string | null;
};

function getFieldValue(item: Record<string, unknown>, ...candidates: string[]): unknown {
  for (const key of candidates) {
    if (Object.prototype.hasOwnProperty.call(item, key)) {
      const value = item[key];
      if (value !== undefined) {
        return value;
      }
    }
  }

  const normalized = candidates.map(candidate => candidate.toLowerCase());
  for (const key of Object.keys(item)) {
    if (normalized.includes(key.toLowerCase())) {
      const value = item[key];
      if (value !== undefined) {
        return value;
      }
    }
  }

  return undefined;
}

function toStringValue(value: unknown): string | null {
  if (value == null) return null;
  return String(value);
}

function toNumberValue(value: unknown): number | null {
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

export async function searchPrestadoresServicoOffline(
  termo: string,
  filtro: DocumentoFiltro,
): Promise<Record<string, unknown>[]> {
  const busca = termo.trim();
  if (!busca) return [];

  const values: Array<string | number> = [];
  let where = '';

  if (filtro === 'razao') {
    where = 'NORAZAOSOCIAL LIKE ?';
    values.push(`%${busca}%`);
  } else {
    const digits = busca.replace(/\D/g, '');
    where = 'NRINSCRICAO LIKE ?';
    values.push(`%${digits || busca}%`);
  }

  const sql = `SELECT * FROM PRESTADORESSERVICOS WHERE ${where} LIMIT 200`;
  return allAsync<Record<string, unknown>>(sql, values);
}

export async function countPrestadoresAsync(): Promise<number> {
  const row = await getAsync<{ total: number }>('SELECT COUNT(*) AS total FROM PRESTADORESSERVICOS');
  if (!row) return 0;
  const value = (row as any)?.total ?? (row as any)?.TOTAL;
  return typeof value === 'number' ? value : Number(value) || 0;
}

export async function upsertPrestadoresServicosBulkAsync(items: Array<Record<string, unknown>>): Promise<number> {
  if (!items.length) return 0;

  const sql = `INSERT OR REPLACE INTO PRESTADORESSERVICOS (
    ID,
    CDMUNICIPIO,
    DSBAIRRO,
    DSENDERECO,
    EDCOMPLEMENTO,
    NOMUNICIPIO,
    NORAZAOSOCIAL,
    NRCEP,
    NRENDERECO,
    NRINSCRICAO,
    QTDEMBARCACAO,
    SGUF,
    TPINSCRICAO,
    NOREPRESENTANTE,
    NRTELEFONE,
    EEREPRESENTANTE,
    NRDOCUMENTOSEI
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  await txAsync<void>(tx => {
    items.forEach((item, index) => {
      const numericId = Number(item?.ID ?? item?.IDPrestador ?? item?.id);
      const id = Number.isFinite(numericId) ? numericId : index;
      const params = [
        id,
        toStringValue(getFieldValue(item, 'CDMUNICIPIO', 'CDMunicipio', 'cdMunicipio')),
        toStringValue(getFieldValue(item, 'DSBAIRRO', 'DSBairro', 'dsBairro')),
        toStringValue(getFieldValue(item, 'DSENDERECO', 'DSEndereco', 'dsEndereco')),
        toStringValue(getFieldValue(item, 'EDCOMPLEMENTO', 'EDComplemento', 'edComplemento')),
        toStringValue(getFieldValue(item, 'NOMUNICIPIO', 'NOMunicipio', 'noMunicipio')),
        toStringValue(getFieldValue(item, 'NORAZAOSOCIAL', 'NORazaoSocial', 'noRazaoSocial')),
        toStringValue(getFieldValue(item, 'NRCEP', 'NRCep', 'nrCep')),
        toNumberValue(getFieldValue(item, 'NRENDERECO', 'NREndereco', 'nrEndereco')),
        toStringValue(getFieldValue(item, 'NRINSCRICAO', 'NRInscricao', 'nrInscricao')),
        toNumberValue(getFieldValue(item, 'QTDEMBARCACAO', 'QTDEmbarcacao', 'qtdEmbarcacao')),
        toStringValue(getFieldValue(item, 'SGUF', 'SGUf', 'sgUf')),
        toNumberValue(getFieldValue(item, 'TPINSCRICAO', 'TPInscricao', 'tpInscricao')) ??
          toStringValue(getFieldValue(item, 'TPINSCRICAO', 'TPInscricao', 'tpInscricao')),
        toStringValue(getFieldValue(item, 'NOREPRESENTANTE', 'NORepresentante', 'noRepresentante')),
        toStringValue(getFieldValue(item, 'NRTELEFONE', 'NRTelefone', 'nrTelefone')),
        toStringValue(getFieldValue(item, 'EEREPRESENTANTE', 'EERepresentante', 'eeRepresentante')),
        toStringValue(getFieldValue(item, 'NRDOCUMENTOSEI', 'NRDocumentoSEI', 'nrDocumentoSei')),
      ];

      tx.executeSql(sql, params);
    });
  });

  return items.length;
}
