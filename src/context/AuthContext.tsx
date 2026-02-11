import React, { createContext, useState, useContext, ReactNode } from 'react';
import { AuthState } from '../types/AuthState';

interface AuthContextType {
  authState: AuthState;
  login: (token: string, userName: string, usuarioId: string, isAuthenticated: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>(() => {
    const token = localStorage.getItem('token');
    const userName = localStorage.getItem('userName');
    const remember = localStorage.getItem('remember');
    const usuarioId = localStorage.getItem('usuarioId');
    const isAuthenticated = localStorage.getItem('isAuthenticated');

    return { token, userName, usuarioId, remember, isAuthenticated };
  });

  const login = (token: string, userName: string, usuarioId: string, isAuthenticated: string) => {
    const remember = localStorage.getItem('remember');

    localStorage.setItem('token', token);
    localStorage.setItem('userName', userName);
    localStorage.setItem('usuarioId', usuarioId);
    localStorage.setItem('isAuthenticated', isAuthenticated);
    
    setAuthState({ token, userName, usuarioId, remember, isAuthenticated });
  };

  const logout = () => {
    localStorage.clear();
    setAuthState({ 
      token: null, 
      userName: null, 
      usuarioId: null, 
      remember: null, 
      isAuthenticated: null 
    });
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};