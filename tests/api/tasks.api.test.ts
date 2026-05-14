import { describe, expect, it } from 'vitest';
import { createTestApp } from '../helpers/testApp.js';
describe('tasks api', () => {
  it('creates, reads, updates, and soft deletes', async () => {
    const app = createTestApp();
    const created = await app.inject({
      method: 'POST',
      url: '/tasks',
      payload: { title: 'Task', priority: 5 },
    });
    expect(created.statusCode).toBe(201);
    const task = created.json();
    expect((await app.inject(`/tasks/${task.id}`)).statusCode).toBe(200);
    expect(
      (
        await app.inject({ method: 'PATCH', url: `/tasks/${task.id}`, payload: { status: 'done' } })
      ).json().status,
    ).toBe('done');
    expect((await app.inject({ method: 'DELETE', url: `/tasks/${task.id}` })).json().status).toBe(
      'archived',
    );
    await app.close();
  });
});
