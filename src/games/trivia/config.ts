import type { DifficultyLevel } from '@/types';

interface LevelConfig {
  difficultyFilter: 1 | 2 | 3 | 4 | 5;
}

export const LEVEL_CONFIG: Record<DifficultyLevel, LevelConfig> = {
  1: { difficultyFilter: 1 },
  2: { difficultyFilter: 2 },
  3: { difficultyFilter: 3 },
  4: { difficultyFilter: 4 },
  5: { difficultyFilter: 5 },
};

export type QuizCategory =
  | 'history'
  | 'geography'
  | 'science'
  | 'art'
  | 'sport'
  | 'cinema'
  | 'music'
  | 'nature'
  | 'gastronomy'
  | 'technology'
  | 'mythology'
  | 'languages';

export const CATEGORY_LABELS: Record<QuizCategory, string> = {
  history: 'Histoire',
  geography: 'Géographie',
  science: 'Sciences',
  art: 'Art & Littérature',
  sport: 'Sport',
  cinema: 'Cinéma & Séries',
  music: 'Musique',
  nature: 'Nature & Animaux',
  gastronomy: 'Gastronomie',
  technology: 'Technologie',
  mythology: 'Mythologie',
  languages: 'Langues & Expressions',
};
