import type { DifficultyLevel } from '@/types';

interface LevelConfig {
  difficultyFilter: 1 | 2 | 3 | 4;
}

export const LEVEL_CONFIG: Record<DifficultyLevel, LevelConfig> = {
  1: { difficultyFilter: 1 },
  2: { difficultyFilter: 2 },
  3: { difficultyFilter: 3 },
  4: { difficultyFilter: 4 },
};

export type QuizCategory =
  | 'histoire'
  | 'geographie'
  | 'sciences'
  | 'art'
  | 'sport'
  | 'cinema'
  | 'musique'
  | 'nature'
  | 'gastronomie'
  | 'technologie'
  | 'mythologie'
  | 'langues';

export const CATEGORY_LABELS: Record<QuizCategory, string> = {
  histoire: 'Histoire',
  geographie: 'Géographie',
  sciences: 'Sciences',
  art: 'Art & Littérature',
  sport: 'Sport',
  cinema: 'Cinéma & Séries',
  musique: 'Musique',
  nature: 'Nature & Animaux',
  gastronomie: 'Gastronomie',
  technologie: 'Technologie',
  mythologie: 'Mythologie',
  langues: 'Langues & Expressions',
};
