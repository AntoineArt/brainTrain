import type { DifficultyLevel } from '@/types';
import { shuffle } from '@/lib/utils';
import { WORD_QUESTIONS, type WordQuestion } from './words';
import { LEVEL_CONFIG } from './config';

export function getQuestion(difficulty: DifficultyLevel, usedIds: Set<string>): WordQuestion | null {
  const config = LEVEL_CONFIG[difficulty];
  const pool = WORD_QUESTIONS.filter(
    (q) => q.difficulty === config.wordDifficulty && !usedIds.has(q.word),
  );

  if (pool.length === 0) {
    // Fallback: any difficulty, not yet used
    const fallback = WORD_QUESTIONS.filter((q) => !usedIds.has(q.word));
    if (fallback.length === 0) return null;
    return shuffle(fallback)[0];
  }

  return shuffle(pool)[0];
}
