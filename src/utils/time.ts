export const HH_MM_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

export function isValidTime(value: string): boolean {
  return HH_MM_PATTERN.test(value);
}

export function timeToMinutes(value: string): number {
  if (!isValidTime(value)) throw new Error('Time must use HH:mm format');
  const [hours, minutes] = value.split(':').map(Number) as [number, number];
  return hours * 60 + minutes;
}

export function isEndAfterStart(startTime: string, endTime?: string | null): boolean {
  if (!endTime) return true;
  return timeToMinutes(endTime) > timeToMinutes(startTime);
}
