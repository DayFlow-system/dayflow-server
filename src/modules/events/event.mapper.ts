import type { Event } from '@prisma/client';
export function mapEvent(event: Event) {
  return {
    ...event,
    date: event.date.toISOString().slice(0, 10),
    createdAt: event.createdAt.toISOString(),
    updatedAt: event.updatedAt.toISOString(),
  };
}
