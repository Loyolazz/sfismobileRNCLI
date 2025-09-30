import SQLite, {
  type ResultSet,
  type SQLiteDatabase,
  type Transaction,
} from 'react-native-sqlite-storage';

SQLite.enablePromise(true);

const DB_NAME = 'DBPRDSFISMobile.db';
const DB_LOCATION = 'default';

let dbInstance: SQLiteDatabase | null = null;

const TABLE_DEFINITIONS: string[] = [
  `CREATE TABLE IF NOT EXISTS LOGATUALIZACAO (
    CHAVE TEXT PRIMARY KEY,
    CURSOR TEXT,
    ATUALIZADOEM TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS LOGERRO (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    CONTEXTO TEXT NOT NULL,
    MENSAGEM TEXT NOT NULL,
    PAYLOAD TEXT,
    CRIADOEM TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS EMPRESASAUTORIZADAS (
    ID INTEGER PRIMARY KEY,
    AREAPPF TEXT,
    INSTALACAO TEXT,
    INSTALACAOSEMACENTOS TEXT,
    MODALIDADE TEXT,
    NRINSCRICAO TEXT,
    NRINSTRUMENTO TEXT,
    NORAZAOSOCIAL TEXT,
    SGUF TEXT,
    NOMUNICIPIO TEXT,
    TPINSCRICAO TEXT,
    QTDEMBARCACAO INTEGER,
    LISTATIPOEMPRESA TEXT,
    PAYLOAD TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS FROTAALOCADA (
    ID INTEGER PRIMARY KEY,
    IDFROTA TEXT,
    TPINSCRICAO TEXT,
    IDEMBARCACAO TEXT,
    STEMBARCACAO TEXT,
    DTINICIO TEXT,
    DTTERMINO TEXT,
    TPAFRETAMENTO TEXT,
    STREGISTRO TEXT,
    IDFROTAPAI TEXT,
    STHOMOLOGACAO TEXT,
    NOEMBARCACAO TEXT,
    NRCAPITANIA TEXT,
    TIPOEMBARCACAO TEXT,
    NRINSCRICAO TEXT,
    NRINSTRUMENTO TEXT,
    PAYLOAD TEXT NOT NULL
  )`,
  'CREATE INDEX IF NOT EXISTS IDX_EMPRESAS_NR ON EMPRESASAUTORIZADAS(NRINSCRICAO)',
  'CREATE INDEX IF NOT EXISTS IDX_EMPRESAS_MODALIDADE ON EMPRESASAUTORIZADAS(MODALIDADE)',
  'CREATE INDEX IF NOT EXISTS IDX_EMPRESAS_UF ON EMPRESASAUTORIZADAS(SGUF)',
  'CREATE INDEX IF NOT EXISTS IDX_EMPRESAS_MUNICIPIO ON EMPRESASAUTORIZADAS(NOMUNICIPIO)',
  'CREATE INDEX IF NOT EXISTS IDX_FROTA_EMPRESA ON FROTAALOCADA(NRINSCRICAO, NRINSTRUMENTO)',
];

export async function openDatabaseAsync(): Promise<SQLiteDatabase> {
  if (dbInstance) {
    return dbInstance;
  }

  dbInstance = await SQLite.openDatabase({ name: DB_NAME, location: DB_LOCATION });
  return dbInstance;
}

export async function migrateAsync(): Promise<void> {
  const db = await openDatabaseAsync();
  for (const statement of TABLE_DEFINITIONS) {
    await db.executeSql(statement);
  }
}

export async function runAsync(sql: string, params: Array<string | number | null> = []): Promise<void> {
  const db = await openDatabaseAsync();
  await db.executeSql(sql, params);
}

function mapRows<T>(result: ResultSet): T[] {
  const rows: T[] = [];
  for (let i = 0; i < result.rows.length; i += 1) {
    rows.push(result.rows.item(i));
  }
  return rows;
}

export async function getAsync<T>(sql: string, params: Array<string | number | null> = []): Promise<T | null> {
  const db = await openDatabaseAsync();
  const [result] = await db.executeSql(sql, params);
  if (!result || result.rows.length === 0) {
    return null;
  }
  return result.rows.item(0) as T;
}

export async function allAsync<T>(sql: string, params: Array<string | number | null> = []): Promise<T[]> {
  const db = await openDatabaseAsync();
  const [result] = await db.executeSql(sql, params);
  if (!result) {
    return [];
  }
  return mapRows<T>(result);
}

export async function txAsync<T>(fn: (tx: Transaction) => Promise<T> | T): Promise<T> {
  const db = await openDatabaseAsync();

  return new Promise<T>((resolve, reject) => {
    let resultValue: T;

    db.transaction(
      tx => {
        const maybePromise = fn(tx);
        Promise.resolve(maybePromise)
          .then(value => {
            resultValue = value;
          })
          .catch(error => {
            reject(error);
            throw error;
          });
      },
      error => {
        reject(error);
      },
      () => {
        resolve(resultValue);
      },
    );
  });
}

export async function closeDatabaseAsync(): Promise<void> {
  if (dbInstance) {
    await dbInstance.close();
    dbInstance = null;
  }
}
