'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { Button, Input, PasswordInput } from '@repo/ui/atoms';
import { PasswordValidations } from '@repo/ui/components';
import { useRegister } from '@task-manager/services';
import { useAuth } from '../../../context/auth-context';
import type { RegisterRequest } from '@task-manager/contracts';
import { AuthHeader } from '../../../components/auth-header';

export default function RegisterPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { mutateAsync: registerMutation, isPending } = useRegister();
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  React.useEffect(() => {
    if (isAuthenticated) router.replace('/dashboard');
  }, [isAuthenticated, router]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterRequest>({
    defaultValues: { name: '', lastName: '', email: '', password: '' },
  });

  const passwordValue = watch('password') ?? '';

  const onSubmit = async (data: RegisterRequest) => {
    setError(null);
    try {
      await registerMutation({
        ...data,
        email: data.email.toLowerCase().trim(),
      });
      setSuccess(true);
      setTimeout(() => router.push('/login'), 2000);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Error al registrarse';
      setError(message);
    }
  };

  return (
    <div className="w-full flex flex-col gap-8">
      <AuthHeader
        title="Crear cuenta"
        subtitle="Regístrate para comenzar a gestionar tus tareas."
      />

      {error && (
        <div className="w-full bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-3 text-left">
          {error}
        </div>
      )}

      {success && (
        <div className="w-full bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl p-3 text-left">
          ¡Registro exitoso! Redirigiendo al inicio de sesión...
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex flex-col gap-5 text-left"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Nombre"
            placeholder="John"
            error={errors.name?.message}
            {...register('name', {
              required: 'El nombre es requerido',
              minLength: { value: 2, message: 'Mínimo 2 caracteres' },
              maxLength: { value: 100, message: 'Máximo 100 caracteres' },
            })}
          />
          <Input
            label="Apellido"
            placeholder="Doe"
            error={errors.lastName?.message}
            {...register('lastName', {
              required: 'El apellido es requerido',
              minLength: { value: 2, message: 'Mínimo 2 caracteres' },
              maxLength: { value: 100, message: 'Máximo 100 caracteres' },
            })}
          />
        </div>
        <Input
          shell="tint"
          label="Correo electrónico"
          type="email"
          autoComplete="email"
          placeholder="ejemplo@email.com"
          error={errors.email?.message}
          {...register('email', {
            required: 'El correo es requerido',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Correo inválido',
            },
          })}
        />
        <div className="flex flex-col gap-2">
          <PasswordInput
            label="Contraseña"
            autoComplete="new-password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password', {
              required: 'La contraseña es requerida',
              minLength: { value: 8, message: 'Mínimo 8 caracteres' },
              maxLength: { value: 64, message: 'Máximo 64 caracteres' },
              pattern: {
                value:
                  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
                message:
                  'Debe incluir mayúscula, minúscula, número y carácter especial (@$!%*?&)',
              },
            })}
          />
          <PasswordValidations password={passwordValue} />
        </div>
        <Button
          type="submit"
          variant="default"
          size="lg"
          className="w-full mt-1"
          disabled={isPending}
        >
          {isPending ? 'Registrando...' : 'Registrarse'}
        </Button>
      </form>

      <p className="text-center text-sm text-gray-600">
        ¿Ya tienes una cuenta?{' '}
        <Link
          href="/login"
          className="text-sky-500 hover:text-sky-700 font-semibold"
        >
          Iniciar sesión
        </Link>
      </p>
    </div>
  );
}
