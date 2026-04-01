'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { Button, Input, PasswordInput } from '@repo/ui/atoms';
import { useLogin } from '@task-manager/services';
import { useAuth } from '../../../context/auth-context';
import type { LoginRequest } from '@task-manager/contracts';
import { AuthHeader } from '../../../components/auth-header';

export default function LoginPage() {
  const router = useRouter();
  const { login: saveAuth, isAuthenticated } = useAuth();
  const { mutateAsync: loginMutation, isPending } = useLogin();
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (isAuthenticated) router.replace('/dashboard');
  }, [isAuthenticated, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>({
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: LoginRequest) => {
    setError(null);
    try {
      const result = await loginMutation({
        ...data,
        email: data.email.toLowerCase().trim(),
      });
      saveAuth(result.accessToken, result.user);
      router.push('/dashboard');
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Error al iniciar sesión';
      setError(message);
    }
  };

  return (
    <div className="w-full flex flex-col gap-8 items-center">
      <AuthHeader
        title="Inicia sesión"
        subtitle="Bienvenido. Ingresa tus datos para continuar."
      />

      {error && (
        <div className="w-full max-w-[21rem] bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-3 text-left">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-[21rem] flex flex-col gap-5 text-left"
      >
        <Input
          shell="tint"
          label="Correo electrónico"
          type="email"
          autoComplete="email"
          placeholder="ejemplo@email.com"
          error={errors.email?.message}
          {...register('email', { required: 'El correo es requerido' })}
        />
        <PasswordInput
          label="Contraseña"
          autoComplete="current-password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register('password', {
            required: 'La contraseña es requerida',
          })}
        />
        <Button
          type="submit"
          variant="default"
          size="lg"
          className="w-full font-semibold shadow-sm mt-1"
          disabled={isPending}
        >
          {isPending ? 'Iniciando sesión...' : 'Iniciar sesión'}
        </Button>
      </form>

      <p className="text-sm text-gray-600 text-center">
        ¿No tienes una cuenta?{' '}
        <Link
          href="/register"
          className="text-sky-500 hover:text-sky-700 font-semibold"
        >
          Registrarse
        </Link>
      </p>
    </div>
  );
}
