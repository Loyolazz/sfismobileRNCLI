export function formatCnpj(raw: string): string {
  const digits = (raw ?? '').replace(/\D/g, '');
  if (digits.length !== 14) return raw;
  return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12)}`;
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
