const directionRegex = /[NSEOWnseow]$/;

const directionMap: Record<string, 'N' | 'S' | 'E' | 'O'> = {
  N: 'N',
  NORTE: 'N',
  NORTH: 'N',
  S: 'S',
  SUL: 'S',
  SOUTH: 'S',
  E: 'E',
  ESTE: 'E',
  EAST: 'E',
  L: 'E',
  LESTE: 'E',
  O: 'O',
  OESTE: 'O',
  WEST: 'O',
  W: 'O',
};

function normalizeDecimal(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return trimmed;
  const parts = trimmed.split(/[^0-9.,-]+/).filter(Boolean);
  if (parts.length === 0) return trimmed;
  let normalized = parts.join('');
  const sign = normalized.startsWith('-') ? '-' : '';
  normalized = normalized.replace(/^[+-]/, '');
  normalized = normalized.replace(/,/g, '.');
  const firstDot = normalized.indexOf('.');
  if (firstDot >= 0) {
    normalized = `${normalized.slice(0, firstDot + 1)}${normalized.slice(firstDot + 1).replace(/\./g, '')}`;
  }
  return `${sign}${normalized}`;
}

function corrigirLatLong(valor: string): string {
  const trimmed = valor.trim();
  if (!trimmed) return trimmed;
  const sign = trimmed.startsWith('-') ? trimmed[0] : '';
  const unsigned = sign ? trimmed.slice(1) : trimmed;
  const partes = unsigned.split('.');
  if (partes.length === 0) {
    return trimmed;
  }
  const [inteiro, ...fracao] = partes;
  if (fracao.length === 0) {
    return `${sign}${inteiro}`;
  }
  return `${sign}${inteiro}.${fracao.join('')}`;
}

function convertDMSToDD(degrees: number, minutes: number, seconds: number, direction: string): number {
  let dd = degrees + minutes / 60 + seconds / 3600;
  if (/[SWO]/i.test(direction)) {
    dd *= -1;
  }
  return dd;
}

function guessDirectionFromSuffix(cleaned: string): 'N' | 'S' | 'E' | 'O' | '' {
  const suffix = cleaned.match(/(NORTE|NORTH|SUL|SOUTH|LESTE|ESTE|EAST|OESTE|WEST|[NSEOWL])$/i);
  if (!suffix) {
    if (directionRegex.test(cleaned)) {
      return cleaned.slice(-1).toUpperCase() as 'N' | 'S' | 'E' | 'O';
    }
    return '';
  }
  const token = suffix[0].toUpperCase();
  const mapped = directionMap[token as keyof typeof directionMap];
  if (mapped) {
    return mapped;
  }
  return token.slice(-1) as 'N' | 'S' | 'E' | 'O';
}

function parseDms(input: string): number | null {
  const normalized = input
    .replace(/º/g, '°')
    .replace(/,/g, '.')
    .replace(/\s+/g, ' ')
    .trim();

  if (!normalized) return null;

  const cleaned = normalized.replace(/\s+/g, '');

  const rawParts = normalized.split(/[^0-9A-Za-z.]+/).filter(Boolean);
  if (!rawParts.length) return null;

  let direction: 'N' | 'S' | 'E' | 'O' | '' = '';
  const numericParts: string[] = [];

  for (const part of rawParts) {
    const upper = part.toUpperCase();
    const mapped = directionMap[upper as keyof typeof directionMap];
    if (mapped) {
      direction = mapped;
      continue;
    }
    if (/^-?\d+(?:\.\d+)?$/.test(part)) {
      numericParts.push(part);
    }
  }

  if (!direction) {
    direction = guessDirectionFromSuffix(cleaned);
  }

  if (numericParts.length === 0) {
    return null;
  }

  const [degStr = '0', minStr = '0', ...rest] = numericParts;
  const secondsParts = rest.length ? rest : ['0'];
  const [secBase, ...secFraction] = secondsParts;
  const secStr = secFraction.length ? `${secBase}.${secFraction.join('')}` : secBase;
  const degrees = Number(degStr);
  const minutes = Number(minStr);
  const seconds = Number(secStr);

  if (![degrees, minutes, seconds].every((n) => Number.isFinite(n))) {
    return null;
  }

  if (!direction) {
    return null;
  }

  return convertDMSToDD(degrees, minutes, seconds, direction);
}

function parseDecimal(input: string): number | null {
  const base = input
    .replace(/º/g, '')
    .replace(/°/g, '')
    .replace(/,/g, '.');

  const normalized = normalizeDecimal(base);
  if (!normalized) return null;
  const corrigido = corrigirLatLong(normalized);
  const value = Number(corrigido);
  return Number.isFinite(value) ? value : null;
}

export function parseCoordenada(valor?: string | number | null): number | null {
  if (valor == null) return null;

  let str = String(valor).trim();

  // Casos inválidos comuns vindos do legado
  if (str === "" || str === "---" || str === "0" || str.toLowerCase() === "null" || str.toLowerCase() === "undefined") {
    return null;
  }

  // Troca vírgula decimal por ponto
  str = str.replace(",", ".");

  const num = Number(str);
  if (isNaN(num)) return null;

  // Validar range básico (latitude <= 90, longitude <= 180) — quem chama decide qual é qual
  if (Math.abs(num) > 180) return null;

  return num;
}

