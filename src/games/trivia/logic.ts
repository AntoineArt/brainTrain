import type { DifficultyLevel } from '@/types';
import type { Locale } from '@/locales';
import { shuffle } from '@/lib/utils';
import { QUESTIONS, type QuizQuestion } from './questions';
import { LEVEL_CONFIG, type QuizCategory } from './config';

// Lazy-loaded English questions
let enQuestions: QuizQuestion[] | null = null;
function getEnQuestions(): QuizQuestion[] {
  if (!enQuestions) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      enQuestions = require('./questions.en').EN_QUESTIONS;
    } catch {
      enQuestions = [];
    }
  }
  return enQuestions!;
}

function getQuestionPool(locale: Locale): QuizQuestion[] {
  return locale === 'en' ? getEnQuestions() : QUESTIONS;
}

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
  locale: Locale = 'fr',
): ShuffledQuizQuestion | null {
  const config = LEVEL_CONFIG[difficulty];
  const allQuestions = getQuestionPool(locale);

  let pool = allQuestions.filter(
    (q) => q.difficulty === config.difficultyFilter && !usedIds.has(q.id),
  );

  if (categoryFilter) {
    pool = pool.filter((q) => q.category === categoryFilter);
  }

  if (pool.length === 0) {
    // Fallback: any difficulty not yet used
    pool = allQuestions.filter((q) => !usedIds.has(q.id));
    if (categoryFilter) {
      pool = pool.filter((q) => q.category === categoryFilter);
    }
  }

  if (pool.length === 0) return null;

  return shuffleChoices(shuffle(pool)[0]);
}
