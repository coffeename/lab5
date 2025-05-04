import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

interface AuthContextType {
  token: string | null;
  role: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Замість localStorage.getItem('token') — завжди починаємо з null
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole]   = useState<string | null>(null);

  // Ставимо axios-заголовок і ролі щоразу, коли token змінюється
  useEffect(() => {
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        setRole(decoded.role);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } catch {
        setRole(null);
      }
    } else {
      // якщо токена нема — знімаємо заголовок і роль
      delete axios.defaults.headers.common['Authorization'];
      setRole(null);
    }
  }, [token]);

  const login = async (email: string, password: string) => {
    const response = await axios.post('/auth/login', { email, password });
    setToken(response.data.access_token);
  };

  const register = async (name: string, email: string, password: string) => {
    await axios.post('/users/register', { name, email, password });
  };

  const logout = () => {
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{ token, role, login, register, logout, isAuthenticated: !!token }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};