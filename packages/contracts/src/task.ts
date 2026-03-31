export interface CreateTaskRequest {
  title: string;
  description?: string;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
}

export interface ToggleTaskRequest {
  completed: boolean;
}

export interface TaskResponse {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  active: boolean;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface PageInfo {
  page: number;
  perPage: number;
  itemCount: number;
  pageCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface PaginatedResponse<T> {
  totalCount: number;
  items: T[];
  pageInfo: PageInfo;
}

export interface PaginationInput {
  page?: number;
  perPage?: number;
}
