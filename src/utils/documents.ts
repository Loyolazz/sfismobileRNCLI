const digitsOnly = (value: string) => value.replace(/\D/g, '');

const CPF_FACTOR_1 = [10, 9, 8, 7, 6, 5, 4, 3, 2];
const CPF_FACTOR_2 = [11, 10, 9, 8, 7, 6, 5, 4, 3, 2];

function calculateCpfDigit(numbers: number[], factors: number[]): number {
  const total = numbers.reduce((acc, num, index) => acc + num * factors[index], 0);
  const remainder = total % 11;
  return remainder < 2 ? 0 : 11 - remainder;
}

export function validateCpf(value: string): boolean {
  const clean = digitsOnly(value);
  if (clean.length !== 11 || /^([0-9])\1+$/.test(clean)) return false;

  const baseDigits = clean
    .slice(0, 9)
    .split('')
    .map((c) => Number(c));
  const firstDigit = calculateCpfDigit(baseDigits, CPF_FACTOR_1);
  const secondDigit = calculateCpfDigit([...baseDigits, firstDigit], CPF_FACTOR_2);

  return clean === `${baseDigits.join('')}${firstDigit}${secondDigit}`;
}

function calculateCnpjDigit(numbers: number[]): number {
  const factors = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const total = numbers.reduce((acc, num, index) => acc + num * factors[factors.length - numbers.length + index], 0);
  const remainder = total % 11;
  return remainder < 2 ? 0 : 11 - remainder;
}

export function validateCnpj(value: string): boolean {
  const clean = digitsOnly(value);
  if (clean.length !== 14 || /^([0-9])\1+$/.test(clean)) return false;

  const base = clean
    .slice(0, 12)
    .split('')
    .map((c) => Number(c));
  const firstDigit = calculateCnpjDigit(base);
  const secondDigit = calculateCnpjDigit([...base, firstDigit]);

  return clean === `${base.join('')}${firstDigit}${secondDigit}`;
}

export function formatCpf(value: string): string {
  const clean = digitsOnly(value).slice(0, 11);
  if (clean.length <= 3) return clean;
  if (clean.length <= 6) return `${clean.slice(0, 3)}.${clean.slice(3)}`;
  if (clean.length <= 9) return `${clean.slice(0, 3)}.${clean.slice(3, 6)}.${clean.slice(6)}`;
  return `${clean.slice(0, 3)}.${clean.slice(3, 6)}.${clean.slice(6, 9)}-${clean.slice(9)}`;
}

export function formatCep(value: string): string {
  const clean = digitsOnly(value).slice(0, 8);
  if (clean.length <= 5) return clean;
  return `${clean.slice(0, 5)}-${clean.slice(5)}`;
}

export { digitsOnly };
