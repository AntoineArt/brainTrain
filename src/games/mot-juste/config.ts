import type { DifficultyLevel } from '@/types';

interface LevelConfig {
  wordDifficulty: 'easy' | 'medium' | 'hard' | 'expert';
}

export const LEVEL_CONFIG: Record<DifficultyLevel, LevelConfig> = {
  1: { wordDifficulty: 'easy' },
  2: { wordDifficulty: 'medium' },
  3: { wordDifficulty: 'hard' },
  4: { wordDifficulty: 'expert' },
};
