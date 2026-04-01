import type {
  TaskResponse,
  PaginatedResponse,
  FindTasksQuery,
} from '@task-manager/contracts';
import { api } from '../lib/api';

const TASKS_URL = '/api/tasks';

export async function getTasks(
  query?: FindTasksQuery,
): Promise<PaginatedResponse<TaskResponse>> {
  const params = new URLSearchParams();
  if (query?.page) params.set('page', String(query.page));
  if (query?.perPage) params.set('perPage', String(query.perPage));
  if (query?.status && query.status !== 'all')
    params.set('status', query.status);
  const qs = params.toString();
  return api.get<PaginatedResponse<TaskResponse>>(
    `${TASKS_URL}${qs ? `?${qs}` : ''}`,
  );
}

export async function getTask(id: number): Promise<TaskResponse> {
  return api.get<TaskResponse>(`${TASKS_URL}/${id}`);
}
