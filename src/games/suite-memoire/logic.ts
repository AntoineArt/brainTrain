import { randomInt } from '@/lib/utils';

export function generateSequence(gridSize: number, length: number): number[] {
  const totalCells = gridSize * gridSize;
  const sequence: number[] = [];
  for (let i = 0; i < length; i++) {
    let next: number;
    do {
      next = randomInt(0, totalCells - 1);
    } while (sequence.length > 0 && sequence[sequence.length - 1] === next);
    sequence.push(next);
  }
  return sequence;
}

export function checkSequence(expected: number[], userInput: number[]): boolean {
  if (expected.length !== userInput.length) return false;
  return expected.every((val, idx) => val === userInput[idx]);
}
