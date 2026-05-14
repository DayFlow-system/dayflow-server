import type { Task } from '@prisma/client';

export function mapTask(task: Task) {
  return {
    ...task,
    deadline: task.deadline?.toISOString().slice(0, 10) ?? null,
    plannedDate: task.plannedDate?.toISOString().slice(0, 10) ?? null,
    lastDoneAt: task.lastDoneAt?.toISOString().slice(0, 10) ?? null,
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString(),
  };
}
