import type { DifficultyLevel } from '@/types';
import type { Locale } from '@/locales';
import { shuffle } from '@/lib/utils';
import { DEF_WORDS, type DefWord } from './words';
import { LEVEL_CONFIG } from './config';

// Lazy-loaded English definitions
let enDefWords: DefWord[] | null = null;
function getEnDefWords(): DefWord[] {
  if (!enDefWords) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      enDefWords = require('./words.en').EN_DEF_WORDS;
    } catch {
      enDefWords = [];
    }
  }
  return enDefWords!;
}

function getDefWordPool(locale: Locale): DefWord[] {
  return locale === 'en' ? getEnDefWords() : DEF_WORDS;
}

export interface DefQuestion {
  id: string;
  word: string;
  definition: string;
}

/** Strip diacritics and lowercase */
export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

/** Levenshtein edit distance */
export function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)),
  );

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }

  return dp[m][n];
}

/** Check if user input matches the expected word within tolerance */
export function checkAnswer(expected: string, userInput: string, maxLevenshtein: number): boolean {
  const normExpected = normalizeText(expected);
  const normInput = normalizeText(userInput.trim());

  if (normExpected === normInput) return true;

  return levenshtein(normExpected, normInput) <= maxLevenshtein;
}

/** Build a hint string with specific letter positions revealed */
export function buildHint(word: string, revealedIndices: Set<number>): string {
  return word
    .split('')
    .map((char, i) => {
      if (char === ' ' || char === '-' || char === '\'') return char;
      return revealedIndices.has(i) ? char : '_';
    })
    .join(' ');
}

/** Get random unrevealed index from word (skipping spaces, hyphens, apostrophes) */
export function getRandomUnrevealedIndex(word: string, revealedIndices: Set<number>): number | null {
  const candidates: number[] = [];
  for (let i = 0; i < word.length; i++) {
    const char = word[i];
    if (char !== ' ' && char !== '-' && char !== '\'' && !revealedIndices.has(i)) {
      candidates.push(i);
    }
  }
  if (candidates.length === 0) return null;
  return candidates[Math.floor(Math.random() * candidates.length)];
}

export function getQuestion(
  difficulty: DifficultyLevel,
  usedIds: Set<string>,
  locale: Locale = 'fr',
): DefQuestion | null {
  const config = LEVEL_CONFIG[difficulty];
  const allWords = getDefWordPool(locale);
  const pool = allWords.filter(
    (q) => q.difficulty === config.wordDifficulty && !usedIds.has(q.id),
  );

  if (pool.length === 0) {
    const fallback = allWords.filter((q) => !usedIds.has(q.id));
    if (fallback.length === 0) return null;
    const picked = shuffle(fallback)[0];
    return { id: picked.id, word: picked.word, definition: picked.definition };
  }

  const picked = shuffle(pool)[0];
  return { id: picked.id, word: picked.word, definition: picked.definition };
}
