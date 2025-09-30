import { allAsync, getAsync, txAsync } from './database';

export type EmpresaAutorizadaRow = {
  ID: number;
  AREAPPF: string | null;
  INSTALACAO: string | null;
  INSTALACAOSEMACENTOS: string | null;
  MODALIDADE: string | null;
  NRINSCRICAO: string | null;
  NRINSTRUMENTO: string | null;
  NORAZAOSOCIAL: string | null;
  SGUF: string | null;
  NOMUNICIPIO: string | null;
  TPINSCRICAO: string | null;
  QTDEMBARCACAO: number | null;
  LISTATIPOEMPRESA: string | null;
  PAYLOAD: string;
};

export type FrotaAlocadaRow = {
  ID: number;
  IDFROTA: string | null;
  TPINSCRICAO: string | null;
  IDEMBARCACAO: string | null;
  STEMBARCACAO: string | null;
  DTINICIO: string | null;
  DTTERMINO: string | null;
  TPAFRETAMENTO: string | null;
  STREGISTRO: string | null;
  IDFROTAPAI: string | null;
  STHOMOLOGACAO: string | null;
  NOEMBARCACAO: string | null;
  NRCAPITANIA: string | null;
  TIPOEMBARCACAO: string | null;
  NRINSCRICAO: string | null;
  NRINSTRUMENTO: string | null;
  PAYLOAD: string;
};

export type EmpresaAutorizada = EmpresaAutorizadaRow & {
  payload: Record<string, unknown>;
};

export type ListEmpresasParams = {
  busca?: string;
  modalidade?: string;
  areaPPF?: string;
  uf?: string;
  municipio?: string;
  limit?: number;
  offset?: number;
};

export type CountFrotaParams = {
  nrInscricao: string;
  nrInstrumento?: string;
};

function toStringValue(value: unknown): string | null {
  if (value == null) return null;
  return String(value);
}

function toNumberValue(value: unknown): number | null {
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

function normalizePayload(payload: unknown): string {
  try {
    return JSON.stringify(payload ?? {});
  } catch {
    return JSON.stringify({});
  }
}

function parsePayload(payload: string): Record<string, unknown> {
  if (!payload) return {};
  try {
    return JSON.parse(payload);
  } catch {
    return {};
  }
}

function mapEmpresa(row: EmpresaAutorizadaRow): EmpresaAutorizada {
  return {
    ...row,
    payload: parsePayload(row.PAYLOAD),
  };
}

export async function listEmpresasAutorizadasAsync(
  params: ListEmpresasParams = {},
): Promise<EmpresaAutorizada[]> {
  const { busca, modalidade, areaPPF, uf, municipio, limit = 50, offset = 0 } = params;

  const where: string[] = [];
  const values: Array<string | number> = [];

  if (busca) {
    const like = `%${busca.trim()}%`;
    where.push('(' + ['NORAZAOSOCIAL', 'NRINSCRICAO', 'INSTALACAO'].map(field => `${field} LIKE ?`).join(' OR ') + ')');
    values.push(like, like, like);
  }
  if (modalidade) {
    where.push('MODALIDADE = ?');
    values.push(modalidade);
  }
  if (areaPPF) {
    where.push('AREAPPF = ?');
    values.push(areaPPF);
  }
  if (uf) {
    where.push('SGUF = ?');
    values.push(uf);
  }
  if (municipio) {
    where.push('NOMUNICIPIO = ?');
    values.push(municipio);
  }

  const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : '';
  const sql = `SELECT * FROM EMPRESASAUTORIZADAS ${whereClause} ORDER BY NORAZAOSOCIAL COLLATE NOCASE LIMIT ? OFFSET ?`;

  values.push(limit, offset);

  const rows = await allAsync<EmpresaAutorizadaRow>(sql, values);
  return rows.map(mapEmpresa);
}

export async function getEmpresaByIdAsync(id: number): Promise<EmpresaAutorizada | null> {
  const row = await getAsync<EmpresaAutorizadaRow>('SELECT * FROM EMPRESASAUTORIZADAS WHERE ID = ? LIMIT 1', [id]);
  return row ? mapEmpresa(row) : null;
}

export async function getEmpresaByNrInscricaoAsync(nrInscricao: string): Promise<EmpresaAutorizada | null> {
  const row = await getAsync<EmpresaAutorizadaRow>(
    'SELECT * FROM EMPRESASAUTORIZADAS WHERE NRINSCRICAO = ? LIMIT 1',
    [nrInscricao],
  );
  return row ? mapEmpresa(row) : null;
}

export async function countEmpresasAutorizadasAsync(): Promise<number> {
  const row = await getAsync<{ total: number }>('SELECT COUNT(*) AS total FROM EMPRESASAUTORIZADAS');
  if (!row) return 0;
  const value = (row as any)?.total ?? (row as any)?.TOTAL;
  return typeof value === 'number' ? value : Number(value) || 0;
}

export async function countFrotaByEmpresaAsync({
  nrInscricao,
  nrInstrumento,
}: CountFrotaParams): Promise<number> {
  const clauses = ['NRINSCRICAO = ?'];
  const params: string[] = [nrInscricao];

  if (nrInstrumento) {
    clauses.push('NRINSTRUMENTO = ?');
    params.push(nrInstrumento);
  }

  const whereClause = clauses.join(' AND ');
  const row = await getAsync<{ total: number }>(
    `SELECT COUNT(*) AS total FROM FROTAALOCADA WHERE ${whereClause}`,
    params,
  );

  if (!row) return 0;
  const value = (row as any)?.total ?? (row as any)?.TOTAL;
  return typeof value === 'number' ? value : Number(value) || 0;
}

export async function countFrotaAsync(): Promise<number> {
  const row = await getAsync<{ total: number }>('SELECT COUNT(*) AS total FROM FROTAALOCADA');
  if (!row) return 0;
  const value = (row as any)?.total ?? (row as any)?.TOTAL;
  return typeof value === 'number' ? value : Number(value) || 0;
}

export async function upsertEmpresasAutorizadasBulkAsync(items: Array<Record<string, unknown>>): Promise<number> {
  if (!items.length) {
    return 0;
  }

  const sql = `INSERT OR REPLACE INTO EMPRESASAUTORIZADAS (
    ID,
    AREAPPF,
    INSTALACAO,
    INSTALACAOSEMACENTOS,
    MODALIDADE,
    NRINSCRICAO,
    NRINSTRUMENTO,
    NORAZAOSOCIAL,
    SGUF,
    NOMUNICIPIO,
    TPINSCRICAO,
    QTDEMBARCACAO,
    LISTATIPOEMPRESA,
    PAYLOAD
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  await txAsync<void>(tx => {
    items.forEach((item, index) => {
      const numericId = Number(item?.ID ?? item?.id);
      const id = Number.isFinite(numericId) ? numericId : index;
      const params = [
        id,
        toStringValue(item?.AREAPPF ?? item?.areaPPF),
        toStringValue(item?.INSTALACAO ?? item?.instalacao),
        toStringValue(item?.INSTALACAOSEMACENTOS ?? item?.instalacaoSemAcentos),
        toStringValue(item?.MODALIDADE ?? item?.modalidade),
        toStringValue(item?.NRINSCRICAO ?? item?.nrInscricao),
        toStringValue(item?.NRINSTRUMENTO ?? item?.nrInstrumento),
        toStringValue(item?.NORAZAOSOCIAL ?? item?.noRazaoSocial),
        toStringValue(item?.SGUF ?? item?.sgUf),
        toStringValue(item?.NOMUNICIPIO ?? item?.noMunicipio),
        toStringValue(item?.TPINSCRICAO ?? item?.tpInscricao),
        toNumberValue(item?.QTDEMBARCACAO ?? item?.qtdEmbarcacao),
        toStringValue(item?.LISTATIPOEMPRESA ?? item?.listaTipoEmpresa),
        normalizePayload(item),
      ];

      tx.executeSql(sql, params);
    });
  });

  return items.length;
}

export async function upsertFrotaAlocadaBulkAsync(items: Array<Record<string, unknown>>): Promise<number> {
  if (!items.length) {
    return 0;
  }

  const sql = `INSERT OR REPLACE INTO FROTAALOCADA (
    ID,
    IDFROTA,
    TPINSCRICAO,
    IDEMBARCACAO,
    STEMBARCACAO,
    DTINICIO,
    DTTERMINO,
    TPAFRETAMENTO,
    STREGISTRO,
    IDFROTAPAI,
    STHOMOLOGACAO,
    NOEMBARCACAO,
    NRCAPITANIA,
    TIPOEMBARCACAO,
    NRINSCRICAO,
    NRINSTRUMENTO,
    PAYLOAD
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  await txAsync<void>(tx => {
    items.forEach((item, index) => {
      const numericId = Number(item?.ID ?? item?.id);
      const id = Number.isFinite(numericId) ? numericId : index;
      const params = [
        id,
        toStringValue(item?.IDFROTA ?? item?.idFrota),
        toStringValue(item?.TPINSCRICAO ?? item?.tpInscricao),
        toStringValue(item?.IDEMBARCACAO ?? item?.idEmbarcacao),
        toStringValue(item?.STEMBARCACAO ?? item?.stEmbarcacao),
        toStringValue(item?.DTINICIO ?? item?.dtInicio),
        toStringValue(item?.DTTERMINO ?? item?.dtTermino),
        toStringValue(item?.TPAFRETAMENTO ?? item?.tpAfretamento),
        toStringValue(item?.STREGISTRO ?? item?.stRegistro),
        toStringValue(item?.IDFROTAPAI ?? item?.idFrotaPai),
        toStringValue(item?.STHOMOLOGACAO ?? item?.stHomologacao),
        toStringValue(item?.NOEMBARCACAO ?? item?.noEmbarcacao),
        toStringValue(item?.NRCAPITANIA ?? item?.nrCapitania),
        toStringValue(item?.TIPOEMBARCACAO ?? item?.tipoEmbarcacao),
        toStringValue(item?.NRINSCRICAO ?? item?.nrInscricao),
        toStringValue(item?.NRINSTRUMENTO ?? item?.nrInstrumento),
        normalizePayload(item),
      ];

      tx.executeSql(sql, params);
    });
  });

  return items.length;
}
