export type Locale = 'fr' | 'en';

export type TranslationKeys = typeof import('./fr').default;

export type TranslationKey = keyof TranslationKeys;
