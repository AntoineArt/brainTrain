import type { DifficultyLevel } from '@/types';

interface LevelConfig {
  gridSize: number;
  colorDifference: boolean;
  shapeDifference: boolean;
  sizeDifference: boolean;
}

export const LEVEL_CONFIG: Record<DifficultyLevel, LevelConfig> = {
  1: { gridSize: 3, colorDifference: true, shapeDifference: false, sizeDifference: false },
  2: { gridSize: 4, colorDifference: true, shapeDifference: true, sizeDifference: false },
  3: { gridSize: 4, colorDifference: true, shapeDifference: true, sizeDifference: true },
  4: { gridSize: 5, colorDifference: true, shapeDifference: true, sizeDifference: true },
};

export const SHAPES = ['●', '■', '▲', '◆', '★', '⬟'];
export const COLORS = ['#3b82f6', '#ef4444', '#22c55e', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];
