import { allAsync, getAsync, txAsync } from './database';

export type EmpresaAutorizadaRow = {
  ID: number;
  AREAPPF: string | null;
  DSBAIRRO: string | null;
  DSENDERECO: string | null;
  DTADITAMENTO: string | null;
  DTOUTORGA: string | null;
  EMAIL: string | null;
  INSTALACAO: string | null;
  INSTALACAOSEMACENTOS: string | null;
  MODALIDADE: string | null;
  NOMUNICIPIO: string | null;
  NRINSCRICAO: string | null;
  NRINSTRUMENTO: string | null;
  NORAZAOSOCIAL: string | null;
  SGUF: string | null;
  NRADITAMENTO: string | null;
  NRCEP: string | null;
  TPINSCRICAO: string | null;
  QTDEMBARCACAO: number | null;
  LISTATIPOEMPRESA: string | null;
  NOMECONTATO: string | null;
  IDCONTRATOARRENDAMENTO: string | null;
  VLMONTANTEINVESTIMENTO: string | null;
  NRTLO: string | null;
  NRRESOLUCAO: string | null;
  AUTORIDADEPORTUARIA: string | null;
  NRINSCRICAOINSTALACAO: string | null;
  NORAZAOSOCIALINSTALACAO: string | null;
  NOREPRESENTANTE: string | null;
  NRTELEFONE: string | null;
  EEREPRESENTANTE: string | null;
  NRDOCUMENTOSEI: string | null;
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
    DSBAIRRO,
    DSENDERECO,
    DTADITAMENTO,
    DTOUTORGA,
    EMAIL,
    INSTALACAO,
    INSTALACAOSEMACENTOS,
    LISTATIPOEMPRESA,
    MODALIDADE,
    NOMUNICIPIO,
    NORAZAOSOCIAL,
    NRADITAMENTO,
    NRCEP,
    NRINSCRICAO,
    NRINSTRUMENTO,
    NOMECONTATO,
    QTDEMBARCACAO,
    SGUF,
    TPINSCRICAO,
    IDCONTRATOARRENDAMENTO,
    VLMONTANTEINVESTIMENTO,
    NRTLO,
    NRRESOLUCAO,
    AUTORIDADEPORTUARIA,
    NRINSCRICAOINSTALACAO,
    NORAZAOSOCIALINSTALACAO,
    NOREPRESENTANTE,
    NRTELEFONE,
    EEREPRESENTANTE,
    NRDOCUMENTOSEI,
    PAYLOAD
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  await txAsync<void>(tx => {
    items.forEach((item, index) => {
      const numericId = Number(item?.ID ?? item?.id);
      const id = Number.isFinite(numericId) ? numericId : index;
      const params = [
        id,
        toStringValue(getFieldValue(item, 'AREAPPF', 'AreaPPF', 'areaPPF')),
        toStringValue(getFieldValue(item, 'DSBAIRRO', 'DSBairro', 'dsBairro')),
        toStringValue(getFieldValue(item, 'DSENDERECO', 'DSEndereco', 'dsEndereco')),
        toStringValue(getFieldValue(item, 'DTADITAMENTO', 'DTAditamento', 'dtAditamento')),
        toStringValue(getFieldValue(item, 'DTOUTORGA', 'DTOutorga', 'dtOutorga')),
        toStringValue(getFieldValue(item, 'EMAIL', 'Email', 'email')),
        toStringValue(getFieldValue(item, 'INSTALACAO', 'Instalacao', 'instalacao')),
        toStringValue(getFieldValue(item, 'INSTALACAOSEMACENTOS', 'InstalacaoSemAcentos', 'instalacaoSemAcentos')),
        toStringValue(getFieldValue(item, 'LISTATIPOEMPRESA', 'ListaTipoEmpresa', 'listaTipoEmpresa')),
        toStringValue(getFieldValue(item, 'MODALIDADE', 'Modalidade', 'modalidade')),
        toStringValue(getFieldValue(item, 'NOMUNICIPIO', 'NOMunicipio', 'noMunicipio')),
        toStringValue(getFieldValue(item, 'NORAZAOSOCIAL', 'NORazaoSocial', 'noRazaoSocial')),
        toStringValue(getFieldValue(item, 'NRADITAMENTO', 'NRAditamento', 'nrAditamento')),
        toStringValue(getFieldValue(item, 'NRCEP', 'NRCep', 'nrCep')),
        toStringValue(getFieldValue(item, 'NRINSCRICAO', 'NRInscricao', 'nrInscricao')),
        toStringValue(getFieldValue(item, 'NRINSTRUMENTO', 'NRInstrumento', 'nrInstrumento')),
        toStringValue(getFieldValue(item, 'NOMECONTATO', 'NomeContato', 'nomeContato')),
        toNumberValue(getFieldValue(item, 'QTDEMBARCACAO', 'QTDEmbarcacao', 'qtdEmbarcacao')),
        toStringValue(getFieldValue(item, 'SGUF', 'SGUf', 'sgUf')),
        toStringValue(getFieldValue(item, 'TPINSCRICAO', 'TPInscricao', 'tpInscricao')),
        toStringValue(getFieldValue(item, 'IDCONTRATOARRENDAMENTO', 'IDContratoArrendamento', 'idContratoArrendamento')),
        toStringValue(getFieldValue(item, 'VLMONTANTEINVESTIMENTO', 'VLMontanteInvestimento', 'vlMontanteInvestimento')),
        toStringValue(getFieldValue(item, 'NRTLO', 'NRTlo', 'nrTlo')),
        toStringValue(getFieldValue(item, 'NRRESOLUCAO', 'NRResolucao', 'nrResolucao')),
        toStringValue(getFieldValue(item, 'AUTORIDADEPORTUARIA', 'AutoridadePortuaria', 'autoridadePortuaria')),
        toStringValue(getFieldValue(item, 'NRINSCRICAOINSTALACAO', 'NRInscricaoInstalacao', 'nrInscricaoInstalacao')),
        toStringValue(getFieldValue(item, 'NORAZAOSOCIALINSTALACAO', 'NORazaoSocialInstalacao', 'noRazaoSocialInstalacao')),
        toStringValue(getFieldValue(item, 'NOREPRESENTANTE', 'NORepresentante', 'noRepresentante')),
        toStringValue(getFieldValue(item, 'NRTELEFONE', 'NRTelefone', 'nrTelefone')),
        toStringValue(getFieldValue(item, 'EEREPRESENTANTE', 'EERepresentante', 'eeRepresentante')),
        toStringValue(getFieldValue(item, 'NRDOCUMENTOSEI', 'NRDocumentoSEI', 'nrDocumentoSei')),
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
        toStringValue(getFieldValue(item, 'IDFROTA', 'IDFrota', 'idFrota')),
        toStringValue(getFieldValue(item, 'TPINSCRICAO', 'TPInscricao', 'tpInscricao')),
        toStringValue(getFieldValue(item, 'IDEMBARCACAO', 'IDEmbarcacao', 'idEmbarcacao')),
        toStringValue(getFieldValue(item, 'STEMBARCACAO', 'STEmbarcacao', 'stEmbarcacao')),
        toStringValue(getFieldValue(item, 'DTINICIO', 'DTInicio', 'dtInicio')),
        toStringValue(getFieldValue(item, 'DTTERMINO', 'DTTermino', 'dtTermino')),
        toStringValue(getFieldValue(item, 'TPAFRETAMENTO', 'TPAfretamento', 'tpAfretamento')),
        toStringValue(getFieldValue(item, 'STREGISTRO', 'STRegistro', 'stRegistro')),
        toStringValue(getFieldValue(item, 'IDFROTAPAI', 'IDFrotaPai', 'idFrotaPai')),
        toStringValue(getFieldValue(item, 'STHOMOLOGACAO', 'STHomologacao', 'stHomologacao')),
        toStringValue(getFieldValue(item, 'NOEMBARCACAO', 'NoEmbarcacao', 'noEmbarcacao')),
        toStringValue(getFieldValue(item, 'NRCAPITANIA', 'NRCapitania', 'nrCapitania')),
        toStringValue(getFieldValue(item, 'TIPOEMBARCACAO', 'TipoEmbarcacao', 'tipoEmbarcacao')),
        toStringValue(getFieldValue(item, 'NRINSCRICAO', 'NRInscricao', 'nrInscricao')),
        toStringValue(getFieldValue(item, 'NRINSTRUMENTO', 'NRInstrumento', 'nrInstrumento')),
        normalizePayload(item),
      ];

      tx.executeSql(sql, params);
    });
  });

  return items.length;
}
