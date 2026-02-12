export type CognitiveSkill =
  | 'calcul'
  | 'memoire'
  | 'logique'
  | 'vitesse'
  | 'langage'
  | 'attention'
  | 'culture';

export type DifficultyLevel = 1 | 2 | 3 | 4;

export type GameStatus = 'idle' | 'instructions' | 'playing' | 'paused' | 'finished';

export interface GameConfig {
  id: string;
  name: string;
  description: string;
  icon: string;
  skills: CognitiveSkill[];
  defaultDuration: number; // secondes
  maxLevel: DifficultyLevel;
  color: string;
}

export interface GameState {
  status: GameStatus;
  score: number;
  correctAnswers: number;
  totalAnswers: number;
  currentStreak: number;
  bestStreak: number;
  difficulty: DifficultyLevel;
  timeRemaining: number;
  startedAt: number | null;
}

export interface GameResult {
  id: string;
  gameId: string;
  score: number;
  correctAnswers: number;
  totalAnswers: number;
  accuracy: number;
  averageResponseTime: number;
  bestStreak: number;
  difficulty: DifficultyLevel;
  duration: number;
  playedAt: string;
}

export interface GameComponentProps {
  difficulty: DifficultyLevel;
  onAnswer: (correct: boolean, responseTime: number) => void;
  onComplete: () => void;
  timeRemaining: number;
  isPaused: boolean;
}
