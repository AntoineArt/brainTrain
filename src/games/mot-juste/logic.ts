import type { DifficultyLevel } from '@/types';
import { shuffle } from '@/lib/utils';
import { WORD_QUESTIONS, type WordQuestion } from './words';
import { LEVEL_CONFIG } from './config';

export interface ShuffledQuestion extends Omit<WordQuestion, 'options' | 'correctIndex'> {
  options: [string, string, string, string];
  correctIndex: number;
}

function shuffleOptions(q: WordQuestion): ShuffledQuestion {
  const indices = shuffle([0, 1, 2, 3]);
  const options = indices.map((i) => q.options[i]) as [string, string, string, string];
  const correctIndex = indices.indexOf(q.correctIndex);
  return { ...q, options, correctIndex };
}

export function getQuestion(difficulty: DifficultyLevel, usedIds: Set<string>): ShuffledQuestion | null {
  const config = LEVEL_CONFIG[difficulty];
  const pool = WORD_QUESTIONS.filter(
    (q) => q.difficulty === config.wordDifficulty && !usedIds.has(q.word),
  );

  if (pool.length === 0) {
    // Fallback: any difficulty, not yet used
    const fallback = WORD_QUESTIONS.filter((q) => !usedIds.has(q.word));
    if (fallback.length === 0) return null;
    return shuffleOptions(shuffle(fallback)[0]);
  }

  return shuffleOptions(shuffle(pool)[0]);
}
