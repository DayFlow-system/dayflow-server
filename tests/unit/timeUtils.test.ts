import { describe, expect, it } from 'vitest';
import { isEndAfterStart, isValidTime, timeToMinutes } from '../../src/utils/time.js';
describe('time utils', () => {
  it('validates HH:mm', () => {
    expect(isValidTime('09:30')).toBe(true);
    expect(isValidTime('25:00')).toBe(false);
  });
  it('converts to minutes', () => expect(timeToMinutes('01:30')).toBe(90));
  it('checks ranges', () => expect(isEndAfterStart('10:00', '09:00')).toBe(false));
});
