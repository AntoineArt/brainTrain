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

export function generatePuzzle(difficulty: DifficultyLevel): IntrusPuzzle {
  const config = LEVEL_CONFIG[difficulty];
  const totalCells = config.gridSize * config.gridSize;
  const intrusIndex = randomInt(0, totalCells - 1);

  const baseShape = randomPick(SHAPES);
  const baseColor = randomPick(COLORS);
  const baseSize = 32;

  // Pick different attributes for the intrus
  let intrusShape = baseShape;
  let intrusColor = baseColor;
  let intrusSize = baseSize;

  if (config.shapeDifference && Math.random() > 0.5) {
    intrusShape = randomPick(SHAPES.filter((s) => s !== baseShape));
  } else if (config.colorDifference) {
    intrusColor = randomPick(COLORS.filter((c) => c !== baseColor));
  }

  if (config.sizeDifference && Math.random() > 0.6) {
    intrusSize = Math.random() > 0.5 ? 24 : 40;
    intrusShape = baseShape;
    intrusColor = baseColor;
  }

  const items: IntrusItem[] = Array.from({ length: totalCells }, (_, i) => {
    if (i === intrusIndex) {
      return { shape: intrusShape, color: intrusColor, size: intrusSize, isIntrus: true };
    }
    return { shape: baseShape, color: baseColor, size: baseSize, isIntrus: false };
  });

  return { items, intrusIndex, gridSize: config.gridSize };
}
