import { Prisma } from '@prisma/client';
import { AppError } from '../../errors/AppError.js';
import { ERROR_CODES } from '../../errors/errorCodes.js';
import type { TaskCreateInput, TaskUpdateInput } from './task.schema.js';
import { mapTask } from './task.mapper.js';
import type { TaskRepository } from './task.repository.js';

export class TaskService {
  constructor(private readonly repository: TaskRepository) {}

  async list() {
    return (await this.repository.findMany()).map(mapTask);
  }

  async get(id: string) {
    const task = await this.repository.findById(id);
    if (!task) throw new AppError(ERROR_CODES.NOT_FOUND, 'Task not found', 404);
    return mapTask(task);
  }

  async create(data: TaskCreateInput) {
    return mapTask(await this.repository.create(data));
  }

  async update(id: string, data: TaskUpdateInput) {
    try {
      return mapTask(await this.repository.update(id, data));
    } catch (error) {
      handleMissing(error, 'Task not found');
    }
  }

  async archive(id: string) {
    try {
      return mapTask(await this.repository.archive(id));
    } catch (error) {
      handleMissing(error, 'Task not found');
    }
  }
}

function handleMissing(error: unknown, message: string): never {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
    throw new AppError(ERROR_CODES.NOT_FOUND, message, 404);
  }
  throw error;
}
