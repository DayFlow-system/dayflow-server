import { z } from 'zod';
import { ENERGY_LEVELS, HEALTH_RULES, TASK_STATUSES, TASK_TYPES } from '../../types/common.js';
import { optionalDateOnlySchema } from '../../utils/validation.js';

export const taskCreateSchema = z.object({
  title: z.string().trim().min(1),
  description: z.string().trim().optional().nullable(),
  status: z.enum(TASK_STATUSES).default('planned'),
  type: z.enum(TASK_TYPES).default('task'),
  priority: z.number().int().min(1).max(5).default(3),
  deadline: optionalDateOnlySchema,
  plannedDate: optionalDateOnlySchema,
  lastDoneAt: optionalDateOnlySchema,
  energyRequired: z.enum(ENERGY_LEVELS).default('medium'),
  healthRule: z.enum(HEALTH_RULES).default('always'),
});

export const taskUpdateSchema = taskCreateSchema.partial();

export type TaskCreateInput = z.infer<typeof taskCreateSchema>;
export type TaskUpdateInput = z.infer<typeof taskUpdateSchema>;
