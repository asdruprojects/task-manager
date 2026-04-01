'use client';

import type { TaskResponse } from '@task-manager/contracts';

interface TaskCardProps {
  task: TaskResponse;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function TaskCard({ task, onToggle, onEdit, onDelete }: TaskCardProps) {
  return (
    <div className="group bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow flex items-start gap-4">
      <button
        onClick={onToggle}
        className="mt-0.5 shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-colors"
        style={
          task.completed
            ? { backgroundColor: '#4f46e5', borderColor: '#4f46e5' }
            : { borderColor: '#d1d5db' }
        }
        aria-label={task.completed ? 'Marcar como pendiente' : 'Marcar como completada'}
      >
        {task.completed && (
          <svg
            className="w-3 h-3 text-white"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={3}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 12.75l6 6 9-13.5"
            />
          </svg>
        )}
      </button>

      <div className="flex-1 min-w-0">
        <h3
          className={`text-sm font-medium truncate ${task.completed ? 'line-through text-gray-400' : 'text-gray-900'}`}
        >
          {task.title}
        </h3>
        {task.description && (
          <p
            className={`text-sm mt-1 line-clamp-2 ${task.completed ? 'text-gray-300' : 'text-gray-500'}`}
          >
            {task.description}
          </p>
        )}
      </div>

      <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={onEdit}
          className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors cursor-pointer"
          title="Editar"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
            />
          </svg>
        </button>
        <button
          onClick={onDelete}
          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
          title="Eliminar"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
