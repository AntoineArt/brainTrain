import type { DifficultyLevel } from '@/types';

interface LevelConfig {
  wordDifficulty: 'easy' | 'medium' | 'hard' | 'expert' | 'master';
  maxLevenshtein: number; // typo tolerance
}

export const LEVEL_CONFIG: Record<DifficultyLevel, LevelConfig> = {
  1: { wordDifficulty: 'easy', maxLevenshtein: 2 },
  2: { wordDifficulty: 'medium', maxLevenshtein: 2 },
  3: { wordDifficulty: 'hard', maxLevenshtein: 2 },
  4: { wordDifficulty: 'expert', maxLevenshtein: 1 },
  5: { wordDifficulty: 'master', maxLevenshtein: 1 },
};
