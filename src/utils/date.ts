const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export function toDateOnlyString(date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

export function parseDateOnly(value: string): Date {
  if (!DATE_ONLY_PATTERN.test(value)) {
    throw new Error('Date must use YYYY-MM-DD format');
  }
  const date = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime()) || toDateOnlyString(date) !== value) {
    throw new Error('Invalid calendar date');
  }
  return date;
}

export function normalizeDateInput(
  value: string | Date | null | undefined,
): Date | null | undefined {
  if (value === undefined || value === null || value instanceof Date) return value;
  return parseDateOnly(value);
}

export function getTodayDate(now = new Date()): string {
  return toDateOnlyString(now);
}

export function getCurrentDayOfWeek(now = new Date()): number {
  const day = now.getUTCDay();
  return day === 0 ? 7 : day;
}

export function isSameOrBeforeDate(value: Date | null, target: string): boolean {
  return value !== null && toDateOnlyString(value) <= target;
}

export function isSameDate(value: Date | null, target: string): boolean {
  return value !== null && toDateOnlyString(value) === target;
}
