import type { DifficultyLevel } from '@/types';
import { randomInt, shuffle } from '@/lib/utils';
import { LEVEL_CONFIG } from './config';

export interface SortPuzzle {
  items: { value: string; sortKey: number }[];
  correctOrder: number[]; // indices in correct order
  instruction: string;
  reverse: boolean;
}

const MONTHS = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

export function generatePuzzle(difficulty: DifficultyLevel): SortPuzzle {
  const config = LEVEL_CONFIG[difficulty];
  const reverse = config.allowReverse && Math.random() > 0.5;

  let items: { value: string; sortKey: number }[];
  let instruction: string;

  if (config.type === 'mixed' && Math.random() > 0.5) {
    // Sort months
    const startIdx = randomInt(0, 12 - config.itemCount);
    const monthIndices = Array.from({ length: config.itemCount }, (_, i) => startIdx + i);
    items = monthIndices.map((idx) => ({
      value: MONTHS[idx],
      sortKey: idx,
    }));
    instruction = reverse ? 'Ordre inverse des mois' : 'Ordre chronologique';
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
    instruction = reverse ? 'Ordre décroissant' : 'Ordre croissant';
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
