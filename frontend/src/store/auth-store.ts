import { create } from 'zustand';
import { User } from '@/types';
import { loginUser, logoutUser, fetchCurrentUser, refreshSession } from '@/lib/auth';
import { setAccessToken } from '@/lib/api';

interface AuthStore {
  user: User | null;
  permissions: string[];
  isAuthenticated: boolean;
  isLoading: boolean;

  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
  hasPermission: (atom: string) => boolean;
  hasAnyPermission: (atoms: string[]) => boolean;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  permissions: [],
  isAuthenticated: false,
  isLoading: true,

  login: async (email: string, password: string) => {
    const { user } = await loginUser(email, password);
    set({
      user,
      permissions: user.permissions || [],
      isAuthenticated: true,
      isLoading: false,
    });
  },

  logout: async () => {
    await logoutUser();
    set({
      user: null,
      permissions: [],
      isAuthenticated: false,
      isLoading: false,
    });
  },

  initialize: async () => {
    try {
      const { user } = await refreshSession();
      set({
        user,
        permissions: user.permissions || [],
        isAuthenticated: true,
        isLoading: false,
      });
    } catch {
      set({
        user: null,
        permissions: [],
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  hasPermission: (atom: string) => {
    return get().permissions.includes(atom);
  },

  hasAnyPermission: (atoms: string[]) => {
    return atoms.some((a) => get().permissions.includes(a));
  },
}));