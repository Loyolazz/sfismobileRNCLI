import AsyncStorage from '@react-native-async-storage/async-storage';

export type Evidencia = {
  imagem: string;
  [key: string]: unknown;
};

export type Irregularidade = {
  IDIrregularidade: number | string;
  descricaoFato?: string;
  acao?: string;
  prazo?: string;
  evidencias?: Evidencia[];
  [key: string]: unknown;
};

const AV_KEY = 'arIrregularidadeAvulsa';
const CK_KEY = 'arIrregularidadeChecklist';

async function readList(key: string): Promise<Irregularidade[]> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Irregularidade[]) : [];
  } catch {
    return [];
  }
}

async function saveList(key: string, list: Irregularidade[]): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(list));
}

function mergeIrregularidade(lista: Irregularidade[], nova?: Irregularidade | null) {
  if (!nova) return;
  const existente = lista.find((item) => item.IDIrregularidade === nova.IDIrregularidade);
  if (existente) {
    if (!existente.descricaoFato && nova.descricaoFato) {
      existente.descricaoFato = nova.descricaoFato;
    }
    if (!existente.acao && nova.acao) {
      existente.acao = nova.acao;
      existente.prazo = nova.prazo;
    }
    const evidenciasAtuais = Array.isArray(existente.evidencias)
      ? existente.evidencias
      : [];
    const novasEvidencias = Array.isArray(nova.evidencias) ? nova.evidencias : [];
    novasEvidencias.forEach((ev) => {
      if (!evidenciasAtuais.some((item) => item.imagem === ev.imagem)) {
        evidenciasAtuais.push(ev);
      }
    });
    existente.evidencias = evidenciasAtuais;
  } else {
    const copia: Irregularidade = {
      ...nova,
      evidencias: Array.isArray(nova.evidencias) ? [...nova.evidencias] : [],
    };
    lista.push(copia);
  }
}

export async function getIrregularidadesAvulsas(): Promise<Irregularidade[]> {
  return readList(AV_KEY);
}

export async function setIrregularidadesAvulsas(lista: Irregularidade[]): Promise<void> {
  await saveList(AV_KEY, lista);
}

export async function addIrregularidadeAvulsa(irregularidade: Irregularidade): Promise<void> {
  const lista = await getIrregularidadesAvulsas();
  mergeIrregularidade(lista, irregularidade);
  await setIrregularidadesAvulsas(lista);
}

export async function removerIrregularidadeAvulsa(id: number | string): Promise<void> {
  const lista = await getIrregularidadesAvulsas();
  const filtrada = lista.filter((item) => item.IDIrregularidade !== id);
  await setIrregularidadesAvulsas(filtrada);
}

export async function getIrregularidadesChecklist(): Promise<Irregularidade[]> {
  return readList(CK_KEY);
}

export async function setIrregularidadesChecklist(lista: Irregularidade[]): Promise<void> {
  await saveList(CK_KEY, lista);
}

export async function adicionarIrregularidadesChecklist(
  itens: Irregularidade[],
): Promise<void> {
  const lista = await getIrregularidadesChecklist();
  itens.forEach((item) => mergeIrregularidade(lista, item));
  await setIrregularidadesChecklist(lista);
}

export async function removerIrregularidadesChecklist(
  ids: Array<number | string>,
): Promise<void> {
  const lista = await getIrregularidadesChecklist();
  const conjunto = new Set(ids.map(String));
  const filtrada = lista.filter((item) => !conjunto.has(String(item.IDIrregularidade)));
  await setIrregularidadesChecklist(filtrada);
}
