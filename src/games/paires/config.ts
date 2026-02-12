import type { DifficultyLevel } from '@/types';

interface LevelConfig {
  pairs: number;
  cols: number;
  peekTimeMs: number;
}

export const LEVEL_CONFIG: Record<DifficultyLevel, LevelConfig> = {
  1: { pairs: 4, cols: 3, peekTimeMs: 1500 },
  2: { pairs: 6, cols: 4, peekTimeMs: 1200 },
  3: { pairs: 8, cols: 4, peekTimeMs: 1000 },
  4: { pairs: 10, cols: 5, peekTimeMs: 800 },
};

export const CARD_EMOJIS = [
  '🐶', '🐱', '🐻', '🦊', '🐼', '🐨', '🐯', '🦁',
  '🐸', '🐵', '🐧', '🐙', '🦋', '🌻', '🍎', '🎸',
];
