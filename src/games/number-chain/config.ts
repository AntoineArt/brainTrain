import type { DifficultyLevel } from '@/types';

export type ChainOperator = '+' | '−' | '×' | '÷';

interface LevelConfig {
  startMin: number;
  startMax: number;
  opCount: number;
  operators: ChainOperator[];
  displayTimeMs: number;
  /** Max factor for multiplication (inclusive) */
  maxMultFactor: number;
  /** Max divisor for division (inclusive) */
  maxDivisor: number;
  /** Max addend / subtrahend */
  maxAddend: number;
}

export const LEVEL_CONFIG: Record<DifficultyLevel, LevelConfig> = {
  1: {
    startMin: 1,
    startMax: 10,
    opCount: 2,
    operators: ['+', '−'],
    displayTimeMs: 2500,
    maxMultFactor: 3,
    maxDivisor: 3,
    maxAddend: 9,
  },
  2: {
    startMin: 5,
    startMax: 20,
    opCount: 3,
    operators: ['+', '−', '×'],
    displayTimeMs: 2000,
    maxMultFactor: 3,
    maxDivisor: 3,
    maxAddend: 12,
  },
  3: {
    startMin: 10,
    startMax: 50,
    opCount: 3,
    operators: ['+', '−', '×'],
    displayTimeMs: 1500,
    maxMultFactor: 4,
    maxDivisor: 4,
    maxAddend: 20,
  },
  4: {
    startMin: 10,
    startMax: 100,
    opCount: 4,
    operators: ['+', '−', '×', '÷'],
    displayTimeMs: 1200,
    maxMultFactor: 5,
    maxDivisor: 5,
    maxAddend: 30,
  },
  5: {
    startMin: 20,
    startMax: 100,
    opCount: 5,
    operators: ['+', '−', '×', '÷'],
    displayTimeMs: 1000,
    maxMultFactor: 5,
    maxDivisor: 5,
    maxAddend: 40,
  },
};
