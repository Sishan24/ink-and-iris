import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../api/client';
import { IUser } from '../types';

interface AuthContextType {
  user: IUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginDirect: (email: string, password: string) => Promise<boolean>;
  requestOtp: (email: string, password?: string) => Promise<{ success: boolean; devOtp?: string; message: string }>;
  verifyOtp: (email: string, otp: string) => Promise<boolean>;
  logout: () => void;
  setUser: React.Dispatch<React.SetStateAction<IUser | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('ink_iris_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('ink_iris_token');
      if (storedToken) {
        try {
          const res = await api.get('/auth/me');
          if (res.data?.success && res.data?.user) {
            setUser(res.data.user);
          } else {
            logout();
          }
        } catch {
          logout();
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const loginDirect = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data?.success && res.data?.token) {
        localStorage.setItem('ink_iris_token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        return true;
      }
      return false;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Login failed.');
    }
  };

  const requestOtp = async (email: string, password?: string) => {
    try {
      const res = await api.post('/auth/request-otp', { email, password });
      return {
        success: true,
        devOtp: res.data?.devOtp,
        message: res.data?.message || 'Verification code sent.'
      };
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to request code.');
    }
  };

  const verifyOtp = async (email: string, otp: string): Promise<boolean> => {
    try {
      const res = await api.post('/auth/verify-otp', { email, otp });
      if (res.data?.success && res.data?.token) {
        localStorage.setItem('ink_iris_token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        return true;
      }
      return false;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Invalid verification code.');
    }
  };

  const logout = () => {
    localStorage.removeItem('ink_iris_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(token && user),
        isLoading,
        loginDirect,
        requestOtp,
        verifyOtp,
        logout,
        setUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
