import type { DifficultyLevel } from '@/types';

interface LevelConfig {
  gridSize: number;
  initialLength: number;
  showDurationMs: number;
}

export const LEVEL_CONFIG: Record<DifficultyLevel, LevelConfig> = {
  1: { gridSize: 3, initialLength: 3, showDurationMs: 900 },
  2: { gridSize: 3, initialLength: 4, showDurationMs: 750 },
  3: { gridSize: 4, initialLength: 5, showDurationMs: 600 },
  4: { gridSize: 4, initialLength: 6, showDurationMs: 500 },
  5: { gridSize: 5, initialLength: 7, showDurationMs: 400 },
};
