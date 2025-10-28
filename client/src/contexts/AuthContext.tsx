import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { trpc } from '@/lib/trpc';
import { useLocation } from 'wouter';
import { toast } from 'sonner';

// ========================================
// TIPOS
// ========================================

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'dentista' | 'recepcionista' | 'user';
  dentistaId?: string;
  status?: string;
  emailVerified?: boolean;
  lastLogin?: Date;
  permissions?: Array<{
    module: string;
    action: string;
  }>;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasPermission: (module: string, action: string) => boolean;
  isAdmin: boolean;
  isDentista: boolean;
  isRecepcionista: boolean;
}

// ========================================
// CONTEXTO
// ========================================

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ========================================
// PROVIDER
// ========================================

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [, setLocation] = useLocation();

  // Carregar token e usuário do localStorage ao iniciar
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Erro ao parsear usuário:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      }
    }

    setIsLoading(false);
  }, []);

  // Verificar sessão periodicamente
  const { data: sessionData, isLoading: isVerifying } = trpc.auth.verifySession.useQuery(
    { token: token || '' },
    {
      enabled: !!token,
      refetchInterval: 5 * 60 * 1000, // Verificar a cada 5 minutos
      retry: false,
      onError: () => {
        // Sessão inválida - fazer logout
        logout();
      },
    }
  );

  // Atualizar usuário quando sessão for verificada
  useEffect(() => {
    if (sessionData?.success && sessionData.data) {
      setUser(sessionData.data);
      localStorage.setItem('user', JSON.stringify(sessionData.data));
    }
  }, [sessionData]);

  // Mutation de login
  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: (data) => {
      const authToken = data.data.token;
      const userData = data.data.user;

      setToken(authToken);
      setUser(userData);

      localStorage.setItem('authToken', authToken);
      localStorage.setItem('user', JSON.stringify(userData));

      toast.success('Login realizado com sucesso!');
      setLocation('/');
    },
    onError: (error) => {
      toast.error(error.message || 'Erro ao fazer login');
      throw error;
    },
  });

  // Mutation de logout
  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => {
      setUser(null);
      setToken(null);
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      toast.success('Logout realizado com sucesso');
      setLocation('/login');
    },
    onError: () => {
      // Mesmo com erro, fazer logout local
      setUser(null);
      setToken(null);
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      setLocation('/login');
    },
  });

  // Função de login
  const login = async (email: string, password: string) => {
    await loginMutation.mutateAsync({ email, password });
  };

  // Função de logout
  const logout = () => {
    if (token) {
      logoutMutation.mutate({ token });
    } else {
      setUser(null);
      setToken(null);
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      setLocation('/login');
    }
  };

  // Verificar permissão
  const hasPermission = (module: string, action: string): boolean => {
    if (!user) return false;

    // Admin tem acesso total
    if (user.role === 'admin') return true;

    // Verificar permissões específicas
    if (user.permissions) {
      return user.permissions.some(
        (p) => p.module === module && p.action === action
      );
    }

    return false;
  };

  // Helpers de role
  const isAdmin = user?.role === 'admin';
  const isDentista = user?.role === 'dentista';
  const isRecepcionista = user?.role === 'recepcionista';

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!user && !!token,
    isLoading: isLoading || isVerifying,
    login,
    logout,
    hasPermission,
    isAdmin,
    isDentista,
    isRecepcionista,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ========================================
// HOOK
// ========================================

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}

// ========================================
// COMPONENTE DE PROTEÇÃO DE ROTA
// ========================================

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'admin' | 'dentista' | 'recepcionista';
  requiredPermission?: {
    module: string;
    action: string;
  };
}

export function ProtectedRoute({
  children,
  requiredRole,
  requiredPermission,
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user, hasPermission } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setLocation('/login');
    }
  }, [isAuthenticated, isLoading, setLocation]);

  // Verificar role
  if (requiredRole && user?.role !== requiredRole && user?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">
            Acesso Negado
          </h1>
          <p className="text-gray-600">
            Você não tem permissão para acessar esta página.
          </p>
        </div>
      </div>
    );
  }

  // Verificar permissão específica
  if (
    requiredPermission &&
    !hasPermission(requiredPermission.module, requiredPermission.action)
  ) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">
            Acesso Negado
          </h1>
          <p className="text-gray-600">
            Você não tem permissão para acessar esta funcionalidade.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
