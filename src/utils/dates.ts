export function differenceInDays(start: Date | string | number, end: Date | string | number): number {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const utcStart = Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
  const utcEnd = Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
  const diff = utcEnd - utcStart;
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

const pad = (value: number) => value.toString().padStart(2, '0');

export function formatDateTime(value: Date | number | string): string {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }
  const day = pad(date.getDate());
  const month = pad(date.getMonth() + 1);
  const year = date.getFullYear();
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}
