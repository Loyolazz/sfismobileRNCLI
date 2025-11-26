import { allAsync } from './database';

export type DocumentoFiltro = 'razao' | 'cpf' | 'cnpj';

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
