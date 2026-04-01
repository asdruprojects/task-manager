'use client';

import React from 'react';
import { useGetTasks, useToggleTask } from '@task-manager/services';
import type { TaskResponse, TaskStatus } from '@task-manager/contracts';
import { Button } from '@repo/ui/atoms';
import { InputSearchSimple, Tabs } from '@repo/ui/components';
import { TaskCard } from '../../../components/task-card';
import { TaskCardSkeleton } from '../../../components/task-card-skeleton';
import { CreateTaskModal } from '../../../components/create-task-modal';
import { EditTaskModal } from '../../../components/edit-task-modal';
import { DeleteTaskModal } from '../../../components/delete-task-modal';

const TABS = [
  { key: 'all', name: 'Todas' },
  { key: 'pending', name: 'Pendientes' },
  { key: 'completed', name: 'Completadas' },
];

const PER_PAGE = 10;

export default function DashboardPage() {
  const [activeTab, setActiveTab] = React.useState<TaskStatus>('all');
  const [page, setPage] = React.useState(1);
  const [allItems, setAllItems] = React.useState<TaskResponse[]>([]);
  const [search, setSearch] = React.useState('');
  const [debouncedSearch, setDebouncedSearch] = React.useState('');
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [editTask, setEditTask] = React.useState<TaskResponse | null>(null);
  const [deleteTask, setDeleteTask] = React.useState<TaskResponse | null>(
    null,
  );

  React.useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [search]);

  const { data, isLoading, isFetching } = useGetTasks({
    page,
    perPage: PER_PAGE,
    status: activeTab,
    search: debouncedSearch || undefined,
  });
  const { mutate: toggleMutation } = useToggleTask();

  React.useEffect(() => {
    if (!data?.items) return;
    setAllItems((prev) => {
      if (page === 1) return data.items;
      const existingIds = new Set(prev.map((i) => i.id));
      const fresh = data.items.filter((i) => !existingIds.has(i.id));
      return [...prev, ...fresh];
    });
  }, [data, page]);

  const handleTabChange = (key: string) => {
    setActiveTab(key as TaskStatus);
    setPage(1);
    setAllItems([]);
  };

  React.useEffect(() => {
    setPage(1);
    setAllItems([]);
  }, [debouncedSearch]);

  const handleToggle = (task: TaskResponse) => {
    const next = !task.completed;
    setAllItems((prev) =>
      prev
        .map((t) => (t.id === task.id ? { ...t, completed: next } : t))
        .filter((t) => {
          if (activeTab === 'pending') return !t.completed;
          if (activeTab === 'completed') return t.completed;
          return true;
        }),
    );
    toggleMutation({ id: task.id, completed: next });
  };

  const handleMutationSuccess = () => {
    setPage(1);
    setAllItems([]);
  };

  const sentinelRef = React.useRef<HTMLDivElement>(null);
  const canLoadMore = !!data?.pageInfo.hasNextPage && !isFetching;
  const canLoadMoreRef = React.useRef(canLoadMore);
  canLoadMoreRef.current = canLoadMore;

  React.useEffect(() => {
    const el = sentinelRef.current;
    if (!el || allItems.length === 0) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && canLoadMoreRef.current) {
          setPage((prevPage) => prevPage + 1);
        }
      },
      {
        threshold: 0,
        rootMargin: '200px 0px',
      },
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [allItems.length, activeTab]);

  const showSkeleton = isLoading && allItems.length === 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="text-xl font-bold text-gray-900">Mis Tareas</h2>
        <Button
          onClick={() => setIsCreateOpen(true)}
          className="gap-3 pl-4 pr-5 shadow-[0_6px_18px_rgba(15,23,42,0.12)]"
        >
          <span className="text-lg leading-none">+</span>
          <span>Nueva Tarea</span>
        </Button>
      </div>

      <InputSearchSimple
        value={search}
        onChangeValue={setSearch}
        placeholder="Buscar por título o descripción"
        containerClassName="max-w-md"
      />

      <Tabs tabs={TABS} activeTab={activeTab} onTabChange={handleTabChange} />

      <div className="flex flex-col gap-3">
        {showSkeleton ? (
          Array.from({ length: 4 }).map((_, i) => (
            <TaskCardSkeleton key={i} />
          ))
        ) : allItems.length === 0 && !isFetching ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <svg
              className="w-16 h-16 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
              />
            </svg>
            <p className="text-lg font-medium text-gray-500">No hay tareas</p>
            <p className="text-sm mt-1">
              Crea tu primera tarea para comenzar
            </p>
          </div>
        ) : (
          <>
            {allItems.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggle={() => handleToggle(task)}
                onEdit={() => setEditTask(task)}
                onDelete={() => setDeleteTask(task)}
              />
            ))}
            <div ref={sentinelRef} className="h-4" />
            {isFetching && page > 1 && (
              <div className="flex justify-center py-4">
                <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </>
        )}
      </div>

      <CreateTaskModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={handleMutationSuccess}
      />
      {editTask && (
        <EditTaskModal
          isOpen={!!editTask}
          task={editTask}
          onClose={() => setEditTask(null)}
          onSuccess={handleMutationSuccess}
        />
      )}
      {deleteTask && (
        <DeleteTaskModal
          isOpen={!!deleteTask}
          task={deleteTask}
          onClose={() => setDeleteTask(null)}
          onSuccess={handleMutationSuccess}
        />
      )}
    </div>
  );
}
