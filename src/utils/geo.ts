const directionRegex = /[NSEOWnseow]$/;

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
  const cleaned = input
    .replace(/º/g, '°')
    .replace(/\s+/g, '')
    .replace(/,/g, '.');
  const parts = cleaned.split(/[^0-9A-Za-z.]+/).filter(Boolean);
  if (parts.length < 3) return null;

  let direction = '';
  const dirIndex = parts.findIndex((part) => /^[NSEOWnseow]$/.test(part));
  let numbers: string[] = parts;
  if (dirIndex >= 0) {
    direction = parts[dirIndex].toUpperCase();
    numbers = parts.filter((_, index) => index !== dirIndex);
  } else if (directionRegex.test(cleaned)) {
    direction = cleaned.slice(-1).toUpperCase();
  }

  const [degStr, minStr, ...rest] = numbers;
  const secStr = rest.length >= 2 ? `${rest[0]}.${rest[1]}` : rest[0];

  const degrees = Number(degStr);
  const minutes = Number(minStr);
  const seconds = Number((secStr ?? '0').replace(/,/g, '.'));

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
