import { Prisma } from '@prisma/client';
import { parseDateOnly } from '../../utils/date.js';
import { mapDayState } from './dayState.mapper.js';
import type { DayStateRepository } from './dayState.repository.js';
import type { DayStatePutInput } from './dayState.schema.js';
export class DayStateService {
  constructor(private readonly repository: DayStateRepository) {}
  async getOrCreateToday(dateString: string) {
    const date = parseDateOnly(dateString);
    const found = await this.repository.findByDate(date);
    if (found) return mapDayState(found);
    try {
      return mapDayState(await this.repository.createDefault(date));
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002')
        return mapDayState((await this.repository.findByDate(date))!);
      throw error;
    }
  }
  async putToday(dateString: string, data: DayStatePutInput) {
    return mapDayState(await this.repository.upsert(parseDateOnly(dateString), data));
  }
}
