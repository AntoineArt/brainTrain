'use client';

import { useLocale } from '@/components/providers/LocaleProvider';

export function LocaleToggle() {
  const { locale, setLocale } = useLocale();

  return (
    <button
      onClick={() => setLocale(locale === 'fr' ? 'en' : 'fr')}
      className="w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold
        bg-surface-light border border-border/50 text-muted
        hover:text-foreground hover:border-border transition-all duration-150
        touch-manipulation cursor-pointer active:scale-95"
      aria-label={locale === 'fr' ? 'Switch to English' : 'Passer en français'}
      title={locale === 'fr' ? 'Switch to English' : 'Passer en français'}
    >
      {locale === 'fr' ? 'EN' : 'FR'}
    </button>
  );
}
