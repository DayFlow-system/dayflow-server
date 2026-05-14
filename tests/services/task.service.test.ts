import { describe, expect, it } from 'vitest';
import { TaskRepository } from '../../src/modules/tasks/task.repository.js';
import { TaskService } from '../../src/modules/tasks/task.service.js';
import { testDb } from '../helpers/testDb.js';
describe('TaskService', () => {
  it('creates, updates, and archives a task', async () => {
    const service = new TaskService(new TaskRepository(testDb));
    const created = await service.create({
      title: 'Read',
      priority: 4,
      status: 'planned',
      type: 'study',
      energyRequired: 'medium',
      healthRule: 'always',
    });
    expect(created.title).toBe('Read');
    expect((await service.update(created.id, { status: 'in_progress' })).status).toBe(
      'in_progress',
    );
    expect((await service.archive(created.id)).status).toBe('archived');
  });
});
