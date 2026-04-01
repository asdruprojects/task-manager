import type {
  CreateTaskRequest,
  UpdateTaskRequest,
  TaskResponse,
} from '@task-manager/contracts';
import { api } from '../lib/api';

const TASKS_URL = '/api/tasks';

export async function createTask(
  input: CreateTaskRequest,
): Promise<TaskResponse> {
  return api.post<TaskResponse>(TASKS_URL, input);
}

export async function updateTask(
  id: number,
  input: UpdateTaskRequest,
): Promise<TaskResponse> {
  return api.patch<TaskResponse>(`${TASKS_URL}/${id}`, input);
}

export async function deleteTask(id: number): Promise<{ message: string }> {
  return api.delete<{ message: string }>(`${TASKS_URL}/${id}`);
}

export async function toggleTask(
  id: number,
  completed: boolean,
): Promise<TaskResponse> {
  return api.put<TaskResponse>(`${TASKS_URL}/${id}/toggle`, { completed });
}
