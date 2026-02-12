import type { DifficultyLevel } from '@/types';
import { randomInt, randomPick, shuffle } from '@/lib/utils';
import { LEVEL_CONFIG } from './config';

export interface RotationPuzzle {
  shape: number[][]; // grid of 0/1
  rotatedShapes: number[][][]; // 4 options
  correctIndex: number;
  rotation: number; // degrees
}

function generateShape(complexity: number): number[][] {
  const size = complexity + 2; // 3x3, 4x4, or 5x5
  const grid: number[][] = Array.from({ length: size }, () =>
    Array(size).fill(0),
  );

  // Create an asymmetric L-like shape
  const cellCount = size + randomInt(1, size);
  const filled = new Set<string>();

  // Start from center
  let x = Math.floor(size / 2);
  let y = Math.floor(size / 2);
  grid[y][x] = 1;
  filled.add(`${x},${y}`);

  const directions = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ];

  while (filled.size < cellCount) {
    const [dx, dy] = randomPick(directions);
    const nx = x + dx;
    const ny = y + dy;
    if (nx >= 0 && nx < size && ny >= 0 && ny < size) {
      grid[ny][nx] = 1;
      filled.add(`${nx},${ny}`);
      x = nx;
      y = ny;
    }
  }

  return grid;
}

function rotateGrid90(grid: number[][]): number[][] {
  const size = grid.length;
  const rotated: number[][] = Array.from({ length: size }, () => Array(size).fill(0));
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      rotated[x][size - 1 - y] = grid[y][x];
    }
  }
  return rotated;
}

function reflectGrid(grid: number[][]): number[][] {
  return grid.map((row) => [...row].reverse());
}

function gridsEqual(a: number[][], b: number[][]): boolean {
  return a.every((row, y) => row.every((cell, x) => cell === b[y][x]));
}

export function generatePuzzle(difficulty: DifficultyLevel): RotationPuzzle {
  const config = LEVEL_CONFIG[difficulty];
  const shape = generateShape(config.complexity);

  // Choose rotation for the correct answer
  const rotations = [1, 2, 3]; // 90, 180, 270
  const rotationSteps = randomPick(rotations);
  let correctShape = shape;
  for (let i = 0; i < rotationSteps; i++) {
    correctShape = rotateGrid90(correctShape);
  }

  // Generate wrong answers using different rotations and reflections
  const options: number[][][] = [correctShape];
  const usedGrids = [correctShape];

  const tryAdd = (grid: number[][]) => {
    if (options.length >= 4) return;
    if (usedGrids.some((g) => gridsEqual(g, grid))) return;
    options.push(grid);
    usedGrids.push(grid);
  };

  // Add rotations of the original that aren't the correct answer
  for (let i = 0; i < 4; i++) {
    let rotated = shape;
    for (let j = 0; j < i; j++) rotated = rotateGrid90(rotated);
    if (i !== rotationSteps) tryAdd(rotated);
  }

  // Add reflections
  if (config.allowReflection) {
    tryAdd(reflectGrid(shape));
    tryAdd(reflectGrid(rotateGrid90(shape)));
  }

  // Fill remaining with random rotations of reflected shape
  while (options.length < 4) {
    const reflected = reflectGrid(shape);
    let rotated = reflected;
    for (let i = 0; i < randomInt(0, 3); i++) rotated = rotateGrid90(rotated);
    tryAdd(rotated);
    // Fallback: just duplicate to prevent infinite loop
    if (options.length < 4) {
      let extra = shape;
      for (let i = 0; i < randomInt(0, 3); i++) extra = rotateGrid90(extra);
      options.push(extra);
    }
  }

  const shuffled = shuffle(options.slice(0, 4));
  const correctIndex = shuffled.findIndex((g) => gridsEqual(g, correctShape));

  return {
    shape,
    rotatedShapes: shuffled,
    correctIndex: correctIndex >= 0 ? correctIndex : 0,
    rotation: rotationSteps * 90,
  };
}
