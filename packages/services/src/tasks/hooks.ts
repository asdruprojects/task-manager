import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type {
  CreateTaskRequest,
  UpdateTaskRequest,
  TaskResponse,
  PaginatedResponse,
  FindTasksQuery,
} from '@task-manager/contracts';
import { getTasks, getTask } from './queries';
import { createTask, updateTask, deleteTask, toggleTask } from './mutations';

export function useGetTasks(
  query?: FindTasksQuery,
  options?: { userId?: number | null },
) {
  const userId = options?.userId ?? null;
  /** Sin 2.º argumento: compat (query activa). Con userId: solo si id > 0. */
  const enabled =
    options === undefined
      ? true
      : typeof userId === 'number' && userId > 0;

  return useQuery<PaginatedResponse<TaskResponse>>({
    queryKey: ['tasks', 'list', userId, query],
    queryFn: () => getTasks(query),
    enabled,
    staleTime: 0,
    refetchOnMount: 'always',
  });
}

export function useGetTask(id: number) {
  return useQuery<TaskResponse>({
    queryKey: ['tasks', 'detail', id],
    queryFn: () => getTask(id),
    enabled: !!id,
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  return useMutation<TaskResponse, Error, CreateTaskRequest>({
    mutationKey: ['tasks', 'create'],
    mutationFn: createTask,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', 'list'] });
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();
  return useMutation<
    TaskResponse,
    Error,
    { id: number; input: UpdateTaskRequest }
  >({
    mutationKey: ['tasks', 'update'],
    mutationFn: ({ id, input }) => updateTask(id, input),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', 'list'] });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();
  return useMutation<{ message: string }, Error, number>({
    mutationKey: ['tasks', 'delete'],
    mutationFn: deleteTask,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', 'list'] });
    },
  });
}

export function useToggleTask() {
  const queryClient = useQueryClient();
  return useMutation<
    TaskResponse,
    Error,
    { id: number; completed: boolean }
  >({
    mutationKey: ['tasks', 'toggle'],
    mutationFn: ({ id, completed }) => toggleTask(id, completed),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', 'list'] });
    },
  });
}
