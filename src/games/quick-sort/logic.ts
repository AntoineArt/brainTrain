import type { DifficultyLevel } from '@/types';
import { randomInt, shuffle } from '@/lib/utils';
import { translate, type Locale } from '@/locales';
import { LEVEL_CONFIG } from './config';

export interface SortPuzzle {
  items: { value: string; sortKey: number }[];
  correctOrder: number[]; // indices in correct order
  instruction: string;
  reverse: boolean;
}

function getMonths(locale: Locale): string[] {
  return Array.from({ length: 12 }, (_, i) =>
    translate(locale, `month.${i + 1}` as Parameters<typeof translate>[1]),
  );
}

export function generatePuzzle(difficulty: DifficultyLevel, locale: Locale = 'fr'): SortPuzzle {
  const config = LEVEL_CONFIG[difficulty];
  const reverse = config.allowReverse && Math.random() > 0.5;

  let items: { value: string; sortKey: number }[];
  let instruction: string;

  if (config.type === 'mixed' && Math.random() > 0.5) {
    // Sort months
    const months = getMonths(locale);
    const startIdx = randomInt(0, 12 - config.itemCount);
    const monthIndices = Array.from({ length: config.itemCount }, (_, i) => startIdx + i);
    items = monthIndices.map((idx) => ({
      value: months[idx],
      sortKey: idx,
    }));
    instruction = reverse
      ? translate(locale, 'quickSort.reverseChronological')
      : translate(locale, 'quickSort.chronological');
  } else {
    // Sort numbers
    const numbers = new Set<number>();
    while (numbers.size < config.itemCount) {
      numbers.add(randomInt(1, 100));
    }
    items = [...numbers].sort((a, b) => a - b).map((n) => ({
      value: String(n),
      sortKey: n,
    }));
    instruction = reverse
      ? translate(locale, 'quickSort.descending')
      : translate(locale, 'quickSort.ascending');
  }

  // Correct order (before shuffling)
  const sorted = [...items].sort((a, b) =>
    reverse ? b.sortKey - a.sortKey : a.sortKey - b.sortKey,
  );

  // Shuffle items
  const shuffled = shuffle(items);

  // Map correct order to shuffled indices
  const correctOrder = sorted.map((s) => shuffled.indexOf(s));

  return { items: shuffled, correctOrder, instruction, reverse };
}

export function checkOrder(userOrder: number[], correctOrder: number[]): boolean {
  return userOrder.every((v, i) => v === correctOrder[i]);
}
