import type { DifficultyLevel } from '@/types';
import { randomInt, shuffle, randomPick } from '@/lib/utils';
import { LEVEL_CONFIG, SYMBOLS } from './config';

export interface CountPuzzle {
  grid: string[];
  gridSize: number;
  target: string;
  correctCount: number;
  options: number[];
  correctIndex: number;
}

export function generatePuzzle(difficulty: DifficultyLevel): CountPuzzle {
  const config = LEVEL_CONFIG[difficulty];
  const totalCells = config.gridSize * config.gridSize;

  // Pick symbols for this round
  const selectedSymbols = shuffle(SYMBOLS).slice(0, config.symbolCount);
  const target = selectedSymbols[0];

  // Place target symbol
  const targetCount = randomInt(config.targetCount.min, config.targetCount.max);
  const grid: string[] = [];

  // Fill grid
  for (let i = 0; i < totalCells; i++) {
    if (i < targetCount) {
      grid.push(target);
    } else {
      grid.push(randomPick(selectedSymbols.slice(1)));
    }
  }

  // Shuffle grid
  const shuffledGrid = shuffle(grid);

  // Generate options
  const wrongOptions = new Set<number>();
  wrongOptions.add(targetCount);
  while (wrongOptions.size < 4) {
    const offset = randomInt(1, 3) * (Math.random() > 0.5 ? 1 : -1);
    const wrong = Math.max(0, targetCount + offset);
    wrongOptions.add(wrong);
  }

  const options = shuffle([...wrongOptions]);
  const correctIndex = options.indexOf(targetCount);

  return {
    grid: shuffledGrid,
    gridSize: config.gridSize,
    target,
    correctCount: targetCount,
    options,
    correctIndex,
  };
}
