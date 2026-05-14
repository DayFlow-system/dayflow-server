import { describe, expect, it } from 'vitest';
import {
  filterActiveTasks,
  filterTasksByEnergy,
  filterTasksByHealth,
  getDeadlineTasks,
  getPlannedTasks,
  removeDuplicateTasks,
} from '../../src/modules/today/today.service.js';
const base = {
  id: '1',
  title: 'A',
  description: null,
  status: 'planned',
  type: 'task',
  priority: 1,
  deadline: null,
  plannedDate: null,
  lastDoneAt: null,
  energyRequired: 'low',
  healthRule: 'always',
  createdAt: new Date(),
  updatedAt: new Date(),
} as const;
describe('today filters', () => {
  it('filters inactive tasks', () =>
    expect(
      filterActiveTasks([{ ...base }, { ...base, id: '2', status: 'done' }]).map((t) => t.id),
    ).toEqual(['1']));
  it('filters sick-only tasks', () =>
    expect(
      filterTasksByHealth(
        [{ ...base }, { ...base, id: '2', healthRule: 'only_if_healthy' }],
        'sick',
      ),
    ).toHaveLength(1));
  it('filters energy', () =>
    expect(
      filterTasksByEnergy([{ ...base }, { ...base, id: '2', energyRequired: 'high' }], 'medium'),
    ).toHaveLength(1));
  it('selects deadline and planned tasks', () => {
    expect(
      getDeadlineTasks([{ ...base, deadline: new Date('2026-05-13T00:00:00Z') }], '2026-05-14'),
    ).toHaveLength(1);
    expect(
      getPlannedTasks([{ ...base, plannedDate: new Date('2026-05-14T00:00:00Z') }], '2026-05-14'),
    ).toHaveLength(1);
  });
  it('removes duplicates', () =>
    expect(removeDuplicateTasks([{ ...base }], [{ ...base }])).toHaveLength(0));
});
