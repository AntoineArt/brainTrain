import fr from './fr';
import en from './en';

export type Locale = 'fr' | 'en';

export type TranslationKey = keyof typeof fr;

const translations: Record<Locale, Record<TranslationKey, string>> = { fr, en };

/**
 * Get a translated string with optional interpolation.
 * Placeholders use {key} syntax: t('chain.totalScore', { score: '1200' })
 */
export function translate(
  locale: Locale,
  key: TranslationKey,
  params?: Record<string, string | number>,
): string {
  let text = translations[locale]?.[key] ?? translations.fr[key] ?? key;

  if (params) {
    for (const [k, v] of Object.entries(params)) {
      text = text.replace(`{${k}}`, String(v));
    }
  }

  return text;
}

export { fr, en };
