export const TASK_STATUSES = ['planned', 'in_progress', 'done', 'skipped', 'archived'] as const;
export const TASK_TYPES = ['task', 'study', 'health', 'routine', 'fun', 'admin'] as const;
export const ENERGY_LEVELS = ['low', 'medium', 'high'] as const;
export const HEALTH_RULES = ['always', 'skip_if_sick', 'only_if_healthy'] as const;
export const EVENT_STATUSES = ['planned', 'done', 'cancelled'] as const;
export const IMPORTANCE_LEVELS = ['low', 'medium', 'high', 'mandatory'] as const;
export const SCHEDULE_TYPES = [
  'study',
  'work',
  'health',
  'routine',
  'admin',
  'free_time',
  'other',
] as const;
export const SCHEDULE_STATUSES = ['active', 'paused', 'archived'] as const;
export const HEALTH_LEVELS = ['healthy', 'slightly_sick', 'sick'] as const;

export type TaskStatus = (typeof TASK_STATUSES)[number];
export type TaskType = (typeof TASK_TYPES)[number];
export type EnergyLevel = (typeof ENERGY_LEVELS)[number];
export type HealthRule = (typeof HEALTH_RULES)[number];
export type EventStatus = (typeof EVENT_STATUSES)[number];
export type ImportanceLevel = (typeof IMPORTANCE_LEVELS)[number];
export type ScheduleType = (typeof SCHEDULE_TYPES)[number];
export type ScheduleStatus = (typeof SCHEDULE_STATUSES)[number];
export type HealthLevel = (typeof HEALTH_LEVELS)[number];

export interface EntityTimestamps {
  createdAt: string;
  updatedAt: string;
}
