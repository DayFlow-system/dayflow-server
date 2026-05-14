import type { DayState } from '@prisma/client';
export function mapDayState(dayState: DayState) {
  return {
    ...dayState,
    date: dayState.date.toISOString().slice(0, 10),
    createdAt: dayState.createdAt.toISOString(),
    updatedAt: dayState.updatedAt.toISOString(),
  };
}
