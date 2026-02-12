'use client';

import { createContext, useContext, type ReactNode } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { STORAGE_KEYS } from '@/lib/storage';
import type { AppSettings } from '@/types';

const defaultSettings: AppSettings = {
  soundEnabled: true,
  defaultDifficulty: 1,
};

interface SettingsContextValue {
  settings: AppSettings;
  updateSettings: (updater: AppSettings | ((prev: AppSettings) => AppSettings)) => void;
}

const SettingsContext = createContext<SettingsContextValue>({
  settings: defaultSettings,
  updateSettings: () => {},
});

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useLocalStorage<AppSettings>(
    STORAGE_KEYS.SETTINGS,
    defaultSettings,
  );

  return (
    <SettingsContext.Provider value={{ settings, updateSettings: setSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
