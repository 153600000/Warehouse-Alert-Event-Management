import { create } from 'zustand';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department?: string;
  location?: string;
  tokenExpiry?: string;
  joined?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  validateSession: () => Promise<boolean>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: localStorage.getItem('warehouse_auth_token'),
  isAuthenticated: !!localStorage.getItem('warehouse_auth_token'),
  isLoading: false,
  error: null,

  login: async (username: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed. Invalid credentials.');
      }

      localStorage.setItem('warehouse_auth_token', data.token);
      set({
        user: data.user,
        token: data.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (err: any) {
      set({
        error: err.message || 'Unable to connect to authentication service',
        isLoading: false,
      });
      throw err;
    }
  },

  logout: async () => {
    const token = get().token;
    try {
      if (token) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    } catch (e) {
      console.warn('Logout network call skipped/errored:', e);
    } finally {
      localStorage.removeItem('warehouse_auth_token');
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        error: null,
      });
    }
  },

  validateSession: async () => {
    const token = localStorage.getItem('warehouse_auth_token');
    if (!token) {
      set({ isAuthenticated: false, user: null, token: null });
      return false;
    }

    try {
      const response = await fetch('/api/auth/validate', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error('Token expired or invalidated');
      }

      const data = await response.json();
      set({
        user: data.user,
        token,
        isAuthenticated: true,
      });
      return true;
    } catch (err) {
      localStorage.removeItem('warehouse_auth_token');
      set({
        user: null,
        token: null,
        isAuthenticated: false,
      });
      return false;
    }
  },

  clearError: () => set({ error: null }),
}));
