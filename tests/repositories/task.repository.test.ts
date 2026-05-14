import { describe, expect, it } from 'vitest';
import { TaskRepository } from '../../src/modules/tasks/task.repository.js';
import { testDb } from '../helpers/testDb.js';
describe('TaskRepository', () => {
  it('persists tasks', async () => {
    const repo = new TaskRepository(testDb);
    const task = await repo.create({
      title: 'Repo',
      priority: 3,
      status: 'planned',
      type: 'task',
      energyRequired: 'low',
      healthRule: 'always',
    });
    expect(await repo.findById(task.id)).not.toBeNull();
  });
});
