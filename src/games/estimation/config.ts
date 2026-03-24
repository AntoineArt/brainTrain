import type { DifficultyLevel } from '@/types';

export type StimulusType = 'dots' | 'percentage' | 'arithmetic';

interface LevelConfig {
  stimulusTypes: StimulusType[];
  displayTimeMs: number;
  /** Within this % of the true value → fully correct */
  correctThreshold: number;
  /** Within this % → "close" (correct but with time penalty) */
  closeThreshold: number;
  // Dot count ranges
  dotsMin: number;
  dotsMax: number;
  // Arithmetic expression ranges
  arithmeticMin: number;
  arithmeticMax: number;
}

export const LEVEL_CONFIG: Record<DifficultyLevel, LevelConfig> = {
  1: {
    stimulusTypes: ['dots'],
    displayTimeMs: 3000,
    correctThreshold: 15,
    closeThreshold: 25,
    dotsMin: 5,
    dotsMax: 20,
    arithmeticMin: 10,
    arithmeticMax: 100,
  },
  2: {
    stimulusTypes: ['dots', 'percentage'],
    displayTimeMs: 2500,
    correctThreshold: 15,
    closeThreshold: 25,
    dotsMin: 10,
    dotsMax: 40,
    arithmeticMin: 50,
    arithmeticMax: 500,
  },
  3: {
    stimulusTypes: ['dots', 'percentage', 'arithmetic'],
    displayTimeMs: 2000,
    correctThreshold: 15,
    closeThreshold: 25,
    dotsMin: 20,
    dotsMax: 80,
    arithmeticMin: 100,
    arithmeticMax: 500,
  },
  4: {
    stimulusTypes: ['dots', 'percentage', 'arithmetic'],
    displayTimeMs: 1500,
    correctThreshold: 10,
    closeThreshold: 20,
    dotsMin: 30,
    dotsMax: 120,
    arithmeticMin: 200,
    arithmeticMax: 1000,
  },
  5: {
    stimulusTypes: ['dots', 'percentage', 'arithmetic'],
    displayTimeMs: 1200,
    correctThreshold: 10,
    closeThreshold: 20,
    dotsMin: 50,
    dotsMax: 200,
    arithmeticMin: 500,
    arithmeticMax: 2000,
  },
};
