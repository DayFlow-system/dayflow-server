import { z } from 'zod';
import { EVENT_STATUSES, IMPORTANCE_LEVELS } from '../../types/common.js';
import { dateOnlySchema, timeSchema, validateTimeRange } from '../../utils/validation.js';

const eventBaseSchema = z.object({
  title: z.string().trim().min(1),
  description: z.string().trim().optional().nullable(),
  date: dateOnlySchema,
  startTime: timeSchema.optional().nullable(),
  endTime: timeSchema.optional().nullable(),
  status: z.enum(EVENT_STATUSES).default('planned'),
  importance: z.enum(IMPORTANCE_LEVELS).default('medium'),
  location: z.string().trim().optional().nullable(),
});

export const eventCreateSchema = eventBaseSchema.superRefine(validateTimeRange);
export const eventUpdateSchema = eventBaseSchema.partial().superRefine(validateTimeRange);
export type EventCreateInput = z.infer<typeof eventCreateSchema>;
export type EventUpdateInput = z.infer<typeof eventUpdateSchema>;
