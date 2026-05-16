import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import { auth, invitations, ApiError } from '@/lib/api';
import type { User, InvitationData } from '@bespoke-vows/shared';

const ANON_DRAFT_KEY = 'bv:draft:anon';

interface AnonDraft {
  templateId: string;
  config: Partial<InvitationData>;
  updatedAt: string;
}

export function readAnonDraft(): AnonDraft | null {
  try {
    const raw = localStorage.getItem(ANON_DRAFT_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AnonDraft;
  } catch {
    return null;
  }
}

export function writeAnonDraft(draft: AnonDraft) {
  localStorage.setItem(ANON_DRAFT_KEY, JSON.stringify(draft));
}

export function clearAnonDraft() {
  localStorage.removeItem(ANON_DRAFT_KEY);
}

async function claimAnonDraft(): Promise<string | null> {
  const draft = readAnonDraft();
  if (!draft) return null;
  const intent = localStorage.getItem('bv:postLoginIntent');
  if (!intent) return null;
  try {
    const inv = await invitations.create({ templateId: draft.templateId, config: draft.config });
    clearAnonDraft();
    return inv.id;
  } catch {
    return null;
  }
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ claimedInvitationId: string | null }>;
  register: (email: string, password: string) => Promise<{ claimedInvitationId: string | null }>;
  logout: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const me = await auth.me();
      setUser(me);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const login = useCallback(async (email: string, password: string) => {
    const me = await auth.login({ email, password });
    setUser(me);
    const claimedInvitationId = await claimAnonDraft();
    return { claimedInvitationId };
  }, []);

  const register = useCallback(async (email: string, password: string) => {
    const me = await auth.register({ email, password });
    setUser(me);
    const claimedInvitationId = await claimAnonDraft();
    return { claimedInvitationId };
  }, []);

  const logout = useCallback(async () => {
    await auth.logout();
    setUser(null);
  }, []);

  const deleteAccount = useCallback(async () => {
    await auth.deleteAccount();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, deleteAccount, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
