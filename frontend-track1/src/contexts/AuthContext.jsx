import React, { createContext, useContext, useEffect, useState } from 'react';
import * as authService from '../services/authService';
import { TOKEN_KEY, AUTH_LOGOUT_EVENT } from '../services/api';
import { isTokenExpired } from '../utils/jwt';

const AuthContext = createContext(null);

const readStoredToken = () => {
  const stored = localStorage.getItem(TOKEN_KEY);
  if (stored && isTokenExpired(stored)) {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem('trackurtask_email');
    return null;
  }
  return stored;
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(readStoredToken);
  const [email, setEmail] = useState(() => (token ? localStorage.getItem('trackurtask_email') : null));

  useEffect(() => {
    const handleForcedLogout = () => {
      setToken(null);
      setEmail(null);
      localStorage.removeItem('trackurtask_email');
    };
    window.addEventListener(AUTH_LOGOUT_EVENT, handleForcedLogout);
    return () => window.removeEventListener(AUTH_LOGOUT_EVENT, handleForcedLogout);
  }, []);

  const login = async (loginEmail, password) => {
    const data = await authService.login(loginEmail, password);
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem('trackurtask_email', loginEmail);
    setToken(data.token);
    setEmail(loginEmail);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem('trackurtask_email');
    setToken(null);
    setEmail(null);
  };

  const value = {
    isAuthenticated: !!token && !isTokenExpired(token),
    email,
    login,
    logout,
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
