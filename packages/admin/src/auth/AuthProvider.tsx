import { createContext, useContext, useState, type ReactNode } from 'react';
import { DEMO_USER } from '../data/demoData';
import type { AppUser } from '@rco/shared';

// Minimal mock User to satisfy components that check user.uid etc.
interface MockUser {
  uid: string;
  email: string;
  displayName: string;
}

interface AuthContextType {
  user: MockUser | null;
  appUser: AppUser | null;
  loading: boolean;
  error: string | null;
  signIn: () => Promise<void>;
  logOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const MOCK_USER: MockUser = {
  uid: 'demo',
  email: 'admin@rowecasaorganics.com',
  displayName: 'Demo Admin',
};

export function AuthProvider({ children }: { children: ReactNode }) {
  // Demo mode: always signed in
  const [user] = useState<MockUser | null>(MOCK_USER);
  const [appUser] = useState<AppUser | null>(DEMO_USER);
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);

  const signIn = async () => {
    console.log('[Demo] Sign-in is a no-op in demo mode');
  };

  const logOut = async () => {
    console.log('[Demo] Sign-out is a no-op in demo mode');
  };

  return (
    <AuthContext.Provider value={{ user, appUser, loading, error, signIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
