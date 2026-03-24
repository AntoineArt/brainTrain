'use client';

import { useTranslation } from '@/hooks/useTranslation';

export function LocaleToggle() {
  const { t, locale, setLocale } = useTranslation();

  return (
    <button
      onClick={() => setLocale(locale === 'fr' ? 'en' : 'fr')}
      className="w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold
        bg-surface-light border border-border/50 text-muted
        hover:text-foreground hover:border-border transition-all duration-150
        touch-manipulation cursor-pointer active:scale-95"
      aria-label={t('locale.switchTo')}
      title={t('locale.switchTo')}
    >
      {locale === 'fr' ? 'EN' : 'FR'}
    </button>
  );
}
