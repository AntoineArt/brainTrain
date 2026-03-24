'use client';

import { createContext, useContext, type ReactNode } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import type { Locale } from '@/locales';

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: 'fr',
  setLocale: () => {},
});

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useLocalStorage<Locale>('bt_locale', 'fr');

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  return useContext(LocaleContext);
}
