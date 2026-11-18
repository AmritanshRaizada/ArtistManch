import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, type User } from 'firebase/auth';
import { auth } from '../lib/firebase';

const ADMIN_EMAIL = 'admin@artistmanch.com';

type AdminAuthValue = {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AdminAuthContext = createContext<AdminAuthValue | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => onAuthStateChanged(auth, current => {
    setUser(current);
    setLoading(false);
  }), []);

  const value = useMemo<AdminAuthValue>(() => ({
    user,
    loading,
    isAdmin: user?.email === ADMIN_EMAIL,
    login: async (email, password) => {
      const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
      if (credential.user.email !== ADMIN_EMAIL) {
        await signOut(auth);
        throw new Error('This account is not authorized to access the admin dashboard.');
      }
    },
    logout: () => signOut(auth),
  }), [user, loading]);

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) throw new Error('useAdminAuth must be used inside AdminAuthProvider');
  return context;
}
