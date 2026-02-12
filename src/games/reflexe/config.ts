import type { DifficultyLevel } from '@/types';

interface LevelConfig {
  minDelay: number;    // ms avant apparition
  maxDelay: number;
  hasNoGo: boolean;    // stimuli pièges (ne pas toucher)
  noGoRatio: number;   // % de no-go
  rounds: number;
}

export const LEVEL_CONFIG: Record<DifficultyLevel, LevelConfig> = {
  1: { minDelay: 1000, maxDelay: 3000, hasNoGo: false, noGoRatio: 0, rounds: 10 },
  2: { minDelay: 800, maxDelay: 2500, hasNoGo: true, noGoRatio: 0.2, rounds: 12 },
  3: { minDelay: 600, maxDelay: 2000, hasNoGo: true, noGoRatio: 0.3, rounds: 15 },
  4: { minDelay: 400, maxDelay: 1800, hasNoGo: true, noGoRatio: 0.35, rounds: 18 },
};
