import { describe, expect, it } from 'vitest';
import { EventRepository } from '../../src/modules/events/event.repository.js';
import { parseDateOnly } from '../../src/utils/date.js';
import { testDb } from '../helpers/testDb.js';
describe('EventRepository', () => {
  it('finds events by date', async () => {
    const repo = new EventRepository(testDb);
    const date = parseDateOnly('2026-05-14');
    await repo.create({ title: 'Repo', date, status: 'planned', importance: 'low' });
    expect(await repo.findByDate(date)).toHaveLength(1);
  });
});
