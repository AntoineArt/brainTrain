import type { DifficultyLevel } from '@/types';

export type Operator = '+' | '-' | '×' | '÷';

interface LevelConfig {
  operators: Operator[];
  minA: number;
  maxA: number;
  minB: number;
  maxB: number;
  // Per-operator caps to keep results reasonable for mental math
  maxMultA: number;   // cap for first operand in multiplication
  maxMultB: number;   // cap for second operand in multiplication
  maxDivB: number;    // cap for divisor in division
  maxDivAnswer: number; // cap for quotient in division
}

export const LEVEL_CONFIG: Record<DifficultyLevel, LevelConfig> = {
  1: {
    operators: ['+', '-'],
    minA: 1, maxA: 20, minB: 1, maxB: 10,
    maxMultA: 10, maxMultB: 5, maxDivB: 5, maxDivAnswer: 10,
  },
  2: {
    operators: ['+', '-', '×'],
    minA: 10, maxA: 50, minB: 2, maxB: 15,
    maxMultA: 12, maxMultB: 10, maxDivB: 9, maxDivAnswer: 12,
  },
  3: {
    operators: ['+', '-', '×', '÷'],
    minA: 10, maxA: 200, minB: 2, maxB: 30,
    maxMultA: 20, maxMultB: 15, maxDivB: 12, maxDivAnswer: 20,
  },
  4: {
    operators: ['+', '-', '×', '÷'],
    minA: 50, maxA: 500, minB: 5, maxB: 50,
    maxMultA: 30, maxMultB: 20, maxDivB: 15, maxDivAnswer: 30,
  },
  5: {
    operators: ['+', '-', '×', '÷'],
    minA: 100, maxA: 999, minB: 10, maxB: 99,
    maxMultA: 50, maxMultB: 30, maxDivB: 20, maxDivAnswer: 50,
  },
};
