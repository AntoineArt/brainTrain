import type { DifficultyLevel } from '@/types';

export type Operator = '+' | '-' | '×' | '÷';

interface LevelConfig {
  operators: Operator[];
  minA: number;
  maxA: number;
  minB: number;
  maxB: number;
}

export const LEVEL_CONFIG: Record<DifficultyLevel, LevelConfig> = {
  1: {
    operators: ['+', '-'],
    minA: 1,
    maxA: 20,
    minB: 1,
    maxB: 10,
  },
  2: {
    operators: ['+', '-', '×'],
    minA: 10,
    maxA: 99,
    minB: 2,
    maxB: 20,
  },
  3: {
    operators: ['+', '-', '×', '÷'],
    minA: 10,
    maxA: 200,
    minB: 2,
    maxB: 50,
  },
  4: {
    operators: ['+', '-', '×', '÷'],
    minA: 50,
    maxA: 999,
    minB: 5,
    maxB: 99,
  },
};
