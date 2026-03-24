import type { DifficultyLevel } from '@/types';
import type { Locale } from '@/locales';
import { shuffle } from '@/lib/utils';
import { WORD_QUESTIONS, type WordQuestion } from './words';
import { LEVEL_CONFIG } from './config';

// Lazy-loaded English words
let enWords: WordQuestion[] | null = null;
function getEnWords(): WordQuestion[] {
  if (!enWords) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      enWords = require('./words.en').EN_WORD_QUESTIONS;
    } catch {
      enWords = [];
    }
  }
  return enWords!;
}

function getWordPool(locale: Locale): WordQuestion[] {
  return locale === 'en' ? getEnWords() : WORD_QUESTIONS;
}

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

export function getQuestion(
  difficulty: DifficultyLevel,
  usedIds: Set<string>,
  locale: Locale = 'fr',
): ShuffledQuestion | null {
  const config = LEVEL_CONFIG[difficulty];
  const allWords = getWordPool(locale);
  const pool = allWords.filter(
    (q) => q.difficulty === config.wordDifficulty && !usedIds.has(q.word),
  );

  if (pool.length === 0) {
    // Fallback: any difficulty, not yet used
    const fallback = allWords.filter((q) => !usedIds.has(q.word));
    if (fallback.length === 0) return null;
    return shuffleOptions(shuffle(fallback)[0]);
  }

  return shuffleOptions(shuffle(pool)[0]);
}
