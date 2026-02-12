import type { DifficultyLevel } from '@/types';

interface LevelConfig {
  gridSize: number;
  symbolCount: number; // how many different symbols
  targetCount: { min: number; max: number };
}

export const LEVEL_CONFIG: Record<DifficultyLevel, LevelConfig> = {
  1: { gridSize: 4, symbolCount: 3, targetCount: { min: 2, max: 5 } },
  2: { gridSize: 5, symbolCount: 4, targetCount: { min: 3, max: 7 } },
  3: { gridSize: 5, symbolCount: 5, targetCount: { min: 3, max: 8 } },
  4: { gridSize: 6, symbolCount: 6, targetCount: { min: 4, max: 10 } },
};

export const SYMBOLS = ['★', '●', '■', '▲', '◆', '♥', '♠', '♦', '♣', '✦'];
