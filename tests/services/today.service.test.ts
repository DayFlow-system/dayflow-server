import { describe, expect, it } from 'vitest';
import { buildTodayDashboard } from '../../src/modules/today/today.service.js';
import { parseDateOnly } from '../../src/utils/date.js';
import { testDb } from '../helpers/testDb.js';
describe('TodayService', () => {
  it('builds dashboard sections', async () => {
    const date = parseDateOnly('2026-05-14');
    await testDb.dayState.create({ data: { date, health: 'slightly_sick', energy: 'medium' } });
    await testDb.event.create({
      data: { title: 'Doctor', date, importance: 'mandatory', status: 'planned' },
    });
    await testDb.scheduleBlock.create({
      data: {
        title: 'Class',
        dayOfWeek: 4,
        startTime: '10:00',
        status: 'active',
        importance: 'high',
        type: 'study',
      },
    });
    await testDb.task.create({
      data: {
        title: 'Due',
        priority: 5,
        deadline: date,
        energyRequired: 'low',
        healthRule: 'always',
      },
    });
    await testDb.task.create({
      data: { title: 'Suggest', priority: 4, energyRequired: 'medium', healthRule: 'always' },
    });
    const dashboard = await buildTodayDashboard(testDb, new Date('2026-05-14T12:00:00Z'));
    expect(dashboard.mandatoryEvents).toHaveLength(1);
    expect(dashboard.scheduleBlocks).toHaveLength(1);
    expect(dashboard.deadlineTasks).toHaveLength(1);
    expect(dashboard.suggestedTasks).toHaveLength(1);
  });
});
