import type { DifficultyLevel } from '@/types';
import { randomInt, randomPick } from '@/lib/utils';
import { LEVEL_CONFIG, SHAPES, COLORS } from './config';

export interface IntrusItem {
  shape: string;
  color: string;
  size: number; // font size in px
  isIntrus: boolean;
}

export interface IntrusPuzzle {
  items: IntrusItem[];
  intrusIndex: number;
  gridSize: number;
}

type DifferenceType = 'color' | 'shape' | 'size';

export function generatePuzzle(difficulty: DifficultyLevel): IntrusPuzzle {
  const config = LEVEL_CONFIG[difficulty];
  const totalCells = config.gridSize * config.gridSize;
  const intrusIndex = randomInt(0, totalCells - 1);

  const baseShape = randomPick(SHAPES);
  const baseColor = randomPick(COLORS);
  const baseSize = 32;

  // Build list of allowed difference types from config
  const possibleDiffs: DifferenceType[] = [];
  if (config.colorDifference) possibleDiffs.push('color');
  if (config.shapeDifference) possibleDiffs.push('shape');
  if (config.sizeDifference) possibleDiffs.push('size');

  // Pick exactly one difference type at random
  const chosenDiff = randomPick(possibleDiffs);

  let intrusShape = baseShape;
  let intrusColor = baseColor;
  let intrusSize = baseSize;

  switch (chosenDiff) {
    case 'color':
      intrusColor = randomPick(COLORS.filter((c) => c !== baseColor));
      break;
    case 'shape':
      intrusShape = randomPick(SHAPES.filter((s) => s !== baseShape));
      break;
    case 'size':
      intrusSize = Math.random() > 0.5 ? 22 : 42;
      break;
  }

  const items: IntrusItem[] = Array.from({ length: totalCells }, (_, i) => {
    if (i === intrusIndex) {
      return { shape: intrusShape, color: intrusColor, size: intrusSize, isIntrus: true };
    }
    return { shape: baseShape, color: baseColor, size: baseSize, isIntrus: false };
  });

  return { items, intrusIndex, gridSize: config.gridSize };
}
