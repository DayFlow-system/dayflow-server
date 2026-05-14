import { describe, expect, it } from 'vitest';
import { DayStateRepository } from '../../src/modules/day-state/dayState.repository.js';
import { parseDateOnly } from '../../src/utils/date.js';
import { testDb } from '../helpers/testDb.js';
describe('DayStateRepository', () => {
  it('upserts unique dates', async () => {
    const repo = new DayStateRepository(testDb);
    const date = parseDateOnly('2026-05-14');
    await repo.upsert(date, { health: 'healthy', energy: 'medium' });
    expect((await repo.upsert(date, { health: 'sick', energy: 'low' })).health).toBe('sick');
  });
});
