import { describe, expect, it } from 'vitest';
import { createTestApp } from '../helpers/testApp.js';
describe('schedule api', () => {
  it('creates, lists today, and archives', async () => {
    const app = createTestApp();
    const created = await app.inject({
      method: 'POST',
      url: '/schedule',
      payload: { title: 'Block', dayOfWeek: 4, startTime: '09:00' },
    });
    const block = created.json();
    expect(created.statusCode).toBe(201);
    expect((await app.inject('/schedule/today')).statusCode).toBe(200);
    expect(
      (await app.inject({ method: 'DELETE', url: `/schedule/${block.id}` })).json().status,
    ).toBe('archived');
    await app.close();
  });
});
