'use client';

import React from 'react';
import { Modal } from '@repo/ui/components';
import { useDeleteTask } from '@task-manager/services';
import type { TaskResponse } from '@task-manager/contracts';

interface Props {
  isOpen: boolean;
  task: TaskResponse;
  onClose: () => void;
  onSuccess: () => void;
}

export function DeleteTaskModal({
  isOpen,
  task,
  onClose,
  onSuccess,
}: Props) {
  const { mutateAsync, isPending } = useDeleteTask();
  const [error, setError] = React.useState<string | null>(null);

  const handleDelete = async () => {
    setError(null);
    try {
      await mutateAsync(task.id);
      onClose();
      onSuccess();
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Error al eliminar la tarea';
      setError(msg);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="¿Estás seguro de eliminar esta tarea?"
      description="Este proceso no es reversible."
      actions={{
        primaryText: isPending ? 'Eliminando...' : 'Eliminar',
        primaryVariant: 'destructive',
        cancelText: 'Cancelar',
        onPrimary: handleDelete,
        isLoading: isPending,
      }}
    >
      <div>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 mb-3">
            {error}
          </div>
        )}
        <p className="text-sm text-gray-600">
          La tarea <strong>&ldquo;{task.title}&rdquo;</strong> será eliminada
          permanentemente.
        </p>
      </div>
    </Modal>
  );
}
