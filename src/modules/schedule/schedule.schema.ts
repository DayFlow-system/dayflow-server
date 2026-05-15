import { z } from 'zod';
import { IMPORTANCE_LEVELS, SCHEDULE_STATUSES, SCHEDULE_TYPES } from '../../types/common.js';
import { optionalRichTextDocumentSchema } from '../../utils/richText.js';
import { timeSchema, validateTimeRange } from '../../utils/validation.js';

const scheduleBaseSchema = z.object({
  title: z.string().trim().min(1),
  description: z.string().trim().optional().nullable(),
  descriptionRichText: optionalRichTextDocumentSchema,
  dayOfWeek: z.number().int().min(1).max(7),
  startTime: timeSchema,
  endTime: timeSchema.optional().nullable(),
  type: z.enum(SCHEDULE_TYPES).default('other'),
  status: z.enum(SCHEDULE_STATUSES).default('active'),
  importance: z.enum(IMPORTANCE_LEVELS).default('medium'),
  location: z.string().trim().optional().nullable(),
});
export const scheduleCreateSchema = scheduleBaseSchema.superRefine(validateTimeRange);
export const scheduleUpdateSchema = scheduleBaseSchema.partial().superRefine(validateTimeRange);
export type ScheduleCreateInput = z.infer<typeof scheduleCreateSchema>;
export type ScheduleUpdateInput = z.infer<typeof scheduleUpdateSchema>;
