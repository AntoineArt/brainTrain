'use client';

import { createContext, useContext, useEffect, type ReactNode } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { STORAGE_KEYS } from '@/lib/storage';
import type { AppSettings, ThemeMode } from '@/types';

const defaultSettings: AppSettings = {
  soundEnabled: true,
  defaultDifficulty: 1,
  theme: 'dark',
};

interface SettingsContextValue {
  settings: AppSettings;
  updateSettings: (updater: AppSettings | ((prev: AppSettings) => AppSettings)) => void;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: ThemeMode) => void;
}

const SettingsContext = createContext<SettingsContextValue>({
  settings: defaultSettings,
  updateSettings: () => {},
  resolvedTheme: 'dark',
  setTheme: () => {},
});

function getResolvedTheme(theme: ThemeMode): 'light' | 'dark' {
  if (theme === 'system') {
    if (typeof window === 'undefined') return 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return theme;
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useLocalStorage<AppSettings>(
    STORAGE_KEYS.SETTINGS,
    defaultSettings,
  );

  const resolvedTheme = getResolvedTheme(settings.theme ?? 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', resolvedTheme);
  }, [resolvedTheme]);

  useEffect(() => {
    if ((settings.theme ?? 'dark') !== 'system') return;

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      document.documentElement.setAttribute(
        'data-theme',
        mq.matches ? 'dark' : 'light',
      );
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [settings.theme]);

  const setTheme = (theme: ThemeMode) => {
    setSettings((prev) => ({ ...prev, theme }));
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings: setSettings, resolvedTheme, setTheme }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
