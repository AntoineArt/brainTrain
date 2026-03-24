'use client';

import { useCallback } from 'react';
import { useLocale } from '@/components/providers/LocaleProvider';
import { translate, type TranslationKey } from '@/locales';

export function useTranslation() {
  const { locale, setLocale } = useLocale();

  const t = useCallback(
    (key: TranslationKey, params?: Record<string, string | number>) =>
      translate(locale, key, params),
    [locale],
  );

  return { t, locale, setLocale };
}
