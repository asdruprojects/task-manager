'use client';

import React from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { UserPayload } from '@task-manager/contracts';

interface AuthContextType {
  user: UserPayload | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: UserPayload) => void;
  logout: () => void;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const [user, setUser] = React.useState<UserPayload | null>(null);
  const [token, setToken] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const savedToken = localStorage.getItem('accessToken');
    const savedUser = localStorage.getItem('user');
    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
        void queryClient.invalidateQueries({ queryKey: ['tasks'] });
      } catch {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, [queryClient]);

  const login = React.useCallback(
    (newToken: string, newUser: UserPayload) => {
      localStorage.setItem('accessToken', newToken);
      localStorage.setItem('user', JSON.stringify(newUser));
      setToken(newToken);
      setUser(newUser);
      void queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    [queryClient],
  );

  const logout = React.useCallback(() => {
    queryClient.removeQueries({ queryKey: ['tasks'] });
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  }, [queryClient]);

  const value = React.useMemo(
    () => ({ user, token, isAuthenticated: !!token, isLoading, login, logout }),
    [user, token, isLoading, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
