import type { DifficultyLevel } from '@/types';
import { shuffle } from '@/lib/utils';
import { QUESTIONS, type QuizQuestion } from './questions';
import { LEVEL_CONFIG, type QuizCategory } from './config';

export function getQuestion(
  difficulty: DifficultyLevel,
  usedIds: Set<string>,
  categoryFilter?: QuizCategory,
): QuizQuestion | null {
  const config = LEVEL_CONFIG[difficulty];

  let pool = QUESTIONS.filter(
    (q) => q.difficulty === config.difficultyFilter && !usedIds.has(q.id),
  );

  if (categoryFilter) {
    pool = pool.filter((q) => q.category === categoryFilter);
  }

  if (pool.length === 0) {
    // Fallback: any difficulty not yet used
    pool = QUESTIONS.filter((q) => !usedIds.has(q.id));
    if (categoryFilter) {
      pool = pool.filter((q) => q.category === categoryFilter);
    }
  }

  if (pool.length === 0) return null;

  return shuffle(pool)[0];
}
