import type { DifficultyLevel } from '@/types';

interface LevelConfig {
  allowReflection: boolean;
  complexity: number; // 1-4, affects shape complexity
}

export const LEVEL_CONFIG: Record<DifficultyLevel, LevelConfig> = {
  1: { allowReflection: false, complexity: 1 },
  2: { allowReflection: false, complexity: 2 },
  3: { allowReflection: true, complexity: 2 },
  4: { allowReflection: true, complexity: 3 },
};
