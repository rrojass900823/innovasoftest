import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [authState, setAuthState] = useState(() => {
    const token = localStorage.getItem('token');
    const userName = localStorage.getItem('userName');
    const remember = localStorage.getItem('remember');
    const usuarioId = localStorage.getItem('usuarioId');
    const isAuthenticated = localStorage.getItem('isAuthenticated');

    return { token, userName, usuarioId, remember, isAuthenticated };
  });

  const login = (token, userName, usuarioId, isAuthenticated) => {
    const remember = localStorage.getItem('remember');

    localStorage.setItem('token', token);
    localStorage.setItem('userName', userName);
    localStorage.setItem('usuarioId', usuarioId);
    localStorage.setItem('isAuthenticated', isAuthenticated);
    setAuthState({ token, userName, usuarioId, remember, isAuthenticated });
  };

  const logout = () => {
    localStorage.clear();
    setAuthState({ token: null, userName: null, usuarioId: null, remember: null, isAuthenticated: null });
  }

  return (
    <AuthContext.Provider value={{ authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);