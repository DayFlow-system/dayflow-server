import { describe, expect, it } from 'vitest';
import { DayStateRepository } from '../../src/modules/day-state/dayState.repository.js';
import { DayStateService } from '../../src/modules/day-state/dayState.service.js';
import { testDb } from '../helpers/testDb.js';
describe('DayStateService', () => {
  it('auto creates and updates today state', async () => {
    const service = new DayStateService(new DayStateRepository(testDb));
    expect((await service.getOrCreateToday('2026-05-14')).energy).toBe('medium');
    expect((await service.putToday('2026-05-14', { health: 'sick', energy: 'low' })).health).toBe(
      'sick',
    );
  });
});
