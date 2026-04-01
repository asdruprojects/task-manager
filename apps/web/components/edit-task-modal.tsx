'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { Modal } from '@repo/ui/components';
import { Input, TextArea } from '@repo/ui/atoms';
import { useUpdateTask } from '@task-manager/services';
import type { UpdateTaskRequest, TaskResponse } from '@task-manager/contracts';

interface Props {
  isOpen: boolean;
  task: TaskResponse;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditTaskModal({ isOpen, task, onClose, onSuccess }: Props) {
  const { mutateAsync, isPending } = useUpdateTask();
  const [error, setError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateTaskRequest>({
    defaultValues: { title: task.title, description: task.description ?? '' },
  });

  React.useEffect(() => {
    if (isOpen) {
      reset({ title: task.title, description: task.description ?? '' });
      setError(null);
    }
  }, [isOpen, task, reset]);

  const onSubmit = async (data: UpdateTaskRequest) => {
    setError(null);
    try {
      await mutateAsync({ id: task.id, input: data });
      onClose();
      onSuccess();
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Error al actualizar la tarea';
      setError(msg);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Editar Tarea"
      description="Modifica los datos de tu tarea."
      actions={{
        primaryText: isPending ? 'Guardando...' : 'Guardar',
        cancelText: 'Cancelar',
        onPrimary: handleSubmit(onSubmit),
        isLoading: isPending,
      }}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">
            {error}
          </div>
        )}
        <Input
          label="Título"
          placeholder="Título de la tarea"
          error={errors.title?.message}
          {...register('title', {
            minLength: { value: 1, message: 'El título es requerido' },
            maxLength: { value: 255, message: 'Máximo 255 caracteres' },
          })}
        />
        <TextArea
          label="Descripción"
          placeholder="Descripción de la tarea (opcional)"
          rows={4}
          maxLength={2000}
          error={errors.description?.message}
          {...register('description', {
            maxLength: { value: 2000, message: 'Máximo 2000 caracteres' },
          })}
        />
      </form>
    </Modal>
  );
}
