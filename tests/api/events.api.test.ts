import { describe, expect, it } from 'vitest';
import { createTestApp } from '../helpers/testApp.js';
describe('events api', () => {
  it('creates, updates, and cancels', async () => {
    const app = createTestApp();
    const created = await app.inject({
      method: 'POST',
      url: '/events',
      payload: { title: 'Event', date: '2026-05-14', importance: 'high' },
    });
    const event = created.json();
    expect(created.statusCode).toBe(201);
    expect(
      (
        await app.inject({
          method: 'PATCH',
          url: `/events/${event.id}`,
          payload: { status: 'done' },
        })
      ).json().status,
    ).toBe('done');
    expect((await app.inject({ method: 'DELETE', url: `/events/${event.id}` })).json().status).toBe(
      'cancelled',
    );
    await app.close();
  });
});
