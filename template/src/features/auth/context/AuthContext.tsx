import { authApi, authClient } from '@/shared/api/clients/authClient';
import { useQueryClient } from '@tanstack/react-query';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  roles: string[];
  permissions: string[];
  status: 'active' | 'inactive' | 'pending';
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  register: (data: { name: string; email: string; password: string }) => Promise<void>;
  isLoading: boolean;
  error: string | null;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const login = useCallback(
    async (email: string, password: string, rememberMe = false) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await authApi.login({ email, password, rememberMe });
        const { token, tokens, user: userData } = response.data;

        const accessToken = token || tokens?.access?.token;
        const refreshTokenValue = tokens?.refresh?.token;

        if (!accessToken) {
          throw new Error('No token received from server');
        }

        authClient.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        localStorage.setItem('auth_token', accessToken);
        if (refreshTokenValue) {
          localStorage.setItem('refresh_token', refreshTokenValue);
        }
        localStorage.setItem('user_role', userData.role);
        localStorage.setItem('user_data', JSON.stringify(userData));

        setUser({
          id: userData.id,
          name: userData.name,
          email: userData.email,
          avatarUrl: userData.avatarUrl,
          roles: [userData.role],
          permissions: [],
          status: userData.status || 'active',
        });
      } catch (err: any) {
        setError(err.response?.data?.message || 'Login failed');
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const logout = useCallback(async () => {
    setIsLoading(true);

    try {
      await authClient.logout();
    } catch {
    } finally {
      delete authClient.defaults.headers.common['Authorization'];
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user_role');
      localStorage.removeItem('user_data');
      setUser(null);
      queryClient.clear();
      setIsLoading(false);
    }
  }, [queryClient]);

  const register = useCallback(
    async (data: { name: string; email: string; password: string }) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await authClient.register({
          email: data.email,
          password: data.password,
          username: data.name,
        });
        const { token, tokens, user: userData } = response.data;

        const accessToken = token || tokens?.access?.token;
        const refreshTokenValue = tokens?.refresh?.token;

        if (!accessToken) {
          throw new Error('No token received from server');
        }

        authClient.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        localStorage.setItem('auth_token', accessToken);
        if (refreshTokenValue) {
          localStorage.setItem('refresh_token', refreshTokenValue);
        }
        localStorage.setItem('user_role', userData.role);
        localStorage.setItem('user_data', JSON.stringify(userData));

        setUser({
          id: userData.id,
          name: userData.name,
          email: userData.email,
          avatarUrl: userData.avatarUrl,
          roles: [userData.role],
          permissions: [],
          status: userData.status || 'active',
        });
      } catch (err: any) {
        setError(err.response?.data?.message || 'Registration failed');
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const refreshTokenFn = useCallback(async () => {
    try {
      const refreshTokenValue = localStorage.getItem('refresh_token');
      if (!refreshTokenValue) {
        throw new Error('No refresh token available');
      }
      const response = await authClient.post('/refresh-tokens', {
        refresh_token: refreshTokenValue,
      });
      const { tokens } = response.data;
      const accessToken = tokens?.access?.token;

      if (!accessToken) {
        throw new Error('No access token in refresh response');
      }

      authClient.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      localStorage.setItem('auth_token', accessToken);
      return accessToken;
    } catch (err) {
      await logout();
      throw err;
    }
  }, [logout]);

  useEffect(() => {
    const storedUserData = localStorage.getItem('user_data');
    const storedToken = localStorage.getItem('auth_token');

    if (storedUserData && storedToken) {
      try {
        const userData = JSON.parse(storedUserData);
        authClient.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        setUser({
          id: userData.id,
          name: userData.name,
          email: userData.email,
          avatarUrl: userData.avatarUrl,
          roles: [userData.role],
          permissions: [],
          status: userData.status || 'active',
        });
      } catch (err) {
        console.error('Failed to restore user session:', err);
        localStorage.removeItem('user_data');
        localStorage.removeItem('auth_token');
      }
    }
    setIsLoading(false);
  }, []);

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    refreshToken: refreshTokenFn,
    register,
    isLoading,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
