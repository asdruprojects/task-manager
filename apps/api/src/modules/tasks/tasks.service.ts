import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { FindTasksQueryDto, TaskStatus } from './dto/find-tasks-query.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly tasksRepository: Repository<Task>,
  ) {}

  async findAll(userId: number, query: FindTasksQueryDto) {
    const page = query.page ?? 1;
    const perPage = query.perPage ?? 20;
    const skip = (page - 1) * perPage;

    const where: Record<string, unknown> = { userId, active: true };

    if (query.status === TaskStatus.COMPLETED) {
      where.completed = true;
    } else if (query.status === TaskStatus.PENDING) {
      where.completed = false;
    }

    const [items, itemCount] = await this.tasksRepository.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip,
      take: perPage,
    });

    const pageCount = Math.max(1, Math.ceil(itemCount / perPage));
    const currentPage = Math.max(1, Math.min(page, pageCount));

    return {
      count: itemCount,
      items,
      pageInfo: {
        page: currentPage,
        perPage,
        itemCount: items.length,
        pageCount,
        hasPreviousPage: currentPage > 1,
        hasNextPage: currentPage < pageCount,
      },
    };
  }

  async create(userId: number, dto: CreateTaskDto): Promise<Task> {
    const task = this.tasksRepository.create({
      title: dto.title,
      description: dto.description ?? null,
      userId,
    });
    return this.tasksRepository.save(task);
  }

  async update(id: number, userId: number, dto: UpdateTaskDto): Promise<Task> {
    const task = await this.findOwnedTask(id, userId);

    if (dto.title !== undefined) task.title = dto.title;
    if (dto.description !== undefined) task.description = dto.description;

    return this.tasksRepository.save(task);
  }

  async remove(id: number, userId: number): Promise<{ message: string }> {
    const task = await this.findOwnedTask(id, userId);
    task.active = false;
    await this.tasksRepository.save(task);
    return { message: 'Tarea eliminada exitosamente' };
  }

  async toggle(id: number, userId: number, completed: boolean): Promise<Task> {
    const task = await this.findOwnedTask(id, userId);
    task.completed = completed;
    return this.tasksRepository.save(task);
  }

  private async findOwnedTask(id: number, userId: number): Promise<Task> {
    const task = await this.tasksRepository.findOne({
      where: { id, userId, active: true },
    });

    if (!task) {
      throw new NotFoundException(`Tarea con id ${id} no encontrada`);
    }

    return task;
  }
}
