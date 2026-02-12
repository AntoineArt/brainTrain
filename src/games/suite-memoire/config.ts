import type { DifficultyLevel } from '@/types';

interface LevelConfig {
  gridSize: number;
  initialLength: number;
  showDurationMs: number;
}

export const LEVEL_CONFIG: Record<DifficultyLevel, LevelConfig> = {
  1: { gridSize: 3, initialLength: 3, showDurationMs: 800 },
  2: { gridSize: 4, initialLength: 4, showDurationMs: 700 },
  3: { gridSize: 4, initialLength: 5, showDurationMs: 600 },
  4: { gridSize: 5, initialLength: 6, showDurationMs: 500 },
};
