import { create } from 'zustand';

type Theme = 'light' | 'dark';

interface ThemeState {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const getInitialTheme = (): Theme => {
  const saved = localStorage.getItem('nexusflow_theme') as Theme | null;
  if (saved === 'light' || saved === 'dark') {
    document.documentElement.setAttribute('data-theme', saved);
    return saved;
  }
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initial = prefersDark ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', initial);
  return initial;
};

export const useThemeStore = create<ThemeState>((set) => ({
  theme: getInitialTheme(),

  toggleTheme: () => {
    set((state) => {
      const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('nexusflow_theme', nextTheme);
      document.documentElement.setAttribute('data-theme', nextTheme);
      return { theme: nextTheme };
    });
  },

  setTheme: (theme: Theme) => {
    localStorage.setItem('nexusflow_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    set({ theme });
  },
}));
