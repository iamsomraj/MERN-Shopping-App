import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'light' | 'dark' | 'system';

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const media = window.matchMedia('(prefers-color-scheme: dark)');

export const resolveTheme = (theme: Theme): 'light' | 'dark' =>
  theme === 'system' ? (media.matches ? 'dark' : 'light') : theme;

const applyTheme = (theme: Theme) => {
  document.documentElement.classList.toggle('dark', resolveTheme(theme) === 'dark');
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'system',
      setTheme: (theme) => {
        applyTheme(theme);
        set({ theme });
      },
    }),
    { name: 'eshop:theme', onRehydrateStorage: () => (state) => applyTheme(state?.theme ?? 'system') }
  )
);

media.addEventListener('change', () => applyTheme(useThemeStore.getState().theme));
