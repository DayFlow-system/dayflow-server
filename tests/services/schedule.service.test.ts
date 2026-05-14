import { describe, expect, it } from 'vitest';
import { ScheduleRepository } from '../../src/modules/schedule/schedule.repository.js';
import { ScheduleService } from '../../src/modules/schedule/schedule.service.js';
import { testDb } from '../helpers/testDb.js';
describe('ScheduleService', () => {
  it('archives schedule blocks', async () => {
    const service = new ScheduleService(new ScheduleRepository(testDb));
    const block = await service.create({
      title: 'Study',
      dayOfWeek: 4,
      startTime: '09:00',
      status: 'active',
      type: 'study',
      importance: 'high',
    });
    expect((await service.archive(block.id)).status).toBe('archived');
  });
});
