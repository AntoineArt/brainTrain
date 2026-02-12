import type { DifficultyLevel } from '@/types';
import { randomInt, randomPick } from '@/lib/utils';
import { LEVEL_CONFIG, type Operator } from './config';

export interface MathProblem {
  a: number;
  b: number;
  operator: Operator;
  answer: number;
  display: string;
}

export function generateProblem(difficulty: DifficultyLevel): MathProblem {
  const config = LEVEL_CONFIG[difficulty];
  const operator = randomPick(config.operators);

  let a: number;
  let b: number;
  let answer: number;

  switch (operator) {
    case '+':
      a = randomInt(config.minA, config.maxA);
      b = randomInt(config.minB, config.maxB);
      answer = a + b;
      break;
    case '-':
      // Ensure positive result
      b = randomInt(config.minB, config.maxB);
      a = randomInt(Math.max(config.minA, b), config.maxA);
      answer = a - b;
      break;
    case '×':
      a = randomInt(2, Math.min(config.maxA, 30));
      b = randomInt(2, Math.min(config.maxB, 15));
      answer = a * b;
      break;
    case '÷':
      // Generate division with integer result
      b = randomInt(2, Math.min(config.maxB, 12));
      answer = randomInt(2, Math.min(config.maxA / b, 20));
      a = b * answer;
      break;
    default:
      a = randomInt(config.minA, config.maxA);
      b = randomInt(config.minB, config.maxB);
      answer = a + b;
  }

  return {
    a,
    b,
    operator,
    answer,
    display: `${a} ${operator} ${b}`,
  };
}

export function checkAnswer(problem: MathProblem, userAnswer: number): boolean {
  return problem.answer === userAnswer;
}
