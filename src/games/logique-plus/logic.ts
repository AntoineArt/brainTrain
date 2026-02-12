import type { DifficultyLevel } from '@/types';
import { randomInt, shuffle } from '@/lib/utils';
import { LEVEL_CONFIG } from './config';

export interface LogicPuzzle {
  sequence: number[];
  answer: number;
  options: number[];
  correctIndex: number;
  rule: string;
}

export function generatePuzzle(difficulty: DifficultyLevel): LogicPuzzle {
  const config = LEVEL_CONFIG[difficulty];

  let sequence: number[];
  let answer: number;
  let rule: string;

  if (!config.doubleOperation || Math.random() > 0.5) {
    // Simple arithmetic sequence
    const start = randomInt(1, 50);
    const step = randomInt(2, config.maxStep) * (Math.random() > 0.3 ? 1 : -1);
    sequence = [];
    for (let i = 0; i < config.sequenceLength; i++) {
      sequence.push(start + step * i);
    }
    answer = start + step * config.sequenceLength;
    rule = `+${step}`;
  } else {
    // Alternating or multiplicative
    if (Math.random() > 0.5) {
      // Multiply pattern: x2, x3, etc.
      const multiplier = randomInt(2, 3);
      const start = randomInt(1, 5);
      sequence = [];
      let current = start;
      for (let i = 0; i < config.sequenceLength; i++) {
        sequence.push(current);
        current *= multiplier;
      }
      answer = current;
      rule = `×${multiplier}`;
    } else {
      // Alternating +a, +b
      const stepA = randomInt(1, config.maxStep);
      const stepB = randomInt(1, config.maxStep);
      const start = randomInt(1, 20);
      sequence = [start];
      for (let i = 1; i < config.sequenceLength; i++) {
        const prev = sequence[i - 1];
        sequence.push(prev + (i % 2 === 1 ? stepA : stepB));
      }
      const lastStep = config.sequenceLength % 2 === 1 ? stepA : stepB;
      answer = sequence[sequence.length - 1] + lastStep;
      rule = `+${stepA}/+${stepB}`;
    }
  }

  // Generate wrong options
  const wrongOptions = new Set<number>();
  while (wrongOptions.size < 3) {
    const offset = randomInt(1, 10) * (Math.random() > 0.5 ? 1 : -1);
    const wrong = answer + offset;
    if (wrong !== answer) wrongOptions.add(wrong);
  }

  const allOptions = [answer, ...wrongOptions];
  const shuffled = shuffle(allOptions);
  const correctIndex = shuffled.indexOf(answer);

  return {
    sequence,
    answer,
    options: shuffled,
    correctIndex,
    rule,
  };
}
