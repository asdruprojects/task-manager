'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { Modal } from '@repo/ui/components';
import { Input, TextArea } from '@repo/ui/atoms';
import { useCreateTask } from '@task-manager/services';
import type { CreateTaskRequest } from '@task-manager/contracts';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateTaskModal({ isOpen, onClose, onSuccess }: Props) {
  const { mutateAsync, isPending } = useCreateTask();
  const [error, setError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateTaskRequest>({
    defaultValues: { title: '', description: '' },
  });

  React.useEffect(() => {
    if (isOpen) {
      reset({ title: '', description: '' });
      setError(null);
    }
  }, [isOpen, reset]);

  const onSubmit = async (data: CreateTaskRequest) => {
    setError(null);
    try {
      await mutateAsync(data);
      onClose();
      onSuccess();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al crear la tarea';
      setError(msg);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Nueva Tarea"
      description="Crea una nueva tarea para tu lista."
      actions={{
        primaryText: isPending ? 'Creando...' : 'Crear',
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
          placeholder="¿Qué necesitas hacer?"
          error={errors.title?.message}
          {...register('title', {
            required: 'El título es requerido',
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
