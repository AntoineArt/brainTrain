import type { DifficultyLevel } from '@/types';
import { shuffle } from '@/lib/utils';
import { QUESTIONS, type QuizQuestion } from './questions';
import { LEVEL_CONFIG, type QuizCategory } from './config';

export interface ShuffledQuizQuestion extends Omit<QuizQuestion, 'choices' | 'correctIndex'> {
  choices: [string, string, string, string];
  correctIndex: number;
}

function shuffleChoices(q: QuizQuestion): ShuffledQuizQuestion {
  const indices = shuffle([0, 1, 2, 3]);
  const choices = indices.map((i) => q.choices[i]) as [string, string, string, string];
  const correctIndex = indices.indexOf(q.correctIndex);
  return { ...q, choices, correctIndex };
}

export function getQuestion(
  difficulty: DifficultyLevel,
  usedIds: Set<string>,
  categoryFilter?: QuizCategory,
): ShuffledQuizQuestion | null {
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

  return shuffleChoices(shuffle(pool)[0]);
}
