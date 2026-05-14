import { describe, expect, it } from 'vitest';
import { EventRepository } from '../../src/modules/events/event.repository.js';
import { EventService } from '../../src/modules/events/event.service.js';
import { parseDateOnly } from '../../src/utils/date.js';
import { testDb } from '../helpers/testDb.js';
describe('EventService', () => {
  it('cancels an event', async () => {
    const service = new EventService(new EventRepository(testDb));
    const event = await service.create({
      title: 'Exam',
      date: parseDateOnly('2026-05-14'),
      status: 'planned',
      importance: 'mandatory',
    });
    expect((await service.cancel(event.id)).status).toBe('cancelled');
  });
});
