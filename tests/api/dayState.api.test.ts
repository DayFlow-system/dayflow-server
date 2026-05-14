import { describe, expect, it } from 'vitest';
import { createTestApp } from '../helpers/testApp.js';
describe('day-state api', () => {
  it('auto creates and updates today', async () => {
    const app = createTestApp();
    expect((await app.inject('/day-state/today')).json().energy).toBe('medium');
    expect(
      (
        await app.inject({
          method: 'PUT',
          url: '/day-state/today',
          payload: { health: 'sick', energy: 'low' },
        })
      ).json().health,
    ).toBe('sick');
    await app.close();
  });
});
