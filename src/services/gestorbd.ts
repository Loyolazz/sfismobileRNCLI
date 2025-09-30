import AsyncStorage from '@react-native-async-storage/async-storage';
import SQLite, { type SQLiteDatabase } from 'react-native-sqlite-storage';

import {
  consultarIrregularidades,
  listarEmpresasAutorizadas,
  listarServidores,
  type EmpresaAutorizadaRecord,
  type IrregularidadeRecord,
  type ServidorRecord,
} from '@/api/gestorbd';

SQLite.enablePromise(true);

const DB_NAME = 'DBPRDSFISMobile.db';
const DB_LOCATION = 'default';
const META_TABLE = 'gestor_meta';
const SCHEMA_VERSION_KEY = 'schema_version';
const SCHEMA_VERSION = 1;

const LAST_SYNC_STORAGE_KEY = 'gestorbd:lastSyncSummary';

const DATA_TABLES = [
  'gestor_empresas_autorizadas',
  'gestor_irregularidades',
  'gestor_equipe',
] as const;

const TABLE_DEFINITIONS = [
  `CREATE TABLE IF NOT EXISTS ${META_TABLE} (key TEXT PRIMARY KEY, value TEXT NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS gestor_empresas_autorizadas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nrInscricao TEXT,
    noRazaoSocial TEXT,
    modalidade TEXT,
    instalacao TEXT,
    payload TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS gestor_irregularidades (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    idIrregularidade TEXT,
    tpNavegacao TEXT,
    payload TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS gestor_equipe (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nrMatricula TEXT,
    noUsuario TEXT,
    sgUnidade TEXT,
    payload TEXT NOT NULL
  )`,
  'CREATE INDEX IF NOT EXISTS idx_gestor_empresas_nr ON gestor_empresas_autorizadas(nrInscricao)',
  'CREATE INDEX IF NOT EXISTS idx_gestor_empresas_modalidade ON gestor_empresas_autorizadas(modalidade)',
  'CREATE INDEX IF NOT EXISTS idx_gestor_irregularidades_id ON gestor_irregularidades(idIrregularidade)',
  'CREATE INDEX IF NOT EXISTS idx_gestor_equipe_matricula ON gestor_equipe(nrMatricula)',
];

const DROP_STATEMENTS = DATA_TABLES.map(table => `DROP TABLE IF EXISTS ${table}`);

const DELETE_STATEMENTS = DATA_TABLES.map(table => `DELETE FROM ${table}`);

export type GestorSyncCounts = {
  autorizadas: number;
  irregularidades: number;
  equipe: number;
};

export type GestorSyncStatus = {
  updatedAt: number;
  counts: GestorSyncCounts;
};

function runTransaction(db: SQLiteDatabase, callback: (tx: any) => void): Promise<void> {
  return new Promise((resolve, reject) => {
    db.transaction(callback, reject, resolve);
  });
}

async function executeSql(db: SQLiteDatabase, sql: string, params: Array<string | number | null> = []) {
  await db.executeSql(sql, params);
}

async function ensureMetaTable(db: SQLiteDatabase) {
  await executeSql(db, TABLE_DEFINITIONS[0]);
}

async function readSchemaVersion(db: SQLiteDatabase): Promise<number> {
  await ensureMetaTable(db);
  const [result] = await db.executeSql(
    `SELECT value FROM ${META_TABLE} WHERE key = ? LIMIT 1`,
    [SCHEMA_VERSION_KEY],
  );
  if (result.rows.length === 0) return 0;
  const value = result.rows.item(0)?.value;
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : 0;
}

async function writeSchemaVersion(db: SQLiteDatabase, version: number) {
  await ensureMetaTable(db);
  await executeSql(db, `REPLACE INTO ${META_TABLE} (key, value) VALUES (?, ?)`, [
    SCHEMA_VERSION_KEY,
    String(version),
  ]);
}

async function createTables(db: SQLiteDatabase) {
  for (const statement of TABLE_DEFINITIONS) {
    await executeSql(db, statement);
  }
}

async function dropTables(db: SQLiteDatabase) {
  for (const statement of DROP_STATEMENTS) {
    await executeSql(db, statement);
  }
}

async function ensureSchema(db: SQLiteDatabase) {
  const currentVersion = await readSchemaVersion(db);
  if (currentVersion !== SCHEMA_VERSION) {
    await dropTables(db);
    await createTables(db);
    await writeSchemaVersion(db, SCHEMA_VERSION);
    return;
  }
  await createTables(db);
}

function normalizeString(value: unknown): string {
  if (value == null) return '';
  return String(value);
}

function normalizePayload(value: unknown): string {
  try {
    return JSON.stringify(value ?? {});
  } catch {
    return JSON.stringify({});
  }
}

async function insertEmpresas(
  db: SQLiteDatabase,
  empresas: EmpresaAutorizadaRecord[],
): Promise<number> {
  if (!empresas.length) return 0;
  const sql = `INSERT INTO gestor_empresas_autorizadas (nrInscricao, noRazaoSocial, modalidade, instalacao, payload) VALUES (?, ?, ?, ?, ?)`;
  await runTransaction(db, tx => {
    empresas.forEach(item => {
      tx.executeSql(sql, [
        normalizeString((item as any)?.NRInscricao ?? (item as any)?.nrInscricao),
        normalizeString((item as any)?.NORazaoSocial ?? (item as any)?.noRazaoSocial),
        normalizeString((item as any)?.Modalidade ?? (item as any)?.modalidade),
        normalizeString((item as any)?.Instalacao ?? (item as any)?.instalacao),
        normalizePayload(item),
      ]);
    });
  });
  return empresas.length;
}

async function insertIrregularidades(
  db: SQLiteDatabase,
  irregularidades: IrregularidadeRecord[],
): Promise<number> {
  if (!irregularidades.length) return 0;
  const sql = `INSERT INTO gestor_irregularidades (idIrregularidade, tpNavegacao, payload) VALUES (?, ?, ?)`;
  await runTransaction(db, tx => {
    irregularidades.forEach(item => {
      tx.executeSql(sql, [
        normalizeString((item as any)?.IDIrregularidade ?? (item as any)?.idIrregularidade),
        normalizeString((item as any)?.TPNavegacao ?? (item as any)?.tpNavegacao),
        normalizePayload(item),
      ]);
    });
  });
  return irregularidades.length;
}

async function insertEquipe(db: SQLiteDatabase, equipe: ServidorRecord[]): Promise<number> {
  if (!equipe.length) return 0;
  const sql = `INSERT INTO gestor_equipe (nrMatricula, noUsuario, sgUnidade, payload) VALUES (?, ?, ?, ?)`;
  await runTransaction(db, tx => {
    equipe.forEach(item => {
      tx.executeSql(sql, [
        normalizeString((item as any)?.NRMatriculaServidor ?? (item as any)?.nrMatriculaServidor),
        normalizeString((item as any)?.NOUsuario ?? (item as any)?.noUsuario),
        normalizeString((item as any)?.SGUnidade ?? (item as any)?.sgUnidade),
        normalizePayload(item),
      ]);
    });
  });
  return equipe.length;
}

async function clearTables(db: SQLiteDatabase) {
  for (const statement of DELETE_STATEMENTS) {
    await executeSql(db, statement);
  }
}

async function openDatabase(): Promise<SQLiteDatabase> {
  return SQLite.openDatabase({ name: DB_NAME, location: DB_LOCATION });
}

export async function syncGestorDatabase(): Promise<GestorSyncStatus> {
  const [empresas, irregularidades, equipe] = await Promise.all([
    listarEmpresasAutorizadas(),
    consultarIrregularidades(),
    listarServidores(),
  ]);

  const db = await openDatabase();
  try {
    await ensureSchema(db);
    await clearTables(db);

    const counts: GestorSyncCounts = {
      autorizadas: await insertEmpresas(db, empresas),
      irregularidades: await insertIrregularidades(db, irregularidades),
      equipe: await insertEquipe(db, equipe),
    };

    const status: GestorSyncStatus = {
      updatedAt: Date.now(),
      counts,
    };
    await AsyncStorage.setItem(LAST_SYNC_STORAGE_KEY, JSON.stringify(status));
    return status;
  } finally {
    await db.close();
  }
}

export async function loadGestorSyncStatus(): Promise<GestorSyncStatus | null> {
  const raw = await AsyncStorage.getItem(LAST_SYNC_STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed: GestorSyncStatus = JSON.parse(raw);
    if (parsed?.updatedAt) {
      return parsed;
    }
  } catch {
    await AsyncStorage.removeItem(LAST_SYNC_STORAGE_KEY);
  }
  return null;
}

export async function resetGestorDatabase(): Promise<void> {
  const db = await openDatabase();
  try {
    await ensureSchema(db);
    await clearTables(db);
    await AsyncStorage.removeItem(LAST_SYNC_STORAGE_KEY);
  } finally {
    await db.close();
  }
}
