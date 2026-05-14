import { describe, expect, it } from 'vitest';
import {
  limitSuggestedTasks,
  sortTasksByPriorityDeadlineEnergy,
} from '../../src/modules/today/today.service.js';
const makeTask = (
  id: string,
  priority: number,
  deadline: Date | null = null,
  energyRequired = 'low',
) => ({
  id,
  title: id,
  description: null,
  status: 'planned',
  type: 'task',
  priority,
  deadline,
  plannedDate: null,
  lastDoneAt: null,
  energyRequired,
  healthRule: 'always',
  createdAt: new Date(),
  updatedAt: new Date(),
});
describe('today sorting', () => {
  it('sorts by priority before deadline', () =>
    expect(
      sortTasksByPriorityDeadlineEnergy(
        [makeTask('low', 1, new Date('2026-05-14T00:00:00Z')), makeTask('high', 5)],
        'low',
        '2026-05-14',
      )[0]?.id,
    ).toBe('high'));
  it('limits suggestions to ten', () =>
    expect(
      limitSuggestedTasks(Array.from({ length: 12 }, (_, i) => makeTask(String(i), 1))),
    ).toHaveLength(10));
});
