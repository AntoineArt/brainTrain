import type { DifficultyLevel } from '@/types';

interface LevelConfig {
  sequenceLength: number;
  maxStep: number;
  doubleOperation: boolean;
}

export const LEVEL_CONFIG: Record<DifficultyLevel, LevelConfig> = {
  1: { sequenceLength: 4, maxStep: 5, doubleOperation: false },
  2: { sequenceLength: 5, maxStep: 10, doubleOperation: false },
  3: { sequenceLength: 5, maxStep: 15, doubleOperation: true },
  4: { sequenceLength: 6, maxStep: 20, doubleOperation: true },
};
