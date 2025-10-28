export function normalizeCnpj(raw: string | null | undefined): string | null {
  const digits = (raw ?? '').replace(/\D/g, '');
  if (!digits) return null;

  if (digits.length > 14) {
    return digits.slice(-14);
  }

  const padded = digits.padStart(14, '0');
  return padded.length === 14 ? padded : null;
}

export function formatCnpj(raw: string | null | undefined): string {
  const normalized = normalizeCnpj(raw);
  if (!normalized) return raw ?? '';

  return `${normalized.slice(0, 2)}.${normalized.slice(2, 5)}.${normalized.slice(5, 8)}/${normalized.slice(8, 12)}-${normalized.slice(12)}`;
}

export function formatDate(raw?: string): string {
  if (!raw || raw.startsWith('01/01/1900')) return '';
  const [day, month, rest] = raw.split('/');
  const [year] = (rest ?? '').split(' ');
  if (!day || !month || !year) return raw ?? '';
  return `${day}/${month}/${year}`;
}

export function formatImoCapitania(raw: string): string {
  return (raw ?? '').replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
}

export function hasText(value: string): boolean {
  return value.trim().length > 0;
}
