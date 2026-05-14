import { describe, expect, it } from 'vitest';
import { ScheduleRepository } from '../../src/modules/schedule/schedule.repository.js';
import { testDb } from '../helpers/testDb.js';
describe('ScheduleRepository', () => {
  it('finds active day blocks', async () => {
    const repo = new ScheduleRepository(testDb);
    await repo.create({
      title: 'Repo',
      dayOfWeek: 4,
      startTime: '08:00',
      status: 'active',
      type: 'work',
      importance: 'medium',
    });
    expect(await repo.findActiveByDay(4)).toHaveLength(1);
  });
});
