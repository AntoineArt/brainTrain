import type { CognitiveSkill, DifficultyLevel, GameResult } from './game';

export interface PlayerProfile {
  name: string;
  createdAt: string;
  lastPlayedAt: string;
}

export interface PlayerStats {
  totalGamesPlayed: number;
  totalScore: number;
  currentStreak: number;
  bestStreak: number;
  lastPlayedDate: string;
  skillScores: Record<CognitiveSkill, number>;
  gameProgress: Record<string, GameProgress>;
}

export interface GameProgress {
  gamesPlayed: number;
  bestScore: number;
  averageScore: number;
  currentLevel: DifficultyLevel;
  unlockedLevel: DifficultyLevel;
  recentResults: GameResult[];
}

export type ThemeMode = 'light' | 'dark' | 'system';

export interface AppSettings {
  soundEnabled: boolean;
  defaultDifficulty: DifficultyLevel;
  theme: ThemeMode;
}
