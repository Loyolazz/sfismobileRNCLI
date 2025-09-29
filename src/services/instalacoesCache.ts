import AsyncStorage from '@react-native-async-storage/async-storage';

import type { InstalacaoPortuaria } from '@/api/consultarInstalacoesPortuarias';

const KEY_PREFIX = 'sfis.instalacoes';
const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 dias

type CacheEntry = {
  updatedAt: number;
  instalacoes: InstalacaoPortuaria[];
};

const digitsOnly = (value?: string) => (value ? value.replace(/\D/g, '') : '');

const keyFor = (cnpj: string) => `${KEY_PREFIX}:${digitsOnly(cnpj)}`;

export async function salvarInstalacoesCache(
  cnpj: string,
  instalacoes: InstalacaoPortuaria[],
): Promise<void> {
  const entry: CacheEntry = {
    updatedAt: Date.now(),
    instalacoes,
  };
  await AsyncStorage.setItem(keyFor(cnpj), JSON.stringify(entry));
}

export type InstalacoesCache = CacheEntry & { stale: boolean };

export async function carregarInstalacoesCache(cnpj: string): Promise<InstalacoesCache | null> {
  const raw = await AsyncStorage.getItem(keyFor(cnpj));
  if (!raw) return null;
  try {
    const parsed: CacheEntry = JSON.parse(raw);
    const stale = Date.now() - parsed.updatedAt > CACHE_TTL_MS;
    return { ...parsed, stale };
  } catch {
    await AsyncStorage.removeItem(keyFor(cnpj));
    return null;
  }
}
