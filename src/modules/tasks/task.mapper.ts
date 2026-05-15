import { parseRichTextDocument } from '../../utils/richText.js';
import type { Task } from '@prisma/client';

type TaskWithRichText = Task & { descriptionRichText?: string | null };

export function mapTask(task: TaskWithRichText) {
  return {
    ...task,
    deadline: task.deadline?.toISOString().slice(0, 10) ?? null,
    plannedDate: task.plannedDate?.toISOString().slice(0, 10) ?? null,
    lastDoneAt: task.lastDoneAt?.toISOString().slice(0, 10) ?? null,
    descriptionRichText: parseRichTextDocument(task.descriptionRichText ?? null),
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString(),
  };
}
