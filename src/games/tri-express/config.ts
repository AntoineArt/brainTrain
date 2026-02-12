import type { DifficultyLevel } from '@/types';

interface LevelConfig {
  itemCount: number;
  type: 'numbers' | 'mixed';
  allowReverse: boolean;
}

export const LEVEL_CONFIG: Record<DifficultyLevel, LevelConfig> = {
  1: { itemCount: 4, type: 'numbers', allowReverse: false },
  2: { itemCount: 5, type: 'numbers', allowReverse: false },
  3: { itemCount: 6, type: 'numbers', allowReverse: true },
  4: { itemCount: 7, type: 'mixed', allowReverse: true },
};
