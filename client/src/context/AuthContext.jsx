import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import api, { getErrorMessage } from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user')) || null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(false);

  // Persist auth state.
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [token, user]);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      setToken(data.token);
      setUser(data.user);
      return { ok: true, user: data.user };
    } catch (error) {
      return { ok: false, message: getErrorMessage(error, 'Login failed') };
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (username, email, password, name) => {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', { username, email, password, name });
      setToken(data.token);
      setUser(data.user);
      return { ok: true, user: data.user };
    } catch (error) {
      return { ok: false, message: getErrorMessage(error, 'Registration failed') };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
