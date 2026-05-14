import { describe, expect, it } from 'vitest';
import { getCurrentDayOfWeek, getTodayDate, parseDateOnly } from '../../src/utils/date.js';
describe('date utils', () => {
  it('formats current date', () =>
    expect(getTodayDate(new Date('2026-05-14T12:00:00Z'))).toBe('2026-05-14'));
  it('returns ISO weekday where Monday is 1', () =>
    expect(getCurrentDayOfWeek(new Date('2026-05-17T00:00:00Z'))).toBe(7));
  it('rejects invalid dates', () =>
    expect(() => parseDateOnly('2026-99-99')).toThrow('Invalid calendar date'));
});
