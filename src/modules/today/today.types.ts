import type { DayState, Event, ScheduleBlock, Task } from '@prisma/client';
import type { EnergyLevel, HealthLevel, HealthRule } from '../../types/common.js';

export type TodayTask = Task & { energyRequired: EnergyLevel; healthRule: HealthRule };
export type TodayDayState = DayState & { health: HealthLevel; energy: EnergyLevel };

export interface TodayDashboard {
  date: string;
  dayState: unknown;
  mandatoryEvents: unknown[];
  plannedEvents: unknown[];
  scheduleBlocks: unknown[];
  deadlineTasks: unknown[];
  plannedTasks: unknown[];
  suggestedTasks: unknown[];
}

export interface TodayData {
  dayState: TodayDayState;
  events: Event[];
  scheduleBlocks: ScheduleBlock[];
  tasks: TodayTask[];
}
