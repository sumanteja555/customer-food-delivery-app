import { createContext, type ReactNode, useCallback, useContext, useMemo, useState } from 'react';

type User = { name: string; email: string };

type AuthContextValue = {
  user: User | null;
  login: (email: string) => void;
  signup: (name: string, email: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const login = useCallback((email: string) => {
    const name = email.split('@')[0].replace(/[._-]+/g, ' ');
    setUser({ name: name || 'Food lover', email });
  }, []);
  const signup = useCallback((name: string, email: string) => setUser({ name, email }), []);
  const logout = useCallback(() => setUser(null), []);
  const value = useMemo(() => ({ user, login, signup, logout }), [login, logout, signup, user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
