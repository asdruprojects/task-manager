'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/auth-context';
import { Avatar } from '@repo/ui/components';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-900 truncate">
            Bienvenido, {user.name} {user.lastName}
          </h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                logout();
                router.replace('/login');
              }}
              className="text-sm text-gray-500 hover:text-gray-700 cursor-pointer hidden sm:block"
            >
              Cerrar sesión
            </button>
            <Avatar name={user.name} lastName={user.lastName} size="sm" />
          </div>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">{children}</main>
    </div>
  );
}
