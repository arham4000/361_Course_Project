import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const AuthContext = createContext(null);

const TOKEN_KEY = 'jobmatch_token';
const ROLE_KEY = 'jobmatch_role';
const USER_ID_KEY = 'jobmatch_userId';

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [role, setRoleState] = useState(() => localStorage.getItem(ROLE_KEY));
  const [userId, setUserIdState] = useState(() => localStorage.getItem(USER_ID_KEY));

  const setAuth = useCallback((newToken, newRole, newUserId) => {
    if (newToken) {
      localStorage.setItem(TOKEN_KEY, newToken);
      localStorage.setItem(ROLE_KEY, newRole || '');
      localStorage.setItem(USER_ID_KEY, newUserId || '');
    } else {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(ROLE_KEY);
      localStorage.removeItem(USER_ID_KEY);
    }
    setTokenState(newToken || null);
    setRoleState(newRole || null);
    setUserIdState(newUserId || null);
  }, []);

  const logout = useCallback(() => {
    setAuth(null);
  }, [setAuth]);

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ token, role, userId, setAuth, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}
