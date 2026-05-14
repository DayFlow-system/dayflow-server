import { describe, expect, it } from 'vitest';
import { createTestApp } from '../helpers/testApp.js';
describe('validation errors', () => {
  it('returns validation for invalid uuid, enum, range, and time', async () => {
    const app = createTestApp();
    expect((await app.inject('/tasks/not-a-uuid')).json().error.code).toBe('VALIDATION_ERROR');
    expect(
      (
        await app.inject({ method: 'POST', url: '/tasks', payload: { title: 'x', priority: 99 } })
      ).json().error.code,
    ).toBe('VALIDATION_ERROR');
    expect(
      (
        await app.inject({
          method: 'POST',
          url: '/events',
          payload: { title: 'x', date: '2026-05-14', status: 'bad' },
        })
      ).json().error.code,
    ).toBe('VALIDATION_ERROR');
    expect(
      (
        await app.inject({
          method: 'POST',
          url: '/schedule',
          payload: { title: 'x', dayOfWeek: 1, startTime: '10:00', endTime: '09:00' },
        })
      ).json().error.code,
    ).toBe('VALIDATION_ERROR');
    await app.close();
  });
});
