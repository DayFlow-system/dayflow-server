import type { PrismaClient, Task } from '@prisma/client';
import {
  parseDateOnly,
  getCurrentDayOfWeek,
  getTodayDate,
  isSameDate,
  isSameOrBeforeDate,
} from '../../utils/date.js';
import { energyCompatibilityScore } from '../../utils/sorting.js';
import { mapDayState } from '../day-state/dayState.mapper.js';
import { mapEvent } from '../events/event.mapper.js';
import { mapScheduleBlock } from '../schedule/schedule.mapper.js';
import { mapTask } from '../tasks/task.mapper.js';
import type { EnergyLevel, HealthLevel } from '../../types/common.js';
import type { TodayDashboard, TodayData, TodayTask } from './today.types.js';

const INACTIVE_TASK_STATUSES = new Set(['done', 'skipped', 'archived']);
const SUGGESTED_TASK_LIMIT = 10;

export { getCurrentDayOfWeek, getTodayDate };

export function filterActiveTasks(tasks: TodayTask[]): TodayTask[] {
  return tasks.filter((task) => !INACTIVE_TASK_STATUSES.has(task.status));
}

export function filterTasksByHealth(tasks: TodayTask[], health: HealthLevel): TodayTask[] {
  if (health === 'sick') return tasks.filter((task) => task.healthRule === 'always');
  if (health === 'slightly_sick')
    return tasks.filter((task) => task.healthRule !== 'only_if_healthy');
  return tasks;
}

export function filterTasksByEnergy(tasks: TodayTask[], energy: EnergyLevel): TodayTask[] {
  if (energy === 'low') return tasks.filter((task) => task.energyRequired === 'low');
  if (energy === 'medium') return tasks.filter((task) => task.energyRequired !== 'high');
  return tasks;
}

export function getDeadlineTasks(tasks: TodayTask[], date: string): TodayTask[] {
  return tasks.filter((task) => isSameOrBeforeDate(task.deadline, date));
}

export function getPlannedTasks(tasks: TodayTask[], date: string): TodayTask[] {
  return tasks.filter((task) => isSameDate(task.plannedDate, date));
}

export function removeDuplicateTasks(tasks: TodayTask[], duplicates: Task[]): TodayTask[] {
  const duplicateIds = new Set(duplicates.map((task) => task.id));
  // We exclude planned and deadline tasks from suggestedTasks to avoid showing the same task multiple times.
  return tasks.filter((task) => !duplicateIds.has(task.id));
}

export function sortTasksByPriorityDeadlineEnergy(
  tasks: TodayTask[],
  energy: EnergyLevel,
  date: string,
): TodayTask[] {
  return [...tasks].sort((left, right) => {
    const priorityDiff = right.priority - left.priority;
    if (priorityDiff !== 0) return priorityDiff;

    const deadlineDiff =
      deadlineDistance(left.deadline, date) - deadlineDistance(right.deadline, date);
    if (deadlineDiff !== 0) return deadlineDiff;

    return (
      energyCompatibilityScore(right.energyRequired, energy) -
      energyCompatibilityScore(left.energyRequired, energy)
    );
  });
}

export function limitSuggestedTasks(tasks: TodayTask[]): TodayTask[] {
  return tasks.slice(0, SUGGESTED_TASK_LIMIT);
}

export async function buildTodayDashboard(
  db: PrismaClient,
  now = new Date(),
): Promise<TodayDashboard> {
  const date = getTodayDate(now);
  const data = await loadTodayData(db, date, getCurrentDayOfWeek(now));
  const activeTasks = filterActiveTasks(data.tasks);
  const deadlineTasks = sortTasksByPriorityDeadlineEnergy(
    getDeadlineTasks(activeTasks, date),
    data.dayState.energy,
    date,
  );
  const plannedTasks = sortTasksByPriorityDeadlineEnergy(
    getPlannedTasks(activeTasks, date),
    data.dayState.energy,
    date,
  );
  const duplicateTasks = [...deadlineTasks, ...plannedTasks];
  const suggestedTasks = limitSuggestedTasks(
    sortTasksByPriorityDeadlineEnergy(
      filterTasksByEnergy(
        filterTasksByHealth(
          removeDuplicateTasks(activeTasks, duplicateTasks),
          data.dayState.health,
        ),
        data.dayState.energy,
      ),
      data.dayState.energy,
      date,
    ),
  );

  return {
    date,
    dayState: mapDayState(data.dayState),
    mandatoryEvents: data.events.filter((event) => event.importance === 'mandatory').map(mapEvent),
    plannedEvents: data.events.filter((event) => event.status === 'planned').map(mapEvent),
    scheduleBlocks: data.scheduleBlocks.map(mapScheduleBlock),
    deadlineTasks: deadlineTasks.map(mapTask),
    plannedTasks: plannedTasks.map(mapTask),
    suggestedTasks: suggestedTasks.map(mapTask),
  };
}

async function loadTodayData(
  db: PrismaClient,
  dateString: string,
  dayOfWeek: number,
): Promise<TodayData> {
  const date = parseDateOnly(dateString);
  const dayState = await db.dayState.upsert({
    where: { date },
    create: { date, health: 'healthy', energy: 'medium' },
    update: {},
  });
  const [events, scheduleBlocks, tasks] = await Promise.all([
    db.event.findMany({ where: { date }, orderBy: [{ startTime: 'asc' }] }),
    db.scheduleBlock.findMany({
      where: { dayOfWeek, status: 'active' },
      orderBy: { startTime: 'asc' },
    }),
    db.task.findMany(),
  ]);
  return {
    dayState: dayState as TodayData['dayState'],
    events,
    scheduleBlocks,
    tasks: tasks as TodayTask[],
  };
}

function deadlineDistance(deadline: Date | null, date: string): number {
  if (!deadline) return Number.MAX_SAFE_INTEGER;
  return Math.abs(
    parseDateOnly(deadline.toISOString().slice(0, 10)).getTime() - parseDateOnly(date).getTime(),
  );
}
