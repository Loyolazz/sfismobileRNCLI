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

function convertDMSToDD(degrees: number, minutes: number, seconds: number, direction: string): number {
  let dd = degrees + minutes / 60 + seconds / 3600;
  if (/[SWO]/i.test(direction)) {
    dd *= -1;
  }
  return dd;
}

function parseDms(input: string): number | null {
  const normalized = input
    .replace(/º/g, '°')
    .replace(/,/g, '.')
    .replace(/\s+/g, ' ')
    .trim();

  const cleaned = normalized.replace(/\s+/g, '');

  const rawParts = normalized.split(/[^0-9A-Za-z.]+/).filter(Boolean);
  if (rawParts.length < 3) return null;

  let direction = '';
  const numericParts: string[] = [];

  for (const part of rawParts) {
    const upper = part.toUpperCase();
    if (directionMap[upper]) {
      direction = directionMap[upper];
      continue;
    }
    if (/[0-9]/.test(part)) {
      numericParts.push(part);
    }
  }

  if (!direction) {
    const suffix = cleaned.match(/(NORTE|NORTH|SUL|SOUTH|LESTE|ESTE|EAST|OESTE|WEST|[NSEOWL])$/i);
    if (suffix) {
      const mapped = directionMap[suffix[0].toUpperCase() as keyof typeof directionMap];
      if (mapped) {
        direction = mapped;
      } else {
        direction = suffix[0].slice(-1).toUpperCase();
      }
    } else if (directionRegex.test(cleaned)) {
      direction = cleaned.slice(-1).toUpperCase();
    }
  }

  if (numericParts.length < 2) {
    return null;
  }

  const [degStr, minStr, ...rest] = numericParts;
  const secondsParts = rest.length ? rest : ['0'];
  const secStr =
    secondsParts.length > 1 && !secondsParts[0].includes('.')
      ? `${secondsParts[0]}.${secondsParts.slice(1).join('')}`
      : secondsParts.join('');

  const degrees = Number(degStr);
  const minutes = Number(minStr);
  const seconds = Number(secStr);

  if (![degrees, minutes, seconds].every((n) => Number.isFinite(n))) {
    return null;
  }

  return convertDMSToDD(degrees, minutes, seconds, direction);
}

function parseDecimal(input: string): number | null {
  const normalized = normalizeDecimal(input);
  if (!normalized) return null;
  const value = Number(normalized);
  return Number.isFinite(value) ? value : null;
}

export function parseCoordenada(raw?: string | null): number | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;
  if (/[°º'"NSEOWnseow]/.test(trimmed)) {
    const dms = parseDms(trimmed);
    if (dms != null) return dms;
  }
  return parseDecimal(trimmed);
}
